(() => {
  if (window.__localQueryBridgeInstalled) {
    return;
  }

  window.__localQueryBridgeInstalled = true;

  // ChatGPT DOM selectors to target the prompt field, file input, and send button.
  const PROMPT_TEXTAREA_SELECTOR = "#prompt-textarea";
  const SEND_BUTTON_SELECTOR = '[data-testid="send-button"]';
  const ATTACHMENT_INPUT_SELECTOR = 'input[type="file"]';
  const STOP_STREAMING_BUTTON_SELECTOR = '[data-testid="stop-button"], #composer-submit-button[aria-label="Stop streaming"]';
  const START_VOICE_BUTTON_SELECTOR = '[data-testid="composer-speech-button"][aria-label="Start Voice"]';
  const WEB_SEARCH_CHIP_SELECTOR = "button.__composer-pill";
  const WEB_SEARCH_MENU_ITEM_SELECTOR = '[role="menuitemradio"], [role="menuitemcheckbox"], [role="menuitem"]';
  const WEB_SEARCH_PILL_LABEL = "Search";
  const WEB_SEARCH_MENU_LABEL = "Web search";

  // Fallback prompt template if the server does not send one.
  const BOILERPLATE_PROMPT = `The attached screenshot contains the current task page. First extract the exact Google search query shown in the screenshot. Then, for each semantically distinct component, provide a bullet point explaining what it is. Keep explanations as short as possible -- ideally just a label like "brand name" or "model nr" or "file format". Only expand if the term is niche, technical, or foreign-domain, in which case explain proportionally longer and in plainer language the more it relies on assumed background knowledge. For terms that require simplification, give the shortest explanation that captures the essential nature of the thing while still leaving someone unfamiliar with an accurate mental model.

Then, below the bullets, list the most plausible interpretations of the full query, each with an estimated likelihood percentage and a one-line description of what the user is probably trying to find.

Base everything strictly on the screenshot attachment.`;

  // Content-script timing settings for DOM availability, upload settling, and send-button activation.
  const MESSAGE_TYPE = "submitScreenshot";
  const SUBMIT_TEXT_PROMPT_MESSAGE_TYPE = "submitTextPrompt";
  const SHOW_ALERT_MESSAGE_TYPE = "showBridgeAlert";
  const QUEUE_REPEAT_SCREENSHOT_MESSAGE_TYPE = "queueRepeatScreenshot";
  const SUBMIT_REPEAT_DRAFT_MESSAGE_TYPE = "submitRepeatDraft";
  const REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE = "repeatCaptureHotkey";
  const REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE = "repeatConfirmHotkey";
  const SCROLL_MESSAGE_TYPE = "scrollChatGpt";
  const PING_MESSAGE_TYPE = "localQueryBridgePing";
  const ELEMENT_WAIT_TIMEOUT_MS = 10000;
  const ELEMENT_WAIT_INTERVAL_MS = 200;
  const ATTACHMENT_INPUT_WAIT_TIMEOUT_MS = 4000;
  const WEB_SEARCH_WAIT_POLL_MS = 500;
  const WEB_SEARCH_ENABLE_WAIT_TIMEOUT_MS = 2500;
  const WEB_SEARCH_POST_ENABLE_SETTLE_MS = 250;
  const ATTACHMENT_SETTLE_MS = 1500;
  const PROMPT_SETTLE_MS = 2000;
  const RESPONSE_STATE_POLL_MS = 250;
  const RESPONSE_COMPLETE_TIMEOUT_MS = 300000;
  const SCROLL_STEP_VIEWPORT_RATIO = 0.18;
  const SCROLL_EXECUTION_INTERVAL_MS = 180;
  const SEND_BUTTON_RETRY_COUNT = 20;
  const SEND_BUTTON_RETRY_DELAY_MS = 250;
  const AUTO_SCROLL_MARKDOWN_CLASS = "markdown";
  const AUTO_SCROLL_TARGET_TEXT = "Rating: ";
  const AUTO_SCROLL_TARGET_OFFSET_PX = 0;

  function delay(milliseconds) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  const scrollState = {
    upCredits: 0,
    downCredits: 0,
    timerId: null,
  };

  const webSearchState = {
    routeKey: null,
    ensuredForRoute: false,
  };

  const autoScrollState = {
    runId: 0,
    userScrolled: false,
  };

  const MANUAL_SCROLL_KEYS = new Set([
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
    "Spacebar",
  ]);

  function isEditableTarget(target) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target.isContentEditable
      || Boolean(target.closest('input, textarea, [contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]'));
  }

  async function waitForElement(selector, timeoutMs) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }

      await delay(ELEMENT_WAIT_INTERVAL_MS);
    }

    throw new Error(`Timed out waiting for ${selector}`);
  }

  async function waitForOptionalElement(selector, timeoutMs) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }

      await delay(ELEMENT_WAIT_INTERVAL_MS);
    }

    return null;
  }

  function getCurrentRouteKey() {
    return `${window.location.pathname}${window.location.search}`;
  }

  function syncWebSearchStateWithRoute() {
    const routeKey = getCurrentRouteKey();
    if (webSearchState.routeKey !== routeKey) {
      webSearchState.routeKey = routeKey;
      webSearchState.ensuredForRoute = false;
    }
  }

  function markWebSearchEnsured() {
    webSearchState.routeKey = getCurrentRouteKey();
    webSearchState.ensuredForRoute = true;
  }

  function isElementVisible(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findVisibleWebSearchChip() {
    return Array.from(document.querySelectorAll(WEB_SEARCH_CHIP_SELECTOR)).find((element) => {
      if (!(element instanceof HTMLElement) || !isElementVisible(element)) {
        return false;
      }

      const labelText = element.textContent?.trim() ?? "";
      const ariaLabel = element.getAttribute("aria-label") ?? "";
      return labelText.includes(WEB_SEARCH_PILL_LABEL) || ariaLabel.includes(WEB_SEARCH_PILL_LABEL);
    }) ?? null;
  }

  function isWebSearchEnabled() {
    return findVisibleWebSearchChip() instanceof HTMLElement;
  }

  function isResponseGenerating() {
    return document.querySelector(STOP_STREAMING_BUTTON_SELECTOR) instanceof HTMLElement;
  }

  function isResponseIdle() {
    return document.querySelector(START_VOICE_BUTTON_SELECTOR) instanceof HTMLElement;
  }

  function noteManualScroll(source) {
    if (autoScrollState.runId === 0 || autoScrollState.userScrolled) {
      return;
    }

    autoScrollState.userScrolled = true;
    console.log("Local Query Bridge auto-scroll canceled by manual scroll", { source, runId: autoScrollState.runId });
  }

  function findVisibleWebSearchMenuItem() {
    return Array.from(document.querySelectorAll(WEB_SEARCH_MENU_ITEM_SELECTOR)).find((element) => {
      if (!(element instanceof HTMLElement) || !isElementVisible(element)) {
        return false;
      }

      return element.textContent?.trim().includes(WEB_SEARCH_MENU_LABEL);
    }) ?? null;
  }

  function dispatchKeyboardEvent(target, type, key, code) {
    const event = new KeyboardEvent(type, {
      key,
      code,
      keyCode: key === "Enter" ? 13 : key.toUpperCase().charCodeAt(0),
      which: key === "Enter" ? 13 : key.toUpperCase().charCodeAt(0),
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    target.dispatchEvent(event);
  }

  async function waitForWebSearchEnabled() {
    while (!isWebSearchEnabled()) {
      await delay(WEB_SEARCH_WAIT_POLL_MS);
    }

    await delay(WEB_SEARCH_POST_ENABLE_SETTLE_MS);
  }

  async function waitForWebSearchEnabledWithTimeout(timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (isWebSearchEnabled()) {
        return true;
      }
      await delay(WEB_SEARCH_WAIT_POLL_MS);
    }

    if (!isWebSearchEnabled()) {
      return false;
    }

    await delay(WEB_SEARCH_POST_ENABLE_SETTLE_MS);
    return true;
  }

  async function tryEnableWebSearchFromVisibleMenu() {
    const menuItem = findVisibleWebSearchMenuItem();
    if (!(menuItem instanceof HTMLElement)) {
      return false;
    }

    if (menuItem.getAttribute("aria-checked") === "true") {
      return await waitForWebSearchEnabledWithTimeout(WEB_SEARCH_ENABLE_WAIT_TIMEOUT_MS);
    }

    console.log("Local Query Bridge attempting web search enable from visible menu");
    menuItem.click();
    return await waitForWebSearchEnabledWithTimeout(WEB_SEARCH_ENABLE_WAIT_TIMEOUT_MS);
  }

  function dispatchEditorEvents(editor, value) {
    try {
      editor.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        composed: true,
        data: value,
        inputType: "insertText",
      }));
    } catch (_error) {
      editor.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    editor.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  function setTextareaValue(textarea, value) {
    const prototype = Object.getPrototypeOf(textarea);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

    if (descriptor?.set) {
      descriptor.set.call(textarea, value);
    } else {
      textarea.value = value;
    }

    dispatchEditorEvents(textarea, value);
  }

  function normalizeEditorText(value) {
    return (typeof value === "string" ? value : "")
      .replace(/\u00a0/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n+$/g, "");
  }

  function compactEditorText(value) {
    return normalizeEditorText(value).replace(/\s+/g, " ").trim();
  }

  function getEditorText(editor) {
    if (editor instanceof HTMLTextAreaElement) {
      return editor.value;
    }

    return editor.innerText ?? editor.textContent ?? "";
  }

  function selectEditorContents(editor) {
    editor.focus();

    const selection = window.getSelection();
    if (!selection) {
      return false;
    }

    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  function setContentEditableDomValue(editor, value) {
    editor.innerHTML = "";

    for (const line of value.split("\n")) {
      const paragraph = document.createElement("p");
      if (line.length > 0) {
        paragraph.textContent = line;
      } else {
        paragraph.appendChild(document.createElement("br"));
      }
      editor.appendChild(paragraph);
    }

    dispatchEditorEvents(editor, value);
  }

  function pasteContentEditableText(editor, value, expectedText) {
    if (!selectEditorContents(editor)) {
      return false;
    }

    try {
      const pasteData = new DataTransfer();
      pasteData.setData("text/plain", value);
      const pasteEvent = typeof ClipboardEvent === "function"
        ? new ClipboardEvent("paste", { bubbles: true, cancelable: true, composed: true })
        : new Event("paste", { bubbles: true, cancelable: true, composed: true });
      Object.defineProperty(pasteEvent, "clipboardData", { value: pasteData });
      editor.dispatchEvent(pasteEvent);
      dispatchEditorEvents(editor, value);
      return compactEditorText(getEditorText(editor)) === expectedText;
    } catch (_error) {
      return false;
    }
  }

  function setContentEditableValue(editor, value) {
    const expectedText = compactEditorText(value);

    if (selectEditorContents(editor)) {
      try {
        if (document.execCommand("insertText", false, value)) {
          dispatchEditorEvents(editor, value);
          if (compactEditorText(getEditorText(editor)) === expectedText) {
            return;
          }
        }
      } catch (_error) {
        // Fall back to direct DOM replacement below.
      }
    }

    if (pasteContentEditableText(editor, value, expectedText)) {
      return;
    }

    setContentEditableDomValue(editor, value);
  }

  function populatePromptEditor(editor, value) {
    if (editor instanceof HTMLTextAreaElement) {
      setTextareaValue(editor, value);
      if (typeof editor.setSelectionRange === "function") {
        editor.setSelectionRange(value.length, value.length);
      }
      return;
    }

    setContentEditableValue(editor, value);
  }

  function normalizeImageDataUrls(rawValue) {
    if (Array.isArray(rawValue)) {
      return rawValue
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean);
    }

    if (typeof rawValue === "string" && rawValue.trim()) {
      return [rawValue.trim()];
    }

    return [];
  }

  function dataUrlToFile(imageDataUrl, taskCount, screenshotIndex) {
    const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid screenshot data URL");
    }

    const mimeType = match[1];
    const base64Value = match[2];
    const binaryString = atob(base64Value);
    const bytes = new Uint8Array(binaryString.length);
    for (let index = 0; index < binaryString.length; index += 1) {
      bytes[index] = binaryString.charCodeAt(index);
    }

    const extension = mimeType === "image/jpeg" ? "jpg" : "png";
    const suffix = Number.isInteger(screenshotIndex) ? `-${screenshotIndex + 1}` : "";
    return new File([bytes], `task-${taskCount}${suffix}.${extension}`, { type: mimeType });
  }

  async function ensureWebSearchEnabled() {
    syncWebSearchStateWithRoute();
    if (webSearchState.ensuredForRoute && isWebSearchEnabled()) {
      return;
    }

    if (isWebSearchEnabled()) {
      console.log("Local Query Bridge web search already enabled");
      markWebSearchEnsured();
      return;
    }

    const enabledFromVisibleMenu = await tryEnableWebSearchFromVisibleMenu();
    if (enabledFromVisibleMenu) {
      console.log("Local Query Bridge enabled web search from visible menu");
      markWebSearchEnsured();
      return;
    }

    console.log("Local Query Bridge waiting for manual web search activation");
    await waitForWebSearchEnabled();
    console.log("Local Query Bridge detected manual web search activation");
    markWebSearchEnsured();
  }

  async function attachScreenshotFiles(files, editor) {
    for (const file of files) {
      const attachmentInput = await waitForOptionalElement(ATTACHMENT_INPUT_SELECTOR, ATTACHMENT_INPUT_WAIT_TIMEOUT_MS);
      if (attachmentInput instanceof HTMLInputElement) {
        console.log("Local Query Bridge attaching screenshot via file input", { name: file.name, size: file.size });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        attachmentInput.files = dataTransfer.files;
        attachmentInput.dispatchEvent(new Event("change", { bubbles: true }));
        await delay(ATTACHMENT_SETTLE_MS);
        continue;
      }

      console.log("Local Query Bridge attaching screenshot via paste fallback", { name: file.name, size: file.size });
      const pasteData = new DataTransfer();
      pasteData.items.add(file);
      const pasteEvent = typeof ClipboardEvent === "function"
        ? new ClipboardEvent("paste", { bubbles: true, cancelable: true })
        : new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", { value: pasteData });
      editor.dispatchEvent(pasteEvent);
      await delay(ATTACHMENT_SETTLE_MS);
    }
  }

  function normalizeSearchText(value) {
    return (typeof value === "string" ? value : "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function getNextAutoScrollTarget() {
    const markdownRoot = document.getElementsByClassName(AUTO_SCROLL_MARKDOWN_CLASS)[0];
    if (!(markdownRoot instanceof HTMLElement)) {
      return null;
    }

    const targetText = normalizeSearchText(AUTO_SCROLL_TARGET_TEXT);
    const candidates = Array.from(markdownRoot.querySelectorAll("*")).filter((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      const elementText = normalizeSearchText(element.innerText || element.textContent || "");
      if (!elementText.includes(targetText)) {
        return false;
      }

      return !Array.from(element.children).some((child) => {
        if (!(child instanceof HTMLElement)) {
          return false;
        }

        const childText = normalizeSearchText(child.innerText || child.textContent || "");
        return childText.includes(targetText);
      });
    });

    let nextTarget = null;
    let nextTop = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      if (rect.top <= 0) {
        continue;
      }

      if (rect.top < nextTop) {
        nextTop = rect.top;
        nextTarget = candidate;
      }
    }

    return nextTarget;
  }

  function applyAutoScrollOffset(offsetPx) {
    if (!Number.isFinite(offsetPx) || offsetPx === 0) {
      return;
    }

    const target = getScrollTarget();
    if (target instanceof HTMLElement) {
      target.scrollTop += offsetPx;
      return;
    }

    window.scrollBy({ top: offsetPx, left: 0, behavior: "auto" });
  }

  function scrollToNextPositionRationaleNow() {
    const nextTarget = getNextAutoScrollTarget();
    if (!(nextTarget instanceof HTMLElement)) {
      console.log("Local Query Bridge found no auto-scroll target", {
        rootClass: AUTO_SCROLL_MARKDOWN_CLASS,
        targetText: AUTO_SCROLL_TARGET_TEXT,
      });
      return false;
    }

    nextTarget.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "auto",
    });
    applyAutoScrollOffset(AUTO_SCROLL_TARGET_OFFSET_PX);

    console.log("Local Query Bridge auto-scrolled to target text", {
      tagName: nextTarget.tagName,
      targetText: AUTO_SCROLL_TARGET_TEXT,
      textSnippet: normalizeSearchText(nextTarget.innerText || nextTarget.textContent || "").slice(0, 80),
    });
    return true;
  }

  async function watchResponseCompletionAndAutoScroll(runId) {
    const deadline = Date.now() + RESPONSE_COMPLETE_TIMEOUT_MS;
    let sawGenerating = false;

    console.log("Local Query Bridge watching response completion", { runId });
    while (Date.now() < deadline && autoScrollState.runId === runId) {
      if (isResponseGenerating()) {
        sawGenerating = true;
      } else if (sawGenerating && isResponseIdle()) {
        if (!autoScrollState.userScrolled) {
          scrollToNextPositionRationaleNow();
        } else {
          console.log("Local Query Bridge skipped auto-scroll after completion", { runId });
        }
        if (autoScrollState.runId === runId) {
          autoScrollState.runId = 0;
        }
        return;
      }

      await delay(RESPONSE_STATE_POLL_MS);
    }

    if (autoScrollState.runId === runId) {
      autoScrollState.runId = 0;
    }
  }

  function startAutoScrollWatch() {
    autoScrollState.runId += 1;
    autoScrollState.userScrolled = false;
    const runId = autoScrollState.runId;
    void watchResponseCompletionAndAutoScroll(runId);
  }

  window.addEventListener("wheel", () => {
    noteManualScroll("wheel");
  }, { passive: true });

  window.addEventListener("touchmove", () => {
    noteManualScroll("touchmove");
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (event.repeat) {
      return;
    }

    if (event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      void chrome.runtime.sendMessage({ type: REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE });
      return;
    }

    if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && event.code === "Space" && !isEditableTarget(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      void chrome.runtime.sendMessage({ type: REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE });
      return;
    }

    if (MANUAL_SCROLL_KEYS.has(event.key)) {
      noteManualScroll(`key:${event.key}`);
    }
  }, true);

  function getScrollTarget() {
    const candidates = [
      document.querySelector("main"),
      document.querySelector('[role="main"]'),
      document.scrollingElement,
      document.documentElement,
      document.body,
      ...Array.from(document.querySelectorAll("div, main, section, article")),
    ].filter(Boolean);

    let bestTarget = null;
    let bestRange = 0;

    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }

      const style = window.getComputedStyle(candidate);
      const overflowY = style.overflowY;
      const canScroll = ["auto", "scroll", "overlay"].includes(overflowY) || candidate === document.scrollingElement || candidate === document.documentElement || candidate === document.body;
      const scrollRange = candidate.scrollHeight - candidate.clientHeight;
      if (!canScroll || scrollRange <= 0) {
        continue;
      }

      if (scrollRange > bestRange) {
        bestRange = scrollRange;
        bestTarget = candidate;
      }
    }

    return bestTarget;
  }

  function applyScrollStep(direction) {
    const target = getScrollTarget();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    const perStepDistance = Math.max(viewportHeight * SCROLL_STEP_VIEWPORT_RATIO, 60);
    const requestedOffset = perStepDistance * (direction === "up" ? -1 : 1);

    if (target instanceof HTMLElement) {
      const currentScrollTop = target.scrollTop;
      const maxScrollTop = Math.max(0, target.scrollHeight - target.clientHeight);
      const nextScrollTop = Math.max(0, Math.min(maxScrollTop, currentScrollTop + requestedOffset));
      target.scrollTop = nextScrollTop;
      console.log("Local Query Bridge applied scroll", {
        direction,
        target: target.tagName,
        requestedOffset,
        appliedOffset: nextScrollTop - currentScrollTop,
        currentScrollTop,
        nextScrollTop,
        maxScrollTop,
      });
      return;
    }

    const root = document.scrollingElement || document.documentElement || document.body;
    const currentScrollTop = root ? root.scrollTop : window.scrollY;
    const maxScrollTop = root ? Math.max(0, root.scrollHeight - root.clientHeight) : currentScrollTop;
    const nextScrollTop = Math.max(0, Math.min(maxScrollTop, currentScrollTop + requestedOffset));
    window.scrollTo({ top: nextScrollTop, left: 0, behavior: "auto" });
    console.log("Local Query Bridge applied scroll", {
      direction,
      target: "window",
      requestedOffset,
      appliedOffset: nextScrollTop - currentScrollTop,
      currentScrollTop,
      nextScrollTop,
      maxScrollTop,
    });
  }

  function drainOneScrollCredit() {
    if (scrollState.upCredits <= 0 && scrollState.downCredits <= 0) {
      if (scrollState.timerId !== null) {
        window.clearInterval(scrollState.timerId);
        scrollState.timerId = null;
      }
      return;
    }

    if (scrollState.downCredits > 0) {
      scrollState.downCredits -= 1;
      applyScrollStep("down");
      return;
    }

    if (scrollState.upCredits > 0) {
      scrollState.upCredits -= 1;
      applyScrollStep("up");
    }
  }

  function ensureScrollLoop() {
    if (scrollState.timerId !== null) {
      return;
    }

    scrollState.timerId = window.setInterval(drainOneScrollCredit, SCROLL_EXECUTION_INTERVAL_MS);
  }

  function queueScroll(direction, steps = 1) {
    const credits = Math.max(1, Number.isFinite(steps) ? steps : 1);
    if (direction === "down") {
      const cancelled = Math.min(scrollState.upCredits, credits);
      scrollState.upCredits -= cancelled;
      scrollState.downCredits += credits - cancelled;
    } else if (direction === "up") {
      const cancelled = Math.min(scrollState.downCredits, credits);
      scrollState.downCredits -= cancelled;
      scrollState.upCredits += credits - cancelled;
    } else {
      return;
    }

    ensureScrollLoop();
  }

  async function clickSendWhenReady(taskCount) {
    const earliestSendAt = Date.now() + PROMPT_SETTLE_MS;
    console.log("Local Query Bridge waiting before send", {
      promptSettleMs: PROMPT_SETTLE_MS,
      taskCount,
    });

    for (let attempt = 0; attempt < SEND_BUTTON_RETRY_COUNT; attempt += 1) {
      const remainingDelayMs = earliestSendAt - Date.now();
      if (remainingDelayMs > 0) {
        await delay(remainingDelayMs);
      }

      const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
      if (sendButton instanceof HTMLButtonElement && !sendButton.disabled) {
        console.log("Local Query Bridge clicking send", { taskCount, attempt });
        sendButton.click();
        startAutoScrollWatch();
        return;
      }

      await delay(SEND_BUTTON_RETRY_DELAY_MS);
    }

    throw new Error("Send button did not become clickable");
  }

  async function queueRepeatScreenshotDraft(imageDataUrls, taskCount) {
    const normalizedImageDataUrls = normalizeImageDataUrls(imageDataUrls);
    console.log("Local Query Bridge received repeat screenshot request", {
      taskCount,
      screenshotCount: normalizedImageDataUrls.length,
    });
    const editor = await waitForElement(PROMPT_TEXTAREA_SELECTOR, ELEMENT_WAIT_TIMEOUT_MS);
    const screenshotFiles = normalizedImageDataUrls.map((imageDataUrl, screenshotIndex) => (
      dataUrlToFile(imageDataUrl, taskCount, screenshotIndex)
    ));

    editor.focus();
    await attachScreenshotFiles(screenshotFiles, editor);
    console.log("Local Query Bridge queued repeat screenshots in draft", {
      taskCount,
      screenshotCount: screenshotFiles.length,
    });
  }

  async function submitPromptOnly(taskCount, promptText) {
    console.log("Local Query Bridge received prompt-only submit request", {
      taskCount,
      promptLength: typeof promptText === "string" ? promptText.length : 0,
    });
    const prompt = typeof promptText === "string" && promptText.trim().length > 0
      ? promptText
      : BOILERPLATE_PROMPT;

    await ensureWebSearchEnabled();
    const editor = await waitForElement(PROMPT_TEXTAREA_SELECTOR, ELEMENT_WAIT_TIMEOUT_MS);
    editor.focus();
    populatePromptEditor(editor, prompt);
    await clickSendWhenReady(taskCount);
  }

  async function submitRepeatDraft(taskCount, promptText) {
    await submitPromptOnly(taskCount, promptText);
  }

  function showNativeAlert(taskCount, alertText) {
    const normalizedAlertText = typeof alertText === "string" && alertText.trim().length > 0
      ? alertText.trim()
      : `Local Query Bridge alert for task ${taskCount}`;
    window.alert(normalizedAlertText);
  }

  async function submitScreenshot(imageDataUrls, taskCount, promptText) {
    const normalizedImageDataUrls = normalizeImageDataUrls(imageDataUrls);
    console.log("Local Query Bridge received submit request", {
      taskCount,
      promptLength: typeof promptText === "string" ? promptText.length : 0,
      screenshotCount: normalizedImageDataUrls.length,
    });
    const screenshotFiles = normalizedImageDataUrls.map((imageDataUrl, screenshotIndex) => (
      dataUrlToFile(imageDataUrl, taskCount, screenshotIndex)
    ));
    const prompt = typeof promptText === "string" && promptText.trim().length > 0
      ? promptText
      : BOILERPLATE_PROMPT;

    console.log("Local Query Bridge ensuring web search before inserting prompt", {
      taskCount,
      promptSettleMs: PROMPT_SETTLE_MS,
      screenshotCount: screenshotFiles.length,
    });
    await ensureWebSearchEnabled();
    const editor = await waitForElement(PROMPT_TEXTAREA_SELECTOR, ELEMENT_WAIT_TIMEOUT_MS);
    editor.focus();
    populatePromptEditor(editor, prompt);
    await attachScreenshotFiles(screenshotFiles, editor);

    const earliestSendAt = Date.now() + PROMPT_SETTLE_MS;
    console.log("Local Query Bridge waiting before send", {
      promptSettleMs: PROMPT_SETTLE_MS,
      taskCount,
    });

    for (let attempt = 0; attempt < SEND_BUTTON_RETRY_COUNT; attempt += 1) {
      const remainingDelayMs = earliestSendAt - Date.now();
      if (remainingDelayMs > 0) {
        await delay(remainingDelayMs);
      }

      const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
      if (sendButton instanceof HTMLButtonElement && !sendButton.disabled) {
        console.log("Local Query Bridge clicking send", { taskCount, attempt });
        sendButton.click();
        startAutoScrollWatch();
        return;
      }

      await delay(SEND_BUTTON_RETRY_DELAY_MS);
    }

    throw new Error("Send button did not become clickable");
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === PING_MESSAGE_TYPE) {
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === SCROLL_MESSAGE_TYPE) {
      queueScroll(message.direction, Number.isFinite(message.steps) ? message.steps : 1);
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === QUEUE_REPEAT_SCREENSHOT_MESSAGE_TYPE) {
      const imageDataUrls = normalizeImageDataUrls(message?.imageDataUrls ?? message?.imageDataUrl);
      if (imageDataUrls.length === 0) {
        sendResponse({ ok: false });
        return false;
      }

      sendResponse({ ok: true });
      void queueRepeatScreenshotDraft(imageDataUrls, message.taskCount ?? 0).catch((error) => {
        console.error("Local Query Bridge repeat screenshot queue failed", error);
      });
      return false;
    }

    if (message?.type === SUBMIT_REPEAT_DRAFT_MESSAGE_TYPE) {
      sendResponse({ ok: true });
      void submitRepeatDraft(
        message.taskCount ?? 0,
        typeof message.promptText === "string" ? message.promptText : "",
      ).catch((error) => {
        console.error("Local Query Bridge repeat draft submit failed", error);
      });
      return false;
    }

    if (message?.type === SUBMIT_TEXT_PROMPT_MESSAGE_TYPE) {
      console.log("Local Query Bridge content script got text prompt message", {
        taskCount: message.taskCount ?? 0,
        promptLength: typeof message.promptText === "string" ? message.promptText.length : 0,
      });
      sendResponse({ ok: true });
      void submitPromptOnly(
        message.taskCount ?? 0,
        typeof message.promptText === "string" ? message.promptText : "",
      ).catch((error) => {
        console.error("Local Query Bridge text prompt submit failed", error);
      });
      return false;
    }

    if (message?.type === SHOW_ALERT_MESSAGE_TYPE) {
      console.log("Local Query Bridge content script got alert message", {
        taskCount: message.taskCount ?? 0,
        alertLength: typeof message.alertText === "string" ? message.alertText.length : 0,
      });
      sendResponse({ ok: true });
      window.setTimeout(() => {
        try {
          showNativeAlert(
            message.taskCount ?? 0,
            typeof message.alertText === "string" ? message.alertText : "",
          );
        } catch (error) {
          console.error("Local Query Bridge alert display failed", error);
        }
      }, 0);
      return false;
    }

    const imageDataUrls = normalizeImageDataUrls(message?.imageDataUrls ?? message?.imageDataUrl);
    if (message?.type !== MESSAGE_TYPE || imageDataUrls.length === 0) {
      return false;
    }

    console.log("Local Query Bridge content script got screenshot message", {
      taskCount: message.taskCount ?? 0,
      promptLength: typeof message.promptText === "string" ? message.promptText.length : 0,
      screenshotCount: imageDataUrls.length,
    });
    sendResponse({ ok: true });

    void submitScreenshot(
      imageDataUrls,
      message.taskCount ?? 0,
      typeof message.promptText === "string" ? message.promptText : "",
    ).catch((error) => {
      console.error("Local Query Bridge submit failed", error);
    });

    return false;
  });
})();
