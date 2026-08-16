# Video Games Chat Processing Framework

Use this file when processing a completed Video Games rating chat into reusable project material.

This framework is not the rating manual itself. Its job is to extract reusable material from a finished chat and format it so it can be inserted into the two project documents:

1. `video_games_manual_final.md`
2. `rating_comment_style_and_phrase_guide.md`

The main idea is to keep decision logic and comment phrasing separate.

- The **Video Games manual** stores rating logic: case-derived reasoning nodes, decision shortcuts, boundary conditions, and rejected reasoning paths.
- The **rating comment guide** stores signed-off wording: reusable comment patterns, phrasing blocks, wording traps, and adaptable templates.

---

## 1. Purpose

Some completed rating chats contain useful reasoning that should not be rediscovered every time.

This framework turns those chats into reusable project material by extracting:

- the visible evidence pattern,
- the research candidates and verified identity/meaning pattern,
- the final rating verdict,
- the reasoning path that led to it,
- abandoned interpretations,
- boundary conditions,
- signed-off reusable phrasing.

The final comment from the chat should be treated as the **verdict anchor**. The extracted material should support that verdict rather than casually re-open the rating from scratch. If mandatory research reveals a material conflict with the anchor, flag the conflict instead of silently turning a contradicted verdict into reusable guidance.

---

## 2. Core Separation Rule

Every processed chat should produce two separate outputs.

### Output A — Video Games Manual Insertion

This goes into `video_games_manual_final.md`, under:

> Case-Derived Borderline Reasoning

It should contain:

- case type,
- final verdict anchor,
- visible evidence pattern,
- research findings pattern,
- core reasoning path,
- decision shortcut,
- abandoned reasoning paths / negative direction,
- use / do-not-use boundaries.

It should **not** contain polished comment templates or a large phrase bank.

### Output B — Rating Comment Guide Insertion

This goes into `rating_comment_style_and_phrase_guide.md`, under:

> Signed-Off Comment Pattern Library

It should contain:

- comment pattern label,
- use condition,
- approved reusable wording,
- adaptable templates,
- reusable sentence, clause, and individual-phrase components when useful,
- phrases to use carefully,
- optionally, phrase variants.

It should **not** contain the full decision logic unless a short note is needed to explain when the pattern applies. It also does not need a separate abstract “comment principle”: its reusable value lies in the stored wording and precise use condition.

---

## 3. Task Grounding: Screenshot/OCR and Verified Research

Screenshots and OCR provide the surface evidence. Verified research establishes the identities and non-obvious meanings of visible clues. Both may be needed to extract an accurate reusable case.

The screenshot itself does not need to be stored in the manual or comment guide. Store only task details that serve the future reasoning or phrasing goal, such as:

- visible product type, wording, CTA, app/page context, imagery, URL/domain, and branding;
- every visible research candidate: advertiser, company, developer, publisher, brand, product, app, platform, service, site, title, slogan, acronym, specialist term, or potentially meaningful phrase;
- verified identities or secondary meanings tied to those candidates;
- material ambiguity, conflicting findings, or failed attempts to identify a candidate.

Research every clue that could plausibly be a name or have a task-relevant non-obvious meaning. This includes words and phrases that could also be ordinary language. Search exact wording and contextual variants, prefer authoritative primary sources, disambiguate same-named entities, and preserve the finding that actually affected the completed reasoning.

Keep these layers distinct in the extracted material:

1. **Visible evidence** — what the screenshot/OCR shows.
2. **Verified research** — what reliable external sources establish about a visible clue.
3. **Inference** — how those facts support the verdict and reusable boundary.

Do not preserve irrelevant screenshot or research details. Do not assume hidden landing-page or post-click behavior. Research may verify what a visible entity or phrase is; it may not invent what an unseen click does.

---

## 4. Manual Case Node Format

Use this format for the manual insertion block.

