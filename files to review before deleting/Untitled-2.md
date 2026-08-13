**TLDR Context**

I have a Chrome extension that highlights configured keywords in ChatGPT responses. Each highlight rule can define:

- `label`
- `color`
- `matchStrings`
- optional `companionWords` that appear before the match and get included in the highlight
- `companionDistance`, where `0` means directly adjacent and `1` allows one word between
- punctuation and hyphens are ignored, so `mid-low poor`, `mid low poor`, and `mid-low-poor` can match naturally

Current defaults are:

- `egregious` = red
- `poor` = yellow
- `okay` = green
- `good` = blue
- `low`, `mid`, and `high` can be included before those words

**Prompt To Use**

```text
I’m configuring keyword highlight rules for a Chrome extension that highlights important terms in ChatGPT responses.

The extension supports rules with:
- label
- color
- matchStrings: exact words or phrases to highlight
- companionWords: words that may appear before a matched string and should be included in the highlight
- companionDistance: 0 means directly adjacent, 1 means one word can appear between, etc.
- punctuation and hyphens are ignored, so “mid-low poor”, “mid low poor”, and similar variants can be handled by the same rule

Current default rules are:
- egregious: red
- poor: yellow
- okay: green
- good: blue
- low/mid/high can appear before those terms and should be included in the highlight

I’m using this for analyzing search experience / product usefulness judgments. Please recommend a practical list of highlight rules that would help me quickly scan ChatGPT’s analysis for ratings, severity signals, quality judgments, usefulness judgments, uncertainty, and final recommendations.

For each rule, return:
- label
- suggested color
- matchStrings
- companionWords
- companionDistance
- short rationale

Avoid overly generic terms that would create too many false positives. Prefer terms that are likely to matter in evaluation output. Include the current defaults if they still make sense, but improve or expand them where useful.

Return the result as a table first, then as a JSON array I can copy into an extension config later.
```