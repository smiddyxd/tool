# Sister Task Manual Transformation Prompt v2

Use this prompt to transform publisher-safety sister task manuals (for example Weight Loss, Get Rich Quick, Downloadable Utilities-style category tasks) into the same final structure as the finalized Downloadable Utilities manual while preserving official guidance and locally integrating unofficial notes/signals.

---

## Prompt

You are transforming a publisher-safety rating manual into the same structure and workflow style as the finalized Downloadable Utilities manual.

Inputs:
1. The source manual for the target task type.
2. Any existing unofficial notes, cheatsheets, inserted signals, annotations, or example notes already integrated into the source manual.
3. The finalized Downloadable Utilities manual as the formatting and workflow model, not as a source of category-specific rules.

Goal:
Create a clean final manual for the target task type that:
- preserves official guidance wording and category boundaries;
- keeps added/unofficial guidance clearly separated from official guidance;
- moves added guidance next to the official section it clarifies;
- adds concise per-task analysis instructions for screenshot/OCR workflows;
- produces the same output structure as the finalized Downloadable Utilities manual.

Core transformation rules:
- Preserve official guidance wording. Do not rewrite official policy language except for harmless formatting, heading normalization, or moving text without changing meaning.
- Treat blocks such as `[[START INSERTED CHEATSHEET: ...]]`, `[[START INSERTED SIGNALS: ...]]`, added parenthetical notes, and user-authored annotations as Added guidance unless the source clearly marks them as official.
- Do not import category-specific Downloadable Utilities rules into the new task type. Reuse only the structure, output format, source-label system, evidence discipline, and redundancy protocol.
- Do not invent new category scope. Added guidance may clarify indicators, ambiguity handling, visible-evidence use, and example interpretation, but must not expand the category beyond what the official manual supports.
- Preserve any category-specific official uncertainty posture. For example, if the official manual says suspicious-but-uncertain cases should be assumed positive, keep that as official guidance and reflect it in the task-analysis process. Do not replace it with a generic neutrality rule.

## Transformation process

### 1. Identify source layers

Classify each block as one of:
- Official guidance
- Existing Added guidance / cheatsheet / inserted signals
- Existing example note
- Review-only/editorial note, if any

Use these classifications to decide labels and placement. Do not treat unofficial signal blocks as official just because they are already integrated into the file.

### 2. Add source labels near the top

Add:

```md
## Source labels

- **Official guidance** = original task instructions and category guidance.
- **Added guidance** = supplemental guidance integrated into this manual to clarify practical application; it is part of this manual but not part of the original official guidance.
- **Non-manual indicators** = useful case-specific indicators not explicitly present anywhere in this manual; these may be mentioned in per-task output when relevant.
```

If the source manual has a warning/update note, keep it in the official section near the top.

### 3. Preserve official task structure

Keep official task setup, URL instruction, Unrateable reasons, comments/not-sure instructions, scope, topic definitions, positives, negatives, examples, and category-specific caveats intact.

Add `## Official guidance` headings where helpful so the boundary is visible. Do not rewrite official policy language into a new voice.

### 4. Move Added guidance locally

For each unofficial note, cheatsheet item, or inserted signal, move or rewrite it into the nearest relevant local Added guidance block:

- URL-related notes → after the official URL instruction.
- Unrateable-vs-uncertain notes → after official Unrateable / Not sure instructions.
- Scope shorthand → after the official scope definition.
- General signals → near the general scope/clue section.
- Topic/category-specific positive signals → immediately after the relevant official positive/canonical positive list.
- Topic/category-specific negative signals → immediately after the relevant official negative/canonical negative list.
- Example interpretation notes → directly after the relevant examples.
- Outlier/special-case notes → directly next to the example or scope section they clarify.

Do not create one detached mega-cheatsheet at the end.

### 5. Resolve redundancy

Use this redundancy protocol:

- Leave official guidance intact.
- Place added guidance next to the most relevant official passage.
- If unofficial notes duplicate each other, keep the more detailed version or the better-placed version.
- If useful overlapping notes exist in separate places, combine them into one local Added guidance block.
- If added guidance is partially redundant with official guidance but adds practical operational clarity, keep it and add a short parenthetical: `(partly redundant with: [brief TL;DR of the nearby official text])`.
- If added guidance is merely a restatement with no extra clarity, omit it.
- Remove old `[[START INSERTED ...]]` / `[[END INSERTED ...]]` wrappers only after preserving their substance in the appropriate local block.

### 6. Add universal evidence and ambiguity guidance

Add these sections when applicable, adjusting category names only:

```md
### Added guidance — URL evidence

A visible webpage URL can be sufficient evidence when it clearly points to the target category, even if the visible page or creative is sparse. Do not rely on the URL alone if its category implication is weak, generic, or contradicted by the visible content.
```

```md
### Added guidance — screenshot and OCR evidence discipline

Use only visible evidence from the screenshot or OCR text: visible text, visible URL, imagery, product name, CTA, page state, and visible branding. Do not assume what happens after clicking. Do not infer hidden landing-page behavior. If evidence is unclear, mark it unclear rather than inventing details.
```