```md
## Case Node: [Short reusable title]

### Case type
[Short description of the recurring borderline pattern.]

### Final verdict anchor
Rating: Yes / No / Unrateable

Final comment anchor:
> [Final comment from the completed chat, or a concise paraphrase if the exact final comment is not needed.]

### Visible evidence pattern
- [...]
- [...]

### Research findings pattern
- [Research candidate → verified identity/meaning, source type, or unresolved result.]
- [...]

### Core reasoning path
[Explain how visible evidence, verified research, and inference lead to the final verdict. Keep this reusable. Do not make it depend on the specific advertiser unless that identity is decisive.]

### Decision shortcut
[Write the compact rule this case teaches.]

### Abandoned reasoning paths / negative direction
- Do not [...]
- Avoid [...]
- This interpretation was rejected because [...]

### Use this node when
- [...]
- [...]

### Do not use this node when
- [...]
- [...]
```

---

## 5. Rating Comment Guide Pattern Format

Use this format for the rating-comment-guide insertion block.

```md
### [Pattern number/title]

Use when [brief condition based on visible evidence and any required verified research].

Approved base template:
> [Reusable comment pattern.]

Optional variants:
> [Variant 1.]

> [Variant 2.]

Reusable components:
- Evidence clause: “[adaptable clause]”
- Research/identity clause: “[adaptable clause]”
- Boundary or contrast clause: “[adaptable clause]”
- Verdict clause: “[adaptable clause]”

Phrases to use carefully:
- “[phrase]” — [why it needs care]

Notes:
- [Short practical note about adapting this pattern.]
```

Include only component lines that add real reuse value; do not manufacture all four merely to fill the format. A future comment may reuse the entire base template, one sentence, one clause, or one individual phrase.

The pattern should be written so future comments can skip novel drafting whenever the case fits.

The goal is not just inspiration. The goal is to create signed-off, reusable phrasing that can be adapted with visible evidence and verified research while still reading as one natural comment.

---

## 6. Ranked Node and Phrase-Pattern Matching

When the manual is later applied to a new task, identify **all materially applicable case nodes**, not merely the first plausible one.

Match strengths remain:

- **Direct match** — the current task has the same decisive structure.
- **Partial match** — the node resolves an important part of the case, but not all of it.
- **Broad conceptual match** — the node contributes a useful boundary or distinction without controlling the rating.
- **No match** — the node adds no material reasoning.

Rank the applicable nodes by relevance and assign each a role:

- **Primary** — closest decisive structure.
- **Supporting** — adds a secondary rule, evidence treatment, or boundary.
- **Contrast** — explains why a nearby pattern does not control.

Example:

| Rank | Node | Match | Role | Contribution |
|---|---|---|---|---|
| 1 | Research-Resolved Named Entity or Meaning | Direct | Primary | Verifies the advertised product identity. |
| 2 | Cumulative Implicit Game Framing | Partial | Supporting | Explains how the visible mechanic clues reinforce that identity. |

Nodes are not votes. Several weak nodes cannot outvote one direct match, and opposite-verdict nodes may supply a useful boundary without supporting their anchor verdict. Select only the components that fit and synthesize them under the official manual, task evidence, and main-subject rule. If one node fully resolves the task and no other adds anything material, list and use only that node.

Apply the same approach to the comment-pattern library: rank all materially applicable patterns, then use one complete pattern or selectively combine the most useful template, sentence, clause, or individual-phrase components. The final comment must read as one coherent explanation.

---

## 7. Processing Workflow

When processing a completed chat:

1. Identify the final rating comment.
2. Treat that comment as the verdict anchor.
3. Extract the visible evidence pattern from the screenshot/OCR/chat without merging it with inference.
4. Enumerate and research every visible identity or meaning candidate, including ordinary-looking phrases with a plausible secondary meaning. Preserve the verified findings that affected the reasoning and any material unresolved conflict.
5. Compare the research with the verdict anchor. If it materially contradicts the anchor, flag the conflict and do not silently extract misleading guidance.
6. Identify the **most abstract but still maximally useful frame** for the reasoning node: generalize beyond incidental names and details, but stop before the frame loses the decisive mechanism, evidence relationship, or boundary that makes it useful.
7. Review the existing manual nodes and rank all that apply. Decide whether the chat should extend an existing node, supply a specialized supporting node, or create a genuinely new node. Avoid duplicates at slightly different abstraction levels.
8. Extract the core reasoning path, abandoned interpretations, and use/do-not-use boundaries.
9. Review the existing comment patterns and rank all that contribute useful wording. Extract reusable language at the most useful granularity—whole template, sentence, clause, or individual phrase. Do not force a separate abstract comment “principle.”
10. Create Output A for the Video Games manual and Output B for the rating comment guide.
11. Keep rating logic out of the phrase guide unless needed as a short use condition.
12. Keep reusable/polished phrasing out of the manual node unless it appears only as the final comment anchor.

