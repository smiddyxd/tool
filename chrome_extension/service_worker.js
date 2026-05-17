// Bridge endpoint exposed by the Python service. Set this to the LAN IP of the PC running the Python bridge.
const BRIDGE_BASE_URL = "http://192.168.0.215:62041";
const LOCAL_EVENT_URL = `${BRIDGE_BASE_URL}/a`;
const REPEAT_CAPTURE_URL = `${BRIDGE_BASE_URL}/b`;
const CONTROL_COMMAND_URL = `${BRIDGE_BASE_URL}/c`;

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
const EVENT_TYPE_ALERT_TASK = "alert_task";
const EVENT_TYPE_SCROLL = "scroll";
const EVENT_TYPE_REPEAT = "repeat";
const EVENT_TYPE_CONTROL_STATUS = "control_status";

// Extension settings persisted through the options page.
const CHATGPT_PROJECT_URL_PREFIX = "https://chatgpt.com/g/g-p-";
const DEFAULT_PROJECT_ID = "69bc1388b0588191bd1c176e83f018e4";
const DEFAULT_START_PAGE_URL = `${CHATGPT_PROJECT_URL_PREFIX}${DEFAULT_PROJECT_ID}`;
const DEFAULT_RESET_LIMIT = 0;
const STORAGE_KEY_START_PAGE_URL = "defaultStartPageUrl";
const STORAGE_KEY_PROJECT_IDS = "projectIds";
const STORAGE_KEY_ACTIVE_PROJECT_ID = "activeProjectId";
const STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE = "activeBridgeTaskType";
const STORAGE_KEY_TASK_TYPE_PROJECT_IDS = "taskTypeProjectIds";
const STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = "taskTypeActiveProjectAccounts";
const STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS = "serverControlTaskTypeDefinitions";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";
const STORAGE_KEY_TAB_COUNTS = "tabSubmissionCounts";
const STORAGE_KEY_TAB_PROMPT_SLOTS = "tabPromptSlots";

const BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS = "search-experience-to-product-usefulness";
const PROJECT_ACCOUNT_DEFAULT_KEY = "ascasdqwe";
const PROJECT_ACCOUNT_DEFINITIONS = [
  {
    key: PROJECT_ACCOUNT_DEFAULT_KEY,
    label: "ascasdqwe",
  },
  {
    key: "aoizxcaoi",
    label: "aoizxcaoi",
  },
];
const BRIDGE_TASK_TYPE_DEFINITIONS = [
  {
    key: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    label: "Search Experience to Product Usefulness",
  },
  {
    key: "get-rich-quick",
    label: "Get Rich Quick",
  },
  {
    key: "video-games",
    label: "Video Games",
  },
  {
    key: "weight-loss",
    label: "Weight Loss",
  },
];
const DEFAULT_TASK_TYPE_PROJECT_IDS = Object.fromEntries(
  BRIDGE_TASK_TYPE_DEFINITIONS.map((definition) => [
    definition.key,
    {
      [PROJECT_ACCOUNT_DEFAULT_KEY]: DEFAULT_PROJECT_ID,
      aoizxcaoi: "",
    },
  ]),
);
const DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = Object.fromEntries(
  BRIDGE_TASK_TYPE_DEFINITIONS.map((definition) => [definition.key, PROJECT_ACCOUNT_DEFAULT_KEY]),
);

// ChatGPT tab matching and content-script injection settings.
const CHATGPT_URL_PATTERNS = ["https://chat.openai.com/*", "https://chatgpt.com/*"];
const CONTENT_SCRIPT_FILE = "content_script.js";
const CONTENT_SCRIPT_PING_TYPE = "localQueryBridgePing";
const CONTENT_SCRIPT_SUBMIT_TEXT_TYPE = "submitTextPrompt";
const CONTENT_SCRIPT_SHOW_ALERT_TYPE = "showBridgeAlert";
const CONTENT_SCRIPT_QUEUE_REPEAT_TYPE = "queueRepeatScreenshot";
const CONTENT_SCRIPT_SUBMIT_REPEAT_TYPE = "submitRepeatDraft";
const CONTENT_SCRIPT_ACTIVATE_CURRENT_CHAT_TYPE = "activateCurrentChat";
const CONTENT_SCRIPT_SERVER_CONTROL_COMMAND_TYPE = "serverControlMenuCommand";
const CONTENT_SCRIPT_CONTROL_STATUS_TYPE = "serverControlStatusLog";
const REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE = "repeatCaptureHotkey";
const REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE = "repeatConfirmHotkey";
const REQUEST_TIMEOUT_MS = 5000;
const BRIDGE_EVENT_TIMEOUT_MS = 30000;
const CONTROL_COMMAND_TIMEOUT_MS = 30000;
const NEW_TAB_READY_TIMEOUT_MS = 20000;
const MAX_EVENTS_PER_POLL = 10;
const MAX_DELIVERY_ATTEMPTS = 3;
const DELIVERY_RETRY_DELAY_MS = 1000;
const CONTROL_PROCESSING_COMMANDS = new Set(["start_task_ocr", "start_task_screenshot", "ocr_google_results"]);

const state = {
  isPolling: false,
  isDelivering: false,
  pendingSubmission: null,
  pendingDeliveryRetryTimer: null,
  pendingRepeatDraft: null,
  cancelledControlRunIds: new Set(),
  controlRunTabIds: new Map(),
  lastQueuedControlStatus: null,
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

function normalizeTabId(value) {
  const tabId = Number.parseInt(`${value ?? ""}`, 10);
  return Number.isInteger(tabId) && tabId > 0 ? tabId : null;
}

function rememberControlRunTab(runId, tabId) {
  const normalizedRunId = typeof runId === "string" ? runId.trim() : "";
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedRunId || normalizedTabId === null) {
    return;
  }

  state.controlRunTabIds.set(normalizedRunId, normalizedTabId);
}

function getControlRunTabId(runId) {
  const normalizedRunId = typeof runId === "string" ? runId.trim() : "";
  if (!normalizedRunId) {
    return null;
  }

  return normalizeTabId(state.controlRunTabIds.get(normalizedRunId));
}

function forgetControlRunTab(runId) {
  const normalizedRunId = typeof runId === "string" ? runId.trim() : "";
  if (normalizedRunId) {
    state.controlRunTabIds.delete(normalizedRunId);
  }
}

function isTerminalControlStatusType(statusType) {
  return statusType === "response-complete" || statusType === "cancel" || statusType === "error";
}

function maybeLogHandshake() {
  const now = Date.now();
  if (now - state.lastHandshakeLogAt < HANDSHAKE_LOG_INTERVAL_MS) {
    return;
  }

  state.lastHandshakeLogAt = now;
  console.log("Local Query Bridge handshake");
}

function isEmptyBridgePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return true;
  }

  return ["a", "b", "c", "d", "e", "f"].every((key) => !payload[key]);
}

function rememberQueuedControlStatus(status) {
  const runId = typeof status?.runId === "string" ? status.runId.trim() : "";
  if (!runId) {
    return;
  }

  state.lastQueuedControlStatus = {
    runId,
    tabId: normalizeTabId(status.tabId),
    taskType: typeof status.taskType === "string" ? status.taskType : "",
    message: typeof status.message === "string" ? status.message : "",
    queuedAt: Date.now(),
  };
}

