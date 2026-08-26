# Video Games Chat Processing Framework

Use this file after a Video Games rating chat has been completed and its abstraction decision has been approved.

This framework does not rate the task, select or revise the abstraction frame, or supply operational prompts. Its job is to convert the completed chat and user-approved abstraction handoff into clear integration results for:

1. `video_games_manual.md`
2. `rating_comment_style_and_phrase_guide(1).md`

The governing contract is **integration result / no insertion**. Processing a chat does not create a presumption that either project document must change.

The manual stores reusable classification reasoning. The comment guide stores signed-off reusable wording. Keep those functions separate.

---

## 1. Required Inputs

Process a chat only when these inputs are available:

- the completed rating chat;
- the task screenshot, screenshots, or faithful OCR/transcription;
- the final rating and final comment;
- the user-approved abstraction handoff from the separate abstraction-selection step;
- the current Video Games manual;
- the current rating comment style and phrase guide;
- any research already performed in the rating chat, with sources or enough detail to verify it.

If an input is incomplete, identify the gap instead of filling it with assumptions.

---

## 2. Verdict Anchor and Conflict Rule

Treat the final rating comment from the completed chat as the **verdict anchor**. The processing task is normally to preserve and generalize the reasoning that supported that verdict, not to reopen the rating from scratch.

Do not treat the anchor as infallible. If the screenshot, faithful transcription, or verified research materially contradicts the final verdict or the approved abstraction handoff:

1. state the conflict precisely;
2. identify which proposed integration it blocks;
3. stop short of encoding the conflict as reusable guidance; and
4. request review before supplying a final insertion-ready block for the affected document.

A minor wording imperfection that does not alter the rating logic is not a material conflict.

---

## 3. Core Separation and Integration-Result Rule

Every processed chat must return two separately labeled document-integration results, even if one or both recommend no insertion, followed by a processing record.

### Output A — Manual Integration Result

Target file: `video_games_manual.md`

Normal target section:

> Case-Derived Borderline Reasoning

The result must be one of:

1. **New case-derived node** — the case contributes a genuinely new reusable reasoning pattern.
2. **Edit or extension to existing manual material** — the case sharpens Added guidance or an existing case-derived node, adds a material variant, resolves an ambiguity, or supplies useful negative direction without requiring a separate node. Preserve Official guidance unchanged.
3. **No insertion recommended** — current Official guidance, Added guidance, or case-derived nodes already cover the reusable reasoning sufficiently; existing nodes jointly cover it; or the case is too idiosyncratic or uncertain to justify reusable material.

The manual result may contain:

- case type;
- final verdict anchor;
- visible evidence pattern;
- material research-resolved, unresolved, ambiguous, or conflicting findings;
- reusable inference;
- core reasoning path;
- decision shortcut;
- abandoned reasoning paths and negative direction;
- use and do-not-use boundaries;
- the relationship to existing guidance or nodes.

It must not become a polished comment template or general phrase bank.

### Output B — Comment-Guide Integration Result

Target file: `rating_comment_style_and_phrase_guide(1).md`

Normal target section:

> Signed-Off Video Games Comment Pattern Library

The result must be one of:

1. **New signed-off pattern or wording component** — the final comment contributes reusable wording with a sufficiently precise use condition.
2. **Edit or extension to an existing pattern** — a current pattern can absorb the useful template, sentence, clause, phrase structure, hedge, contrast, phrase, warning, or boundary note.
3. **No insertion recommended** — the wording is already covered, is too case-specific, is not actually signed off, or adds no reusable value.

The guide result may contain:

- a precise use condition;
- an approved base template;
- optional sentence, clause, phrase-structure, hedge, contrast, or phrase variants;
- phrases to use carefully;
- a short boundary note needed for safe adaptation.

It must not reproduce the full classification analysis.

### Independence of the two results

The two document results are independent. Valid outcomes include:

- insert into both documents;
- change the manual only;
- change the guide only;
- no insertion into either document.

Do not manufacture content merely to avoid a no-insertion result.

---

## 4. Screenshot/OCR and Research Grounding

Use the screenshot/OCR to identify the evidence actually present in the task and the main advertised product or page subject.

Keep three evidence layers distinct throughout processing:

