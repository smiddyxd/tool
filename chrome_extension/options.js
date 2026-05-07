const CHATGPT_PROJECT_URL_PREFIX = "https://chatgpt.com/g/g-p-";
const DEFAULT_PROJECT_ID = "69bc1388b0588191bd1c176e83f018e4";
const DEFAULT_START_PAGE_URL = `${CHATGPT_PROJECT_URL_PREFIX}${DEFAULT_PROJECT_ID}`;
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
const ANALYSIS_TOC_DEFAULT_LEFT_X_PX = 224;
const ANALYSIS_TOC_DEFAULT_RIGHT_INSET_PX = 18;
const ANALYSIS_TOC_MIN_COLUMN_POSITION_PX = 0;
const ANALYSIS_TOC_MAX_COLUMN_POSITION_PX = 5000;
const ANALYSIS_TOC_DEFAULT_IDLE_OPACITY = 1;
const ANALYSIS_TOC_MIN_IDLE_OPACITY = 0.05;
const ANALYSIS_TOC_MAX_IDLE_OPACITY = 1;
const ANALYSIS_TOC_SIDE_LEFT = "left";
const ANALYSIS_TOC_SIDE_RIGHT = "right";
const ANALYSIS_TOC_ALLOWED_SIDES = new Set([ANALYSIS_TOC_SIDE_LEFT, ANALYSIS_TOC_SIDE_RIGHT]);
const ANALYSIS_TOC_DEFAULT_OFFSET_PX = 0;
const ANALYSIS_TOC_MIN_OFFSET_PX = -2000;
const ANALYSIS_TOC_MAX_OFFSET_PX = 2000;
const LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS = 3;
const LATEST_PROMPT_SCROLL_MIN_HOLD_SECONDS = 0;
const LATEST_PROMPT_SCROLL_MAX_HOLD_SECONDS = 60;
const ANALYSIS_TOC_ENTRY_TYPE_HEADING = "heading";
const ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT = "latestUserPrompt";
const LATEST_USER_PROMPT_TOC_KEY = "latest-user-prompt";
const ANALYSIS_SECTION_HEADINGS = [
  {
    key: LATEST_USER_PROMPT_TOC_KEY,
    heading: "Latest prompt",
    label: "Latest prompt",
    type: ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT,
  },
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
const STORAGE_KEY_PROJECT_IDS = "projectIds";
const STORAGE_KEY_ACTIVE_PROJECT_ID = "activeProjectId";
const STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE = "activeBridgeTaskType";
const STORAGE_KEY_TASK_TYPE_PROJECT_IDS = "taskTypeProjectIds";
const STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = "taskTypeActiveProjectAccounts";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";
const STORAGE_KEY_HIGHLIGHT_RULES = "highlightRules";
const STORAGE_KEY_ANALYSIS_TOC_COLORS = "analysisTocButtonColors";
const STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS = "analysisTocButtonSettings";
const STORAGE_KEY_ANALYSIS_TOC_LABELS = "analysisTocButtonLabels";
const STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS = "analysisTocColumnPositions";
const STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY = "analysisTocColumnOpacity";
const STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER = "analysisTocButtonOrder";
const STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS = "latestPromptScrollHoldSeconds";
const STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS = "serverControlTaskTypeDefinitions";
const BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS = "search-experience-to-product-usefulness";
const TASK_REGION_KIND_OCR = "ocr";
const TASK_REGION_KIND_SCREENSHOT = "full-task-screenshot";
const TASK_REGION_KIND_GOOGLE_RESULTS = "google-results";
const TASK_ACTION_OCR = "ocr";
const TASK_ACTION_SCREENSHOT = "screenshot";
const TASK_ACTION_GOOGLE_SEARCH = "googleSearch";
const TASK_ACTION_KEYS = [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_GOOGLE_SEARCH];
const TASK_ACTION_LABELS = {
  [TASK_ACTION_OCR]: "OCR",
  [TASK_ACTION_SCREENSHOT]: "Screenshot",
  [TASK_ACTION_GOOGLE_SEARCH]: "Google search",
};
const FULL_TASK_SCREENSHOT_REGION = {
  key: "fullTaskScreenshot",
  label: "Full task screenshot",
  kind: TASK_REGION_KIND_SCREENSHOT,
};
const GOOGLE_RESULTS_REGION = {
  key: "googleResults",
  label: "Google results",
  kind: TASK_REGION_KIND_GOOGLE_RESULTS,
};
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
const DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS = [
  {
    key: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    label: "Search Experience to Product Usefulness",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_GOOGLE_SEARCH],
    regions: [
      { key: "query", label: "Query", kind: TASK_REGION_KIND_OCR },
      { key: "productCard", label: "Product card", kind: TASK_REGION_KIND_OCR },
      { key: "productDescription", label: "Product description", kind: TASK_REGION_KIND_OCR },
      GOOGLE_RESULTS_REGION,
      FULL_TASK_SCREENSHOT_REGION,
    ],
    boilerplatePrompt: `The attached screenshot contains a Search Experience to Product Usefulness task.

Query: [query]
Product card: [product card]
Product description: [product description]
Google results: [google results]

Use the screenshot and any OCR text above to judge how useful the product is for satisfying the search experience. Base the answer on the visible screenshot evidence and bridge-provided OCR text.`,
  },
  {
    key: "get-rich-quick",
    label: "Get Rich Quick",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT],
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
    ],
    boilerplatePrompt: `The attached screenshot contains a Get Rich Quick task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Get Rich Quick criteria. Keep the reasoning tied to the visible task evidence.`,
  },
  {
    key: "video-games",
    label: "Video Games",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT],
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
    ],
    boilerplatePrompt: `The attached screenshot contains a Video Games task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Video Games criteria. Keep the reasoning tied to the visible task evidence.`,
  },
  {
    key: "weight-loss",
    label: "Weight Loss",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT],
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
    ],
    boilerplatePrompt: `The attached screenshot contains a Weight Loss task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Weight Loss criteria. Keep the reasoning tied to the visible task evidence.`,
  },
];
const DEFAULT_TASK_TYPE_PROJECT_IDS = Object.fromEntries(
  DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS.map((definition) => [
    definition.key,
    {
      [PROJECT_ACCOUNT_DEFAULT_KEY]: DEFAULT_PROJECT_ID,
      aoizxcaoi: "",
    },
  ]),
);
const DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = Object.fromEntries(
  DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS.map((definition) => [definition.key, PROJECT_ACCOUNT_DEFAULT_KEY]),
);