---

## 8. Extraction Prompt

Use this prompt after a rating discussion has produced a final comment.

```txt
Apply `video_games_chat_processing_framework.md` to this completed Video Games rating chat.

Use the chat history, attached task screenshot/OCR if present, and the final rating comment below.

Final rating comment:
[PASTE FINAL COMMENT HERE]

Treat the final comment as the verdict anchor. Extract reusable material from the chat and produce two clearly separated outputs:

Before drafting the outputs:
- Extract the visible evidence separately from inference.
- Research every visible clue that could be a name, entity, title, brand, slogan, acronym, specialist term, or ordinary-looking phrase with a relevant secondary meaning.
- Preserve verified findings, disambiguate same-named entities, and flag any material conflict with the verdict anchor.
- Identify the most abstract but still maximally useful reasoning frame.
- Identify and rank all existing case nodes and phrase patterns that materially apply; extend or synthesize them when appropriate instead of creating a duplicate.

A) Video Games manual insertion block
- Format it as a case-derived reasoning node for the manual’s Case-Derived Borderline Reasoning section.
- Include case type, final verdict anchor, visible evidence pattern, research findings pattern, core reasoning path, decision shortcut, abandoned reasoning paths / negative direction, use boundaries, and do-not-use boundaries.
- Do not include a phrase bank or polished comment-template section in this block.

B) Rating comment guide insertion block
- Format it as a signed-off comment pattern for the rating guide’s Signed-Off Comment Pattern Library.
- Include use condition, approved base template, useful variants, reusable sentence/clause/individual-phrase components when useful, phrases to use carefully, and notes on adaptation.
- Keep it focused on reusable wording, not full rating logic.

Ground the output in visible evidence plus verified research tied to it. Do not assume hidden landing-page or post-click behavior. Preserve useful uncertainty and negative direction.
```

---

## 9. Example Split Output

This example shows how one completed quiz/trail chat should be split across the two project documents.

### Output A — Video Games Manual Insertion

```md
## Case Node: Quiz/App Companion for a Real-World Trail

### Case type
A quiz, AR, QR-code, or smartphone component supports a real-world outdoor trail, city route, museum route, scavenger hunt, or educational walk.

### Final verdict anchor
Rating: No

Final comment anchor:
> The main offer is an outdoor trail activity with a companion quiz app. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as part of a real-world trail experience rather than as a clear video game, I would rate it No.

### Visible evidence pattern
- The offer is centered on a real-world trail or location-based activity.
- The quiz/app element appears to accompany that activity.
- The visible content does not clearly present the product as an online game, downloadable game, mobile game, video game, game platform, gameplay media, or game-development product.

### Research findings pattern
- Every visible product, route, advertiser, app, and branded phrase has been checked for a possible game/product identity or non-obvious meaning.
- Verified information supports a real-world trail/activity as the main offer and does not identify the digital component as a separately promoted video game.
- If research instead establishes that the app itself is the promoted playable game, this No node should not control.

### Core reasoning path
The quiz element is game-like, but the main advertised product is the real-world trail activity. A companion app, QR code, AR layer, quiz mechanic, or challenge mechanic is not enough by itself to make the product a video game.

The decisive question is not only whether the task has game-like elements, but what the main advertised product is after visible evidence and verified research are combined. If the answer is a physical trail or real-world route with a digital quiz layer, rate it as outside Video Games unless the task evidence identifies the app itself as a playable digital game.

### Decision shortcut
When a quiz/app component supports a real-world trail or activity, rate based on the real-world activity. Do not treat quiz wording, AR wording, QR codes, or smartphone use as enough by themselves to make it a video game.

### Abandoned reasoning paths / negative direction
- Do not rate Yes just because the word “quiz” appears.
- Do not rate Yes just because the creative uses wording such as “challenge,” “trail,” “quizmaster,” “AR,” or “QR code.”
- Do not rate Yes just because a smartphone or app is involved.
- Do not over-rely on the phrase “standalone video game,” because some valid video games are not fully standalone. Prefer “clear video game” or “clearly framed as a video game.”
- Do not mark Unrateable if the product is assessable but borderline. Give the best Yes/No rating and explain uncertainty if needed.

### Use this node when
- The visible offer is an outdoor trail, city trail, museum trail, walking route, educational route, scavenger-hunt-like route, or location-based real-world activity.
- The quiz, AR, app, QR-code, or challenge component appears to support that real-world activity.
- Research does not identify the digital component as the main promoted game product.

### Do not use this node when
- The visible offer or verified product identity is clearly a trivia video game, quiz game app, browser game, mobile game, downloadable game, or online game.
- The app itself is clearly the main playable digital experience.
- The visible content shows gameplay, levels, missions, game characters, game currency, or other strong video-game framing.
- The page is about video-game media, game reviews, walkthroughs, game downloads, in-game rewards, game retail, or game development.
```

