# Video Games Chat Processing Framework

Use this file when processing a completed Video Games rating chat into reusable project material.

This framework is not the rating manual itself. Its job is to extract reusable material from a finished chat and format it so it can be inserted into the two project documents:

1. `video_games_manual_final.md`
2. `rating_comment_style_and_phrase_guide.md`

The main idea is to keep decision logic and comment phrasing separate.

- The **Video Games manual** stores reusable reasoning components. Do not add reusable comment wording merely because it occurred in the completed chat.
- The **rating comment guide** stores reusable wording components. These may range from complete templates to sentences, clauses, phrase structures, and individual phrases.

---

## 1. Purpose

Some completed rating chats contain useful reasoning that should not be rediscovered every time.

This framework turns those chats into reusable project material by extracting:

- the evidence and identification pattern,
- verified research findings that materially contributed to the rating,
- the final rating verdict,
- the reasoning path that led to it,
- abandoned interpretations,
- boundary conditions,
- signed-off reusable phrasing.

The final comment from the chat should be treated as the **verdict anchor**. The extracted material should support that verdict rather than re-open the rating from scratch.

If verified research materially contradicts the final verdict anchor, do not silently encode the contradiction as reusable guidance. Flag the conflict before producing a reusable case node or phrase pattern so the verdict can be reviewed.

---

## 2. Core Separation Rule

Every processed chat should produce two separate outputs.

### Output A — Video Games Manual Insertion

This goes into `video_games_manual_final.md`, under:

> Case-Derived Borderline Reasoning

It should contain:

- case type,
- final verdict anchor,
- evidence / research pattern,
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
- phrases to use carefully,
- optionally, phrase variants.

It should **not** contain the full decision logic unless a short note is needed to explain when the pattern applies.

---

## 3. Screenshot/OCR and research grounding

Use the screenshot/OCR to identify the evidence actually present in the task.

Also preserve verified research findings that materially contributed to the completed rating, including identification of advertisers, brands, products, companies, games, services, terminology, or non-obvious meanings of visible wording.

Do not treat researched identification of something visibly present as hidden landing-page behavior.

Do not preserve unsupported assumptions about unseen post-click content.

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

### Evidence / research pattern
- Visible: [...]
- Research-resolved: [...]

### Core reasoning path
[Explain how the visible evidence and any verified research findings lead to the final verdict. Keep this reusable. Do not make it depend on the specific advertiser unless the advertiser is decisive.]

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

Use when [brief condition based on the task evidence, including any materially relevant verified research].

Approved base template:
> [Reusable comment pattern.]

Optional variants:
> [Variant 1.]

> [Variant 2.]

Phrases to use carefully:
- “[phrase]” — [why it needs care]