const highlightState = {
  rules: [],
  activeBridgeTaskType: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
  taskTypeDefinitions: DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS,
  taskTypeProjectIds: DEFAULT_TASK_TYPE_PROJECT_IDS,
  taskTypeActiveProjectAccounts: DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
  tocButtonColors: {},
  tocButtonSettings: {},
  tocButtonLabels: {},
  tocButtonOrder: [],
  tocColumnPositions: {
    leftPx: ANALYSIS_TOC_DEFAULT_LEFT_X_PX,
    rightInsetPx: ANALYSIS_TOC_DEFAULT_RIGHT_INSET_PX,
  },
  tocColumnOpacity: {
    [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
    [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
  },
  latestPromptScrollHoldSeconds: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
};

const ANALYSIS_HEADING_ENTRIES = ANALYSIS_SECTION_HEADINGS.map((entry, index) => ({
  key: entry.key ?? normalizeAnalysisHeadingText(entry.heading),
  heading: entry.heading,
  label: entry.label,
  type: entry.type ?? ANALYSIS_TOC_ENTRY_TYPE_HEADING,
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

function cloneTaskTypeDefinitions(definitions = DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS) {
  return definitions.map((definition) => ({
    ...definition,
    actions: Array.isArray(definition.actions) ? [...definition.actions] : [],
    regions: Array.isArray(definition.regions)
      ? definition.regions.map((region) => ({ ...region }))
      : [],
  }));
}

function normalizeTaskConfigText(value, fallback = "") {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return text || fallback;
}

function createTaskConfigKey(value, fallbackPrefix = "task") {
  const rawValue = typeof value === "string" ? value : "";
  const normalized = rawValue
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `${fallbackPrefix}-${Date.now().toString(36)}`;
}

function makeUniqueTaskConfigKey(baseKey, usedKeys) {
  let candidateKey = baseKey;
  let suffix = 2;
  while (usedKeys.has(candidateKey)) {
    candidateKey = `${baseKey}-${suffix}`;
    suffix += 1;
  }
  usedKeys.add(candidateKey);
  return candidateKey;
}

function normalizeTaskActionKeys(rawValue) {
  const source = Array.isArray(rawValue) ? rawValue : [];
  const seenKeys = new Set();
  return source
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => TASK_ACTION_KEYS.includes(value))
    .filter((value) => {
      if (seenKeys.has(value)) {
        return false;
      }

      seenKeys.add(value);
      return true;
    });
}

function normalizeTaskRegionKind(value) {
  const kind = typeof value === "string" ? value.trim() : "";
  if ([TASK_REGION_KIND_OCR, TASK_REGION_KIND_SCREENSHOT, TASK_REGION_KIND_GOOGLE_RESULTS].includes(kind)) {
    return kind;
  }

  return TASK_REGION_KIND_OCR;
}

function getDefaultTaskRegionByKey(regionKey) {
  for (const taskDefinition of DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS) {
    for (const region of taskDefinition.regions) {
      if (region.key === regionKey) {
        return { ...region };
      }
    }
  }

  if (regionKey === FULL_TASK_SCREENSHOT_REGION.key) {
    return { ...FULL_TASK_SCREENSHOT_REGION };
  }
  if (regionKey === GOOGLE_RESULTS_REGION.key) {
    return { ...GOOGLE_RESULTS_REGION };
  }

  return null;
}

function sanitizeTaskRegionDefinition(rawRegion, fallbackLabel = "OCR region") {
  if (typeof rawRegion === "string") {
    const defaultRegion = getDefaultTaskRegionByKey(rawRegion);
    if (defaultRegion) {
      return defaultRegion;
    }

    const label = normalizeTaskConfigText(rawRegion, fallbackLabel);
    return {
      key: createTaskConfigKey(label, "region"),
      label,
      kind: TASK_REGION_KIND_OCR,
    };
  }

  const source = rawRegion && typeof rawRegion === "object" && !Array.isArray(rawRegion)
    ? rawRegion
    : {};
  const label = normalizeTaskConfigText(source.label, fallbackLabel);
  const kind = normalizeTaskRegionKind(source.kind);
  let key = normalizeTaskConfigText(source.key, "");

  if (kind === TASK_REGION_KIND_SCREENSHOT) {
    key = FULL_TASK_SCREENSHOT_REGION.key;
  } else if (kind === TASK_REGION_KIND_GOOGLE_RESULTS) {
    key = GOOGLE_RESULTS_REGION.key;
  } else {
    key = createTaskConfigKey(key || label, "region");
  }

  return { key, label, kind };
}

function hasTaskRegionKind(taskDefinition, kind) {
  return taskDefinition.regions.some((region) => region.kind === kind);
}

function getTaskRegionByKind(taskDefinition, kind) {
  return taskDefinition.regions.find((region) => region.kind === kind) ?? null;
}

function getTaskOcrRegions(taskDefinition) {
  return taskDefinition.regions.filter((region) => region.kind === TASK_REGION_KIND_OCR);
}

function ensureTaskDefinitionFeatures(taskDefinition) {
  const actions = new Set(normalizeTaskActionKeys(taskDefinition.actions));
  const regions = taskDefinition.regions.filter((region) => {
    if (region.key === FULL_TASK_SCREENSHOT_REGION.key) {
      return actions.has(TASK_ACTION_SCREENSHOT);
    }
    if (region.key === GOOGLE_RESULTS_REGION.key) {
      return actions.has(TASK_ACTION_GOOGLE_SEARCH);
    }

    return true;
  });

  if (actions.has(TASK_ACTION_SCREENSHOT) && !regions.some((region) => region.key === FULL_TASK_SCREENSHOT_REGION.key)) {
    regions.push({ ...FULL_TASK_SCREENSHOT_REGION });
  }

  if (actions.has(TASK_ACTION_GOOGLE_SEARCH) && !regions.some((region) => region.key === GOOGLE_RESULTS_REGION.key)) {
    regions.push({ ...GOOGLE_RESULTS_REGION });
  }

  if (actions.has(TASK_ACTION_OCR) && !regions.some((region) => region.kind === TASK_REGION_KIND_OCR)) {
    regions.push({ key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR });
  }

  return {
    ...taskDefinition,
    actions: Array.from(actions),
    regions,
  };
}

function sanitizeTaskTypeDefinitions(rawValue) {
  const sourceDefinitions = Array.isArray(rawValue) && rawValue.length > 0
    ? rawValue
    : cloneTaskTypeDefinitions();
  const usedTaskKeys = new Set();
  const sanitizedDefinitions = [];

  for (const [index, rawDefinition] of sourceDefinitions.entries()) {
    if (!rawDefinition || typeof rawDefinition !== "object" || Array.isArray(rawDefinition)) {
      continue;
    }

    const label = normalizeTaskConfigText(rawDefinition.label, `Task type ${index + 1}`);
    const baseKey = createTaskConfigKey(rawDefinition.key || label, "task");
    const key = makeUniqueTaskConfigKey(baseKey, usedTaskKeys);
    const rawRegions = Array.isArray(rawDefinition.regions) ? rawDefinition.regions : [];
    const seenRegionKeys = new Set();
    const regions = rawRegions
      .map((region, regionIndex) => sanitizeTaskRegionDefinition(region, `OCR region ${regionIndex + 1}`))
      .filter((region) => {
        if (!region?.key || seenRegionKeys.has(region.key)) {
          return false;
        }

        seenRegionKeys.add(region.key);
        return true;
      });
    const taskDefinition = ensureTaskDefinitionFeatures({
      key,
      label,
      actions: normalizeTaskActionKeys(rawDefinition.actions),
      regions,
      boilerplatePrompt: typeof rawDefinition.boilerplatePrompt === "string"
        ? rawDefinition.boilerplatePrompt.trim()
        : "",
    });

    sanitizedDefinitions.push(taskDefinition);
  }

  return sanitizedDefinitions.length > 0 ? sanitizedDefinitions : cloneTaskTypeDefinitions();
}

function getTaskTypeDefinitions() {
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(highlightState.taskTypeDefinitions);
  return highlightState.taskTypeDefinitions;
}

function getTaskTypeDefinition(taskTypeKey = highlightState.activeBridgeTaskType) {
  const definitions = getTaskTypeDefinitions();
  return definitions.find((definition) => definition.key === taskTypeKey) ?? definitions[0];
}

function getDefaultTaskTypeProjectIds(definitions = getTaskTypeDefinitions()) {
  return Object.fromEntries(
    definitions.map((definition) => [
      definition.key,
      Object.fromEntries(
        PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition) => [
          accountDefinition.key,
          accountDefinition.key === PROJECT_ACCOUNT_DEFAULT_KEY
            && definition.key === BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS
            ? DEFAULT_PROJECT_ID
            : "",
        ]),
      ),
    ]),
  );
}

function getDefaultTaskTypeActiveProjectAccounts(definitions = getTaskTypeDefinitions()) {
  return Object.fromEntries(
    definitions.map((definition) => [definition.key, PROJECT_ACCOUNT_DEFAULT_KEY]),
  );
}

function sanitizeTaskTypeProjectIds(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getTaskTypeDefinitions().map((definition) => {
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

function sanitizeBridgeTaskType(value) {
  const taskType = typeof value === "string" ? value.trim() : "";
  return getTaskTypeDefinitions().some((definition) => definition.key === taskType)
    ? taskType
    : getTaskTypeDefinitions()[0]?.key ?? BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS;
}

function sanitizeProjectAccountKey(value) {
  const accountKey = typeof value === "string" ? value.trim() : "";
  return PROJECT_ACCOUNT_DEFINITIONS.some((definition) => definition.key === accountKey)
    ? accountKey
    : PROJECT_ACCOUNT_DEFAULT_KEY;
}

function sanitizeTaskTypeActiveProjectAccounts(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getTaskTypeDefinitions().map((definition) => [
      definition.key,
      sanitizeProjectAccountKey(source[definition.key]),
    ]),
  );
}

function getProjectIdForTaskTypeAccount(taskType, accountKey) {
  const taskProjects = highlightState.taskTypeProjectIds[taskType] ?? {};
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

function getProjectIdsForTaskType(taskType) {
  const taskProjects = highlightState.taskTypeProjectIds[taskType] ?? {};
  const projectIds = PROJECT_ACCOUNT_DEFINITIONS
    .map((accountDefinition) => sanitizeProjectId(taskProjects[accountDefinition.key]))
    .filter(Boolean);
  return projectIds.length > 0 ? projectIds : [DEFAULT_PROJECT_ID];
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

function getDefaultAnalysisTocButtonOrder() {
  return ANALYSIS_HEADING_ENTRIES.map((entry) => entry.key);
}

function sanitizeAnalysisTocButtonOrder(rawValue) {
  const defaultOrder = getDefaultAnalysisTocButtonOrder();
  const allowedKeys = new Set(defaultOrder);
  const seenKeys = new Set();
  const sourceOrder = Array.isArray(rawValue) ? rawValue : [];
  const orderedKeys = [];

  for (const value of sourceOrder) {
    if (typeof value !== "string" || !allowedKeys.has(value) || seenKeys.has(value)) {
      continue;
    }

    orderedKeys.push(value);
    seenKeys.add(value);
  }

  for (const key of defaultOrder) {
    if (!seenKeys.has(key)) {
      orderedKeys.push(key);
    }
  }

  return orderedKeys;
}

function getOrderedAnalysisHeadingEntries() {
  const entriesByKey = new Map(ANALYSIS_HEADING_ENTRIES.map((entry) => [entry.key, entry]));
  return sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder)
    .map((key) => entriesByKey.get(key))
    .filter(Boolean);
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

function getDefaultAnalysisTocColumnPositions() {
  return {
    leftPx: ANALYSIS_TOC_DEFAULT_LEFT_X_PX,
    rightInsetPx: ANALYSIS_TOC_DEFAULT_RIGHT_INSET_PX,
  };
}

function sanitizeAnalysisTocColumnPosition(value, fallback) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.min(
    ANALYSIS_TOC_MAX_COLUMN_POSITION_PX,
    Math.max(ANALYSIS_TOC_MIN_COLUMN_POSITION_PX, parsedValue),
  );
}

function sanitizeAnalysisTocColumnPositions(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  const defaults = getDefaultAnalysisTocColumnPositions();

  return {
    leftPx: sanitizeAnalysisTocColumnPosition(source.leftPx, defaults.leftPx),
    rightInsetPx: sanitizeAnalysisTocColumnPosition(source.rightInsetPx, defaults.rightInsetPx),
  };
}

function getDefaultAnalysisTocColumnOpacity() {
  return {
    [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
    [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
  };
}

function sanitizeAnalysisTocColumnOpacityValue(value, fallback) {
  const parsedValue = Number.parseFloat(`${value}`);
  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  const normalizedValue = parsedValue > 1 ? parsedValue / 100 : parsedValue;
  return Math.min(
    ANALYSIS_TOC_MAX_IDLE_OPACITY,
    Math.max(ANALYSIS_TOC_MIN_IDLE_OPACITY, normalizedValue),
  );
}

function sanitizeAnalysisTocColumnOpacity(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  const defaults = getDefaultAnalysisTocColumnOpacity();

  return {
    [ANALYSIS_TOC_SIDE_LEFT]: sanitizeAnalysisTocColumnOpacityValue(
      source[ANALYSIS_TOC_SIDE_LEFT],
      defaults[ANALYSIS_TOC_SIDE_LEFT],
    ),
    [ANALYSIS_TOC_SIDE_RIGHT]: sanitizeAnalysisTocColumnOpacityValue(
      source[ANALYSIS_TOC_SIDE_RIGHT],
      defaults[ANALYSIS_TOC_SIDE_RIGHT],
    ),
  };
}

function opacityToPercent(value) {
  return Math.round(sanitizeAnalysisTocColumnOpacityValue(value, ANALYSIS_TOC_DEFAULT_IDLE_OPACITY) * 100);
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

function sanitizeLatestPromptScrollHoldSeconds(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS;
  }

  return Math.min(
    LATEST_PROMPT_SCROLL_MAX_HOLD_SECONDS,
    Math.max(LATEST_PROMPT_SCROLL_MIN_HOLD_SECONDS, parsedValue),
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

function renderTaskTypeProjectIds() {
  highlightState.taskTypeProjectIds = sanitizeTaskTypeProjectIds(highlightState.taskTypeProjectIds);
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(
    highlightState.taskTypeActiveProjectAccounts,
  );
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(highlightState.activeBridgeTaskType);

  const taskBar = document.querySelector("#task-project-task-bar");
  if (taskBar instanceof HTMLElement) {
    taskBar.replaceChildren();
    for (const taskDefinition of getTaskTypeDefinitions()) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "task-project-task-button";
      button.textContent = taskDefinition.label;
      button.classList.toggle("active", taskDefinition.key === highlightState.activeBridgeTaskType);
      button.addEventListener("click", () => {
        syncTaskTypeProjectInputValues();
        highlightState.activeBridgeTaskType = taskDefinition.key;
        renderTaskTypeProjectIds();
        setStatus(`${taskDefinition.label} selected. Save settings to apply it.`);
      });
      taskBar.append(button);
    }
  }

  syncTaskTypeProjectInputs();
  renderTaskTypeProjectAccountChoices();
  renderTaskTypeConfiguration();
}

function syncTaskTypeProjectInputs() {
  const taskProjects = highlightState.taskTypeProjectIds[highlightState.activeBridgeTaskType] ?? {};
  for (const input of document.querySelectorAll("[data-project-account-input]")) {
    if (!(input instanceof HTMLInputElement)) {
      continue;
    }

    input.value = taskProjects[input.dataset.projectAccountInput] ?? "";
  }
}

function syncTaskTypeProjectInputValues() {
  const taskType = highlightState.activeBridgeTaskType;
  const nextTaskProjects = {
    ...(highlightState.taskTypeProjectIds[taskType] ?? {}),
  };

  for (const input of document.querySelectorAll("[data-project-account-input]")) {
    if (!(input instanceof HTMLInputElement)) {
      continue;
    }

    nextTaskProjects[input.dataset.projectAccountInput] = sanitizeProjectId(input.value);
  }

  highlightState.taskTypeProjectIds = {
    ...highlightState.taskTypeProjectIds,
    [taskType]: nextTaskProjects,
  };
}

function renderTaskTypeProjectAccountChoices() {
  const accountChoices = document.querySelector("#task-project-account-choices");
  if (!(accountChoices instanceof HTMLElement)) {
    return;
  }

  accountChoices.replaceChildren();
  const activeAccount = sanitizeProjectAccountKey(
    highlightState.taskTypeActiveProjectAccounts[highlightState.activeBridgeTaskType],
  );

  for (const accountDefinition of PROJECT_ACCOUNT_DEFINITIONS) {
    const projectId = highlightState.taskTypeProjectIds[highlightState.activeBridgeTaskType]?.[accountDefinition.key] ?? "";
    const label = document.createElement("label");
    label.className = "task-project-account-choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "task-project-active-account";
    input.value = accountDefinition.key;
    input.checked = activeAccount === accountDefinition.key;
    input.addEventListener("change", () => {
      if (!input.checked) {
        return;
      }

      syncTaskTypeProjectInputValues();
      highlightState.taskTypeActiveProjectAccounts[highlightState.activeBridgeTaskType] = accountDefinition.key;
      renderTaskTypeProjectAccountChoices();
      setStatus(`${accountDefinition.label} selected for this task type. Save settings to apply it.`);
    });

    const text = document.createElement("span");
    text.textContent = `${accountDefinition.label}: ${projectId || "(missing project ID)"}`;

    label.append(input, text);
    accountChoices.append(label);
  }
}

function getTaskTypeProjectSettingsFromInputs() {
  syncTaskTypeProjectInputValues();
  return {
    taskTypeProjectIds: sanitizeTaskTypeProjectIds(highlightState.taskTypeProjectIds),
    taskTypeActiveProjectAccounts: sanitizeTaskTypeActiveProjectAccounts(
      highlightState.taskTypeActiveProjectAccounts,
    ),
  };
}

function getPromptPlaceholderText(region) {
  const label = normalizeTaskConfigText(region?.label, region?.key ?? "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
  return label ? `[${label}]` : "";
}

function setTaskActionEnabled(taskDefinition, actionKey, enabled) {
  const actions = new Set(normalizeTaskActionKeys(taskDefinition.actions));
  if (enabled) {
    actions.add(actionKey);
  } else {
    actions.delete(actionKey);
  }

  let regions = [...taskDefinition.regions];
  if (actionKey === TASK_ACTION_SCREENSHOT && enabled) {
    regions = regions.some((region) => region.key === FULL_TASK_SCREENSHOT_REGION.key)
      ? regions
      : [...regions, { ...FULL_TASK_SCREENSHOT_REGION }];
  } else if (actionKey === TASK_ACTION_SCREENSHOT && !enabled) {
    regions = regions.filter((region) => region.key !== FULL_TASK_SCREENSHOT_REGION.key);
  }
  if (actionKey === TASK_ACTION_GOOGLE_SEARCH && enabled) {
    regions = regions.some((region) => region.key === GOOGLE_RESULTS_REGION.key)
      ? regions
      : [...regions, { ...GOOGLE_RESULTS_REGION }];
  } else if (actionKey === TASK_ACTION_GOOGLE_SEARCH && !enabled) {
    regions = regions.filter((region) => region.key !== GOOGLE_RESULTS_REGION.key);
  }
  if (actionKey === TASK_ACTION_OCR && enabled && !regions.some((region) => region.kind === TASK_REGION_KIND_OCR)) {
    regions = [...regions, { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR }];
  }

  return ensureTaskDefinitionFeatures({
    ...taskDefinition,
    actions: Array.from(actions),
    regions,
  });
}

function updateActiveTaskTypeDefinition(updater) {
  syncTaskTypeProjectInputValues();
  syncTaskTypeDefinitionEditorValues();
  const activeTaskType = sanitizeBridgeTaskType(highlightState.activeBridgeTaskType);
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(
    getTaskTypeDefinitions().map((definition) => (
      definition.key === activeTaskType ? updater(definition) : definition
    )),
  );
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(activeTaskType);
  highlightState.taskTypeProjectIds = sanitizeTaskTypeProjectIds(highlightState.taskTypeProjectIds);
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(
    highlightState.taskTypeActiveProjectAccounts,
  );
  renderTaskTypeProjectIds();
  renderTaskTypeConfiguration();
}

function syncTaskTypeDefinitionEditorValues() {
  const activeTaskType = highlightState.activeBridgeTaskType;
  const labelInput = document.querySelector("#task-type-label");
  const promptInput = document.querySelector("#task-type-boilerplate-prompt");
  if (!(labelInput instanceof HTMLInputElement) && !(promptInput instanceof HTMLTextAreaElement)) {
    return;
  }

  highlightState.taskTypeDefinitions = getTaskTypeDefinitions().map((definition) => {
    if (definition.key !== activeTaskType) {
      return definition;
    }

    return {
      ...definition,
      label: labelInput instanceof HTMLInputElement
        ? normalizeTaskConfigText(labelInput.value, definition.label)
        : definition.label,
      boilerplatePrompt: promptInput instanceof HTMLTextAreaElement
        ? promptInput.value
        : definition.boilerplatePrompt,
    };
  });
}

function insertTextAtCursor(textArea, text) {
  const start = textArea.selectionStart ?? textArea.value.length;
  const end = textArea.selectionEnd ?? textArea.value.length;
  textArea.value = `${textArea.value.slice(0, start)}${text}${textArea.value.slice(end)}`;
  const cursorPosition = start + text.length;
  textArea.focus();
  textArea.setSelectionRange(cursorPosition, cursorPosition);
  syncTaskTypeDefinitionEditorValues();
}

function renderPromptPlaceholderButtons(taskDefinition) {
  const container = document.querySelector("#task-type-placeholder-buttons");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  container.replaceChildren();
  const placeholderRegions = taskDefinition.regions.filter((region) => (
    region.kind === TASK_REGION_KIND_OCR || region.kind === TASK_REGION_KIND_GOOGLE_RESULTS
  ));
  if (placeholderRegions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "hint";
    empty.textContent = "Add an OCR region to get prompt placeholder buttons.";
    container.append(empty);
    return;
  }

  const promptInput = document.querySelector("#task-type-boilerplate-prompt");
  for (const region of placeholderRegions) {
    const placeholder = getPromptPlaceholderText(region);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = placeholder;
    button.addEventListener("click", () => {
      if (promptInput instanceof HTMLTextAreaElement) {
        insertTextAtCursor(promptInput, placeholder);
        setStatus(`${placeholder} inserted. Save settings to apply it.`);
      }
    });
    container.append(button);
  }
}

function renderOcrRegionEditor(taskDefinition) {
  const list = document.querySelector("#task-type-ocr-regions");
  if (!(list instanceof HTMLElement)) {
    return;
  }

  list.replaceChildren();
  const ocrRegions = getTaskOcrRegions(taskDefinition);
  if (ocrRegions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "OCR is enabled with no regions. Add at least one OCR region before saving.";
    list.append(empty);
    return;
  }

  for (const region of ocrRegions) {
    const row = document.createElement("div");
    row.className = "ocr-region-row";

    const label = document.createElement("label");
    label.textContent = "Region label";

    const input = document.createElement("input");
    input.type = "text";
    input.value = region.label;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.addEventListener("input", () => {
      const nextLabel = normalizeTaskConfigText(input.value, region.label);
      highlightState.taskTypeDefinitions = getTaskTypeDefinitions().map((definition) => {
        if (definition.key !== taskDefinition.key) {
          return definition;
        }

        return {
          ...definition,
          regions: definition.regions.map((candidate) => (
            candidate.key === region.key
              ? {
                  ...candidate,
                  label: nextLabel,
                }
              : candidate
          )),
        };
      });
      setStatus("OCR region label changed. Save settings to apply it.");
      placeholder.textContent = getPromptPlaceholderText({ ...region, label: nextLabel });
      renderPromptPlaceholderButtons(getTaskTypeDefinition(taskDefinition.key));
    });

    label.append(input);

    const placeholder = document.createElement("code");
    placeholder.textContent = getPromptPlaceholderText(region);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      updateActiveTaskTypeDefinition((definition) => ({
        ...definition,
        regions: definition.regions.filter((candidate) => candidate.key !== region.key),
      }));
      setStatus(`${region.label} deleted. Save settings to apply it.`);
    });

    row.append(label, placeholder, deleteButton);
    list.append(row);
  }
}

function renderTaskTypeConfiguration() {
  const taskDefinition = getTaskTypeDefinition();
  const labelInput = document.querySelector("#task-type-label");
  const keyText = document.querySelector("#task-type-key");
  const promptInput = document.querySelector("#task-type-boilerplate-prompt");
  const screenshotInput = document.querySelector("#task-type-enable-screenshot");
  const googleInput = document.querySelector("#task-type-enable-google-results");
  const ocrInput = document.querySelector("#task-type-enable-ocr");
  const deleteButton = document.querySelector("#delete-task-type");

  if (labelInput instanceof HTMLInputElement) {
    labelInput.value = taskDefinition.label;
  }
  if (keyText instanceof HTMLElement) {
    keyText.textContent = taskDefinition.key;
  }
  if (promptInput instanceof HTMLTextAreaElement) {
    promptInput.value = taskDefinition.boilerplatePrompt || "";
  }
  if (screenshotInput instanceof HTMLInputElement) {
    screenshotInput.checked = taskDefinition.actions.includes(TASK_ACTION_SCREENSHOT);
  }
  if (googleInput instanceof HTMLInputElement) {
    googleInput.checked = taskDefinition.actions.includes(TASK_ACTION_GOOGLE_SEARCH);
  }
  if (ocrInput instanceof HTMLInputElement) {
    ocrInput.checked = taskDefinition.actions.includes(TASK_ACTION_OCR);
  }
  if (deleteButton instanceof HTMLButtonElement) {
    deleteButton.disabled = getTaskTypeDefinitions().length <= 1;
  }

  renderOcrRegionEditor(taskDefinition);
  renderPromptPlaceholderButtons(taskDefinition);
}

function addTaskTypeDefinition() {
  syncTaskTypeProjectInputValues();
  syncTaskTypeDefinitionEditorValues();
  const usedKeys = new Set(getTaskTypeDefinitions().map((definition) => definition.key));
  const key = makeUniqueTaskConfigKey(createTaskConfigKey("New task type", "task"), usedKeys);
  const taskDefinition = {
    key,
    label: "New task type",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT],
    regions: [
      { ...FULL_TASK_SCREENSHOT_REGION },
      { key: `${key}-ocr`, label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
    ],
    boilerplatePrompt: `The attached screenshot contains a task.

Full task OCR: [full task ocr]

Use the screenshot and OCR text above to complete the task.`,
  };

  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions([
    ...getTaskTypeDefinitions(),
    taskDefinition,
  ]);
  highlightState.activeBridgeTaskType = key;
  highlightState.taskTypeProjectIds = {
    ...sanitizeTaskTypeProjectIds(highlightState.taskTypeProjectIds),
    [key]: Object.fromEntries(PROJECT_ACCOUNT_DEFINITIONS.map((definition) => [definition.key, ""])),
  };
  highlightState.taskTypeActiveProjectAccounts = {
    ...sanitizeTaskTypeActiveProjectAccounts(highlightState.taskTypeActiveProjectAccounts),
    [key]: PROJECT_ACCOUNT_DEFAULT_KEY,
  };
  renderTaskTypeProjectIds();
  renderTaskTypeConfiguration();
  setStatus("New task type added. Save settings to apply it.");
}

function deleteActiveTaskTypeDefinition() {
  const definitions = getTaskTypeDefinitions();
  if (definitions.length <= 1) {
    return;
  }

  const activeTaskType = highlightState.activeBridgeTaskType;
  const activeDefinition = getTaskTypeDefinition(activeTaskType);
  const nextDefinitions = definitions.filter((definition) => definition.key !== activeTaskType);
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(nextDefinitions);
  highlightState.activeBridgeTaskType = highlightState.taskTypeDefinitions[0].key;
  const nextProjectIds = { ...highlightState.taskTypeProjectIds };
  delete nextProjectIds[activeTaskType];
  highlightState.taskTypeProjectIds = sanitizeTaskTypeProjectIds(nextProjectIds);
  const nextAccounts = { ...highlightState.taskTypeActiveProjectAccounts };
  delete nextAccounts[activeTaskType];
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(nextAccounts);
  renderTaskTypeProjectIds();
  renderTaskTypeConfiguration();
  setStatus(`${activeDefinition.label} deleted. Save settings to apply it.`);
}

function addOcrRegionToActiveTaskType() {
  updateActiveTaskTypeDefinition((definition) => {
    const usedKeys = new Set(definition.regions.map((region) => region.key));
    const nextIndex = getTaskOcrRegions(definition).length + 1;
    const label = nextIndex === 1 ? "Full task OCR" : `OCR region ${nextIndex}`;
    return {
      ...definition,
      actions: Array.from(new Set([...definition.actions, TASK_ACTION_OCR])),
      regions: [
        ...definition.regions,
        {
          key: makeUniqueTaskConfigKey(createTaskConfigKey(label, "region"), usedKeys),
          label,
          kind: TASK_REGION_KIND_OCR,
        },
      ],
    };
  });
  setStatus("OCR region added. Save settings to apply it.");
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

function moveAnalysisTocButtonOrder(headingKey, direction) {
  const order = sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder);
  const currentIndex = order.indexOf(headingKey);
  const nextIndex = currentIndex + direction;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) {
    return;
  }

  [order[currentIndex], order[nextIndex]] = [order[nextIndex], order[currentIndex]];
  highlightState.tocButtonOrder = order;
  renderAnalysisTocSettings({
    focusDirection: direction,
    focusHeadingKey: headingKey,
    preserveScroll: true,
  });
  setStatus("TOC button order changed. Save settings to apply it.");
}

function renderAnalysisTocSettings(options = {}) {
  const {
    focusDirection = 0,
    focusHeadingKey = "",
    preserveScroll = false,
  } = options;
  const list = document.querySelector("#analysis-toc-settings-list");
  if (!list) {
    return;
  }

  const scrollPosition = preserveScroll
    ? { left: window.scrollX, top: window.scrollY }
    : null;
  let focusButton = null;
  list.replaceChildren();
  const orderedEntries = getOrderedAnalysisHeadingEntries();

  for (const [rowIndex, headingEntry] of orderedEntries.entries()) {
    const settings = highlightState.tocButtonSettings[headingEntry.key] ?? {
      side: ANALYSIS_TOC_SIDE_LEFT,
      offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
    };
    const row = document.createElement("div");
    row.className = "toc-settings-row";

    const reorderActions = document.createElement("span");
    reorderActions.className = "toc-reorder-actions";

    const moveUpButton = document.createElement("button");
    moveUpButton.type = "button";
    moveUpButton.textContent = "^";
    moveUpButton.title = `Move ${headingEntry.label} up`;
    moveUpButton.setAttribute("aria-label", moveUpButton.title);
    moveUpButton.disabled = rowIndex === 0;
    moveUpButton.addEventListener("click", (event) => {
      event.preventDefault();
      moveAnalysisTocButtonOrder(headingEntry.key, -1);
    });

    const moveDownButton = document.createElement("button");
    moveDownButton.type = "button";
    moveDownButton.textContent = "v";
    moveDownButton.title = `Move ${headingEntry.label} down`;
    moveDownButton.setAttribute("aria-label", moveDownButton.title);
    moveDownButton.disabled = rowIndex === orderedEntries.length - 1;
    moveDownButton.addEventListener("click", (event) => {
      event.preventDefault();
      moveAnalysisTocButtonOrder(headingEntry.key, 1);
    });

    if (headingEntry.key === focusHeadingKey) {
      const preferredButton = focusDirection < 0 ? moveUpButton : moveDownButton;
      const fallbackButton = focusDirection < 0 ? moveDownButton : moveUpButton;
      focusButton = preferredButton.disabled ? fallbackButton : preferredButton;
    }

    reorderActions.append(moveUpButton, moveDownButton);

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

    row.append(reorderActions, labelInput, controls);
    list.append(row);
  }

  if (focusButton instanceof HTMLButtonElement && !focusButton.disabled) {
    focusButton.focus({ preventScroll: true });
  }

  if (scrollPosition) {
    window.scrollTo({ left: scrollPosition.left, top: scrollPosition.top, behavior: "auto" });
    window.requestAnimationFrame(() => {
      window.scrollTo({ left: scrollPosition.left, top: scrollPosition.top, behavior: "auto" });
    });
  }
}

function setAnalysisTocColumnPositionInputs(positions) {
  const normalizedPositions = sanitizeAnalysisTocColumnPositions(positions);
  const leftInput = document.querySelector("#analysis-toc-left-x");
  const rightInput = document.querySelector("#analysis-toc-right-inset");
  if (leftInput instanceof HTMLInputElement) {
    leftInput.value = String(normalizedPositions.leftPx);
  }

  if (rightInput instanceof HTMLInputElement) {
    rightInput.value = String(normalizedPositions.rightInsetPx);
  }
}

function getAnalysisTocColumnPositionInputValues() {
  return sanitizeAnalysisTocColumnPositions({
    leftPx: document.querySelector("#analysis-toc-left-x")?.value,
    rightInsetPx: document.querySelector("#analysis-toc-right-inset")?.value,
  });
}

function setAnalysisTocColumnOpacityInputs(opacity) {
  const normalizedOpacity = sanitizeAnalysisTocColumnOpacity(opacity);
  const leftInput = document.querySelector("#analysis-toc-left-opacity");
  const rightInput = document.querySelector("#analysis-toc-right-opacity");
  if (leftInput instanceof HTMLInputElement) {
    leftInput.value = String(opacityToPercent(normalizedOpacity[ANALYSIS_TOC_SIDE_LEFT]));
  }

  if (rightInput instanceof HTMLInputElement) {
    rightInput.value = String(opacityToPercent(normalizedOpacity[ANALYSIS_TOC_SIDE_RIGHT]));
  }
}

function getAnalysisTocColumnOpacityInputValues() {
  return sanitizeAnalysisTocColumnOpacity({
    [ANALYSIS_TOC_SIDE_LEFT]: document.querySelector("#analysis-toc-left-opacity")?.value,
    [ANALYSIS_TOC_SIDE_RIGHT]: document.querySelector("#analysis-toc-right-opacity")?.value,
  });
}

function setLatestPromptScrollHoldSecondsInput(value) {
  const input = document.querySelector("#latest-prompt-scroll-hold-seconds");
  if (input instanceof HTMLInputElement) {
    input.value = String(sanitizeLatestPromptScrollHoldSeconds(value));
  }
}

function getLatestPromptScrollHoldSecondsInputValue() {
  return sanitizeLatestPromptScrollHoldSeconds(
    document.querySelector("#latest-prompt-scroll-hold-seconds")?.value,
  );
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
  const localStored = await chrome.storage.local.get({
    [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: null,
  });
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(
    localStored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS],
  );

  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_PROJECT_IDS]: null,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: null,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: null,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
    [STORAGE_KEY_HIGHLIGHT_RULES]: null,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]: null,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]: null,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]: null,
    [STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
  });

  const projectSettings = normalizeProjectSettings(
    stored[STORAGE_KEY_PROJECT_IDS],
    stored[STORAGE_KEY_ACTIVE_PROJECT_ID],
    stored[STORAGE_KEY_START_PAGE_URL],
  );
  const resetLimit = sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]);
  highlightState.taskTypeProjectIds = migrateTaskTypeProjectIds(
    stored[STORAGE_KEY_TASK_TYPE_PROJECT_IDS],
    projectSettings.projectIds,
  );
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(
    stored[STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS],
  );
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(stored[STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]);
  highlightState.rules = sanitizeHighlightRules(stored[STORAGE_KEY_HIGHLIGHT_RULES]);
  highlightState.tocButtonColors = sanitizeAnalysisTocButtonColors(stored[STORAGE_KEY_ANALYSIS_TOC_COLORS]);
  highlightState.tocButtonSettings = sanitizeAnalysisTocButtonSettings(stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]);
  highlightState.tocButtonLabels = sanitizeAnalysisTocButtonLabels(stored[STORAGE_KEY_ANALYSIS_TOC_LABELS]);
  highlightState.tocButtonOrder = sanitizeAnalysisTocButtonOrder(stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]);
  highlightState.tocColumnPositions = sanitizeAnalysisTocColumnPositions(stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]);
  highlightState.tocColumnOpacity = sanitizeAnalysisTocColumnOpacity(stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]);
  highlightState.latestPromptScrollHoldSeconds = sanitizeLatestPromptScrollHoldSeconds(
    stored[STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS],
  );

  document.querySelector("#reset-limit").value = String(resetLimit);
  renderTaskTypeProjectIds();
  setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
  setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
  setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  clearRuleForm();
  renderHighlightRules();
  renderAnalysisTocSettings();
}

