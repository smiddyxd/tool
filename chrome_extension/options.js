const DEFAULT_START_PAGE_URL = "https://chatgpt.com/g/g-p-69bc1388b0588191bd1c176e83f018e4";
const DEFAULT_RESET_LIMIT = 0;
const DEFAULT_HIGHLIGHT_RULES = [
  {
    id: "default-egregious",
    label: "Egregious",
    color: "#ef4444",
    matchStrings: ["egregious"],
    companionWords: ["low", "mid", "high"],
    companionDistance: 0,
    enabled: true,
  },
  {
    id: "default-poor",
    label: "Poor",
    color: "#facc15",
    matchStrings: ["poor"],
    companionWords: ["low", "mid", "high"],
    companionDistance: 0,
    enabled: true,
  },
  {
    id: "default-okay",
    label: "Okay",
    color: "#22c55e",
    matchStrings: ["okay"],
    companionWords: ["low", "mid", "high"],
    companionDistance: 0,
    enabled: true,
  },
  {
    id: "default-good",
    label: "Good",
    color: "#3b82f6",
    matchStrings: ["good"],
    companionWords: ["low", "mid", "high"],
    companionDistance: 0,
    enabled: true,
  },
];
const DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR = "#2563eb";
const ANALYSIS_TOC_SIDE_LEFT = "left";
const ANALYSIS_TOC_SIDE_RIGHT = "right";
const ANALYSIS_TOC_ALLOWED_SIDES = new Set([ANALYSIS_TOC_SIDE_LEFT, ANALYSIS_TOC_SIDE_RIGHT]);
const ANALYSIS_TOC_DEFAULT_OFFSET_PX = 0;
const ANALYSIS_TOC_MIN_OFFSET_PX = -2000;
const ANALYSIS_TOC_MAX_OFFSET_PX = 2000;
const ANALYSIS_SECTION_HEADINGS = [
  { heading: "Query Coherence Check", label: "Query Coherence Check" },
  { heading: "Decision Gates", label: "Decision Gates" },
  { heading: "Interpretations Table", label: "Interpretations Table" },
  { heading: "Query Components", label: "Query Components" },
  { heading: "Query Meaning", label: "Query Meaning" },
  { heading: "Product Overview", label: "Product Overview" },
  { heading: "Product Assessment", label: "Product Assessment" },
  { heading: "Requirement Analysis", label: "Requirement Analysis" },
  { heading: "Brand / Retailer / Platform Logic", label: "Brand / Retailer / Platform" },
  { heading: "Shared-Context Test", label: "Shared-Context Test" },
  { heading: "Relatedness vs Intent Satisfaction", label: "Related / Intent Satisf." },
  { heading: "Substitute & Compatibility Tests", label: "Substitut. / Compatib." },
  { heading: "Applicable Task Categories / Concepts", label: "Task Categ. / Concepts" },
  { heading: "Rating Synthesis", label: "Rating Synthesis" },
  { heading: "Standard-Machinery Rating Suggestion", label: "Rating" },
  { heading: "Steelmanned Reality Check", label: "Steelmanned Ratings" },
  { heading: "Fresh top-down impression", label: "Fresh top-down impression" },
  { heading: "Questionable premise audit", label: "Questionable premise audit" },
  { heading: "Steelmanned alternative rating space", label: "Steelmanned alternative rating space" },
  { heading: "Integrity verdict", label: "Integrity verdict" },
  { heading: "Position Calibration Check", label: "Position Calibration" },
  { heading: "Borderline cases", label: "Borderline cases" },
  { heading: "Categorical Miss Subtype Assessment", label: "Categorical Miss" },
  { heading: "Override Impact", label: "Override Impact" },
];

const STORAGE_KEY_START_PAGE_URL = "defaultStartPageUrl";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";
const STORAGE_KEY_HIGHLIGHT_RULES = "highlightRules";
const STORAGE_KEY_ANALYSIS_TOC_COLORS = "analysisTocButtonColors";
const STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS = "analysisTocButtonSettings";
const STORAGE_KEY_ANALYSIS_TOC_LABELS = "analysisTocButtonLabels";

const highlightState = {
  rules: [],
  tocButtonColors: {},
  tocButtonSettings: {},
  tocButtonLabels: {},
};

const ANALYSIS_HEADING_ENTRIES = ANALYSIS_SECTION_HEADINGS.map((entry, index) => ({
  key: normalizeAnalysisHeadingText(entry.heading),
  label: entry.label,
  index,
}));

