// Bridge endpoint exposed by the Python service. Set this to the LAN IP of the PC running the Python bridge.
const BRIDGE_BASE_URL = "http://192.168.0.215:62041";
const LOCAL_EVENT_URL = `${BRIDGE_BASE_URL}/a`;
const REPEAT_CAPTURE_URL = `${BRIDGE_BASE_URL}/b`;

// Poll cadence for the Chrome alarm. Unpacked extensions can use sub-30s alarms.
const POLL_ALARM_NAME = "poll-local-query-bridge";
const POLL_PERIOD_MINUTES = 0.005;
const FAST_SCROLL_REPOLL_DELAY_MS = 100;
const ENABLE_SCROLL_BRIDGE = false;

// Shared single-byte XOR key used by the Python service.
const XOR_KEY = 0x5a;
const HANDSHAKE_LOG_INTERVAL_MS = 10000;

// Event types emitted by the Python service.
const EVENT_TYPE_TASK = "task";
const EVENT_TYPE_TEXT_TASK = "text_task";
const EVENT_TYPE_SCROLL = "scroll";
const EVENT_TYPE_REPEAT = "repeat";

// Extension settings persisted through the options page.
const DEFAULT_START_PAGE_URL = "https://chatgpt.com/g/g-p-69bc1388b0588191bd1c176e83f018e4-rating/project";
const DEFAULT_RESET_LIMIT = 0;
const STORAGE_KEY_START_PAGE_URL = "defaultStartPageUrl";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";
const STORAGE_KEY_TAB_COUNTS = "tabSubmissionCounts";
const STORAGE_KEY_TAB_PROMPT_SLOTS = "tabPromptSlots";

// ChatGPT tab matching and content-script injection settings.
const CHATGPT_URL_PATTERNS = ["https://chat.openai.com/*", "https://chatgpt.com/*"];
const CONTENT_SCRIPT_FILE = "content_script.js";
const CONTENT_SCRIPT_PING_TYPE = "localQueryBridgePing";
const CONTENT_SCRIPT_SUBMIT_TEXT_TYPE = "submitTextPrompt";
const CONTENT_SCRIPT_QUEUE_REPEAT_TYPE = "queueRepeatScreenshot";
const CONTENT_SCRIPT_SUBMIT_REPEAT_TYPE = "submitRepeatDraft";
const REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE = "repeatCaptureHotkey";
const REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE = "repeatConfirmHotkey";
const REQUEST_TIMEOUT_MS = 5000;
const NEW_TAB_READY_TIMEOUT_MS = 20000;
const MAX_EVENTS_PER_POLL = 10;

const state = {
  isPolling: false,
  pendingSubmission: null,
  pendingRepeatDraft: null,
  lastHandshakeLogAt: 0,
  lastChatGptTabId: null,
};

function createPollingAlarm() {
  chrome.alarms.create(POLL_ALARM_NAME, { periodInMinutes: POLL_PERIOD_MINUTES });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function maybeLogHandshake() {
  const now = Date.now();
  if (now - state.lastHandshakeLogAt < HANDSHAKE_LOG_INTERVAL_MS) {
    return;
  }

  state.lastHandshakeLogAt = now;
  console.log("Local Query Bridge handshake");
}

function xorDecryptHex(hexValue, key) {
  if (!hexValue || hexValue.length % 2 !== 0) {
    return "";
  }

  let output = "";
  for (let index = 0; index < hexValue.length; index += 2) {
    const byte = Number.parseInt(hexValue.slice(index, index + 2), 16);
    if (Number.isNaN(byte)) {
      return "";
    }

    output += String.fromCharCode(byte ^ key);
  }

  return output;
}

function base64ToBytes(base64Value) {
  const binaryString = atob(base64Value);
  const bytes = new Uint8Array(binaryString.length);
  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }
  return bytes;
}

function bytesToBase64(bytes) {
  let binaryString = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binaryString += String.fromCharCode(...chunk);
  }

  return btoa(binaryString);
}

