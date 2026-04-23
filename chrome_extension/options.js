const DEFAULT_START_PAGE_URL = "https://chatgpt.com/g/g-p-69bc1388b0588191bd1c176e83f018e4";
const DEFAULT_RESET_LIMIT = 0;
const STORAGE_KEY_START_PAGE_URL = "defaultStartPageUrl";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";

function normalizeProjectUrlPrefix(value) {
  const rawValue = typeof value === "string" ? value.trim() : "";
  if (!rawValue) {
    return DEFAULT_START_PAGE_URL;
  }

  const directProjectMatch = rawValue.match(/https:\/\/chatgpt\.com\/g\/g-p-[0-9a-f]{32}/i);
  if (directProjectMatch?.[0]) {
    return directProjectMatch[0].replace(/\/+$/, "");
  }

  try {
    const parsedUrl = new URL(rawValue);
    return `${parsedUrl.origin}${parsedUrl.pathname}`.replace(/\/+$/, "");
  } catch (_error) {
    return DEFAULT_START_PAGE_URL;
  }
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

async function loadOptions() {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
  });

  const defaultStartPageUrl = sanitizeStartPageUrl(stored[STORAGE_KEY_START_PAGE_URL]);
  const resetLimit = sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]);

  document.querySelector("#default-start-page-url").value = defaultStartPageUrl;
  document.querySelector("#reset-limit").value = String(resetLimit);
}

async function saveOptions(event) {
  event.preventDefault();

  const status = document.querySelector("#status");
  const defaultStartPageUrl = sanitizeStartPageUrl(document.querySelector("#default-start-page-url").value);
  const resetLimit = sanitizeResetLimit(document.querySelector("#reset-limit").value);

  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: defaultStartPageUrl,
    [STORAGE_KEY_RESET_LIMIT]: resetLimit,
  });

  document.querySelector("#default-start-page-url").value = defaultStartPageUrl;
  document.querySelector("#reset-limit").value = String(resetLimit);
  status.textContent = "Saved.";
}

async function restoreDefaults() {
  document.querySelector("#default-start-page-url").value = DEFAULT_START_PAGE_URL;
  document.querySelector("#reset-limit").value = String(DEFAULT_RESET_LIMIT);
  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
  });
  document.querySelector("#status").textContent = "Defaults restored.";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#options-form");
  const resetButton = document.querySelector("#reset-defaults");

  void loadOptions();
  form.addEventListener("submit", (event) => {
    void saveOptions(event);
  });
  resetButton.addEventListener("click", () => {
    void restoreDefaults();
  });
});