function cloneDefaultHighlightRules() {
  return DEFAULT_HIGHLIGHT_RULES.map((rule) => ({
    ...rule,
    matchStrings: [...rule.matchStrings],
    companionWords: [...rule.companionWords],
  }));
}

function createRuleId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeAnalysisHeadingText(value) {
  return (typeof value === "string" ? value : "")
    .replace(/^\s*#+\s*/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .replace(/[:.]+$/g, "")
    .trim()
    .toLocaleLowerCase();
}

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

function normalizeStringList(value) {
  const rawValues = Array.isArray(value)
    ? value
    : (typeof value === "string" ? value.split(/\r?\n/) : []);
  const seenValues = new Set();

  return rawValues
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase();
      if (seenValues.has(key)) {
        return false;
      }

      seenValues.add(key);
      return true;
    });
}

function isExcludedMatchString(value) {
  return typeof value === "string" && value.trim().startsWith("--");
}

function getPositiveMatchStrings(matchStrings) {
  return Array.isArray(matchStrings)
    ? matchStrings.filter((value) => !isExcludedMatchString(value))
    : [];
}

function getExcludedMatchStrings(matchStrings) {
  return Array.isArray(matchStrings)
    ? matchStrings.filter(isExcludedMatchString)
    : [];
}

function sanitizeColor(value, fallback = "#facc15") {
  const rawValue = typeof value === "string" ? value.trim() : "";
  const shortHexMatch = rawValue.match(/^#([0-9a-f]{3})$/i);
  if (shortHexMatch) {
    return `#${shortHexMatch[1].split("").map((character) => `${character}${character}`).join("")}`.toLocaleLowerCase();
  }

  if (/^#[0-9a-f]{6}$/i.test(rawValue)) {
    return rawValue.toLocaleLowerCase();
  }

  return fallback;
}

function normalizeHexColorValue(value, fallback = "#facc15") {
  const rawValue = typeof value === "string" ? value.trim() : "";
  if (!rawValue) {
    return fallback;
  }

  return sanitizeColor(rawValue.startsWith("#") ? rawValue : `#${rawValue}`, fallback);
}

function isValidHexColorValue(value) {
  const rawValue = typeof value === "string" ? value.trim() : "";
  return /^#?[0-9a-f]{3}$/i.test(rawValue) || /^#?[0-9a-f]{6}$/i.test(rawValue);
}

function setColorControlValue(colorInput, hexInput, value, fallback = "#facc15") {
  const normalizedColor = normalizeHexColorValue(value, fallback);
  colorInput.value = normalizedColor;
  hexInput.value = normalizedColor;
  return normalizedColor;
}

function bindColorControl(colorInput, hexInput, fallback, onChange) {
  const applyColor = (value) => {
    const normalizedColor = setColorControlValue(colorInput, hexInput, value, fallback);
    if (typeof onChange === "function") {
      onChange(normalizedColor);
    }
  };

  colorInput.addEventListener("input", () => {
    applyColor(colorInput.value);
  });

  hexInput.addEventListener("input", () => {
    if (isValidHexColorValue(hexInput.value)) {
      applyColor(hexInput.value);
    }
  });

  hexInput.addEventListener("blur", () => {
    if (isValidHexColorValue(hexInput.value)) {
      applyColor(hexInput.value);
      return;
    }

    setColorControlValue(colorInput, hexInput, colorInput.value, fallback);
  });
}

function getDefaultAnalysisTocButtonColors() {
  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => [entry.key, DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR]),
  );
}

function sanitizeAnalysisTocButtonColors(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  const defaults = getDefaultAnalysisTocButtonColors();

  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => [
      entry.key,
      sanitizeColor(source[entry.key], defaults[entry.key]),
    ]),
  );
}

function getDefaultAnalysisTocButtonLabels() {
  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => [entry.key, entry.label]),
  );
}

function sanitizeAnalysisTocButtonLabel(value, fallback) {
  const label = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return label ? label.slice(0, 120) : fallback;
}

function sanitizeAnalysisTocButtonLabels(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  const defaults = getDefaultAnalysisTocButtonLabels();

  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => [
      entry.key,
      sanitizeAnalysisTocButtonLabel(source[entry.key], defaults[entry.key]),
    ]),
  );
}

function getDefaultAnalysisTocButtonSettings() {
  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => [
      entry.key,
      {
        side: ANALYSIS_TOC_SIDE_LEFT,
        offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
      },
    ]),
  );
}