function xorDecryptBase64(base64Value, key) {
  if (!base64Value) {
    return new Uint8Array(0);
  }

  const encryptedBytes = base64ToBytes(base64Value);
  const decryptedBytes = new Uint8Array(encryptedBytes.length);
  for (let index = 0; index < encryptedBytes.length; index += 1) {
    decryptedBytes[index] = encryptedBytes[index] ^ key;
  }

  return decryptedBytes;
}

function xorDecryptBase64ToDataUrl(base64Value, key, mimeType = "image/png") {
  if (!base64Value) {
    return "";
  }

  const decryptedBytes = xorDecryptBase64(base64Value, key);
  return `data:${mimeType};base64,${bytesToBase64(decryptedBytes)}`;
}

function xorDecryptBase64ToString(base64Value, key) {
  if (!base64Value) {
    return "";
  }

  const decryptedBytes = xorDecryptBase64(base64Value, key);
  return new TextDecoder().decode(decryptedBytes);
}

function normalizeImageDataUrls(rawValue) {
  if (Array.isArray(rawValue)) {
    return rawValue
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean)
      .map((value) => `data:image/png;base64,${value}`);
  }

  if (typeof rawValue === "string" && rawValue.trim()) {
    return [rawValue.trim()];
  }

  return [];
}

function isChatGptUrl(url) {
  return typeof url === "string" && CHATGPT_URL_PATTERNS.some((pattern) => {
    const prefix = pattern.replace("*", "");
    return url.startsWith(prefix);
  });
}

function sanitizeStartPageUrl(value) {
  const rawValue = typeof value === "string" ? value.trim() : "";
  if (!rawValue) {
    return DEFAULT_START_PAGE_URL;
  }

  try {
    const parsedUrl = new URL(rawValue);
    return parsedUrl.toString();
  } catch (_error) {
    return DEFAULT_START_PAGE_URL;
  }
}

function sanitizeResetLimit(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

function normalizePromptTexts(rawValue) {
  if (Array.isArray(rawValue)) {
    const prompts = rawValue
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
    return prompts.slice(0, 2);
  }

  if (typeof rawValue === "string") {
    const prompt = rawValue.trim();
    return prompt ? [prompt] : [];
  }

  return [];
}

function selectPromptForIndex(promptTexts, index) {
  if (!Array.isArray(promptTexts) || promptTexts.length === 0) {
    return "";
  }

  return promptTexts[Math.min(index, promptTexts.length - 1)] ?? "";
}

async function getOptions() {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
  });

  return {
    defaultStartPageUrl: sanitizeStartPageUrl(stored[STORAGE_KEY_START_PAGE_URL]),
    resetLimit: sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]),
  };
}

async function ensureDefaultOptions() {
  const options = await getOptions();
  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: options.defaultStartPageUrl,
    [STORAGE_KEY_RESET_LIMIT]: options.resetLimit,
  });
}

async function getTabSubmissionCounts() {
  const stored = await chrome.storage.local.get({
    [STORAGE_KEY_TAB_COUNTS]: {},
  });

  const counts = stored[STORAGE_KEY_TAB_COUNTS];
  return counts && typeof counts === "object" ? counts : {};
}

async function getTabSubmissionCount(tabId) {
  const counts = await getTabSubmissionCounts();
  return Number.parseInt(counts[String(tabId)] ?? 0, 10) || 0;
}

async function setTabSubmissionCount(tabId, count) {
  const counts = await getTabSubmissionCounts();
  counts[String(tabId)] = Math.max(0, Number.parseInt(count, 10) || 0);
  await chrome.storage.local.set({
    [STORAGE_KEY_TAB_COUNTS]: counts,
  });
}

async function incrementTabSubmissionCount(tabId) {
  const nextCount = (await getTabSubmissionCount(tabId)) + 1;
  await setTabSubmissionCount(tabId, nextCount);
  return nextCount;
}

async function clearTabSubmissionCount(tabId) {
  const counts = await getTabSubmissionCounts();
  delete counts[String(tabId)];
  await chrome.storage.local.set({
    [STORAGE_KEY_TAB_COUNTS]: counts,
  });
}