- **Visible task evidence** — text, imagery, layout, advertiser identity, product name, URL, CTA, and other information present in the supplied task material.
- **Verified research** — externally confirmed identity, meaning, product, company, game, service, platform, promotion, or other property tied to something actually present in the task.
- **Inference** — the classification conclusion drawn from visible evidence and verified research.

Before extracting reusable guidance, enumerate and research every visible identity or meaning candidate that could materially affect the Video Games classification. This includes advertisers, brands, products, companies, developers, publishers, games, services, platforms, titles, slogans, acronyms, specialist terms, and ordinary-looking words or phrases with a plausible task-relevant secondary meaning. When uncertain whether a visible clue warrants research, research it.

Search the exact visible wording first and, when useful, test contextual variants or combinations with other visible clues, such as `[term] game`, `[term] app`, `[term] publisher`, `[term] advertiser`, or `[term] meaning`. Prefer authoritative primary sources, disambiguate same-named entities using the surrounding task context, and do not stop after one search formulation while another plausible identity or meaning remains unresolved.

Preserve verified findings that materially contributed to the completed rating, as well as material unresolved, ambiguous, or conflicting findings.

Do not treat researched identification of something visibly present as hidden landing-page behavior.

Do not preserve unsupported assumptions about unseen post-click content.

---

## 5. Using the Approved Abstraction Handoff

This framework does not select the abstraction frame. A separate pre-processing step proposes the abstraction and integration decisions, and the user supplies the approved handoff.

The handoff should identify:

- the verdict anchor;
- the manual-node frame;
- the decisive node-level conditions;
- supporting evidence;
- anchor-only details;
- the causal-condition removal result;
- the point at which further abstraction would become too broad;
- the reusable decision principle;
- the relationship to Official guidance, Added guidance, and existing case-derived nodes;
- the proposed manual integration direction;
- the reusable comment wording scope;
- the precise wording-use conditions;
- the relationship to existing guide patterns;
- the proposed guide integration direction;
- the visible-evidence, verified-research, and inference basis;
- material unresolved findings.

Use the approved handoff as controlling input. Do not independently broaden, narrow, replace, reselect, or otherwise revise its abstraction or integration decisions.

Review the current documents only to implement the approved directions accurately, identify the exact insertion or edit location, and avoid literal duplication. That review does not authorize a different abstraction frame or integration result.

If the handoff is ambiguous about a decision that would materially change the resulting insertion, identify the ambiguity for review. Do not guess.

If the source material, verified research, or current documents conflict materially with the handoff, apply the conflict rule in Section 2.

---

## 6. Implementing the Approved Integration Directions

### Manual direction

- If the approved result is a **new case-derived node**, format the approved reusable frame as a node without adding anchor-specific eligibility conditions.
- If the approved result is an **edit or extension**, identify the exact Added-guidance passage or case-derived node and provide only the replacement or additional text needed. Preserve Official guidance unchanged.
- If the approved result is **no insertion recommended**, identify the current guidance or nodes that already cover the reusable reasoning and return `None` as the insertion-ready material.
- If existing nodes jointly cover the case, record that approved synthesis as the reason for no insertion rather than creating a near-duplicate node.

Do not rerun the abstraction ladder, node ranking, causal-condition removal test, or new/edit/no-insertion selection. Those decisions belong to the approved abstraction handoff.

### Comment-guide direction

- Extract only the reusable wording authorized by the approved wording scope and precise use conditions.
- Review the existing signed-off library only to place the wording correctly, implement the approved edit, and avoid literal duplication.
- Reuse may occur at template, sentence, clause, phrase-structure, hedge, contrast, or individual-phrase level.
- Do not create a separate abstract comment principle merely to parallel a manual node.
- If the approved result is **no insertion recommended**, state why the existing library already covers the wording or why the final comment adds no safely reusable component, and return `None`.

If an intervening document change makes an approved insertion duplicative or impossible, flag the blocker. Do not silently substitute another integration result.

---

## 7. Manual Integration Formats

### New case-derived node

Use this structure:

