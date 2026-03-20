// Bridge endpoint exposed by the Python service. Set this to the LAN IP of the PC running the Python bridge.
const BRIDGE_BASE_URL = "http://192.168.0.215:62041";
const LOCAL_EVENT_URL = `${BRIDGE_BASE_URL}/a`;

// Poll cadence for the Chrome alarm. Unpacked extensions can use sub-30s alarms.
const POLL_ALARM_NAME = "poll-local-query-bridge";
const POLL_PERIOD_MINUTES = 1 / 60;

// Shared single-byte XOR key used by the Python service.
const XOR_KEY = 0x5a;
const HANDSHAKE_LOG_INTERVAL_MS = 10000;

// Event types emitted by the Python service.
const EVENT_TYPE_TASK = "task";
const EVENT_TYPE_SCROLL = "scroll";

// ChatGPT tab matching and content-script injection settings.
const CHATGPT_URL_PATTERNS = ["https://chat.openai.com/*", "https://chatgpt.com/*"];
const CONTENT_SCRIPT_FILE = "content_script.js";
const CONTENT_SCRIPT_PING_TYPE = "localQueryBridgePing";
const REQUEST_TIMEOUT_MS = 5000;

const state = {
  isPolling: false,
  pendingSubmission: null,
  lastHandshakeLogAt: 0,
};

function createPollingAlarm() {
  chrome.alarms.create(POLL_ALARM_NAME, { periodInMinutes: POLL_PERIOD_MINUTES });
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

async function getActiveChatGptTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    url: CHATGPT_URL_PATTERNS,
  });

  return tabs[0] ?? null;
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

async function sendToChatGpt(tabId, imageDataUrl, taskCount, promptText) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: "submitScreenshot",
    imageDataUrl,
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

async function deliverPendingSubmission() {
  if (!state.pendingSubmission) {
    return;
  }

  const activeTab = await getActiveChatGptTab();
  if (!activeTab?.id) {
    return;
  }

  const { imageDataUrl, promptText, taskCount } = state.pendingSubmission;
  const wasDelivered = await sendToChatGpt(activeTab.id, imageDataUrl, taskCount, promptText);
  if (wasDelivered) {
    console.log("Local Query Bridge submitted screenshot to ChatGPT");
    state.pendingSubmission = null;
  }
}

async function handleScrollEvent(direction, steps) {
  const activeTab = await getActiveChatGptTab();
  if (!activeTab?.id) {
    return;
  }

  const wasScrolled = await sendScrollToChatGpt(activeTab.id, direction, steps);
  if (wasScrolled) {
    console.log(`Local Query Bridge scrolled ChatGPT ${direction}`);
  }
}

async function pollLocalBridge() {
  if (state.isPolling) {
    return;
  }

  state.isPolling = true;

  try {
    if (state.pendingSubmission) {
      await deliverPendingSubmission();
      if (state.pendingSubmission) {
        return;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let payload;
    try {
      const response = await fetch(LOCAL_EVENT_URL, {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn("Local Query Bridge poll response not ok", response.status);
        return;
      }

      payload = await response.json();
      maybeLogHandshake();
    } finally {
      clearTimeout(timeoutId);
    }

    const eventType = xorDecryptHex(payload?.d ?? "", XOR_KEY).trim();
    if (eventType === EVENT_TYPE_SCROLL) {
      const direction = xorDecryptHex(payload.a ?? "", XOR_KEY).trim();
      const stepsText = xorDecryptHex(payload.b ?? "", XOR_KEY).trim();
      const steps = Number.parseInt(stepsText, 10);
      if ((direction === "up" || direction === "down") && !Number.isNaN(steps)) {
        await handleScrollEvent(direction, steps);
      }
      return;
    }

    if (!payload?.a || !payload?.b) {
      return;
    }

    const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
    const taskCount = Number.parseInt(taskText, 10);
    const imageDataUrl = xorDecryptBase64ToDataUrl(payload.b, XOR_KEY);
    const promptText = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
    if (Number.isNaN(taskCount) || !imageDataUrl) {
      return;
    }

    console.log("Local Query Bridge retrieved new task screenshot");
    state.pendingSubmission = {
      taskCount,
      imageDataUrl,
      promptText,
    };

    await deliverPendingSubmission();
  } catch (error) {
    console.warn("Local Query Bridge poll failed", error);
  } finally {
    state.isPolling = false;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  createPollingAlarm();
  void pollLocalBridge();
});

chrome.runtime.onStartup.addListener(() => {
  createPollingAlarm();
  void pollLocalBridge();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== POLL_ALARM_NAME) {
    return;
  }

  void pollLocalBridge();
});