function clearQueuedControlStatus(runId = "") {
  if (
    !state.lastQueuedControlStatus
    || (runId && state.lastQueuedControlStatus.runId !== runId)
  ) {
    return;
  }

  state.lastQueuedControlStatus = null;
}

async function reportQueuedBridgeStatus(type, message, details = {}) {
  const queuedStatus = state.lastQueuedControlStatus;
  if (!queuedStatus?.runId) {
    return false;
  }

  return sendControlStatusToChatGpt({
    runId: queuedStatus.runId,
    tabId: queuedStatus.tabId ?? "",
    type,
    message,
    details: {
      queuedMessage: queuedStatus.message,
      queuedAgeMs: Date.now() - queuedStatus.queuedAt,
      ...(details && typeof details === "object" && !Array.isArray(details) ? details : {}),
    },
    taskType: queuedStatus.taskType,
    timestamp: new Date().toISOString(),
  });
}

async function reportControlRunStatus(runId, type, message, details = {}, taskType = "") {
  const normalizedRunId = typeof runId === "string" ? runId.trim() : "";
  if (!normalizedRunId) {
    return false;
  }

  return sendControlStatusToChatGpt({
    runId: normalizedRunId,
    tabId: getControlRunTabId(normalizedRunId) ?? "",
    type,
    message,
    details: details && typeof details === "object" && !Array.isArray(details) ? details : {},
    taskType,
    timestamp: new Date().toISOString(),
  });
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

function normalizeProjectUrlPrefix(value) {
  return buildProjectStartPageUrl(sanitizeProjectId(value, DEFAULT_PROJECT_ID));
}

function extractProjectId(value) {
  const rawValue = typeof value === "string" ? value.trim() : "";
  if (!rawValue) {
    return "";
  }

  const directMatch = rawValue.match(/^(?:g-p-)?([0-9a-f]{32})$/i);
  if (directMatch?.[1]) {
    return directMatch[1].toLocaleLowerCase();
  }

  const urlMatch = rawValue.match(/\/g\/g-p-([0-9a-f]{32})(?:[/?#]|$)/i);
  return urlMatch?.[1]?.toLocaleLowerCase() ?? "";
}

function sanitizeProjectId(value, fallback = "") {
  const projectId = extractProjectId(value);
  if (projectId) {
    return projectId;
  }

  return fallback ? extractProjectId(fallback) : "";
}

function buildProjectStartPageUrl(projectId) {
  return `${CHATGPT_PROJECT_URL_PREFIX}${sanitizeProjectId(projectId, DEFAULT_PROJECT_ID)}`;
}

function sanitizeProjectIds(rawValue, fallbackProjectId = DEFAULT_PROJECT_ID) {
  const rawValues = Array.isArray(rawValue)
    ? rawValue
    : (typeof rawValue === "string" ? rawValue.split(/[\s,]+/) : []);
  const projectIds = [];
  const seenIds = new Set();

  for (const value of rawValues) {
    const projectId = sanitizeProjectId(value);
    if (!projectId || seenIds.has(projectId)) {
      continue;
    }

    projectIds.push(projectId);
    seenIds.add(projectId);
  }

  if (projectIds.length > 0) {
    return projectIds;
  }

  return [sanitizeProjectId(fallbackProjectId, DEFAULT_PROJECT_ID)];
}

function getKnownBridgeTaskTypeDefinitions(rawSource = {}) {
  const source = rawSource && typeof rawSource === "object" && !Array.isArray(rawSource)
    ? rawSource
    : {};
  const definitionsByKey = new Map(BRIDGE_TASK_TYPE_DEFINITIONS.map((definition) => [definition.key, definition]));
  for (const key of Object.keys(source)) {
    if (!definitionsByKey.has(key)) {
      definitionsByKey.set(key, { key, label: key });
    }
  }

  return Array.from(definitionsByKey.values());
}

function normalizeBridgeTaskTypeAlias(value) {
  return typeof value === "string"
    ? value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : "";
}

function sanitizeBridgeTaskType(value) {
  const taskType = typeof value === "string" ? value.trim() : "";
  if (!taskType) {
    return BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS;
  }

  const taskTypeAlias = normalizeBridgeTaskTypeAlias(taskType);
  const knownDefinition = BRIDGE_TASK_TYPE_DEFINITIONS.find((definition) => (
    definition.key === taskType
    || normalizeBridgeTaskTypeAlias(definition.key) === taskTypeAlias
    || normalizeBridgeTaskTypeAlias(definition.label) === taskTypeAlias
  ));

  return knownDefinition?.key ?? taskType;
}

function getBridgeTaskTypeLabel(taskType) {
  return BRIDGE_TASK_TYPE_DEFINITIONS.find((definition) => definition.key === taskType)?.label
    ?? taskType;
}

function sanitizeProjectAccountKey(value) {
  const accountKey = typeof value === "string" ? value.trim() : "";
  return PROJECT_ACCOUNT_DEFINITIONS.some((definition) => definition.key === accountKey)
    ? accountKey
    : PROJECT_ACCOUNT_DEFAULT_KEY;
}

function getProjectAccountLabel(accountKey) {
  return PROJECT_ACCOUNT_DEFINITIONS.find((definition) => definition.key === accountKey)?.label
    ?? accountKey;
}

function sanitizeTaskTypeProjectIds(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getKnownBridgeTaskTypeDefinitions(source).map((definition) => {
      const rawTaskProjects = source[definition.key];
      const legacyProjectIds = Array.isArray(rawTaskProjects)
        ? sanitizeProjectIds(rawTaskProjects, "")
        : [];
      const taskSource = rawTaskProjects && typeof rawTaskProjects === "object" && !Array.isArray(rawTaskProjects)
        ? rawTaskProjects
        : {};

      return [
        definition.key,
        Object.fromEntries(
          PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition, accountIndex) => [
            accountDefinition.key,
            sanitizeProjectId(taskSource[accountDefinition.key] ?? legacyProjectIds[accountIndex] ?? ""),
          ]),
        ),
      ];
    }),
  );
}

function migrateTaskTypeProjectIds(rawTaskTypeProjectIds, legacyProjectIds) {
  const taskTypeProjectIds = sanitizeTaskTypeProjectIds(rawTaskTypeProjectIds);
  const rawSource = rawTaskTypeProjectIds && typeof rawTaskTypeProjectIds === "object" && !Array.isArray(rawTaskTypeProjectIds)
    ? rawTaskTypeProjectIds
    : {};
  const rawSearchProjects = rawSource[BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS];
  const hasAccountProjectMap = rawSearchProjects
    && typeof rawSearchProjects === "object"
    && !Array.isArray(rawSearchProjects)
    && PROJECT_ACCOUNT_DEFINITIONS.some((accountDefinition) => (
      Object.prototype.hasOwnProperty.call(rawSearchProjects, accountDefinition.key)
    ));
  if (hasAccountProjectMap) {
    return taskTypeProjectIds;
  }

  const currentSearchProjects = PROJECT_ACCOUNT_DEFINITIONS
    .map((accountDefinition) => taskTypeProjectIds[BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]?.[accountDefinition.key])
    .filter(Boolean);
  const migratedSearchProjects = sanitizeProjectIds([
    ...currentSearchProjects,
    ...(Array.isArray(legacyProjectIds) ? legacyProjectIds : []),
  ], "");

  return {
    ...taskTypeProjectIds,
    [BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]: Object.fromEntries(
      PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition, accountIndex) => [
        accountDefinition.key,
        migratedSearchProjects[accountIndex] ?? "",
      ]),
    ),
  };
}

