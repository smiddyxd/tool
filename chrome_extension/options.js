const CHATGPT_PROJECT_URL_PREFIX = "https://chatgpt.com/g/g-p-";
const DEFAULT_PROJECT_ID = "69bc1388b0588191bd1c176e83f018e4";
const DEFAULT_START_PAGE_URL = `${CHATGPT_PROJECT_URL_PREFIX}${DEFAULT_PROJECT_ID}`;
const DEFAULT_RESET_LIMIT = 0;
const DEFAULT_MULTI_SCREENSHOT_BATCH_SIZE = 10;
const MIN_MULTI_SCREENSHOT_BATCH_SIZE = 1;
const MAX_MULTI_SCREENSHOT_BATCH_SIZE = 10;
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
const ANALYSIS_TOC_ENTRY_TYPE_HEADING = "heading";
const ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT = "latestUserPrompt";
const ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT = "customText";
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

const OPTIONS_TAB_KEYS = [
  "bridge-settings",
  "general",
  "ocr-regions",
  "ui",
  "chat-processing",
  "traffic",
  "status-colors",
  "status-messages",
  "boilerplate-prompt",
  "highlighting",
  "toc-buttons",
];
const DEFAULT_OPTIONS_TAB_KEY = OPTIONS_TAB_KEYS[0];
const TRAFFIC_HISTORY_MESSAGE_TYPE = "getBridgeTrafficHistory";
const CLEAR_TRAFFIC_HISTORY_MESSAGE_TYPE = "clearBridgeTrafficHistory";
const SETTINGS_SYNC_MESSAGE_TYPE = "bridgeSettingsSync";
const SETTINGS_SYNC_SCHEMA_VERSION = 1;
const TRAFFIC_HISTORY_REFRESH_INTERVAL_MS = 3000;
const SETTINGS_SYNC_DIFF_REFRESH_INTERVAL_MS = 3000;
const SETTINGS_SYNC_DIFF_REFRESH_DEBOUNCE_MS = 250;
const STORAGE_KEY_BRIDGE_TRAFFIC_HISTORY = "bridgeTrafficHistory";
const STORAGE_KEY_BRIDGE_NEXT_COVER_TRAFFIC_AT = "bridgeNextCoverTrafficAt";
const STORAGE_KEY_CHAT_PROCESSING_QUEUE = "chatProcessingQueue";

const STORAGE_KEY_START_PAGE_URL = "defaultStartPageUrl";
const STORAGE_KEY_PROJECT_IDS = "projectIds";
const STORAGE_KEY_ACTIVE_PROJECT_ID = "activeProjectId";
const STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE = "activeBridgeTaskType";
const STORAGE_KEY_TASK_TYPE_PROJECT_IDS = "taskTypeProjectIds";
const STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS = "taskTypeActiveProjectAccounts";
const STORAGE_KEY_RESET_LIMIT = "resetLimit";
const STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE = "multiScreenshotBatchSize";
const STORAGE_KEY_HIGHLIGHT_RULES = "highlightRules";
const STORAGE_KEY_ANALYSIS_TOC_COLORS = "analysisTocButtonColors";
const STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS = "analysisTocButtonSettings";
const STORAGE_KEY_ANALYSIS_TOC_LABELS = "analysisTocButtonLabels";
const STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS = "analysisTocColumnPositions";
const STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY = "analysisTocColumnOpacity";
const STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE = "analysisTocColumnScale";
const STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER = "analysisTocButtonOrder";
const STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS = "latestPromptScrollHoldSeconds";
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
const STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS = "serverControlTaskTypeDefinitions";
const STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED = "serverControlCommentDraftActionMigrated";
const STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS = "serverControlTaskRegions";
const STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS = "serverControlUniversalRegions";
const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY = "serverControlZoneDividerOpacity";
const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH = "serverControlZoneDividerTopLengthPx";
const STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH = "serverControlZoneDividerBottomLengthPx";
const STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS = "serverControlStatusLogColors";
const STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES = "serverControlStatusLogMessages";
const STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY = "serverControlStatusLogIdleOpacity";
const STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH = "serverControlStatusLogWidthPx";
const STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT = "serverControlStatusLogLeftPx";
const SETTINGS_SYNC_LOCAL_KEYS = [
  STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS,
  STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED,
  STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS,
  STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS,
  STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY,
  STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH,
  STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH,
  STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES,
  STORAGE_KEY_HIGHLIGHT_RULES,
  STORAGE_KEY_CHAT_PROCESSING_QUEUE,
];
const SETTINGS_SYNC_SYNC_KEYS = [
  STORAGE_KEY_START_PAGE_URL,
  STORAGE_KEY_PROJECT_IDS,
  STORAGE_KEY_ACTIVE_PROJECT_ID,
  STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE,
  STORAGE_KEY_TASK_TYPE_PROJECT_IDS,
  STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
  STORAGE_KEY_RESET_LIMIT,
  STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE,
  STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS,
  STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES,
  STORAGE_KEY_ANALYSIS_TOC_COLORS,
  STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS,
  STORAGE_KEY_ANALYSIS_TOC_LABELS,
  STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER,
  STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS,
  STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY,
  STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE,
  STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS,
  STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS,
  STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES,
  STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY,
  STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH,
  STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT,
];
const SETTINGS_SYNC_REMOVED_SYNC_KEYS = [
  STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES,
  STORAGE_KEY_HIGHLIGHT_RULES,
];
const SETTINGS_SYNC_REMOVABLE_SYNC_KEYS = [
  ...SETTINGS_SYNC_SYNC_KEYS,
  ...SETTINGS_SYNC_REMOVED_SYNC_KEYS,
];
const SETTINGS_SYNC_LOCAL_KEY_SET = new Set(SETTINGS_SYNC_LOCAL_KEYS);
const SETTINGS_SYNC_SYNC_KEY_SET = new Set(SETTINGS_SYNC_SYNC_KEYS);
const SETTINGS_SYNC_KEY_LABELS = {
  [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: "Task types and bridge-control actions",
  [STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED]: "Comment action migration flag",
  [STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS]: "Task OCR and screenshot regions",
  [STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS]: "Universal OCR and screenshot regions",
  [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY]: "Zone divider opacity",
  [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH]: "Top zone divider length",
  [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH]: "Bottom zone divider length",
  [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: "Task type highlight rules",
  [STORAGE_KEY_HIGHLIGHT_RULES]: "Legacy highlight rules",
  [STORAGE_KEY_CHAT_PROCESSING_QUEUE]: "Chat processing queue",
  [STORAGE_KEY_START_PAGE_URL]: "Default ChatGPT start page",
  [STORAGE_KEY_PROJECT_IDS]: "Project IDs",
  [STORAGE_KEY_ACTIVE_PROJECT_ID]: "Active project ID",
  [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: "Active bridge task type",
  [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: "Task type project IDs",
  [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: "Task type active project accounts",
  [STORAGE_KEY_RESET_LIMIT]: "Reset limit",
  [STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE]: "Multi-screenshot batch size",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS]: "Task type TOC button colors",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS]: "Task type TOC button settings",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS]: "Task type TOC button labels",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER]: "Task type TOC button order",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS]: "Task type TOC column positions",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY]: "Task type TOC column opacity",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE]: "Task type TOC column scale",
  [STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: "Task type latest prompt scroll hold",
  [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES]: "Task type custom TOC entries",
  [STORAGE_KEY_ANALYSIS_TOC_COLORS]: "Default TOC button colors",
  [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: "Default TOC button settings",
  [STORAGE_KEY_ANALYSIS_TOC_LABELS]: "Default TOC button labels",
  [STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]: "Default TOC button order",
  [STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]: "Default TOC column positions",
  [STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]: "Default TOC column opacity",
  [STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE]: "Default TOC column scale",
  [STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: "Default latest prompt scroll hold",
  [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS]: "Bridge Control status colors",
  [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES]: "Bridge Control status messages",
  [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY]: "Bridge Control status idle opacity",
  [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH]: "Bridge Control status width",
  [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT]: "Bridge Control status left position",
};
const BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS = "search-experience-to-product-usefulness";
const HARD_CODED_TOC_TASK_TYPE_KEYS = new Set([BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS]);
const TASK_REGION_KIND_OCR = "ocr";
const TASK_REGION_KIND_SCREENSHOT = "full-task-screenshot";
const TASK_REGION_KIND_GOOGLE_RESULTS = "google-results";
const TASK_REGION_COORDINATE_MIN = -100000;
const TASK_REGION_COORDINATE_MAX = 100000;
const DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY = 0.38;
const SERVER_CONTROL_ZONE_DIVIDER_MIN_OPACITY = 0.05;
const SERVER_CONTROL_ZONE_DIVIDER_MAX_OPACITY = 1;
const DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX = 50;
const SERVER_CONTROL_ZONE_DIVIDER_MIN_LENGTH_PX = 0;
const SERVER_CONTROL_ZONE_DIVIDER_MAX_LENGTH_PX = 500;
const DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS = {
  "client-action": "#2563eb",
  "worker-send": "#7c3aed",
  "server-received": "#0891b2",
  counter: "#475569",
  capture: "#0d9488",
  "ocr-start": "#4f46e5",
  "ocr-attempt": "#d97706",
  "ocr-result": "#16a34a",
  "ocr-retry": "#ea580c",
  "ocr-selected": "#059669",
  queued: "#0284c7",
  prompt: "#2563eb",
  "prompt-sent": "#16a34a",
  "response-complete": "#16a34a",
  cancel: "#64748b",
  error: "#dc2626",
};
const SERVER_CONTROL_STATUS_LOG_TYPE_LABELS = {
  "client-action": "Action",
  "worker-send": "Worker",
  "server-received": "Server",
  counter: "Counter",
  capture: "Capture",
  "ocr-start": "OCR start",
  "ocr-attempt": "OCR attempt",
  "ocr-result": "OCR result",
  "ocr-retry": "OCR retry",
  "ocr-selected": "OCR selected",
  queued: "Queued",
  prompt: "Prompt",
  "prompt-sent": "Sent",
  "response-complete": "Done",
  cancel: "Cancel",
  error: "Error",
};
const DEFAULT_SERVER_CONTROL_STATUS_LOG_MESSAGES = Object.fromEntries(
  Object.keys(DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS).map((type) => [type, ""]),
);
const DEFAULT_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY = 0.42;
const SERVER_CONTROL_STATUS_LOG_MIN_IDLE_OPACITY = 0.05;
const SERVER_CONTROL_STATUS_LOG_MAX_IDLE_OPACITY = 1;
const DEFAULT_SERVER_CONTROL_STATUS_LOG_WIDTH_PX = 420;
const SERVER_CONTROL_STATUS_LOG_MIN_WIDTH_PX = 260;
const SERVER_CONTROL_STATUS_LOG_MAX_WIDTH_PX = 900;
const DEFAULT_SERVER_CONTROL_STATUS_LOG_LEFT_PX = 12;
const SERVER_CONTROL_STATUS_LOG_MIN_LEFT_PX = 0;
const SERVER_CONTROL_STATUS_LOG_MAX_LEFT_PX = 5000;
const DEFAULT_TASK_REGION_BOUNDS = { top: 0, left: 0, right: 0, bottom: 0 };
const TASK_REGION_COORDINATES = [
  { key: "top", label: "Top Y" },
  { key: "left", label: "Left X" },
  { key: "right", label: "Right X" },
  { key: "bottom", label: "Bottom Y" },
];
const TASK_ACTION_OCR = "ocr";
const TASK_ACTION_SCREENSHOT = "screenshot";
const TASK_ACTION_GOOGLE_SEARCH = "googleSearch";
const TASK_ACTION_COMMENT_DRAFT = "commentDraft";
const TASK_ACTION_PROCESS_CHAT = "processChat";
const TASK_ACTION_ADDITIONAL_CONTEXT = "additionalContext";
const TASK_ACTION_MULTI_SCREENSHOT = "multiScreenshot";
const TASK_ACTION_KEYS = [
  TASK_ACTION_OCR,
  TASK_ACTION_SCREENSHOT,
  TASK_ACTION_GOOGLE_SEARCH,
  TASK_ACTION_COMMENT_DRAFT,
  TASK_ACTION_PROCESS_CHAT,
  TASK_ACTION_ADDITIONAL_CONTEXT,
  TASK_ACTION_MULTI_SCREENSHOT,
];
const TASK_ACTION_LABELS = {
  [TASK_ACTION_OCR]: "OCR",
  [TASK_ACTION_SCREENSHOT]: "Screenshot",
  [TASK_ACTION_GOOGLE_SEARCH]: "Google search",
  [TASK_ACTION_COMMENT_DRAFT]: "Comment",
  [TASK_ACTION_PROCESS_CHAT]: "Save for processing",
  [TASK_ACTION_ADDITIONAL_CONTEXT]: "Add context",
  [TASK_ACTION_MULTI_SCREENSHOT]: "Multi-Screenshot",
};
const DEFAULT_VIDEO_GAMES_CHAT_PROCESSING_PROMPT = `Apply \`video_games_chat_processing_framework.md\` from project context to this completed chat.

Use the chat history, attached task screenshot/OCR if present, and the final rating comment below to extract a reusable case-derived reasoning node.

Final rating comment:
[PASTE FINAL COMMENT HERE]

Create the node according to the framework. Treat the final comment as the verdict anchor, and extract the useful reasoning path, abandoned interpretations, boundary conditions, and reusable phrasing from the chat. Use the screenshot/OCR only for grounding visible evidence; do not assume hidden landing-page behavior.

Output a reusable node that can be inserted into the Video Games manual or case-node library.`;
const DEFAULT_VIDEO_GAMES_CHAT_ABSTRACTION_PROMPT = `Before processing this completed Video Games rating chat according to video_games_chat_processing_framework.md in project context, first identify the best abstraction frame.

Use the chat history, attached screenshot/OCR if present, and the final rating comment as the verdict anchor.

Your task in this step is not to write the insertion blocks yet. Instead, zoom out from the specific task and suggest the most abstract but still maximally useful reusable frame for this case.

Please do the following:

1. Identify the exact concrete case.
2. List several possible abstraction levels, from narrowest to broadest.
3. For each level, explain what it captures and what it might miss.
4. Recommend the best abstraction level for processing this chat into:
   - a Video Games manual case node, and
   - a rating comment guide pattern.
5. State the reusable decision principle in one sentence.
6. State the reusable comment-pattern principle in one sentence.
7. Preserve the final verdict and do not re-open the rating unless the final comment is internally inconsistent with the visible evidence.
8. Use only visible evidence from the screenshot/OCR/chat. Do not assume hidden landing-page behavior.

Final rating comment:
[PASTE FINAL COMMENT HERE]`;
const DEFAULT_VIDEO_GAMES_ADDITIONAL_CONTEXT_PROMPT = `Consider this additional context for the current Video Games rating task. The input may be an attached screenshot, OCR text, or both.

Apply \`video_games_manual_final.md\` from project context. Compare this new visible context against the earlier rating and explain whether it meaningfully changes the rating, confidence, case-node fit, or comment.

Use only visible evidence from the added context. Do not assume anything beyond what is shown.

Output:
- Does this change the rating? Yes / No / Maybe
- Why or why not?
- Updated rating, if changed
- Updated comment, if useful`;
const DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT = `The attached screenshots are part of a multi-screenshot task.

Transcribe and visually describe each screenshot in order so the final task prompt can reference this written chat content instead of relying on previous image attachments.

For each screenshot, capture:
- visible instructions and question text
- answer choices or fields
- relevant page state, selections, warnings, and navigation context

Do not solve the full task yet. Output concise, clearly numbered notes by screenshot.`;
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
const COMMENT_DRAFT_REGION = {
  key: "ratingComment",
  label: "Rating comment",
  kind: TASK_REGION_KIND_OCR,
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
    actions: [
      TASK_ACTION_OCR,
      TASK_ACTION_SCREENSHOT,
      TASK_ACTION_GOOGLE_SEARCH,
      TASK_ACTION_COMMENT_DRAFT,
      TASK_ACTION_MULTI_SCREENSHOT,
    ],
    visibleActions: [
      TASK_ACTION_OCR,
      TASK_ACTION_SCREENSHOT,
      TASK_ACTION_GOOGLE_SEARCH,
      TASK_ACTION_COMMENT_DRAFT,
      TASK_ACTION_MULTI_SCREENSHOT,
    ],
    requireWebSearchChip: true,
    regions: [
      { key: "query", label: "Query", kind: TASK_REGION_KIND_OCR },
      { key: "productCard", label: "Product card", kind: TASK_REGION_KIND_OCR },
      { key: "productDescription", label: "Product description", kind: TASK_REGION_KIND_OCR },
      GOOGLE_RESULTS_REGION,
      COMMENT_DRAFT_REGION,
      FULL_TASK_SCREENSHOT_REGION,
    ],
    boilerplatePrompt: `The attached screenshot contains a Search Experience to Product Usefulness task.

Query: [query]
Product card: [product card]
Product description: [product description]
Google results: [google results]

Use the screenshot and any OCR text above to judge how useful the product is for satisfying the search experience. Base the answer on the visible screenshot evidence and bridge-provided OCR text.`,
    chatProcessingPrompt: "",
    multiScreenshotBatchPrompt: DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
  },
  {
    key: "get-rich-quick",
    label: "Get Rich Quick",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT, TASK_ACTION_MULTI_SCREENSHOT],
    visibleActions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT, TASK_ACTION_MULTI_SCREENSHOT],
    requireWebSearchChip: true,
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
      COMMENT_DRAFT_REGION,
    ],
    boilerplatePrompt: `The attached screenshot contains a Get Rich Quick task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Get Rich Quick criteria. Keep the reasoning tied to the visible task evidence.`,
    chatProcessingPrompt: "",
    multiScreenshotBatchPrompt: DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
  },
  {
    key: "video-games",
    label: "Video Games",
    actions: [
      TASK_ACTION_OCR,
      TASK_ACTION_SCREENSHOT,
      TASK_ACTION_COMMENT_DRAFT,
      TASK_ACTION_PROCESS_CHAT,
      TASK_ACTION_ADDITIONAL_CONTEXT,
      TASK_ACTION_MULTI_SCREENSHOT,
    ],
    visibleActions: [
      TASK_ACTION_OCR,
      TASK_ACTION_SCREENSHOT,
      TASK_ACTION_COMMENT_DRAFT,
      TASK_ACTION_PROCESS_CHAT,
      TASK_ACTION_ADDITIONAL_CONTEXT,
      TASK_ACTION_MULTI_SCREENSHOT,
    ],
    requireWebSearchChip: true,
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
      COMMENT_DRAFT_REGION,
    ],
    boilerplatePrompt: `The attached screenshot contains a Video Games task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Video Games criteria. Keep the reasoning tied to the visible task evidence.`,
    chatProcessingPrompt: DEFAULT_VIDEO_GAMES_CHAT_PROCESSING_PROMPT,
    chatProcessingAbstractionPrompt: DEFAULT_VIDEO_GAMES_CHAT_ABSTRACTION_PROMPT,
    additionalContextPrompt: DEFAULT_VIDEO_GAMES_ADDITIONAL_CONTEXT_PROMPT,
    multiScreenshotBatchPrompt: DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
  },
  {
    key: "weight-loss",
    label: "Weight Loss",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT, TASK_ACTION_MULTI_SCREENSHOT],
    visibleActions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT, TASK_ACTION_MULTI_SCREENSHOT],
    requireWebSearchChip: true,
    regions: [
      FULL_TASK_SCREENSHOT_REGION,
      { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
      COMMENT_DRAFT_REGION,
    ],
    boilerplatePrompt: `The attached screenshot contains a Weight Loss task.

Full task OCR: [full task ocr]

Use the full screenshot and OCR text above to evaluate the task according to the Weight Loss criteria. Keep the reasoning tied to the visible task evidence.`,
    chatProcessingPrompt: "",
    multiScreenshotBatchPrompt: DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
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
  taskTypeHighlightRules: {},
  taskTypeTocButtonColors: {},
  taskTypeTocButtonSettings: {},
  taskTypeTocButtonLabels: {},
  taskTypeTocButtonOrder: {},
  taskTypeTocColumnPositions: {},
  taskTypeTocColumnOpacity: {},
  taskTypeTocColumnScale: {},
  taskTypeLatestPromptScrollHoldSeconds: {},
  taskTypeTocEntries: {},
  activeBridgeTaskType: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
  taskTypeDefinitions: DEFAULT_BRIDGE_TASK_TYPE_DEFINITIONS,
  taskTypeProjectIds: DEFAULT_TASK_TYPE_PROJECT_IDS,
  taskTypeActiveProjectAccounts: DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
  taskRegions: {},
  universalRegions: {},
  zoneDividerOpacity: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY,
  zoneDividerTopLengthPx: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
  zoneDividerBottomLengthPx: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
  statusLogColors: DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS,
  statusLogMessages: DEFAULT_SERVER_CONTROL_STATUS_LOG_MESSAGES,
  statusLogIdleOpacity: DEFAULT_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY,
  statusLogWidthPx: DEFAULT_SERVER_CONTROL_STATUS_LOG_WIDTH_PX,
  statusLogLeftPx: DEFAULT_SERVER_CONTROL_STATUS_LOG_LEFT_PX,
  chatProcessingQueue: [],
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
  tocColumnScale: {
    [ANALYSIS_TOC_SIDE_LEFT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
    [ANALYSIS_TOC_SIDE_RIGHT]: ANALYSIS_TOC_DEFAULT_COLUMN_SCALE,
  },
  latestPromptScrollHoldSeconds: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
  multiScreenshotBatchSize: DEFAULT_MULTI_SCREENSHOT_BATCH_SIZE,
};

const trafficHistoryState = {
  samples: [],
  refreshTimerId: null,
  countdownTimerId: null,
  loadedAt: 0,
  nextCoverTrafficAt: 0,
};

let settingsSyncDiffRefreshTimerId = null;
let settingsSyncDiffRefreshToken = 0;

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
    requireWebSearchChip: definition.requireWebSearchChip !== false,
    actions: Array.isArray(definition.actions) ? [...definition.actions] : [],
    visibleActions: Array.isArray(definition.visibleActions)
      ? [...definition.visibleActions]
      : (Array.isArray(definition.actions) ? [...definition.actions] : []),
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

function normalizeVisibleTaskActionKeys(rawValue, actions) {
  const allowedActions = new Set(normalizeTaskActionKeys(actions));
  const source = Array.isArray(rawValue) ? rawValue : Array.from(allowedActions);
  const seenKeys = new Set();
  return source
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => allowedActions.has(value))
    .filter((value) => {
      if (seenKeys.has(value)) {
        return false;
      }

      seenKeys.add(value);
      return true;
    });
}