```md
## Case Node: [Short reusable title]

### Case type
[Recurring borderline pattern stated without incidental anchor details.]

### Final verdict anchor
Rating: Yes / No / Unrateable

Final comment anchor:
> [Final signed-off comment, or a clearly labeled concise paraphrase.]

### Evidence / research pattern
- Visible: [...]
- Research-resolved: [...]
- Material unresolved, ambiguous, or conflicting finding: [None / ...]

### Core reasoning path
[Reusable path from visible evidence and any verified identity or meaning to the verdict.]

### Decision shortcut
[Compact rule taught by the case.]

### Abandoned reasoning paths / negative direction
- Do not [...]
- Avoid [...]
- [Rejected interpretation] was rejected because [...]

### Use this node when
- [...]

### Do not use this node when
- [...]
```

### Edit or extension

Identify:

- the exact manual section and existing Added-guidance passage or case node;
- whether the supplied text is a replacement or an addition;
- the exact text to insert or replace.

Do not reproduce unchanged surrounding material unless it is needed to make the edit unambiguous.

### No insertion

Identify the controlling existing guidance or nodes and explain briefly why they already cover the reusable reasoning, or why the case does not support transferable manual material. Use `None` as the insertion-ready material.

---

## 8. Comment-Guide Integration Formats

### New signed-off pattern or component

Use this structure when a complete new pattern is warranted:

```md
### [Pattern number and reusable title]

Use when [precise condition based on task evidence, including any materially relevant verified research].

Approved base template:
> [Signed-off reusable wording.]

Optional variants:
> [Variant.]

Phrases to use carefully:
- “[phrase]” — [why it needs care]

Notes:
- [Adaptation or boundary note.]
```

A new integration may instead contain only an approved sentence, clause, phrase structure, hedge, contrast, or phrase when that is the genuinely reusable contribution.

### Edit or extension

Identify the exact existing pattern and provide only the approved addition or replacement. State where it belongs, such as under `Approved base template`, `Optional variants`, `Phrases to use carefully`, or `Notes`.

### No insertion

Identify the existing pattern or general guide material that already covers the wording, or explain why the final comment adds no distinct and safely reusable component. Use `None` as the insertion-ready material.

---

## 9. Processing Workflow

1. Confirm that all required inputs are present.
2. Identify the final rating and final comment, and record them as the verdict anchor.
3. Extract visible task evidence without merging it with research or inference.
4. Enumerate and research every materially plausible visible identity or meaning candidate.
5. Preserve material resolved, unresolved, ambiguous, and conflicting research findings with enough provenance to verify them.
6. Compare the evidence and research with the verdict anchor and approved handoff. Flag any material conflict before drafting insertion-ready content.
7. Use the approved abstraction handoff as the controlling frame. Do not perform a new abstraction analysis or integration selection.
8. Review the current manual only to implement the approved manual direction, identify the exact target, and avoid literal duplication.
9. Extract the approved reasoning path, abandoned interpretations, negative direction, and use boundaries without adding unsupported conditions.
10. Format Output A as a new node, exact edit/extension, or explicit no-insertion result according to the handoff.
11. Review the signed-off comment-pattern library only to implement the approved guide direction and wording scope.
12. Format Output B as new wording, an exact edit/extension, or an explicit no-insertion result according to the handoff.
13. Create the processing record while keeping visible evidence, verified research, and inference distinct.
14. Run the quality checks in Section 12.

---

## 10. Required Integration-Result Contract

Return the result in this order.

### A. Manual integration result

- **Result:** New case-derived node / Edit or extension to existing manual material / No insertion recommended
- **Target:** Exact file, section, and existing Added-guidance passage or node if applicable
- **Basis:** Concise explanation tied to the approved handoff and current manual
- **Approved relationship to guidance/nodes:** Preserve the approved matches, fit levels, and Primary/Supporting/Contrast roles
- **Insertion-ready material:** Exact block or exact edit; write `None` for no insertion
- **Duplication/boundary note:** Why this result does not duplicate, overgeneralize, or distort existing guidance
- **Conflict flag:** None, or the precise conflict requiring review

### B. Comment-guide integration result

- **Result:** New signed-off pattern/component / Edit or extension / No insertion recommended
- **Target:** Exact file, section, and existing pattern if applicable
- **Basis:** Concise explanation tied to the approved wording scope and current guide
- **Approved wording scope and use conditions:** Preserve the approved component level and precise applicability boundary
- **Relationship to existing guide patterns:** Preserve the approved relationship and integration direction
- **Insertion-ready material:** Exact block or exact edit; write `None` for no insertion
- **Adaptation note:** What may be changed safely in future comments
- **Conflict flag:** None, or the precise conflict requiring review

