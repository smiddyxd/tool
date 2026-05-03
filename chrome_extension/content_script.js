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
  const RATING_SCROLL_BUTTON_ID = "local-query-bridge-rating-scroll-button";
  const RATING_SCROLL_STYLE_ID = "local-query-bridge-rating-scroll-styles";
  const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
  const ANALYSIS_TOC_BUTTON_CLASS = "local-query-bridge-analysis-toc-button";
  const ANALYSIS_TOC_BUTTON_ACTIVE_CLASS = "local-query-bridge-analysis-toc-button-active";
  const ANALYSIS_TOC_STYLE_ID = "local-query-bridge-analysis-toc-styles";
  const ANALYSIS_TOC_GAP_PX = 30;
  const DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR = "#2563eb";
  const STORAGE_KEY_ANALYSIS_TOC_COLORS = "analysisTocButtonColors";
  const STORAGE_KEY_HIGHLIGHT_RULES = "highlightRules";
  const HIGHLIGHT_CLASS = "local-query-bridge-highlight";
  const HIGHLIGHT_STYLE_ID = "local-query-bridge-highlight-styles";
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
    nextHeadingIndex: 0,
    buttonColors: {},
  };

  const hotkeyState = {
    enabled: false,
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
    key: normalizeAnalysisHeadingText(entry.heading),
    heading: entry.heading,
    label: entry.label,
    index,
  }));

  function normalizeAnalysisHeadingText(value) {
    return (typeof value === "string" ? value : "")
      .replace(/^\s*#+\s*/, "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .replace(/[:.]+$/g, "")
      .trim()
      .toLocaleLowerCase();
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

  function getAnalysisTocButtonColor(headingKey) {
    return analysisTocState.buttonColors[headingKey] ?? DEFAULT_ANALYSIS_TOC_ACTIVE_COLOR;
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
    const targetTermEntries = compileTermEntries(matchStrings);

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
      label: typeof rawRule?.label === "string" && rawRule.label.trim() ? rawRule.label.trim() : matchStrings[0],
      color,
      textColor: getReadableTextColor(color),
      enabled: rawRule?.enabled !== false,
      targetTermEntries,
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

      for (const targetEntry of rule.targetTermEntries) {
        for (const targetMatch of collectTermEntryMatches(text, tokens, targetEntry)) {
          const relatedMatches = collectAdjacentHighlightMatches(
            text,
            tokens,
            targetMatch,
            rule.companionTermEntries,
            rule.companionDistance,
          );

          relatedMatches.forEach((relatedMatch) => {
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
    const stored = await chrome.storage.sync.get({
      [STORAGE_KEY_HIGHLIGHT_RULES]: null,
      [STORAGE_KEY_ANALYSIS_TOC_COLORS]: null,
    });

    highlightState.rules = compileHighlightRules(stored[STORAGE_KEY_HIGHLIGHT_RULES]);
    analysisTocState.buttonColors = sanitizeAnalysisTocButtonColors(stored[STORAGE_KEY_ANALYSIS_TOC_COLORS]);
    applyAnalysisTocButtonColors();
    scheduleHighlightPass();
  }

  function initializeHighlighting() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync") {
        return;
      }

      if (changes[STORAGE_KEY_HIGHLIGHT_RULES]) {
        highlightState.rules = compileHighlightRules(changes[STORAGE_KEY_HIGHLIGHT_RULES].newValue);
        scheduleHighlightPass();
      }

      if (changes[STORAGE_KEY_ANALYSIS_TOC_COLORS]) {
        analysisTocState.buttonColors = sanitizeAnalysisTocButtonColors(changes[STORAGE_KEY_ANALYSIS_TOC_COLORS].newValue);
        applyAnalysisTocButtonColors();
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

  function getAssistantMessages() {
    return Array.from(document.querySelectorAll(ASSISTANT_MESSAGE_SELECTOR))
      .filter((element) => element instanceof HTMLElement);
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
        left: 224px;
        z-index: 2147483647;
        transform: translateY(-50%);
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
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}:hover {
        background: #1e293b;
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}.${ANALYSIS_TOC_BUTTON_ACTIVE_CLASS} {
        border-color: rgba(37, 99, 235, 0.35);
        background: var(--local-query-bridge-analysis-active-color, #2563eb);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}.${ANALYSIS_TOC_BUTTON_ACTIVE_CLASS}:hover {
        filter: brightness(0.92);
      }

      .${ANALYSIS_TOC_BUTTON_CLASS}:focus {
        outline: 3px solid rgba(15, 23, 42, 0.2);
        outline-offset: 2px;
      }
    `;
    document.documentElement.append(style);
  }

  function getAnalysisTocButton(headingKey) {
    return Array.from(document.querySelectorAll(`.${ANALYSIS_TOC_BUTTON_CLASS}`))
      .find((button) => button instanceof HTMLButtonElement && button.dataset.headingKey === headingKey) ?? null;
  }

  function setAnalysisTocButtonActive(headingKey, isActive) {
    const button = getAnalysisTocButton(headingKey);
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.style.setProperty("--local-query-bridge-analysis-active-color", getAnalysisTocButtonColor(headingKey));
    button.classList.toggle(ANALYSIS_TOC_BUTTON_ACTIVE_CLASS, Boolean(isActive));
  }

  function applyAnalysisTocButtonColors() {
    for (const headingEntry of ANALYSIS_HEADING_ENTRIES) {
      const button = getAnalysisTocButton(headingEntry.key);
      if (button instanceof HTMLButtonElement) {
        button.style.setProperty("--local-query-bridge-analysis-active-color", getAnalysisTocButtonColor(headingEntry.key));
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
    for (const headingEntry of ANALYSIS_HEADING_ENTRIES) {
      if (getAnalysisTocButton(headingEntry.key) instanceof HTMLButtonElement) {
        continue;
      }

      const button = document.createElement("button");
      const offsetPx = (headingEntry.index - ((ANALYSIS_SECTION_HEADINGS.length - 1) / 2)) * ANALYSIS_TOC_GAP_PX;
      button.className = ANALYSIS_TOC_BUTTON_CLASS;
      button.type = "button";
      button.textContent = headingEntry.label;
      button.title = headingEntry.label;
      button.dataset.headingKey = headingEntry.key;
      button.style.top = `calc(50% + ${offsetPx}px)`;
      button.style.setProperty("--local-query-bridge-analysis-active-color", getAnalysisTocButtonColor(headingEntry.key));
      button.addEventListener("click", () => {
        void scrollToAnalysisHeading(headingEntry.key);
      });
      document.body.append(button);
    }
  }

  function initializeAnalysisTocButtons() {
    if (document.body) {
      ensureAnalysisTocButtons();
      return;
    }

    document.addEventListener("DOMContentLoaded", ensureAnalysisTocButtons, { once: true });
  }

  function resetAnalysisTocForRun(runId, baselineAssistantCount, baselineHeadingCounts) {
    analysisTocState.currentRunId = runId;
    analysisTocState.baselineAssistantCount = baselineAssistantCount;
    analysisTocState.currentAssistantElement = null;
    analysisTocState.baselineHeadingCounts = baselineHeadingCounts;
    analysisTocState.nextHeadingIndex = 0;
    ensureAnalysisTocButtons();
    resetAnalysisTocButtonStates();
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

  function getAnalysisHeadingCounts() {
    const counts = Object.fromEntries(
      ANALYSIS_HEADING_ENTRIES.map((entry) => [entry.key, 0]),
    );

    for (const headingElement of getAllAnalysisHeadingElements()) {
      const headingKey = normalizeAnalysisHeadingText(headingElement.textContent ?? "");
      if (Object.prototype.hasOwnProperty.call(counts, headingKey)) {
        counts[headingKey] += 1;
      }
    }

    return counts;
  }

  function findLatestAnalysisHeadingElement(headingKey) {
    const matches = getAllAnalysisHeadingElements()
      .filter((element) => normalizeAnalysisHeadingText(element.textContent ?? "") === headingKey);
    return matches[matches.length - 1] ?? null;
  }

  function scrollToAnalysisHeading(headingKey) {
    const headingElement = findLatestAnalysisHeadingElement(headingKey);
    if (!(headingElement instanceof HTMLElement)) {
      return false;
    }

    headingElement.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "auto",
    });
    return true;
  }

  function syncAnalysisHeadingCountsForRun(runId) {
    if (analysisTocState.currentRunId !== runId) {
      return;
    }

    const counts = getAnalysisHeadingCounts();
    const newlyDetectedHeadings = [];

    while (analysisTocState.nextHeadingIndex < ANALYSIS_HEADING_ENTRIES.length) {
      const headingEntry = ANALYSIS_HEADING_ENTRIES[analysisTocState.nextHeadingIndex];
      const baselineCount = analysisTocState.baselineHeadingCounts[headingEntry.key] ?? 0;
      const currentCount = counts[headingEntry.key] ?? 0;
      if (currentCount <= baselineCount) {
        break;
      }

      setAnalysisTocButtonActive(headingEntry.key, true);
      newlyDetectedHeadings.push(headingEntry);
      analysisTocState.nextHeadingIndex += 1;
    }

    if (newlyDetectedHeadings.length > 0) {
      refreshHighlightsNow();
      console.log("Local Query Bridge refreshed highlights for analysis heading count increase(s)", {
        runId,
        headings: newlyDetectedHeadings.map((heading) => heading.label),
      });
    }
  }

  function getNextAutoScrollTarget() {
    const targetText = normalizeSearchText(AUTO_SCROLL_TARGET_TEXT);
    const roots = analysisTocState.currentAssistantElement instanceof HTMLElement
      ? [analysisTocState.currentAssistantElement]
      : getAssistantMessages();
    const searchRoots = roots.length > 0
      ? roots
      : Array.from(document.getElementsByClassName(AUTO_SCROLL_MARKDOWN_CLASS));
    const candidates = searchRoots.flatMap((root) => Array.from(root.querySelectorAll("*"))).filter((element) => {
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

  function getAssistantRatingCount() {
    return Array.from(document.querySelectorAll(ASSISTANT_MESSAGE_SELECTOR))
      .reduce((total, element) => {
        const matches = element.textContent?.match(/Rating: /g);
        return total + (matches ? matches.length : 0);
      }, 0);
  }

  function ensureRatingScrollButtonStyles() {
    if (document.getElementById(RATING_SCROLL_STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = RATING_SCROLL_STYLE_ID;
    style.textContent = `
      #${RATING_SCROLL_BUTTON_ID} {
        position: fixed;
        right: 18px;
        top: 50%;
        z-index: 2147483647;
        transform: translateY(-50%);
        border: 1px solid rgba(37, 99, 235, 0.35);
        border-radius: 8px;
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
        cursor: pointer;
        font: 650 14px/1.2 "Segoe UI", system-ui, sans-serif;
        padding: 10px 14px;
      }

      #${RATING_SCROLL_BUTTON_ID}:hover {
        background: #1d4ed8;
      }

      #${RATING_SCROLL_BUTTON_ID}:focus {
        outline: 3px solid rgba(37, 99, 235, 0.25);
        outline-offset: 2px;
      }
    `;
    document.documentElement.append(style);
  }

  function hideRatingScrollButton() {
    document.getElementById(RATING_SCROLL_BUTTON_ID)?.remove();
  }

  function showRatingScrollButton() {
    ensureRatingScrollButtonStyles();
    let button = document.getElementById(RATING_SCROLL_BUTTON_ID);
    if (!(button instanceof HTMLButtonElement)) {
      button = document.createElement("button");
      button.id = RATING_SCROLL_BUTTON_ID;
      button.type = "button";
      button.textContent = "Rating";
      button.addEventListener("click", () => {
        if (scrollToNextPositionRationaleNow()) {
          hideRatingScrollButton();
        }
      });
      document.body.append(button);
    }
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

  async function watchResponseGenerationAndRatingButton(runId, baselineRatingCount, baselineAssistantCount) {
    const deadline = Date.now() + RESPONSE_COMPLETE_TIMEOUT_MS;
    let ratingButtonShown = false;
    let sawGenerating = false;

    console.log("Local Query Bridge watching response generation", {
      runId,
      baselineRatingCount,
      baselineAssistantCount,
    });
    while (Date.now() < deadline && autoScrollState.runId === runId) {
      const currentAssistantElement = getCurrentAssistantMessageForRun(baselineAssistantCount);
      if (currentAssistantElement instanceof HTMLElement) {
        analysisTocState.currentAssistantElement = currentAssistantElement;
      }

      syncAnalysisHeadingCountsForRun(runId);

      const ratingCount = getAssistantRatingCount();
      if (!ratingButtonShown && ratingCount > baselineRatingCount) {
        ratingButtonShown = true;
        showRatingScrollButton();
        console.log("Local Query Bridge showed rating scroll button", {
          runId,
          baselineRatingCount,
          ratingCount,
        });
      }

      if (isResponseGenerating()) {
        sawGenerating = true;
      } else if (sawGenerating && isResponseIdle()) {
        break;
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
    const baselineRatingCount = getAssistantRatingCount();
    const baselineAssistantCount = getAssistantMessages().length;
    const baselineHeadingCounts = getAnalysisHeadingCounts();
    hideRatingScrollButton();
    resetAnalysisTocForRun(runId, baselineAssistantCount, baselineHeadingCounts);
    void watchResponseGenerationAndRatingButton(runId, baselineRatingCount, baselineAssistantCount);
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

  initializeHighlighting();
  initializeAnalysisTocButtons();

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
    ).catch((error) => {
      console.error("Local Query Bridge submit failed", error);
    });

    return false;
  });
})();