function normalizeTaskRequireWebSearchChip(value) {
  return value !== false;
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
  if (regionKey === COMMENT_DRAFT_REGION.key) {
    return { ...COMMENT_DRAFT_REGION };
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
  const normalizedKey = createTaskConfigKey(key || label, "region");

  if (kind === TASK_REGION_KIND_SCREENSHOT) {
    key = FULL_TASK_SCREENSHOT_REGION.key;
  } else if (kind === TASK_REGION_KIND_GOOGLE_RESULTS) {
    key = GOOGLE_RESULTS_REGION.key;
  } else if (
    normalizedKey === createTaskConfigKey(COMMENT_DRAFT_REGION.key, "region")
    || normalizedKey === createTaskConfigKey(COMMENT_DRAFT_REGION.label, "region")
  ) {
    key = COMMENT_DRAFT_REGION.key;
  } else {
    key = normalizedKey;
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
  const visibleActions = normalizeVisibleTaskActionKeys(taskDefinition.visibleActions, Array.from(actions));
  const regions = taskDefinition.regions.filter((region) => {
    if (region.key === FULL_TASK_SCREENSHOT_REGION.key) {
      return actions.has(TASK_ACTION_SCREENSHOT);
    }
    if (region.key === GOOGLE_RESULTS_REGION.key) {
      return actions.has(TASK_ACTION_GOOGLE_SEARCH);
    }
    if (region.key === COMMENT_DRAFT_REGION.key) {
      return actions.has(TASK_ACTION_COMMENT_DRAFT);
    }

    return true;
  });

  if (actions.has(TASK_ACTION_SCREENSHOT) && !regions.some((region) => region.key === FULL_TASK_SCREENSHOT_REGION.key)) {
    regions.push({ ...FULL_TASK_SCREENSHOT_REGION });
  }

  if (actions.has(TASK_ACTION_GOOGLE_SEARCH) && !regions.some((region) => region.key === GOOGLE_RESULTS_REGION.key)) {
    regions.push({ ...GOOGLE_RESULTS_REGION });
  }

  if (actions.has(TASK_ACTION_COMMENT_DRAFT) && !regions.some((region) => region.key === COMMENT_DRAFT_REGION.key)) {
    regions.push({ ...COMMENT_DRAFT_REGION });
  }

  if (actions.has(TASK_ACTION_OCR) && !regions.some((region) => region.kind === TASK_REGION_KIND_OCR)) {
    regions.push({ key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR });
  }

  return {
    ...taskDefinition,
    actions: Array.from(actions),
    visibleActions,
    regions,
    multiScreenshotBatchPrompt: typeof taskDefinition.multiScreenshotBatchPrompt === "string"
      ? taskDefinition.multiScreenshotBatchPrompt
      : DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
  };
}

function shouldMigrateCommentDraftAction(rawValue, migrationDone) {
  if (migrationDone === true || !Array.isArray(rawValue) || rawValue.length === 0) {
    return false;
  }

  return !rawValue.some((definition) => (
    definition
    && typeof definition === "object"
    && !Array.isArray(definition)
    && Array.isArray(definition.actions)
    && definition.actions.includes(TASK_ACTION_COMMENT_DRAFT)
  ));
}

function sanitizeTaskTypeDefinitions(rawValue, options = {}) {
  const sourceDefinitions = Array.isArray(rawValue) && rawValue.length > 0
    ? rawValue
    : cloneTaskTypeDefinitions();
  const addCommentDraftAction = Boolean(options.addCommentDraftAction);
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
    const actions = normalizeTaskActionKeys(rawDefinition.actions);
    if (addCommentDraftAction && !actions.includes(TASK_ACTION_COMMENT_DRAFT)) {
      actions.push(TASK_ACTION_COMMENT_DRAFT);
    }
    if (key === "video-games" && !actions.includes(TASK_ACTION_PROCESS_CHAT)) {
      actions.push(TASK_ACTION_PROCESS_CHAT);
    }
    const addedAdditionalContextAction = key === "video-games" && !actions.includes(TASK_ACTION_ADDITIONAL_CONTEXT);
    if (key === "video-games" && !actions.includes(TASK_ACTION_ADDITIONAL_CONTEXT)) {
      actions.push(TASK_ACTION_ADDITIONAL_CONTEXT);
    }
    const addedMultiScreenshotAction = !actions.includes(TASK_ACTION_MULTI_SCREENSHOT);
    if (!actions.includes(TASK_ACTION_MULTI_SCREENSHOT)) {
      actions.push(TASK_ACTION_MULTI_SCREENSHOT);
    }
    const visibleActions = normalizeVisibleTaskActionKeys(rawDefinition.visibleActions, actions);
    if (addedAdditionalContextAction && !visibleActions.includes(TASK_ACTION_ADDITIONAL_CONTEXT)) {
      visibleActions.push(TASK_ACTION_ADDITIONAL_CONTEXT);
    }
    if (addedMultiScreenshotAction && !visibleActions.includes(TASK_ACTION_MULTI_SCREENSHOT)) {
      visibleActions.push(TASK_ACTION_MULTI_SCREENSHOT);
    }

    const taskDefinition = ensureTaskDefinitionFeatures({
      key,
      label,
      actions,
      visibleActions,
      requireWebSearchChip: normalizeTaskRequireWebSearchChip(rawDefinition.requireWebSearchChip),
      regions,
      boilerplatePrompt: typeof rawDefinition.boilerplatePrompt === "string"
        ? rawDefinition.boilerplatePrompt.trim()
        : "",
      chatProcessingPrompt: typeof rawDefinition.chatProcessingPrompt === "string"
        ? rawDefinition.chatProcessingPrompt.trim()
        : (key === "video-games" ? DEFAULT_VIDEO_GAMES_CHAT_PROCESSING_PROMPT : ""),
      chatProcessingAbstractionPrompt: typeof rawDefinition.chatProcessingAbstractionPrompt === "string"
        ? rawDefinition.chatProcessingAbstractionPrompt.trim()
        : (key === "video-games" ? DEFAULT_VIDEO_GAMES_CHAT_ABSTRACTION_PROMPT : ""),
      additionalContextPrompt: typeof rawDefinition.additionalContextPrompt === "string"
        ? rawDefinition.additionalContextPrompt.trim()
        : (key === "video-games" ? DEFAULT_VIDEO_GAMES_ADDITIONAL_CONTEXT_PROMPT : ""),
      multiScreenshotBatchPrompt: typeof rawDefinition.multiScreenshotBatchPrompt === "string"
        ? rawDefinition.multiScreenshotBatchPrompt.trim()
        : DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
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

function isUniversalTaskRegion(region) {
  return region?.key === GOOGLE_RESULTS_REGION.key || region?.kind === TASK_REGION_KIND_GOOGLE_RESULTS;
}

function sanitizeTaskRegionCoordinate(value, fallback = 0) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.min(
    TASK_REGION_COORDINATE_MAX,
    Math.max(TASK_REGION_COORDINATE_MIN, parsedValue),
  );
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

function serverControlZoneDividerOpacityToPercent(value) {
  return Math.round(sanitizeServerControlZoneDividerOpacity(value) * 100);
}

function sanitizeServerControlStatusLogIdleOpacity(value) {
  const parsedValue = Number.parseFloat(`${value}`);
  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY;
  }

  const normalizedValue = parsedValue > 1 ? parsedValue / 100 : parsedValue;
  return Math.min(
    SERVER_CONTROL_STATUS_LOG_MAX_IDLE_OPACITY,
    Math.max(SERVER_CONTROL_STATUS_LOG_MIN_IDLE_OPACITY, normalizedValue),
  );
}

function serverControlStatusLogIdleOpacityToPercent(value) {
  return Math.round(sanitizeServerControlStatusLogIdleOpacity(value) * 100);
}

function sanitizeServerControlStatusLogWidth(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_SERVER_CONTROL_STATUS_LOG_WIDTH_PX;
  }

  return Math.min(
    SERVER_CONTROL_STATUS_LOG_MAX_WIDTH_PX,
    Math.max(SERVER_CONTROL_STATUS_LOG_MIN_WIDTH_PX, parsedValue),
  );
}

function sanitizeServerControlStatusLogLeft(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_SERVER_CONTROL_STATUS_LOG_LEFT_PX;
  }

  return Math.min(
    SERVER_CONTROL_STATUS_LOG_MAX_LEFT_PX,
    Math.max(SERVER_CONTROL_STATUS_LOG_MIN_LEFT_PX, parsedValue),
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

function sanitizeTaskRegionBounds(rawValue, fallback = DEFAULT_TASK_REGION_BOUNDS) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  return {
    top: sanitizeTaskRegionCoordinate(source.top, fallback.top),
    left: sanitizeTaskRegionCoordinate(source.left, fallback.left),
    right: sanitizeTaskRegionCoordinate(source.right, fallback.right),
    bottom: sanitizeTaskRegionCoordinate(source.bottom, fallback.bottom),
  };
}

function getUniversalTaskRegions() {
  const regionsByKey = new Map();
  for (const taskDefinition of getTaskTypeDefinitions()) {
    for (const region of taskDefinition.regions) {
      if (isUniversalTaskRegion(region)) {
        regionsByKey.set(region.key, region);
      }
    }
  }
  if (!regionsByKey.has(GOOGLE_RESULTS_REGION.key)) {
    regionsByKey.set(GOOGLE_RESULTS_REGION.key, GOOGLE_RESULTS_REGION);
  }
  return Array.from(regionsByKey.values());
}

function sanitizeTaskRegionsMap(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getTaskTypeDefinitions().map((taskDefinition) => [
      taskDefinition.key,
      Object.fromEntries(
        taskDefinition.regions
          .filter((region) => !isUniversalTaskRegion(region))
          .map((region) => [
            region.key,
            sanitizeTaskRegionBounds(source[taskDefinition.key]?.[region.key]),
          ]),
      ),
    ]),
  );
}

function sanitizeUniversalRegionsMap(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};

  return Object.fromEntries(
    getUniversalTaskRegions().map((region) => [
      region.key,
      sanitizeTaskRegionBounds(source[region.key]),
    ]),
  );
}

function getTaskRegionBounds(taskTypeKey, region) {
  const sanitizedTaskType = sanitizeBridgeTaskType(taskTypeKey);
  if (isUniversalTaskRegion(region)) {
    return sanitizeTaskRegionBounds(highlightState.universalRegions[region.key]);
  }

  return sanitizeTaskRegionBounds(highlightState.taskRegions[sanitizedTaskType]?.[region.key]);
}

function updateTaskRegionBounds(taskTypeKey, region, bounds) {
  const sanitizedBounds = sanitizeTaskRegionBounds(bounds);
  if (isUniversalTaskRegion(region)) {
    highlightState.universalRegions = {
      ...highlightState.universalRegions,
      [region.key]: sanitizedBounds,
    };
    return sanitizedBounds;
  }

  const sanitizedTaskType = sanitizeBridgeTaskType(taskTypeKey);
  highlightState.taskRegions = {
    ...highlightState.taskRegions,
    [sanitizedTaskType]: {
      ...(highlightState.taskRegions[sanitizedTaskType] ?? {}),
      [region.key]: sanitizedBounds,
    },
  };
  return sanitizedBounds;
}

function updateTaskRegionCoordinate(taskTypeKey, region, coordinateKey, value) {
  if (!TASK_REGION_COORDINATES.some((coordinate) => coordinate.key === coordinateKey)) {
    return;
  }

  const sanitizedValue = sanitizeTaskRegionCoordinate(value);
  if (isUniversalTaskRegion(region)) {
    highlightState.universalRegions = {
      ...highlightState.universalRegions,
      [region.key]: {
        ...sanitizeTaskRegionBounds(highlightState.universalRegions[region.key]),
        [coordinateKey]: sanitizedValue,
      },
    };
    return;
  }

  const sanitizedTaskType = sanitizeBridgeTaskType(taskTypeKey);
  highlightState.taskRegions = {
    ...highlightState.taskRegions,
    [sanitizedTaskType]: {
      ...(highlightState.taskRegions[sanitizedTaskType] ?? {}),
      [region.key]: {
        ...sanitizeTaskRegionBounds(highlightState.taskRegions[sanitizedTaskType]?.[region.key]),
        [coordinateKey]: sanitizedValue,
      },
    },
  };
}

function getTaskRegionCopyTypeKey(region) {
  return `${region.kind}:${createTaskConfigKey(region.label || region.key, "region")}`;
}

function isSameCopyableTaskRegionType(region, candidateRegion) {
  if (!region || !candidateRegion || isUniversalTaskRegion(candidateRegion)) {
    return false;
  }

  return candidateRegion.key === region.key
    || getTaskRegionCopyTypeKey(candidateRegion) === getTaskRegionCopyTypeKey(region);
}

function getTaskRegionCoordinateCopySources(taskDefinition, region) {
  if (isUniversalTaskRegion(region)) {
    return [];
  }

  const sources = [];
  for (const sourceTaskDefinition of getTaskTypeDefinitions()) {
    if (sourceTaskDefinition.key === taskDefinition.key) {
      continue;
    }

    for (const sourceRegion of sourceTaskDefinition.regions) {
      if (!isSameCopyableTaskRegionType(region, sourceRegion)) {
        continue;
      }

      sources.push({
        taskDefinition: sourceTaskDefinition,
        region: sourceRegion,
        bounds: getTaskRegionBounds(sourceTaskDefinition.key, sourceRegion),
      });
    }
  }

  return sources;
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

function sanitizeMultiScreenshotBatchSize(value) {
  const parsedValue = Number.parseInt(`${value}`, 10);
  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_MULTI_SCREENSHOT_BATCH_SIZE;
  }

  return Math.min(
    MAX_MULTI_SCREENSHOT_BATCH_SIZE,
    Math.max(MIN_MULTI_SCREENSHOT_BATCH_SIZE, parsedValue),
  );
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

function sanitizeServerControlStatusLogColors(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  return Object.fromEntries(
    Object.entries(DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS).map(([type, fallback]) => [
      type,
      sanitizeColor(source[type], fallback),
    ]),
  );
}

function sanitizeServerControlStatusLogMessages(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  return Object.fromEntries(
    Object.keys(DEFAULT_SERVER_CONTROL_STATUS_LOG_MESSAGES).map((type) => [
      type,
      typeof source[type] === "string" ? source[type].trim() : "",
    ]),
  );
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

function renderServerControlStatusLogColorSettings() {
  const container = document.querySelector("#server-control-status-log-colors");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  container.replaceChildren();
  const colors = sanitizeServerControlStatusLogColors(highlightState.statusLogColors);
  highlightState.statusLogColors = colors;

  for (const [type, fallback] of Object.entries(DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS)) {
    const row = document.createElement("label");
    row.className = "status-log-color-row";
    row.htmlFor = `status-log-color-${type}`;

    const label = document.createElement("span");
    label.textContent = SERVER_CONTROL_STATUS_LOG_TYPE_LABELS[type] ?? type;

    const colorControl = document.createElement("span");
    colorControl.className = "color-control";

    const colorInput = document.createElement("input");
    colorInput.id = `status-log-color-${type}`;
    colorInput.type = "color";

    const hexInput = document.createElement("input");
    hexInput.className = "hex-color-input";
    hexInput.type = "text";
    hexInput.autocomplete = "off";
    hexInput.spellcheck = false;
    hexInput.setAttribute("aria-label", `${label.textContent} status color hex code`);

    setColorControlValue(colorInput, hexInput, colors[type], fallback);
    bindColorControl(colorInput, hexInput, fallback, (color) => {
      highlightState.statusLogColors = {
        ...highlightState.statusLogColors,
        [type]: color,
      };
      setStatus("Status log color changed. Save settings to apply it.");
    });

    colorControl.append(colorInput, hexInput);
    row.append(label, colorControl);
    container.append(row);
  }
}

function renderServerControlStatusLogMessageSettings() {
  const container = document.querySelector("#server-control-status-log-messages");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  container.replaceChildren();
  const messages = sanitizeServerControlStatusLogMessages(highlightState.statusLogMessages);
  highlightState.statusLogMessages = messages;

  for (const type of Object.keys(DEFAULT_SERVER_CONTROL_STATUS_LOG_MESSAGES)) {
    const row = document.createElement("label");
    row.className = "status-log-message-row";
    row.htmlFor = `status-log-message-${type}`;

    const label = document.createElement("span");
    label.textContent = SERVER_CONTROL_STATUS_LOG_TYPE_LABELS[type] ?? type;

    const input = document.createElement("input");
    input.id = `status-log-message-${type}`;
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Use live bridge message";
    input.value = messages[type] ?? "";
    input.addEventListener("input", () => {
      highlightState.statusLogMessages = {
        ...highlightState.statusLogMessages,
        [type]: input.value,
      };
      setStatus("Status log message changed. Save settings to apply it.");
    });

    row.append(label, input);
    container.append(row);
  }
}

function createAnalysisTocEntryKey(value, fallbackPrefix = "toc") {
  return createTaskConfigKey(value, fallbackPrefix);
}

function makeUniqueAnalysisTocEntryKey(baseKey, usedKeys) {
  return makeUniqueTaskConfigKey(baseKey, usedKeys);
}

function isHardCodedAnalysisTocTaskType(taskType = highlightState.activeBridgeTaskType) {
  return HARD_CODED_TOC_TASK_TYPE_KEYS.has(sanitizeBridgeTaskType(taskType));
}

function getBuiltInAnalysisTocEntryKeys(taskType = highlightState.activeBridgeTaskType) {
  return isHardCodedAnalysisTocTaskType(taskType)
    ? new Set(ANALYSIS_HEADING_ENTRIES.map((entry) => entry.key))
    : new Set();
}

function sanitizeAnalysisTocTargetTexts(entry) {
  const rawTargetTexts = Array.isArray(entry?.targetTexts)
    ? entry.targetTexts
    : [entry?.targetText ?? entry?.heading ?? ""];
  return normalizeStringList(rawTargetTexts.map((value) => (
    typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""
  )));
}

function getAnalysisTocEntryTargetTexts(entry) {
  return Array.isArray(entry?.targetTexts) && entry.targetTexts.length > 0
    ? entry.targetTexts
    : sanitizeAnalysisTocTargetTexts(entry);
}

function sanitizeCustomAnalysisTocEntries(rawValue, options = {}) {
  const sourceEntries = Array.isArray(rawValue) ? rawValue : [];
  const usedKeys = new Set(options.reservedKeys instanceof Set ? options.reservedKeys : []);
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

      const targetTexts = sanitizeAnalysisTocTargetTexts(entry);
      const targetText = targetTexts[0] ?? "";
      const label = sanitizeAnalysisTocButtonLabel(entry.label, targetText || `TOC ${index + 1}`);
      if (!targetText) {
        return null;
      }

      return {
        key: makeUniqueAnalysisTocEntryKey(
          createAnalysisTocEntryKey(entry.key || label || targetText, "toc"),
          usedKeys,
        ),
        heading: targetText,
        label,
        targetText,
        targetTexts,
        type: ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT,
        index,
      };
    })
    .filter(Boolean);
}

function getEditableCustomAnalysisTocEntries(taskType = highlightState.activeBridgeTaskType) {
  const sanitizedTaskType = sanitizeBridgeTaskType(taskType);
  const sourceEntries = Array.isArray(highlightState.taskTypeTocEntries[sanitizedTaskType])
    ? highlightState.taskTypeTocEntries[sanitizedTaskType]
    : [];
  const usedKeys = getBuiltInAnalysisTocEntryKeys(sanitizedTaskType);

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

      const targetTexts = sanitizeAnalysisTocTargetTexts(entry);
      const targetText = targetTexts[0] ?? "";
      const label = sanitizeAnalysisTocButtonLabel(entry.label, targetText || `TOC ${index + 1}`);
      const rawKey = typeof entry.key === "string" && entry.key.trim()
        ? entry.key.trim()
        : createAnalysisTocEntryKey(label || targetText, "toc");

      return {
        key: makeUniqueAnalysisTocEntryKey(rawKey, usedKeys),
        heading: targetText,
        label,
        targetText,
        targetTexts,
        type: ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT,
        index,
      };
    })
    .filter(Boolean);
}

