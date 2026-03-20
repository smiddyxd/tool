(() => {
  if (window.__localQueryBridgeInstalled) {
    return;
  }

  window.__localQueryBridgeInstalled = true;

  // ChatGPT DOM selectors to target the prompt field, file input, and send button.
  const PROMPT_TEXTAREA_SELECTOR = "#prompt-textarea";
  const SEND_BUTTON_SELECTOR = '[data-testid="send-button"]';
  const ATTACHMENT_INPUT_SELECTOR = 'input[type="file"]';

  // Fallback prompt template if the server does not send one.
  const BOILERPLATE_PROMPT = `The attached screenshot contains the current task page. First extract the exact Google search query shown in the screenshot. Then, for each semantically distinct component, provide a bullet point explaining what it is. Keep explanations as short as possible -- ideally just a label like "brand name" or "model nr" or "file format". Only expand if the term is niche, technical, or foreign-domain, in which case explain proportionally longer and in plainer language the more it relies on assumed background knowledge. For terms that require simplification, give the shortest explanation that captures the essential nature of the thing while still leaving someone unfamiliar with an accurate mental model.

Then, below the bullets, list the most plausible interpretations of the full query, each with an estimated likelihood percentage and a one-line description of what the user is probably trying to find.

Base everything strictly on the screenshot attachment.`;

  // Content-script timing settings for DOM availability, upload settling, and send-button activation.
  const MESSAGE_TYPE = "submitScreenshot";
  const SCROLL_MESSAGE_TYPE = "scrollChatGpt";
  const PING_MESSAGE_TYPE = "localQueryBridgePing";
  const ELEMENT_WAIT_TIMEOUT_MS = 10000;
  const ELEMENT_WAIT_INTERVAL_MS = 200;
  const ATTACHMENT_SETTLE_MS = 1500;
  const PROMPT_SETTLE_MS = 2000;
  const SCROLL_STEP_VIEWPORT_RATIO = 0.18;
  const SCROLL_EXECUTION_INTERVAL_MS = 180;
  const SEND_BUTTON_RETRY_COUNT = 20;
  const SEND_BUTTON_RETRY_DELAY_MS = 250;

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

  function setContentEditableValue(editor, value) {
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

  function dataUrlToFile(imageDataUrl, taskCount) {
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
    return new File([bytes], `task-${taskCount}.${extension}`, { type: mimeType });
  }

  async function attachScreenshotFile(file, editor) {
    const attachmentInput = document.querySelector(ATTACHMENT_INPUT_SELECTOR);
    if (attachmentInput instanceof HTMLInputElement) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      attachmentInput.files = dataTransfer.files;
      attachmentInput.dispatchEvent(new Event("change", { bubbles: true }));
      await delay(ATTACHMENT_SETTLE_MS);
      return;
    }

    const pasteData = new DataTransfer();
    pasteData.items.add(file);
    const pasteEvent = typeof ClipboardEvent === "function"
      ? new ClipboardEvent("paste", { bubbles: true, cancelable: true })
      : new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, "clipboardData", { value: pasteData });
    editor.dispatchEvent(pasteEvent);
    await delay(ATTACHMENT_SETTLE_MS);
  }

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

  async function submitScreenshot(imageDataUrl, taskCount, promptText) {
    const editor = await waitForElement(PROMPT_TEXTAREA_SELECTOR, ELEMENT_WAIT_TIMEOUT_MS);
    const screenshotFile = dataUrlToFile(imageDataUrl, taskCount);
    const prompt = typeof promptText === "string" && promptText.trim().length > 0
      ? promptText
      : BOILERPLATE_PROMPT;

    editor.focus();
    await attachScreenshotFile(screenshotFile, editor);
    populatePromptEditor(editor, prompt);

    const earliestSendAt = Date.now() + PROMPT_SETTLE_MS;
    console.log("Local Query Bridge prompt inserted; waiting before send", {
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

    if (message?.type !== MESSAGE_TYPE || typeof message.imageDataUrl !== "string") {
      return false;
    }

    sendResponse({ ok: true });

    void submitScreenshot(
      message.imageDataUrl,
      message.taskCount ?? 0,
      typeof message.promptText === "string" ? message.promptText : "",
    ).catch((error) => {
      console.error("Local Query Bridge submit failed", error);
    });

    return false;
  });
})();