async function getTabPromptSlots() {
  const stored = await chrome.storage.local.get({
    [STORAGE_KEY_TAB_PROMPT_SLOTS]: {},
  });

  const slots = stored[STORAGE_KEY_TAB_PROMPT_SLOTS];
  return slots && typeof slots === "object" ? slots : {};
}

async function setTabPromptSlots(slots) {
  await chrome.storage.local.set({
    [STORAGE_KEY_TAB_PROMPT_SLOTS]: slots,
  });
}

async function clearTabPromptSlot(tabId) {
  const slots = await getTabPromptSlots();
  delete slots[String(tabId)];
  await setTabPromptSlots(slots);
}

function getSlotValue(slotMap, tabId) {
  const value = slotMap[String(tabId)];
  return Number.isInteger(value) ? value : Number.parseInt(`${value}`, 10);
}

async function getPreferredChatGptTab() {
  if (Number.isInteger(state.lastChatGptTabId)) {
    try {
      const knownTab = await chrome.tabs.get(state.lastChatGptTabId);
      if (knownTab?.id && isChatGptUrl(knownTab.url)) {
        return knownTab;
      }
    } catch (_error) {
      state.lastChatGptTabId = null;
    }
  }

  const tabs = await chrome.tabs.query({
    url: CHATGPT_URL_PATTERNS,
  });

  tabs.sort((left, right) => {
    const leftScore = (left.active ? 4 : 0) + (left.lastAccessed ?? 0);
    const rightScore = (right.active ? 4 : 0) + (right.lastAccessed ?? 0);
    return rightScore - leftScore;
  });

  const selectedTab = tabs[0] ?? null;
  if (selectedTab?.id) {
    state.lastChatGptTabId = selectedTab.id;
  }
  return selectedTab;
}

async function getActiveChatGptTabsAcrossWindows() {
  const tabs = await chrome.tabs.query({
    active: true,
    url: CHATGPT_URL_PATTERNS,
  });

  tabs.sort((left, right) => {
    const leftWindow = left.windowId ?? Number.MAX_SAFE_INTEGER;
    const rightWindow = right.windowId ?? Number.MAX_SAFE_INTEGER;
    if (leftWindow !== rightWindow) {
      return leftWindow - rightWindow;
    }

    const leftIndex = left.index ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.index ?? Number.MAX_SAFE_INTEGER;
    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return (left.id ?? Number.MAX_SAFE_INTEGER) - (right.id ?? Number.MAX_SAFE_INTEGER);
  });

  return tabs.filter((tab) => tab?.id);
}

async function waitForChatGptTabReady(tabId) {
  const deadline = Date.now() + NEW_TAB_READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (tab?.id && isChatGptUrl(tab.url) && tab.status === "complete") {
        return tab;
      }
    } catch (_error) {
      return null;
    }

    await delay(250);
  }

  throw new Error("Timed out waiting for the ChatGPT start page to load");
}

async function openFreshChatGptTab(windowId, startPageUrl) {
  const createOptions = {
    url: startPageUrl,
    active: true,
  };

  if (Number.isInteger(windowId)) {
    createOptions.windowId = windowId;
  }

  const createdTab = await chrome.tabs.create(createOptions);
  if (!createdTab?.id) {
    return null;
  }

  await setTabSubmissionCount(createdTab.id, 0);
  const readyTab = await waitForChatGptTabReady(createdTab.id);
  if (readyTab?.id) {
    state.lastChatGptTabId = readyTab.id;
    return readyTab;
  }

  return createdTab;
}

async function resetChatGptTab(tabId, startPageUrl) {
  const updatedTab = await chrome.tabs.update(tabId, {
    url: startPageUrl,
    active: true,
  });
  if (!updatedTab?.id) {
    return null;
  }

  await setTabSubmissionCount(updatedTab.id, 0);
  const readyTab = await waitForChatGptTabReady(updatedTab.id);
  if (readyTab?.id) {
    state.lastChatGptTabId = readyTab.id;
    return readyTab;
  }

  return updatedTab;
}