function sanitizeTaskTypeAnalysisTocEntriesMap(rawValue) {
  const source = rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
    ? rawValue
    : {};
  return Object.fromEntries(
    getTaskTypeDefinitions().map((definition) => [
      definition.key,
      sanitizeCustomAnalysisTocEntries(source[definition.key], {
        reservedKeys: getBuiltInAnalysisTocEntryKeys(definition.key),
      }),
    ]),
  );
}

function getAnalysisTocEntries(taskType = highlightState.activeBridgeTaskType) {
  const sanitizedTaskType = sanitizeBridgeTaskType(taskType);
  const customEntries = sanitizeCustomAnalysisTocEntries(
    getEditableCustomAnalysisTocEntries(sanitizedTaskType),
    { reservedKeys: getBuiltInAnalysisTocEntryKeys(sanitizedTaskType) },
  );
  if (isHardCodedAnalysisTocTaskType(sanitizedTaskType)) {
    return [
      ...ANALYSIS_HEADING_ENTRIES,
      ...customEntries.map((entry, index) => ({
        ...entry,
        index: ANALYSIS_HEADING_ENTRIES.length + index,
      })),
    ];
  }

  return customEntries;
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
  return sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder, entries)
    .map((key) => entriesByKey.get(key))
    .filter(Boolean);
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

function scaleToPercent(value) {
  return Math.round(sanitizeAnalysisTocColumnScaleValue(value, ANALYSIS_TOC_DEFAULT_COLUMN_SCALE) * 100);
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

function sanitizeAnalysisTocButtonCaseSensitive(value) {
  return value === true;
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
          caseSensitive: sanitizeAnalysisTocButtonCaseSensitive(rawEntry.caseSensitive ?? defaultEntry.caseSensitive),
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

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function sanitizeTaskTypeScopedMap(rawMap, sanitizer, fallbackValue) {
  const source = isPlainObject(rawMap) ? rawMap : {};
  return Object.fromEntries(
    getTaskTypeDefinitions().map((definition) => [
      definition.key,
      sanitizer(Object.prototype.hasOwnProperty.call(source, definition.key) ? source[definition.key] : fallbackValue),
    ]),
  );
}

function sanitizeTaskTypeScopedTocMap(rawMap, sanitizer, fallbackValue) {
  const source = isPlainObject(rawMap) ? rawMap : {};
  return Object.fromEntries(
    getTaskTypeDefinitions().map((definition) => {
      const entries = getAnalysisTocEntries(definition.key);
      return [
        definition.key,
        sanitizer(
          Object.prototype.hasOwnProperty.call(source, definition.key) ? source[definition.key] : fallbackValue,
          entries,
        ),
      ];
    }),
  );
}

function getActiveTaskTypeKey() {
  return sanitizeBridgeTaskType(highlightState.activeBridgeTaskType);
}

function syncActiveTaskTypeScopedSettings() {
  const taskType = getActiveTaskTypeKey();
  const entries = getAnalysisTocEntries(taskType);
  highlightState.taskTypeHighlightRules = {
    ...highlightState.taskTypeHighlightRules,
    [taskType]: sanitizeHighlightRules(highlightState.rules),
  };
  highlightState.taskTypeTocButtonColors = {
    ...highlightState.taskTypeTocButtonColors,
    [taskType]: sanitizeAnalysisTocButtonColors(highlightState.tocButtonColors, entries),
  };
  highlightState.taskTypeTocButtonSettings = {
    ...highlightState.taskTypeTocButtonSettings,
    [taskType]: sanitizeAnalysisTocButtonSettings(highlightState.tocButtonSettings, entries),
  };
  highlightState.taskTypeTocButtonLabels = {
    ...highlightState.taskTypeTocButtonLabels,
    [taskType]: sanitizeAnalysisTocButtonLabels(highlightState.tocButtonLabels, entries),
  };
  highlightState.taskTypeTocButtonOrder = {
    ...highlightState.taskTypeTocButtonOrder,
    [taskType]: sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder, entries),
  };
  highlightState.taskTypeTocColumnPositions = {
    ...highlightState.taskTypeTocColumnPositions,
    [taskType]: getAnalysisTocColumnPositionInputValues(),
  };
  highlightState.taskTypeTocColumnOpacity = {
    ...highlightState.taskTypeTocColumnOpacity,
    [taskType]: getAnalysisTocColumnOpacityInputValues(),
  };
  highlightState.taskTypeTocColumnScale = {
    ...highlightState.taskTypeTocColumnScale,
    [taskType]: getAnalysisTocColumnScaleInputValues(),
  };
  highlightState.taskTypeLatestPromptScrollHoldSeconds = {
    ...highlightState.taskTypeLatestPromptScrollHoldSeconds,
    [taskType]: getLatestPromptScrollHoldSecondsInputValue(),
  };
}

function applyActiveTaskTypeScopedSettings() {
  const taskType = getActiveTaskTypeKey();
  const entries = getAnalysisTocEntries(taskType);
  highlightState.rules = sanitizeHighlightRules(highlightState.taskTypeHighlightRules[taskType]);
  highlightState.tocButtonColors = sanitizeAnalysisTocButtonColors(highlightState.taskTypeTocButtonColors[taskType], entries);
  highlightState.tocButtonSettings = sanitizeAnalysisTocButtonSettings(highlightState.taskTypeTocButtonSettings[taskType], entries);
  highlightState.tocButtonLabels = sanitizeAnalysisTocButtonLabels(highlightState.taskTypeTocButtonLabels[taskType], entries);
  highlightState.tocButtonOrder = sanitizeAnalysisTocButtonOrder(highlightState.taskTypeTocButtonOrder[taskType], entries);
  highlightState.tocColumnPositions = sanitizeAnalysisTocColumnPositions(highlightState.taskTypeTocColumnPositions[taskType]);
  highlightState.tocColumnOpacity = sanitizeAnalysisTocColumnOpacity(highlightState.taskTypeTocColumnOpacity[taskType]);
  highlightState.tocColumnScale = sanitizeAnalysisTocColumnScale(highlightState.taskTypeTocColumnScale[taskType]);
  highlightState.latestPromptScrollHoldSeconds = sanitizeLatestPromptScrollHoldSeconds(
    highlightState.taskTypeLatestPromptScrollHoldSeconds[taskType],
  );
}

function renderActiveTaskTypeScopedSettings() {
  setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
  setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
  setAnalysisTocColumnScaleInputs(highlightState.tocColumnScale);
  setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  renderAnalysisTocColumnSettingsCopyControl();
  clearRuleForm();
  renderHighlightRules();
  renderCustomAnalysisTocEntryEditor();
  renderAnalysisTocSettings();
}

function getAnalysisTocColumnSettings(taskType) {
  return {
    positions: sanitizeAnalysisTocColumnPositions(highlightState.taskTypeTocColumnPositions[taskType]),
    opacity: sanitizeAnalysisTocColumnOpacity(highlightState.taskTypeTocColumnOpacity[taskType]),
    scale: sanitizeAnalysisTocColumnScale(highlightState.taskTypeTocColumnScale[taskType]),
  };
}

function setActiveAnalysisTocColumnSettings(settings) {
  const taskType = getActiveTaskTypeKey();
  const positions = sanitizeAnalysisTocColumnPositions(settings?.positions);
  const opacity = sanitizeAnalysisTocColumnOpacity(settings?.opacity);
  const scale = sanitizeAnalysisTocColumnScale(settings?.scale);

  highlightState.tocColumnPositions = positions;
  highlightState.tocColumnOpacity = opacity;
  highlightState.tocColumnScale = scale;
  highlightState.taskTypeTocColumnPositions = {
    ...highlightState.taskTypeTocColumnPositions,
    [taskType]: positions,
  };
  highlightState.taskTypeTocColumnOpacity = {
    ...highlightState.taskTypeTocColumnOpacity,
    [taskType]: opacity,
  };
  highlightState.taskTypeTocColumnScale = {
    ...highlightState.taskTypeTocColumnScale,
    [taskType]: scale,
  };

  setAnalysisTocColumnPositionInputs(positions);
  setAnalysisTocColumnOpacityInputs(opacity);
  setAnalysisTocColumnScaleInputs(scale);
}

function copyAnalysisTocColumnSettingsFromTaskType(sourceTaskType) {
  const targetTaskType = getActiveTaskTypeKey();
  const sourceDefinition = getTaskTypeDefinitions().find((definition) => definition.key === sourceTaskType);
  if (!sourceDefinition || sourceDefinition.key === targetTaskType) {
    setStatus("Choose another task type to copy TOC column UI from.");
    return;
  }

  syncActiveTaskTypeScopedSettings();
  setActiveAnalysisTocColumnSettings(getAnalysisTocColumnSettings(sourceDefinition.key));
  renderAnalysisTocColumnSettingsCopyControl();
  setStatus(`Copied TOC column UI from ${sourceDefinition.label}. Save settings to apply it.`);
}

function renderAnalysisTocColumnSettingsCopyControl() {
  const select = document.querySelector("#analysis-toc-column-settings-copy-source");
  const button = document.querySelector("#copy-analysis-toc-column-settings");
  if (!(select instanceof HTMLSelectElement) || !(button instanceof HTMLButtonElement)) {
    return;
  }

  const activeTaskType = getActiveTaskTypeKey();
  const sourceDefinitions = getTaskTypeDefinitions().filter((definition) => definition.key !== activeTaskType);
  select.replaceChildren(new Option("Choose a task type", ""));
  for (const definition of sourceDefinitions) {
    select.append(new Option(definition.label, definition.key));
  }

  select.value = "";
  select.disabled = sourceDefinitions.length === 0;
  button.disabled = true;
}

function removeTaskTypeScopedSettings(taskType) {
  for (const mapKey of [
    "taskTypeHighlightRules",
    "taskTypeTocButtonColors",
    "taskTypeTocButtonSettings",
    "taskTypeTocButtonLabels",
    "taskTypeTocButtonOrder",
    "taskTypeTocColumnPositions",
    "taskTypeTocColumnOpacity",
    "taskTypeTocColumnScale",
    "taskTypeLatestPromptScrollHoldSeconds",
    "taskTypeTocEntries",
  ]) {
    const nextMap = { ...highlightState[mapKey] };
    delete nextMap[taskType];
    highlightState[mapKey] = nextMap;
  }
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

function getOptionsTabKeyFromHash() {
  const hashValue = window.location.hash.replace(/^#/, "");
  return OPTIONS_TAB_KEYS.includes(hashValue) ? hashValue : DEFAULT_OPTIONS_TAB_KEY;
}

function setActiveOptionsTab(tabKey, options = {}) {
  const activeTabKey = OPTIONS_TAB_KEYS.includes(tabKey) ? tabKey : DEFAULT_OPTIONS_TAB_KEY;
  const buttons = document.querySelectorAll("[data-options-tab]");
  const panels = document.querySelectorAll("[data-options-tab-panel]");

  for (const button of buttons) {
    const isActive = button.dataset.optionsTab === activeTabKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.tabIndex = isActive ? 0 : -1;
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.optionsTabPanel !== activeTabKey;
  }

  if (activeTabKey === "traffic") {
    void loadTrafficHistory();
    startTrafficHistoryRefresh();
  } else {
    stopTrafficHistoryRefresh();
  }

  if (options.updateHash) {
    history.replaceState(null, "", `#${activeTabKey}`);
  }
}

function focusOptionsTabByOffset(currentButton, offset) {
  const buttons = [...document.querySelectorAll("[data-options-tab]")];
  const currentIndex = buttons.indexOf(currentButton);
  if (currentIndex < 0 || buttons.length === 0) {
    return;
  }

  const nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
  const nextButton = buttons[nextIndex];
  if (nextButton instanceof HTMLButtonElement) {
    nextButton.focus();
    setActiveOptionsTab(nextButton.dataset.optionsTab, { updateHash: true });
  }
}

function initializeOptionsTabs() {
  const buttons = document.querySelectorAll("[data-options-tab]");
  if (buttons.length === 0) {
    return;
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      setActiveOptionsTab(button.dataset.optionsTab, { updateHash: true });
    });
    button.addEventListener("keydown", (event) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        focusOptionsTabByOffset(button, -1);
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        focusOptionsTabByOffset(button, 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveOptionsTab(DEFAULT_OPTIONS_TAB_KEY, { updateHash: true });
        document.querySelector(`[data-options-tab="${DEFAULT_OPTIONS_TAB_KEY}"]`)?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        const finalTabKey = OPTIONS_TAB_KEYS[OPTIONS_TAB_KEYS.length - 1];
        setActiveOptionsTab(finalTabKey, { updateHash: true });
        document.querySelector(`[data-options-tab="${finalTabKey}"]`)?.focus();
      }
    });
  }

  window.addEventListener("hashchange", () => {
    setActiveOptionsTab(getOptionsTabKeyFromHash());
  });
  setActiveOptionsTab(getOptionsTabKeyFromHash());
}