function sanitizeTaskTypeActiveProjectAccounts(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getKnownBridgeTaskTypeDefinitions(source).map((definition) => [
      definition.key,
      sanitizeProjectAccountKey(source[definition.key]),
    ]),
  );
}

function getProjectIdForTaskTypeAccount(taskTypeProjectIds, taskType, accountKey) {
  const taskProjects = taskTypeProjectIds[taskType] ?? {};
  const requestedProjectId = sanitizeProjectId(taskProjects[sanitizeProjectAccountKey(accountKey)]);
  if (requestedProjectId) {
    return requestedProjectId;
  }

  for (const accountDefinition of PROJECT_ACCOUNT_DEFINITIONS) {
    const projectId = sanitizeProjectId(taskProjects[accountDefinition.key]);
    if (projectId) {
      return projectId;
    }
  }

  return DEFAULT_PROJECT_ID;
}

function getProjectIdsForTaskType(taskTypeProjectIds, taskType) {
  const taskProjects = taskTypeProjectIds[taskType] ?? {};
  const projectIds = PROJECT_ACCOUNT_DEFINITIONS
    .map((accountDefinition) => sanitizeProjectId(taskProjects[accountDefinition.key]))
    .filter(Boolean);
  return projectIds.length > 0 ? projectIds : [DEFAULT_PROJECT_ID];
}

async function getTaskTypeProjectIds() {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_PROJECT_IDS]: null,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: null,
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: null,
  });
  const legacyProjectSettings = normalizeProjectSettings(
    stored[STORAGE_KEY_PROJECT_IDS],
    stored[STORAGE_KEY_ACTIVE_PROJECT_ID],
    stored[STORAGE_KEY_START_PAGE_URL],
  );

  return migrateTaskTypeProjectIds(
    stored[STORAGE_KEY_TASK_TYPE_PROJECT_IDS],
    legacyProjectSettings.projectIds,
  );
}

async function getTaskTypeActiveProjectAccounts() {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
  });

  return sanitizeTaskTypeActiveProjectAccounts(stored[STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]);
}

function normalizeProjectSettings(rawProjectIds, rawActiveProjectId, rawStartPageUrl) {
  const legacyProjectId = sanitizeProjectId(rawStartPageUrl, DEFAULT_PROJECT_ID);
  const projectIds = sanitizeProjectIds(rawProjectIds, legacyProjectId);
  const activeProjectId = sanitizeProjectId(rawActiveProjectId);

  if (activeProjectId && !projectIds.includes(activeProjectId)) {
    projectIds.push(activeProjectId);
  }

  const normalizedActiveProjectId = activeProjectId && projectIds.includes(activeProjectId)
    ? activeProjectId
    : (projectIds.includes(legacyProjectId) ? legacyProjectId : projectIds[0]);

  return {
    projectIds,
    activeProjectId: normalizedActiveProjectId,
    defaultStartPageUrl: buildProjectStartPageUrl(normalizedActiveProjectId),
  };
}

function isEligibleProjectUrl(url, startPageUrl) {
  const normalizedUrl = typeof url === "string" ? url.trim() : "";
  if (!normalizedUrl || !isChatGptUrl(normalizedUrl)) {
    return false;
  }

  return normalizedUrl.startsWith(normalizeProjectUrlPrefix(startPageUrl));
}

function preferEligibleProjectTabs(tabs, startPageUrl) {
  const chatGptTabs = Array.isArray(tabs)
    ? tabs.filter((tab) => tab?.id && isChatGptUrl(tab.url))
    : [];
  const eligibleTabs = chatGptTabs.filter((tab) => isEligibleProjectUrl(tab.url, startPageUrl));
  return eligibleTabs;
}

function isFreshProjectStartUrl(url, startPageUrl) {
  const normalizedUrl = typeof url === "string" ? url.trim() : "";
  const prefix = normalizeProjectUrlPrefix(startPageUrl);
  if (!normalizedUrl || !normalizedUrl.startsWith(prefix)) {
    return false;
  }

  const suffix = normalizedUrl.slice(prefix.length);
  const pathSuffix = suffix.split(/[?#]/, 1)[0];
  if (/(^|\/)(?:c|chat)(?:\/|$)/.test(pathSuffix)) {
    return false;
  }

  return (
    pathSuffix === ""
    || pathSuffix === "/"
    || pathSuffix === "/project"
    || pathSuffix === "/project/"
    || suffix.startsWith("?")
    || suffix.startsWith("#")
  );
}

function sanitizeStartPageUrl(value) {
  const rawValue = typeof value === "string" ? value.trim() : "";
  if (!rawValue) {
    return DEFAULT_START_PAGE_URL;
  }

  try {
    const parsedUrl = new URL(rawValue);
    return normalizeProjectUrlPrefix(parsedUrl.toString());
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
    [STORAGE_KEY_PROJECT_IDS]: null,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: null,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
  });
  const projectSettings = normalizeProjectSettings(
    stored[STORAGE_KEY_PROJECT_IDS],
    stored[STORAGE_KEY_ACTIVE_PROJECT_ID],
    stored[STORAGE_KEY_START_PAGE_URL],
  );

  return {
    ...projectSettings,
    activeBridgeTaskType: sanitizeBridgeTaskType(stored[STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]),
    resetLimit: sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]),
  };
}

async function resolveBridgeTaskType(value) {
  const taskType = typeof value === "string" ? value.trim() : "";
  if (!taskType) {
    return BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS;
  }

  const sanitizedTaskType = sanitizeBridgeTaskType(taskType);
  const taskTypeAlias = normalizeBridgeTaskTypeAlias(taskType);
  try {
    const stored = await chrome.storage.local.get({
      [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: {},
    });
    const definitions = stored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS];
    if (definitions && typeof definitions === "object" && !Array.isArray(definitions)) {
      for (const [key, definition] of Object.entries(definitions)) {
        const label = definition && typeof definition === "object" ? definition.label : "";
        if (
          normalizeBridgeTaskTypeAlias(key) === taskTypeAlias
          || normalizeBridgeTaskTypeAlias(label) === taskTypeAlias
        ) {
          return key;
        }
      }
    }
  } catch (_error) {
    // Local task type definitions are only needed to map labels for custom task types.
  }

  return sanitizedTaskType;
}

async function getRoutingOptionsForTaskType(taskType) {
  const options = await getOptions();
  const activeBridgeTaskType = await resolveBridgeTaskType(taskType || options.activeBridgeTaskType);
  const taskTypeProjectIds = await getTaskTypeProjectIds();
  const taskTypeActiveProjectAccounts = await getTaskTypeActiveProjectAccounts();
  const activeProjectAccount = sanitizeProjectAccountKey(taskTypeActiveProjectAccounts[activeBridgeTaskType]);
  const projectIds = getProjectIdsForTaskType(taskTypeProjectIds, activeBridgeTaskType);
  const activeProjectId = getProjectIdForTaskTypeAccount(
    taskTypeProjectIds,
    activeBridgeTaskType,
    activeProjectAccount,
  );

  return {
    ...options,
    activeBridgeTaskType,
    projectIds,
    activeProjectId,
    defaultStartPageUrl: buildProjectStartPageUrl(activeProjectId),
  };
}