function sanitizeAnalysisTocButtonSide(value) {
  return ANALYSIS_TOC_ALLOWED_SIDES.has(value) ? value : ANALYSIS_TOC_SIDE_LEFT;
}

function sanitizeAnalysisTocButtonOffset(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return ANALYSIS_TOC_DEFAULT_OFFSET_PX;
  }

  return Math.min(
    ANALYSIS_TOC_MAX_OFFSET_PX,
    Math.max(ANALYSIS_TOC_MIN_OFFSET_PX, parsedValue),
  );
}

function sanitizeAnalysisTocButtonSettings(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  const defaults = getDefaultAnalysisTocButtonSettings();

  return Object.fromEntries(
    ANALYSIS_HEADING_ENTRIES.map((entry) => {
      const rawEntry = source[entry.key] && typeof source[entry.key] === "object"
        ? source[entry.key]
        : {};
      const defaultEntry = defaults[entry.key];

      return [
        entry.key,
        {
          side: sanitizeAnalysisTocButtonSide(rawEntry.side ?? defaultEntry.side),
          offsetPx: sanitizeAnalysisTocButtonOffset(rawEntry.offsetPx ?? defaultEntry.offsetPx),
        },
      ];
    }),
  );
}

function sanitizeHighlightRule(rawRule, index = 0) {
  const fallbackRule = DEFAULT_HIGHLIGHT_RULES[index % DEFAULT_HIGHLIGHT_RULES.length] ?? DEFAULT_HIGHLIGHT_RULES[0];
  const matchStrings = normalizeStringList(rawRule?.matchStrings ?? rawRule?.matchedStrings ?? rawRule?.matches);
  const positiveMatchStrings = getPositiveMatchStrings(matchStrings);
  if (positiveMatchStrings.length === 0) {
    return null;
  }

  const companionWords = normalizeStringList(rawRule?.companionWords ?? rawRule?.prefixWords ?? rawRule?.nearbyWords);
  const parsedDistance = Number.parseInt(`${rawRule?.companionDistance ?? rawRule?.distance ?? 0}`, 10);
  const companionDistance = Number.isFinite(parsedDistance) && parsedDistance > 0
    ? Math.min(parsedDistance, 20)
    : 0;
  const label = typeof rawRule?.label === "string" && rawRule.label.trim()
    ? rawRule.label.trim()
    : (typeof rawRule?.name === "string" && rawRule.name.trim() ? rawRule.name.trim() : positiveMatchStrings[0]);

  return {
    id: typeof rawRule?.id === "string" && rawRule.id.trim() ? rawRule.id.trim() : createRuleId(),
    label,
    color: sanitizeColor(rawRule?.color, fallbackRule.color),
    matchStrings,
    companionWords,
    companionDistance,
    enabled: rawRule?.enabled !== false,
  };
}

function sanitizeHighlightRules(rawRules) {
  const sourceRules = Array.isArray(rawRules) ? rawRules : cloneDefaultHighlightRules();

  return sourceRules
    .map((rule, index) => sanitizeHighlightRule(rule, index))
    .filter(Boolean);
}

function getRuleFormValue() {
  const ruleId = document.querySelector("#highlight-rule-id").value.trim();
  const rawRule = {
    id: ruleId || createRuleId(),
    label: document.querySelector("#highlight-rule-label").value,
    color: document.querySelector("#highlight-rule-color").value,
    matchStrings: normalizeStringList(document.querySelector("#highlight-rule-matches").value),
    companionWords: normalizeStringList(document.querySelector("#highlight-rule-companions").value),
    companionDistance: document.querySelector("#highlight-rule-distance").value,
    enabled: document.querySelector("#highlight-rule-enabled").checked,
  };

  return sanitizeHighlightRule(rawRule);
}

function setStatus(message) {
  document.querySelector("#status").textContent = message;
}

function fillRuleForm(rule) {
  const colorInput = document.querySelector("#highlight-rule-color");
  const hexInput = document.querySelector("#highlight-rule-color-hex");
  document.querySelector("#highlight-rule-id").value = rule?.id ?? "";
  document.querySelector("#highlight-rule-label").value = rule?.label ?? "";
  setColorControlValue(colorInput, hexInput, rule?.color, "#facc15");
  document.querySelector("#highlight-rule-matches").value = Array.isArray(rule?.matchStrings) ? rule.matchStrings.join("\n") : "";
  document.querySelector("#highlight-rule-companions").value = Array.isArray(rule?.companionWords) ? rule.companionWords.join("\n") : "";
  document.querySelector("#highlight-rule-distance").value = String(Number.isFinite(rule?.companionDistance) ? rule.companionDistance : 0);
  document.querySelector("#highlight-rule-enabled").checked = rule?.enabled !== false;
  document.querySelector("#save-highlight-rule").textContent = rule?.id ? "Update rule" : "Create rule";
}