async function ensureContentScript(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: CONTENT_SCRIPT_PING_TYPE,
    });

    if (response?.ok === true) {
      return;
    }
  } catch (_error) {
    // No receiver yet, so the content script still needs to be injected.
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    files: [CONTENT_SCRIPT_FILE],
  });
}

async function sendToChatGpt(tabId, imageDataUrls, taskCount, promptText) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: "submitScreenshot",
    imageDataUrls,
    taskCount,
    promptText,
  });

  return response?.ok === true;
}

async function sendTextPromptToChatGpt(tabId, taskCount, promptText) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_SUBMIT_TEXT_TYPE,
    taskCount,
    promptText,
  });

  return response?.ok === true;
}

async function queueRepeatScreenshot(tabId, imageDataUrls, taskCount) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_QUEUE_REPEAT_TYPE,
    imageDataUrls,
    taskCount,
  });

  return response?.ok === true;
}

async function submitRepeatDraft(tabId, taskCount, promptText) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_SUBMIT_REPEAT_TYPE,
    taskCount,
    promptText,
  });

  return response?.ok === true;
}

async function sendScrollToChatGpt(tabId, direction, steps) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: "scrollChatGpt",
    direction,
    steps,
  });

  return response?.ok === true;
}

async function assignPromptTargets(baseTabs, promptTexts, logLabel) {
  const promptCount = Math.max(1, Array.isArray(promptTexts) && promptTexts.length > 0 ? promptTexts.length : 1);
  const slotMap = await getTabPromptSlots();
  let slotMapChanged = false;
  const liveTabs = await chrome.tabs.query({
    url: CHATGPT_URL_PATTERNS,
  });
  const liveTabIds = new Set(
    liveTabs
      .filter((tab) => tab?.id && isChatGptUrl(tab.url))
      .map((tab) => String(tab.id)),
  );
  for (const tabId of Object.keys(slotMap)) {
    if (!liveTabIds.has(tabId)) {
      delete slotMap[tabId];
      slotMapChanged = true;
    }
  }

  const reservedSlots = new Set();
  for (const value of Object.values(slotMap)) {
    const parsedValue = Number.isInteger(value) ? value : Number.parseInt(`${value}`, 10);
    if (Number.isInteger(parsedValue) && parsedValue >= 0) {
      reservedSlots.add(parsedValue);
    }
  }

  const activeTargetsBySlot = new Map();
  for (const tab of baseTabs) {
    const slot = getSlotValue(slotMap, tab.id);
    if (!Number.isInteger(slot) || slot < 0 || slot >= promptCount || activeTargetsBySlot.has(slot)) {
      continue;
    }

    activeTargetsBySlot.set(slot, tab);
  }

  const freeSlots = [];
  for (let slot = 0; slot < promptCount; slot += 1) {
    if (!reservedSlots.has(slot) && !activeTargetsBySlot.has(slot)) {
      freeSlots.push(slot);
    }
  }

  for (const tab of baseTabs) {
    if (freeSlots.length === 0) {
      break;
    }

    const slot = getSlotValue(slotMap, tab.id);
    if (Number.isInteger(slot) && slot >= 0) {
      continue;
    }

    const nextSlot = freeSlots.shift();
    if (!Number.isInteger(nextSlot)) {
      continue;
    }

    slotMap[String(tab.id)] = nextSlot;
    slotMapChanged = true;
    activeTargetsBySlot.set(nextSlot, tab);
  }

  if (slotMapChanged) {
    await setTabPromptSlots(slotMap);
  }

  const targets = [];
  for (let slot = 0; slot < promptCount; slot += 1) {
    const tab = activeTargetsBySlot.get(slot);
    if (!tab?.id) {
      continue;
    }

    targets.push({
      tabId: tab.id,
      promptText: selectPromptForIndex(promptTexts, slot),
    });
  }

  console.log(logLabel, {
    promptCount,
    activeTabs: baseTabs.map((tab) => tab?.id).filter(Number.isInteger),
    targets: targets.map((target) => target.tabId),
  });
  return targets;
}

