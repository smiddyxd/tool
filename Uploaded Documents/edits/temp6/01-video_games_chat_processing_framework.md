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
- material resolved and unresolved research findings,
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

It does not need a separate abstract “comment principle”; its reusable value lies in the signed-off wording and precise use condition.

---

## 3. Screenshot/OCR and research grounding

Use the screenshot/OCR to identify the evidence actually present in the task.

Before extracting reusable guidance, enumerate and research every visible identity or meaning candidate, including advertisers, brands, products, companies, games, services, titles, slogans, acronyms, specialist terms, and ordinary-looking words or phrases with a plausible task-relevant secondary meaning. When uncertain whether a visible clue warrants research, research it.

Search the exact visible wording first and, when useful, test contextual variants or combinations with other visible clues, such as `[term] game`, `[term] app`, `[term] publisher`, `[term] advertiser`, or `[term] meaning`. Prefer authoritative primary sources, disambiguate same-named entities using the surrounding task context, and do not stop after one search formulation while another plausible identity or meaning remains unresolved.

Preserve verified findings that materially contributed to the completed rating, as well as material unresolved, ambiguous, or conflicting findings. Keep visible evidence, verified research, and inference conceptually distinct.

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

Review existing comment patterns before creating a new one. Extend an existing pattern or extract only genuinely new reusable wording where possible; do not automatically create another whole pattern or manufacture wording merely to fill Output B.

---

## 6. Using an Approved Abstraction Decision

This framework does not select the abstraction frame. That decision is made in a separate pre-processing step and supplied by the user as an approved abstraction handoff.

The handoff should identify:

- the manual-node frame;
- the decisive node-level conditions;
- supporting evidence;
- anchor-only details;
- the existing-node integration direction;
- the reusable comment wording scope;
- the existing-pattern integration direction.

Use the approved handoff as controlling input. Do not independently broaden, narrow, or replace its abstraction frame.

Review the existing documents only as needed to implement the approved integration direction and avoid literal duplication. Do not use that review to silently substitute a different abstraction.

If the source material or verified research materially conflicts with the approved handoff or verdict anchor, flag the conflict before producing insertion material.

---

## 7. Processing Workflow

When processing a completed chat:

1. Identify the final rating comment.
2. Treat that comment as the verdict anchor.
3. Extract the visible evidence pattern from the screenshot/OCR/chat without merging it with inference.
4. Enumerate and research every visible identity or meaning candidate, including ordinary-looking phrases with a plausible secondary meaning. Use exact and contextual search variants, prefer authoritative primary sources, disambiguate same-named entities, and preserve material resolved and unresolved findings.
5. Compare the research with the verdict anchor. If verified research materially contradicts the anchor, flag the conflict for review before producing reusable guidance.
6. Keep visible evidence, verified research findings, and inference conceptually distinct while extracting the reasoning path that led to the verdict.
7. Use the user-approved abstraction handoff as the controlling frame. Do not perform a new abstraction analysis.
8. Apply the approved existing-node integration direction without silently changing the selected frame. Review existing manual material only as needed to implement that direction and avoid literal duplication.
9. Extract abandoned interpretations and wording traps, then define use and do-not-use boundaries.
10. Extract only the reusable comment wording authorized by the approved wording scope and apply the approved existing-pattern integration direction. Do not create a separate abstract comment “principle.”
11. Create Output A for the Video Games manual and Output B for the rating comment guide according to the approved handoff.
12. Keep rating logic out of the phrase bank unless needed as a short use condition.
13. Keep polished phrasing out of the manual case node unless it appears only as the final comment anchor.

---

## 9. Example Split Output

This example shows how one completed quiz/trail chat should be split across the two project documents.

For this example, the separate abstraction step has already selected the reusable frame shown below; the framework is demonstrating how that approved decision is converted into the two insertion outputs.

### Output A — Video Games Manual Insertion

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
- Did I enumerate and research every plausible identity or meaning candidate, including ordinary-looking phrases with a potentially relevant secondary meaning?
- Did I use exact and contextual searches, prefer authoritative sources, and disambiguate ambiguous or same-named entities?
- Did I preserve material resolved and unresolved research findings?
- Did I avoid preserving unsupported assumptions about unseen post-click content?
- Did I preserve the final comment as the verdict anchor?
- If verified research materially conflicts with the anchor, did I flag it before producing reusable guidance?
- Did I include negative direction / abandoned paths in the manual block?
- Did I include signed-off reusable wording in the comment-guide block?
- Did I separate visible evidence, verified research findings, and inference?
- Did I use the approved abstraction handoff without independently reframing it?
- Did I preserve the handoff's distinction between decisive conditions, supporting evidence, and anchor-only details?
- Did I follow the approved node and comment-pattern integration directions?
- If later evidence conflicted with the approved handoff, did I flag the conflict instead of silently changing the frame?
- Did I avoid manufacturing a separate abstract comment principle?
- Did I avoid creating a template that is too broad and would mislead future tasks?