async function ensureDefaultOptions() {
  const options = await getOptions();
  const taskTypeProjectIds = await getTaskTypeProjectIds();
  const taskTypeActiveProjectAccounts = await getTaskTypeActiveProjectAccounts();
  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: options.defaultStartPageUrl,
    [STORAGE_KEY_PROJECT_IDS]: options.projectIds,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: options.activeProjectId,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: sanitizeBridgeTaskType(options.activeBridgeTaskType),
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: taskTypeProjectIds,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: taskTypeActiveProjectAccounts,
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

async function getChatGptTabById(tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (normalizedTabId === null) {
    return null;
  }

  try {
    const tab = await chrome.tabs.get(normalizedTabId);
    return tab?.id && isChatGptUrl(tab.url) ? tab : null;
  } catch (_error) {
    return null;
  }
}

async function getPreferredChatGptTab(startPageUrl = DEFAULT_START_PAGE_URL) {
  if (Number.isInteger(state.lastChatGptTabId)) {
    try {
      const knownTab = await chrome.tabs.get(state.lastChatGptTabId);
      if (knownTab?.id && isEligibleProjectUrl(knownTab.url, startPageUrl)) {
        return knownTab;
      }
    } catch (_error) {
      state.lastChatGptTabId = null;
    }

    state.lastChatGptTabId = null;
  }

  const tabs = await chrome.tabs.query({
    url: CHATGPT_URL_PATTERNS,
  });

  tabs.sort((left, right) => {
    const leftScore = (left.active ? 4 : 0) + (left.lastAccessed ?? 0);
    const rightScore = (right.active ? 4 : 0) + (right.lastAccessed ?? 0);
    return rightScore - leftScore;
  });

  const preferredTab = preferEligibleProjectTabs(tabs, startPageUrl)[0] ?? null;
  if (preferredTab?.id) {
    state.lastChatGptTabId = preferredTab.id;
    return preferredTab;
  }

  return null;
}

async function getActiveChatGptTabsAcrossWindows(startPageUrl = DEFAULT_START_PAGE_URL) {
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

  return preferEligibleProjectTabs(tabs, startPageUrl);
}

async function waitForChatGptTabReady(tabId, startPageUrl = DEFAULT_START_PAGE_URL) {
  const deadline = Date.now() + NEW_TAB_READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (tab?.id && isFreshProjectStartUrl(tab.url, startPageUrl) && tab.status === "complete") {
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
  const readyTab = await waitForChatGptTabReady(createdTab.id, startPageUrl);
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
  const readyTab = await waitForChatGptTabReady(updatedTab.id, startPageUrl);
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

async function sendToChatGpt(tabId, imageDataUrls, taskCount, promptText, taskType, controlRunId = "") {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: "submitScreenshot",
    imageDataUrls,
    taskCount,
    promptText,
    taskType,
    controlRunId,
  });

  return response?.ok === true;
}

async function sendTextPromptToChatGpt(tabId, taskCount, promptText, taskType, controlRunId = "") {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_SUBMIT_TEXT_TYPE,
    taskCount,
    promptText,
    taskType,
    controlRunId,
  });

  return response?.ok === true;
}

async function focusChatGptTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.id) {
      return false;
    }

    if (Number.isInteger(tab.windowId)) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
    await chrome.tabs.update(tab.id, { active: true });
    return true;
  } catch (_error) {
    return false;
  }
}

async function showAlertInChatGpt(tabId, taskCount, alertText, controlRunId = "") {
  await ensureContentScript(tabId);
  await focusChatGptTab(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_SHOW_ALERT_TYPE,
    taskCount,
    alertText,
    controlRunId,
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

async function submitRepeatDraft(tabId, taskCount, promptText, taskType) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_SUBMIT_REPEAT_TYPE,
    taskCount,
    promptText,
    taskType,
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

async function activateCurrentChatTab(tabId) {
  await ensureContentScript(tabId);

  const response = await chrome.tabs.sendMessage(tabId, {
    type: CONTENT_SCRIPT_ACTIVATE_CURRENT_CHAT_TYPE,
  });

  return response?.ok === true;
}

async function handleActionClick(tab) {
  if (!tab?.id || !isChatGptUrl(tab.url)) {
    console.warn("Local Query Bridge action click ignored because the active tab is not ChatGPT", {
      tabId: tab?.id,
      url: tab?.url,
    });
    return;
  }

  const settings = await getOptions();
  if (isEligibleProjectUrl(tab.url, settings.defaultStartPageUrl)) {
    state.lastChatGptTabId = tab.id;
  }

  const activated = await activateCurrentChatTab(tab.id);
  console.log("Local Query Bridge action click activated current ChatGPT tab", {
    tabId: tab.id,
    activated,
    activeProjectId: settings.activeProjectId,
  });
}

async function assignPromptTargets(baseTabs, promptTexts, logLabel, taskType) {
  const sanitizedTaskType = sanitizeBridgeTaskType(taskType);
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
  const eligibleTargetTabIds = new Set(
    baseTabs
      .filter((tab) => tab?.id)
      .map((tab) => String(tab.id)),
  );
  for (const tabId of Object.keys(slotMap)) {
    if (!liveTabIds.has(tabId) || !eligibleTargetTabIds.has(tabId)) {
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
      taskType: sanitizedTaskType,
    });
  }

  console.log(logLabel, {
    promptCount,
    activeTabs: baseTabs.map((tab) => tab?.id).filter(Number.isInteger),
    targets: targets.map((target) => target.tabId),
  });
  return targets;
}

async function buildSubmissionTargets(promptTexts, taskType = "", preferredTabId = null) {
  const settings = await getRoutingOptionsForTaskType(taskType);
  const promptCount = Math.max(1, Array.isArray(promptTexts) && promptTexts.length > 0 ? promptTexts.length : 1);
  const preferredTab = await getChatGptTabById(preferredTabId);
  let baseTabs = await getActiveChatGptTabsAcrossWindows(settings.defaultStartPageUrl);

  if (preferredTab?.id) {
    baseTabs = promptCount <= 1
      ? [preferredTab]
      : [preferredTab, ...baseTabs.filter((tab) => tab?.id !== preferredTab.id)];
  }

  if (baseTabs.length === 0) {
    const preferredTab = await getPreferredChatGptTab(settings.defaultStartPageUrl);
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
        if (isFreshProjectStartUrl(tab.url, settings.defaultStartPageUrl)) {
          await setTabSubmissionCount(tab.id, 0);
          console.log("Local Query Bridge reused fresh project tab instead of resetting", {
            tabId: tab.id,
            submissionCount,
            url: tab.url,
          });
        } else {
          const resetTab = await resetChatGptTab(tab.id, settings.defaultStartPageUrl);
          if (resetTab?.id) {
            tab = resetTab;
            console.log(`Local Query Bridge reset ChatGPT tab after ${submissionCount} prompt(s)`);
          }
        }
      }
    }

    if (tab?.id) {
      resolvedTabs.push(tab);
    }
  }

  return assignPromptTargets(resolvedTabs, promptTexts, "Local Query Bridge resolved submission targets", settings.activeBridgeTaskType);
}

async function buildRepeatTargets(promptTexts, taskType = "") {
  const settings = await getRoutingOptionsForTaskType(taskType);
  let baseTabs = await getActiveChatGptTabsAcrossWindows(settings.defaultStartPageUrl);

  if (baseTabs.length === 0) {
    const preferredTab = await getPreferredChatGptTab(settings.defaultStartPageUrl);
    if (preferredTab?.id) {
      baseTabs = [preferredTab];
    }
  }

  return assignPromptTargets(baseTabs, promptTexts, "Local Query Bridge resolved repeat targets", settings.activeBridgeTaskType);
}