function clearRuleForm() {
  fillRuleForm({
    id: "",
    label: "",
    color: "#facc15",
    matchStrings: [],
    companionWords: ["low", "mid", "high"],
    companionDistance: 0,
    enabled: true,
  });
}

function createRuleSummary(rule) {
  const targetSummary = getPositiveMatchStrings(rule.matchStrings).join(", ");
  const excludedMatches = getExcludedMatchStrings(rule.matchStrings);
  const exclusionSummary = excludedMatches.length > 0
    ? ` | Excludes ${excludedMatches.map((value) => value.replace(/^--\s*/, "")).join(", ")}`
    : "";
  const companionSummary = rule.companionWords.length > 0
    ? `${rule.companionWords.join(", ")} adjacent, range ${rule.companionDistance}`
    : "No included adjacent terms";

  return `${targetSummary}${exclusionSummary} | ${companionSummary}`;
}

function renderHighlightRules() {
  const list = document.querySelector("#highlight-rules-list");
  list.replaceChildren();

  if (highlightState.rules.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "No highlight rules are configured.";
    list.append(emptyMessage);
    return;
  }

  for (const rule of highlightState.rules) {
    const item = document.createElement("article");
    item.className = "rule-row";

    const swatch = document.createElement("span");
    swatch.className = "rule-swatch";
    swatch.style.backgroundColor = rule.color;

    const body = document.createElement("div");
    body.className = "rule-body";

    const title = document.createElement("h3");
    title.textContent = rule.label;

    const summary = document.createElement("p");
    summary.textContent = createRuleSummary(rule);

    const state = document.createElement("p");
    state.className = "rule-state";
    state.textContent = rule.enabled ? "Enabled" : "Disabled";

    body.append(title, summary, state);

    const actions = document.createElement("div");
    actions.className = "rule-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      fillRuleForm(rule);
      setStatus(`Editing ${rule.label}.`);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      void deleteHighlightRule(rule.id);
    });

    actions.append(editButton, deleteButton);
    item.append(swatch, body, actions);
    list.append(item);
  }
}