async function saveOptions(event) {
  event.preventDefault();
  syncTaskTypeDefinitionEditorValues();

  const taskTypeDefinitions = sanitizeTaskTypeDefinitions(highlightState.taskTypeDefinitions);
  highlightState.taskTypeDefinitions = taskTypeDefinitions;
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(highlightState.activeBridgeTaskType);
  const resetLimit = sanitizeResetLimit(document.querySelector("#reset-limit").value);
  const tocButtonColors = sanitizeAnalysisTocButtonColors(highlightState.tocButtonColors);
  const tocButtonSettings = sanitizeAnalysisTocButtonSettings(highlightState.tocButtonSettings);
  const tocButtonLabels = sanitizeAnalysisTocButtonLabels(highlightState.tocButtonLabels);
  const tocButtonOrder = sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder);
  const tocColumnPositions = getAnalysisTocColumnPositionInputValues();
  const tocColumnOpacity = getAnalysisTocColumnOpacityInputValues();
  const latestPromptScrollHoldSeconds = getLatestPromptScrollHoldSecondsInputValue();
  const { taskTypeProjectIds, taskTypeActiveProjectAccounts } = getTaskTypeProjectSettingsFromInputs();
  const searchTaskProjects = taskTypeProjectIds[BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS] ?? {};
  const activeSearchAccount = sanitizeProjectAccountKey(
    taskTypeActiveProjectAccounts[BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS],
  );
  const searchProjectIds = PROJECT_ACCOUNT_DEFINITIONS
    .map((accountDefinition) => sanitizeProjectId(searchTaskProjects[accountDefinition.key]))
    .filter(Boolean);
  const activeProjectId = searchTaskProjects[activeSearchAccount]
    || searchProjectIds[0]
    || DEFAULT_PROJECT_ID;

  await chrome.storage.local.set({
    [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: taskTypeDefinitions,
  });

  await chrome.storage.sync.set({
    [STORAGE_KEY_START_PAGE_URL]: buildProjectStartPageUrl(activeProjectId),
    [STORAGE_KEY_PROJECT_IDS]: searchProjectIds.length > 0 ? searchProjectIds : [DEFAULT_PROJECT_ID],
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: activeProjectId,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: highlightState.activeBridgeTaskType,
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: taskTypeProjectIds,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: taskTypeActiveProjectAccounts,
    [STORAGE_KEY_RESET_LIMIT]: resetLimit,
    [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: tocButtonColors,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: tocButtonSettings,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: tocButtonLabels,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]: tocButtonOrder,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]: tocColumnPositions,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]: tocColumnOpacity,
    [STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: latestPromptScrollHoldSeconds,
  });

  highlightState.taskTypeProjectIds = taskTypeProjectIds;
  highlightState.taskTypeActiveProjectAccounts = taskTypeActiveProjectAccounts;
  highlightState.tocButtonColors = tocButtonColors;
  highlightState.tocButtonSettings = tocButtonSettings;
  highlightState.tocButtonLabels = tocButtonLabels;
  highlightState.tocButtonOrder = tocButtonOrder;
  highlightState.tocColumnPositions = tocColumnPositions;
  highlightState.tocColumnOpacity = tocColumnOpacity;
  highlightState.latestPromptScrollHoldSeconds = latestPromptScrollHoldSeconds;
  document.querySelector("#reset-limit").value = String(resetLimit);
  renderTaskTypeProjectIds();
  setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
  setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
  setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  renderAnalysisTocSettings();
  setStatus("Settings saved.");
}

