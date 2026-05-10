# Universal Sister Task Manual Components v2

Reusable components for transforming publisher-safety category manuals into the same final style as the Downloadable Utilities manual.

These are structural components only. They should not import Downloadable Utilities category rules into unrelated categories.

---

## 1. Top-of-manual framing

```md
# [Task Type] Manual — Final

This manual contains original task guidance plus added supplemental guidance. Added guidance is placed next to the most relevant official passage and is meant to clarify practical application, especially for screenshot/OCR-based rating workflows.

## Source labels

- **Official guidance** = original task instructions and category guidance.
- **Added guidance** = supplemental practical guidance added to clarify rating behavior.
- **Non-manual indicators** = useful case-specific indicators not explicitly listed in this manual; these may be mentioned in per-task output when relevant.
```

---

## 2. Added guidance — URL evidence

Place after the official URL instruction.

```md
### Added guidance — URL evidence

A visible webpage URL can be sufficient evidence when it clearly points to the target category, even if the visible page or creative is sparse. Do not rely on the URL alone if its category implication is weak, generic, or contradicted by the visible content.
```

---

## 3. Added guidance — screenshot and OCR evidence discipline

Place after task structure / URL / Unrateable instructions.

```md
### Added guidance — screenshot and OCR evidence discipline

Use only visible evidence from the screenshot or OCR text: visible text, visible URL, imagery, product name, CTA, page state, and visible branding. Do not assume what happens after clicking. Do not infer hidden landing-page behavior. If evidence is unclear, mark it unclear rather than inventing details.
```

---

## 4. Added guidance — Unrateable vs uncertain

Place after official Unrateable and Not sure instructions.

```md
### Added guidance — Unrateable vs uncertain

- Unrateable means you cannot assess the content at all because it failed to load, is in the wrong language, is behind a login wall, has too little visible evidence, or otherwise cannot be interpreted.
- Uncertain means there is assessable content but classification is difficult; in that case, give your best rating and leave a brief comment.
- Do not use Unrateable as a fallback for ambiguous but assessable cases.
- If the official manual gives a category-specific uncertainty rule, apply that rule when choosing the best Yes/No rating.
```

---

## 5. Practical core test

Place after official scope definition.

```md
### Added guidance — practical core test

Ask whether the visible content is related to [category-specific core inclusion test]. This is a shorthand for applying the official scope above, not a replacement for it.
```

Example — Weight Loss:

```md
Ask whether the visible content promotes weight loss or fat reduction through products, procedures, therapy, training, plans, advice, or related services. This is a shorthand for applying the official scope above, not a replacement for it.
```

Example — Get Rich Quick:

```md
Ask whether the visible content promotes unusually easy, fast, vague, suspicious, or highly remunerative money-making opportunities, including work-from-home schemes, lucrative secrets, MLM/pyramid-style structures, paid surveys, unrealistic trading/investment deals, or cash-reward apps covered by the manual. This is a shorthand for applying the official scope above, not a replacement for it.
```

---

## 6. Practical positive / negative signals

Place after each official topic's positive and negative lists.

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

If a signal is partly redundant with nearby official guidance but adds operational clarity, add:

```md
(partly redundant with: [short TL;DR of previous official text])
```

Examples:

```md
• explicit “lose weight,” “fat loss,” “fat reduction,” or “burn fat” wording (partly redundant with: official scope includes content intended to promote weight loss or fat reduction)
```

```md
• high earnings claim with vague opportunity details (partly redundant with: official scope includes vague opportunities to make fast/easy money)
```

---

## 7. Category-specific official uncertainty rules

Some manuals contain official uncertainty-bias rules. Preserve these locally and reflect them in the task template.

Example pattern:

```md
### Added guidance — applying uncertainty rule

When content is assessable but classification is difficult, first apply the official category-specific uncertainty rule, if one exists. Do not use Unrateable for assessable ambiguity.
```

For Get Rich Quick-style manuals, if official guidance says suspicious/scammy but uncertain cases should be assumed positive, keep that rule as official and include it in the before-finalizing check.

---

## 8. Special-case / outlier note

Use only when an official example appears to diverge from the general category definition.

```md
### Added guidance — [special case] outlier

This example should be treated cautiously. By the main category definition, [why the example may not naturally fit]. However, because a similar canonical/example creative appears to be treated as positive, sufficiently similar cases may be rated Yes with a brief uncertainty comment.

Do not generalize this outlier. If the task is materially dissimilar from that example, return to the main manual rule: [category-specific main rule].
```

---

## 9. Task analysis template

Place near the end of the manual.

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
- Official = directly present in official guidance.
- Added = present in the added guidance sections of this manual.
- Non-manual = useful practical indicators not explicitly present in the manual; these may support reasoning but must not override the manual.

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

---

## 10. Automation boilerplate

Place at the end of the manual or keep as a separate prompt file.

```text
Apply the [Task Type] manual from project context to this task input. The input may be an attached screenshot or OCR/labeled text. Execute the manual’s task analysis template. Use visible evidence only and do not assume hidden landing-page behavior.

Task input:
[OCR text or screenshot]
```

---

## 11. Redundancy-resolution protocol

Use while transforming manuals with existing cheatsheets, inserted signals, or notes.

```md
Redundancy-resolution protocol:
- Leave official guidance intact.
- Place added guidance next to the most relevant official passage.
- If unofficial notes duplicate each other, keep the more detailed version or the better-placed version.
- If useful overlapping notes exist in separate places, combine them into one local Added guidance block.
- If added guidance is partly redundant with official guidance but useful, keep it and add a parenthetical note: “partly redundant with: [TL;DR summary of previous official text]”.
- If added guidance is merely a restatement with no practical clarity, omit it.
- Remove old duplicate cheatsheet/signal wrappers only after preserving their substance in the appropriate location.
```