async function buildSubmissionTargets(promptTexts) {
  const settings = await getOptions();
  let baseTabs = await getActiveChatGptTabsAcrossWindows();

  if (baseTabs.length === 0) {
    const preferredTab = await getPreferredChatGptTab();
    if (preferredTab?.id) {
      baseTabs = [preferredTab];
    }
  }

  if (baseTabs.length === 0) {
    const freshTab = await openFreshChatGptTab(undefined, settings.defaultStartPageUrl);
    if (freshTab?.id) {
      baseTabs = [freshTab];
    }
  }

  const resolvedTabs = [];

  for (const baseTab of baseTabs) {
    let tab = baseTab;
    if (!tab?.id) {
      continue;
    }

    if (settings.resetLimit > 0) {
      const submissionCount = await getTabSubmissionCount(tab.id);
      if (submissionCount >= settings.resetLimit) {
        const resetTab = await resetChatGptTab(tab.id, settings.defaultStartPageUrl);
        if (resetTab?.id) {
          tab = resetTab;
          console.log(`Local Query Bridge reset ChatGPT tab after ${submissionCount} prompt(s)`);
        }
      }
    }

    if (tab?.id) {
      resolvedTabs.push(tab);
    }
  }

  return assignPromptTargets(resolvedTabs, promptTexts, "Local Query Bridge resolved submission targets");
}

async function buildRepeatTargets(promptTexts) {
  let baseTabs = await getActiveChatGptTabsAcrossWindows();

  if (baseTabs.length === 0) {
    const preferredTab = await getPreferredChatGptTab();
    if (preferredTab?.id) {
      baseTabs = [preferredTab];
    }
  }

  const resolvedTabs = baseTabs.filter((tab) => tab?.id && isChatGptUrl(tab.url));
  return assignPromptTargets(resolvedTabs, promptTexts, "Local Query Bridge resolved repeat targets");
}

async function validateSubmissionTargets(targets) {
  const validTargets = [];
  for (const target of targets) {
    if (!Number.isInteger(target?.tabId)) {
      continue;
    }

    try {
      const tab = await chrome.tabs.get(target.tabId);
      if (tab?.id && isChatGptUrl(tab.url)) {
        validTargets.push({
          tabId: tab.id,
          promptText: typeof target.promptText === "string" ? target.promptText : "",
        });
      }
    } catch (_error) {
      // Tab disappeared; it will be recomputed if needed.
    }
  }
  return validTargets;
}

async function getOrCreatePendingTargets() {
  if (!state.pendingSubmission) {
    return [];
  }

  if (Array.isArray(state.pendingSubmission.targets) && state.pendingSubmission.targets.length > 0) {
    const validTargets = await validateSubmissionTargets(state.pendingSubmission.targets);
    if (validTargets.length > 0) {
      state.pendingSubmission.targets = validTargets;
      return validTargets;
    }
  }

  const nextTargets = await buildSubmissionTargets(state.pendingSubmission.promptTexts);
  state.pendingSubmission.targets = nextTargets;
  return nextTargets;
}

async function deliverPendingSubmission() {
  if (!state.pendingSubmission) {
    return;
  }

  const targets = await getOrCreatePendingTargets();
  if (targets.length === 0) {
    console.warn("Local Query Bridge has no eligible ChatGPT submission targets");
    return;
  }

  const { imageDataUrls, taskCount, submissionMode } = state.pendingSubmission;
  const isTextSubmission = submissionMode === EVENT_TYPE_TEXT_TASK;
  console.log(`Local Query Bridge delivering ${isTextSubmission ? "text prompt" : "screenshot"}`, {
    taskCount,
    screenshotCount: Array.isArray(imageDataUrls) ? imageDataUrls.length : 0,
    targets: targets.map((target) => target.tabId),
  });
  const results = await Promise.allSettled(
    targets.map((target) => (
      isTextSubmission
        ? sendTextPromptToChatGpt(target.tabId, taskCount, target.promptText)
        : sendToChatGpt(target.tabId, imageDataUrls, taskCount, target.promptText)
    )),
  );

  const failedTargets = [];
  let successfulCount = 0;

  for (let index = 0; index < targets.length; index += 1) {
    const result = results[index];
    const target = targets[index];
    if (result.status === "fulfilled" && result.value === true) {
      successfulCount += 1;
      state.lastChatGptTabId = target.tabId;
      await incrementTabSubmissionCount(target.tabId);
      continue;
    }

    failedTargets.push(target);
  }

  if (failedTargets.length === 0) {
    console.log(`Local Query Bridge submitted ${isTextSubmission ? "text prompt" : "screenshot"} to ChatGPT in ${successfulCount} tab(s)`);
    state.pendingSubmission = null;
    return;
  }

  console.warn("Local Query Bridge delivery left pending targets", failedTargets.map((target) => target.tabId));
  state.pendingSubmission.targets = failedTargets;
}