### C. Processing record

- **Verdict anchor:** Rating and final comment
- **Visible evidence used:** [...]
- **Verified research and source basis used:** [...]
- **Material unresolved findings:** None / [...]
- **Inference preserved:** [...]
- **Approved abstraction handoff followed:** Yes / Blocked — explain the conflict or ambiguity; do not substitute a different frame

Do not replace a no-insertion recommendation with a speculative draft. `None` is the correct insertion-ready material when no document change is justified.

---

## 11. Example Integration Result

This real example shows one valid outcome: a completed chat whose separately approved abstraction called for a new manual node and a new comment pattern. It does not imply that every processed chat should change both documents.

### A. Manual integration result

- **Result:** New case-derived node
- **Target:** `video_games_manual.md` → `Case-Derived Borderline Reasoning`
- **Basis:** The approved abstraction identified a reusable distinction between a game-like digital component and the real-world activity to which it is subordinate.
- **Approved relationship to guidance/nodes:** At the time of integration, no existing node captured this decisive relationship directly.
- **Insertion-ready material:** The block below
- **Duplication/boundary note:** Trail, quiz, AR, QR-code, and smartphone details remain anchor evidence; eligibility turns on the subordinate relationship.
- **Conflict flag:** None

```md
## Case Node: Game-Like Digital Component Subordinate to a Real-World Activity

### Case type
A game-like digital component accompanies or structures a real-world activity but remains subordinate to that activity rather than being advertised as the main playable video game.

### Final verdict anchor
Rating: No

Final comment anchor:
> The main offer is an outdoor trail activity with a companion quiz app. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as part of a real-world trail experience rather than as a clear video game, I would rate it No.

### Evidence / research pattern
- Visible:
  - The offer is centered on a real-world trail or location-based activity.
  - The quiz/app element appears to accompany that activity.
  - The visible content does not clearly present the product as an online game, downloadable game, mobile game, video game, game platform, gameplay media, or game-development product.
- Research-resolved: No research finding materially contributed to the anchor verdict.
- Material unresolved, ambiguous, or conflicting finding: None.

### Core reasoning path
The quiz element is game-like, but the main advertised product in the anchor case is the real-world trail activity. More generally, a companion app, QR code, AR layer, quiz mechanic, or challenge mechanic is not enough by itself to make a real-world main activity a video game.

The decisive relationship is whether the digital component is the advertised video-game product or remains subordinate to a real-world main activity. If it is subordinate, rate the main activity outside Video Games unless visible evidence or verified research establishes the digital component itself as the covered video-game product.

### Decision shortcut
When a game-like digital component is subordinate to a real-world main activity, rate the main advertised product. Do not treat quiz wording, AR wording, QR codes, smartphone interaction, or a companion app as enough by themselves to make it a video game.

### Abandoned reasoning paths / negative direction
- Do not rate Yes just because the word “quiz” appears.
- Do not rate Yes just because the creative uses wording such as “challenge,” “trail,” “quizmaster,” “AR,” or “QR code.”
- Do not rate Yes just because a smartphone or app is involved.
- Do not over-rely on the phrase “standalone video game,” because some valid video games are not fully standalone. Prefer “clear video game” or “clearly framed as a video game.”
- Do not mark Unrateable if the product is assessable but borderline. Give the best Yes/No rating and explain uncertainty if needed.

### Use this node when
- The combined task evidence identifies a real-world activity as the main advertised product.
- A digital, interactive, or game-like component accompanies, structures, or supports that activity.
- The task evidence does not establish the digital component as the main playable video game.
- The rating turns on the subordinate relationship between the digital component and the real-world activity.

### Do not use this node when
- The combined task evidence clearly identifies a trivia video game, quiz game app, browser game, mobile game, downloadable game, or online game.
- The task evidence establishes the digital component itself as the main playable video-game product.
- The task evidence establishes gameplay, levels, missions, game characters, game currency, or other strong video-game framing.
- The combined task evidence identifies the page as video-game media, game reviews, walkthroughs, game downloads, in-game rewards, game retail, or game development.
```

### B. Comment-guide integration result