Notes:
- [Short practical note about adapting this pattern.]
```

The pattern should provide signed-off wording that can be reused at whatever level is useful: complete template, sentence, clause, phrase structure, or individual phrase.

The goal is not just inspiration. The goal is to create reusable wording components that can be adapted to the task-specific evidence and combined naturally with useful wording from other applicable patterns.

---

## 6. Node Match Levels for Future Task Analysis

When the manual is later applied to a new rating task, identify all case-derived nodes that materially apply and rank them by relevance. Each applicable node can match at a different strength.

### Direct match
Use when the current task has the same decisive structure as the node.

Example:
> 1. Quiz/App Companion for a Real-World Trail — direct match.

### Partial match
Use when the node helps with one important part of the reasoning, but the current task has additional facts or a slightly different structure.

Example:
> 2. Quiz/App Companion for a Real-World Trail — partial match. The quiz/supporting-app logic is relevant, but the current task is not clearly an outdoor trail.

### Broad conceptual match
Use when the node does not directly control the rating, but it helps frame the distinction.

Example:
> 3. Quiz/App Companion for a Real-World Trail — broad conceptual match. It helps separate game-like wording from clear video-game framing.

### No match
Use when no existing node materially helps the decision.

Example:
> Applicable case nodes, ranked: None.

Rank applicable nodes according to how much useful work they do in resolving the specific task, based primarily on similarity of the decisive structure, main advertised subject, classification boundary, and evidence pattern rather than shared words or superficial themes. Match strength is informative but does not by itself determine ranking.

An applicable node may function as **primary**, **supporting**, or **contrast/boundary** reasoning depending on what it contributes to the task.

Use applicable nodes modularly:

- use the most relevant node as the primary reasoning structure when one clearly dominates;
- incorporate individual reasoning principles, distinctions, evidence interpretations, negative directions, and boundary conditions from other applicable nodes where useful;
- use a lower-ranked node as a contrast or boundary check when appropriate;
- do not mechanically combine nodes or treat them as votes;
- when one node adequately resolves the task, do not introduce additional nodes unnecessarily.

Use whatever combination of applicable case-derived reasoning best fits the task. A partial or broad conceptual match should not override the main manual.

---

## 7. Processing Workflow

When processing a completed chat:

1. Identify the final rating comment.
2. Treat that comment as the verdict anchor.
3. Extract the evidence / research pattern from the screenshot/OCR/chat. Preserve verified identification of advertisers, brands, products, companies, games, services, terminology, and non-obvious meanings of visible wording when those findings materially contributed to the verdict.
4. Keep visible evidence, verified research findings, and inference conceptually distinct while extracting the reasoning path that led to the verdict.
5. Extract abandoned interpretations and wording traps.
6. Define use and do-not-use boundaries.
7. Create Output A for the Video Games manual.
8. Create Output B for the rating comment guide.
9. Keep rating logic out of the phrase bank unless needed as a short use condition.
10. Keep polished phrasing out of the manual case node unless it appears only as the final comment anchor.

---

## 8. Extraction Prompt

Use this prompt after a rating discussion has produced a final comment.

```txt
Apply `video_games_chat_processing_framework.md` to this completed Video Games rating chat.

Use the chat history, attached task screenshot/OCR if present, and the final rating comment below.

Final rating comment:
[PASTE FINAL COMMENT HERE]

Treat the final comment as the verdict anchor. Extract reusable material from the chat and produce two clearly separated outputs:

A) Video Games manual insertion block
- Format it as a case-derived reasoning node for the manual’s Case-Derived Borderline Reasoning section.
- Include case type, final verdict anchor, evidence / research pattern, core reasoning path, decision shortcut, abandoned reasoning paths / negative direction, use boundaries, and do-not-use boundaries.
- Do not include a phrase bank or polished comment-template section in this block.

B) Rating comment guide insertion block
- Format it as a signed-off comment pattern for the rating guide’s Signed-Off Comment Pattern Library.
- Include use condition, approved base template, useful variants, phrases to use carefully, and notes on adaptation.
- Keep it focused on reusable wording, not full rating logic.

Use the screenshot/OCR to identify the evidence actually present in the task. Preserve verified research findings that materially contributed to the completed rating, including researched identities or non-obvious meanings of visible wording. Do not treat researched identification of something visibly present as hidden landing-page behavior. Do not preserve unsupported assumptions about unseen post-click content. Preserve useful uncertainty and negative direction.
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

### Evidence / research pattern
- Visible:
  - The offer is centered on a real-world trail or location-based activity.
  - The quiz/app element appears to accompany that activity.
  - The visible content does not clearly present the product as an online game, downloadable game, mobile game, video game, game platform, gameplay media, or game-development product.
- Research-resolved: No research finding materially contributed to the anchor verdict.

### Core reasoning path
The quiz element is game-like, but the main advertised product is the real-world trail activity. A companion app, QR code, AR layer, quiz mechanic, or challenge mechanic is not enough by itself to make the product a video game.