async function handleScrollEvent(direction, steps) {
  if (!ENABLE_SCROLL_BRIDGE) {
    return;
  }

  const tabs = await getActiveChatGptTabsAcrossWindows();
  if (tabs.length === 0) {
    return;
  }

  const results = await Promise.all(
    tabs.map(async (tab) => ({
      id: tab.id,
      ok: await sendScrollToChatGpt(tab.id, direction, steps),
    })),
  );

  const successfulTabs = results.filter((result) => result.ok === true);
  if (successfulTabs.length > 0) {
    state.lastChatGptTabId = successfulTabs[0].id;
    console.log(`Local Query Bridge scrolled ChatGPT ${direction} in ${successfulTabs.length} tab(s)`);
  }
}

async function fetchBridgePayload() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(LOCAL_EVENT_URL, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("Local Query Bridge poll response not ok", response.status);
      return null;
    }

    const payload = await response.json();
    maybeLogHandshake();
    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRepeatCapturePayload() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(REPEAT_CAPTURE_URL, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("Local Query Bridge repeat capture response not ok", response.status);
      return null;
    }

    const payload = await response.json();
    maybeLogHandshake();
    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getOrCreatePendingRepeatTargets(taskCount, promptTexts) {
  if (
    state.pendingRepeatDraft
    && state.pendingRepeatDraft.taskCount === taskCount
    && Array.isArray(state.pendingRepeatDraft.targets)
    && state.pendingRepeatDraft.targets.length > 0
  ) {
    const validTargets = await validateSubmissionTargets(state.pendingRepeatDraft.targets);
    if (validTargets.length > 0) {
      state.pendingRepeatDraft.targets = validTargets;
      return validTargets;
    }
  }

  return buildRepeatTargets(promptTexts);
}

async function handleRepeatCaptureRequest() {
  const payload = await fetchRepeatCapturePayload();
  if (!payload?.a || !payload?.b || !payload?.c || !payload?.e) {
    console.warn("Local Query Bridge repeat capture unavailable");
    return;
  }

  const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
  const taskCount = Number.parseInt(taskText, 10);
  const capturedImageDataUrl = xorDecryptBase64ToDataUrl(payload.b, XOR_KEY);
  const baseImageDataUrl = xorDecryptBase64ToDataUrl(payload.e, XOR_KEY);
  const promptPayload = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
  if (Number.isNaN(taskCount) || !capturedImageDataUrl || !baseImageDataUrl) {
    console.warn("Local Query Bridge repeat capture payload invalid");
    return;
  }

  let promptTexts = [];
  if (promptPayload) {
    try {
      promptTexts = normalizePromptTexts(JSON.parse(promptPayload));
    } catch (_error) {
      promptTexts = normalizePromptTexts(promptPayload);
    }
  }

  const existingDraft = state.pendingRepeatDraft;
  const targets = await getOrCreatePendingRepeatTargets(taskCount, promptTexts);
  if (targets.length === 0) {
    console.warn("Local Query Bridge has no eligible ChatGPT repeat targets");
    return;
  }

  const includeBaseScreenshot = !(existingDraft && existingDraft.taskCount === taskCount);
  const imageDataUrls = includeBaseScreenshot
    ? [baseImageDataUrl, capturedImageDataUrl]
    : [capturedImageDataUrl];
  const results = await Promise.allSettled(
    targets.map((target) => queueRepeatScreenshot(target.tabId, imageDataUrls, taskCount)),
  );

  const successfulTargets = [];
  for (let index = 0; index < targets.length; index += 1) {
    const result = results[index];
    const target = targets[index];
    if (result.status === "fulfilled" && result.value === true) {
      successfulTargets.push(target);
      state.lastChatGptTabId = target.tabId;
    }
  }

  if (successfulTargets.length === 0) {
    console.warn("Local Query Bridge failed to queue repeat screenshot in ChatGPT");
    return;
  }

  state.pendingRepeatDraft = {
    taskCount,
    promptTexts,
    targets: successfulTargets,
    captureCount: (existingDraft && existingDraft.taskCount === taskCount ? existingDraft.captureCount : 0) + 1,
  };
  console.log(`Local Query Bridge queued repeat screenshot in ${successfulTargets.length} tab(s)`, {
    taskCount,
    captureCount: state.pendingRepeatDraft.captureCount,
    attachedScreenshots: imageDataUrls.length,
  });
}