function renderAnalysisTocSettings() {
  const list = document.querySelector("#analysis-toc-settings-list");
  if (!list) {
    return;
  }

  list.replaceChildren();

  for (const headingEntry of ANALYSIS_HEADING_ENTRIES) {
    const settings = highlightState.tocButtonSettings[headingEntry.key] ?? {
      side: ANALYSIS_TOC_SIDE_LEFT,
      offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
    };
    const row = document.createElement("div");
    row.className = "toc-settings-row";

    const labelInput = document.createElement("input");
    labelInput.id = `analysis-toc-label-${headingEntry.index}`;
    labelInput.className = "toc-label-input";
    labelInput.type = "text";
    labelInput.autocomplete = "off";
    labelInput.spellcheck = false;
    labelInput.dataset.headingKey = headingEntry.key;
    labelInput.value = sanitizeAnalysisTocButtonLabel(
      highlightState.tocButtonLabels[headingEntry.key],
      headingEntry.label,
    );
    labelInput.placeholder = headingEntry.label;
    labelInput.title = `Button for heading: ${headingEntry.heading}`;
    labelInput.setAttribute("aria-label", `${headingEntry.heading} button name`);
    labelInput.addEventListener("input", () => {
      highlightState.tocButtonLabels[headingEntry.key] = labelInput.value;
    });
    labelInput.addEventListener("blur", () => {
      const normalizedLabel = sanitizeAnalysisTocButtonLabel(labelInput.value, headingEntry.label);
      labelInput.value = normalizedLabel;
      highlightState.tocButtonLabels[headingEntry.key] = normalizedLabel;
    });

    const input = document.createElement("input");
    input.id = `analysis-toc-color-${headingEntry.index}`;
    input.type = "color";
    input.dataset.headingKey = headingEntry.key;

    const hexInput = document.createElement("input");
    hexInput.className = "hex-color-input";
    hexInput.type = "text";
    hexInput.autocomplete = "off";
    hexInput.spellcheck = false;
    hexInput.setAttribute("aria-label", `${headingEntry.label} hex color`);

    const colorControl = document.createElement("span");
    colorControl.className = "color-control";
    colorControl.append(input, hexInput);

    const colorLabel = document.createElement("label");
    colorLabel.className = "toc-control toc-color-control";
    colorLabel.htmlFor = input.id;
    const colorLabelText = document.createElement("span");
    colorLabelText.textContent = "Color";
    colorLabel.append(colorLabelText, colorControl);

    setColorControlValue(
      input,
      hexInput,
      highlightState.tocButtonColors[headingEntry.key] ?? DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR,
      DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR,
    );
    bindColorControl(input, hexInput, DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR, (color) => {
      highlightState.tocButtonColors[headingEntry.key] = color;
    });

    const sideSelect = document.createElement("select");
    sideSelect.id = `analysis-toc-side-${headingEntry.index}`;
    sideSelect.dataset.headingKey = headingEntry.key;
    sideSelect.append(
      new Option("Left", ANALYSIS_TOC_SIDE_LEFT),
      new Option("Right", ANALYSIS_TOC_SIDE_RIGHT),
    );
    sideSelect.value = sanitizeAnalysisTocButtonSide(settings.side);
    sideSelect.addEventListener("change", () => {
      const currentSettings = highlightState.tocButtonSettings[headingEntry.key] ?? {};
      highlightState.tocButtonSettings[headingEntry.key] = {
        ...currentSettings,
        side: sanitizeAnalysisTocButtonSide(sideSelect.value),
        offsetPx: sanitizeAnalysisTocButtonOffset(currentSettings.offsetPx),
      };
    });

    const sideLabel = document.createElement("label");
    sideLabel.className = "toc-control";
    sideLabel.htmlFor = sideSelect.id;
    const sideLabelText = document.createElement("span");
    sideLabelText.textContent = "Side";
    sideLabel.append(sideLabelText, sideSelect);

    const offsetInput = document.createElement("input");
    offsetInput.id = `analysis-toc-offset-${headingEntry.index}`;
    offsetInput.type = "number";
    offsetInput.step = "1";
    offsetInput.min = String(ANALYSIS_TOC_MIN_OFFSET_PX);
    offsetInput.max = String(ANALYSIS_TOC_MAX_OFFSET_PX);
    offsetInput.inputMode = "numeric";
    offsetInput.dataset.headingKey = headingEntry.key;
    offsetInput.value = String(sanitizeAnalysisTocButtonOffset(settings.offsetPx));
    offsetInput.addEventListener("input", () => {
      const currentSettings = highlightState.tocButtonSettings[headingEntry.key] ?? {};
      highlightState.tocButtonSettings[headingEntry.key] = {
        ...currentSettings,
        side: sanitizeAnalysisTocButtonSide(currentSettings.side),
        offsetPx: sanitizeAnalysisTocButtonOffset(offsetInput.value),
      };
    });
    offsetInput.addEventListener("blur", () => {
      offsetInput.value = String(sanitizeAnalysisTocButtonOffset(offsetInput.value));
    });

    const offsetLabel = document.createElement("label");
    offsetLabel.className = "toc-control";
    offsetLabel.htmlFor = offsetInput.id;
    const offsetLabelText = document.createElement("span");
    offsetLabelText.textContent = "Offset px";
    offsetLabel.append(offsetLabelText, offsetInput);

    const controls = document.createElement("span");
    controls.className = "toc-settings-controls";
    controls.append(colorLabel, sideLabel, offsetLabel);

    row.append(labelInput, controls);
    list.append(row);
  }
}