function formatTrafficBytes(value) {
  const bytes = Math.max(0, Number.parseInt(`${value ?? 0}`, 10) || 0);
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

function formatTrafficTimestamp(timestamp) {
  const parsed = Date.parse(timestamp);
  if (!Number.isFinite(parsed)) {
    return "--:--:--";
  }
  const date = new Date(parsed);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function formatTrafficCountdown(timestampMs) {
  const parsed = Number.parseInt(`${timestampMs ?? 0}`, 10) || 0;
  if (!parsed) {
    return "not scheduled";
  }
  const remainingSeconds = Math.max(0, Math.ceil((parsed - Date.now()) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTrafficDisplayLabel(sample) {
  if (sample.label) {
    return sample.label;
  }

  switch (sample.action) {
    case "task_queue_check":
    case "poll":
      return "task check";
    case "task_screenshot":
      return "new task screenshot";
    case "text_task":
      return "text task";
    case "alert_task":
      return "alert task";
    case "control_status":
      return "control status";
    case "counts":
      return "check count";
    case "repeat":
      return "repeat capture";
    case "repeat_event":
      return "repeat event";
    case "scroll":
      return "scroll event";
    case "cover":
      return "cover request";
    case "settings_push":
      return "settings upload";
    case "settings_pull":
      return "settings sync";
    case "sync_task_type":
      return "sync task type";
    case "control:start_task_ocr":
      return "task OCR";
    case "control:start_task_screenshot":
      return "screenshot";
    case "control:ocr_google_results":
      return "Google results OCR";
    case "control:draft_comment_feedback":
      return "rating comment";
    case "control:process_chat":
      return "save for processing";
    case "control:add_rating_context":
      return "add context";
    case "control:multi_screenshot_add":
      return "multi-screenshot add";
    case "control:multi_screenshot_submit":
      return "multi-screenshot submit";
    case "control:cancel_control_processing":
      return "cancel processing";
    default:
      return sample.action || "operation";
  }
}

function getTrafficEndpointLabel(sample) {
  const method = typeof sample?.method === "string" && sample.method ? sample.method : "POST";
  const path = typeof sample?.path === "string" && sample.path ? sample.path : "";
  return path ? `${method} ${path}` : method;
}

function normalizeTrafficSample(sample) {
  const requestBytes = Math.max(0, Number.parseInt(`${sample?.requestBytes ?? 0}`, 10) || 0);
  const responseBytes = Math.max(0, Number.parseInt(`${sample?.responseBytes ?? 0}`, 10) || 0);
  const totalBytes = Math.max(
    requestBytes + responseBytes,
    Number.parseInt(`${sample?.totalBytes ?? 0}`, 10) || 0,
  );
  const rawId = sample?.id;
  return {
    id: typeof rawId === "string" && rawId ? rawId : (Number.isFinite(rawId) ? `${rawId}` : ""),
    timestamp: typeof sample?.timestamp === "string" && sample.timestamp ? sample.timestamp : "",
    action: typeof sample?.action === "string" ? sample.action : "",
    operation: typeof sample?.operation === "string" ? sample.operation : "",
    label: typeof sample?.label === "string" ? sample.label : "",
    kind: sample?.kind === "cover" || sample?.action === "cover" || sample?.operation === "cover" ? "cover" : "actual",
    path: typeof sample?.path === "string" ? sample.path : "",
    method: typeof sample?.method === "string" ? sample.method : "POST",
    requestBytes,
    responseBytes,
    totalBytes,
    durationMs: Math.max(0, Number.parseInt(`${sample?.durationMs ?? 0}`, 10) || 0),
    status: Math.max(0, Number.parseInt(`${sample?.status ?? 0}`, 10) || 0),
    ok: sample?.ok === true,
    source: typeof sample?.source === "string" ? sample.source : "",
    error: typeof sample?.error === "string" ? sample.error : "",
  };
}

function isTaskCheckTrafficSample(sample) {
  return (
    sample?.action === "task_queue_check"
    || sample?.action === "poll"
    || sample?.operation === "task_queue_check"
    || sample?.operation === "poll"
    || sample?.label === "task check"
  );
}

function shouldShowTrafficSample(sample) {
  if (isTaskCheckTrafficSample(sample)) {
    return false;
  }
  if (sample?.ok !== true || sample?.error) {
    return true;
  }

  return !(
    sample.action === "control_status"
    || sample.operation === "control_status"
  );
}

function getTrafficSampleMergeKey(sample) {
  if (sample.id) {
    return sample.id;
  }
  return [
    sample.timestamp,
    sample.action,
    sample.operation,
    sample.path,
    sample.requestBytes,
    sample.responseBytes,
    sample.durationMs,
  ].join("|");
}

function getTrafficSampleTimestampMs(sample) {
  const timestampMs = Date.parse(sample.timestamp);
  return Number.isFinite(timestampMs) ? timestampMs : 0;
}

function mergeTrafficSamples(...sampleGroups) {
  const mergedSamples = new Map();
  for (const sampleGroup of sampleGroups) {
    if (!Array.isArray(sampleGroup)) {
      continue;
    }
    for (const rawSample of sampleGroup) {
      const sample = normalizeTrafficSample(rawSample);
      if (!shouldShowTrafficSample(sample)) {
        continue;
      }
      mergedSamples.set(getTrafficSampleMergeKey(sample), sample);
    }
  }
  return Array.from(mergedSamples.values()).sort((left, right) => (
    getTrafficSampleTimestampMs(left) - getTrafficSampleTimestampMs(right)
  ));
}

function createTrafficSummaryItem(text) {
  const item = document.createElement("div");
  item.className = "traffic-summary-item";
  item.textContent = text;
  return item;
}

function createTrafficChartRow(sample, maxBytes) {
  const row = document.createElement("div");
  row.className = "traffic-chart-row";
  row.title = [
    `${sample.kind === "cover" ? "Cover" : "Actual"} ${getTrafficDisplayLabel(sample)}`,
    sample.operation && sample.operation !== sample.action ? `Bridge operation: ${sample.operation}` : "",
    sample.source ? `Source: ${sample.source}` : "",
    `${sample.method} ${sample.path}`,
    `Request: ${formatTrafficBytes(sample.requestBytes)}`,
    `Response: ${formatTrafficBytes(sample.responseBytes)}`,
    `Duration: ${sample.durationMs}ms`,
    sample.status ? `Status: ${sample.status}` : "",
    sample.error ? `Error: ${sample.error}` : "",
  ].filter(Boolean).join("\n");

  const label = document.createElement("div");
  label.className = "traffic-chart-label";
  const labelMain = document.createElement("div");
  labelMain.className = "traffic-chart-label-main";
  labelMain.textContent = `${sample.kind === "cover" ? "COVER" : "REAL"} ${formatTrafficTimestamp(sample.timestamp)} ${getTrafficDisplayLabel(sample)}`;
  const endpoint = document.createElement("div");
  endpoint.className = "traffic-chart-label-endpoint";
  endpoint.textContent = getTrafficEndpointLabel(sample);
  label.append(labelMain, endpoint);

  const track = document.createElement("div");
  track.className = "traffic-chart-track";

  const bar = document.createElement("div");
  bar.className = `traffic-chart-bar ${sample.kind === "cover" ? "cover" : "actual"}`;
  const width = maxBytes > 0 ? Math.max(2, Math.min(100, (sample.totalBytes / maxBytes) * 100)) : 2;
  bar.style.width = `${width}%`;
  track.append(bar);

  const size = document.createElement("div");
  size.className = "traffic-chart-size";
  size.textContent = formatTrafficBytes(sample.totalBytes);

  row.append(label, track, size);
  return row;
}

function renderTrafficHistory() {
  const summary = document.querySelector("#traffic-history-summary");
  const chart = document.querySelector("#traffic-history-chart");
  if (!(summary instanceof HTMLElement) || !(chart instanceof HTMLElement)) {
    return;
  }

  const previousChartScrollTop = chart.scrollTop;
  summary.replaceChildren();
  chart.replaceChildren();

  const samples = trafficHistoryState.samples;
  const actualCount = samples.filter((sample) => sample.kind !== "cover").length;
  const coverCount = samples.length - actualCount;
  summary.append(
    createTrafficSummaryItem(`Real ${actualCount}`),
    createTrafficSummaryItem(`Cover ${coverCount}`),
    createTrafficSummaryItem(`Next cover ${formatTrafficCountdown(trafficHistoryState.nextCoverTrafficAt)}`),
  );

  if (samples.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No bridge traffic has been recorded yet.";
    chart.append(empty);
    return;
  }

  const visibleSamples = samples.slice(-120).reverse();
  const maxBytes = visibleSamples.reduce((largest, sample) => Math.max(largest, sample.totalBytes), 1);
  for (const sample of visibleSamples) {
    chart.append(createTrafficChartRow(sample, maxBytes));
  }
  chart.scrollTop = Math.min(previousChartScrollTop, Math.max(0, chart.scrollHeight - chart.clientHeight));
}

async function readStoredTrafficHistory() {
  const stored = await chrome.storage.local.get({
    [STORAGE_KEY_BRIDGE_TRAFFIC_HISTORY]: [],
    [STORAGE_KEY_BRIDGE_NEXT_COVER_TRAFFIC_AT]: 0,
  });
  trafficHistoryState.nextCoverTrafficAt = Math.max(
    trafficHistoryState.nextCoverTrafficAt,
    Number.parseInt(`${stored[STORAGE_KEY_BRIDGE_NEXT_COVER_TRAFFIC_AT] ?? 0}`, 10) || 0,
  );
  const samples = stored[STORAGE_KEY_BRIDGE_TRAFFIC_HISTORY];
  return Array.isArray(samples) ? samples : [];
}

async function loadTrafficHistory() {
  const chart = document.querySelector("#traffic-history-chart");
  try {
    const [response, storedSamples] = await Promise.all([
      chrome.runtime.sendMessage({ type: TRAFFIC_HISTORY_MESSAGE_TYPE }).catch(() => null),
      readStoredTrafficHistory().catch(() => []),
    ]);
    const responseSamples = Array.isArray(response?.samples) ? response.samples : [];
    trafficHistoryState.nextCoverTrafficAt = Math.max(
      Number.parseInt(`${response?.nextCoverTrafficAt ?? 0}`, 10) || 0,
      trafficHistoryState.nextCoverTrafficAt,
    );
    trafficHistoryState.samples = mergeTrafficSamples(storedSamples, responseSamples);
    trafficHistoryState.loadedAt = Date.now();
    renderTrafficHistory();
    setStatus(`Traffic history refreshed: ${trafficHistoryState.samples.length} row(s).`);
  } catch (error) {
    trafficHistoryState.samples = [];
    renderTrafficHistory();
    if (chart instanceof HTMLElement) {
      const errorMessage = document.createElement("p");
      errorMessage.className = "empty-state";
      errorMessage.textContent = `Could not load traffic history: ${error}`;
      chart.replaceChildren(errorMessage);
    }
  }
}

async function clearTrafficHistory() {
  trafficHistoryState.samples = [];
  renderTrafficHistory();
  try {
    const response = await chrome.runtime.sendMessage({ type: CLEAR_TRAFFIC_HISTORY_MESSAGE_TYPE });
    if (response?.ok !== true) {
      throw new Error(response?.error || "clear failed");
    }
    setStatus("Traffic history cleared.");
  } catch (error) {
    setStatus(`Could not clear traffic history: ${error}`);
    void loadTrafficHistory();
  }
}

function startTrafficHistoryRefresh() {
  if (trafficHistoryState.refreshTimerId !== null) {
    return;
  }
  trafficHistoryState.refreshTimerId = window.setInterval(() => {
    void loadTrafficHistory();
  }, TRAFFIC_HISTORY_REFRESH_INTERVAL_MS);
  if (trafficHistoryState.countdownTimerId === null) {
    trafficHistoryState.countdownTimerId = window.setInterval(() => {
      renderTrafficHistory();
    }, 1000);
  }
}

function stopTrafficHistoryRefresh() {
  if (trafficHistoryState.refreshTimerId === null) {
    if (trafficHistoryState.countdownTimerId !== null) {
      window.clearInterval(trafficHistoryState.countdownTimerId);
      trafficHistoryState.countdownTimerId = null;
    }
    return;
  }
  window.clearInterval(trafficHistoryState.refreshTimerId);
  trafficHistoryState.refreshTimerId = null;
  if (trafficHistoryState.countdownTimerId !== null) {
    window.clearInterval(trafficHistoryState.countdownTimerId);
    trafficHistoryState.countdownTimerId = null;
  }
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
        syncTaskTypeDefinitionEditorValues();
        syncActiveTaskTypeScopedSettings();
        highlightState.activeBridgeTaskType = taskDefinition.key;
        applyActiveTaskTypeScopedSettings();
        renderTaskTypeProjectIds();
        renderActiveTaskTypeScopedSettings();
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
  const visibleActions = new Set(normalizeVisibleTaskActionKeys(taskDefinition.visibleActions, taskDefinition.actions));
  if (enabled) {
    actions.add(actionKey);
    visibleActions.add(actionKey);
  } else {
    actions.delete(actionKey);
    visibleActions.delete(actionKey);
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
  if (actionKey === TASK_ACTION_COMMENT_DRAFT && enabled) {
    regions = regions.some((region) => region.key === COMMENT_DRAFT_REGION.key)
      ? regions
      : [...regions, { ...COMMENT_DRAFT_REGION }];
  } else if (actionKey === TASK_ACTION_COMMENT_DRAFT && !enabled) {
    regions = regions.filter((region) => region.key !== COMMENT_DRAFT_REGION.key);
  }
  if (actionKey === TASK_ACTION_OCR && enabled && !regions.some((region) => region.kind === TASK_REGION_KIND_OCR)) {
    regions = [...regions, { key: "fullTaskOcr", label: "Full task OCR", kind: TASK_REGION_KIND_OCR }];
  }

  return ensureTaskDefinitionFeatures({
    ...taskDefinition,
    actions: Array.from(actions),
    visibleActions: Array.from(visibleActions),
    regions,
  });
}

function setTaskActionVisible(taskDefinition, actionKey, visible) {
  const actions = normalizeTaskActionKeys(taskDefinition.actions);
  const visibleActions = new Set(normalizeVisibleTaskActionKeys(taskDefinition.visibleActions, actions));
  if (visible && actions.includes(actionKey)) {
    visibleActions.add(actionKey);
  } else {
    visibleActions.delete(actionKey);
  }

  return ensureTaskDefinitionFeatures({
    ...taskDefinition,
    visibleActions: Array.from(visibleActions),
  });
}

function renderProcessingActionEditor(taskDefinition) {
  const container = document.querySelector("#task-type-processing-actions");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  container.replaceChildren();
  const enabledActions = new Set(normalizeTaskActionKeys(taskDefinition.actions));
  const visibleActions = new Set(normalizeVisibleTaskActionKeys(taskDefinition.visibleActions, taskDefinition.actions));
  for (const actionKey of TASK_ACTION_KEYS) {
    const row = document.createElement("div");
    row.className = "task-action-row";

    const label = document.createElement("div");
    label.className = "task-action-label";
    label.textContent = TASK_ACTION_LABELS[actionKey] ?? actionKey;

    const enabledLabel = document.createElement("label");
    enabledLabel.className = "feature-toggle";
    const enabledInput = document.createElement("input");
    enabledInput.type = "checkbox";
    enabledInput.checked = enabledActions.has(actionKey);
    enabledInput.addEventListener("change", () => {
      updateActiveTaskTypeDefinition((definition) => setTaskActionEnabled(definition, actionKey, enabledInput.checked));
      setStatus(`${TASK_ACTION_LABELS[actionKey] ?? actionKey} processing changed. Save settings to apply it.`);
    });
    enabledLabel.append(enabledInput, document.createTextNode("Enabled"));

    const visibleLabel = document.createElement("label");
    visibleLabel.className = "feature-toggle";
    const visibleInput = document.createElement("input");
    visibleInput.type = "checkbox";
    visibleInput.checked = enabledActions.has(actionKey) && visibleActions.has(actionKey);
    visibleInput.disabled = !enabledActions.has(actionKey);
    visibleInput.addEventListener("change", () => {
      updateActiveTaskTypeDefinition((definition) => setTaskActionVisible(definition, actionKey, visibleInput.checked));
      setStatus(`${TASK_ACTION_LABELS[actionKey] ?? actionKey} bridge-control visibility changed. Save settings to apply it.`);
    });
    visibleLabel.append(visibleInput, document.createTextNode("Show"));

    row.append(label, enabledLabel, visibleLabel);
    container.append(row);
  }
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
  const chatPromptInput = document.querySelector("#task-type-chat-processing-prompt");
  const chatAbstractionPromptInput = document.querySelector("#task-type-chat-abstraction-prompt");
  const additionalContextPromptInput = document.querySelector("#task-type-additional-context-prompt");
  const multiScreenshotBatchPromptInput = document.querySelector("#task-type-multi-screenshot-batch-prompt");
  const requireSearchChipInput = document.querySelector("#task-type-require-search-chip");
  if (
    !(labelInput instanceof HTMLInputElement)
    && !(promptInput instanceof HTMLTextAreaElement)
    && !(chatPromptInput instanceof HTMLTextAreaElement)
    && !(chatAbstractionPromptInput instanceof HTMLTextAreaElement)
    && !(additionalContextPromptInput instanceof HTMLTextAreaElement)
    && !(multiScreenshotBatchPromptInput instanceof HTMLTextAreaElement)
    && !(requireSearchChipInput instanceof HTMLInputElement)
  ) {
    return;
  }

  highlightState.taskTypeDefinitions = getTaskTypeDefinitions().map((definition) => {
    if (definition.key !== activeTaskType) {
      return definition;
    }

    return {
      ...definition,
      label: labelInput instanceof HTMLInputElement
        ? labelInput.value
        : definition.label,
      requireWebSearchChip: requireSearchChipInput instanceof HTMLInputElement
        ? requireSearchChipInput.checked
        : normalizeTaskRequireWebSearchChip(definition.requireWebSearchChip),
      boilerplatePrompt: promptInput instanceof HTMLTextAreaElement
        ? promptInput.value
        : definition.boilerplatePrompt,
      chatProcessingPrompt: chatPromptInput instanceof HTMLTextAreaElement
        ? chatPromptInput.value
        : (definition.chatProcessingPrompt ?? ""),
      chatProcessingAbstractionPrompt: chatAbstractionPromptInput instanceof HTMLTextAreaElement
        ? chatAbstractionPromptInput.value
        : (definition.chatProcessingAbstractionPrompt ?? ""),
      additionalContextPrompt: additionalContextPromptInput instanceof HTMLTextAreaElement
        ? additionalContextPromptInput.value
        : (definition.additionalContextPrompt ?? ""),
      multiScreenshotBatchPrompt: multiScreenshotBatchPromptInput instanceof HTMLTextAreaElement
        ? multiScreenshotBatchPromptInput.value
        : (definition.multiScreenshotBatchPrompt ?? ""),
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
      const nextTaskDefinition = getTaskTypeDefinition(taskDefinition.key);
      renderRegionCoordinateEditor(nextTaskDefinition);
      renderPromptPlaceholderButtons(nextTaskDefinition);
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

function getTaskRegionKindLabel(region) {
  if (region.kind === TASK_REGION_KIND_SCREENSHOT) {
    return "Screenshot";
  }
  if (region.kind === TASK_REGION_KIND_GOOGLE_RESULTS) {
    return "Google results";
  }
  return "OCR";
}

function createRegionCoordinateCopyControl(taskDefinition, region) {
  const wrapper = document.createElement("label");
  wrapper.className = "region-coordinate-copy";

  const labelText = document.createElement("span");
  labelText.textContent = "Copy";

  const select = document.createElement("select");
  const placeholder = document.createElement("option");
  placeholder.value = "";

  if (isUniversalTaskRegion(region)) {
    placeholder.textContent = "Shared region";
    select.disabled = true;
  } else {
    const copySources = getTaskRegionCoordinateCopySources(taskDefinition, region);
    placeholder.textContent = copySources.length > 0 ? "From task..." : "No matching source";
    select.disabled = copySources.length === 0;

    for (const [index, source] of copySources.entries()) {
      const option = document.createElement("option");
      option.value = `${index}`;
      option.textContent = source.region.label === region.label
        ? source.taskDefinition.label
        : `${source.taskDefinition.label} - ${source.region.label}`;
      select.append(option);
    }

    select.addEventListener("change", () => {
      const sourceIndex = Number.parseInt(select.value, 10);
      const source = Number.isInteger(sourceIndex) ? copySources[sourceIndex] : null;
      if (!source) {
        return;
      }

      updateTaskRegionBounds(taskDefinition.key, region, source.bounds);
      setStatus(`Copied ${region.label} coordinates from ${source.taskDefinition.label}. Save settings to apply it.`);
      renderRegionCoordinateEditor(getTaskTypeDefinition(taskDefinition.key));
    });
  }

  select.prepend(placeholder);
  select.value = "";
  wrapper.append(labelText, select);
  return wrapper;
}

function renderRegionCoordinateEditor(taskDefinition) {
  const list = document.querySelector("#task-type-region-coordinates");
  if (!(list instanceof HTMLElement)) {
    return;
  }

  list.replaceChildren();
  if (taskDefinition.regions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No regions are enabled for this task type.";
    list.append(empty);
    return;
  }

  for (const region of taskDefinition.regions) {
    const row = document.createElement("div");
    row.className = "region-coordinate-row";

    const summary = document.createElement("div");
    summary.className = "region-coordinate-summary";

    const title = document.createElement("strong");
    title.textContent = region.label;

    const meta = document.createElement("span");
    meta.className = "region-kind-pill";
    meta.textContent = isUniversalTaskRegion(region)
      ? `${getTaskRegionKindLabel(region)} - shared`
      : getTaskRegionKindLabel(region);

    summary.append(title, meta, createRegionCoordinateCopyControl(taskDefinition, region));

    const grid = document.createElement("div");
    grid.className = "region-coordinate-grid";
    const bounds = getTaskRegionBounds(taskDefinition.key, region);
    for (const coordinate of TASK_REGION_COORDINATES) {
      const label = document.createElement("label");
      label.textContent = coordinate.label;

      const input = document.createElement("input");
      input.type = "number";
      input.step = "1";
      input.min = `${TASK_REGION_COORDINATE_MIN}`;
      input.max = `${TASK_REGION_COORDINATE_MAX}`;
      input.inputMode = "numeric";
      input.value = `${bounds[coordinate.key]}`;
      input.addEventListener("input", () => {
        updateTaskRegionCoordinate(taskDefinition.key, region, coordinate.key, input.value);
        setStatus(`${region.label} ${coordinate.label} changed. Save settings to apply it.`);
      });

      label.append(input);
      grid.append(label);
    }

    row.append(summary, grid);
    list.append(row);
  }
}

function setServerControlZoneDividerOpacityInput(value) {
  const normalizedPercent = serverControlZoneDividerOpacityToPercent(value);
  const input = document.querySelector("#server-control-zone-divider-opacity");
  const valueText = document.querySelector("#server-control-zone-divider-opacity-value");
  if (input instanceof HTMLInputElement) {
    input.value = String(normalizedPercent);
  }
  if (valueText instanceof HTMLElement) {
    valueText.textContent = `${normalizedPercent}%`;
  }
}

function getServerControlZoneDividerOpacityInputValue() {
  return sanitizeServerControlZoneDividerOpacity(
    document.querySelector("#server-control-zone-divider-opacity")?.value,
  );
}

function setServerControlStatusLogIdleOpacityInput(value) {
  const normalizedPercent = serverControlStatusLogIdleOpacityToPercent(value);
  const input = document.querySelector("#server-control-status-log-idle-opacity");
  const valueText = document.querySelector("#server-control-status-log-idle-opacity-value");
  if (input instanceof HTMLInputElement) {
    input.value = String(normalizedPercent);
  }
  if (valueText instanceof HTMLElement) {
    valueText.textContent = `${normalizedPercent}%`;
  }
}

function getServerControlStatusLogIdleOpacityInputValue() {
  return sanitizeServerControlStatusLogIdleOpacity(
    document.querySelector("#server-control-status-log-idle-opacity")?.value,
  );
}

function setServerControlStatusLogWidthInput(value) {
  const normalizedWidth = sanitizeServerControlStatusLogWidth(value);
  const input = document.querySelector("#server-control-status-log-width");
  const valueText = document.querySelector("#server-control-status-log-width-value");
  if (input instanceof HTMLInputElement) {
    input.value = String(normalizedWidth);
  }
  if (valueText instanceof HTMLElement) {
    valueText.textContent = `${normalizedWidth}px`;
  }
}

function getServerControlStatusLogWidthInputValue() {
  return sanitizeServerControlStatusLogWidth(
    document.querySelector("#server-control-status-log-width")?.value,
  );
}

function setServerControlStatusLogLeftInput(value) {
  const normalizedLeft = sanitizeServerControlStatusLogLeft(value);
  const input = document.querySelector("#server-control-status-log-left");
  const valueText = document.querySelector("#server-control-status-log-left-value");
  if (input instanceof HTMLInputElement) {
    input.value = String(normalizedLeft);
  }
  if (valueText instanceof HTMLElement) {
    valueText.textContent = `${normalizedLeft}px`;
  }
}

function getServerControlStatusLogLeftInputValue() {
  return sanitizeServerControlStatusLogLeft(
    document.querySelector("#server-control-status-log-left")?.value,
  );
}

function setServerControlZoneDividerLengthInputs(topLength, bottomLength) {
  const normalizedTopLength = sanitizeServerControlZoneDividerLength(topLength);
  const normalizedBottomLength = sanitizeServerControlZoneDividerLength(bottomLength);
  const topInput = document.querySelector("#server-control-zone-divider-top-length");
  const bottomInput = document.querySelector("#server-control-zone-divider-bottom-length");
  const topValueText = document.querySelector("#server-control-zone-divider-top-length-value");
  const bottomValueText = document.querySelector("#server-control-zone-divider-bottom-length-value");

  if (topInput instanceof HTMLInputElement) {
    topInput.value = String(normalizedTopLength);
  }
  if (bottomInput instanceof HTMLInputElement) {
    bottomInput.value = String(normalizedBottomLength);
  }
  if (topValueText instanceof HTMLElement) {
    topValueText.textContent = `${normalizedTopLength}px`;
  }
  if (bottomValueText instanceof HTMLElement) {
    bottomValueText.textContent = `${normalizedBottomLength}px`;
  }
}

function getServerControlZoneDividerLengthInputValues() {
  return {
    topLengthPx: sanitizeServerControlZoneDividerLength(
      document.querySelector("#server-control-zone-divider-top-length")?.value,
    ),
    bottomLengthPx: sanitizeServerControlZoneDividerLength(
      document.querySelector("#server-control-zone-divider-bottom-length")?.value,
    ),
  };
}

function renderTaskTypeConfiguration() {
  const taskDefinition = getTaskTypeDefinition();
  const labelInput = document.querySelector("#task-type-label");
  const keyText = document.querySelector("#task-type-key");
  const promptInput = document.querySelector("#task-type-boilerplate-prompt");
  const chatPromptInput = document.querySelector("#task-type-chat-processing-prompt");
  const chatAbstractionPromptInput = document.querySelector("#task-type-chat-abstraction-prompt");
  const additionalContextPromptInput = document.querySelector("#task-type-additional-context-prompt");
  const multiScreenshotBatchPromptInput = document.querySelector("#task-type-multi-screenshot-batch-prompt");
  const requireSearchChipInput = document.querySelector("#task-type-require-search-chip");
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
  if (chatPromptInput instanceof HTMLTextAreaElement) {
    chatPromptInput.value = taskDefinition.chatProcessingPrompt || "";
  }
  if (chatAbstractionPromptInput instanceof HTMLTextAreaElement) {
    chatAbstractionPromptInput.value = taskDefinition.chatProcessingAbstractionPrompt || "";
  }
  if (additionalContextPromptInput instanceof HTMLTextAreaElement) {
    additionalContextPromptInput.value = taskDefinition.additionalContextPrompt || "";
  }
  if (multiScreenshotBatchPromptInput instanceof HTMLTextAreaElement) {
    multiScreenshotBatchPromptInput.value = taskDefinition.multiScreenshotBatchPrompt || "";
  }
  if (requireSearchChipInput instanceof HTMLInputElement) {
    requireSearchChipInput.checked = normalizeTaskRequireWebSearchChip(taskDefinition.requireWebSearchChip);
  }
  if (deleteButton instanceof HTMLButtonElement) {
    deleteButton.disabled = getTaskTypeDefinitions().length <= 1;
  }

  renderProcessingActionEditor(taskDefinition);
  renderOcrRegionEditor(taskDefinition);
  renderRegionCoordinateEditor(taskDefinition);
  renderPromptPlaceholderButtons(taskDefinition);
}

function addTaskTypeDefinition() {
  syncTaskTypeProjectInputValues();
  syncTaskTypeDefinitionEditorValues();
  syncActiveTaskTypeScopedSettings();
  const usedKeys = new Set(getTaskTypeDefinitions().map((definition) => definition.key));
  const key = makeUniqueTaskConfigKey(createTaskConfigKey("New task type", "task"), usedKeys);
  const taskDefinition = {
    key,
    label: "New task type",
    actions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT],
    visibleActions: [TASK_ACTION_OCR, TASK_ACTION_SCREENSHOT, TASK_ACTION_COMMENT_DRAFT],
    regions: [
      { ...FULL_TASK_SCREENSHOT_REGION },
      { key: `${key}-ocr`, label: "Full task OCR", kind: TASK_REGION_KIND_OCR },
      { ...COMMENT_DRAFT_REGION },
    ],
    boilerplatePrompt: `The attached screenshot contains a task.

Full task OCR: [full task ocr]

Use the screenshot and OCR text above to complete the task.`,
    chatProcessingPrompt: "",
    chatProcessingAbstractionPrompt: "",
    additionalContextPrompt: "",
    multiScreenshotBatchPrompt: DEFAULT_MULTI_SCREENSHOT_BATCH_PROMPT,
  };

  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions([
    ...getTaskTypeDefinitions(),
    taskDefinition,
  ]);
  highlightState.activeBridgeTaskType = key;
  highlightState.taskTypeHighlightRules = {
    ...highlightState.taskTypeHighlightRules,
    [key]: cloneDefaultHighlightRules(),
  };
  highlightState.taskTypeTocButtonColors = {
    ...highlightState.taskTypeTocButtonColors,
    [key]: getDefaultAnalysisTocButtonColors(),
  };
  highlightState.taskTypeTocButtonSettings = {
    ...highlightState.taskTypeTocButtonSettings,
    [key]: sanitizeAnalysisTocButtonSettings(null),
  };
  highlightState.taskTypeTocButtonLabels = {
    ...highlightState.taskTypeTocButtonLabels,
    [key]: getDefaultAnalysisTocButtonLabels(),
  };
  highlightState.taskTypeTocButtonOrder = {
    ...highlightState.taskTypeTocButtonOrder,
    [key]: getDefaultAnalysisTocButtonOrder(),
  };
  highlightState.taskTypeTocColumnPositions = {
    ...highlightState.taskTypeTocColumnPositions,
    [key]: getDefaultAnalysisTocColumnPositions(),
  };
  highlightState.taskTypeTocColumnOpacity = {
    ...highlightState.taskTypeTocColumnOpacity,
    [key]: getDefaultAnalysisTocColumnOpacity(),
  };
  highlightState.taskTypeTocColumnScale = {
    ...highlightState.taskTypeTocColumnScale,
    [key]: getDefaultAnalysisTocColumnScale(),
  };
  highlightState.taskTypeLatestPromptScrollHoldSeconds = {
    ...highlightState.taskTypeLatestPromptScrollHoldSeconds,
    [key]: LATEST_PROMPT_SCROLL_DEFAULT_HOLD_SECONDS,
  };
  highlightState.taskTypeTocEntries = {
    ...highlightState.taskTypeTocEntries,
    [key]: [],
  };
  applyActiveTaskTypeScopedSettings();
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
  renderActiveTaskTypeScopedSettings();
  setStatus("New task type added. Save settings to apply it.");
}

function deleteActiveTaskTypeDefinition() {
  const definitions = getTaskTypeDefinitions();
  if (definitions.length <= 1) {
    return;
  }

  const activeTaskType = highlightState.activeBridgeTaskType;
  const activeDefinition = getTaskTypeDefinition(activeTaskType);
  syncActiveTaskTypeScopedSettings();
  const nextDefinitions = definitions.filter((definition) => definition.key !== activeTaskType);
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(nextDefinitions);
  highlightState.activeBridgeTaskType = highlightState.taskTypeDefinitions[0].key;
  removeTaskTypeScopedSettings(activeTaskType);
  applyActiveTaskTypeScopedSettings();
  const nextProjectIds = { ...highlightState.taskTypeProjectIds };
  delete nextProjectIds[activeTaskType];
  highlightState.taskTypeProjectIds = sanitizeTaskTypeProjectIds(nextProjectIds);
  const nextAccounts = { ...highlightState.taskTypeActiveProjectAccounts };
  delete nextAccounts[activeTaskType];
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(nextAccounts);
  renderTaskTypeProjectIds();
  renderTaskTypeConfiguration();
  renderActiveTaskTypeScopedSettings();
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

async function pasteClipboardAsNewTextareaLine(textareaSelector, fieldLabel) {
  const textarea = document.querySelector(textareaSelector);
  if (!(textarea instanceof HTMLTextAreaElement)) {
    return;
  }

  let clipboardText = "";
  try {
    clipboardText = await navigator.clipboard.readText();
  } catch (error) {
    console.error("Local Query Bridge failed to read clipboard", error);
    setStatus("Clipboard paste failed. Check the extension clipboard permission and try again.");
    return;
  }

  const pastedLine = clipboardText.replace(/\r\n?/g, "\n").replace(/\n+$/g, "");
  if (pastedLine.length === 0) {
    textarea.focus();
    setStatus(`Clipboard is empty. ${fieldLabel} unchanged.`);
    return;
  }

  const separator = textarea.value.length === 0 || textarea.value.endsWith("\n") ? "" : "\n";
  textarea.value = `${textarea.value}${separator}${pastedLine}`;
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  textarea.scrollTop = textarea.scrollHeight;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  setStatus(`${fieldLabel} pasted as a new line. Update or create the rule to keep it.`);
}

function getTextareaCurrentLineRange(textarea) {
  const value = textarea.value;
  const selectionStart = typeof textarea.selectionStart === "number"
    ? textarea.selectionStart
    : value.length;
  const previousBreakIndex = selectionStart === 0
    ? -1
    : value.lastIndexOf("\n", selectionStart - 1);
  const nextBreakIndex = value.indexOf("\n", selectionStart);
  const lineStart = previousBreakIndex + 1;
  const lineEnd = nextBreakIndex === -1 ? value.length : nextBreakIndex;

  return {
    lineStart,
    lineEnd,
    line: value.slice(lineStart, lineEnd),
  };
}

function stripOuterEllipsisMarkers(value) {
  return value.replace(/^\.{3}/, "").replace(/\.{3}$/, "");
}

function parseHighlightIndicatorLine(line, allowExclude) {
  let text = typeof line === "string" ? line.trim() : "";
  const excluded = allowExclude && text.startsWith("--");
  if (excluded) {
    text = text.slice(2).trimStart();
  }

  const priority = text.startsWith("!");
  if (priority) {
    text = text.slice(1).trimStart();
  }

  const regex = text.startsWith("r-");
  if (regex) {
    text = text.slice(2).trimStart();
  }

  const hasLeadingWildcard = !regex && text.startsWith("...");
  const hasTrailingWildcard = !regex && text.endsWith("...");
  const wildcardMode = hasLeadingWildcard && hasTrailingWildcard
    ? "contains"
    : (hasLeadingWildcard ? "ends" : (hasTrailingWildcard ? "starts" : "exact"));

  return {
    excluded,
    priority,
    regex,
    wildcardMode,
    body: regex ? text : stripOuterEllipsisMarkers(text),
  };
}

function buildHighlightIndicatorLine(parsed, allowExclude) {
  const prefix = [
    allowExclude && parsed.excluded ? "--" : "",
    parsed.priority ? "!" : "",
    parsed.regex ? "r-" : "",
  ].join("");
  let body = parsed.body;
  if (!parsed.regex) {
    if (parsed.wildcardMode === "starts") {
      body = `${body}...`;
    } else if (parsed.wildcardMode === "ends") {
      body = `...${body}`;
    } else if (parsed.wildcardMode === "contains") {
      body = `...${body}...`;
    }
  }

  return `${prefix}${body}`;
}

function getHighlightIndicatorCaretOffset(nextLine, parsed, command, allowExclude) {
  const prefixLength = [
    allowExclude && parsed.excluded ? "--" : "",
    parsed.priority ? "!" : "",
    parsed.regex ? "r-" : "",
  ].join("").length;
  if (!parsed.body && command === "wildcard-starts") {
    return prefixLength;
  }
  if (!parsed.body && command === "wildcard-contains") {
    return prefixLength + 3;
  }

  return nextLine.length;
}

function applyHighlightLineIndicator(textareaSelector, command, fieldLabel) {
  const textarea = document.querySelector(textareaSelector);
  if (!(textarea instanceof HTMLTextAreaElement) || !command) {
    return;
  }

  const allowExclude = textareaSelector === "#highlight-rule-matches";
  const { lineStart, lineEnd, line } = getTextareaCurrentLineRange(textarea);
  const parsedLine = parseHighlightIndicatorLine(line, allowExclude);

  if (command === "toggle-priority") {
    parsedLine.priority = !parsedLine.priority;
  } else if (command === "toggle-exclude") {
    if (!allowExclude) {
      setStatus("Exclusion markers only apply to matched strings.");
      return;
    }
    parsedLine.excluded = !parsedLine.excluded;
  } else if (command === "toggle-regex") {
    parsedLine.regex = !parsedLine.regex;
    parsedLine.body = stripOuterEllipsisMarkers(parsedLine.body);
    parsedLine.wildcardMode = "exact";
  } else if (command.startsWith("wildcard-")) {
    if (parsedLine.regex) {
      textarea.focus();
      setStatus("Ellipsis markers apply to normal lines. Turn off r- before using them.");
      return;
    }
    parsedLine.wildcardMode = command.replace("wildcard-", "");
  } else {
    return;
  }

  const nextLine = buildHighlightIndicatorLine(parsedLine, allowExclude);
  const nextValue = `${textarea.value.slice(0, lineStart)}${nextLine}${textarea.value.slice(lineEnd)}`;
  const caretOffset = getHighlightIndicatorCaretOffset(nextLine, parsedLine, command, allowExclude);
  const caretPosition = lineStart + Math.min(caretOffset, nextLine.length);
  textarea.value = nextValue;
  textarea.focus();
  textarea.setSelectionRange(caretPosition, caretPosition);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  setStatus(`${fieldLabel} line marker changed. Update or create the rule to keep it.`);
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
    renderHighlightRuleCopyControl(list);
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

function copyHighlightRule(rule) {
  return {
    ...rule,
    id: createRuleId(),
    matchStrings: Array.isArray(rule.matchStrings) ? [...rule.matchStrings] : [],
    companionWords: Array.isArray(rule.companionWords) ? [...rule.companionWords] : [],
  };
}

function getCopyableHighlightRules(taskType) {
  return sanitizeHighlightRules(highlightState.taskTypeHighlightRules[taskType]);
}

function getHighlightRuleCopySourceDefinitions(targetTaskType = getActiveTaskTypeKey()) {
  return getTaskTypeDefinitions().filter((definition) => (
    definition.key !== targetTaskType
    && getCopyableHighlightRules(definition.key).length > 0
  ));
}

function copyHighlightRulesFromTaskType(sourceTaskType) {
  const targetTaskType = getActiveTaskTypeKey();
  if (highlightState.rules.length > 0) {
    setStatus("This task type already has highlight rules.");
    return;
  }

  const sourceDefinition = getTaskTypeDefinition(sourceTaskType);
  if (!sourceDefinition || sourceDefinition.key === targetTaskType) {
    setStatus("Choose another task type with highlight rules.");
    return;
  }

  const copiedRules = getCopyableHighlightRules(sourceDefinition.key).map(copyHighlightRule);
  if (copiedRules.length === 0) {
    setStatus(`${sourceDefinition.label} has no highlight rules to copy.`);
    return;
  }

  highlightState.rules = copiedRules;
  highlightState.taskTypeHighlightRules = {
    ...highlightState.taskTypeHighlightRules,
    [targetTaskType]: copiedRules,
  };
  clearRuleForm();
  void saveHighlightRules(
    `Copied ${copiedRules.length} highlight rule${copiedRules.length === 1 ? "" : "s"} from ${sourceDefinition.label}.`,
  );
}

function renderHighlightRuleCopyControl(list) {
  const targetTaskType = getActiveTaskTypeKey();
  const sourceDefinitions = getHighlightRuleCopySourceDefinitions(targetTaskType);
  if (sourceDefinitions.length === 0) {
    return;
  }

  const row = document.createElement("div");
  row.className = "rule-copy-row";

  const label = document.createElement("label");
  label.textContent = "Copy highlight rules from";

  const select = document.createElement("select");
  select.append(new Option("Choose a task type", ""));
  for (const definition of sourceDefinitions) {
    const count = getCopyableHighlightRules(definition.key).length;
    select.append(new Option(`${definition.label} (${count})`, definition.key));
  }
  label.append(select);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Copy";
  button.disabled = true;
  select.addEventListener("change", () => {
    button.disabled = !select.value;
  });
  button.addEventListener("click", () => {
    if (!select.value) {
      return;
    }

    copyHighlightRulesFromTaskType(select.value);
  });

  row.append(label, button);
  list.append(row);
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

function updateCustomAnalysisTocEntries(updater) {
  syncActiveTaskTypeScopedSettings();
  const taskType = getActiveTaskTypeKey();
  const currentEntries = sanitizeCustomAnalysisTocEntries(highlightState.taskTypeTocEntries[taskType], {
    reservedKeys: getBuiltInAnalysisTocEntryKeys(taskType),
  });
  const nextEntries = sanitizeCustomAnalysisTocEntries(updater(currentEntries), {
    reservedKeys: getBuiltInAnalysisTocEntryKeys(taskType),
  });
  highlightState.taskTypeTocEntries = {
    ...highlightState.taskTypeTocEntries,
    [taskType]: nextEntries,
  };
  applyActiveTaskTypeScopedSettings();
  renderCustomAnalysisTocEntryEditor();
  renderAnalysisTocSettings();
}

function getCopyableAnalysisTocEntries(taskType) {
  return getAnalysisTocEntries(taskType).filter((entry) => (
    entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT
    || getAnalysisTocEntryTargetTexts(entry).length > 0
  ));
}

function getAnalysisTocCopySourceDefinitions(targetTaskType = getActiveTaskTypeKey()) {
  return getTaskTypeDefinitions().filter((definition) => (
    definition.key !== targetTaskType
    && getCopyableAnalysisTocEntries(definition.key).length > 0
  ));
}

function getSourceAnalysisTocState(taskType) {
  const entries = getCopyableAnalysisTocEntries(taskType);
  return {
    entries,
    colors: sanitizeAnalysisTocButtonColors(highlightState.taskTypeTocButtonColors[taskType], entries),
    settings: sanitizeAnalysisTocButtonSettings(highlightState.taskTypeTocButtonSettings[taskType], entries),
    labels: sanitizeAnalysisTocButtonLabels(highlightState.taskTypeTocButtonLabels[taskType], entries),
    order: sanitizeAnalysisTocButtonOrder(highlightState.taskTypeTocButtonOrder[taskType], entries),
  };
}

function createCopiedAnalysisTocEntries(sourceEntries, sourceLabels, reservedKeys = new Set()) {
  const usedKeys = new Set(reservedKeys);
  const keyMap = {};
  const copiedEntries = [];

  for (const [index, entry] of sourceEntries.entries()) {
    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT) {
      if (usedKeys.has(LATEST_USER_PROMPT_TOC_KEY)) {
        continue;
      }

      usedKeys.add(LATEST_USER_PROMPT_TOC_KEY);
      keyMap[entry.key] = LATEST_USER_PROMPT_TOC_KEY;
      copiedEntries.push({
        key: LATEST_USER_PROMPT_TOC_KEY,
        label: sanitizeAnalysisTocButtonLabel(sourceLabels[entry.key], entry.label ?? "Latest prompt"),
        type: ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT,
      });
      continue;
    }

    const targetTexts = getAnalysisTocEntryTargetTexts(entry);
    const targetText = targetTexts[0] ?? "";
    if (!targetText) {
      continue;
    }

    const fallbackLabel = entry.label || targetText || `TOC ${index + 1}`;
    const label = sanitizeAnalysisTocButtonLabel(sourceLabels[entry.key], fallbackLabel);
    const copiedKey = makeUniqueAnalysisTocEntryKey(
      createAnalysisTocEntryKey(entry.key || label || targetText, "toc"),
      usedKeys,
    );
    keyMap[entry.key] = copiedKey;
    copiedEntries.push({
      key: copiedKey,
      label,
      targetText,
      targetTexts,
      type: ANALYSIS_TOC_ENTRY_TYPE_CUSTOM_TEXT,
    });
  }

  return {
    entries: sanitizeCustomAnalysisTocEntries(copiedEntries, { reservedKeys }),
    keyMap,
  };
}

function copyAnalysisTocButtonsFromTaskType(sourceTaskType) {
  syncActiveTaskTypeScopedSettings();
  const targetTaskType = getActiveTaskTypeKey();
  if (getEditableCustomAnalysisTocEntries(targetTaskType).length > 0) {
    setStatus("This task type already has TOC buttons.");
    return;
  }

  const sourceDefinition = getTaskTypeDefinition(sourceTaskType);
  if (!sourceDefinition || sourceDefinition.key === targetTaskType) {
    setStatus("Choose another task type with TOC buttons.");
    return;
  }

  const source = getSourceAnalysisTocState(sourceDefinition.key);
  if (source.entries.length === 0) {
    setStatus(`${sourceDefinition.label} has no TOC buttons to copy.`);
    return;
  }

  const { entries, keyMap } = createCopiedAnalysisTocEntries(
    source.entries,
    source.labels,
    getBuiltInAnalysisTocEntryKeys(targetTaskType),
  );
  if (entries.length === 0) {
    setStatus(`${sourceDefinition.label} has no copyable TOC buttons.`);
    return;
  }

  const copyMappedValues = (sourceMap, fallbackFactory) => Object.fromEntries(entries.map((entry) => {
    const sourceKey = Object.entries(keyMap).find(([, targetKey]) => targetKey === entry.key)?.[0] ?? "";
    return [
      entry.key,
      sourceKey && Object.prototype.hasOwnProperty.call(sourceMap, sourceKey)
        ? sourceMap[sourceKey]
        : fallbackFactory(entry),
    ];
  }));
  const order = source.order.map((sourceKey) => keyMap[sourceKey]).filter(Boolean);

  highlightState.taskTypeTocEntries = {
    ...highlightState.taskTypeTocEntries,
    [targetTaskType]: entries,
  };
  highlightState.taskTypeTocButtonColors = {
    ...highlightState.taskTypeTocButtonColors,
    [targetTaskType]: sanitizeAnalysisTocButtonColors(
      copyMappedValues(source.colors, () => DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR),
      entries,
    ),
  };
  highlightState.taskTypeTocButtonSettings = {
    ...highlightState.taskTypeTocButtonSettings,
    [targetTaskType]: sanitizeAnalysisTocButtonSettings(
      copyMappedValues(source.settings, () => ({
        side: ANALYSIS_TOC_SIDE_LEFT,
        offsetPx: ANALYSIS_TOC_DEFAULT_OFFSET_PX,
        caseSensitive: false,
      })),
      entries,
    ),
  };
  highlightState.taskTypeTocButtonLabels = {
    ...highlightState.taskTypeTocButtonLabels,
    [targetTaskType]: sanitizeAnalysisTocButtonLabels(
      copyMappedValues(source.labels, (entry) => entry.label),
      entries,
    ),
  };
  highlightState.taskTypeTocButtonOrder = {
    ...highlightState.taskTypeTocButtonOrder,
    [targetTaskType]: sanitizeAnalysisTocButtonOrder(order, entries),
  };

  applyActiveTaskTypeScopedSettings();
  renderCustomAnalysisTocEntryEditor();
  renderAnalysisTocSettings();
  setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
  setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
  setAnalysisTocColumnScaleInputs(highlightState.tocColumnScale);
  setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  setStatus(`Copied ${entries.length} TOC button${entries.length === 1 ? "" : "s"} from ${sourceDefinition.label}. Save settings to apply it.`);
}

function addCustomAnalysisTocEntry() {
  updateCustomAnalysisTocEntries((entries) => {
    const usedKeys = new Set(entries.map((entry) => entry.key));
    return [
      ...entries,
      {
        key: makeUniqueAnalysisTocEntryKey(createAnalysisTocEntryKey("New TOC Button", "toc"), usedKeys),
        label: "New TOC Button",
        targetText: "Rating:",
        targetTexts: ["Rating:"],
      },
    ];
  });
  setStatus("TOC button added. Save settings to apply it.");
}

function deleteCustomAnalysisTocEntry(entryKey) {
  const entry = getAnalysisTocEntries().find((candidate) => candidate.key === entryKey);
  updateCustomAnalysisTocEntries((entries) => entries.filter((candidate) => candidate.key !== entryKey));
  setStatus(`${entry?.label ?? "TOC button"} deleted. Save settings to apply it.`);
}

function renderAnalysisTocCopyControl(list) {
  const targetTaskType = getActiveTaskTypeKey();
  const sourceDefinitions = getAnalysisTocCopySourceDefinitions(targetTaskType);
  if (sourceDefinitions.length === 0) {
    return;
  }

  const row = document.createElement("div");
  row.className = "toc-copy-row";

  const label = document.createElement("label");
  label.textContent = "Copy TOC buttons from";

  const select = document.createElement("select");
  select.append(new Option("Choose a task type", ""));
  for (const definition of sourceDefinitions) {
    const count = getCopyableAnalysisTocEntries(definition.key).length;
    select.append(new Option(`${definition.label} (${count})`, definition.key));
  }
  label.append(select);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Copy";
  button.disabled = true;
  select.addEventListener("change", () => {
    button.disabled = !select.value;
  });
  button.addEventListener("click", () => {
    if (!select.value) {
      return;
    }

    copyAnalysisTocButtonsFromTaskType(select.value);
  });

  row.append(label, button);
  list.append(row);
}

function renderCustomAnalysisTocEntryEditor() {
  const panel = document.querySelector("#custom-toc-editor");
  const list = document.querySelector("#custom-toc-entry-list");
  const addButton = document.querySelector("#add-custom-toc-entry");
  if (!(panel instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    return;
  }

  const isHardCoded = isHardCodedAnalysisTocTaskType();
  panel.hidden = false;
  list.replaceChildren();
  if (addButton instanceof HTMLButtonElement) {
    addButton.hidden = false;
  }

  if (isHardCoded) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "This task type keeps the built-in Search Experience TOC targets. Custom string TOC buttons added here appear alongside them.";
    list.append(message);
  }

  const entries = getEditableCustomAnalysisTocEntries();
  if (entries.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "No custom TOC buttons are configured for this task type.";
    list.append(message);
    renderAnalysisTocCopyControl(list);
    return;
  }

  for (const entry of entries) {
    const row = document.createElement("div");
    row.className = "custom-toc-entry-row";

    const labelControl = document.createElement("label");
    labelControl.textContent = "Button label";
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.value = entry.label;
    labelInput.autocomplete = "off";
    labelInput.spellcheck = false;
    labelInput.addEventListener("input", () => {
      const taskType = getActiveTaskTypeKey();
      const nextLabel = labelInput.value;
      highlightState.taskTypeTocEntries = {
        ...highlightState.taskTypeTocEntries,
        [taskType]: getEditableCustomAnalysisTocEntries(taskType).map((candidate) => (
          candidate.key === entry.key ? { ...candidate, label: nextLabel } : candidate
        )),
      };
      highlightState.tocButtonLabels[entry.key] = sanitizeAnalysisTocButtonLabel(nextLabel, entry.label);
      renderAnalysisTocSettings();
      setStatus("TOC button label changed. Save settings to apply it.");
    });
    labelControl.append(labelInput);

    const targetControl = document.createElement("label");
    targetControl.textContent = entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT
      ? "Target"
      : "Detection strings";
    const targetInput = document.createElement(
      entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT ? "input" : "textarea",
    );
    if (targetInput instanceof HTMLInputElement) {
      targetInput.type = "text";
    }
    targetInput.value = entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT
      ? "Latest user prompt"
      : getAnalysisTocEntryTargetTexts(entry).join("\n");
    targetInput.autocomplete = "off";
    targetInput.spellcheck = false;
    if (entry.type === ANALYSIS_TOC_ENTRY_TYPE_LATEST_USER_PROMPT) {
      targetInput.disabled = true;
    } else {
      targetInput.addEventListener("input", () => {
        const taskType = getActiveTaskTypeKey();
        highlightState.taskTypeTocEntries = {
          ...highlightState.taskTypeTocEntries,
          [taskType]: getEditableCustomAnalysisTocEntries(taskType).map((candidate) => (
            candidate.key === entry.key
              ? {
                ...candidate,
                targetText: normalizeStringList(targetInput.value)[0] ?? "",
                targetTexts: normalizeStringList(targetInput.value),
              }
              : candidate
          )),
        };
        renderAnalysisTocSettings();
        setStatus("TOC target text changed. Save settings to apply it.");
      });
    }
    targetControl.append(targetInput);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteCustomAnalysisTocEntry(entry.key);
    });

    row.append(labelControl, targetControl, deleteButton);
    list.append(row);
  }
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
      caseSensitive: false,
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
        caseSensitive: sanitizeAnalysisTocButtonCaseSensitive(currentSettings.caseSensitive),
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
        caseSensitive: sanitizeAnalysisTocButtonCaseSensitive(currentSettings.caseSensitive),
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

    const caseSensitiveInput = document.createElement("input");
    caseSensitiveInput.id = `analysis-toc-case-sensitive-${headingEntry.index}`;
    caseSensitiveInput.type = "checkbox";
    caseSensitiveInput.dataset.headingKey = headingEntry.key;
    caseSensitiveInput.checked = sanitizeAnalysisTocButtonCaseSensitive(settings.caseSensitive);
    caseSensitiveInput.addEventListener("change", () => {
      const currentSettings = highlightState.tocButtonSettings[headingEntry.key] ?? {};
      highlightState.tocButtonSettings[headingEntry.key] = {
        ...currentSettings,
        side: sanitizeAnalysisTocButtonSide(currentSettings.side),
        offsetPx: sanitizeAnalysisTocButtonOffset(currentSettings.offsetPx),
        caseSensitive: caseSensitiveInput.checked,
      };
      setStatus("TOC case sensitivity changed. Save settings to apply it.");
    });

    const caseSensitiveControl = document.createElement("label");
    caseSensitiveControl.className = "toc-control";
    caseSensitiveControl.htmlFor = caseSensitiveInput.id;
    const caseSensitiveLabelText = document.createElement("span");
    caseSensitiveLabelText.textContent = "Case";
    const caseSensitiveInline = document.createElement("span");
    caseSensitiveInline.className = "toc-inline-checkbox";
    const caseSensitiveText = document.createElement("span");
    caseSensitiveText.textContent = "Sensitive";
    caseSensitiveInline.append(caseSensitiveInput, caseSensitiveText);
    caseSensitiveControl.append(caseSensitiveLabelText, caseSensitiveInline);

    const controls = document.createElement("span");
    controls.className = "toc-settings-controls";
    controls.append(colorLabel, sideLabel, offsetLabel, caseSensitiveControl);

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

function setAnalysisTocColumnScaleInputs(scale) {
  const normalizedScale = sanitizeAnalysisTocColumnScale(scale);
  const leftInput = document.querySelector("#analysis-toc-left-scale");
  const rightInput = document.querySelector("#analysis-toc-right-scale");
  if (leftInput instanceof HTMLInputElement) {
    leftInput.value = String(scaleToPercent(normalizedScale[ANALYSIS_TOC_SIDE_LEFT]));
  }

  if (rightInput instanceof HTMLInputElement) {
    rightInput.value = String(scaleToPercent(normalizedScale[ANALYSIS_TOC_SIDE_RIGHT]));
  }
}

function getAnalysisTocColumnScaleInputValues() {
  return sanitizeAnalysisTocColumnScale({
    [ANALYSIS_TOC_SIDE_LEFT]: document.querySelector("#analysis-toc-left-scale")?.value,
    [ANALYSIS_TOC_SIDE_RIGHT]: document.querySelector("#analysis-toc-right-scale")?.value,
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

function setMultiScreenshotBatchSizeInput(value) {
  const input = document.querySelector("#multi-screenshot-batch-size");
  if (input instanceof HTMLInputElement) {
    input.value = String(sanitizeMultiScreenshotBatchSize(value));
  }
}

function getMultiScreenshotBatchSizeInputValue() {
  return sanitizeMultiScreenshotBatchSize(
    document.querySelector("#multi-screenshot-batch-size")?.value,
  );
}

async function saveHighlightRules(message = "Highlight rules saved.") {
  syncActiveTaskTypeScopedSettings();
  renderHighlightRules();
  setStatus(`${message} Saving...`);

  try {
    await chrome.storage.local.set({
      [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: highlightState.taskTypeHighlightRules,
      [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
    });
    await chrome.storage.sync.remove([
      STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES,
      STORAGE_KEY_HIGHLIGHT_RULES,
    ]);
    setStatus(message);
  } catch (error) {
    console.error("Local Query Bridge failed to save highlight rules", error);
    setStatus(`${message} The list changed here, but automatic saving failed. Try Save settings.`);
  }
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
    [STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED]: false,
    [STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS]: null,
    [STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS]: null,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY]: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_OPACITY,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH]: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH]: DEFAULT_SERVER_CONTROL_ZONE_DIVIDER_LENGTH_PX,
    [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: null,
    [STORAGE_KEY_HIGHLIGHT_RULES]: null,
    [STORAGE_KEY_CHAT_PROCESSING_QUEUE]: [],
  });
  const migrateCommentDraftAction = shouldMigrateCommentDraftAction(
    localStored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS],
    localStored[STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED],
  );
  highlightState.taskTypeDefinitions = sanitizeTaskTypeDefinitions(
    localStored[STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS],
    { addCommentDraftAction: migrateCommentDraftAction },
  );
  if (migrateCommentDraftAction) {
    void chrome.storage.local.set({
      [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: highlightState.taskTypeDefinitions,
      [STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED]: true,
    });
  }
  highlightState.taskRegions = sanitizeTaskRegionsMap(
    localStored[STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS],
  );
  highlightState.universalRegions = sanitizeUniversalRegionsMap(
    localStored[STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS],
  );
  highlightState.zoneDividerOpacity = sanitizeServerControlZoneDividerOpacity(
    localStored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY],
  );
  highlightState.zoneDividerTopLengthPx = sanitizeServerControlZoneDividerLength(
    localStored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH],
  );
  highlightState.zoneDividerBottomLengthPx = sanitizeServerControlZoneDividerLength(
    localStored[STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH],
  );
  highlightState.chatProcessingQueue = normalizeChatProcessingQueue(
    localStored[STORAGE_KEY_CHAT_PROCESSING_QUEUE],
  );

  const stored = await chrome.storage.sync.get({
    [STORAGE_KEY_START_PAGE_URL]: DEFAULT_START_PAGE_URL,
    [STORAGE_KEY_PROJECT_IDS]: null,
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: null,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: BRIDGE_TASK_TYPE_SEARCH_PRODUCT_USEFULNESS,
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: null,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: DEFAULT_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS,
    [STORAGE_KEY_RESET_LIMIT]: DEFAULT_RESET_LIMIT,
    [STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE]: DEFAULT_MULTI_SCREENSHOT_BATCH_SIZE,
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
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS]: DEFAULT_SERVER_CONTROL_STATUS_LOG_COLORS,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES]: DEFAULT_SERVER_CONTROL_STATUS_LOG_MESSAGES,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY]: DEFAULT_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH]: DEFAULT_SERVER_CONTROL_STATUS_LOG_WIDTH_PX,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT]: DEFAULT_SERVER_CONTROL_STATUS_LOG_LEFT_PX,
  });

  const projectSettings = normalizeProjectSettings(
    stored[STORAGE_KEY_PROJECT_IDS],
    stored[STORAGE_KEY_ACTIVE_PROJECT_ID],
    stored[STORAGE_KEY_START_PAGE_URL],
  );
  const resetLimit = sanitizeResetLimit(stored[STORAGE_KEY_RESET_LIMIT]);
  highlightState.multiScreenshotBatchSize = sanitizeMultiScreenshotBatchSize(
    stored[STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE],
  );
  highlightState.taskTypeProjectIds = migrateTaskTypeProjectIds(
    stored[STORAGE_KEY_TASK_TYPE_PROJECT_IDS],
    projectSettings.projectIds,
  );
  highlightState.taskTypeActiveProjectAccounts = sanitizeTaskTypeActiveProjectAccounts(
    stored[STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS],
  );
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(stored[STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]);
  highlightState.taskTypeTocEntries = sanitizeTaskTypeAnalysisTocEntriesMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES],
  );
  highlightState.taskTypeHighlightRules = sanitizeTaskTypeScopedMap(
    localStored[STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES] ?? stored[STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES],
    sanitizeHighlightRules,
    localStored[STORAGE_KEY_HIGHLIGHT_RULES] ?? stored[STORAGE_KEY_HIGHLIGHT_RULES],
  );
  highlightState.taskTypeTocButtonColors = sanitizeTaskTypeScopedTocMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS],
    sanitizeAnalysisTocButtonColors,
    stored[STORAGE_KEY_ANALYSIS_TOC_COLORS],
  );
  highlightState.taskTypeTocButtonSettings = sanitizeTaskTypeScopedTocMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS],
    sanitizeAnalysisTocButtonSettings,
    stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS],
  );
  highlightState.taskTypeTocButtonLabels = sanitizeTaskTypeScopedTocMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS],
    sanitizeAnalysisTocButtonLabels,
    stored[STORAGE_KEY_ANALYSIS_TOC_LABELS],
  );
  highlightState.taskTypeTocButtonOrder = sanitizeTaskTypeScopedTocMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER],
    sanitizeAnalysisTocButtonOrder,
    stored[STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER],
  );
  highlightState.taskTypeTocColumnPositions = sanitizeTaskTypeScopedMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS],
    sanitizeAnalysisTocColumnPositions,
    stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS],
  );
  highlightState.taskTypeTocColumnOpacity = sanitizeTaskTypeScopedMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY],
    sanitizeAnalysisTocColumnOpacity,
    stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY],
  );
  highlightState.taskTypeTocColumnScale = sanitizeTaskTypeScopedMap(
    stored[STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE],
    sanitizeAnalysisTocColumnScale,
    stored[STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE],
  );
  highlightState.taskTypeLatestPromptScrollHoldSeconds = sanitizeTaskTypeScopedMap(
    stored[STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS],
    sanitizeLatestPromptScrollHoldSeconds,
    stored[STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS],
  );
  highlightState.statusLogColors = sanitizeServerControlStatusLogColors(
    stored[STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS],
  );
  highlightState.statusLogMessages = sanitizeServerControlStatusLogMessages(
    stored[STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES],
  );
  highlightState.statusLogIdleOpacity = sanitizeServerControlStatusLogIdleOpacity(
    stored[STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY],
  );
  highlightState.statusLogWidthPx = sanitizeServerControlStatusLogWidth(
    stored[STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH],
  );
  highlightState.statusLogLeftPx = sanitizeServerControlStatusLogLeft(
    stored[STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT],
  );
  applyActiveTaskTypeScopedSettings();

  document.querySelector("#reset-limit").value = String(resetLimit);
  setMultiScreenshotBatchSizeInput(highlightState.multiScreenshotBatchSize);
  setServerControlZoneDividerOpacityInput(highlightState.zoneDividerOpacity);
  setServerControlStatusLogIdleOpacityInput(highlightState.statusLogIdleOpacity);
  setServerControlStatusLogWidthInput(highlightState.statusLogWidthPx);
  setServerControlStatusLogLeftInput(highlightState.statusLogLeftPx);
  setServerControlZoneDividerLengthInputs(
    highlightState.zoneDividerTopLengthPx,
    highlightState.zoneDividerBottomLengthPx,
  );
  renderTaskTypeProjectIds();
  renderServerControlStatusLogColorSettings();
  renderServerControlStatusLogMessageSettings();
  renderActiveTaskTypeScopedSettings();
  renderChatProcessingQueue();
  void refreshSettingsSyncDiffCount();
}