async function handleRepeatConfirmRequest() {
  if (!state.pendingRepeatDraft) {
    console.warn("Local Query Bridge has no pending repeat draft to confirm");
    return;
  }

  const validTargets = await validateSubmissionTargets(state.pendingRepeatDraft.targets);
  if (validTargets.length === 0) {
    console.warn("Local Query Bridge has no valid repeat draft targets");
    state.pendingRepeatDraft = null;
    return;
  }

  state.pendingRepeatDraft.targets = validTargets;
  const { taskCount, targets } = state.pendingRepeatDraft;
  const results = await Promise.allSettled(
    targets.map((target) => submitRepeatDraft(target.tabId, taskCount, target.promptText)),
  );

  const failedTargets = [];
  let successfulCount = 0;
  for (let index = 0; index < targets.length; index += 1) {
    const result = results[index];
    const target = targets[index];
    if (result.status === "fulfilled" && result.value === true) {
      successfulCount += 1;
      state.lastChatGptTabId = target.tabId;
      await incrementTabSubmissionCount(target.tabId);
      continue;
    }

    failedTargets.push(target);
  }

  if (failedTargets.length === 0) {
    console.log(`Local Query Bridge submitted repeat draft to ChatGPT in ${successfulCount} tab(s)`);
    state.pendingRepeatDraft = null;
    return;
  }

  console.warn("Local Query Bridge repeat draft left pending targets", failedTargets.map((target) => target.tabId));
  state.pendingRepeatDraft.targets = failedTargets;
}