async function saveHighlightRules(message = "Highlight rules saved.") {
  await chrome.storage.sync.set({
    [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
  });
  renderHighlightRules();
  setStatus(message);
}

async function upsertHighlightRule() {
  const rule = getRuleFormValue();
  if (!rule) {
    setStatus("Add at least one non-excluded matched string before saving a rule.");
    return;
  }

  const existingIndex = highlightState.rules.findIndex((existingRule) => existingRule.id === rule.id);
  if (existingIndex >= 0) {
    highlightState.rules.splice(existingIndex, 1, rule);
  } else {
    highlightState.rules.push(rule);
  }

  fillRuleForm(rule);
  await saveHighlightRules(`${rule.label} saved.`);
}

async function deleteHighlightRule(ruleId) {
  const rule = highlightState.rules.find((candidate) => candidate.id === ruleId);
  highlightState.rules = highlightState.rules.filter((candidate) => candidate.id !== ruleId);
  const editingRuleId = document.querySelector("#highlight-rule-id").value;
  if (editingRuleId === ruleId) {
    clearRuleForm();
  }

  await saveHighlightRules(rule ? `${rule.label} deleted.` : "Rule deleted.");
}

async function loadOptions() {
  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
    [STORAGE_KEY_HIGHLIGHT_RULES]: null,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: null,
  });

  const defaultStartPageUrl = sanitizeStartPageUrl(stored[STORAGE_KEY_START_PAGE_URL]);
  const resetLimit = sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]);
  highlightState.rules = sanitizeHighlightRules(stored[STORAGE_KEY_HIGHLIGHT_RULES]);
  highlightState.tocButtonColors = sanitizeAnalysisTocButtonColors(stored[STORAGE_KEY_ANALYSIS_TOC_COLORS]);
  highlightState.tocButtonSettings = sanitizeAnalysisTocButtonSettings(stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]);
  highlightState.tocButtonLabels = sanitizeAnalysisTocButtonLabels(stored[STORAGE_KEY_ANALYSIS_TOC_LABELS]);

  document.querySelector("#default-start-page-url").value = defaultStartPageUrl;
  document.querySelector("#reset-limit").value = String(resetLimit);
  clearRuleForm();
  renderHighlightRules();
  renderAnalysisTocSettings();
}

async function saveOptions(event) {
  event.preventDefault();

  const defaultStartPageUrl = sanitizeStartPageUrl(document.querySelector("#default-start-page-url").value);
  const resetLimit = sanitizeResetLimit(document.querySelector("#reset-limit").value);
  const tocButtonColors = sanitizeAnalysisTocButtonColors(highlightState.tocButtonColors);
  const tocButtonSettings = sanitizeAnalysisTocButtonSettings(highlightState.tocButtonSettings);
  const tocButtonLabels = sanitizeAnalysisTocButtonLabels(highlightState.tocButtonLabels);

  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: defaultStartPageUrl,
    [STORAGE_KEY_RESET_LIMIT]: resetLimit,
    [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: tocButtonColors,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: tocButtonSettings,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: tocButtonLabels,
  });

  highlightState.tocButtonColors = tocButtonColors;
  highlightState.tocButtonSettings = tocButtonSettings;
  highlightState.tocButtonLabels = tocButtonLabels;
  document.querySelector("#default-start-page-url").value = defaultStartPageUrl;
  document.querySelector("#reset-limit").value = String(resetLimit);
  renderAnalysisTocSettings();
  setStatus("Settings saved.");
}

async function restoreDefaults() {
  const defaultRules = cloneDefaultHighlightRules();
  const defaultTocButtonColors = getDefaultAnalysisTocButtonColors();
  const defaultTocButtonSettings = getDefaultAnalysisTocButtonSettings();
  const defaultTocButtonLabels = getDefaultAnalysisTocButtonLabels();
  document.querySelector("#default-start-page-url").value = DEFAULT_START_PAGE_URL;
  document.querySelector("#reset-limit").value = String(DEFAULT_RESET_LIMIT);
  highlightState.rules = sanitizeHighlightRules(defaultRules);
  highlightState.tocButtonColors = defaultTocButtonColors;
  highlightState.tocButtonSettings = defaultTocButtonSettings;
  highlightState.tocButtonLabels = defaultTocButtonLabels;
  clearRuleForm();
  renderHighlightRules();
  renderAnalysisTocSettings();

  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
    [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: highlightState.tocButtonColors,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: highlightState.tocButtonSettings,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: highlightState.tocButtonLabels,
  });
  setStatus("Defaults restored.");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#options-form");
  const resetButton = document.querySelector("#reset-defaults");
  const saveRuleButton = document.querySelector("#save-highlight-rule");
  const clearRuleButton = document.querySelector("#clear-highlight-rule");
  const highlightColorInput = document.querySelector("#highlight-rule-color");
  const highlightHexInput = document.querySelector("#highlight-rule-color-hex");

  void loadOptions();
  bindColorControl(highlightColorInput, highlightHexInput, "#facc15");
  form.addEventListener("submit", (event) => {
    void saveOptions(event);
  });
  resetButton.addEventListener("click", () => {
    void restoreDefaults();
  });
  saveRuleButton.addEventListener("click", () => {
    void upsertHighlightRule();
  });
  clearRuleButton.addEventListener("click", () => {
    clearRuleForm();
    setStatus("Ready for a new rule.");
  });
});