### Output B — Rating Comment Guide Insertion

```md
### Real-world activity with game-like companion

Use when the task evidence identifies a real-world activity as the main offer, and the quiz/app/AR component appears supportive rather than the main video-game product.

Approved base template:
> The main offer is [real-world activity] with a companion [quiz/app] component. Since it is framed as [real-world activity] rather than a clear video game, I would rate it No.

Instruction-reference variant:
> The main offer is [real-world activity] with a companion [quiz/app] component. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as [real-world activity] rather than a clear video game, I would rate it No.

Short variant:
> This uses some game-like [quiz/app/AR] wording, but the main offer appears to be [real-world activity] rather than a clear video game, so I would rate it No.

Reusable components:
- Contrast clause: “This uses some game-like [quiz/app/AR] wording, but…”
- Main-subject clause: “the main offer appears to be [real-world activity]”
- Boundary clause: “rather than a clear video game”
- Verdict clause: “so I would rate it No.”

Phrases to use carefully:
- “standalone video game” — use carefully, because some valid games are not fully standalone.
- “game-like” — useful for ambiguity, but explain why the signal is or is not enough.
- “quiz” — do not imply quizzes are never games; focus on framing.

Notes:
- Use the instruction-reference variant when the borderline issue is specifically about whether quizzes are covered by the instructions.
- Use the shorter version when the task evidence already makes the real-world framing clear.
- Research all visible names and potentially meaningful phrases before using this No pattern.
```

---

## 10. Quality Checks

Before finalizing processed output, check:

- Did I produce both outputs?
- Is the manual block about reasoning rather than comment wording?
- Is the comment-guide block about reusable phrasing rather than full decision logic?
- Did I extract all plausible identity/meaning candidates, including ordinary-looking phrases, and research them before abstracting the case?
- Did I tie every research finding to the exact visible entity and avoid assuming hidden landing-page behavior?
- Did I preserve the final comment as the verdict anchor?
- If research materially conflicts with the anchor, did I flag that instead of extracting misleading guidance?
- Did I separate visible evidence, verified research, and inference?
- Is the manual node framed at the most abstract level that still preserves the decisive mechanism and boundaries?
- Did I rank all materially applicable existing nodes and decide whether to extend, specialize, synthesize, or create rather than duplicate?
- Did I include negative direction / abandoned paths in the manual block?
- Did I rank all materially applicable existing comment patterns?
- Did I include signed-off reusable wording at the useful template, sentence, clause, or individual-phrase level?
- Would selectively combined wording still read as one natural comment?
- Did I avoid creating a template that is too broad and would mislead future tasks?

---

## 11. Minimal Helper Prompts After Integration

Use short prompts that point to the project documents instead of restating their logic.

### Task analysis prompt

```txt
Apply `video_games_manual_final.md` from project context to this Video Games rating task. Use the attached screenshot/OCR as task input and execute the manual’s full task-analysis process.
```

### Comment feedback prompt

```txt
Give me feedback on my rating comment using `rating_comment_style_and_phrase_guide.md` from project context. Keep the same meaning unless the rating logic clearly needs correction. Make the comment natural, specific, and grounded in the task evidence.

Draft comment OCR:
```

### Completed-chat processing prompt

```txt
Apply `video_games_chat_processing_framework.md` to this completed Video Games rating chat. Use the final rating comment below as the verdict anchor and produce the two insertion blocks required by the framework.

Final rating comment:
[PASTE FINAL COMMENT HERE]
```