async function buildAlertTargets(alertTexts, taskType = "", preferredTabId = null) {
  const settings = await getRoutingOptionsForTaskType(taskType);
  let tab = await getChatGptTabById(preferredTabId);

  if (!tab?.id) {
    tab = await getPreferredChatGptTab(settings.defaultStartPageUrl);
  }

  if (!tab?.id) {
    tab = await openFreshChatGptTab(undefined, settings.defaultStartPageUrl);
  }

  if (!tab?.id) {
    return [];
  }

  return [{
    tabId: tab.id,
    promptText: selectPromptForIndex(alertTexts, 0),
    taskType: settings.activeBridgeTaskType,
  }];
}

async function validateSubmissionTargets(targets) {
  const settings = await getOptions();
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
          taskType: sanitizeBridgeTaskType(target.taskType ?? settings.activeBridgeTaskType),
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

  const nextTargets = state.pendingSubmission.submissionMode === EVENT_TYPE_ALERT_TASK
    ? await buildAlertTargets(
      state.pendingSubmission.promptTexts,
      state.pendingSubmission.taskType,
      state.pendingSubmission.preferredTabId,
    )
    : await buildSubmissionTargets(
      state.pendingSubmission.promptTexts,
      state.pendingSubmission.taskType,
      state.pendingSubmission.preferredTabId,
    );
  state.pendingSubmission.targets = nextTargets;
  return nextTargets;
}

async function deliverPendingSubmission() {
  if (!state.pendingSubmission || state.isDelivering) {
    return;
  }

  clearPendingDeliveryRetry();
  state.isDelivering = true;
  try {
    await deliverPendingSubmissionAttempt();
  } finally {
    state.isDelivering = false;
  }
}