The decisive question is not only whether the task has game-like elements, but what the main advertised product is. If the combined task evidence identifies the main product as a physical trail or real-world route with a supporting digital quiz layer, rate it outside Video Games unless visible evidence or verified research establishes the app itself as the main playable digital game.

### Decision shortcut
When the combined task evidence identifies a quiz/app component as supporting a real-world trail or activity, rate based on the real-world activity. Do not treat quiz wording, AR wording, QR codes, or smartphone use as enough by themselves to make it a video game.

### Abandoned reasoning paths / negative direction
- Do not rate Yes just because the word “quiz” appears.
- Do not rate Yes just because the creative uses wording such as “challenge,” “trail,” “quizmaster,” “AR,” or “QR code.”
- Do not rate Yes just because a smartphone or app is involved.
- Do not over-rely on the phrase “standalone video game,” because some valid video games are not fully standalone. Prefer “clear video game” or “clearly framed as a video game.”
- Do not mark Unrateable if the product is assessable but borderline. Give the best Yes/No rating and explain uncertainty if needed.

### Use this node when
- The combined task evidence identifies the main offer as an outdoor trail, city trail, museum trail, walking route, educational route, scavenger-hunt-like route, or location-based real-world activity.
- The quiz, AR, app, QR-code, or challenge component appears to support that real-world activity.
- The task evidence does not establish a digital game as the main product.

### Do not use this node when
- The combined task evidence clearly identifies a trivia video game, quiz game app, browser game, mobile game, downloadable game, or online game.
- The task evidence establishes the app itself as the main playable digital experience.
- The task evidence establishes gameplay, levels, missions, game characters, game currency, or other strong video-game framing.
- The combined task evidence identifies the page as video-game media, game reviews, walkthroughs, game downloads, in-game rewards, game retail, or game development.
```

### Output B — Rating Comment Guide Insertion

```md
### Real-world activity with game-like companion

Use when the combined task evidence identifies the main offer as a real-world activity, and the quiz/app/AR component appears supportive rather than the main video-game product.

Approved base template:
> The main offer is [real-world activity] with a companion [quiz/app] component. Since it is framed as [real-world activity] rather than a clear video game, I would rate it No.

Instruction-reference variant:
> The main offer is [real-world activity] with a companion [quiz/app] component. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as [real-world activity] rather than a clear video game, I would rate it No.

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

---

## 10. Quality Checks

Before finalizing processed output, check:

- Did I produce both outputs?
- Is the manual block about reasoning rather than comment wording?
- Is the comment-guide block about reusable phrasing rather than full decision logic?
- Did I preserve verified research findings that materially contributed to the rating?
- Did I avoid preserving unsupported assumptions about unseen post-click content?
- Did I preserve the final comment as the verdict anchor?
- Did I include negative direction / abandoned paths in the manual block?
- Did I include signed-off reusable wording in the comment-guide block?
- Did I separate visible evidence, verified research findings, and inference?
- Did I avoid creating a template that is too broad and would mislead future tasks?

---

## 11. Minimal Helper Prompts After Integration

Use short prompts that point to the project documents instead of restating their logic.

### Task analysis prompt

```txt
Apply `video_games_manual_final.md` from project context to this Video Games rating task. Use the attached screenshot/OCR as task input and execute the manual’s full task-analysis process.

Full task OCR: [full task ocr]
```

### Comment feedback prompt

```txt
Give me feedback on my rating comment using `rating_comment_style_and_phrase_guide.md` from project context. Keep the same meaning unless the rating logic clearly needs correction. Make the comment natural, specific, and grounded in the task evidence and any verified research used in the rating.

Draft comment OCR:
```

### Completed-chat processing prompt

```txt
Apply `video_games_chat_processing_framework.md` to this completed Video Games rating chat. Use the final rating comment below as the verdict anchor and produce the two insertion blocks required by the framework.

Final rating comment:
[PASTE FINAL COMMENT HERE]
```