```md
### Added guidance — Unrateable vs uncertain

- Unrateable means you cannot assess the content at all because it failed to load, is in the wrong language, is behind a login wall, has too little visible evidence, or otherwise cannot be interpreted.
- Uncertain means there is assessable content but classification is difficult; in that case, give your best rating and leave a brief comment.
- Do not use Unrateable as a fallback for ambiguous but assessable cases.
- If the official manual gives a category-specific uncertainty rule, apply that rule when choosing the best Yes/No rating.
```

### 7. Add a practical core test

After the official scope definition, add a short category-specific core test:

```md
### Added guidance — practical core test

Ask whether the visible content is related to [category-specific core inclusion test]. This is a shorthand for applying the official scope above, not a replacement for it.
```

Examples:

- Weight Loss: “Ask whether the visible content promotes weight loss or fat reduction through products, procedures, therapy, training, plans, advice, or related services.”
- Get Rich Quick: “Ask whether the visible content promotes unusually easy, fast, vague, suspicious, or highly remunerative money-making opportunities, including work-from-home schemes, lucrative secrets, MLM/pyramid-style structures, paid surveys, unrealistic trading/investment deals, or cash-reward apps covered by the manual.”

### 8. Add category-specific practical signals

Extract practical positive and negative signals from:
- official positives/negatives;
- existing cheatsheets / inserted signals;
- examples and “watch out for” notes;
- clear practical heuristics that do not expand the category.

Place them locally under the relevant section as:

```md
### Added guidance — practical positive signals for visible-evidence rating

• [signal]
• [signal]
```

```md
### Added guidance — practical negative signals for visible-evidence rating

• [signal]
• [signal]
```

Use parenthetical redundancy notes for useful overlaps:

```md
• explicit “lose weight,” “fat loss,” “fat reduction,” or “burn fat” wording (partly redundant with: official scope includes content intended to promote weight loss or fat reduction)
```

```md
• vague business opportunity plus high earnings claim (partly redundant with: official scope includes vague opportunities to make a lot of fast/easy money)
```

### 9. Handle official example notes and outliers

If an official example appears to diverge from the general category definition, add a narrow Added guidance note:

```md
### Added guidance — [special case] outlier

This example should be treated cautiously. By the main category definition, [why the example may not naturally fit]. However, because a similar canonical/example creative appears to be treated as positive, sufficiently similar cases may be rated Yes with a brief uncertainty comment.

Do not generalize this outlier. If the task is materially dissimilar from that example, return to the main manual rule: [category-specific main rule].
```

Do not generalize an outlier into a broad new rule.

### 10. Add the task analysis template at the end

Add:

```md
# Task analysis template

This section is the per-task analysis template the LLM should execute after reading the manual above. It structures the rating output.

## Task-analysis process

1. Identify what is visibly offered using only screenshot/OCR evidence.
2. Check whether the task is assessable at all. If not, rate Unrateable and briefly explain why.
3. If the task is assessable but classification is difficult, give the best Yes/No rating under the manual and add a brief uncertainty comment.
4. Do not use Unrateable as a fallback for ambiguous but assessable cases.
5. Sparse creatives can still be rateable if product name, visible URL, CTA, imagery, or branding provides enough evidence.
6. Apply any category-specific official uncertainty rule when choosing between Yes and No.
7. If an exception or outlier example seems relevant, apply it only to sufficiently similar cases and return to the main category definition otherwise.

## Per-task indicator extraction

For each task, list only indicators that actually apply to the visible content. Separate matching indicators by source:
- Official = directly present in original official guidance.
- Added = directly present in added guidance sections of this manual.
- Non-manual = useful practical indicators not explicitly present anywhere in this manual.

Use “None” in any indicator-table cell or Unrateable-indicator line where no matching indicator applies.

## Before-finalizing check

Before finalizing, check:
- Am I using Unrateable only because the task cannot be assessed at all?
- If I rated Yes, is there visible evidence that the content belongs to the target category under the manual?
- If I rated No, am I ignoring strong visible evidence that the content belongs to the target category?
- If the official manual gives an uncertainty-bias rule, did I apply it correctly?
- If an exception seems relevant, is this task sufficiently similar to the canonical/example exception?

## Output format

Task:
[what is visibly offered]

Evidence:
- [key visible text, URL, imagery, CTA]

Indicators:

| Source | Positive indicators | Negative indicators |
|---|---|---|
| Official | [...] | [...] |
| Added | [...] | [...] |
| Non-manual | [...] | [...] |

Unrateable indicators:
- Official: [...]
- Added: [...]
- Non-manual: [...]

Ambiguity:
[include only if genuinely needed; otherwise omit this section]

Rating: Yes / No / Unrateable
Confidence: Low / Medium / High
Comment: [include only if Unrateable or genuinely uncertain; otherwise omit this line]
```

### 11. Add the automation boilerplate

Add at the end or output separately:

```text
Apply the [TARGET TASK TYPE] manual from project context to this task input. The input may be an attached screenshot or OCR/labeled text. Execute the manual’s task analysis template. Use visible evidence only and do not assume hidden landing-page behavior.

Task input:
[OCR text or screenshot]
```

## Deliverables

Return:
1. The transformed manual as a clean Markdown document.
2. A separate automation boilerplate prompt as plain text.

Do not include a long change log in the final manual. Do not leave old inserted-cheatsheet wrappers in the final document. Preserve official wording and category boundaries.