async function deliverPendingSubmissionAttempt() {
  if (!state.pendingSubmission) {
    return;
  }

  const pendingSubmission = state.pendingSubmission;
  pendingSubmission.deliveryAttempts = Number.isInteger(pendingSubmission.deliveryAttempts)
    ? pendingSubmission.deliveryAttempts + 1
    : 1;
  const deliveryAttempt = pendingSubmission.deliveryAttempts;
  let targets = [];
  try {
    targets = await getOrCreatePendingTargets();
  } catch (error) {
    console.warn("Local Query Bridge failed to resolve submission targets", error);
    if (deliveryAttempt < MAX_DELIVERY_ATTEMPTS) {
      await reportControlDeliveryStatus(
        pendingSubmission,
        "worker-send",
        "ChatGPT target lookup failed; retrying delivery.",
        {
          attempt: deliveryAttempt,
          attemptTotal: MAX_DELIVERY_ATTEMPTS,
          error: `${error}`,
        },
      );
      schedulePendingDeliveryRetry();
      return;
    }

    await reportControlDeliveryStatus(
      pendingSubmission,
      "error",
      "ChatGPT target lookup failed.",
      {
        attempt: deliveryAttempt,
        attemptTotal: MAX_DELIVERY_ATTEMPTS,
        error: `${error}`,
      },
    );
    state.pendingSubmission = null;
    if (pendingSubmission.controlRunId) {
      forgetControlRunTab(pendingSubmission.controlRunId);
    }
    return;
  }

  if (targets.length === 0) {
    console.warn("Local Query Bridge has no eligible ChatGPT submission targets");
    if (deliveryAttempt < MAX_DELIVERY_ATTEMPTS) {
      await reportControlDeliveryStatus(
        pendingSubmission,
        "worker-send",
        "No eligible ChatGPT target yet; retrying delivery.",
        {
          attempt: deliveryAttempt,
          attemptTotal: MAX_DELIVERY_ATTEMPTS,
        },
      );
      schedulePendingDeliveryRetry();
      return;
    }

    await reportControlDeliveryStatus(
      pendingSubmission,
      "error",
      "No eligible ChatGPT tab was available for delivery.",
      {
        attempt: deliveryAttempt,
        attemptTotal: MAX_DELIVERY_ATTEMPTS,
      },
    );
    state.pendingSubmission = null;
    if (pendingSubmission.controlRunId) {
      forgetControlRunTab(pendingSubmission.controlRunId);
    }
    return;
  }

  const { imageDataUrls, taskCount, submissionMode, controlRunId } = pendingSubmission;
  if (controlRunId && state.cancelledControlRunIds.has(controlRunId)) {
    console.log("Local Query Bridge skipped cancelled control-run delivery", { controlRunId, taskCount });
    state.pendingSubmission = null;
    forgetControlRunTab(controlRunId);
    return;
  }
  const isAlertSubmission = submissionMode === EVENT_TYPE_ALERT_TASK;
  const isTextSubmission = submissionMode === EVENT_TYPE_TEXT_TASK;
  const deliveryLabel = isAlertSubmission ? "alert" : (isTextSubmission ? "text prompt" : "screenshot");
  console.log(`Local Query Bridge delivering ${deliveryLabel}`, {
    taskCount,
    screenshotCount: Array.isArray(imageDataUrls) ? imageDataUrls.length : 0,
    deliveryAttempt,
    preferredTabId: pendingSubmission.preferredTabId ?? "",
    targets: targets.map((target) => target.tabId),
  });
  await reportControlDeliveryStatus(
    pendingSubmission,
    "worker-send",
    `Delivering ${deliveryLabel} to ChatGPT.`,
    {
      attempt: deliveryAttempt,
      attemptTotal: MAX_DELIVERY_ATTEMPTS,
      screenshotCount: Array.isArray(imageDataUrls) ? imageDataUrls.length : 0,
    },
  );
  const results = await Promise.allSettled(
    targets.map((target) => (
      isAlertSubmission
        ? showAlertInChatGpt(target.tabId, taskCount, target.promptText, controlRunId)
        : isTextSubmission
        ? sendTextPromptToChatGpt(target.tabId, taskCount, target.promptText, target.taskType, controlRunId)
        : sendToChatGpt(target.tabId, imageDataUrls, taskCount, target.promptText, target.taskType, controlRunId)
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
      if (!isAlertSubmission) {
        await incrementTabSubmissionCount(target.tabId);
      }
      continue;
    }

    failedTargets.push({
      ...target,
      lastError: result.status === "rejected" ? `${result.reason}` : "Content script did not acknowledge delivery.",
    });
  }

  if (failedTargets.length === 0) {
    console.log(`Local Query Bridge completed ${deliveryLabel} in ${successfulCount} tab(s)`);
    if (controlRunId) {
      state.cancelledControlRunIds.delete(controlRunId);
      forgetControlRunTab(controlRunId);
    }
    state.pendingSubmission = null;
    return;
  }

  console.warn("Local Query Bridge delivery left pending targets", failedTargets.map((target) => target.tabId));
  if (deliveryAttempt < MAX_DELIVERY_ATTEMPTS) {
    state.pendingSubmission.targets = failedTargets;
    await reportControlDeliveryStatus(
      pendingSubmission,
      "worker-send",
      `${deliveryLabel} delivery failed; retrying.`,
      {
        attempt: deliveryAttempt,
        attemptTotal: MAX_DELIVERY_ATTEMPTS,
        error: failedTargets.map((target) => `${target.tabId}: ${target.lastError}`).join("\n"),
      },
    );
    schedulePendingDeliveryRetry();
    return;
  }

  await reportControlDeliveryStatus(
    pendingSubmission,
    "error",
    `${deliveryLabel} delivery failed.`,
    {
      attempt: deliveryAttempt,
      attemptTotal: MAX_DELIVERY_ATTEMPTS,
      error: failedTargets.map((target) => `${target.tabId}: ${target.lastError}`).join("\n"),
    },
  );
  state.pendingSubmission = null;
  if (controlRunId) {
    forgetControlRunTab(controlRunId);
  }
}

async function handleScrollEvent(direction, steps) {
  if (!ENABLE_SCROLL_BRIDGE) {
    return;
  }

  const settings = await getOptions();
  const tabs = await getActiveChatGptTabsAcrossWindows(settings.defaultStartPageUrl);
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

async function fetchBridgePayload(timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

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
    const payloadChars = ["a", "b", "c", "d", "e", "f"].reduce((total, key) => (
      total + (typeof payload?.[key] === "string" ? payload[key].length : 0)
    ), 0);
    const durationMs = Date.now() - startedAt;
    if (payloadChars > 0 || durationMs > 1000) {
      console.log("Local Query Bridge fetched bridge event", {
        durationMs,
        timeoutMs,
        payloadChars,
      });
    }
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

function decodeOptionalEventTaskType(payload, field = "e") {
  const taskType = xorDecryptHex(payload?.[field] ?? "", XOR_KEY).trim();
  return taskType ? sanitizeBridgeTaskType(taskType) : "";
}

function decodeOptionalControlRunId(payload, field = "f") {
  return xorDecryptHex(payload?.[field] ?? "", XOR_KEY).trim();
}

async function sendControlStatusToChatGpt(status) {
  const rawTabId = Number.parseInt(`${status?.tabId ?? ""}`, 10);
  const candidateTabIds = [];
  if (Number.isInteger(rawTabId)) {
    candidateTabIds.push(rawTabId);
  }
  if (Number.isInteger(state.lastChatGptTabId) && !candidateTabIds.includes(state.lastChatGptTabId)) {
    candidateTabIds.push(state.lastChatGptTabId);
  }

  for (const tabId of candidateTabIds) {
    try {
      await ensureContentScript(tabId);
      const response = await chrome.tabs.sendMessage(tabId, {
        type: CONTENT_SCRIPT_CONTROL_STATUS_TYPE,
        status,
      });
      if (response?.ok === true) {
        state.lastChatGptTabId = tabId;
        return true;
      }
    } catch (_error) {
      // Try the next likely tab.
    }
  }

  const tabs = await chrome.tabs.query({ url: CHATGPT_URL_PATTERNS });
  for (const tab of tabs) {
    if (!tab?.id || candidateTabIds.includes(tab.id) || !isChatGptUrl(tab.url)) {
      continue;
    }

    try {
      await ensureContentScript(tab.id);
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: CONTENT_SCRIPT_CONTROL_STATUS_TYPE,
        status,
      });
      if (response?.ok === true) {
        state.lastChatGptTabId = tab.id;
        return true;
      }
    } catch (_error) {
      // Keep looking; status log updates are best-effort.
    }
  }

  return false;
}

async function reportControlDeliveryStatus(pendingSubmission, type, message, details = {}) {
  const runId = typeof pendingSubmission?.controlRunId === "string" ? pendingSubmission.controlRunId : "";
  if (!runId) {
    return false;
  }

  return sendControlStatusToChatGpt({
    runId,
    tabId: pendingSubmission.preferredTabId ?? "",
    type,
    message,
    details: {
      taskCount: pendingSubmission.taskCount ?? "",
      ...(details && typeof details === "object" && !Array.isArray(details) ? details : {}),
    },
    taskType: pendingSubmission.taskType ?? "",
    timestamp: new Date().toISOString(),
  });
}

function schedulePendingDeliveryRetry() {
  if (state.pendingDeliveryRetryTimer !== null) {
    return;
  }

  state.pendingDeliveryRetryTimer = setTimeout(() => {
    state.pendingDeliveryRetryTimer = null;
    void deliverPendingSubmission().catch((error) => {
      console.warn("Local Query Bridge pending delivery retry failed", error);
    });
  }, DELIVERY_RETRY_DELAY_MS);
}

function clearPendingDeliveryRetry() {
  if (state.pendingDeliveryRetryTimer === null) {
    return;
  }

  clearTimeout(state.pendingDeliveryRetryTimer);
  state.pendingDeliveryRetryTimer = null;
}

async function switchBridgeTaskType(taskType, sender) {
  const activeBridgeTaskType = sanitizeBridgeTaskType(taskType);
  const taskTypeProjectIds = await getTaskTypeProjectIds();
  const taskTypeActiveProjectAccounts = await getTaskTypeActiveProjectAccounts();
  const activeProjectAccount = sanitizeProjectAccountKey(taskTypeActiveProjectAccounts[activeBridgeTaskType]);
  const projectIds = getProjectIdsForTaskType(taskTypeProjectIds, activeBridgeTaskType);
  const activeProjectId = getProjectIdForTaskTypeAccount(
    taskTypeProjectIds,
    activeBridgeTaskType,
    activeProjectAccount,
  );
  const projectUrl = buildProjectStartPageUrl(activeProjectId);

  await chrome.storage.sync.set({
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: activeBridgeTaskType,
    [STORAGE_KEY_PROJECT_IDS]: projectIds,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: activeProjectId,
    [STORAGE_KEY_START_PAGE_URL]: projectUrl,
  });

  const navigateTabId = sender?.tab?.id && isChatGptUrl(sender.tab.url) ? sender.tab.id : null;
  if (navigateTabId !== null) {
    state.lastChatGptTabId = navigateTabId;
  }

  console.log("Local Query Bridge switched task type project", {
    taskType: activeBridgeTaskType,
    taskLabel: getBridgeTaskTypeLabel(activeBridgeTaskType),
    account: activeProjectAccount,
    activeProjectId,
    projectCount: projectIds.length,
  });

  return {
    activeBridgeTaskType,
    activeBridgeTaskTypeLabel: getBridgeTaskTypeLabel(activeBridgeTaskType),
    activeProjectAccount,
    activeProjectAccountLabel: getProjectAccountLabel(activeProjectAccount),
    activeProjectId,
    projectIds,
    projectUrl,
    navigateTabId,
  };
}

async function switchBridgeProjectAccount(taskType, accountKey, sender) {
  const activeBridgeTaskType = sanitizeBridgeTaskType(taskType);
  const activeProjectAccount = sanitizeProjectAccountKey(accountKey);
  const taskTypeProjectIds = await getTaskTypeProjectIds();
  const taskTypeActiveProjectAccounts = await getTaskTypeActiveProjectAccounts();
  taskTypeActiveProjectAccounts[activeBridgeTaskType] = activeProjectAccount;
  const projectIds = getProjectIdsForTaskType(taskTypeProjectIds, activeBridgeTaskType);
  const activeProjectId = getProjectIdForTaskTypeAccount(
    taskTypeProjectIds,
    activeBridgeTaskType,
    activeProjectAccount,
  );
  const projectUrl = buildProjectStartPageUrl(activeProjectId);

  await chrome.storage.sync.set({
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: activeBridgeTaskType,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: taskTypeActiveProjectAccounts,
    [STORAGE_KEY_PROJECT_IDS]: projectIds,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: activeProjectId,
    [STORAGE_KEY_START_PAGE_URL]: projectUrl,
  });

  const navigateTabId = sender?.tab?.id && isChatGptUrl(sender.tab.url) ? sender.tab.id : null;
  if (navigateTabId !== null) {
    state.lastChatGptTabId = navigateTabId;
  }

  console.log("Local Query Bridge switched project account", {
    taskType: activeBridgeTaskType,
    taskLabel: getBridgeTaskTypeLabel(activeBridgeTaskType),
    account: activeProjectAccount,
    activeProjectId,
  });

  return {
    activeBridgeTaskType,
    activeBridgeTaskTypeLabel: getBridgeTaskTypeLabel(activeBridgeTaskType),
    activeProjectAccount,
    activeProjectAccountLabel: getProjectAccountLabel(activeProjectAccount),
    activeProjectId,
    projectIds,
    projectUrl,
    navigateTabId,
  };
}

async function applyServerControlCommandSideEffects(command, sender) {
  if (command?.command === "set_task_type") {
    return switchBridgeTaskType(command.value, sender);
  }

  if (command?.command === "set_project_account") {
    return switchBridgeProjectAccount(command.currentTaskType, command.value, sender);
  }

  return {};
}

function isProjectSwitchCommand(command) {
  return command?.command === "set_task_type" || command?.command === "set_project_account";
}

function isAbortError(error) {
  return error?.name === "AbortError" || String(error).includes("AbortError");
}

async function navigateServerControlProject(sideEffects) {
  if (!Number.isInteger(sideEffects?.navigateTabId) || !sideEffects.projectUrl) {
    return false;
  }

  await clearTabSubmissionCount(sideEffects.navigateTabId);
  await clearTabPromptSlot(sideEffects.navigateTabId);
  await chrome.tabs.update(sideEffects.navigateTabId, {
    active: true,
    url: sideEffects.projectUrl,
  });
  state.lastChatGptTabId = sideEffects.navigateTabId;
  return true;
}

async function sendServerControlCommand(command, sender) {
  const controller = new AbortController();
  const isProcessingCommand = CONTROL_PROCESSING_COMMANDS.has(command?.command);
  const timeoutId = setTimeout(
    () => controller.abort(),
    isProcessingCommand ? CONTROL_COMMAND_TIMEOUT_MS : REQUEST_TIMEOUT_MS,
  );
  const controlRunId = typeof command?.controlRunId === "string" ? command.controlRunId.trim() : "";
  const isCancelCommand = command?.command === "cancel_control_processing";
  if (isCancelCommand && controlRunId) {
    state.cancelledControlRunIds.add(controlRunId);
    forgetControlRunTab(controlRunId);
    clearQueuedControlStatus(controlRunId);
    if (state.pendingSubmission?.controlRunId === controlRunId) {
      state.pendingSubmission = null;
    }
  }
  const sideEffects = await applyServerControlCommandSideEffects(command, sender);
  const navigationPromise = navigateServerControlProject(sideEffects)
    .catch((error) => {
      console.warn("Local Query Bridge task type project navigation failed", error);
      return false;
    });
  const payload = {
    ...(command && typeof command === "object" && !Array.isArray(command) ? command : {}),
    ...sideEffects,
    tabId: sender?.tab?.id ?? null,
    tabUrl: sender?.tab?.url ?? "",
  };
  if (controlRunId) {
    rememberControlRunTab(controlRunId, payload.tabId);
  }

  try {
    const response = await fetch(CONTROL_COMMAND_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("Local Query Bridge server control response not ok", response.status);
      return isProjectSwitchCommand(command) ? navigationPromise : false;
    }

    console.log("Local Query Bridge forwarded server control command", {
      command: payload.command,
      value: payload.value,
      group: payload.group,
      tabId: payload.tabId,
      controlRunId,
    });
    const navigationOk = await navigationPromise;
    return isProjectSwitchCommand(command) ? navigationOk : true;
  } catch (error) {
    if (isProjectSwitchCommand(command)) {
      const navigationOk = await navigationPromise;
      console.warn("Local Query Bridge server control log failed after project switch", error);
      return navigationOk;
    }

    if (isProcessingCommand && isAbortError(error)) {
      console.warn("Local Query Bridge server control acknowledgement timed out; continuing to watch status events", {
        command: command?.command,
        controlRunId,
      });
      return {
        ok: true,
        ackTimedOut: true,
      };
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getOrCreatePendingRepeatTargets(taskCount, promptTexts, taskType = "") {
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

  return buildRepeatTargets(promptTexts, taskType);
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
  const taskType = decodeOptionalEventTaskType(payload, "f");
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
  const draftTaskType = taskType || existingDraft?.taskType || "";
  const targets = await getOrCreatePendingRepeatTargets(taskCount, promptTexts, draftTaskType);
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
    taskType: draftTaskType,
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
    targets.map((target) => submitRepeatDraft(target.tabId, taskCount, target.promptText, target.taskType)),
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
  let queuedControlStatusFollowups = 0;

  try {
    if (state.pendingSubmission) {
      await deliverPendingSubmission();
      if (state.pendingSubmission) {
        return;
      }
    }

    for (let iteration = 0; iteration < MAX_EVENTS_PER_POLL; iteration += 1) {
      const hasQueuedControlStatus = Boolean(state.lastQueuedControlStatus?.runId);
      const payload = await fetchBridgePayload(
        hasQueuedControlStatus ? BRIDGE_EVENT_TIMEOUT_MS : REQUEST_TIMEOUT_MS,
      );
      if (!payload) {
        return;
      }
      if (isEmptyBridgePayload(payload)) {
        if (queuedControlStatusFollowups > 0) {
          queuedControlStatusFollowups -= 1;
          await delay(150);
          continue;
        }
        if (state.lastQueuedControlStatus?.runId) {
          await reportQueuedBridgeStatus(
            "error",
            "Bridge queue was empty after the queued event.",
            { followupAttempts: 4 },
          );
          clearQueuedControlStatus();
        }
        return;
      }

      const eventType = xorDecryptHex(payload?.d ?? "", XOR_KEY).trim();
      if (eventType === EVENT_TYPE_CONTROL_STATUS) {
        const statusPayload = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
        if (!statusPayload) {
          continue;
        }

        let status = null;
        try {
          status = JSON.parse(statusPayload);
        } catch (_error) {
          status = null;
        }

        if (status && typeof status === "object") {
          if (status.runId && status.tabId) {
            rememberControlRunTab(status.runId, status.tabId);
          }
          if (status.type === "cancel" && status.runId) {
            state.cancelledControlRunIds.add(status.runId);
            forgetControlRunTab(status.runId);
          }
          if (status.type === "prompt-sent" && status.runId) {
            state.cancelledControlRunIds.delete(status.runId);
          }
          if (isTerminalControlStatusType(status.type) && status.runId) {
            forgetControlRunTab(status.runId);
            clearQueuedControlStatus(status.runId);
          }
          if (status.type === "queued" && status.runId) {
            rememberQueuedControlStatus(status);
            queuedControlStatusFollowups = Math.max(queuedControlStatusFollowups, 4);
          }
          await sendControlStatusToChatGpt(status);
          if (status.type === "queued" && status.runId) {
            await reportQueuedBridgeStatus(
              "worker-send",
              "Bridge worker saw queued status; fetching event payload.",
              { nextFetchTimeoutMs: BRIDGE_EVENT_TIMEOUT_MS },
            );
          }
          continue;
        }
        return;
      }

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

      const eventTaskType = decodeOptionalEventTaskType(payload);
      const controlRunId = decodeOptionalControlRunId(payload);

      if (eventType === EVENT_TYPE_TEXT_TASK) {
        if (!payload?.a) {
          await reportQueuedBridgeStatus(
            "error",
            "Bridge worker received a text-prompt event without a task count.",
            { eventType },
          );
          clearQueuedControlStatus();
          return;
        }

        const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
        const taskCount = Number.parseInt(taskText, 10);
        await reportControlRunStatus(
          controlRunId,
          "worker-send",
          "Bridge worker received text-prompt payload.",
          {
            taskCount: Number.isNaN(taskCount) ? taskText : taskCount,
            encryptedPromptChars: typeof payload.c === "string" ? payload.c.length : 0,
          },
          eventTaskType,
        );
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
          await reportControlRunStatus(
            controlRunId,
            "error",
            "Bridge worker could not decode a valid text-prompt payload.",
            {
              taskCountText: taskText,
              promptCount: promptTexts.length,
              encryptedPromptChars: typeof payload.c === "string" ? payload.c.length : 0,
            },
            eventTaskType,
          );
          clearQueuedControlStatus(controlRunId);
          return;
        }

        console.log("Local Query Bridge retrieved new task text prompt", {
          taskCount,
          promptCount: promptTexts.length,
          taskType: eventTaskType || "(active)",
          controlRunId: controlRunId || "",
        });
        state.pendingRepeatDraft = null;
        state.pendingSubmission = {
          taskCount,
          promptTexts,
          targets: null,
          submissionMode: EVENT_TYPE_TEXT_TASK,
          taskType: eventTaskType,
          controlRunId,
          preferredTabId: getControlRunTabId(controlRunId),
        };

        await deliverPendingSubmission();
        clearQueuedControlStatus(controlRunId);
        return;
      }

      if (eventType === EVENT_TYPE_ALERT_TASK) {
        if (!payload?.a) {
          await reportQueuedBridgeStatus(
            "error",
            "Bridge worker received an alert event without a task count.",
            { eventType },
          );
          clearQueuedControlStatus();
          return;
        }

        const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
        const taskCount = Number.parseInt(taskText, 10);
        await reportControlRunStatus(
          controlRunId,
          "worker-send",
          "Bridge worker received alert payload.",
          {
            taskCount: Number.isNaN(taskCount) ? taskText : taskCount,
            encryptedAlertChars: typeof payload.c === "string" ? payload.c.length : 0,
          },
          eventTaskType,
        );
        const alertPayload = xorDecryptBase64ToString(payload.c ?? "", XOR_KEY).trim();
        let alertTexts = [];
        if (alertPayload) {
          try {
            alertTexts = normalizePromptTexts(JSON.parse(alertPayload));
          } catch (_error) {
            alertTexts = normalizePromptTexts(alertPayload);
          }
        }
        if (Number.isNaN(taskCount) || alertTexts.length === 0) {
          await reportControlRunStatus(
            controlRunId,
            "error",
            "Bridge worker could not decode a valid alert payload.",
            {
              taskCountText: taskText,
              alertCount: alertTexts.length,
              encryptedAlertChars: typeof payload.c === "string" ? payload.c.length : 0,
            },
            eventTaskType,
          );
          clearQueuedControlStatus(controlRunId);
          return;
        }

        console.log("Local Query Bridge retrieved alert event", {
          taskCount,
          alertCount: alertTexts.length,
          taskType: eventTaskType || "(active)",
          controlRunId: controlRunId || "",
        });
        state.pendingRepeatDraft = null;
        state.pendingSubmission = {
          taskCount,
          promptTexts: alertTexts,
          targets: null,
          submissionMode: EVENT_TYPE_ALERT_TASK,
          taskType: eventTaskType,
          controlRunId,
          preferredTabId: getControlRunTabId(controlRunId),
        };

        await deliverPendingSubmission();
        clearQueuedControlStatus(controlRunId);
        return;
      }

      if (!payload?.a || !payload?.b) {
        await reportQueuedBridgeStatus(
          "error",
          "Bridge worker received an invalid screenshot event payload.",
          {
            eventType,
            hasTaskCount: Boolean(payload?.a),
            hasImagePayload: Boolean(payload?.b),
          },
        );
        clearQueuedControlStatus();
        return;
      }

      const taskText = xorDecryptHex(payload.a, XOR_KEY).trim();
      const taskCount = Number.parseInt(taskText, 10);
      await reportControlRunStatus(
        controlRunId,
        "worker-send",
        "Bridge worker received screenshot payload; decoding image data.",
        {
          taskCount: Number.isNaN(taskCount) ? taskText : taskCount,
          encryptedImageChars: typeof payload.b === "string" ? payload.b.length : 0,
          encryptedPromptChars: typeof payload.c === "string" ? payload.c.length : 0,
        },
        eventTaskType,
      );
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
        await reportControlRunStatus(
          controlRunId,
          "error",
          "Bridge worker could not decode a valid screenshot payload.",
          {
            taskCountText: taskText,
            screenshotCount: imageDataUrls.length,
            encryptedImageChars: typeof payload.b === "string" ? payload.b.length : 0,
          },
          eventTaskType,
        );
        clearQueuedControlStatus(controlRunId);
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
        taskType: eventTaskType || "(active)",
        controlRunId: controlRunId || "",
      });
      await reportControlRunStatus(
        controlRunId,
        "worker-send",
        "Screenshot payload decoded; resolving ChatGPT target.",
        {
          taskCount,
          screenshotCount: imageDataUrls.length,
          promptCount: promptTexts.length,
        },
        eventTaskType,
      );
      state.pendingRepeatDraft = null;
      state.pendingSubmission = {
        taskCount,
        imageDataUrls,
        promptTexts,
        targets: null,
        submissionMode: EVENT_TYPE_TASK,
        taskType: eventTaskType,
        controlRunId,
        preferredTabId: getControlRunTabId(controlRunId),
      };

      await deliverPendingSubmission();
      clearQueuedControlStatus(controlRunId);
      return;
    }
  } catch (error) {
    console.warn("Local Query Bridge poll failed", error);
    if (state.lastQueuedControlStatus?.runId) {
      await reportQueuedBridgeStatus(
        "error",
        "Bridge worker failed while fetching or decoding the queued event.",
        {
          error: `${error}`,
          errorName: error?.name ?? "",
          eventFetchTimeoutMs: BRIDGE_EVENT_TIMEOUT_MS,
        },
      );
      clearQueuedControlStatus();
    }
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

chrome.action.onClicked.addListener((tab) => {
  void handleActionClick(tab).catch((error) => {
    console.warn("Local Query Bridge action click activation failed", error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === CONTENT_SCRIPT_SERVER_CONTROL_COMMAND_TYPE) {
    void sendServerControlCommand(message.command, _sender)
      .then((result) => {
        if (result && typeof result === "object" && !Array.isArray(result)) {
          sendResponse({ ok: result.ok !== false, ...result });
          return;
        }

        sendResponse({ ok: result === true });
      })
      .catch((error) => {
        console.warn("Local Query Bridge server control command failed", error);
        sendResponse({ ok: false, error: `${error}` });
      });
    return true;
  }

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