function pickSettingsKeys(source, allowedKeys) {
  const output = {};
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return output;
  }

  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      output[key] = source[key];
    }
  }
  return output;
}

function normalizeChatProcessingUrl(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return "";
  }

  try {
    const url = new URL(text);
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch (_error) {
    return text.split("#")[0].split("?")[0];
  }
}

function normalizeChatProcessingQueue(rawValue) {
  const rawItems = Array.isArray(rawValue) ? rawValue : [];
  const seenIds = new Set();
  return rawItems
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const url = typeof item.url === "string" ? item.url.trim() : "";
      const normalizedUrl = normalizeChatProcessingUrl(item.normalizedUrl || url);
      if (!url || !normalizedUrl) {
        return null;
      }

      const idSource = typeof item.id === "string" && item.id.trim()
        ? item.id.trim()
        : `${normalizedUrl}|${item.savedAt || ""}`;
      if (seenIds.has(idSource)) {
        return null;
      }
      seenIds.add(idSource);

      const status = ["queued", "opened", "done"].includes(item.status) ? item.status : "queued";
      return {
        id: idSource,
        url,
        normalizedUrl,
        title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : "ChatGPT chat",
        taskType: sanitizeBridgeTaskType(item.taskType),
        taskTypeLabel: typeof item.taskTypeLabel === "string" ? item.taskTypeLabel.trim() : "",
        status,
        savedAt: typeof item.savedAt === "string" ? item.savedAt : "",
        openedAt: typeof item.openedAt === "string" ? item.openedAt : "",
        doneAt: typeof item.doneAt === "string" ? item.doneAt : "",
        prompt: typeof item.prompt === "string" ? item.prompt : "",
        abstractionPrompt: typeof item.abstractionPrompt === "string" ? item.abstractionPrompt : "",
      };
    })
    .filter(Boolean)
    .sort((left, right) => String(right.savedAt || "").localeCompare(String(left.savedAt || "")));
}