- **Result:** New signed-off pattern/component
- **Target:** `rating_comment_style_and_phrase_guide(1).md` → `Signed-Off Video Games Comment Pattern Library`
- **Basis:** The final comment supplied reusable wording for acknowledging a game-like companion while identifying the real-world activity as the main offer.
- **Approved wording scope and use conditions:** Complete pattern, usable only when the game-like component is subordinate to an identifiable real-world main activity.
- **Relationship to existing guide patterns:** At the time of integration, no existing pattern expressed this relationship directly.
- **Insertion-ready material:** The block below
- **Adaptation note:** Replace the real-world activity and companion-component terms with the task-specific evidence; do not import trail details into eligibility.
- **Conflict flag:** None

```md
### Real-world activity with game-like companion

Use when the combined task evidence identifies the main offer as a real-world activity, and the quiz/app/AR component appears supportive rather than the main video-game product.

Approved base template:
> The main offer is [real-world activity] with a companion [quiz/app] component. Since it is framed as [real-world activity] rather than a clear video game, I would rate it No.

Instruction-reference variant:
> The main offer is [real-world activity] with a companion [quiz/app] component. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as [real-world activity] rather than as a clear video game, I would rate it No.

Short variant:
> This uses some game-like [quiz/app/AR] wording, but the main offer appears to be [real-world activity] rather than a clear video game, so I would rate it No.

Phrases to use carefully:
- “standalone video game” — use carefully, because some valid games are not fully standalone.
- “game-like” — useful for ambiguity, but explain why the signal is or is not enough.
- “quiz” — do not imply quizzes are never games; focus on framing.

Notes:
- Use the instruction-reference variant when the borderline issue is specifically about whether quizzes are covered by the instructions.
- Use the shorter version when the visible evidence already makes the real-world framing clear.
```

### C. Processing record

- **Verdict anchor:** No — the outdoor trail remained the main offer and the companion quiz app was not clearly presented as a video game.
- **Visible evidence used:** Real-world trail framing, companion quiz/app references, and absence of clear video-game-product framing.
- **Verified research and source basis used:** None material to the anchor verdict.
- **Material unresolved findings:** None.
- **Inference preserved:** A game-like digital component does not control the classification when it remains subordinate to the identifiable real-world main activity.
- **Approved abstraction handoff followed:** Yes.

---

## 12. Quality Checks

Before finalizing, confirm:

- Did I confirm that every required input was available?
- Did I return both document-integration results and the processing record?
- Did I use an explicit no-insertion result with `None` where appropriate?
- Did I keep manual reasoning separate from reusable comment wording?
- Did I preserve the final rating and comment as the verdict anchor?
- Did I flag rather than encode any material conflict with the anchor or approved handoff?
- Did I separate visible evidence, verified research, and inference?
- Did I research every visible identity or meaning candidate that could materially affect classification?
- Did I use exact and contextual searches, prefer authoritative sources, and disambiguate ambiguous or same-named entities?
- Did I preserve material resolved, unresolved, ambiguous, and conflicting research findings with adequate provenance?
- Did I avoid preserving unsupported assumptions about unseen post-click content?
- Did I use the approved abstraction handoff without independently reframing or reselecting its integration directions?
- Did I preserve every approved handoff field, including the precise wording-use conditions and separated evidence basis?
- Did I review the current documents only to implement the approved result, identify its exact target, and avoid literal duplication?
- If an intervening document change blocked the approved result, did I flag the blocker instead of silently choosing another result?
- For a manual edit, did I preserve Official guidance unchanged and provide only the exact replacement or addition needed?
- Did I preserve useful abandoned reasoning paths, negative direction, and boundaries authorized by the handoff?
- Did I keep every proposed use and do-not-use condition transferable rather than tied to an incidental advertiser or visual detail?
- Did I extract comment wording only at the component level authorized by the approved scope?
- Did I avoid manufacturing a separate abstract comment principle?
- Did I avoid speculative content created merely to prevent a no-insertion result?
- Is all insertion-ready material placed under the correct project section?

---

## 13. Scope Boundary

This framework begins only after the rating chat is complete and the abstraction handoff is approved.

It contains no operational invocation prompts and does not perform live task rating or abstraction selection. The worked example is a real, previously approved illustration of converting a fixed abstraction into integration results; it is not a requirement that future chats change both documents.