async function resetChanges() {
  await loadOptions();
  setStatus("Unsaved changes reset.");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#options-form");
  const resetButton = document.querySelector("#reset-changes");
  const saveRuleButton = document.querySelector("#save-highlight-rule");
  const clearRuleButton = document.querySelector("#clear-highlight-rule");
  const highlightColorInput = document.querySelector("#highlight-rule-color");
  const highlightHexInput = document.querySelector("#highlight-rule-color-hex");
  const addTaskTypeButton = document.querySelector("#add-task-type");
  const deleteTaskTypeButton = document.querySelector("#delete-task-type");
  const taskTypeLabelInput = document.querySelector("#task-type-label");
  const taskTypePromptInput = document.querySelector("#task-type-boilerplate-prompt");
  const screenshotToggle = document.querySelector("#task-type-enable-screenshot");
  const googleResultsToggle = document.querySelector("#task-type-enable-google-results");
  const ocrToggle = document.querySelector("#task-type-enable-ocr");
  const addOcrRegionButton = document.querySelector("#add-ocr-region");

  void loadOptions();
  bindColorControl(highlightColorInput, highlightHexInput, "#facc15");
  form.addEventListener("submit", (event) => {
    void saveOptions(event);
  });
  resetButton.addEventListener("click", () => {
    void resetChanges();
  });
  for (const input of document.querySelectorAll("[data-project-account-input]")) {
    input.addEventListener("input", () => {
      syncTaskTypeProjectInputValues();
      renderTaskTypeProjectAccountChoices();
      setStatus("Task type project IDs changed. Save settings to apply them.");
    });
  }
  addTaskTypeButton?.addEventListener("click", () => {
    addTaskTypeDefinition();
  });
  deleteTaskTypeButton?.addEventListener("click", () => {
    deleteActiveTaskTypeDefinition();
  });
  taskTypeLabelInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    renderTaskTypeProjectIds();
    setStatus("Task type label changed. Save settings to apply it.");
  });
  taskTypePromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Boilerplate prompt changed. Save settings to apply it.");
  });
  screenshotToggle?.addEventListener("change", () => {
    updateActiveTaskTypeDefinition((definition) => setTaskActionEnabled(
      definition,
      TASK_ACTION_SCREENSHOT,
      screenshotToggle.checked,
    ));
    setStatus("Screenshot processing changed. Save settings to apply it.");
  });
  googleResultsToggle?.addEventListener("change", () => {
    updateActiveTaskTypeDefinition((definition) => setTaskActionEnabled(
      definition,
      TASK_ACTION_GOOGLE_SEARCH,
      googleResultsToggle.checked,
    ));
    setStatus("Google search results processing changed. Save settings to apply it.");
  });
  ocrToggle?.addEventListener("change", () => {
    updateActiveTaskTypeDefinition((definition) => setTaskActionEnabled(
      definition,
      TASK_ACTION_OCR,
      ocrToggle.checked,
    ));
    setStatus("OCR processing changed. Save settings to apply it.");
  });
  addOcrRegionButton?.addEventListener("click", () => {
    addOcrRegionToActiveTaskType();
  });
  saveRuleButton.addEventListener("click", () => {
    void upsertHighlightRule();
  });
  clearRuleButton.addEventListener("click", () => {
    clearRuleForm();
    setStatus("Ready for a new rule.");
  });
});