function formatChatProcessingDate(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    return "";
  }

  return new Date(timestamp).toLocaleString();
}

function getTaskTypeLabel(taskType) {
  const taskDefinition = getTaskTypeDefinitions().find((definition) => definition.key === taskType);
  return taskDefinition?.label ?? taskType;
}

async function saveChatProcessingQueue(queue, message = "Chat processing queue updated.") {
  highlightState.chatProcessingQueue = normalizeChatProcessingQueue(queue);
  await chrome.storage.local.set({
    [STORAGE_KEY_CHAT_PROCESSING_QUEUE]: highlightState.chatProcessingQueue,
  });
  renderChatProcessingQueue();
  try {
    await pushSettingsSnapshotToBridge(await createCurrentSettingsSyncSnapshotFromStorage(), {
      useLargePadding: false,
    });
    setStatus(`${message} Synced to bridge.`);
    renderSettingsSyncDiffState([]);
  } catch (error) {
    setStatus(`${message} Bridge sync failed: ${error}`);
    void refreshSettingsSyncDiffCount();
  }
}

async function openChatProcessingItem(itemId) {
  const queue = normalizeChatProcessingQueue(highlightState.chatProcessingQueue);
  const item = queue.find((candidate) => candidate.id === itemId);
  if (!item) {
    return;
  }

  const now = new Date().toISOString();
  const nextQueue = queue.map((candidate) => (
    candidate.id === itemId
      ? { ...candidate, status: "opened", openedAt: now }
      : candidate
  ));
  await saveChatProcessingQueue(nextQueue, "Chat marked opened for processing.");
  await chrome.tabs.create({ url: item.url, active: true });
}

