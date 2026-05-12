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
  const ACTIVATE_CURRENT_CHAT_MESSAGE_TYPE = "activateCurrentChat";
  const REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE = "repeatCaptureHotkey";
  const REPEAT_CONFIRM_HOTKEY_MESSAGE_TYPE = "repeatConfirmHotkey";
  const SCROLL_MESSAGE_TYPE = "scrollChatGpt";
  const SERVER_CONTROL_MENU_COMMAND_MESSAGE_TYPE = "serverControlMenuCommand";
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
  const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
  const USER_MESSAGE_SELECTOR = '[data-message-author-role="user"]';
  const ANALYSIS_TOC_BUTTON_CLASS = "local-query-bridge-analysis-toc-button";
  const ANALYSIS_TOC_BUTTON_ACTIVE_CLASS = "local-query-bridge-analysis-toc-button-active";
  const ANALYSIS_TOC_TOGGLE_BUTTON_CLASS = "local-query-bridge-analysis-toc-toggle-button";
  const ANALYSIS_TOC_TOGGLE_BUTTON_ID_PREFIX = "local-query-bridge-analysis-toc-toggle";
  const ANALYSIS_TOC_STYLE_ID = "local-query-bridge-analysis-toc-styles";
  const ANALYSIS_TOC_GAP_PX = 30;
  const ANALYSIS_TOC_DEFAULT_LEFT_X_PX = 224;
  const ANALYSIS_TOC_DEFAULT_RIGHT_INSET_PX = 18;
  const ANALYSIS_TOC_MIN_COLUMN_POSITION_PX = 0;
  const ANALYSIS_TOC_MAX_COLUMN_POSITION_PX = 5000;
  const ANALYSIS_TOC_DEFAULT_IDLE_OPACITY = 1;
  const ANALYSIS_TOC_MIN_IDLE_OPACITY = 0.05;
  const ANALYSIS_TOC_MAX_IDLE_OPACITY = 1;
  const ANALYSIS_TOC_DEFAULT_COLUMN_SCALE = 1;
  const ANALYSIS_TOC_MIN_COLUMN_SCALE = 0.5;
  const ANALYSIS_TOC_MAX_COLUMN_SCALE = 2.5;
  const ANALYSIS_TOC_SIDE_LEFT = "left";
  const ANALYSIS_TOC_SIDE_RIGHT = "right";
  const ANALYSIS_TOC_ALLOWED_SIDES = new Set([ANALYSIS_TOC_SIDE_LEFT, ANALYSIS_TOC_SIDE_RIGHT]);
  const ANALYSIS_TOC_DEFAULT_OFFSET_PX = 0;
  const ANALYSIS_TOC_MIN_OFFSET_PX = -2000;
  const ANALYSIS_TOC_MAX_OFFSET_PX = 2000;
  const LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS = 3;
  const LATEST_PROMPT_SCROLL_MIN_HOLD_SECONDS = 0;
  const LATEST_PROMPT_SCROLL_MAX_HOLD_SECONDS = 60;
  const LATEST_PROMPT_SCROLL_CHECK_INTERVAL_MS = 1000;
  const LATEST_PROMPT_SCROLL_TOLERANCE_PX = 6;
  const ANALYSIS_TOC_ENTRY_TYPE_HEADING = "heading";
  const ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT = "latestUserPrompt";
  const ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT = "customText";
  const LATEST_USER_PROMPT_TOC_KEY = "latest-user-prompt";
  const DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR = "#2563eb";
  const STORAGE_KEY_ANALYSIS_TOC_COLORS = "analysisTocButtonColors";
  const STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS = "analysisTocButtonSettings";
  const STORAGE_KEY_ANALYSIS_TOC_LABELS = "analysisTocButtonLabels";
  const STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS = "analysisTocColumnPositions";
  const STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY = "analysisTocColumnOpacity";
  const STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE = "analysisTocColumnScale";
  const STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER = "analysisTocButtonOrder";
  const STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS = "latestPromptScrollHoldSeconds";
  const STORAGE_KEY_HIGHLIGHT_RULES = "highlightRules";
  const STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES = "taskTypeHighlightRules";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS = "taskTypeAnalysisTocButtonColors";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS = "taskTypeAnalysisTocButtonSettings";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS = "taskTypeAnalysisTocButtonLabels";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS = "taskTypeAnalysisTocColumnPositions";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY = "taskTypeAnalysisTocColumnOpacity";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE = "taskTypeAnalysisTocColumnScale";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER = "taskTypeAnalysisTocButtonOrder";
  const STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS = "taskTypeLatestPromptScrollHoldSeconds";
  const STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES = "taskTypeAnalysisTocEntries";
  const STORAGE_KEY_PROJECT_IDS = "projectIds";
  const STORAGE_KEY_TASK_TYPE_PROJECT_IDS = "taskTypeProjectIds";
  const STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = "taskTypeActiveProjectAccounts";
  const HIGHLIGHT_CLASS = "local-query-bridge-highlight";
  const HIGHLIGHT_STYLE_ID = "local-query-bridge-highlight-styles";
  const SERVER_CONTROL_MENU_ID = "local-query-bridge-server-control-menu";
  const SERVER_CONTROL_MENU_STYLE_ID = "local-query-bridge-server-control-menu-styles";
  const SERVER_CONTROL_MENU_OPEN_CLASS = "local-query-bridge-server-control-menu-open";
  const SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS = "local-query-bridge-server-control-button-active";
  const SERVER_CONTROL_MENU_HIDE_VIEWPORT_RATIO = 0.5;
  const SERVER_CONTROL_ZONE_OVERLAY_ID = "local-query-bridge-server-control-zone-overlay";
  const SERVER_CONTROL_ZONE_OVERLAY_ACTIVE_CLASS = "local-query-bridge-server-control-zone-overlay-active";
  const SERVER_CONTROL_ZONE_LEGEND_ACTIVE_CLASS = "local-query-bridge-server-control-zone-legend-active";
  const DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY = 0.38;
  const SERVER_CONTROL_ZONE_DIVIDER_MIN_OPACITY = 0.05;
  const SERVER_CONTROL_ZONE_DIVIDER_MAX_OPACITY = 1;
  const DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX = 50;
  const SERVER_CONTROL_ZONE_DIVIDER_MIN_LENGTH_PX = 0;
  const SERVER_CONTROL_ZONE_DIVIDER_MAX_LENGTH_PX = 500;
  const SERVER_CONTROL_ZONE_SELECTION_DRAG_THRESHOLD_PX = 5;
  const SERVER_CONTROL_ZONE_CONTEXT_MENU_SUPPRESS_MS = 800;
  const STORAGE_KEY_SERVER_CONTROL_TASK_TYPE = "serverControlTaskType";
  const STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS = "serverControlTaskRegions";
  const STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS = "serverControlUniversalRegions";
  const STORAGE_KEY_SERVER_CONTROL_SELECTED_REGION = "serverControlSelectedRegion";
  const STORAGE_KEY_SERVER_CONTROL_OCR_REVIEW_TEXT = "serverControlOcrReviewText";
  const STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS = "serverControlTaskTypeDefinitions";
  const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY = "serverControlZoneDividerOpacity";
  const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH = "serverControlZoneDividerTopLengthPx";
  const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH = "serverControlZoneDividerBottomLengthPx";
  const SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS = "search-experience-to-product-usefulness";
  const HARD_CODED_TOC_TASK_TYPE_KEYS = new Set([SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]);
  const SERVER_CONTROL_REGION_DEFAULT_KEY = "fullTaskScreenshot";
  const SERVER_CONTROL_UNIVERSAL_REGION_KEYS = new Set(["googleResults"]);
  const SERVER_CONTROL_REGION_KIND_OCR = "ocr";
  const SERVER_CONTROL_REGION_KIND_SCREENSHOT = "full-task-screenshot";
  const SERVER_CONTROL_REGION_KIND_GOOGLE_RESULTS = "google-results";
  const SERVER_CONTROL_REGION_SAVE_DEBOUNCE_MS = 250;
  const SERVER_CONTROL_REGION_COORDINATE_MIN = -100000;
  const SERVER_CONTROL_REGION_COORDINATE_MAX = 100000;
  const DEFAULT_PROJECT_ID = "69bc1388b0588191bd1c176e83f018e4";
  const SERVER_CONTROL_PROJECT_ACCOUNT_DEFAULT_KEY = "ascasdqwe";
  const SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS = [
    {
      key: SERVER_CONTROL_PROJECT_ACCOUNT_DEFAULT_KEY,
      label: "ascasdqwe",
    },
    {
      key: "aoizxcaoi",
      label: "aoizxcaoi",
    },
  ];
  const HIGHLIGHT_DEBOUNCE_MS = 250;
  const WORD_TOKEN_PATTERN = /[\p{L}\p{N}]+/gu;
  const TERM_PATTERN_PART_PATTERN = /\.{3}[\p{L}\p{N}]+\.{3}|\.{3}[\p{L}\p{N}]+|[\p{L}\p{N}]+\.{3}|[\p{L}\p{N}]+/gu;
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
  const SERVER_CONTROL_REGION_COORDINATES = [
    { key: "top", label: "Top Y", gridClass: "top" },
    { key: "left", label: "Left X", gridClass: "left" },
    { key: "right", label: "Right X", gridClass: "right" },
    { key: "bottom", label: "Bottom Y", gridClass: "bottom" },
  ];
  const DEFAULT_SERVER_CONTROL_REGION_BOUNDS = { top: 0, left: 0, right: 0, bottom: 0 };
  const DEFAULT_SERVER_CONTROL_REGION_DEFINITIONS = [
    {
      key: SERVER_CONTROL_REGION_DEFAULT_KEY,
      label: "Full task screenshot",
      kind: SERVER_CONTROL_REGION_KIND_SCREENSHOT,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
    {
      key: "fullTaskOcr",
      label: "Full task OCR",
      kind: SERVER_CONTROL_REGION_KIND_OCR,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
    {
      key: "query",
      label: "Query",
      kind: SERVER_CONTROL_REGION_KIND_OCR,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
    {
      key: "productCard",
      label: "Product card",
      kind: SERVER_CONTROL_REGION_KIND_OCR,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
    {
      key: "googleResults",
      label: "Google results",
      kind: SERVER_CONTROL_REGION_KIND_GOOGLE_RESULTS,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
    {
      key: "productDescription",
      label: "Product description",
      kind: SERVER_CONTROL_REGION_KIND_OCR,
      defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
    },
  ];
  let SERVER_CONTROL_REGION_DEFINITIONS = DEFAULT_SERVER_CONTROL_REGION_DEFINITIONS.map((definition) => ({
    ...definition,
    defaultBounds: { ...definition.defaultBounds },
  }));
  const SERVER_CONTROL_ACTION_DEFINITIONS = {
    ocr: {
      label: "OCR",
      command: "start_task_ocr",
      value: "ocr",
    },
    screenshot: {
      label: "Screenshot",
      command: "start_task_screenshot",
      value: "screenshot",
    },
    googleSearch: {
      label: "Google search",
      command: "ocr_google_results",
      value: "google-search",
      regionKey: "googleResults",
    },
  };
  const DEFAULT_SERVER_CONTROL_TASK_TYPE_DEFINITIONS = [
    {
      key: SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
      label: "Search Experience to Product Usefulness",
      regions: ["query", "productCard", "productDescription", "googleResults", SERVER_CONTROL_REGION_DEFAULT_KEY],
      actions: ["ocr", "screenshot", "googleSearch"],
      requireWebSearchChip: true,
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
      regions: [SERVER_CONTROL_REGION_DEFAULT_KEY, "fullTaskOcr"],
      actions: ["ocr", "screenshot"],
      requireWebSearchChip: true,
      boilerplatePrompt: `The attached screenshot contains a Get Rich Quick task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Get Rich Quick criteria. Keep the reasoning tied to the visible task evidence.`,
    },
    {
      key: "video-games",
      label: "Video Games",
      regions: [SERVER_CONTROL_REGION_DEFAULT_KEY, "fullTaskOcr"],
      actions: ["ocr", "screenshot"],
      requireWebSearchChip: true,
      boilerplatePrompt: `The attached screenshot contains a Video Games task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Video Games criteria. Keep the reasoning tied to the visible task evidence.`,
    },
    {
      key: "weight-loss",
      label: "Weight Loss",
      regions: [SERVER_CONTROL_REGION_DEFAULT_KEY, "fullTaskOcr"],
      actions: ["ocr", "screenshot"],
      requireWebSearchChip: true,
      boilerplatePrompt: `The attached screenshot contains a Weight Loss task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Weight Loss criteria. Keep the reasoning tied to the visible task evidence.`,
    },
  ];
  let SERVER_CONTROL_TASK_TYPE_DEFINITIONS = DEFAULT_SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((definition) => ({
    ...definition,
    regions: [...definition.regions],
    actions: [...definition.actions],
    requireWebSearchChip: definition.requireWebSearchChip !== false,
  }));
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

  const highlightState = {
    rules: [],
    observer: null,
    timerId: null,
    applying: false,
  };

  const analysisTocState = {
    currentRunId: 0,
    baselineAssistantCount: 0,
    currentAssistantElement: null,
    baselineHeadingCounts: {},
    detectedHeadingKeys: new Set(),
    highlightRefreshAllowed: false,
    responseCompletedRunId: 0,
    buttonColors: {},
    buttonSettings: {},
    buttonLabels: {},
    buttonOrder: [],
    columnPositions: {
      leftPx: ANALYSIS_TOC_DEFAULT_LEFT_X_PX,
      rightInsetPx: ANALYSIS_TOC_DEFAULT_RIGHT_INSET_PX,
    },
    columnOpacity: {
      [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
      [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
    },
    columnScale: {
      [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
      [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
    },
    latestPromptScrollHoldSeconds: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
    taskTypeTocEntries: {},
    hoveredSides: new Set(),
    collapsedSides: new Set(),
  };

  const hotkeyState = {
    enabled: false,
  };

  const serverControlMenuState = {
    isOpen: false,
    currentTaskType: SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    processingMode: "idle",
    selectedRegionKey: SERVER_CONTROL_REGION_DEFAULT_KEY,
    taskRegions: getDefaultServerControlTaskRegions(),
    universalRegions: getDefaultServerControlUniversalRegions(),
    taskTypeProjectIds: getDefaultServerControlTaskTypeProjectIds(),
    taskTypeActiveProjectAccounts: getDefaultServerControlTaskTypeActiveProjectAccounts(),
    projectPickerOpen: false,
    zoneClickEnabled: false,
    zoneDividerOpacity: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY,
    zoneDividerTopLengthPx: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
    zoneDividerBottomLengthPx: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
    ocrReviewText: "",
    persistTimerId: null,
    lastCommand: "",
  };

  const serverControlZonePointerState = {
    button: null,
    startX: 0,
    startY: 0,
    moved: false,
    lastContextMenuAt: 0,
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
  const ANALYSIS_HEADING_ENTRIES = ANALYSIS_SECTION_HEADINGS.map((entry, index) => ({
    key: entry.key ?? normalizeAnalysisHeadingText(entry.heading),
    heading: entry.heading,
    label: entry.label,
    type: entry.type ?? ANALYSIS_TOC_ENTRY_TYPE_HEADING,
    index,
  }));

  function normalizeAnalysisHeadingText(value, options = {}) {
    const normalizedText = (typeof value === "string" ? value : "")
      .replace(/^\s*#+\s*/, "")
      .replace(/^\s*(?:(?:\(?\d+[.)]|\(?[a-z][.)]|\(?[ivxlcdm]+[.)])\s*)+/i, "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .replace(/[:.]+$/g, "")
      .trim();
    return options.caseSensitive === true ? normalizedText : normalizedText.toLocaleLowerCase();
  }

  function normalizeAnalysisTargetText(value, options = {}) {
    const normalizedText = (typeof value === "string" ? value : "")
      .replace(/^\s*#+\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    return options.caseSensitive === true ? normalizedText : normalizedText.toLocaleLowerCase();
  }

  function isHardCodedAnalysisTocTaskType(taskType = serverControlMenuState.currentTaskType) {
    return HARD_CODED_TOC_TASK_TYPE_KEYS.has(sanitizeServerControlTaskTypeKey(taskType));
  }

  function sanitizeCustomAnalysisTocEntries(rawValue) {
    const sourceEntries = Array.isArray(rawValue) ? rawValue : [];
    const usedKeys = new Set();
    return sourceEntries
      .map((entry, index) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          return null;
        }

        if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT || entry.key === LATEST_USER_PROMPT_TOC_KEY) {
          if (usedKeys.has(LATEST_USER_PROMPT_TOC_KEY)) {
            return null;
          }

          usedKeys.add(LATEST_USER_PROMPT_TOC_KEY);
          return {
            key: LATEST_USER_PROMPT_TOC_KEY,
            heading: "Latest prompt",
            label: sanitizeAnalysisTocButtonLabel(entry.label, "Latest prompt"),
            type: ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT,
            index,
          };
        }

        const targetText = typeof entry.targetText === "string" ? entry.targetText.replace(/\s+/g, " ").trim() : "";
        const label = sanitizeAnalysisTocButtonLabel(entry.label, targetText || `TOC ${index + 1}`);
        if (!targetText) {
          return null;
        }

        const rawKey = typeof entry.key === "string" && entry.key.trim()
          ? entry.key.trim()
          : `custom-toc-${index + 1}`;
        let key = rawKey;
        let suffix = 2;
        while (usedKeys.has(key)) {
          key = `${rawKey}-${suffix}`;
          suffix += 1;
        }
        usedKeys.add(key);

        return {
          key,
          heading: targetText,
          label,
          targetText,
          type: ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT,
          index,
        };
      })
      .filter(Boolean);
  }

  function sanitizeTaskTypeAnalysisTocEntriesMap(rawValue) {
    const source = isPlainObject(rawValue) ? rawValue : {};
    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((definition) => [
        definition.key,
        isHardCodedAnalysisTocTaskType(definition.key)
          ? []
          : sanitizeCustomAnalysisTocEntries(source[definition.key]),
      ]),
    );
  }

  function getAnalysisTocEntries(taskType = serverControlMenuState.currentTaskType) {
    const sanitizedTaskType = sanitizeServerControlTaskTypeKey(taskType);
    if (isHardCodedAnalysisTocTaskType(sanitizedTaskType)) {
      return ANALYSIS_HEADING_ENTRIES;
    }

    return sanitizeCustomAnalysisTocEntries(analysisTocState.taskTypeTocEntries[sanitizedTaskType]);
  }

  function getDefaultAnalysisTocButtonColors(entries = getAnalysisTocEntries()) {
    return Object.fromEntries(
      entries.map((entry) => [entry.key, DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR]),
    );
  }

  function sanitizeAnalysisTocButtonColors(rawValue, entries = getAnalysisTocEntries()) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};
    const defaults = getDefaultAnalysisTocButtonColors(entries);

    return Object.fromEntries(
      entries.map((entry) => [
        entry.key,
        sanitizeColor(source[entry.key], defaults[entry.key]),
      ]),
    );
  }

  function getAnalysisTocButtonColor(headingKey) {
    return analysisTocState.buttonColors[headingKey] ?? DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR;
  }

  function getDefaultAnalysisTocButtonOrder(entries = getAnalysisTocEntries()) {
    return entries.map((entry) => entry.key);
  }

  function sanitizeAnalysisTocButtonOrder(rawValue, entries = getAnalysisTocEntries()) {
    const defaultOrder = getDefaultAnalysisTocButtonOrder(entries);
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
    const entries = getAnalysisTocEntries();
    const entriesByKey = new Map(entries.map((entry) => [entry.key, entry]));
    return sanitizeAnalysisTocButtonOrder(analysisTocState.buttonOrder, entries)
      .map((key) => entriesByKey.get(key))
      .filter(Boolean);
  }

  function getAnalysisHeadingTocEntries() {
    return getAnalysisTocEntries().filter((entry) => (
      entry.type === ANALYSIS_TOC_ENTRY_TYPE_HEADING
      || entry.type === ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT
    ));
  }

  function getDefaultAnalysisTocButtonLabels(entries = getAnalysisTocEntries()) {
    return Object.fromEntries(
      entries.map((entry) => [entry.key, entry.label]),
    );
  }

  function sanitizeAnalysisTocButtonLabel(value, fallback) {
    const label = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
    return label ? label.slice(0, 120) : fallback;
  }

  function sanitizeAnalysisTocButtonLabels(rawValue, entries = getAnalysisTocEntries()) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};
    const defaults = getDefaultAnalysisTocButtonLabels(entries);

    return Object.fromEntries(
      entries.map((entry) => [
        entry.key,
        sanitizeAnalysisTocButtonLabel(source[entry.key], defaults[entry.key]),
      ]),
    );
  }

  function getAnalysisTocButtonLabel(headingKey) {
    return analysisTocState.buttonLabels[headingKey]
      ?? getDefaultAnalysisTocButtonLabels()[headingKey]
      ?? headingKey;
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

  function getAnalysisTocColumnPositions() {
    return analysisTocState.columnPositions ?? getDefaultAnalysisTocColumnPositions();
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

  function getAnalysisTocColumnIdleOpacity(side) {
    const columnOpacity = analysisTocState.columnOpacity ?? getDefaultAnalysisTocColumnOpacity();
    return sanitizeAnalysisTocColumnOpacityValue(
      columnOpacity[side],
      ANALYSIS_TOC_DEFAULT_IDLE_OPACITY,
    );
  }

  function getDefaultAnalysisTocColumnScale() {
    return {
      [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
      [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
    };
  }

  function sanitizeAnalysisTocColumnScaleValue(value, fallback) {
    const parsedValue = Number.parseFloat(`${value}`);
    if (!Number.isFinite(parsedValue)) {
      return fallback;
    }

    const normalizedValue = parsedValue > 10 ? parsedValue / 100 : parsedValue;
    return Math.min(
      ANALYSIS_TOC_MAX_COLUMN_SCALE,
      Math.max(ANALYSIS_TOC_MIN_COLUMN_SCALE, normalizedValue),
    );
  }

  function sanitizeAnalysisTocColumnScale(rawValue) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};
    const defaults = getDefaultAnalysisTocColumnScale();

    return {
      [ANALYSIS_TOC_SIDE_LEFT]: sanitizeAnalysisTocColumnScaleValue(
        source[ANALYSIS_TOC_SIDE_LEFT],
        defaults[ANALYSIS_TOC_SIDE_LEFT],
      ),
      [ANALYSIS_TOC_SIDE_RIGHT]: sanitizeAnalysisTocColumnScaleValue(
        source[ANALYSIS_TOC_SIDE_RIGHT],
        defaults[ANALYSIS_TOC_SIDE_RIGHT],
      ),
    };
  }

  function getAnalysisTocColumnScale(side) {
    const columnScale = analysisTocState.columnScale ?? getDefaultAnalysisTocColumnScale();
    return sanitizeAnalysisTocColumnScaleValue(
      columnScale[side],
      ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
    );
  }

  function getDefaultAnalysisTocButtonSettings(entries = getAnalysisTocEntries()) {
    return Object.fromEntries(
      entries.map((entry) => [
        entry.key,
        {
          side: ANALYSIS_TOC_SIDE_LEFT,
          offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
          caseSensitive: false,
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

  function sanitizeAnalysisTocButtonSettings(rawValue, entries = getAnalysisTocEntries()) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};
    const defaults = getDefaultAnalysisTocButtonSettings(entries);

    return Object.fromEntries(
      entries.map((entry) => {
        const rawEntry = source[entry.key] && typeof source[entry.key] === "object"
          ? source[entry.key]
          : {};
        const defaultEntry = defaults[entry.key];

        return [
          entry.key,
          {
            side: sanitizeAnalysisTocButtonSide(rawEntry.side ?? defaultEntry.side),
            offsetPx: sanitizeAnalysisTocButtonOffset(rawEntry.offsetPx ?? defaultEntry.offsetPx),
            caseSensitive: rawEntry.caseSensitive === true,
          },
        ];
      }),
    );
  }

  function getAnalysisTocButtonSettings(headingKey) {
    return analysisTocState.buttonSettings[headingKey] ?? {
      side: ANALYSIS_TOC_SIDE_LEFT,
      offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
      caseSensitive: false,
    };
  }

  function getAnalysisTocButtonOffset(headingKey) {
    return getAnalysisTocButtonSettings(headingKey).offsetPx;
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

  function getLatestPromptScrollHoldMs() {
    return sanitizeLatestPromptScrollHoldSeconds(
      analysisTocState.latestPromptScrollHoldSeconds,
    ) * 1000;
  }

  function cloneDefaultHighlightRules() {
    return DEFAULT_HIGHLIGHT_RULES.map((rule) => ({
      ...rule,
      matchStrings: [...rule.matchStrings],
      companionWords: [...rule.companionWords],
    }));
  }

  function normalizeToken(value) {
    return value.toLocaleLowerCase();
  }

  function extractWordTokens(value) {
    const text = typeof value === "string" ? value : "";
    const tokens = [];
    WORD_TOKEN_PATTERN.lastIndex = 0;

    for (const match of text.matchAll(WORD_TOKEN_PATTERN)) {
      tokens.push({
        value: match[0],
        normalized: normalizeToken(match[0]),
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return tokens;
  }

  function getTermPatternMode(rawPart) {
    const hasLeadingWildcard = rawPart.startsWith("...");
    const hasTrailingWildcard = rawPart.endsWith("...");

    if (hasLeadingWildcard && hasTrailingWildcard) {
      return "contains";
    }

    if (hasLeadingWildcard) {
      return "endsWith";
    }

    if (hasTrailingWildcard) {
      return "startsWith";
    }

    return "exact";
  }

  function parseTermLine(value) {
    const rawText = typeof value === "string" ? value.trim() : "";
    const isPriority = rawText.startsWith("!");
    const text = isPriority ? rawText.slice(1).trimStart() : rawText;
    const isRegex = text.startsWith("r-");

    if (isRegex) {
      const patternText = text.slice(2).trim();
      if (!patternText) {
        return null;
      }

      try {
        return {
          type: "regex",
          regex: new RegExp(patternText, "giu"),
          priority: isPriority,
        };
      } catch (error) {
        console.warn("Local Query Bridge ignored invalid highlight regex", { patternText, error });
        return null;
      }
    }

    const patterns = [];
    TERM_PATTERN_PART_PATTERN.lastIndex = 0;

    for (const match of text.matchAll(TERM_PATTERN_PART_PATTERN)) {
      const rawPart = match[0];
      const normalizedValue = normalizeToken(rawPart.replace(/^\.{3}/, "").replace(/\.{3}$/, ""));
      if (!normalizedValue) {
        continue;
      }

      patterns.push({
        value: normalizedValue,
        mode: getTermPatternMode(rawPart),
      });
    }

    if (patterns.length === 0) {
      return null;
    }

    return {
      type: "sequence",
      patterns,
      priority: isPriority,
    };
  }

  function escapeRegexText(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function hasRawPunctuation(value) {
    return /[^\p{L}\p{N}\s]/u.test(
      (typeof value === "string" ? value : "").replace(/\.{3}/g, ""),
    );
  }

  function parseExcludedTermLine(value) {
    const rawText = typeof value === "string" ? value.trim() : "";
    const isPriority = rawText.startsWith("!");
    const text = isPriority ? rawText.slice(1).trimStart() : rawText;
    if (!text || text.startsWith("r-") || !hasRawPunctuation(text)) {
      return parseTermLine(rawText);
    }

    return {
      type: "regex",
      regex: new RegExp(`(?<!\\S)${escapeRegexText(text)}(?!\\S)`, "giu"),
      priority: false,
    };
  }

  function compileHighlightMatchEntries(values) {
    const targetTermEntries = [];
    const excludedTermEntries = [];

    for (const value of values) {
      const rawText = typeof value === "string" ? value.trim() : "";
      if (!rawText) {
        continue;
      }

      const isExcluded = rawText.startsWith("--");
      const text = isExcluded ? rawText.slice(2).trimStart() : rawText;
      const entry = isExcluded ? parseExcludedTermLine(text) : parseTermLine(text);
      if (!entry) {
        continue;
      }

      if (isExcluded) {
        excludedTermEntries.push(entry);
      } else {
        targetTermEntries.push(entry);
      }
    }

    return {
      targetTermEntries,
      excludedTermEntries,
    };
  }

  function compileTermEntries(values) {
    return values
      .map((value) => parseTermLine(value))
      .filter(Boolean);
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

  function getReadableTextColor(backgroundColor) {
    const normalizedColor = sanitizeColor(backgroundColor, "#facc15");
    const red = Number.parseInt(normalizedColor.slice(1, 3), 16) / 255;
    const green = Number.parseInt(normalizedColor.slice(3, 5), 16) / 255;
    const blue = Number.parseInt(normalizedColor.slice(5, 7), 16) / 255;
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    return luminance > 0.58 ? "#111827" : "#ffffff";
  }

  function compileHighlightRule(rawRule, index = 0) {
    const fallbackRule = DEFAULT_HIGHLIGHT_RULES[index % DEFAULT_HIGHLIGHT_RULES.length] ?? DEFAULT_HIGHLIGHT_RULES[0];
    const matchStrings = normalizeStringList(rawRule?.matchStrings ?? rawRule?.matchedStrings ?? rawRule?.matches);
    const positiveMatchStrings = matchStrings.filter((value) => !value.trim().startsWith("--"));
    const {
      targetTermEntries,
      excludedTermEntries,
    } = compileHighlightMatchEntries(matchStrings);

    if (targetTermEntries.length === 0) {
      return null;
    }

    const companionWords = normalizeStringList(rawRule?.companionWords ?? rawRule?.prefixWords ?? rawRule?.nearbyWords);
    const companionTermEntries = compileTermEntries(companionWords);
    const parsedDistance = Number.parseInt(`${rawRule?.companionDistance ?? rawRule?.distance ?? 0}`, 10);
    const companionDistance = Number.isFinite(parsedDistance) && parsedDistance > 0
      ? Math.min(parsedDistance, 20)
      : 0;
    const color = sanitizeColor(rawRule?.color, fallbackRule.color);

    return {
      id: typeof rawRule?.id === "string" && rawRule.id.trim() ? rawRule.id.trim() : fallbackRule.id,
      label: typeof rawRule?.label === "string" && rawRule.label.trim() ? rawRule.label.trim() : positiveMatchStrings[0],
      color,
      textColor: getReadableTextColor(color),
      enabled: rawRule?.enabled !== false,
      targetTermEntries,
      excludedTermEntries,
      companionTermEntries,
      companionDistance,
    };
  }

  function compileHighlightRules(rawRules) {
    const sourceRules = Array.isArray(rawRules) ? rawRules : cloneDefaultHighlightRules();
    return sourceRules
      .map((rule, index) => compileHighlightRule(rule, index))
      .filter(Boolean);
  }

  function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function getTaskTypeScopedStorageValue(rawMap, taskType, fallbackValue) {
    const source = isPlainObject(rawMap) ? rawMap : {};
    return Object.prototype.hasOwnProperty.call(source, taskType)
      ? source[taskType]
      : fallbackValue;
  }

  function ensureHighlightStyles() {
    if (document.getElementById(HIGHLIGHT_STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = HIGHLIGHT_STYLE_ID;
    style.textContent = `
      .${HIGHLIGHT_CLASS} {
        border-radius: 3px;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        padding: 0 0.12em;
      }
    `;
    document.documentElement.append(style);
  }

  function isHighlightSkippedElement(element) {
    if (!(element instanceof Element)) {
      return true;
    }

    return Boolean(element.closest([
      `.${HIGHLIGHT_CLASS}`,
      "script",
      "style",
      "noscript",
      "textarea",
      "input",
      "select",
      "option",
      "pre",
      "code",
      "svg",
      "canvas",
      "button",
      "nav",
      "aside",
      "header",
      "footer",
      "[contenteditable]",
      PROMPT_TEXTAREA_SELECTOR,
    ].join(",")));
  }

  function getHighlightRoots() {
    const selectors = [
      'main [data-message-author-role]',
      "main article",
      "main .markdown",
    ];

    for (const selector of selectors) {
      const roots = Array.from(document.querySelectorAll(selector))
        .filter((element) => element instanceof HTMLElement && !isHighlightSkippedElement(element));
      if (roots.length > 0) {
        return roots;
      }
    }

    return [];
  }

  function removeExistingHighlights() {
    const parents = new Set();
    for (const highlight of Array.from(document.querySelectorAll(`.${HIGHLIGHT_CLASS}`))) {
      const parent = highlight.parentNode;
      if (!parent) {
        continue;
      }

      parents.add(parent);
      highlight.replaceWith(document.createTextNode(highlight.textContent ?? ""));
    }

    for (const parent of parents) {
      parent.normalize();
    }
  }

  function doesTokenMatchPattern(token, pattern) {
    if (!token?.normalized || !pattern?.value) {
      return false;
    }

    if (pattern.mode === "contains") {
      return token.normalized.includes(pattern.value);
    }

    if (pattern.mode === "startsWith") {
      return token.normalized.startsWith(pattern.value);
    }

    if (pattern.mode === "endsWith") {
      return token.normalized.endsWith(pattern.value);
    }

    return token.normalized === pattern.value;
  }

  function doesPatternSequenceMatchAt(tokens, startIndex, targetPatterns) {
    if (startIndex + targetPatterns.length > tokens.length) {
      return false;
    }

    for (let offset = 0; offset < targetPatterns.length; offset += 1) {
      if (!doesTokenMatchPattern(tokens[startIndex + offset], targetPatterns[offset])) {
        return false;
      }
    }

    return true;
  }

  function mapRawMatchToTokenBounds(tokens, matchStart, matchEnd) {
    if (!Array.isArray(tokens) || matchEnd <= matchStart) {
      return null;
    }

    let startIndex = -1;
    let endIndex = -1;

    tokens.forEach((token, index) => {
      if (matchStart < token.end && matchEnd > token.start) {
        if (startIndex < 0) {
          startIndex = index;
        }

        endIndex = index;
      }
    });

    if (startIndex < 0 || endIndex < 0) {
      return null;
    }

    return {
      startIndex,
      endIndex,
    };
  }

  function collectRegexEntryMatches(text, tokens, entry) {
    if (typeof text !== "string" || !(entry?.regex instanceof RegExp)) {
      return [];
    }

    const matches = [];
    entry.regex.lastIndex = 0;

    let match = entry.regex.exec(text);
    while (match) {
      const matchText = match[0] ?? "";
      if (matchText.length > 0) {
        const bounds = mapRawMatchToTokenBounds(
          tokens,
          match.index,
          match.index + matchText.length,
        );
        if (bounds) {
          matches.push({
            ...bounds,
            start: match.index,
            end: match.index + matchText.length,
            priority: Boolean(entry.priority),
          });
        }
      } else {
        entry.regex.lastIndex += 1;
      }

      match = entry.regex.exec(text);
    }

    return matches;
  }

  function collectTermEntryMatches(text, tokens, entry) {
    if (entry?.type === "regex") {
      return collectRegexEntryMatches(text, tokens, entry);
    }

    if (entry?.type !== "sequence" || !Array.isArray(entry.patterns) || entry.patterns.length === 0) {
      return [];
    }

    const matches = [];
    for (let startIndex = 0; startIndex <= tokens.length - entry.patterns.length; startIndex += 1) {
      if (!doesPatternSequenceMatchAt(tokens, startIndex, entry.patterns)) {
        continue;
      }

      matches.push({
        startIndex,
        endIndex: startIndex + entry.patterns.length - 1,
        start: tokens[startIndex].start,
        end: tokens[startIndex + entry.patterns.length - 1].end,
        priority: Boolean(entry.priority),
      });
    }

    return matches;
  }

  function findPreviousAdjacentMatch(text, tokens, anchorStartIndex, companionTermEntries, maxOffset) {
    const earliestEndIndex = Math.max(0, anchorStartIndex - maxOffset);
    let bestMatch = null;

    for (const companionEntry of companionTermEntries) {
      for (const match of collectTermEntryMatches(text, tokens, companionEntry)) {
        if (match.endIndex >= anchorStartIndex || match.endIndex < earliestEndIndex) {
          continue;
        }

        if (
          !bestMatch
          || match.endIndex > bestMatch.endIndex
          || (match.endIndex === bestMatch.endIndex && match.startIndex < bestMatch.startIndex)
        ) {
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }

  function findNextAdjacentMatch(text, tokens, anchorEndIndex, companionTermEntries, maxOffset) {
    const latestStartIndex = Math.min(tokens.length - 1, anchorEndIndex + maxOffset);
    let bestMatch = null;

    for (const companionEntry of companionTermEntries) {
      for (const match of collectTermEntryMatches(text, tokens, companionEntry)) {
        if (match.startIndex <= anchorEndIndex || match.startIndex > latestStartIndex) {
          continue;
        }

        if (
          !bestMatch
          || match.startIndex < bestMatch.startIndex
          || (match.startIndex === bestMatch.startIndex && match.endIndex > bestMatch.endIndex)
        ) {
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }

  function collectAdjacentHighlightMatches(text, tokens, targetMatch, companionTermEntries, companionDistance) {
    const matches = [{
      startIndex: targetMatch.startIndex,
      endIndex: targetMatch.endIndex,
      start: targetMatch.start,
      end: targetMatch.end,
      priority: Boolean(targetMatch.priority),
    }];
    const targetStartIndex = targetMatch.startIndex;
    const targetEndIndex = targetMatch.endIndex;
    if (!Array.isArray(companionTermEntries) || companionTermEntries.length === 0) {
      return matches;
    }

    const maxOffset = Math.max(1, (Number.parseInt(`${companionDistance}`, 10) || 0) + 1);
    let startIndex = targetStartIndex;
    let endIndex = targetEndIndex;

    while (startIndex > 0) {
      const foundMatch = findPreviousAdjacentMatch(text, tokens, startIndex, companionTermEntries, maxOffset);
      if (!foundMatch) {
        break;
      }

      matches.push(foundMatch);
      startIndex = foundMatch.startIndex;
    }

    while (endIndex < tokens.length - 1) {
      const foundMatch = findNextAdjacentMatch(text, tokens, endIndex, companionTermEntries, maxOffset);
      if (!foundMatch) {
        break;
      }

      matches.push(foundMatch);
      endIndex = foundMatch.endIndex;
    }

    return matches;
  }

  function compareHighlightRangePreference(left, right) {
    return (
      Number(right.priority) - Number(left.priority)
      || (right.end - right.start) - (left.end - left.start)
      || left.start - right.start
      || left.ruleIndex - right.ruleIndex
    );
  }

  function canMergeHighlightSegments(left, right) {
    return Boolean(
      left
      && right
      && left.end === right.start
      && left.color === right.color
      && left.textColor === right.textColor
    );
  }

  function resolveHighlightRangeOverlaps(ranges) {
    const validRanges = ranges.filter((range) => (
      Number.isFinite(range.start)
      && Number.isFinite(range.end)
      && range.start < range.end
    ));
    if (validRanges.length <= 1) {
      return validRanges.sort((left, right) => left.start - right.start);
    }

    const boundaries = Array.from(new Set(
      validRanges.flatMap((range) => [range.start, range.end]),
    )).sort((left, right) => left - right);
    const selectedSegments = [];

    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const start = boundaries[index];
      const end = boundaries[index + 1];
      const candidates = validRanges
        .filter((range) => range.start <= start && range.end >= end)
        .sort(compareHighlightRangePreference);

      if (candidates.length === 0) {
        continue;
      }

      const selectedRange = {
        ...candidates[0],
        start,
        end,
      };
      const previousSegment = selectedSegments[selectedSegments.length - 1];
      if (canMergeHighlightSegments(previousSegment, selectedRange)) {
        previousSegment.end = selectedRange.end;
        previousSegment.priority = previousSegment.priority || selectedRange.priority;
        continue;
      }

      selectedSegments.push(selectedRange);
    }

    return selectedSegments;
  }

  function rangesOverlap(left, right) {
    return Boolean(
      left
      && right
      && Number.isFinite(left.start)
      && Number.isFinite(left.end)
      && Number.isFinite(right.start)
      && Number.isFinite(right.end)
      && left.start < right.end
      && right.start < left.end
    );
  }

  function collectExcludedMatches(text, tokens, excludedTermEntries) {
    if (!Array.isArray(excludedTermEntries) || excludedTermEntries.length === 0) {
      return [];
    }

    return excludedTermEntries.flatMap((entry) => (
      collectTermEntryMatches(text, tokens, entry)
    ));
  }

  function isExcludedMatch(match, excludedMatches) {
    return excludedMatches.some((excludedMatch) => rangesOverlap(match, excludedMatch));
  }

  function collectHighlightRanges(text, rules) {
    const tokens = extractWordTokens(text);
    const ranges = [];

    if (tokens.length === 0) {
      return ranges;
    }

    rules.forEach((rule, ruleIndex) => {
      if (!rule.enabled) {
        return;
      }

      const excludedMatches = collectExcludedMatches(text, tokens, rule.excludedTermEntries);
      for (const targetEntry of rule.targetTermEntries) {
        for (const targetMatch of collectTermEntryMatches(text, tokens, targetEntry)) {
          if (isExcludedMatch(targetMatch, excludedMatches)) {
            continue;
          }

          const relatedMatches = collectAdjacentHighlightMatches(
            text,
            tokens,
            targetMatch,
            rule.companionTermEntries,
            rule.companionDistance,
          );

          relatedMatches.forEach((relatedMatch) => {
            if (isExcludedMatch(relatedMatch, excludedMatches)) {
              return;
            }

            ranges.push({
              start: relatedMatch.start,
              end: relatedMatch.end,
              color: rule.color,
              textColor: rule.textColor,
              priority: Boolean(targetMatch.priority || relatedMatch.priority),
              ruleIndex,
            });
          });
        }
      }
    });

    return resolveHighlightRangeOverlaps(ranges);
  }

  function applyHighlightsToTextNode(textNode, rules) {
    const text = textNode.nodeValue ?? "";
    const ranges = collectHighlightRanges(text, rules);
    if (ranges.length === 0) {
      return;
    }

    const fragment = document.createDocumentFragment();
    let currentOffset = 0;

    for (const range of ranges) {
      if (range.start > currentOffset) {
        fragment.append(document.createTextNode(text.slice(currentOffset, range.start)));
      }

      const highlight = document.createElement("span");
      highlight.className = HIGHLIGHT_CLASS;
      highlight.dataset.localQueryBridgeHighlight = "true";
      highlight.style.backgroundColor = range.color;
      highlight.style.color = range.textColor;
      highlight.textContent = text.slice(range.start, range.end);
      fragment.append(highlight);
      currentOffset = range.end;
    }

    if (currentOffset < text.length) {
      fragment.append(document.createTextNode(text.slice(currentOffset)));
    }

    textNode.replaceWith(fragment);
  }

  function collectHighlightTextNodes(root) {
    if (!(root instanceof Node)) {
      return [];
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        const parentElement = node.parentElement;
        if (!parentElement || isHighlightSkippedElement(parentElement)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const textNodes = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    return textNodes;
  }

  function runHighlightPass() {
    if (highlightState.applying) {
      return;
    }

    highlightState.timerId = null;
    highlightState.applying = true;

    try {
      ensureHighlightStyles();
      removeExistingHighlights();

      if (highlightState.rules.length === 0) {
        return;
      }

      for (const root of getHighlightRoots()) {
        for (const textNode of collectHighlightTextNodes(root)) {
          applyHighlightsToTextNode(textNode, highlightState.rules);
        }
      }
    } finally {
      highlightState.applying = false;
    }
  }

  function scheduleHighlightPass() {
    if (highlightState.applying) {
      return;
    }

    if (highlightState.timerId !== null) {
      window.clearTimeout(highlightState.timerId);
    }

    highlightState.timerId = window.setTimeout(runHighlightPass, HIGHLIGHT_DEBOUNCE_MS);
  }

  function refreshHighlightsNow() {
    if (highlightState.timerId !== null) {
      window.clearTimeout(highlightState.timerId);
      highlightState.timerId = null;
    }

    runHighlightPass();
  }

  async function loadHighlightRules() {
    const [localStored, stored] = await Promise.all([
      chrome.storage.local.get({
        [STORAGE_KEY_HIGHLIGHT_RULES]: null,
        [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: null,
      }),
      chrome.storage.sync.get({
        [STORAGE_KEY_HIGHLIGHT_RULES]: null,
        [STORAGE_KEY_ANALYSIS_TOC_COLORS]: null,
        [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: null,
        [STORAGE_KEY_ANALYSIS_TOC_LABELS]: null,
        [STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]: null,
        [STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]: null,
        [STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE]: null,
        [STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]: null,
        [STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
        [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER]: null,
        [STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: null,
        [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES]: null,
      }),
    ]);
    const taskType = sanitizeServerControlTaskTypeKey(serverControlMenuState.currentTaskType);
    analysisTocState.taskTypeTocEntries = sanitizeTaskTypeAnalysisTocEntriesMap(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES],
    );
    const entries = getAnalysisTocEntries(taskType);

    highlightState.rules = compileHighlightRules(getTaskTypeScopedStorageValue(
      localStored[STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES] ?? stored[STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES],
      taskType,
      localStored[STORAGE_KEY_HIGHLIGHT_RULES] ?? stored[STORAGE_KEY_HIGHLIGHT_RULES],
    ));
    analysisTocState.buttonColors = sanitizeAnalysisTocButtonColors(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_COLORS],
    ), entries);
    analysisTocState.buttonSettings = sanitizeAnalysisTocButtonSettings(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS],
    ), entries);
    analysisTocState.buttonLabels = sanitizeAnalysisTocButtonLabels(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_LABELS],
    ), entries);
    analysisTocState.buttonOrder = sanitizeAnalysisTocButtonOrder(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER],
    ), entries);
    analysisTocState.columnPositions = sanitizeAnalysisTocColumnPositions(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS],
    ));
    analysisTocState.columnOpacity = sanitizeAnalysisTocColumnOpacity(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY],
    ));
    analysisTocState.columnScale = sanitizeAnalysisTocColumnScale(getTaskTypeScopedStorageValue(
      stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE],
      taskType,
      stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE],
    ));
    analysisTocState.latestPromptScrollHoldSeconds = sanitizeLatestPromptScrollHoldSeconds(
      getTaskTypeScopedStorageValue(
        stored[STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS],
        taskType,
        stored[STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS],
      ),
    );
    syncAnalysisTocButtonsForAssistantElement(
      analysisTocState.currentAssistantElement instanceof HTMLElement
        ? analysisTocState.currentAssistantElement
        : getLatestAssistantMessage(),
    );
    applyAnalysisTocButtonColors();
    applyAnalysisTocButtonSettings();
    applyAnalysisTocButtonLabels();
    scheduleHighlightPass();
  }

  function initializeHighlighting() {
    const scopedSettingKeys = new Set([
      STORAGE_KEY_HIGHLIGHT_RULES,
      STORAGE_KEY_ANALYSIS_TOC_COLORS,
      STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS,
      STORAGE_KEY_ANALYSIS_TOC_LABELS,
      STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS,
      STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY,
      STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE,
      STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER,
      STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS,
      STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER,
      STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS,
      STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES,
    ]);

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync" && areaName !== "local") {
        return;
      }

      if (
        areaName === "local"
        && !changes[STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]
        && !changes[STORAGE_KEY_HIGHLIGHT_RULES]
      ) {
        return;
      }

      if (areaName === "local" || Object.keys(changes).some((key) => scopedSettingKeys.has(key))) {
        void loadHighlightRules().catch((error) => {
          console.error("Local Query Bridge scoped highlight/TOC setting reload failed", error);
        });
      }
    });

    void loadHighlightRules().catch((error) => {
      console.error("Local Query Bridge highlight rule load failed", error);
    });
  }

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
    handleAnalysisTextHighlightSignal(source);

    if (autoScrollState.runId === 0 || autoScrollState.userScrolled) {
      return;
    }

    autoScrollState.userScrolled = true;
    console.log("Local Query Bridge noted manual scroll during rating watch", { source, runId: autoScrollState.runId });
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

  async function ensureWebSearchForTaskTypeIfRequired(taskTypeKey, taskCount) {
    const sanitizedTaskTypeKey = sanitizeServerControlTaskTypeKey(taskTypeKey);
    if (!doesServerControlTaskTypeRequireWebSearchChip(sanitizedTaskTypeKey)) {
      console.log("Local Query Bridge skipping web search requirement", {
        taskCount,
        taskType: sanitizedTaskTypeKey,
      });
      return;
    }

    await ensureWebSearchEnabled();
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

  function getAssistantMessages() {
    return Array.from(document.querySelectorAll(ASSISTANT_MESSAGE_SELECTOR))
      .filter((element) => element instanceof HTMLElement);
  }

  function getUserMessages() {
    return Array.from(document.querySelectorAll(USER_MESSAGE_SELECTOR))
      .filter((element) => element instanceof HTMLElement);
  }

  function getLatestUserMessage() {
    const messages = getUserMessages();
    return messages[messages.length - 1] ?? null;
  }

  function getLatestAssistantMessage() {
    const messages = getAssistantMessages();
    return messages[messages.length - 1] ?? null;
  }

  function getCurrentAssistantMessageForRun(baselineAssistantCount) {
    const messages = getAssistantMessages();
    if (messages.length <= baselineAssistantCount) {
      return isResponseGenerating() ? (messages[messages.length - 1] ?? null) : null;
    }

    return messages[messages.length - 1] ?? null;
  }

  function ensureAnalysisTocStyles() {
    if (document.getElementById(ANALYSIS_TOC_STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = ANALYSIS_TOC_STYLE_ID;
    style.textContent = `
      .${ANALYSIS_TOC_BUTTON_CLASS} {
        position: fixed;
        left: ${ANALYSIS_TOC_DEFAULT_LEFT_X_PX}px;
        z-index: 2147483647;
        transform: translateY(-50%) scale(var(--local-query-bridge-analysis-toc-scale, 1));
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid rgba(15, 23, 42, 0.2);
        border-radius: 8px;
        background: #0f172a;
        color: #ffffff;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
        cursor: pointer;
        font: 650 12px/1.2 "Segoe UI", system-ui, sans-serif;
        padding: 6px 9px;
        transition: opacity 120ms ease, filter 120ms ease, background-color 120ms ease, transform 120ms ease;
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}:hover {
        background: #1e293b;
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}.${ANALYSIS_TOC_BUTTON_ACTIVE_CLASS} {
        border-color: rgba(37, 99, 235, 0.35);
        background: var(--local-query-bridge-analysis-active-color, #2563eb);
        color: var(--local-query-bridge-analysis-active-text-color, #ffffff);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}.${ANALYSIS_TOC_BUTTON_ACTIVE_CLASS}:hover {
        filter: brightness(0.92);
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}:focus {
        outline: 3px solid rgba(15, 23, 42, 0.2);
        outline-offset: 2px;
      }

      .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS} {
        position: fixed;
        left: ${ANALYSIS_TOC_DEFAULT_LEFT_X_PX}px;
        z-index: 2147483647;
        transform: translateY(-50%) scale(var(--local-query-bridge-analysis-toc-scale, 1));
        width: 26px;
        height: 24px;
        border: 1px solid rgba(15, 23, 42, 0.2);
        border-radius: 999px;
        background: #ffffff;
        color: #0f172a;
        box-shadow: 0 7px 16px rgba(15, 23, 42, 0.16);
        cursor: pointer;
        font: 800 12px/1 "Segoe UI", system-ui, sans-serif;
        padding: 0;
        transition: opacity 120ms ease, background-color 120ms ease, transform 120ms ease;
      }

      .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}:hover {
        background: #f8fafc;
      }

      .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}:focus {
        outline: 3px solid rgba(15, 23, 42, 0.18);
        outline-offset: 2px;
      }
    `;
    document.documentElement.append(style);
  }

  function getAnalysisTocButton(headingKey) {
    return Array.from(document.querySelectorAll(`.${ANALYSIS_TOC_BUTTON_CLASS}`))
      .find((button) => button instanceof HTMLButtonElement && button.dataset.headingKey === headingKey) ?? null;
  }

  function getAnalysisTocToggleButtonId(side) {
    return `${ANALYSIS_TOC_TOGGLE_BUTTON_ID_PREFIX}-${side}`;
  }

  function getAnalysisTocToggleButton(side) {
    const button = document.getElementById(getAnalysisTocToggleButtonId(side));
    return button instanceof HTMLButtonElement ? button : null;
  }

  function getAnalysisTocColumnElements(side) {
    return Array.from(document.querySelectorAll(
      `.${ANALYSIS_TOC_BUTTON_CLASS}[data-toc-side="${side}"], .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}[data-toc-side="${side}"]`,
    )).filter((element) => element instanceof HTMLElement);
  }

  function getClosestAnalysisTocColumnElement(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    const element = target.closest(`.${ANALYSIS_TOC_BUTTON_CLASS}, .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}`);
    return element instanceof HTMLElement ? element : null;
  }

  function isPointerStillInAnalysisTocColumn(relatedTarget, side) {
    const element = getClosestAnalysisTocColumnElement(relatedTarget);
    return element instanceof HTMLElement && element.dataset.tocSide === side;
  }

  function applyAnalysisTocColumnOpacity(side) {
    const opacity = analysisTocState.hoveredSides.has(side)
      ? 1
      : getAnalysisTocColumnIdleOpacity(side);

    for (const element of getAnalysisTocColumnElements(side)) {
      element.style.opacity = String(opacity);
    }
  }

  function applyAnalysisTocColumnOpacities() {
    applyAnalysisTocColumnOpacity(ANALYSIS_TOC_SIDE_LEFT);
    applyAnalysisTocColumnOpacity(ANALYSIS_TOC_SIDE_RIGHT);
  }

  function bindAnalysisTocColumnHover(element) {
    if (element.dataset.tocHoverBound === "true") {
      return;
    }

    element.dataset.tocHoverBound = "true";
    element.addEventListener("pointerenter", (event) => {
      const side = event.currentTarget?.dataset?.tocSide;
      if (!ANALYSIS_TOC_ALLOWED_SIDES.has(side)) {
        return;
      }

      analysisTocState.hoveredSides.add(side);
      applyAnalysisTocColumnOpacity(side);
    });
    element.addEventListener("pointerleave", (event) => {
      const side = event.currentTarget?.dataset?.tocSide;
      if (!ANALYSIS_TOC_ALLOWED_SIDES.has(side) || isPointerStillInAnalysisTocColumn(event.relatedTarget, side)) {
        return;
      }

      analysisTocState.hoveredSides.delete(side);
      applyAnalysisTocColumnOpacity(side);
    });
  }

  function isAnalysisTocSideCollapsed(side) {
    return analysisTocState.collapsedSides.has(side);
  }

  function getAnalysisTocSideLabel(side) {
    return side === ANALYSIS_TOC_SIDE_RIGHT ? "right" : "left";
  }

  function ensureAnalysisTocToggleButton(side) {
    let button = getAnalysisTocToggleButton(side);
    if (button instanceof HTMLButtonElement) {
      return button;
    }

    button = document.createElement("button");
    button.id = getAnalysisTocToggleButtonId(side);
    button.className = ANALYSIS_TOC_TOGGLE_BUTTON_CLASS;
    button.type = "button";
    button.dataset.tocSide = side;
    bindAnalysisTocColumnHover(button);
    button.addEventListener("click", () => {
      handleAnalysisTextHighlightSignal("analysis-toc-toggle-click");
      if (isAnalysisTocSideCollapsed(side)) {
        analysisTocState.collapsedSides.delete(side);
      } else {
        analysisTocState.collapsedSides.add(side);
      }

      applyAnalysisTocButtonSettings();
    });
    document.body.append(button);
    return button;
  }

  function ensureAnalysisTocToggleButtons() {
    ensureAnalysisTocToggleButton(ANALYSIS_TOC_SIDE_LEFT);
    ensureAnalysisTocToggleButton(ANALYSIS_TOC_SIDE_RIGHT);
  }

  function setAnalysisTocButtonColorVariables(button, headingKey) {
    const backgroundColor = getAnalysisTocButtonColor(headingKey);
    button.style.setProperty("--local-query-bridge-analysis-active-color", backgroundColor);
    button.style.setProperty("--local-query-bridge-analysis-active-text-color", getReadableTextColor(backgroundColor));
  }

  function applyAnalysisTocColumnSidePosition(element, side) {
    const columnPositions = getAnalysisTocColumnPositions();
    element.dataset.tocSide = side;
    element.style.setProperty("--local-query-bridge-analysis-toc-scale", String(getAnalysisTocColumnScale(side)));
    element.style.transformOrigin = side === ANALYSIS_TOC_SIDE_RIGHT ? "right center" : "left center";
    bindAnalysisTocColumnHover(element);
    if (side === ANALYSIS_TOC_SIDE_RIGHT) {
      element.style.left = "auto";
      element.style.right = `${columnPositions.rightInsetPx}px`;
    } else {
      element.style.left = `${columnPositions.leftPx}px`;
      element.style.right = "auto";
    }
  }

  function applyAnalysisTocButtonPlacement(button, headingKey, verticalOffsetPx) {
    const side = getAnalysisTocButtonSettings(headingKey).side;
    applyAnalysisTocColumnSidePosition(button, side);

    button.style.top = `calc(50% + ${verticalOffsetPx}px)`;
  }

  function applyAnalysisTocToggleButtonState(button, side, verticalOffsetPx, hasEntries) {
    const isCollapsed = isAnalysisTocSideCollapsed(side);
    const sideLabel = getAnalysisTocSideLabel(side);
    button.hidden = !hasEntries;
    button.textContent = isCollapsed ? "v" : "^";
    button.title = `${isCollapsed ? "Expand" : "Collapse"} ${sideLabel} TOC column`;
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-expanded", String(!isCollapsed));
    button.style.top = `calc(50% + ${verticalOffsetPx}px)`;
    applyAnalysisTocColumnSidePosition(button, side);
  }

  function applyAnalysisTocButtonLabel(button, headingKey) {
    const label = getAnalysisTocButtonLabel(headingKey);
    button.textContent = label;
    button.title = label;
  }

  function setAnalysisTocButtonActive(headingKey, isActive) {
    const button = getAnalysisTocButton(headingKey);
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    setAnalysisTocButtonColorVariables(button, headingKey);
    button.classList.toggle(ANALYSIS_TOC_BUTTON_ACTIVE_CLASS, Boolean(isActive));
  }

  function applyAnalysisTocButtonColors() {
    for (const headingEntry of getAnalysisTocEntries()) {
      const button = getAnalysisTocButton(headingEntry.key);
      if (button instanceof HTMLButtonElement) {
        setAnalysisTocButtonColorVariables(button, headingEntry.key);
      }
    }
  }

  function applyAnalysisTocButtonSettings() {
    const sideGroups = {
      [ANALYSIS_TOC_SIDE_LEFT]: [],
      [ANALYSIS_TOC_SIDE_RIGHT]: [],
    };

    for (const headingEntry of getOrderedAnalysisHeadingEntries()) {
      const side = getAnalysisTocButtonSettings(headingEntry.key).side;
      sideGroups[side === ANALYSIS_TOC_SIDE_RIGHT ? ANALYSIS_TOC_SIDE_RIGHT : ANALYSIS_TOC_SIDE_LEFT].push(headingEntry);
    }

    for (const side of [ANALYSIS_TOC_SIDE_LEFT, ANALYSIS_TOC_SIDE_RIGHT]) {
      const entries = sideGroups[side];
      const toggleButton = getAnalysisTocToggleButton(side);
      const isCollapsed = isAnalysisTocSideCollapsed(side);
      const buttonMidpoint = (entries.length - 1) / 2;
      const scaledGapPx = ANALYSIS_TOC_GAP_PX * getAnalysisTocColumnScale(side);
      const toggleOffsetPx = -(buttonMidpoint + 1) * scaledGapPx;

      if (toggleButton instanceof HTMLButtonElement) {
        applyAnalysisTocToggleButtonState(
          toggleButton,
          side,
          entries.length > 0 ? toggleOffsetPx : 0,
          entries.length > 0,
        );
      }

      entries.forEach((headingEntry, groupIndex) => {
        const button = getAnalysisTocButton(headingEntry.key);
        if (button instanceof HTMLButtonElement) {
          button.hidden = isCollapsed;
          applyAnalysisTocButtonPlacement(
            button,
            headingEntry.key,
            (groupIndex - buttonMidpoint) * scaledGapPx,
          );
        }
      });
    }

    applyAnalysisTocColumnOpacities();
  }

  function applyAnalysisTocButtonLabels() {
    for (const headingEntry of getAnalysisTocEntries()) {
      const button = getAnalysisTocButton(headingEntry.key);
      if (button instanceof HTMLButtonElement) {
        applyAnalysisTocButtonLabel(button, headingEntry.key);
      }
    }
  }

  function resetAnalysisTocButtonStates() {
    Array.from(document.querySelectorAll(`.${ANALYSIS_TOC_BUTTON_CLASS}`)).forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        button.classList.remove(ANALYSIS_TOC_BUTTON_ACTIVE_CLASS);
      }
    });
  }

  function ensureAnalysisTocButtons() {
    if (!document.body) {
      return;
    }

    ensureAnalysisTocStyles();
    ensureAnalysisTocToggleButtons();
    const orderedEntries = getOrderedAnalysisHeadingEntries();
    const allowedKeys = new Set(orderedEntries.map((entry) => entry.key));
    Array.from(document.querySelectorAll(`.${ANALYSIS_TOC_BUTTON_CLASS}`)).forEach((button) => {
      if (
        button instanceof HTMLButtonElement
        && !allowedKeys.has(button.dataset.headingKey ?? "")
      ) {
        button.remove();
      }
    });

    for (const headingEntry of orderedEntries) {
      if (getAnalysisTocButton(headingEntry.key) instanceof HTMLButtonElement) {
        continue;
      }

      const button = document.createElement("button");
      button.className = ANALYSIS_TOC_BUTTON_CLASS;
      button.type = "button";
      button.dataset.headingKey = headingEntry.key;
      setAnalysisTocButtonColorVariables(button, headingEntry.key);
      applyAnalysisTocButtonLabel(button, headingEntry.key);
      button.addEventListener("click", () => {
        void scrollToAnalysisTocTarget(headingEntry.key);
        window.requestAnimationFrame(() => {
          handleAnalysisTextHighlightSignal("analysis-toc-click");
        });
      });
      document.body.append(button);
    }

    applyAnalysisTocButtonSettings();
  }

  function initializeAnalysisTocButtons() {
    if (document.body) {
      ensureAnalysisTocButtons();
      return;
    }

    document.addEventListener("DOMContentLoaded", ensureAnalysisTocButtons, { once: true });
  }

  function ensureServerControlMenuStyles() {
    if (document.getElementById(SERVER_CONTROL_MENU_STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = SERVER_CONTROL_MENU_STYLE_ID;
    style.textContent = `
      #${SERVER_CONTROL_MENU_ID} {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 2147483647;
        height: 50vh;
        box-sizing: border-box;
        display: block;
        padding: 0;
        border-bottom: 1px solid rgba(15, 23, 42, 0.18);
        background: rgba(248, 250, 252, 0.98);
        color: #0f172a;
        box-shadow: 0 18px 50px rgba(15, 23, 42, 0.24);
        font: 13px/1.35 "Segoe UI", system-ui, sans-serif;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-100%);
        transition: opacity 140ms ease, transform 160ms ease;
      }

      #${SERVER_CONTROL_MENU_ID}.${SERVER_CONTROL_MENU_OPEN_CLASS} {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      #${SERVER_CONTROL_MENU_ID} * {
        box-sizing: border-box;
        letter-spacing: 0;
      }

      .local-query-bridge-server-control-header-actions {
        flex: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .local-query-bridge-server-control-project-toggle {
        min-width: 42px;
        min-height: 30px;
        border: 1px solid rgba(51, 65, 85, 0.22);
        border-radius: 8px;
        background: #ffffff;
        color: #0f172a;
        cursor: pointer;
        font: 750 12px/1 "Segoe UI", system-ui, sans-serif;
        padding: 7px 10px;
        transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
      }

      .local-query-bridge-server-control-project-toggle:hover {
        border-color: rgba(37, 99, 235, 0.45);
        background: #eff6ff;
      }

      .local-query-bridge-server-control-project-toggle.${SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS} {
        border-color: rgba(37, 99, 235, 0.52);
        background: #1d4ed8;
        color: #ffffff;
      }

      .local-query-bridge-server-control-project-panel {
        position: absolute;
        top: 41px;
        right: 0;
        z-index: 1;
        width: min(360px, 100vw);
        display: grid;
        gap: 9px;
        padding: 10px;
        border: 1px solid rgba(51, 65, 85, 0.22);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 14px 38px rgba(15, 23, 42, 0.18);
      }

      .local-query-bridge-server-control-project-panel[hidden] {
        display: none;
      }

      .local-query-bridge-server-control-project-panel-title {
        margin: 0;
        overflow: hidden;
        color: #334155;
        font-size: 12px;
        font-weight: 750;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .local-query-bridge-server-control-content {
        height: 100%;
        display: grid;
        grid-template-columns: minmax(0, 3.2fr) minmax(170px, 0.8fr);
        align-items: stretch;
        gap: 0;
        min-height: 0;
        overflow: hidden;
      }

      .local-query-bridge-server-control-group {
        min-width: 0;
      }

      .local-query-bridge-server-control-region-panel {
        min-width: 0;
        min-height: 0;
        display: grid;
        gap: 10px;
        align-content: start;
        overflow: auto;
        padding: 14px;
        background: #f8fafc;
      }

      .local-query-bridge-server-control-column-header {
        min-width: 0;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 10px 0 11px;
        border-bottom: 1px solid rgba(51, 65, 85, 0.14);
        background: #f8fafc;
      }

      .local-query-bridge-server-control-group-title {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        color: #334155;
        font-size: 12px;
        font-weight: 750;
        line-height: 1.2;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .local-query-bridge-server-control-column {
        min-width: 0;
        min-height: 0;
        height: 100%;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        align-content: stretch;
        gap: 0;
        overflow: hidden;
        border: 0;
        border-right: 1px solid rgba(51, 65, 85, 0.18);
        border-radius: 0;
        background: #ffffff;
      }

      .local-query-bridge-server-control-content > .local-query-bridge-server-control-column:last-child {
        border-right: 0;
      }

      .local-query-bridge-server-control-segment-bar,
      .local-query-bridge-server-control-region-picker {
        display: grid;
        align-content: start;
        gap: 0;
        overflow: hidden;
        border: 1px solid rgba(51, 65, 85, 0.18);
        border-radius: 8px;
        background: #ffffff;
      }

      .local-query-bridge-server-control-column > .local-query-bridge-server-control-segment-bar {
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        border: 0;
        border-radius: 0;
        align-content: start;
      }

      .local-query-bridge-server-control-button {
        width: 100%;
        min-width: 0;
        min-height: 38px;
        border: 0;
        border-bottom: 1px solid rgba(51, 65, 85, 0.14);
        border-radius: 0;
        background: #ffffff;
        color: #0f172a;
        cursor: pointer;
        font: 650 12px/1.2 "Segoe UI", system-ui, sans-serif;
        padding: 8px 11px;
        text-align: left;
        white-space: normal;
        overflow-wrap: anywhere;
        transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
      }

      .local-query-bridge-server-control-segment-bar > .local-query-bridge-server-control-button:last-child,
      .local-query-bridge-server-control-region-picker > .local-query-bridge-server-control-button:last-child {
        border-bottom: 0;
      }

      .local-query-bridge-server-control-button:hover {
        background: #f8fafc;
      }

      .local-query-bridge-server-control-button:focus {
        outline: 3px solid rgba(37, 99, 235, 0.2);
        outline-offset: -3px;
      }

      .local-query-bridge-server-control-button:disabled {
        cursor: wait;
        opacity: 0.72;
      }

      .local-query-bridge-server-control-button.${SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS} {
        background: #dbeafe;
        color: #1d4ed8;
        box-shadow: inset 3px 0 0 #2563eb;
      }

      .local-query-bridge-server-control-region-button {
        width: 100%;
        min-width: auto;
        min-height: 30px;
        padding: 6px 9px;
      }

      .local-query-bridge-server-control-column-button {
        width: 100%;
        min-width: 0;
      }

      .local-query-bridge-server-control-action-column {
        background: #f8fafc;
        grid-template-rows: minmax(0, 1fr);
      }

      .local-query-bridge-server-control-action-grid {
        height: 100%;
        display: grid;
        grid-template-columns: repeat(var(--local-query-bridge-action-count, 1), minmax(0, 1fr));
        grid-auto-rows: minmax(0, 1fr);
        align-content: stretch;
        align-items: stretch;
        overflow: hidden;
      }

      .local-query-bridge-server-control-action-grid.${SERVER_CONTROL_ZONE_LEGEND_ACTIVE_CLASS} {
        background: #dbeafe;
      }

      .local-query-bridge-server-control-action-button {
        min-height: 0;
        height: 100%;
        display: grid;
        place-items: center;
        border-right: 1px solid rgba(51, 65, 85, 0.16);
        border-bottom: 0;
        background: #ffffff;
        font-size: 24px;
        font-weight: 850;
        line-height: 1.12;
        text-align: center;
        padding: 24px;
      }

      .local-query-bridge-server-control-action-grid.${SERVER_CONTROL_ZONE_LEGEND_ACTIVE_CLASS} .local-query-bridge-server-control-action-button {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .local-query-bridge-server-control-action-button:last-child {
        border-right: 0;
      }

      .local-query-bridge-server-control-action-button.${SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS} {
        box-shadow: inset 0 6px 0 #2563eb;
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID} {
        position: fixed;
        z-index: 2147483646;
        display: none;
        pointer-events: none;
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID}.${SERVER_CONTROL_ZONE_OVERLAY_ACTIVE_CLASS} {
        display: block;
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID} .local-query-bridge-server-control-zone-divider {
        position: absolute;
        top: 0;
        width: 3px;
        transform: translateX(-50%);
        border-radius: 999px;
        height: 100%;
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID} .local-query-bridge-server-control-zone-divider-segment {
        position: absolute;
        right: 0;
        left: 0;
        border-radius: 999px;
        background: rgba(37, 99, 235, var(--local-query-bridge-zone-divider-opacity, ${DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY}));
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.42), 0 0 18px rgba(37, 99, 235, 0.24);
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID} .local-query-bridge-server-control-zone-divider-segment[data-zone-divider-segment="top"] {
        top: 0;
        height: min(var(--local-query-bridge-zone-divider-top-length, ${DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX}px), 50%);
      }

      #${SERVER_CONTROL_ZONE_OVERLAY_ID} .local-query-bridge-server-control-zone-divider-segment[data-zone-divider-segment="bottom"] {
        bottom: 0;
        height: min(var(--local-query-bridge-zone-divider-bottom-length, ${DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX}px), 50%);
      }

      .local-query-bridge-server-control-project-account-button {
        display: grid;
        grid-template-columns: minmax(80px, 0.45fr) minmax(0, 1fr);
        gap: 8px;
        align-items: center;
      }

      .local-query-bridge-server-control-project-account-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .local-query-bridge-server-control-project-account-id {
        min-width: 0;
        overflow: hidden;
        color: inherit;
        font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
        font-size: 11px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .local-query-bridge-server-control-region-cross {
        display: grid;
        grid-template-columns: minmax(88px, 1fr) minmax(128px, 1.15fr) minmax(88px, 1fr);
        grid-template-rows: auto auto auto;
        align-items: center;
        gap: 8px;
      }

      .local-query-bridge-server-control-coordinate {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .local-query-bridge-server-control-coordinate[data-grid-position="top"] {
        grid-column: 2;
        grid-row: 1;
      }

      .local-query-bridge-server-control-coordinate[data-grid-position="left"] {
        grid-column: 1;
        grid-row: 2;
      }

      .local-query-bridge-server-control-coordinate[data-grid-position="right"] {
        grid-column: 3;
        grid-row: 2;
      }

      .local-query-bridge-server-control-coordinate[data-grid-position="bottom"] {
        grid-column: 2;
        grid-row: 3;
      }

      .local-query-bridge-server-control-coordinate-label {
        color: #475569;
        font-size: 11px;
        font-weight: 750;
      }

      .local-query-bridge-server-control-coordinate input {
        width: 100%;
        min-height: 32px;
        border: 1px solid rgba(51, 65, 85, 0.22);
        border-radius: 8px;
        background: #ffffff;
        color: #0f172a;
        font: 650 12px/1.2 "Segoe UI", system-ui, sans-serif;
        padding: 7px 8px;
      }

      .local-query-bridge-server-control-coordinate input:focus {
        outline: 3px solid rgba(37, 99, 235, 0.18);
        outline-offset: 1px;
      }

      .local-query-bridge-server-control-region-center {
        grid-column: 2;
        grid-row: 2;
        min-height: 56px;
        display: grid;
        place-items: center;
        border: 1px dashed rgba(51, 65, 85, 0.32);
        border-radius: 8px;
        background: rgba(241, 245, 249, 0.78);
        color: #0f172a;
        font-size: 13px;
        font-weight: 800;
        text-align: center;
        padding: 10px;
      }

      .local-query-bridge-server-control-region-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .local-query-bridge-server-control-review {
        display: grid;
        gap: 5px;
      }

      .local-query-bridge-server-control-review label {
        color: #475569;
        font-size: 11px;
        font-weight: 750;
        text-transform: uppercase;
      }

      .local-query-bridge-server-control-review textarea {
        width: 100%;
        min-height: 54px;
        max-height: 120px;
        resize: vertical;
        border: 1px solid rgba(51, 65, 85, 0.22);
        border-radius: 8px;
        background: #ffffff;
        color: #0f172a;
        font: 12px/1.35 "Segoe UI", system-ui, sans-serif;
        padding: 8px 9px;
      }

      .local-query-bridge-server-control-review textarea:focus {
        outline: 3px solid rgba(37, 99, 235, 0.18);
        outline-offset: 1px;
      }

      @media (max-width: 720px) {
        #${SERVER_CONTROL_MENU_ID} {
          padding: 0;
        }

        .local-query-bridge-server-control-project-panel {
          top: 41px;
          right: 0;
          width: 100vw;
        }

        .local-query-bridge-server-control-content {
          grid-template-columns: 1fr;
          overflow: auto;
        }

        .local-query-bridge-server-control-action-grid {
          min-height: 220px;
          grid-template-columns: 1fr;
        }

        .local-query-bridge-server-control-action-button {
          min-height: 96px;
          border-right: 0;
          border-bottom: 1px solid rgba(51, 65, 85, 0.16);
          font-size: 22px;
        }

        .local-query-bridge-server-control-region-cross {
          grid-template-columns: 1fr;
        }

        .local-query-bridge-server-control-coordinate[data-grid-position],
        .local-query-bridge-server-control-region-center {
          grid-column: 1;
          grid-row: auto;
        }
      }
    `;
    document.documentElement.append(style);
  }

  function getServerControlMenu() {
    const menu = document.getElementById(SERVER_CONTROL_MENU_ID);
    return menu instanceof HTMLElement ? menu : null;
  }

  function sanitizeServerControlZoneDividerOpacity(value) {
    const parsedValue = Number.parseFloat(`${value}`);
    if (!Number.isFinite(parsedValue)) {
      return DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY;
    }

    const normalizedValue = parsedValue > 1 ? parsedValue / 100 : parsedValue;
    return Math.min(
      SERVER_CONTROL_ZONE_DIVIDER_MAX_OPACITY,
      Math.max(SERVER_CONTROL_ZONE_DIVIDER_MIN_OPACITY, normalizedValue),
    );
  }

  function sanitizeServerControlZoneDividerLength(value) {
    const parsedValue = Number.parseInt(`${value}`, 10);
    if (!Number.isFinite(parsedValue)) {
      return DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX;
    }

    return Math.min(
      SERVER_CONTROL_ZONE_DIVIDER_MAX_LENGTH_PX,
      Math.max(SERVER_CONTROL_ZONE_DIVIDER_MIN_LENGTH_PX, parsedValue),
    );
  }

  function getServerControlZoneOverlay() {
    const overlay = document.getElementById(SERVER_CONTROL_ZONE_OVERLAY_ID);
    return overlay instanceof HTMLElement ? overlay : null;
  }

  function ensureServerControlZoneOverlay() {
    ensureServerControlMenuStyles();
    let overlay = getServerControlZoneOverlay();
    if (overlay instanceof HTMLElement) {
      return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = SERVER_CONTROL_ZONE_OVERLAY_ID;
    overlay.setAttribute("aria-hidden", "true");
    document.body.append(overlay);
    return overlay;
  }

  function getServerControlZoneRoot() {
    const preferredRoot = document.getElementsByClassName("@container/main relative")[0];
    if (preferredRoot instanceof HTMLElement) {
      return preferredRoot;
    }

    return document.querySelector("main")
      ?? document.querySelector('[role="main"]')
      ?? document.body;
  }

  function getCurrentServerControlActionEntries() {
    return getCurrentServerControlTaskTypeDefinition().actions
      .map((actionKey) => {
        const actionDefinition = SERVER_CONTROL_ACTION_DEFINITIONS[actionKey];
        return actionDefinition ? { ...actionDefinition, actionKey } : null;
      })
      .filter(Boolean);
  }

  function syncServerControlZoneOverlay() {
    const overlay = ensureServerControlZoneOverlay();
    const actionEntries = getCurrentServerControlActionEntries();
    const root = getServerControlZoneRoot();
    overlay.style.setProperty(
      "--local-query-bridge-zone-divider-opacity",
      `${sanitizeServerControlZoneDividerOpacity(serverControlMenuState.zoneDividerOpacity)}`,
    );
    overlay.style.setProperty(
      "--local-query-bridge-zone-divider-top-length",
      `${sanitizeServerControlZoneDividerLength(serverControlMenuState.zoneDividerTopLengthPx)}px`,
    );
    overlay.style.setProperty(
      "--local-query-bridge-zone-divider-bottom-length",
      `${sanitizeServerControlZoneDividerLength(serverControlMenuState.zoneDividerBottomLengthPx)}px`,
    );
    if (
      !serverControlMenuState.zoneClickEnabled
      || actionEntries.length <= 1
      || !(root instanceof HTMLElement)
    ) {
      overlay.classList.remove(SERVER_CONTROL_ZONE_OVERLAY_ACTIVE_CLASS);
      overlay.replaceChildren();
      return;
    }

    const rootRect = root.getBoundingClientRect();
    if (rootRect.width <= 0 || rootRect.height <= 0) {
      overlay.classList.remove(SERVER_CONTROL_ZONE_OVERLAY_ACTIVE_CLASS);
      overlay.replaceChildren();
      return;
    }

    overlay.style.left = `${rootRect.left}px`;
    overlay.style.top = `${rootRect.top}px`;
    overlay.style.width = `${rootRect.width}px`;
    overlay.style.height = `${rootRect.height}px`;
    overlay.replaceChildren();
    for (let index = 1; index < actionEntries.length; index += 1) {
      const divider = document.createElement("div");
      divider.className = "local-query-bridge-server-control-zone-divider";
      divider.style.left = `${(index / actionEntries.length) * 100}%`;
      for (const segment of ["top", "bottom"]) {
        const segmentElement = document.createElement("div");
        segmentElement.className = "local-query-bridge-server-control-zone-divider-segment";
        segmentElement.dataset.zoneDividerSegment = segment;
        divider.append(segmentElement);
      }
      overlay.append(divider);
    }
    overlay.classList.add(SERVER_CONTROL_ZONE_OVERLAY_ACTIVE_CLASS);
  }

  function setServerControlZoneClickEnabled(enabled) {
    serverControlMenuState.zoneClickEnabled = Boolean(enabled);
    syncServerControlActionControls();
    syncServerControlZoneOverlay();
    updateServerControlMenuStatus();
  }

  function toggleServerControlZoneClickEnabled() {
    setServerControlZoneClickEnabled(!serverControlMenuState.zoneClickEnabled);
  }

  function getServerControlZoneActionForPoint(clientX, clientY) {
    const actionEntries = getCurrentServerControlActionEntries();
    if (!serverControlMenuState.zoneClickEnabled || actionEntries.length === 0) {
      return null;
    }

    const root = getServerControlZoneRoot();
    if (!(root instanceof HTMLElement)) {
      return null;
    }

    const rootRect = root.getBoundingClientRect();
    if (
      rootRect.width <= 0
      || rootRect.height <= 0
      || clientX < rootRect.left
      || clientX > rootRect.right
      || clientY < rootRect.top
      || clientY > rootRect.bottom
    ) {
      return null;
    }

    const zoneIndex = Math.min(
      actionEntries.length - 1,
      Math.max(0, Math.floor(((clientX - rootRect.left) / rootRect.width) * actionEntries.length)),
    );
    return actionEntries[zoneIndex] ?? null;
  }

  function getSelectedTextForServerControlZone() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return "";
    }

    return selection.toString().trim();
  }

  function isServerControlZoneExcludedTarget(target) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return isEditableTarget(target)
      || Boolean(target.closest([
        `#${SERVER_CONTROL_MENU_ID}`,
        `.${ANALYSIS_TOC_BUTTON_CLASS}`,
        `.${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}`,
      ].join(",")));
  }

  function handleServerControlZonePointerDown(event) {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    serverControlZonePointerState.button = event.button;
    serverControlZonePointerState.startX = event.clientX;
    serverControlZonePointerState.startY = event.clientY;
    serverControlZonePointerState.moved = false;
  }

  function handleServerControlZonePointerMove(event) {
    if (!(event instanceof MouseEvent) || serverControlZonePointerState.button !== 0) {
      return;
    }

    const distanceX = Math.abs(event.clientX - serverControlZonePointerState.startX);
    const distanceY = Math.abs(event.clientY - serverControlZonePointerState.startY);
    if (
      distanceX > SERVER_CONTROL_ZONE_SELECTION_DRAG_THRESHOLD_PX
      || distanceY > SERVER_CONTROL_ZONE_SELECTION_DRAG_THRESHOLD_PX
    ) {
      serverControlZonePointerState.moved = true;
    }
  }

  function handleServerControlZoneContextMenu() {
    serverControlZonePointerState.lastContextMenuAt = Date.now();
    serverControlZonePointerState.button = null;
    serverControlZonePointerState.moved = false;
  }

  function shouldIgnoreServerControlZoneClick(event) {
    if (!(event instanceof MouseEvent) || event.button !== 0) {
      return true;
    }

    if (Date.now() - serverControlZonePointerState.lastContextMenuAt < SERVER_CONTROL_ZONE_CONTEXT_MENU_SUPPRESS_MS) {
      return true;
    }

    if (
      serverControlZonePointerState.button !== null
      && serverControlZonePointerState.button !== 0
    ) {
      return true;
    }

    if (serverControlZonePointerState.moved) {
      return true;
    }

    if (getSelectedTextForServerControlZone()) {
      return true;
    }

    return isServerControlZoneExcludedTarget(event.target);
  }

  function handleServerControlZoneClick(event) {
    if (shouldIgnoreServerControlZoneClick(event)) {
      return;
    }

    const actionEntry = getServerControlZoneActionForPoint(event.clientX, event.clientY);
    serverControlZonePointerState.button = null;
    if (!actionEntry) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    void sendServerControlMenuCommand(actionEntry, "Zone", null);
  }

  function sanitizeServerControlCoordinate(value, fallback = 0) {
    const parsedValue = Number.parseInt(`${value}`, 10);
    if (!Number.isFinite(parsedValue)) {
      return fallback;
    }

    return Math.min(
      SERVER_CONTROL_REGION_COORDINATE_MAX,
      Math.max(SERVER_CONTROL_REGION_COORDINATE_MIN, parsedValue),
    );
  }

  function sanitizeServerControlRegionBounds(rawValue, fallbackBounds) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};

    return Object.fromEntries(
      SERVER_CONTROL_REGION_COORDINATES.map((coordinate) => [
        coordinate.key,
        sanitizeServerControlCoordinate(source[coordinate.key], fallbackBounds[coordinate.key] ?? 0),
      ]),
    );
  }

  function normalizeServerControlConfigText(value, fallback = "") {
    const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
    return text || fallback;
  }

  function createServerControlConfigKey(value, fallbackPrefix = "task") {
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

  function makeUniqueServerControlConfigKey(baseKey, usedKeys) {
    let candidateKey = baseKey;
    let suffix = 2;
    while (usedKeys.has(candidateKey)) {
      candidateKey = `${baseKey}-${suffix}`;
      suffix += 1;
    }
    usedKeys.add(candidateKey);
    return candidateKey;
  }

  function getDefaultServerControlRegionDefinition(regionKey) {
    return DEFAULT_SERVER_CONTROL_REGION_DEFINITIONS.find((definition) => definition.key === regionKey) ?? null;
  }

  function normalizeServerControlRegionKind(value) {
    const kind = typeof value === "string" ? value.trim() : "";
    if ([
      SERVER_CONTROL_REGION_KIND_OCR,
      SERVER_CONTROL_REGION_KIND_SCREENSHOT,
      SERVER_CONTROL_REGION_KIND_GOOGLE_RESULTS,
    ].includes(kind)) {
      return kind;
    }

    return SERVER_CONTROL_REGION_KIND_OCR;
  }

  function sanitizeServerControlRegionDefinition(rawRegion, fallbackLabel = "OCR region") {
    if (typeof rawRegion === "string") {
      const defaultRegion = getDefaultServerControlRegionDefinition(rawRegion);
      if (defaultRegion) {
        return {
          ...defaultRegion,
          defaultBounds: { ...defaultRegion.defaultBounds },
        };
      }

      const label = normalizeServerControlConfigText(rawRegion, fallbackLabel);
      return {
        key: createServerControlConfigKey(label, "region"),
        label,
        kind: SERVER_CONTROL_REGION_KIND_OCR,
        defaultBounds: { ...DEFAULT_SERVER_CONTROL_REGION_BOUNDS },
      };
    }

    const source = rawRegion && typeof rawRegion === "object" && !Array.isArray(rawRegion)
      ? rawRegion
      : {};
    const label = normalizeServerControlConfigText(source.label, fallbackLabel);
    const kind = normalizeServerControlRegionKind(source.kind);
    let key = normalizeServerControlConfigText(source.key, "");
    if (kind === SERVER_CONTROL_REGION_KIND_SCREENSHOT) {
      key = SERVER_CONTROL_REGION_DEFAULT_KEY;
    } else if (kind === SERVER_CONTROL_REGION_KIND_GOOGLE_RESULTS) {
      key = "googleResults";
    } else {
      key = createServerControlConfigKey(key || label, "region");
    }

    return {
      key,
      label,
      kind,
      defaultBounds: sanitizeServerControlRegionBounds(source.defaultBounds, DEFAULT_SERVER_CONTROL_REGION_BOUNDS),
    };
  }

  function normalizeServerControlActionKeys(rawValue) {
    const allowedActionKeys = new Set(Object.keys(SERVER_CONTROL_ACTION_DEFINITIONS));
    const source = Array.isArray(rawValue) ? rawValue : [];
    const seenKeys = new Set();
    return source
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter((value) => allowedActionKeys.has(value))
      .filter((value) => {
        if (seenKeys.has(value)) {
          return false;
        }

        seenKeys.add(value);
        return true;
      });
  }

  function normalizeServerControlRequireWebSearchChip(value) {
    return value !== false;
  }

  function ensureServerControlTaskDefinitionFeatures(taskDefinition, regionDefinitionsByKey) {
    const actions = new Set(normalizeServerControlActionKeys(taskDefinition.actions));
    const regions = taskDefinition.regions.filter((regionKey) => {
      if (regionKey === SERVER_CONTROL_REGION_DEFAULT_KEY) {
        return actions.has("screenshot");
      }
      if (regionKey === "googleResults") {
        return actions.has("googleSearch");
      }

      return true;
    });
    if (actions.has("screenshot") && !regions.includes(SERVER_CONTROL_REGION_DEFAULT_KEY)) {
      regions.push(SERVER_CONTROL_REGION_DEFAULT_KEY);
      regionDefinitionsByKey.set(SERVER_CONTROL_REGION_DEFAULT_KEY, sanitizeServerControlRegionDefinition({
        ...getDefaultServerControlRegionDefinition(SERVER_CONTROL_REGION_DEFAULT_KEY),
      }));
    }
    if (actions.has("googleSearch") && !regions.includes("googleResults")) {
      regions.push("googleResults");
      regionDefinitionsByKey.set("googleResults", sanitizeServerControlRegionDefinition({
        ...getDefaultServerControlRegionDefinition("googleResults"),
      }));
    }
    if (actions.has("ocr")) {
      const hasOcrRegion = regions.some((regionKey) => (
        regionDefinitionsByKey.get(regionKey)?.kind === SERVER_CONTROL_REGION_KIND_OCR
      ));
      if (!hasOcrRegion) {
        const fullTaskOcrRegion = sanitizeServerControlRegionDefinition({
          key: "fullTaskOcr",
          label: "Full task OCR",
          kind: SERVER_CONTROL_REGION_KIND_OCR,
        });
        regions.push(fullTaskOcrRegion.key);
        regionDefinitionsByKey.set(fullTaskOcrRegion.key, fullTaskOcrRegion);
      }
    }

    return {
      ...taskDefinition,
      actions: Array.from(actions),
      regions,
    };
  }

  function sanitizeServerControlTaskTypeDefinitions(rawValue) {
    const sourceDefinitions = Array.isArray(rawValue) && rawValue.length > 0
      ? rawValue
      : DEFAULT_SERVER_CONTROL_TASK_TYPE_DEFINITIONS;
    const usedTaskKeys = new Set();
    const regionDefinitionsByKey = new Map(
      DEFAULT_SERVER_CONTROL_REGION_DEFINITIONS.map((definition) => [
        definition.key,
        {
          ...definition,
          defaultBounds: { ...definition.defaultBounds },
        },
      ]),
    );
    const taskDefinitions = [];

    for (const [index, rawDefinition] of sourceDefinitions.entries()) {
      if (!rawDefinition || typeof rawDefinition !== "object" || Array.isArray(rawDefinition)) {
        continue;
      }

      const label = normalizeServerControlConfigText(rawDefinition.label, `Task type ${index + 1}`);
      const key = makeUniqueServerControlConfigKey(
        createServerControlConfigKey(rawDefinition.key || label, "task"),
        usedTaskKeys,
      );
      const rawRegions = Array.isArray(rawDefinition.regions) ? rawDefinition.regions : [];
      const seenRegionKeys = new Set();
      const regions = [];
      for (const [regionIndex, rawRegion] of rawRegions.entries()) {
        const regionDefinition = sanitizeServerControlRegionDefinition(rawRegion, `OCR region ${regionIndex + 1}`);
        if (!regionDefinition.key || seenRegionKeys.has(regionDefinition.key)) {
          continue;
        }

        seenRegionKeys.add(regionDefinition.key);
        regions.push(regionDefinition.key);
        regionDefinitionsByKey.set(regionDefinition.key, regionDefinition);
      }

      taskDefinitions.push(ensureServerControlTaskDefinitionFeatures({
        key,
        label,
        regions,
        actions: normalizeServerControlActionKeys(rawDefinition.actions),
        requireWebSearchChip: normalizeServerControlRequireWebSearchChip(rawDefinition.requireWebSearchChip),
        boilerplatePrompt: typeof rawDefinition.boilerplatePrompt === "string"
          ? rawDefinition.boilerplatePrompt.trim()
          : "",
      }, regionDefinitionsByKey));
    }

    if (taskDefinitions.length === 0) {
      return sanitizeServerControlTaskTypeDefinitions(DEFAULT_SERVER_CONTROL_TASK_TYPE_DEFINITIONS);
    }

    return {
      taskDefinitions,
      regionDefinitions: Array.from(regionDefinitionsByKey.values()),
    };
  }

  function applyServerControlTaskTypeDefinitions(rawValue) {
    const sanitizedDefinitions = sanitizeServerControlTaskTypeDefinitions(rawValue);
    SERVER_CONTROL_TASK_TYPE_DEFINITIONS = sanitizedDefinitions.taskDefinitions;
    SERVER_CONTROL_REGION_DEFINITIONS = sanitizedDefinitions.regionDefinitions;
  }

  function getServerControlTaskTypeDefinition(taskTypeKey) {
    return SERVER_CONTROL_TASK_TYPE_DEFINITIONS.find((definition) => definition.key === taskTypeKey)
      ?? SERVER_CONTROL_TASK_TYPE_DEFINITIONS[0];
  }

  function sanitizeServerControlTaskTypeKey(value) {
    return getServerControlTaskTypeDefinition(value)?.key ?? SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS;
  }

  function getCurrentServerControlTaskTypeDefinition() {
    return getServerControlTaskTypeDefinition(serverControlMenuState.currentTaskType);
  }

  function doesServerControlTaskTypeRequireWebSearchChip(taskTypeKey = serverControlMenuState.currentTaskType) {
    return getServerControlTaskTypeDefinition(sanitizeServerControlTaskTypeKey(taskTypeKey))?.requireWebSearchChip !== false;
  }

  function getTaskRegionDefinitions(taskTypeKey = serverControlMenuState.currentTaskType) {
    const taskDefinition = getServerControlTaskTypeDefinition(taskTypeKey);
    return taskDefinition.regions
      .map((regionKey) => getServerControlRegionDefinition(regionKey))
      .filter(Boolean);
  }

  function isServerControlUniversalRegion(regionKey) {
    const regionDefinition = getServerControlRegionDefinition(regionKey);
    return SERVER_CONTROL_UNIVERSAL_REGION_KEYS.has(regionKey)
      || regionDefinition.kind === SERVER_CONTROL_REGION_KIND_GOOGLE_RESULTS;
  }

  function getDefaultServerControlTaskRegions() {
    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => [
        taskDefinition.key,
        Object.fromEntries(
          taskDefinition.regions
            .filter((regionKey) => !isServerControlUniversalRegion(regionKey))
            .map((regionKey) => {
              const regionDefinition = getServerControlRegionDefinition(regionKey);
              return [regionKey, { ...regionDefinition.defaultBounds }];
            }),
        ),
      ]),
    );
  }

  function getDefaultServerControlUniversalRegions() {
    return Object.fromEntries(
      Array.from(SERVER_CONTROL_UNIVERSAL_REGION_KEYS).map((regionKey) => {
        const regionDefinition = getServerControlRegionDefinition(regionKey);
        return [regionKey, { ...regionDefinition.defaultBounds }];
      }),
    );
  }

  function extractServerControlProjectId(value) {
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

  function sanitizeServerControlProjectId(value, fallback = "") {
    const projectId = extractServerControlProjectId(value);
    if (projectId) {
      return projectId;
    }

    return fallback ? extractServerControlProjectId(fallback) : "";
  }

  function sanitizeServerControlProjectIds(rawValue, fallbackProjectId = DEFAULT_PROJECT_ID) {
    const rawValues = Array.isArray(rawValue)
      ? rawValue
      : (typeof rawValue === "string" ? rawValue.split(/[\s,]+/) : []);
    const projectIds = [];
    const seenIds = new Set();

    for (const value of rawValues) {
      const projectId = sanitizeServerControlProjectId(value);
      if (!projectId || seenIds.has(projectId)) {
        continue;
      }

      projectIds.push(projectId);
      seenIds.add(projectId);
    }

    if (projectIds.length > 0) {
      return projectIds;
    }

    return [sanitizeServerControlProjectId(fallbackProjectId, DEFAULT_PROJECT_ID)];
  }

  function getDefaultServerControlTaskTypeProjectIds() {
    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => [
        taskDefinition.key,
        Object.fromEntries(
          SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition) => [
            accountDefinition.key,
            accountDefinition.key === SERVER_CONTROL_PROJECT_ACCOUNT_DEFAULT_KEY ? DEFAULT_PROJECT_ID : "",
          ]),
        ),
      ]),
    );
  }

  function getDefaultServerControlTaskTypeActiveProjectAccounts() {
    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => [
        taskDefinition.key,
        SERVER_CONTROL_PROJECT_ACCOUNT_DEFAULT_KEY,
      ]),
    );
  }

  function sanitizeServerControlProjectAccountKey(value) {
    const accountKey = typeof value === "string" ? value.trim() : "";
    return SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.some((definition) => definition.key === accountKey)
      ? accountKey
      : SERVER_CONTROL_PROJECT_ACCOUNT_DEFAULT_KEY;
  }

  function getServerControlProjectAccountLabel(accountKey) {
    return SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.find((definition) => definition.key === accountKey)?.label
      ?? accountKey;
  }

  function sanitizeServerControlTaskTypeProjectIds(rawValue) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};

    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => {
        const rawTaskProjects = source[taskDefinition.key];
        const legacyProjectIds = Array.isArray(rawTaskProjects)
          ? sanitizeServerControlProjectIds(rawTaskProjects, "")
          : [];
        const taskSource = rawTaskProjects && typeof rawTaskProjects === "object" && !Array.isArray(rawTaskProjects)
          ? rawTaskProjects
          : {};

        return [
          taskDefinition.key,
          Object.fromEntries(
            SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition, accountIndex) => [
              accountDefinition.key,
              sanitizeServerControlProjectId(
                taskSource[accountDefinition.key] ?? legacyProjectIds[accountIndex] ?? "",
              ),
            ]),
          ),
        ];
      }),
    );
  }

  function migrateServerControlTaskTypeProjectIds(rawTaskTypeProjectIds, legacyProjectIds) {
    const taskTypeProjectIds = sanitizeServerControlTaskTypeProjectIds(rawTaskTypeProjectIds);
    const rawSource = rawTaskTypeProjectIds && typeof rawTaskTypeProjectIds === "object" && !Array.isArray(rawTaskTypeProjectIds)
      ? rawTaskTypeProjectIds
      : {};
    const rawSearchProjects = rawSource[SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS];
    const hasAccountProjectMap = rawSearchProjects
      && typeof rawSearchProjects === "object"
      && !Array.isArray(rawSearchProjects)
      && SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.some((accountDefinition) => (
        Object.prototype.hasOwnProperty.call(rawSearchProjects, accountDefinition.key)
      ));
    if (hasAccountProjectMap) {
      return taskTypeProjectIds;
    }

    const currentSearchProjects = SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS
      .map((accountDefinition) => (
        taskTypeProjectIds[SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]?.[accountDefinition.key]
      ))
      .filter(Boolean);
    const migratedSearchProjects = sanitizeServerControlProjectIds([
      ...currentSearchProjects,
      ...(Array.isArray(legacyProjectIds) ? legacyProjectIds : []),
    ], "");

    return {
      ...taskTypeProjectIds,
      [SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]: Object.fromEntries(
        SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS.map((accountDefinition, accountIndex) => [
          accountDefinition.key,
          migratedSearchProjects[accountIndex] ?? "",
        ]),
      ),
    };
  }

  function sanitizeServerControlTaskTypeActiveProjectAccounts(rawValue) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};

    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => [
        taskDefinition.key,
        sanitizeServerControlProjectAccountKey(source[taskDefinition.key]),
      ]),
    );
  }

  function getServerControlActiveProjectAccount(taskTypeKey = serverControlMenuState.currentTaskType) {
    return sanitizeServerControlProjectAccountKey(
      serverControlMenuState.taskTypeActiveProjectAccounts[sanitizeServerControlTaskTypeKey(taskTypeKey)],
    );
  }

  function getServerControlProjectIdForTaskTypeAccount(
    taskTypeKey = serverControlMenuState.currentTaskType,
    accountKey = getServerControlActiveProjectAccount(taskTypeKey),
  ) {
    const sanitizedTaskTypeKey = sanitizeServerControlTaskTypeKey(taskTypeKey);
    const taskProjects = serverControlMenuState.taskTypeProjectIds[sanitizedTaskTypeKey] ?? {};
    const requestedProjectId = sanitizeServerControlProjectId(
      taskProjects[sanitizeServerControlProjectAccountKey(accountKey)],
    );
    if (requestedProjectId) {
      return requestedProjectId;
    }

    for (const accountDefinition of SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS) {
      const projectId = sanitizeServerControlProjectId(taskProjects[accountDefinition.key]);
      if (projectId) {
        return projectId;
      }
    }

    return DEFAULT_PROJECT_ID;
  }

  function getServerControlTaskTypeProjectIdsForPayload(taskTypeKey = serverControlMenuState.currentTaskType) {
    const sanitizedTaskTypeKey = sanitizeServerControlTaskTypeKey(taskTypeKey);
    return {
      ...(serverControlMenuState.taskTypeProjectIds[sanitizedTaskTypeKey] ?? {}),
    };
  }

  function sanitizeServerControlTaskRegions(rawValue) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};

    return Object.fromEntries(
      SERVER_CONTROL_TASK_TYPE_DEFINITIONS.map((taskDefinition) => [
        taskDefinition.key,
        Object.fromEntries(
          taskDefinition.regions
            .filter((regionKey) => !isServerControlUniversalRegion(regionKey))
            .map((regionKey) => {
              const regionDefinition = getServerControlRegionDefinition(regionKey);
              return [
                regionKey,
                sanitizeServerControlRegionBounds(
                  source[taskDefinition.key]?.[regionKey],
                  regionDefinition.defaultBounds,
                ),
              ];
            }),
        ),
      ]),
    );
  }

  function sanitizeServerControlUniversalRegions(rawValue) {
    const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue
      : {};

    return Object.fromEntries(
      Array.from(SERVER_CONTROL_UNIVERSAL_REGION_KEYS).map((regionKey) => {
        const regionDefinition = getServerControlRegionDefinition(regionKey);
        return [
          regionKey,
          sanitizeServerControlRegionBounds(source[regionKey], regionDefinition.defaultBounds),
        ];
      }),
    );
  }

  function getServerControlRegionDefinition(regionKey) {
    return SERVER_CONTROL_REGION_DEFINITIONS.find((definition) => definition.key === regionKey)
      ?? SERVER_CONTROL_REGION_DEFINITIONS[0];
  }

  function sanitizeServerControlRegionKey(value, taskTypeKey = serverControlMenuState.currentTaskType) {
    const regionDefinitions = getTaskRegionDefinitions(taskTypeKey);
    const matchingRegion = regionDefinitions.find((definition) => definition.key === value);
    return matchingRegion?.key ?? regionDefinitions[0]?.key ?? SERVER_CONTROL_REGION_DEFAULT_KEY;
  }

  function getSelectedServerControlRegionDefinition() {
    return getServerControlRegionDefinition(serverControlMenuState.selectedRegionKey);
  }

  function getServerControlRegionBounds(regionKey = serverControlMenuState.selectedRegionKey) {
    const sanitizedRegionKey = sanitizeServerControlRegionKey(regionKey);
    const regionDefinition = getServerControlRegionDefinition(sanitizedRegionKey);
    if (isServerControlUniversalRegion(sanitizedRegionKey)) {
      return serverControlMenuState.universalRegions[sanitizedRegionKey]
        ?? regionDefinition.defaultBounds;
    }

    return serverControlMenuState.taskRegions[serverControlMenuState.currentTaskType]?.[sanitizedRegionKey]
      ?? regionDefinition.defaultBounds;
  }

  function cloneServerControlRegions() {
    const taskRegions = sanitizeServerControlTaskRegions(serverControlMenuState.taskRegions);
    const universalRegions = sanitizeServerControlUniversalRegions(serverControlMenuState.universalRegions);
    const currentTaskRegions = taskRegions[serverControlMenuState.currentTaskType] ?? {};
    return {
      ...Object.fromEntries(
        Object.entries(currentTaskRegions).map(([key, bounds]) => [key, { ...bounds }]),
      ),
      ...Object.fromEntries(
        Object.entries(universalRegions).map(([key, bounds]) => [key, { ...bounds }]),
      ),
    };
  }

  function scheduleServerControlMenuSettingsPersist() {
    if (serverControlMenuState.persistTimerId !== null) {
      window.clearTimeout(serverControlMenuState.persistTimerId);
    }

    serverControlMenuState.persistTimerId = window.setTimeout(() => {
      serverControlMenuState.persistTimerId = null;
      void persistServerControlMenuSettings();
    }, SERVER_CONTROL_REGION_SAVE_DEBOUNCE_MS);
  }

  async function persistServerControlMenuSettings() {
    try {
      await chrome.storage.local.set({
        [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE]: serverControlMenuState.currentTaskType,
        [STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS]: sanitizeServerControlTaskRegions(serverControlMenuState.taskRegions),
        [STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS]: sanitizeServerControlUniversalRegions(serverControlMenuState.universalRegions),
        [STORAGE_KEY_SERVER_CONTROL_SELECTED_REGION]: serverControlMenuState.selectedRegionKey,
        [STORAGE_KEY_SERVER_CONTROL_OCR_REVIEW_TEXT]: serverControlMenuState.ocrReviewText,
        [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY]: sanitizeServerControlZoneDividerOpacity(
          serverControlMenuState.zoneDividerOpacity,
        ),
        [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH]: sanitizeServerControlZoneDividerLength(
          serverControlMenuState.zoneDividerTopLengthPx,
        ),
        [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH]: sanitizeServerControlZoneDividerLength(
          serverControlMenuState.zoneDividerBottomLengthPx,
        ),
      });
    } catch (error) {
      console.warn("Local Query Bridge failed to persist server control menu settings", error);
    }
  }

  async function loadServerControlMenuSettings() {
    try {
      const stored = await chrome.storage.local.get([
        STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS,
        STORAGE_KEY_SERVER_CONTROL_TASK_TYPE,
        STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS,
        STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS,
        STORAGE_KEY_SERVER_CONTROL_SELECTED_REGION,
        STORAGE_KEY_SERVER_CONTROL_OCR_REVIEW_TEXT,
        STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY,
        STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH,
        STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH,
      ]);
      applyServerControlTaskTypeDefinitions(stored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]);

      serverControlMenuState.currentTaskType = sanitizeServerControlTaskTypeKey(
        stored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE] ?? SERVER_CONTROL_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
      );
      serverControlMenuState.taskRegions = sanitizeServerControlTaskRegions(
        stored[STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS] ?? getDefaultServerControlTaskRegions(),
      );
      serverControlMenuState.universalRegions = sanitizeServerControlUniversalRegions(
        stored[STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS] ?? getDefaultServerControlUniversalRegions(),
      );
      serverControlMenuState.selectedRegionKey = sanitizeServerControlRegionKey(
        stored[STORAGE_KEY_SERVER_CONTROL_SELECTED_REGION] ?? SERVER_CONTROL_REGION_DEFAULT_KEY,
      );
      serverControlMenuState.ocrReviewText = typeof stored[STORAGE_KEY_SERVER_CONTROL_OCR_REVIEW_TEXT] === "string"
        ? stored[STORAGE_KEY_SERVER_CONTROL_OCR_REVIEW_TEXT]
        : "";
      serverControlMenuState.zoneDividerOpacity = sanitizeServerControlZoneDividerOpacity(
        stored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY],
      );
      serverControlMenuState.zoneDividerTopLengthPx = sanitizeServerControlZoneDividerLength(
        stored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH],
      );
      serverControlMenuState.zoneDividerBottomLengthPx = sanitizeServerControlZoneDividerLength(
        stored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH],
      );
      syncServerControlTaskTypeControls();
      syncServerControlActionControls();
      syncServerControlRegionControls();
      updateServerControlMenuStatus();
      void loadHighlightRules().catch((error) => {
        console.error("Local Query Bridge scoped highlight/TOC setting load failed", error);
      });
    } catch (error) {
      console.warn("Local Query Bridge failed to load server control menu settings", error);
    }
  }

  async function loadServerControlProjectSettings() {
    try {
      const stored = await chrome.storage.sync.get({
        [STORAGE_KEY_PROJECT_IDS]: null,
        [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: null,
        [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: getDefaultServerControlTaskTypeActiveProjectAccounts(),
      });

      serverControlMenuState.taskTypeProjectIds = migrateServerControlTaskTypeProjectIds(
        stored[STORAGE_KEY_TASK_TYPE_PROJECT_IDS],
        stored[STORAGE_KEY_PROJECT_IDS],
      );
      serverControlMenuState.taskTypeActiveProjectAccounts = sanitizeServerControlTaskTypeActiveProjectAccounts(
        stored[STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS],
      );
      syncServerControlProjectPickerControls();
      updateServerControlMenuStatus();
    } catch (error) {
      console.warn("Local Query Bridge failed to load server control project settings", error);
    }
  }

  function getActiveServerControlBoilerplatePrompt() {
    return getCurrentServerControlTaskTypeDefinition().boilerplatePrompt || BOILERPLATE_PROMPT;
  }

  function normalizePromptPlaceholderKey(value) {
    return (typeof value === "string" ? value : "")
      .replace(/^!/, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase();
  }

  function getServerControlPromptPlaceholderValues() {
    return {};
  }

  function replacePromptPlaceholdersInLine(line, placeholderValues, options = {}) {
    let hasPlaceholder = false;
    let hasMissingOptionalPlaceholder = false;
    const missingRequiredKeys = [];
    const screenshotMode = options.screenshotMode === true;
    const nextLine = line.replace(/\[(!?)([^\]\r\n]+)\]/g, (match, requiredPrefix, rawKey) => {
      hasPlaceholder = true;
      const placeholderKey = normalizePromptPlaceholderKey(rawKey);
      const value = placeholderValues[placeholderKey];
      const textValue = typeof value === "string" ? value.trim() : "";
      if (textValue) {
        return textValue;
      }

      if (requiredPrefix === "!" && !screenshotMode) {
        missingRequiredKeys.push(placeholderKey || match);
      } else {
        hasMissingOptionalPlaceholder = true;
      }
      return "";
    });

    return {
      line: nextLine,
      shouldSkip: hasPlaceholder && hasMissingOptionalPlaceholder && missingRequiredKeys.length === 0,
      missingRequiredKeys,
    };
  }

  function prepareServerControlBoilerplatePromptForSubmission() {
    const prompt = getActiveServerControlBoilerplatePrompt();
    const placeholderValues = getServerControlPromptPlaceholderValues();
    const screenshotMode = serverControlMenuState.processingMode === "screenshot";
    const missingRequiredKeys = new Set();
    const lines = [];

    for (const line of prompt.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
      const result = replacePromptPlaceholdersInLine(line, placeholderValues, { screenshotMode });
      for (const key of result.missingRequiredKeys) {
        if (key) {
          missingRequiredKeys.add(key);
        }
      }
      if (!result.shouldSkip) {
        lines.push(result.line);
      }
    }

    if (missingRequiredKeys.size > 0) {
      const missingList = Array.from(missingRequiredKeys).join(", ");
      const message = `Missing required OCR placeholder value(s): ${missingList}`;
      window.alert(message);
      throw new Error(message);
    }

    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function getServerControlMenuStatusText() {
    const taskLabel = getCurrentServerControlTaskTypeDefinition().label;
    const accountLabel = getServerControlProjectAccountLabel(getServerControlActiveProjectAccount());
    return `${taskLabel} | Zones: ${serverControlMenuState.zoneClickEnabled ? "on" : "off"} | Project: ${accountLabel}`;
  }

  function setServerControlMenuStatus(text) {
    const menu = getServerControlMenu();
    const status = menu?.querySelector("[data-control-menu-status]");
    if (status instanceof HTMLElement) {
      status.textContent = text || getServerControlMenuStatusText();
    }
  }

  function updateServerControlMenuStatus() {
    setServerControlMenuStatus(getServerControlMenuStatusText());
  }

  function syncServerControlMenuButtonStates() {
    syncServerControlTaskTypeControls();
    syncServerControlActionControls();
    syncServerControlRegionControls();
    syncServerControlProjectPickerControls();
    syncServerControlZoneOverlay();
  }

  function syncServerControlTaskTypeControls() {
    const menu = getServerControlMenu();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    const taskBar = menu.querySelector("[data-control-task-type-bar]");
    if (taskBar instanceof HTMLElement) {
      taskBar.replaceChildren();
      for (const taskDefinition of SERVER_CONTROL_TASK_TYPE_DEFINITIONS) {
        const button = document.createElement("button");
        button.className = "local-query-bridge-server-control-button local-query-bridge-server-control-column-button";
        button.type = "button";
        button.textContent = taskDefinition.label;
        button.dataset.command = "set_task_type";
        button.dataset.value = taskDefinition.key;
        button.dataset.controlTaskTypeKey = taskDefinition.key;
        button.addEventListener("click", () => {
          void sendServerControlMenuCommand(
            {
              label: taskDefinition.label,
              command: "set_task_type",
              value: taskDefinition.key,
            },
            "Task type",
            button,
          );
        });
        taskBar.append(button);
      }
    }

    for (const button of menu.querySelectorAll("[data-control-task-type-key]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }

      button.classList.toggle(
        SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS,
        button.dataset.controlTaskTypeKey === serverControlMenuState.currentTaskType,
      );
    }
  }

  function syncServerControlActionControls() {
    const menu = getServerControlMenu();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    const container = menu.querySelector("[data-control-action-column]");
    if (!(container instanceof HTMLElement)) {
      return;
    }

    const currentTaskDefinition = getCurrentServerControlTaskTypeDefinition();
    container.replaceChildren();
    container.style.setProperty(
      "--local-query-bridge-action-count",
      `${Math.max(1, currentTaskDefinition.actions.length)}`,
    );
    container.classList.toggle(
      SERVER_CONTROL_ZONE_LEGEND_ACTIVE_CLASS,
      serverControlMenuState.zoneClickEnabled,
    );
    container.title = serverControlMenuState.zoneClickEnabled
      ? "Zone click mode is on. Click to turn it off."
      : "Zone click mode is off. Click to turn it on.";
    for (const actionKey of currentTaskDefinition.actions) {
      const actionDefinition = SERVER_CONTROL_ACTION_DEFINITIONS[actionKey];
      if (!actionDefinition) {
        continue;
      }

      const button = document.createElement("button");
      button.className = "local-query-bridge-server-control-button local-query-bridge-server-control-action-button";
      button.type = "button";
      button.textContent = actionDefinition.label;
      button.dataset.command = actionDefinition.command;
      button.dataset.value = actionDefinition.value;
      button.dataset.controlActionKey = actionKey;
      button.classList.toggle(
        SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS,
        serverControlMenuState.zoneClickEnabled,
      );
      button.setAttribute("aria-pressed", serverControlMenuState.zoneClickEnabled ? "true" : "false");
      button.title = container.title;
      button.addEventListener("click", () => {
        toggleServerControlZoneClickEnabled();
      });
      container.append(button);
    }
  }

  function syncServerControlRegionControls() {
    const menu = getServerControlMenu();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    const selectedRegionKey = sanitizeServerControlRegionKey(serverControlMenuState.selectedRegionKey);
    serverControlMenuState.selectedRegionKey = selectedRegionKey;
    const selectedRegionDefinition = getSelectedServerControlRegionDefinition();
    const selectedRegionBounds = getServerControlRegionBounds(selectedRegionKey);

    const picker = menu.querySelector("[data-control-region-picker]");
    if (picker instanceof HTMLElement) {
      picker.replaceChildren();
      for (const regionDefinition of getTaskRegionDefinitions()) {
        const button = document.createElement("button");
        button.className = "local-query-bridge-server-control-button local-query-bridge-server-control-region-button";
        button.type = "button";
        button.textContent = regionDefinition.label;
        button.dataset.controlRegionKey = regionDefinition.key;
        button.addEventListener("click", () => {
          handleServerControlRegionPickerClick(regionDefinition.key);
        });
        picker.append(button);
      }
    }

    for (const button of menu.querySelectorAll("[data-control-region-key]")) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }

      button.classList.toggle(
        SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS,
        button.dataset.controlRegionKey === selectedRegionKey,
      );
    }

    for (const input of menu.querySelectorAll("[data-control-region-coordinate]")) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }

      const coordinateKey = input.dataset.controlRegionCoordinate;
      if (coordinateKey && coordinateKey in selectedRegionBounds) {
        input.value = `${selectedRegionBounds[coordinateKey]}`;
      }
    }

    const center = menu.querySelector("[data-control-region-center]");
    if (center instanceof HTMLElement) {
      center.textContent = selectedRegionDefinition.label;
    }

    const reviewTextArea = menu.querySelector("[data-control-review-text]");
    if (reviewTextArea instanceof HTMLTextAreaElement && reviewTextArea.value !== serverControlMenuState.ocrReviewText) {
      reviewTextArea.value = serverControlMenuState.ocrReviewText;
    }
  }

  function syncServerControlProjectPickerControls() {
    const menu = getServerControlMenu();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    const activeTaskType = sanitizeServerControlTaskTypeKey(serverControlMenuState.currentTaskType);
    const activeAccount = getServerControlActiveProjectAccount(activeTaskType);
    const toggle = menu.querySelector("[data-control-project-toggle]");
    if (toggle instanceof HTMLButtonElement) {
      toggle.classList.toggle(SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS, serverControlMenuState.projectPickerOpen);
      toggle.setAttribute("aria-expanded", serverControlMenuState.projectPickerOpen ? "true" : "false");
    }

    const panel = menu.querySelector("[data-control-project-panel]");
    if (panel instanceof HTMLElement) {
      panel.hidden = !serverControlMenuState.projectPickerOpen;
    }

    const title = menu.querySelector("[data-control-project-panel-title]");
    if (title instanceof HTMLElement) {
      title.textContent = getCurrentServerControlTaskTypeDefinition().label;
    }

    const accountBar = menu.querySelector("[data-control-project-account-bar]");
    if (!(accountBar instanceof HTMLElement)) {
      return;
    }

    accountBar.replaceChildren();
    const taskProjects = serverControlMenuState.taskTypeProjectIds[activeTaskType] ?? {};
    for (const accountDefinition of SERVER_CONTROL_PROJECT_ACCOUNT_DEFINITIONS) {
      const projectId = sanitizeServerControlProjectId(taskProjects[accountDefinition.key]);
      const button = document.createElement("button");
      button.className = "local-query-bridge-server-control-button local-query-bridge-server-control-project-account-button";
      button.type = "button";
      button.dataset.controlProjectAccountKey = accountDefinition.key;
      button.classList.toggle(
        SERVER_CONTROL_MENU_BUTTON_ACTIVE_CLASS,
        accountDefinition.key === activeAccount,
      );

      const accountLabel = document.createElement("span");
      accountLabel.className = "local-query-bridge-server-control-project-account-label";
      accountLabel.textContent = accountDefinition.label;

      const projectText = document.createElement("code");
      projectText.className = "local-query-bridge-server-control-project-account-id";
      projectText.textContent = projectId || "missing ID";

      button.append(accountLabel, projectText);
      button.addEventListener("click", () => {
        void sendServerControlMenuCommand(
          {
            label: accountDefinition.label,
            command: "set_project_account",
            value: accountDefinition.key,
          },
          "Project account",
          button,
        );
      });
      accountBar.append(button);
    }
  }

  function applyServerControlMenuCommandState(buttonConfig) {
    if (buttonConfig.command === "set_task_type") {
      serverControlMenuState.currentTaskType = sanitizeServerControlTaskTypeKey(buttonConfig.value);
      serverControlMenuState.selectedRegionKey = sanitizeServerControlRegionKey(
        serverControlMenuState.selectedRegionKey,
        serverControlMenuState.currentTaskType,
      );
      void loadHighlightRules().catch((error) => {
        console.error("Local Query Bridge scoped highlight/TOC setting switch failed", error);
      });
      scheduleServerControlMenuSettingsPersist();
    }

    if (buttonConfig.command === "set_project_account") {
      serverControlMenuState.taskTypeActiveProjectAccounts = {
        ...serverControlMenuState.taskTypeActiveProjectAccounts,
        [serverControlMenuState.currentTaskType]: sanitizeServerControlProjectAccountKey(buttonConfig.value),
      };
    }

    if (buttonConfig.actionKey) {
      serverControlMenuState.processingMode = buttonConfig.actionKey;
    }

    serverControlMenuState.lastCommand = buttonConfig.command;
    syncServerControlMenuButtonStates();
    updateServerControlMenuStatus();
  }

  function buildServerControlMenuPayload(buttonConfig, groupLabel) {
    const regionKey = sanitizeServerControlRegionKey(buttonConfig.regionKey ?? serverControlMenuState.selectedRegionKey);
    const regionDefinition = getServerControlRegionDefinition(regionKey);
    const regionBounds = getServerControlRegionBounds(regionKey);
    const activeProjectAccount = getServerControlActiveProjectAccount();
    const activeProjectId = getServerControlProjectIdForTaskTypeAccount(
      serverControlMenuState.currentTaskType,
      activeProjectAccount,
    );
    const payload = {
      source: "chatgpt-content-control-menu",
      command: buttonConfig.command,
      value: buttonConfig.value,
      label: buttonConfig.label,
      group: groupLabel,
      currentTaskType: serverControlMenuState.currentTaskType,
      currentTaskTypeLabel: getCurrentServerControlTaskTypeDefinition().label,
      processingMode: serverControlMenuState.processingMode,
      boilerplatePrompt: getActiveServerControlBoilerplatePrompt(),
      activeProjectAccount,
      activeProjectAccountLabel: getServerControlProjectAccountLabel(activeProjectAccount),
      activeProjectId,
      taskTypeProjectIds: getServerControlTaskTypeProjectIdsForPayload(),
      selectedRegion: regionKey,
      selectedRegionLabel: regionDefinition.label,
      selectedRegionBounds: { ...regionBounds },
      regions: cloneServerControlRegions(),
      taskRegions: sanitizeServerControlTaskRegions(serverControlMenuState.taskRegions),
      universalRegions: sanitizeServerControlUniversalRegions(serverControlMenuState.universalRegions),
      pageUrl: window.location.href,
      sentAt: new Date().toISOString(),
    };

    if (buttonConfig.includeReviewText) {
      payload.ocrReviewText = serverControlMenuState.ocrReviewText;
    } else if (serverControlMenuState.ocrReviewText) {
      payload.ocrReviewTextLength = serverControlMenuState.ocrReviewText.length;
    }

    return payload;
  }

  function handleServerControlRegionPickerClick(regionKey) {
    serverControlMenuState.selectedRegionKey = sanitizeServerControlRegionKey(regionKey);
    syncServerControlRegionControls();
    updateServerControlMenuStatus();
    scheduleServerControlMenuSettingsPersist();
  }

  function handleServerControlCoordinateInput(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const coordinateKey = input.dataset.controlRegionCoordinate;
    if (!SERVER_CONTROL_REGION_COORDINATES.some((coordinate) => coordinate.key === coordinateKey)) {
      return;
    }

    const selectedRegionKey = sanitizeServerControlRegionKey(serverControlMenuState.selectedRegionKey);
    const selectedRegionBounds = {
      ...getServerControlRegionBounds(selectedRegionKey),
      [coordinateKey]: sanitizeServerControlCoordinate(input.value),
    };

    if (isServerControlUniversalRegion(selectedRegionKey)) {
      serverControlMenuState.universalRegions = {
        ...serverControlMenuState.universalRegions,
        [selectedRegionKey]: selectedRegionBounds,
      };
    } else {
      serverControlMenuState.taskRegions = {
        ...serverControlMenuState.taskRegions,
        [serverControlMenuState.currentTaskType]: {
          ...(serverControlMenuState.taskRegions[serverControlMenuState.currentTaskType] ?? {}),
          [selectedRegionKey]: selectedRegionBounds,
        },
      };
    }
    scheduleServerControlMenuSettingsPersist();
  }

  function handleServerControlReviewTextInput(event) {
    const textArea = event.target;
    if (!(textArea instanceof HTMLTextAreaElement)) {
      return;
    }

    serverControlMenuState.ocrReviewText = textArea.value;
    scheduleServerControlMenuSettingsPersist();
  }

  async function sendServerControlMenuCommand(buttonConfig, groupLabel, button) {
    applyServerControlMenuCommandState(buttonConfig);
    if (buttonConfig.command === "set_task_type") {
      await persistServerControlMenuSettings();
    }
    const payload = buildServerControlMenuPayload(buttonConfig, groupLabel);
    if (button instanceof HTMLButtonElement) {
      button.disabled = true;
    }

    try {
      console.log("Local Query Bridge sending server control command", payload);
      const response = await chrome.runtime.sendMessage({
        type: SERVER_CONTROL_MENU_COMMAND_MESSAGE_TYPE,
        command: payload,
      });

      if (response?.ok !== true) {
        throw new Error(response?.error || "Server control command was not accepted");
      }

      setServerControlMenuStatus(`Sent: ${buttonConfig.label}`);
      window.setTimeout(updateServerControlMenuStatus, 1800);
    } catch (error) {
      console.error("Local Query Bridge server control command failed", error);
      setServerControlMenuStatus(`Failed: ${buttonConfig.label}`);
    } finally {
      if (button instanceof HTMLButtonElement) {
        button.disabled = false;
      }
    }
  }

  function createServerControlColumn(titleText, headerAction = null) {
    const column = document.createElement("section");
    column.className = "local-query-bridge-server-control-column";

    const header = document.createElement("div");
    header.className = "local-query-bridge-server-control-column-header";

    const title = document.createElement("h2");
    title.className = "local-query-bridge-server-control-group-title";
    title.textContent = titleText;

    header.append(title);
    if (headerAction instanceof HTMLElement) {
      header.append(headerAction);
    }

    column.append(header);
    return column;
  }

  function createServerControlSegmentBar() {
    const bar = document.createElement("div");
    bar.className = "local-query-bridge-server-control-segment-bar";
    return bar;
  }

  function createServerControlTaskTypeColumn() {
    const column = createServerControlColumn("Task types", createServerControlProjectControls());
    const bar = createServerControlSegmentBar();
    bar.dataset.controlTaskTypeBar = "true";

    column.append(bar);
    return column;
  }

  function createServerControlActionColumn() {
    const column = document.createElement("section");
    column.className = "local-query-bridge-server-control-column";
    column.classList.add("local-query-bridge-server-control-action-column");
    const actions = document.createElement("div");
    actions.className = "local-query-bridge-server-control-segment-bar local-query-bridge-server-control-action-grid";
    actions.dataset.controlActionColumn = "true";
    column.append(actions);
    return column;
  }

  function createServerControlRegionPickerColumn() {
    const column = createServerControlColumn("Regions", createServerControlProjectControls());
    const picker = document.createElement("div");
    picker.className = "local-query-bridge-server-control-segment-bar local-query-bridge-server-control-region-picker";
    picker.dataset.controlRegionPicker = "true";
    column.append(picker);
    return column;
  }

  function createServerControlCoordinateInput(coordinate) {
    const wrapper = document.createElement("label");
    wrapper.className = "local-query-bridge-server-control-coordinate";
    wrapper.dataset.gridPosition = coordinate.gridClass;

    const label = document.createElement("span");
    label.className = "local-query-bridge-server-control-coordinate-label";
    label.textContent = coordinate.label;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "1";
    input.min = `${SERVER_CONTROL_REGION_COORDINATE_MIN}`;
    input.max = `${SERVER_CONTROL_REGION_COORDINATE_MAX}`;
    input.inputMode = "numeric";
    input.dataset.controlRegionCoordinate = coordinate.key;
    input.addEventListener("input", handleServerControlCoordinateInput);

    wrapper.append(label, input);
    return wrapper;
  }

  function createServerControlRegionCross() {
    const cross = document.createElement("div");
    cross.className = "local-query-bridge-server-control-region-cross";

    for (const coordinate of SERVER_CONTROL_REGION_COORDINATES) {
      cross.append(createServerControlCoordinateInput(coordinate));
    }

    const center = document.createElement("div");
    center.className = "local-query-bridge-server-control-region-center";
    center.dataset.controlRegionCenter = "true";
    cross.append(center);
    return cross;
  }

  function createServerControlRegionPanel() {
    const panel = document.createElement("section");
    panel.className = "local-query-bridge-server-control-region-panel";
    panel.append(createServerControlRegionCross());
    return panel;
  }

  function createServerControlProjectControls() {
    const wrapper = document.createElement("div");
    wrapper.className = "local-query-bridge-server-control-header-actions";

    const toggle = document.createElement("button");
    toggle.className = "local-query-bridge-server-control-project-toggle";
    toggle.type = "button";
    toggle.textContent = "IDs";
    toggle.dataset.controlProjectToggle = "true";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () => {
      serverControlMenuState.projectPickerOpen = !serverControlMenuState.projectPickerOpen;
      syncServerControlProjectPickerControls();
    });

    wrapper.append(toggle);
    return wrapper;
  }

  function createServerControlProjectPanel() {
    const panel = document.createElement("section");
    panel.className = "local-query-bridge-server-control-project-panel";
    panel.dataset.controlProjectPanel = "true";
    panel.hidden = true;

    const title = document.createElement("h2");
    title.className = "local-query-bridge-server-control-project-panel-title";
    title.dataset.controlProjectPanelTitle = "true";

    const accountBar = document.createElement("div");
    accountBar.className = "local-query-bridge-server-control-segment-bar local-query-bridge-server-control-project-account-bar";
    accountBar.dataset.controlProjectAccountBar = "true";

    panel.append(title, accountBar);
    return panel;
  }

  function ensureServerControlMenu() {
    if (!document.body) {
      return null;
    }

    ensureServerControlMenuStyles();
    let menu = getServerControlMenu();
    if (menu instanceof HTMLElement) {
      syncServerControlMenuButtonStates();
      syncServerControlRegionControls();
      updateServerControlMenuStatus();
      return menu;
    }

    menu = document.createElement("aside");
    menu.id = SERVER_CONTROL_MENU_ID;
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("aria-label", "Local Query Bridge server controls");

    const content = document.createElement("div");
    content.className = "local-query-bridge-server-control-content";
    content.append(
      createServerControlActionColumn(),
      createServerControlTaskTypeColumn(),
    );

    menu.append(createServerControlProjectPanel(), content);
    menu.addEventListener("pointerleave", (event) => {
      if (event.clientY <= 0) {
        return;
      }

      hideServerControlMenu("menu-pointerleave");
    });
    document.body.append(menu);

    syncServerControlMenuButtonStates();
    syncServerControlRegionControls();
    updateServerControlMenuStatus();
    return menu;
  }

  function showServerControlMenu(reason) {
    const menu = ensureServerControlMenu();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    if (!serverControlMenuState.isOpen) {
      console.log("Local Query Bridge opened server control menu", { reason });
    }

    serverControlMenuState.isOpen = true;
    menu.classList.add(SERVER_CONTROL_MENU_OPEN_CLASS);
    menu.setAttribute("aria-hidden", "false");
  }

  function hideServerControlMenu(reason) {
    const menu = getServerControlMenu();
    if (!(menu instanceof HTMLElement) || !serverControlMenuState.isOpen) {
      return;
    }

    serverControlMenuState.isOpen = false;
    menu.classList.remove(SERVER_CONTROL_MENU_OPEN_CLASS);
    menu.setAttribute("aria-hidden", "true");
    console.log("Local Query Bridge closed server control menu", { reason });
  }

  function getServerControlMenuHideBoundaryPx() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    return viewportHeight * SERVER_CONTROL_MENU_HIDE_VIEWPORT_RATIO;
  }

  function handleServerControlMenuTopExit(event) {
    if (event.relatedTarget !== null || event.clientY > 0) {
      return;
    }

    showServerControlMenu("top-viewport-exit");
  }

  function handleServerControlMenuPointerMove(event) {
    if (serverControlMenuState.isOpen && event.clientY > getServerControlMenuHideBoundaryPx()) {
      const menu = getServerControlMenu();
      if (!(menu instanceof HTMLElement) || !menu.contains(event.target)) {
        hideServerControlMenu("lower-half-pointermove");
      }
    }
  }

  function handleServerControlProjectStorageChange(changes, areaName) {
    if (areaName === "local" && (
      changes[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]
      || changes[STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS]
      || changes[STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS]
      || changes[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY]
      || changes[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH]
      || changes[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH]
    )) {
      void loadServerControlMenuSettings().then(loadServerControlProjectSettings);
      return;
    }

    if (areaName === "sync" && (
      changes[STORAGE_KEY_PROJECT_IDS]
      || changes[STORAGE_KEY_TASK_TYPE_PROJECT_IDS]
      || changes[STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]
    )) {
      void loadServerControlProjectSettings();
    }
  }

  function initializeServerControlMenu() {
    if (document.body) {
      ensureServerControlMenu();
      void loadServerControlMenuSettings().then(loadServerControlProjectSettings);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        ensureServerControlMenu();
        void loadServerControlMenuSettings().then(loadServerControlProjectSettings);
      }, { once: true });
    }

    chrome.storage.onChanged.addListener(handleServerControlProjectStorageChange);
    document.addEventListener("mouseout", handleServerControlMenuTopExit, true);
    document.addEventListener("pointerdown", handleServerControlZonePointerDown, {
      capture: true,
      passive: true,
    });
    document.addEventListener("pointermove", handleServerControlZonePointerMove, {
      capture: true,
      passive: true,
    });
    document.addEventListener("contextmenu", handleServerControlZoneContextMenu, {
      capture: true,
      passive: true,
    });
    document.addEventListener("click", handleServerControlZoneClick, true);
    document.addEventListener("pointermove", handleServerControlMenuPointerMove, {
      capture: true,
      passive: true,
    });
    document.addEventListener("scroll", syncServerControlZoneOverlay, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", syncServerControlZoneOverlay, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideServerControlMenu("escape");
      }
    }, true);
  }

  function resetAnalysisTocForRun(runId, baselineAssistantCount, baselineHeadingCounts) {
    analysisTocState.currentRunId = runId;
    analysisTocState.baselineAssistantCount = baselineAssistantCount;
    analysisTocState.currentAssistantElement = null;
    analysisTocState.baselineHeadingCounts = baselineHeadingCounts;
    analysisTocState.detectedHeadingKeys = new Set();
    analysisTocState.highlightRefreshAllowed = false;
    analysisTocState.responseCompletedRunId = 0;
    ensureAnalysisTocButtons();
    resetAnalysisTocButtonStates();
    setAnalysisTocButtonActive(LATEST_USER_PROMPT_TOC_KEY, getLatestUserMessage() instanceof HTMLElement);
  }

  function isAnalysisResponseCompletedForCurrentRun() {
    const runId = analysisTocState.currentRunId;
    return runId !== 0 && analysisTocState.responseCompletedRunId === runId;
  }

  function getSignalRefreshAssistantElement() {
    return analysisTocState.currentAssistantElement instanceof HTMLElement
      ? analysisTocState.currentAssistantElement
      : getLatestAssistantMessage();
  }

  function scheduleCompletedResponseHighlightRefresh(source) {
    if (isResponseGenerating()) {
      return false;
    }

    const assistantElement = getSignalRefreshAssistantElement();
    if (assistantElement instanceof HTMLElement) {
      analysisTocState.currentAssistantElement = assistantElement;
      syncAnalysisTocButtonsForAssistantElement(assistantElement);
    }

    const runId = analysisTocState.currentRunId;
    if (runId !== 0) {
      if (!isAnalysisResponseCompletedForCurrentRun()) {
        analysisTocState.responseCompletedRunId = runId;
      }
      analysisTocState.highlightRefreshAllowed = false;
      syncAnalysisHeadingCountsForRun(runId);
    }

    refreshHighlightsNow();
    if (source === "analysis-toc-click" || source === "analysis-toc-toggle-click") {
      console.log("Local Query Bridge refreshed completed-response highlights from signal", {
        source,
        runId,
      });
    }
    return true;
  }

  function handleAnalysisTextHighlightSignal(source) {
    if (scheduleCompletedResponseHighlightRefresh(source)) {
      return;
    }

    armAnalysisHeadingHighlightRefresh(source);
  }

  function armAnalysisHeadingHighlightRefresh(source) {
    const runId = analysisTocState.currentRunId;
    if (runId === 0) {
      return;
    }

    syncAnalysisHeadingCountsForRun(runId);
    analysisTocState.highlightRefreshAllowed = true;

    console.log("Local Query Bridge armed next heading-triggered highlight refresh", {
      source,
      runId,
    });
  }

  function getAnalysisHeadingElements(assistantElement) {
    if (!(assistantElement instanceof HTMLElement)) {
      return [];
    }

    const renderedHeadings = Array.from(assistantElement.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .filter((element) => element instanceof HTMLElement);
    const rawMarkdownHeadings = Array.from(assistantElement.querySelectorAll("p, div, span"))
      .filter((element) => {
        if (!(element instanceof HTMLElement)) {
          return false;
        }

        const text = element.textContent?.trim() ?? "";
        if (!/^#{1,6}\s+/.test(text)) {
          return false;
        }

        return !Array.from(element.querySelectorAll("*")).some((child) => (
          child instanceof HTMLElement && /^#{1,6}\s+/.test(child.textContent?.trim() ?? "")
        ));
      });

    return Array.from(new Set([...renderedHeadings, ...rawMarkdownHeadings]));
  }

  function getAllAnalysisHeadingElements() {
    return getAssistantMessages().flatMap((assistantElement) => (
      getAnalysisHeadingElements(assistantElement)
    ));
  }

  function getAnalysisTextTargetElements(assistantElement) {
    if (!(assistantElement instanceof HTMLElement)) {
      return [];
    }

    const targetSelector = "h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, code, th, td, dt, dd, figcaption, div, span, strong, b";
    return Array.from(assistantElement.querySelectorAll(targetSelector))
      .filter((element) => {
        if (!(element instanceof HTMLElement)) {
          return false;
        }

        if (
          element.closest(`.${ANALYSIS_TOC_BUTTON_CLASS}, .${ANALYSIS_TOC_TOGGLE_BUTTON_CLASS}, #${SERVER_CONTROL_MENU_ID}`)
        ) {
          return false;
        }

        if (!normalizeAnalysisTargetText(element.textContent ?? "")) {
          return false;
        }

        if (element.getClientRects().length === 0) {
          return false;
        }

        if ((element.tagName === "DIV" || element.tagName === "SPAN") && element.querySelector(targetSelector)) {
          return false;
        }

        return true;
      });
  }

  function getAllAnalysisTextTargetElements() {
    return getAssistantMessages().flatMap((assistantElement) => (
      getAnalysisTextTargetElements(assistantElement)
    ));
  }

  function doesAnalysisTocEntryMatchElement(entry, element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    const settings = getAnalysisTocButtonSettings(entry.key);
    const normalizeOptions = { caseSensitive: settings.caseSensitive === true };

    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT) {
      const targetText = normalizeAnalysisTargetText(entry.targetText ?? entry.heading, normalizeOptions);
      return Boolean(targetText) && normalizeAnalysisTargetText(element.textContent ?? "", normalizeOptions).includes(targetText);
    }

    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_HEADING) {
      if (settings.caseSensitive === true) {
        return normalizeAnalysisHeadingText(element.textContent ?? "", normalizeOptions)
          === normalizeAnalysisHeadingText(entry.heading, normalizeOptions);
      }

      return normalizeAnalysisHeadingText(element.textContent ?? "") === entry.key;
    }

    return false;
  }

  function getAnalysisTocCandidateElements(entry, assistantElement) {
    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT) {
      return getAnalysisTextTargetElements(assistantElement);
    }

    return getAnalysisHeadingElements(assistantElement);
  }

  function getAllAnalysisTocCandidateElements(entry) {
    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT) {
      return getAllAnalysisTextTargetElements();
    }

    return getAllAnalysisHeadingElements();
  }

  function getAnalysisHeadingCounts() {
    const entries = getAnalysisTocEntries();
    const counts = Object.fromEntries(
      entries.map((entry) => [entry.key, 0]),
    );
    if (Object.prototype.hasOwnProperty.call(counts, LATEST_USER_PROMPT_TOC_KEY)) {
      counts[LATEST_USER_PROMPT_TOC_KEY] = getUserMessages().length;
    }

    for (const entry of entries) {
      if (
        entry.type !== ANALYSIS_TOC_ENTRY_TYPE_HEADING
        && entry.type !== ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT
      ) {
        continue;
      }

      counts[entry.key] = getAllAnalysisTocCandidateElements(entry)
        .filter((element) => doesAnalysisTocEntryMatchElement(entry, element))
        .length;
    }

    return counts;
  }

  function findLatestAnalysisTocElement(headingKey) {
    if (headingKey === LATEST_USER_PROMPT_TOC_KEY) {
      return getLatestUserMessage();
    }

    const entry = getAnalysisTocEntries().find((candidate) => candidate.key === headingKey);
    if (!entry) {
      return null;
    }

    const preferredRoot = analysisTocState.currentAssistantElement instanceof HTMLElement
      ? analysisTocState.currentAssistantElement
      : null;
    if (preferredRoot instanceof HTMLElement) {
      const preferredMatches = getAnalysisTocCandidateElements(entry, preferredRoot)
        .filter((element) => doesAnalysisTocEntryMatchElement(entry, element));
      return preferredMatches[preferredMatches.length - 1] ?? null;
    }

    const matches = getAllAnalysisTocCandidateElements(entry)
      .filter((element) => doesAnalysisTocEntryMatchElement(entry, element));
    return matches[matches.length - 1] ?? null;
  }

  function scrollToAnalysisTocTarget(headingKey) {
    const targetElement = findLatestAnalysisTocElement(headingKey);
    if (!(targetElement instanceof HTMLElement)) {
      return false;
    }

    targetElement.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "auto",
    });
    applyAutoScrollOffset(getAnalysisTocButtonOffset(headingKey));
    return true;
  }

  function getScrollTargetViewportTop(target) {
    if (
      !(target instanceof HTMLElement)
      || target === document.scrollingElement
      || target === document.documentElement
      || target === document.body
    ) {
      return 0;
    }

    return target.getBoundingClientRect().top;
  }

  function getAnalysisTocTargetScrollDelta(headingKey) {
    const targetElement = findLatestAnalysisTocElement(headingKey);
    if (!(targetElement instanceof HTMLElement)) {
      return null;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const scrollTarget = getScrollTarget();
    const containerTop = getScrollTargetViewportTop(scrollTarget);
    return targetRect.top - containerTop + getAnalysisTocButtonOffset(headingKey);
  }

  function restoreLatestPromptJumpPositionIfNeeded(runId) {
    const deltaPx = getAnalysisTocTargetScrollDelta(LATEST_USER_PROMPT_TOC_KEY);
    if (!Number.isFinite(deltaPx)) {
      return false;
    }

    if (Math.abs(deltaPx) <= LATEST_PROMPT_SCROLL_TOLERANCE_PX) {
      return true;
    }

    const didScroll = scrollToAnalysisTocTarget(LATEST_USER_PROMPT_TOC_KEY);
    console.log("Local Query Bridge restored latest prompt generation-start jump", {
      runId,
      deltaPx,
      didScroll,
    });
    return didScroll;
  }

  function syncAnalysisHeadingCountsForRun(runId) {
    if (analysisTocState.currentRunId !== runId) {
      return;
    }

    const counts = getAnalysisHeadingCounts();
    const newlyDetectedHeadings = [];

    for (const headingEntry of getAnalysisHeadingTocEntries()) {
      if (analysisTocState.detectedHeadingKeys.has(headingEntry.key)) {
        continue;
      }

      const baselineCount = analysisTocState.baselineHeadingCounts[headingEntry.key] ?? 0;
      const currentCount = counts[headingEntry.key] ?? 0;
      if (currentCount <= baselineCount) {
        continue;
      }

      setAnalysisTocButtonActive(headingEntry.key, true);
      newlyDetectedHeadings.push(headingEntry);
      analysisTocState.detectedHeadingKeys.add(headingEntry.key);
    }

    if (newlyDetectedHeadings.length > 0 && analysisTocState.highlightRefreshAllowed) {
      analysisTocState.highlightRefreshAllowed = false;
      refreshHighlightsNow();
      console.log("Local Query Bridge refreshed highlights for analysis heading count increase(s)", {
        runId,
        headings: newlyDetectedHeadings.map((heading) => heading.label),
      });
    } else if (newlyDetectedHeadings.length > 0) {
      console.log("Local Query Bridge skipped highlight refresh for unarmed analysis heading count increase(s)", {
        runId,
        headings: newlyDetectedHeadings.map((heading) => heading.label),
      });
    }
  }

  function syncAnalysisTocButtonsForAssistantElement(assistantElement) {
    ensureAnalysisTocButtons();
    resetAnalysisTocButtonStates();

    if (!(assistantElement instanceof HTMLElement)) {
      return;
    }

    for (const headingEntry of getAnalysisTocEntries()) {
      const isActive = headingEntry.key === LATEST_USER_PROMPT_TOC_KEY
        ? getLatestUserMessage() instanceof HTMLElement
        : getAnalysisTocCandidateElements(headingEntry, assistantElement)
          .some((element) => doesAnalysisTocEntryMatchElement(headingEntry, element));
      setAnalysisTocButtonActive(headingEntry.key, isActive);
    }
  }

  function activateCurrentChatSession() {
    const latestAssistantElement = getLatestAssistantMessage();
    analysisTocState.currentRunId = 0;
    analysisTocState.baselineAssistantCount = Math.max(0, getAssistantMessages().length - 1);
    analysisTocState.currentAssistantElement = latestAssistantElement;
    analysisTocState.baselineHeadingCounts = {};
    analysisTocState.detectedHeadingKeys = new Set();
    analysisTocState.highlightRefreshAllowed = false;
    analysisTocState.responseCompletedRunId = 0;
    syncAnalysisTocButtonsForAssistantElement(latestAssistantElement);
    refreshHighlightsNow();

    console.log("Local Query Bridge activated current ChatGPT tab", {
      latestAssistantFound: latestAssistantElement instanceof HTMLElement,
    });

    return latestAssistantElement instanceof HTMLElement;
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

  async function watchResponseGenerationAndHeadings(runId, baselineAssistantCount, options = {}) {
    const deadline = Date.now() + RESPONSE_COMPLETE_TIMEOUT_MS;
    const allowLatestPromptRecheck = options.allowLatestPromptRecheck === true;
    let sawGenerating = false;
    let scrolledToLatestPrompt = false;
    let latestPromptScrollHoldUntil = 0;
    let nextLatestPromptScrollCheckAt = 0;
    let responseCompleted = false;

    console.log("Local Query Bridge watching response generation", {
      runId,
      baselineAssistantCount,
      allowLatestPromptRecheck,
    });
    while (Date.now() < deadline && autoScrollState.runId === runId) {
      const currentAssistantElement = getCurrentAssistantMessageForRun(baselineAssistantCount);
      if (currentAssistantElement instanceof HTMLElement) {
        analysisTocState.currentAssistantElement = currentAssistantElement;
      }

      syncAnalysisHeadingCountsForRun(runId);

      if (isResponseGenerating()) {
        const now = Date.now();
        sawGenerating = true;
        if (!scrolledToLatestPrompt) {
          scrolledToLatestPrompt = true;
          const didScroll = scrollToAnalysisTocTarget(LATEST_USER_PROMPT_TOC_KEY);
          const holdMs = allowLatestPromptRecheck ? getLatestPromptScrollHoldMs() : 0;
          if (didScroll && holdMs > 0) {
            latestPromptScrollHoldUntil = now + holdMs;
            nextLatestPromptScrollCheckAt = now + LATEST_PROMPT_SCROLL_CHECK_INTERVAL_MS;
          }

          console.log("Local Query Bridge latest prompt generation-start jump", {
            runId,
            didScroll,
            allowLatestPromptRecheck,
            holdSeconds: holdMs / 1000,
          });
        }

        if (
          latestPromptScrollHoldUntil > 0
          && nextLatestPromptScrollCheckAt > 0
          && nextLatestPromptScrollCheckAt <= latestPromptScrollHoldUntil
          && now >= nextLatestPromptScrollCheckAt
        ) {
          restoreLatestPromptJumpPositionIfNeeded(runId);
          nextLatestPromptScrollCheckAt += LATEST_PROMPT_SCROLL_CHECK_INTERVAL_MS;
        }
      } else if (sawGenerating && isResponseIdle()) {
        responseCompleted = true;
        break;
      }

      await delay(RESPONSE_STATE_POLL_MS);
    }

    if (autoScrollState.runId === runId) {
      if (responseCompleted) {
        const currentAssistantElement = getCurrentAssistantMessageForRun(baselineAssistantCount);
        if (currentAssistantElement instanceof HTMLElement) {
          analysisTocState.currentAssistantElement = currentAssistantElement;
        }

        syncAnalysisHeadingCountsForRun(runId);
        refreshHighlightsNow();
        analysisTocState.responseCompletedRunId = runId;
        analysisTocState.highlightRefreshAllowed = false;
        console.log("Local Query Bridge refreshed highlights after response completion", {
          runId,
        });
      }

      autoScrollState.runId = 0;
    }
  }

  function startAutoScrollWatch(options = {}) {
    autoScrollState.runId += 1;
    autoScrollState.userScrolled = false;
    const runId = autoScrollState.runId;
    const baselineAssistantCount = getAssistantMessages().length;
    const baselineHeadingCounts = getAnalysisHeadingCounts();
    resetAnalysisTocForRun(runId, baselineAssistantCount, baselineHeadingCounts);
    void watchResponseGenerationAndHeadings(runId, baselineAssistantCount, {
      allowLatestPromptRecheck: options.allowLatestPromptRecheck === true,
    });
  }

  window.addEventListener("wheel", () => {
    noteManualScroll("wheel");
  }, { passive: true });

  window.addEventListener("touchmove", () => {
    noteManualScroll("touchmove");
  }, { passive: true });

  document.addEventListener("scroll", () => {
    scheduleCompletedResponseHighlightRefresh("scroll");
  }, { passive: true, capture: true });

  window.addEventListener("scroll", () => {
    scheduleCompletedResponseHighlightRefresh("scroll");
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (event.repeat) {
      return;
    }

    if (hotkeyState.enabled && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      void chrome.runtime.sendMessage({ type: REPEAT_CAPTURE_HOTKEY_MESSAGE_TYPE });
      return;
    }

    if (hotkeyState.enabled && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && event.code === "Space" && !isEditableTarget(event.target)) {
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

  async function clickSendWhenReady(taskCount, options = {}) {
    const allowLatestPromptRecheck = options.allowLatestPromptRecheck !== false;
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
        startAutoScrollWatch({ allowLatestPromptRecheck });
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

  async function submitPromptOnly(
    taskCount,
    promptText,
    taskTypeKey = serverControlMenuState.currentTaskType,
    options = {},
  ) {
    console.log("Local Query Bridge received prompt-only submit request", {
      taskCount,
      promptLength: typeof promptText === "string" ? promptText.length : 0,
    });
    const prompt = typeof promptText === "string" && promptText.trim().length > 0
      ? promptText
      : prepareServerControlBoilerplatePromptForSubmission();

    await ensureWebSearchForTaskTypeIfRequired(taskTypeKey, taskCount);
    const editor = await waitForElement(PROMPT_TEXTAREA_SELECTOR, ELEMENT_WAIT_TIMEOUT_MS);
    editor.focus();
    populatePromptEditor(editor, prompt);
    await clickSendWhenReady(taskCount, {
      allowLatestPromptRecheck: options.allowLatestPromptRecheck !== false,
    });
  }

  async function submitRepeatDraft(taskCount, promptText, taskTypeKey = serverControlMenuState.currentTaskType) {
    await submitPromptOnly(taskCount, promptText, taskTypeKey, {
      allowLatestPromptRecheck: false,
    });
  }

  function showNativeAlert(taskCount, alertText) {
    const normalizedAlertText = typeof alertText === "string" && alertText.trim().length > 0
      ? alertText.trim()
      : `Local Query Bridge alert for task ${taskCount}`;
    window.alert(normalizedAlertText);
  }

  async function submitScreenshot(imageDataUrls, taskCount, promptText, taskTypeKey = serverControlMenuState.currentTaskType) {
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
      : prepareServerControlBoilerplatePromptForSubmission();

    console.log("Local Query Bridge checking web search requirement before inserting prompt", {
      taskCount,
      taskType: taskTypeKey,
      promptSettleMs: PROMPT_SETTLE_MS,
      screenshotCount: screenshotFiles.length,
    });
    await ensureWebSearchForTaskTypeIfRequired(taskTypeKey, taskCount);
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
        startAutoScrollWatch({ allowLatestPromptRecheck: false });
        return;
      }

      await delay(SEND_BUTTON_RETRY_DELAY_MS);
    }

    throw new Error("Send button did not become clickable");
  }

  initializeHighlighting();
  initializeAnalysisTocButtons();
  initializeServerControlMenu();

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === PING_MESSAGE_TYPE) {
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === ACTIVATE_CURRENT_CHAT_MESSAGE_TYPE) {
      hotkeyState.enabled = true;
      const latestAssistantFound = activateCurrentChatSession();
      sendResponse({ ok: true, latestAssistantFound });
      return false;
    }

    if (message?.type === SCROLL_MESSAGE_TYPE) {
      queueScroll(message.direction, Number.isFinite(message.steps) ? message.steps : 1);
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === QUEUE_REPEAT_SCREENSHOT_MESSAGE_TYPE) {
      hotkeyState.enabled = true;
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
      hotkeyState.enabled = true;
      sendResponse({ ok: true });
      void submitRepeatDraft(
        message.taskCount ?? 0,
        typeof message.promptText === "string" ? message.promptText : "",
        typeof message.taskType === "string" ? message.taskType : serverControlMenuState.currentTaskType,
      ).catch((error) => {
        console.error("Local Query Bridge repeat draft submit failed", error);
      });
      return false;
    }

    if (message?.type === SUBMIT_TEXT_PROMPT_MESSAGE_TYPE) {
      hotkeyState.enabled = true;
      console.log("Local Query Bridge content script got text prompt message", {
        taskCount: message.taskCount ?? 0,
        promptLength: typeof message.promptText === "string" ? message.promptText.length : 0,
      });
      sendResponse({ ok: true });
      void submitPromptOnly(
        message.taskCount ?? 0,
        typeof message.promptText === "string" ? message.promptText : "",
        typeof message.taskType === "string" ? message.taskType : serverControlMenuState.currentTaskType,
      ).catch((error) => {
        console.error("Local Query Bridge text prompt submit failed", error);
      });
      return false;
    }

    if (message?.type === SHOW_ALERT_MESSAGE_TYPE) {
      hotkeyState.enabled = true;
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

    hotkeyState.enabled = true;
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
      typeof message.taskType === "string" ? message.taskType : serverControlMenuState.currentTaskType,
    ).catch((error) => {
      console.error("Local Query Bridge submit failed", error);
    });

    return false;
  });
})();