async function pollLocalBridge() {
  if (state.isPolling) {
    return;
  }

  state.isPolling = true;
  let sawScrollEvent = false;

  try {
    if (state.pendingSubmission) {
      await deliverPendingSubmission();
      if (state.pendingSubmission) {
        return;
      }
    }

    for (let iteration = 0; iteration < MAX_EVENTS_PER_POLL; iteration += 1) {
      const payload = await fetchBridgePayload();
      if (!payload) {
        return;
      }

      const eventType = xorDecryptHex(payload?.d ?? "", XOR_KEY).trim();
      if (eventType === EVENT_TYPE_SCROLL) {
        if (!ENABLE_SCROLL_BRIDGE) {
          continue;
        }

        const direction = xorDecryptHex(payload.a ?? "", XOR_KEY).trim();
        const stepsText = xorDecryptHex(payload.b ?? "", XOR_KEY).trim();
        const steps = Number.parseInt(stepsText, 10);
        if ((direction === "up" || direction === "down") && !Number.isNaN(steps)) {
          sawScrollEvent = true;
          await handleScrollEvent(direction, steps);
          continue;
        }
        return;
      }

      if (eventType === EVENT_TYPE_TEXT_TASK) {
        if (!payload?.a) {
          return;
        }

        const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
        const taskCount = Number.parseInt(taskText, 10);
        const promptPayload = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
        let promptTexts = [];
        if (promptPayload) {
          try {
            promptTexts = normalizePromptTexts(JSON.parse(promptPayload));
          } catch (_error) {
            promptTexts = normalizePromptTexts(promptPayload);
          }
        }
        if (Number.isNaN(taskCount) || promptTexts.length === 0) {
          return;
        }

        console.log("Local Query Bridge retrieved new task text prompt", {
          taskCount,
          promptCount: promptTexts.length,
        });
        state.pendingRepeatDraft = null;
        state.pendingSubmission = {
          taskCount,
          promptTexts,
          targets: null,
          submissionMode: EVENT_TYPE_TEXT_TASK,
        };

        await deliverPendingSubmission();
        return;
      }

      if (!payload?.a || !payload?.b) {
        return;
      }

      const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
      const taskCount = Number.parseInt(taskText, 10);
      const imagePayload = xorDecryptBase64ToString(payload.b ?? "", XOR_KEY).trim();
      let imageDataUrls = [];
      if (imagePayload) {
        try {
          imageDataUrls = normalizeImageDataUrls(JSON.parse(imagePayload));
        } catch (_error) {
          imageDataUrls = normalizeImageDataUrls(xorDecryptBase64ToDataUrl(payload.b, XOR_KEY));
        }
      }
      const promptPayload = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
      if (Number.isNaN(taskCount) || imageDataUrls.length === 0) {
        return;
      }

      let promptTexts = [];
      if (promptPayload) {
        try {
          promptTexts = normalizePromptTexts(JSON.parse(promptPayload));
        } catch (_error) {
          promptTexts = normalizePromptTexts(promptPayload);
        }
      }

      console.log("Local Query Bridge retrieved new task screenshot", {
        taskCount,
        screenshotCount: imageDataUrls.length,
      });
      state.pendingRepeatDraft = null;
      state.pendingSubmission = {
        taskCount,
        imageDataUrls,
        promptTexts,
        targets: null,
        submissionMode: EVENT_TYPE_TASK,
      };

      await deliverPendingSubmission();
      return;
    }
  } catch (error) {
    console.warn("Local Query Bridge poll failed", error);
  } finally {
    state.isPolling = false;
    if (sawScrollEvent && !state.pendingSubmission) {
      setTimeout(() => {
        void pollLocalBridge();
      }, FAST_SCROLL_REPOLL_DELAY_MS);
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  void ensureDefaultOptions();
  createPollingAlarm();
  void pollLocalBridge();
});

chrome.runtime.onStartup.addListener(() => {
  void ensureDefaultOptions();
  createPollingAlarm();
  void pollLocalBridge();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== POLL_ALARM_NAME) {
    return;
  }

  void pollLocalBridge();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE) {
    void handleRepeatCaptureRequest()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        console.warn("Local Query Bridge repeat capture failed", error);
        sendResponse({ ok: false });
      });
    return true;
  }

  if (message?.type === REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE) {
    void handleRepeatConfirmRequest()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        console.warn("Local Query Bridge repeat confirm failed", error);
        sendResponse({ ok: false });
      });
    return true;
  }

  return false;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (state.lastChatGptTabId === tabId) {
    state.lastChatGptTabId = null;
  }

  if (Array.isArray(state.pendingSubmission?.targets)) {
    state.pendingSubmission.targets = state.pendingSubmission.targets.filter((target) => target.tabId !== tabId);
    if (state.pendingSubmission.targets.length === 0) {
      state.pendingSubmission.targets = null;
    }
  }

  if (Array.isArray(state.pendingRepeatDraft?.targets)) {
    state.pendingRepeatDraft.targets = state.pendingRepeatDraft.targets.filter((target) => target.tabId !== tabId);
    if (state.pendingRepeatDraft.targets.length === 0) {
      state.pendingRepeatDraft = null;
    }
  }

  void clearTabSubmissionCount(tabId);
  void clearTabPromptSlot(tabId);
});