async function markChatProcessingItemDone(itemId) {
  const now = new Date().toISOString();
  const queue = normalizeChatProcessingQueue(highlightState.chatProcessingQueue).map((item) => (
    item.id === itemId
      ? { ...item, status: "done", doneAt: now }
      : item
  ));
  await saveChatProcessingQueue(queue, "Chat marked done.");
}

function renderChatProcessingQueue() {
  const container = document.querySelector("#chat-processing-list");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const queue = normalizeChatProcessingQueue(highlightState.chatProcessingQueue);
  container.replaceChildren();
  if (queue.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No chats saved for processing.";
    container.append(empty);
    return;
  }

  for (const item of queue) {
    const row = document.createElement("div");
    const statusClass = `status-${item.status}`;
    row.className = `chat-processing-row ${statusClass} ${item.status === "done" ? "done" : ""}`;

    const main = document.createElement("div");
    main.className = "chat-processing-main";

    const headingRow = document.createElement("div");
    headingRow.className = "chat-processing-heading-row";

    const status = document.createElement("span");
    status.className = `chat-processing-status ${statusClass}`;
    status.textContent = item.status;

    const title = document.createElement("div");
    title.className = "chat-processing-title";
    title.textContent = item.title;
    headingRow.append(status, title);

    const meta = document.createElement("div");
    meta.className = "chat-processing-meta";
    const taskLabel = item.taskTypeLabel || getTaskTypeLabel(item.taskType);
    const savedAt = formatChatProcessingDate(item.savedAt);
    const openedAt = formatChatProcessingDate(item.openedAt);
    const doneAt = formatChatProcessingDate(item.doneAt);
    meta.textContent = [
      taskLabel || item.taskType || "Task",
      savedAt ? `saved ${savedAt}` : "",
      openedAt ? `opened ${openedAt}` : "",
      doneAt ? `done ${doneAt}` : "",
    ].filter(Boolean).join(" | ");

    const url = document.createElement("div");
    url.className = "chat-processing-url";
    url.textContent = item.url;

    main.append(headingRow, meta, url);
    main.addEventListener("click", () => {
      void openChatProcessingItem(item.id);
    });
    main.title = "Open and mark this chat for processing";

    const actions = document.createElement("div");
    actions.className = "chat-processing-actions";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.textContent = item.status === "opened" ? "Open again" : "Open";
    openButton.addEventListener("click", () => {
      void openChatProcessingItem(item.id);
    });

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.textContent = "Done";
    doneButton.disabled = item.status === "done";
    doneButton.addEventListener("click", () => {
      void markChatProcessingItemDone(item.id);
    });

    actions.append(openButton, doneButton);
    row.append(main, actions);
    container.append(row);
  }
}

function createSettingsSyncSnapshot(localSettings, syncSettings) {
  return {
    schemaVersion: SETTINGS_SYNC_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    extensionVersion: chrome.runtime.getManifest?.()?.version ?? "",
    storage: {
      local: pickSettingsKeys(localSettings, SETTINGS_SYNC_LOCAL_KEYS),
      sync: pickSettingsKeys(syncSettings, SETTINGS_SYNC_SYNC_KEYS),
    },
    removed: {
      local: [],
      sync: [...SETTINGS_SYNC_REMOVED_SYNC_KEYS],
    },
  };
}

function normalizeSettingsSyncSnapshot(rawSnapshot) {
  const snapshot = rawSnapshot && typeof rawSnapshot === "object" && !Array.isArray(rawSnapshot)
    ? rawSnapshot
    : {};
  const storage = snapshot.storage && typeof snapshot.storage === "object" && !Array.isArray(snapshot.storage)
    ? snapshot.storage
    : {};
  const localSettings = pickSettingsKeys(storage.local, SETTINGS_SYNC_LOCAL_KEYS);
  const syncSettings = pickSettingsKeys(storage.sync, SETTINGS_SYNC_SYNC_KEYS);
  if (Object.keys(localSettings).length === 0 && Object.keys(syncSettings).length === 0) {
    return null;
  }

  const removed = snapshot.removed && typeof snapshot.removed === "object" && !Array.isArray(snapshot.removed)
    ? snapshot.removed
    : {};
  return {
    ...snapshot,
    storage: {
      local: localSettings,
      sync: syncSettings,
    },
    removed: {
      local: Array.isArray(removed.local) ? removed.local.filter((key) => SETTINGS_SYNC_LOCAL_KEYS.includes(key)) : [],
      sync: Array.isArray(removed.sync) ? removed.sync.filter((key) => SETTINGS_SYNC_REMOVABLE_SYNC_KEYS.includes(key)) : [],
    },
  };
}

async function pushSettingsSnapshotToBridge(snapshot, options = {}) {
  const response = await chrome.runtime.sendMessage({
    type: SETTINGS_SYNC_MESSAGE_TYPE,
    mode: "push",
    snapshot,
    ...options,
  });
  if (!response?.ok) {
    throw new Error(response?.error || "Bridge did not accept the settings snapshot.");
  }
  return response;
}

function stableJsonStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableJsonStringify(entry)).join(",")}]`;
  }

  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${stableJsonStringify(value[key])}`
  )).join(",")}}`;
}

function humanizeSettingsSyncKey(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\bToc\b/g, "TOC")
    .replace(/\bOcr\b/g, "OCR")
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bId\b/g, "ID")
    .replace(/\bIds\b/g, "IDs")
    .replace(/\bPx\b/g, "px")
    .replace(/^./, (character) => character.toUpperCase());
}

function getSettingsSyncKeyLabel(key) {
  return SETTINGS_SYNC_KEY_LABELS[key] ?? humanizeSettingsSyncKey(key);
}

function getSettingsSyncAreaLabel(area) {
  return area === "sync" ? "Chrome sync" : "Chrome local";
}

function getSettingsSyncDiffKind(localSnapshot, bridgeSnapshot, area, key) {
  const localStorage = localSnapshot?.storage?.[area] ?? {};
  const bridgeStorage = bridgeSnapshot?.storage?.[area] ?? {};
  const localHasValue = Object.prototype.hasOwnProperty.call(localStorage, key);
  const bridgeHasValue = Object.prototype.hasOwnProperty.call(bridgeStorage, key);
  if (!localHasValue && bridgeHasValue) {
    return "Only in bridge file";
  }
  if (localHasValue && !bridgeHasValue) {
    return "Only in this extension";
  }
  return "Different value";
}

function getSettingsSnapshotDiffs(localSnapshot, bridgeSnapshot) {
  const normalizedBridgeSnapshot = normalizeSettingsSyncSnapshot(bridgeSnapshot);
  if (!normalizedBridgeSnapshot) {
    return [];
  }

  const diffs = [];
  for (const key of SETTINGS_SYNC_LOCAL_KEYS) {
    if (
      stableJsonStringify(localSnapshot.storage.local[key])
      !== stableJsonStringify(normalizedBridgeSnapshot.storage.local[key])
    ) {
      diffs.push({
        area: "local",
        key,
        label: getSettingsSyncKeyLabel(key),
        kind: getSettingsSyncDiffKind(localSnapshot, normalizedBridgeSnapshot, "local", key),
      });
    }
  }
  for (const key of SETTINGS_SYNC_SYNC_KEYS) {
    if (
      stableJsonStringify(localSnapshot.storage.sync[key])
      !== stableJsonStringify(normalizedBridgeSnapshot.storage.sync[key])
    ) {
      diffs.push({
        area: "sync",
        key,
        label: getSettingsSyncKeyLabel(key),
        kind: getSettingsSyncDiffKind(localSnapshot, normalizedBridgeSnapshot, "sync", key),
      });
    }
  }
  return diffs;
}

function renderSettingsSyncDiffList(diffs) {
  const container = document.querySelector("#sync-settings-diff-list");
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const normalizedDiffs = Array.isArray(diffs) ? diffs : [];
  container.replaceChildren();
  container.hidden = normalizedDiffs.length === 0;
  if (normalizedDiffs.length === 0) {
    return;
  }

  const heading = document.createElement("p");
  heading.className = "sync-settings-diff-heading";
  heading.textContent = `Changed settings (${normalizedDiffs.length})`;

  const list = document.createElement("ul");
  list.className = "sync-settings-diff-items";
  for (const diff of normalizedDiffs) {
    const item = document.createElement("li");
    item.className = "sync-settings-diff-item";

    const label = document.createElement("span");
    label.className = "sync-settings-diff-label";
    label.textContent = diff.label || getSettingsSyncKeyLabel(diff.key);

    const meta = document.createElement("span");
    meta.className = "sync-settings-diff-meta";
    meta.textContent = `${getSettingsSyncAreaLabel(diff.area)} | ${diff.kind || "Different value"} | ${diff.key}`;

    item.append(label, meta);
    list.append(item);
  }

  container.append(heading, list);
}

function renderSettingsSyncDiffState(diffs, { invalidatePending = true } = {}) {
  if (invalidatePending) {
    settingsSyncDiffRefreshToken += 1;
  }

  const chip = document.querySelector("#sync-settings-diff-count");
  if (!(chip instanceof HTMLElement)) {
    return;
  }

  const normalizedDiffs = Array.isArray(diffs) ? diffs : [];
  const normalizedCount = normalizedDiffs.length;
  chip.hidden = normalizedCount === 0;
  chip.textContent = normalizedCount > 99 ? "99+" : `${normalizedCount}`;
  renderSettingsSyncDiffList(normalizedDiffs);
  const button = document.querySelector("#sync-settings");
  if (button instanceof HTMLButtonElement) {
    button.title = normalizedCount > 0
      ? `${normalizedCount} settings key${normalizedCount === 1 ? "" : "s"} differ from the bridge file.`
      : "Settings match the bridge file.";
  }
}

async function createCurrentSettingsSyncSnapshotFromStorage() {
  const [localSettings, syncSettings] = await Promise.all([
    chrome.storage.local.get(SETTINGS_SYNC_LOCAL_KEYS),
    chrome.storage.sync.get(SETTINGS_SYNC_SYNC_KEYS),
  ]);
  return createSettingsSyncSnapshot(localSettings, syncSettings);
}

async function refreshSettingsSyncDiffCount() {
  const refreshToken = settingsSyncDiffRefreshToken + 1;
  settingsSyncDiffRefreshToken = refreshToken;
  try {
    const [currentSnapshot, response] = await Promise.all([
      createCurrentSettingsSyncSnapshotFromStorage(),
      chrome.runtime.sendMessage({
        type: SETTINGS_SYNC_MESSAGE_TYPE,
        mode: "pull",
        useLargePadding: false,
        logTraffic: false,
      }),
    ]);
    if (refreshToken !== settingsSyncDiffRefreshToken) {
      return;
    }
    if (!response?.ok || response.exists === false) {
      renderSettingsSyncDiffState([], { invalidatePending: false });
      return;
    }

    renderSettingsSyncDiffState(getSettingsSnapshotDiffs(currentSnapshot, response.snapshot), {
      invalidatePending: false,
    });
  } catch (_error) {
    if (refreshToken === settingsSyncDiffRefreshToken) {
      renderSettingsSyncDiffState([], { invalidatePending: false });
    }
  }
}

function scheduleSettingsSyncDiffRefresh(delayMs = SETTINGS_SYNC_DIFF_REFRESH_DEBOUNCE_MS) {
  if (settingsSyncDiffRefreshTimerId !== null) {
    window.clearTimeout(settingsSyncDiffRefreshTimerId);
  }
  settingsSyncDiffRefreshTimerId = window.setTimeout(() => {
    settingsSyncDiffRefreshTimerId = null;
    void refreshSettingsSyncDiffCount();
  }, Math.max(0, delayMs));
}

async function applySettingsSyncSnapshot(rawSnapshot) {
  const snapshot = normalizeSettingsSyncSnapshot(rawSnapshot);
  if (!snapshot) {
    throw new Error("The bridge settings file did not contain extension settings.");
  }

  const localSettings = snapshot.storage.local;
  const syncSettings = snapshot.storage.sync;
  if (Object.keys(localSettings).length > 0) {
    await chrome.storage.local.set(localSettings);
  }
  if (Object.keys(syncSettings).length > 0) {
    await chrome.storage.sync.set(syncSettings);
  }
  if (snapshot.removed.local.length > 0) {
    await chrome.storage.local.remove(snapshot.removed.local);
  }
  if (snapshot.removed.sync.length > 0) {
    await chrome.storage.sync.remove(snapshot.removed.sync);
  }

  return snapshot;
}

async function syncSettingsFromBridge() {
  setStatus("Syncing settings from bridge...");
  try {
    const response = await chrome.runtime.sendMessage({
      type: SETTINGS_SYNC_MESSAGE_TYPE,
      mode: "pull",
    });
    if (!response?.ok) {
      throw new Error(response?.error || "Bridge settings sync failed.");
    }
    if (response.exists === false) {
      setStatus("No bridge settings file exists yet. Save settings once on the source extension first.");
      return;
    }

    const snapshot = await applySettingsSyncSnapshot(response.snapshot);
    await loadOptions();
    renderSettingsSyncDiffState([]);
    setStatus(`Settings synced from bridge file saved ${snapshot.savedAtServer || snapshot.exportedAt || "earlier"}.`);
  } catch (error) {
    console.error("Local Query Bridge settings sync failed", error);
    setStatus(`Settings sync failed: ${error}`);
  }
}

async function saveOptions(event) {
  event.preventDefault();
  syncTaskTypeDefinitionEditorValues();

  const taskTypeDefinitions = sanitizeTaskTypeDefinitions(highlightState.taskTypeDefinitions);
  highlightState.taskTypeDefinitions = taskTypeDefinitions;
  const taskRegions = sanitizeTaskRegionsMap(highlightState.taskRegions);
  const universalRegions = sanitizeUniversalRegionsMap(highlightState.universalRegions);
  const zoneDividerOpacity = getServerControlZoneDividerOpacityInputValue();
  const statusLogIdleOpacity = getServerControlStatusLogIdleOpacityInputValue();
  const statusLogWidthPx = getServerControlStatusLogWidthInputValue();
  const statusLogLeftPx = getServerControlStatusLogLeftInputValue();
  const zoneDividerLengths = getServerControlZoneDividerLengthInputValues();
  highlightState.taskRegions = taskRegions;
  highlightState.universalRegions = universalRegions;
  highlightState.zoneDividerOpacity = zoneDividerOpacity;
  highlightState.statusLogIdleOpacity = statusLogIdleOpacity;
  highlightState.statusLogWidthPx = statusLogWidthPx;
  highlightState.statusLogLeftPx = statusLogLeftPx;
  highlightState.zoneDividerTopLengthPx = zoneDividerLengths.topLengthPx;
  highlightState.zoneDividerBottomLengthPx = zoneDividerLengths.bottomLengthPx;
  highlightState.taskTypeTocEntries = sanitizeTaskTypeAnalysisTocEntriesMap(highlightState.taskTypeTocEntries);
  highlightState.activeBridgeTaskType = sanitizeBridgeTaskType(highlightState.activeBridgeTaskType);
  syncActiveTaskTypeScopedSettings();
  const resetLimit = sanitizeResetLimit(document.querySelector("#reset-limit").value);
  const multiScreenshotBatchSize = getMultiScreenshotBatchSizeInputValue();
  const tocButtonColors = sanitizeAnalysisTocButtonColors(highlightState.tocButtonColors);
  const tocButtonSettings = sanitizeAnalysisTocButtonSettings(highlightState.tocButtonSettings);
  const tocButtonLabels = sanitizeAnalysisTocButtonLabels(highlightState.tocButtonLabels);
  const tocButtonOrder = sanitizeAnalysisTocButtonOrder(highlightState.tocButtonOrder);
  const tocColumnPositions = getAnalysisTocColumnPositionInputValues();
  const tocColumnOpacity = getAnalysisTocColumnOpacityInputValues();
  const tocColumnScale = getAnalysisTocColumnScaleInputValues();
  const latestPromptScrollHoldSeconds = getLatestPromptScrollHoldSecondsInputValue();
  const statusLogColors = sanitizeServerControlStatusLogColors(highlightState.statusLogColors);
  const statusLogMessages = sanitizeServerControlStatusLogMessages(highlightState.statusLogMessages);
  const taskTypeHighlightRules = sanitizeTaskTypeScopedMap(
    highlightState.taskTypeHighlightRules,
    sanitizeHighlightRules,
    highlightState.rules,
  );
  const taskTypeTocButtonColors = sanitizeTaskTypeScopedTocMap(
    highlightState.taskTypeTocButtonColors,
    sanitizeAnalysisTocButtonColors,
    tocButtonColors,
  );
  const taskTypeTocButtonSettings = sanitizeTaskTypeScopedTocMap(
    highlightState.taskTypeTocButtonSettings,
    sanitizeAnalysisTocButtonSettings,
    tocButtonSettings,
  );
  const taskTypeTocButtonLabels = sanitizeTaskTypeScopedTocMap(
    highlightState.taskTypeTocButtonLabels,
    sanitizeAnalysisTocButtonLabels,
    tocButtonLabels,
  );
  const taskTypeTocButtonOrder = sanitizeTaskTypeScopedTocMap(
    highlightState.taskTypeTocButtonOrder,
    sanitizeAnalysisTocButtonOrder,
    tocButtonOrder,
  );
  const taskTypeTocColumnPositions = sanitizeTaskTypeScopedMap(
    highlightState.taskTypeTocColumnPositions,
    sanitizeAnalysisTocColumnPositions,
    tocColumnPositions,
  );
  const taskTypeTocColumnOpacity = sanitizeTaskTypeScopedMap(
    highlightState.taskTypeTocColumnOpacity,
    sanitizeAnalysisTocColumnOpacity,
    tocColumnOpacity,
  );
  const taskTypeTocColumnScale = sanitizeTaskTypeScopedMap(
    highlightState.taskTypeTocColumnScale,
    sanitizeAnalysisTocColumnScale,
    tocColumnScale,
  );
  const taskTypeLatestPromptScrollHoldSeconds = sanitizeTaskTypeScopedMap(
    highlightState.taskTypeLatestPromptScrollHoldSeconds,
    sanitizeLatestPromptScrollHoldSeconds,
    latestPromptScrollHoldSeconds,
  );
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

  const localStorageSettings = {
    [STORAGE_KEY_SERVER_CONTROL_TASK_TYPE_DEFINITIONS]: taskTypeDefinitions,
    [STORAGE_KEY_SERVER_CONTROL_COMMENT_DRAFT_MIGRATED]: true,
    [STORAGE_KEY_SERVER_CONTROL_TASK_REGIONS]: taskRegions,
    [STORAGE_KEY_SERVER_CONTROL_UNIVERSAL_REGIONS]: universalRegions,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_OPACITY]: zoneDividerOpacity,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_TOP_LENGTH]: zoneDividerLengths.topLengthPx,
    [STORAGE_KEY_SERVER_CONTROL_ZONE_DIVIDER_BOTTOM_LENGTH]: zoneDividerLengths.bottomLengthPx,
    [STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES]: taskTypeHighlightRules,
    [STORAGE_KEY_HIGHLIGHT_RULES]: highlightState.rules,
    [STORAGE_KEY_CHAT_PROCESSING_QUEUE]: normalizeChatProcessingQueue(highlightState.chatProcessingQueue),
  };

  const syncStorageSettings = {
    [STORAGE_KEY_START_PAGE_URL]: buildProjectStartPageUrl(activeProjectId),
    [STORAGE_KEY_PROJECT_IDS]: searchProjectIds.length > 0 ? searchProjectIds : [DEFAULT_PROJECT_ID],
    [STORAGE_KEY_ACTIVE_PROJECT_ID]: activeProjectId,
    [STORAGE_KEY_ACTIVE_BRIDGE_TASK_TYPE]: highlightState.activeBridgeTaskType,
    [STORAGE_KEY_TASK_TYPE_PROJECT_IDS]: taskTypeProjectIds,
    [STORAGE_KEY_TASK_TYPE_ACTIVE_PROJECT_ACCOUNTS]: taskTypeActiveProjectAccounts,
    [STORAGE_KEY_RESET_LIMIT]: resetLimit,
    [STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE]: multiScreenshotBatchSize,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLORS]: taskTypeTocButtonColors,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_SETTINGS]: taskTypeTocButtonSettings,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_LABELS]: taskTypeTocButtonLabels,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_BUTTON_ORDER]: taskTypeTocButtonOrder,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_POSITIONS]: taskTypeTocColumnPositions,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_OPACITY]: taskTypeTocColumnOpacity,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_COLUMN_SCALE]: taskTypeTocColumnScale,
    [STORAGE_KEY_TASK_TYPE_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: taskTypeLatestPromptScrollHoldSeconds,
    [STORAGE_KEY_TASK_TYPE_ANALYSIS_TOC_ENTRIES]: highlightState.taskTypeTocEntries,
    [STORAGE_KEY_ANALYSIS_TOC_COLORS]: tocButtonColors,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_SETTINGS]: tocButtonSettings,
    [STORAGE_KEY_ANALYSIS_TOC_LABELS]: tocButtonLabels,
    [STORAGE_KEY_ANALYSIS_TOC_BUTTON_ORDER]: tocButtonOrder,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_POSITIONS]: tocColumnPositions,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_OPACITY]: tocColumnOpacity,
    [STORAGE_KEY_ANALYSIS_TOC_COLUMN_SCALE]: tocColumnScale,
    [STORAGE_KEY_LATEST_PROMPT_SCROLL_HOLD_SECONDS]: latestPromptScrollHoldSeconds,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_COLORS]: statusLogColors,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_MESSAGES]: statusLogMessages,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_IDLE_OPACITY]: statusLogIdleOpacity,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_WIDTH]: statusLogWidthPx,
    [STORAGE_KEY_SERVER_CONTROL_STATUS_LOG_LEFT]: statusLogLeftPx,
  };

  await chrome.storage.local.set(localStorageSettings);
  await chrome.storage.sync.set(syncStorageSettings);
  await chrome.storage.sync.remove([
    STORAGE_KEY_TASK_TYPE_HIGHLIGHT_RULES,
    STORAGE_KEY_HIGHLIGHT_RULES,
  ]);

  highlightState.taskTypeProjectIds = taskTypeProjectIds;
  highlightState.taskTypeActiveProjectAccounts = taskTypeActiveProjectAccounts;
  highlightState.taskTypeHighlightRules = taskTypeHighlightRules;
  highlightState.taskTypeTocButtonColors = taskTypeTocButtonColors;
  highlightState.taskTypeTocButtonSettings = taskTypeTocButtonSettings;
  highlightState.taskTypeTocButtonLabels = taskTypeTocButtonLabels;
  highlightState.taskTypeTocButtonOrder = taskTypeTocButtonOrder;
  highlightState.taskTypeTocColumnPositions = taskTypeTocColumnPositions;
  highlightState.taskTypeTocColumnOpacity = taskTypeTocColumnOpacity;
  highlightState.taskTypeTocColumnScale = taskTypeTocColumnScale;
  highlightState.taskTypeLatestPromptScrollHoldSeconds = taskTypeLatestPromptScrollHoldSeconds;
  highlightState.taskTypeTocEntries = sanitizeTaskTypeAnalysisTocEntriesMap(highlightState.taskTypeTocEntries);
  highlightState.multiScreenshotBatchSize = multiScreenshotBatchSize;
  highlightState.tocButtonColors = tocButtonColors;
  highlightState.tocButtonSettings = tocButtonSettings;
  highlightState.tocButtonLabels = tocButtonLabels;
  highlightState.tocButtonOrder = tocButtonOrder;
  highlightState.tocColumnPositions = tocColumnPositions;
  highlightState.tocColumnOpacity = tocColumnOpacity;
  highlightState.tocColumnScale = tocColumnScale;
  highlightState.latestPromptScrollHoldSeconds = latestPromptScrollHoldSeconds;
  highlightState.statusLogColors = statusLogColors;
  highlightState.statusLogMessages = statusLogMessages;
  highlightState.statusLogIdleOpacity = statusLogIdleOpacity;
  highlightState.statusLogWidthPx = statusLogWidthPx;
  highlightState.statusLogLeftPx = statusLogLeftPx;
  highlightState.chatProcessingQueue = localStorageSettings[STORAGE_KEY_CHAT_PROCESSING_QUEUE];
  setServerControlZoneDividerOpacityInput(highlightState.zoneDividerOpacity);
  setServerControlStatusLogIdleOpacityInput(highlightState.statusLogIdleOpacity);
  setServerControlStatusLogWidthInput(highlightState.statusLogWidthPx);
  setServerControlStatusLogLeftInput(highlightState.statusLogLeftPx);
  setServerControlZoneDividerLengthInputs(
    highlightState.zoneDividerTopLengthPx,
    highlightState.zoneDividerBottomLengthPx,
  );
  document.querySelector("#reset-limit").value = String(resetLimit);
  setMultiScreenshotBatchSizeInput(highlightState.multiScreenshotBatchSize);
  renderTaskTypeProjectIds();
  renderServerControlStatusLogColorSettings();
  renderServerControlStatusLogMessageSettings();
  setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
  setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
  setAnalysisTocColumnScaleInputs(highlightState.tocColumnScale);
  setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  renderAnalysisTocColumnSettingsCopyControl();
  renderAnalysisTocSettings();
  renderChatProcessingQueue();
  try {
    const syncResult = await pushSettingsSnapshotToBridge(
      createSettingsSyncSnapshot(localStorageSettings, syncStorageSettings),
    );
    setStatus(syncResult.path
      ? `Settings saved and synced to bridge file: ${syncResult.path}`
      : "Settings saved and synced to bridge.");
    renderSettingsSyncDiffState([]);
  } catch (error) {
    console.warn("Local Query Bridge settings were saved locally but not synced to the bridge", error);
    setStatus(`Settings saved locally, but bridge sync failed: ${error}`);
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  const changedKeys = Object.keys(changes);
  if (
    (areaName === "local" && changedKeys.some((key) => SETTINGS_SYNC_LOCAL_KEY_SET.has(key)))
    || (areaName === "sync" && changedKeys.some((key) => SETTINGS_SYNC_SYNC_KEY_SET.has(key)))
  ) {
    scheduleSettingsSyncDiffRefresh();
  }

  if (areaName === "sync" && changes[STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE]) {
    highlightState.multiScreenshotBatchSize = sanitizeMultiScreenshotBatchSize(
      changes[STORAGE_KEY_MULTI_SCREENSHOT_BATCH_SIZE].newValue,
    );
    setMultiScreenshotBatchSizeInput(highlightState.multiScreenshotBatchSize);
  }

  if (areaName !== "local") {
    return;
  }

  if (changes[STORAGE_KEY_BRIDGE_NEXT_COVER_TRAFFIC_AT]) {
    trafficHistoryState.nextCoverTrafficAt = Number.parseInt(
      `${changes[STORAGE_KEY_BRIDGE_NEXT_COVER_TRAFFIC_AT].newValue ?? 0}`,
      10,
    ) || 0;
    renderTrafficHistory();
  }

  if (changes[STORAGE_KEY_BRIDGE_TRAFFIC_HISTORY]) {
    const samples = changes[STORAGE_KEY_BRIDGE_TRAFFIC_HISTORY].newValue;
    trafficHistoryState.samples = mergeTrafficSamples(samples);
    trafficHistoryState.loadedAt = Date.now();
    renderTrafficHistory();
  }

  if (changes[STORAGE_KEY_CHAT_PROCESSING_QUEUE]) {
    highlightState.chatProcessingQueue = normalizeChatProcessingQueue(
      changes[STORAGE_KEY_CHAT_PROCESSING_QUEUE].newValue,
    );
    renderChatProcessingQueue();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#options-form");
  const syncSettingsButton = document.querySelector("#sync-settings");
  const saveRuleButton = document.querySelector("#save-highlight-rule");
  const clearRuleButton = document.querySelector("#clear-highlight-rule");
  const pasteHighlightMatchesButton = document.querySelector("#paste-highlight-rule-matches");
  const pasteHighlightCompanionsButton = document.querySelector("#paste-highlight-rule-companions");
  const highlightColorInput = document.querySelector("#highlight-rule-color");
  const highlightHexInput = document.querySelector("#highlight-rule-color-hex");
  const addTaskTypeButton = document.querySelector("#add-task-type");
  const deleteTaskTypeButton = document.querySelector("#delete-task-type");
  const taskTypeLabelInput = document.querySelector("#task-type-label");
  const taskTypePromptInput = document.querySelector("#task-type-boilerplate-prompt");
  const taskTypeChatProcessingPromptInput = document.querySelector("#task-type-chat-processing-prompt");
  const taskTypeChatAbstractionPromptInput = document.querySelector("#task-type-chat-abstraction-prompt");
  const taskTypeAdditionalContextPromptInput = document.querySelector("#task-type-additional-context-prompt");
  const taskTypeMultiScreenshotBatchPromptInput = document.querySelector("#task-type-multi-screenshot-batch-prompt");
  const requireSearchChipToggle = document.querySelector("#task-type-require-search-chip");
  const addOcrRegionButton = document.querySelector("#add-ocr-region");
  const addCustomTocEntryButton = document.querySelector("#add-custom-toc-entry");
  const tocPositionInputs = [
    document.querySelector("#analysis-toc-left-x"),
    document.querySelector("#analysis-toc-right-inset"),
  ];
  const tocOpacityInputs = [
    document.querySelector("#analysis-toc-left-opacity"),
    document.querySelector("#analysis-toc-right-opacity"),
  ];
  const tocColumnSettingsCopySource = document.querySelector("#analysis-toc-column-settings-copy-source");
  const copyTocColumnSettingsButton = document.querySelector("#copy-analysis-toc-column-settings");
  const tocLeftScaleInput = document.querySelector("#analysis-toc-left-scale");
  const tocRightScaleInput = document.querySelector("#analysis-toc-right-scale");
  const latestPromptScrollHoldInput = document.querySelector("#latest-prompt-scroll-hold-seconds");
  const multiScreenshotBatchSizeInput = document.querySelector("#multi-screenshot-batch-size");
  const zoneDividerOpacityInput = document.querySelector("#server-control-zone-divider-opacity");
  const statusLogIdleOpacityInput = document.querySelector("#server-control-status-log-idle-opacity");
  const statusLogWidthInput = document.querySelector("#server-control-status-log-width");
  const statusLogLeftInput = document.querySelector("#server-control-status-log-left");
  const zoneDividerTopLengthInput = document.querySelector("#server-control-zone-divider-top-length");
  const zoneDividerBottomLengthInput = document.querySelector("#server-control-zone-divider-bottom-length");
  const refreshTrafficButton = document.querySelector("#refresh-traffic-history");
  const clearTrafficButton = document.querySelector("#clear-traffic-history");

  initializeOptionsTabs();
  void loadOptions();
  window.setInterval(() => {
    void refreshSettingsSyncDiffCount();
  }, SETTINGS_SYNC_DIFF_REFRESH_INTERVAL_MS);
  bindColorControl(highlightColorInput, highlightHexInput, "#facc15");
  form.addEventListener("submit", (event) => {
    void saveOptions(event);
  });
  syncSettingsButton?.addEventListener("click", () => {
    void syncSettingsFromBridge();
  });
  refreshTrafficButton?.addEventListener("click", () => {
    void loadTrafficHistory();
  });
  clearTrafficButton?.addEventListener("click", () => {
    void clearTrafficHistory();
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
    setStatus("Task type label changed. Save settings to apply it.");
  });
  taskTypePromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Boilerplate prompt changed. Save settings to apply it.");
  });
  taskTypeChatProcessingPromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Chat processing prompt changed. Save settings to apply it.");
  });
  taskTypeChatAbstractionPromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Abstraction level prompt changed. Save settings to apply it.");
  });
  taskTypeAdditionalContextPromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Additional context prompt changed. Save settings to apply it.");
  });
  taskTypeMultiScreenshotBatchPromptInput?.addEventListener("input", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Multi-screenshot batch prompt changed. Save settings to apply it.");
  });
  requireSearchChipToggle?.addEventListener("change", () => {
    syncTaskTypeDefinitionEditorValues();
    setStatus("Search chip requirement changed. Save settings to apply it.");
  });
  addOcrRegionButton?.addEventListener("click", () => {
    addOcrRegionToActiveTaskType();
  });
  addCustomTocEntryButton?.addEventListener("click", () => {
    addCustomAnalysisTocEntry();
  });
  for (const input of tocPositionInputs) {
    input?.addEventListener("input", () => {
      highlightState.tocColumnPositions = getAnalysisTocColumnPositionInputValues();
      setStatus("TOC column position changed for this task type. Save settings to apply it.");
    });
    input?.addEventListener("blur", () => {
      highlightState.tocColumnPositions = getAnalysisTocColumnPositionInputValues();
      setAnalysisTocColumnPositionInputs(highlightState.tocColumnPositions);
    });
  }
  for (const input of tocOpacityInputs) {
    input?.addEventListener("input", () => {
      highlightState.tocColumnOpacity = getAnalysisTocColumnOpacityInputValues();
      setStatus("TOC column opacity changed for this task type. Save settings to apply it.");
    });
    input?.addEventListener("blur", () => {
      highlightState.tocColumnOpacity = getAnalysisTocColumnOpacityInputValues();
      setAnalysisTocColumnOpacityInputs(highlightState.tocColumnOpacity);
    });
  }
  tocColumnSettingsCopySource?.addEventListener("change", () => {
    if (copyTocColumnSettingsButton instanceof HTMLButtonElement) {
      copyTocColumnSettingsButton.disabled = !(tocColumnSettingsCopySource instanceof HTMLSelectElement && tocColumnSettingsCopySource.value);
    }
  });
  copyTocColumnSettingsButton?.addEventListener("click", () => {
    if (!(tocColumnSettingsCopySource instanceof HTMLSelectElement) || !tocColumnSettingsCopySource.value) {
      return;
    }

    copyAnalysisTocColumnSettingsFromTaskType(tocColumnSettingsCopySource.value);
  });
  for (const input of [tocLeftScaleInput, tocRightScaleInput]) {
    input?.addEventListener("input", () => {
      highlightState.tocColumnScale = getAnalysisTocColumnScaleInputValues();
      setStatus("TOC column scale changed for this task type. Save settings to apply it.");
    });
    input?.addEventListener("blur", () => {
      highlightState.tocColumnScale = getAnalysisTocColumnScaleInputValues();
      setAnalysisTocColumnScaleInputs(highlightState.tocColumnScale);
    });
  }
  latestPromptScrollHoldInput?.addEventListener("input", () => {
    highlightState.latestPromptScrollHoldSeconds = getLatestPromptScrollHoldSecondsInputValue();
    setStatus("Latest prompt re-check window changed for this task type. Save settings to apply it.");
  });
  latestPromptScrollHoldInput?.addEventListener("blur", () => {
    highlightState.latestPromptScrollHoldSeconds = getLatestPromptScrollHoldSecondsInputValue();
    setLatestPromptScrollHoldSecondsInput(highlightState.latestPromptScrollHoldSeconds);
  });
  multiScreenshotBatchSizeInput?.addEventListener("input", () => {
    highlightState.multiScreenshotBatchSize = getMultiScreenshotBatchSizeInputValue();
    setStatus("Multi-screenshot batch size changed. Save settings to apply it.");
  });
  multiScreenshotBatchSizeInput?.addEventListener("blur", () => {
    highlightState.multiScreenshotBatchSize = getMultiScreenshotBatchSizeInputValue();
    setMultiScreenshotBatchSizeInput(highlightState.multiScreenshotBatchSize);
  });
  zoneDividerOpacityInput?.addEventListener("input", () => {
    highlightState.zoneDividerOpacity = getServerControlZoneDividerOpacityInputValue();
    setServerControlZoneDividerOpacityInput(highlightState.zoneDividerOpacity);
    setStatus("Zone divider translucence changed. Save settings to apply it.");
  });
  statusLogIdleOpacityInput?.addEventListener("input", () => {
    highlightState.statusLogIdleOpacity = getServerControlStatusLogIdleOpacityInputValue();
    setServerControlStatusLogIdleOpacityInput(highlightState.statusLogIdleOpacity);
    setStatus("Status log idle opacity changed. Save settings to apply it.");
  });
  statusLogWidthInput?.addEventListener("input", () => {
    highlightState.statusLogWidthPx = getServerControlStatusLogWidthInputValue();
    setServerControlStatusLogWidthInput(highlightState.statusLogWidthPx);
    setStatus("Status log width changed. Save settings to apply it.");
  });
  statusLogLeftInput?.addEventListener("input", () => {
    highlightState.statusLogLeftPx = getServerControlStatusLogLeftInputValue();
    setServerControlStatusLogLeftInput(highlightState.statusLogLeftPx);
    setStatus("Status log horizontal position changed. Save settings to apply it.");
  });
  for (const input of [zoneDividerTopLengthInput, zoneDividerBottomLengthInput]) {
    input?.addEventListener("input", () => {
      const values = getServerControlZoneDividerLengthInputValues();
      highlightState.zoneDividerTopLengthPx = values.topLengthPx;
      highlightState.zoneDividerBottomLengthPx = values.bottomLengthPx;
      setServerControlZoneDividerLengthInputs(
        highlightState.zoneDividerTopLengthPx,
        highlightState.zoneDividerBottomLengthPx,
      );
      setStatus("Zone divider length changed. Save settings to apply it.");
    });
  }
  saveRuleButton.addEventListener("click", () => {
    void upsertHighlightRule();
  });
  clearRuleButton.addEventListener("click", () => {
    clearRuleForm();
    setStatus("Ready for a new rule.");
  });
  for (const button of document.querySelectorAll("[data-highlight-line-command]")) {
    button.addEventListener("click", () => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      applyHighlightLineIndicator(
        button.dataset.highlightLineTarget,
        button.dataset.highlightLineCommand,
        button.dataset.highlightLineField || "Highlight",
      );
    });
  }
  pasteHighlightMatchesButton?.addEventListener("click", () => {
    void pasteClipboardAsNewTextareaLine("#highlight-rule-matches", "Matched strings");
  });
  pasteHighlightCompanionsButton?.addEventListener("click", () => {
    void pasteClipboardAsNewTextareaLine("#highlight-rule-companions", "Adjacent terms");
  });
});
