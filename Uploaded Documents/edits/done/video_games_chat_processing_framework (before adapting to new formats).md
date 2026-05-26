# Video Games Case Reasoning Framework

This framework is meant to be used inside or alongside `video_games_manual_final.md`.

Its purpose is to preserve reasoning work from difficult or borderline Video Games rating chats, so similar future tasks can be handled faster and more consistently.

It is not a replacement for the main manual. It is an added layer for recurring borderline patterns.

---

## 1. Core Purpose

Some rating cases are not solved by a single visible keyword. They require reasoning about:

- the main advertised product,
- whether a game-like element is primary or only supportive,
- whether visible wording is enough to count as Video Games,
- why tempting alternative ratings should be rejected,
- how to phrase the comment naturally.

A case-derived reasoning node stores this work so it can be reused later.

A node should help answer:

- What visible evidence mattered?
- What final rating/comment did we land on?
- What reasoning path led there?
- Which alternative interpretations were considered and rejected?
- What wording can be reused in future comments?
- When is this case similar enough to reuse, and when is it not?

---

## 2. Case-Derived Reasoning Nodes

A **case-derived reasoning node** is a reusable decision pattern extracted from a completed rating discussion.

It is built from:

1. the visible task evidence,
2. the final rating comment,
3. the reasoning path developed in the chat,
4. abandoned interpretations or wording traps,
5. reusable comment phrasing.

The final comment should be treated as the **verdict anchor**. The node should support that verdict with the useful reasoning, distinctions, and wording decisions that led to it.

A node is not just an example. It is a reusable reasoning shortcut.

---

## 3. Required Task-Analysis Check

For every Video Games rating task, after extracting visible evidence, check whether any case-derived reasoning node applies.

Do not apply a node just because it shares one word with the current task. Apply it only when the current task shares a similar **decisive structure**.

Always ask:

1. What is the main advertised product or page subject?
2. Is the game-like element primary or supportive?
3. Is there visible evidence of a video game under the manual?
4. Does an existing node match the decisive evidence, or only superficial wording?

---

## 4. Node Match Levels

When a node is relevant, mention it even if it is not a perfect match. Qualify the match level clearly.

### Direct match

Use when the current task has the same decisive structure as the node.

Example:
> Case node used: Quiz/App Companion for a Real-World Trail — direct match.

### Partial match

Use when the node helps with one important part of the reasoning, but the current task has additional facts or a slightly different structure.

Example:
> Case node used: Quiz/App Companion for a Real-World Trail — partial match. The quiz/supporting-app logic is relevant, but the current task is not clearly an outdoor trail.

### Broad conceptual match

Use when the node does not directly control the rating, but it helps frame the distinction.

Example:
> Case node used: Quiz/App Companion for a Real-World Trail — broad conceptual match. It helps separate game-like wording from clear video-game framing.

### No match

Use when no existing node materially helps the decision.

Example:
> Case node used: None.

A partial or broad conceptual match should not override the main manual. It should only help explain the reasoning.

---

## 5. Screenshot and OCR Grounding

Screenshots and OCR are used during node extraction to make the node accurate and grounded in the actual task.

The screenshot itself does not need to be stored in the manual or node library.

The node should store only the task description and visible evidence that serves the future reasoning goal, such as:

- visible product type,
- visible wording,
- visible CTA,
- visible app/page context,
- visible imagery when relevant,
- visible URL if relevant.

Do not preserve irrelevant screenshot details.

Do not invent landing-page behavior that was not visible.

---

## 6. Case Node Template

Use this template when extracting a reusable node from a completed chat.

```md
# Case Node: [Short reusable title]

## Case type
[Short description of the recurring borderline pattern.]

## Source basis
[Briefly describe what material the node was extracted from.]

Example:
- Completed rating chat about a quiz/app companion for a real-world trail.
- Task screenshot was used for grounding during extraction.
- Final comment served as the verdict anchor.

## Final verdict anchor
Rating: Yes / No / Unrateable  
Final comment: "[final comment]"

## Visible evidence pattern
List only visible signals that mattered.

- [...]
- [...]

## Core reasoning path
Explain how the visible evidence leads to the final verdict.

Keep this reusable. Do not make it depend on the specific advertiser unless the advertiser is decisive.

## Decision shortcut
Write the compact rule this case teaches.

Example:
> When a quiz/app component supports a real-world activity, rate the main offer as the real-world activity unless the visible content clearly presents the app as a video game.

## Abandoned reasoning paths / negative direction
List plausible interpretations that were considered but rejected.

- Do not rate [Yes/No] just because [...]
- Avoid wording such as [...] because [...]
- This path was abandoned because [...]

## Boundary conditions

### Use this node when:
- [...]
- [...]

### Do not use this node when:
- [...]
- [...]

## Reusable comment phrases

### Naming the visible offer
- "[phrase]"
- "[phrase]"

### Acknowledging ambiguity
- "[phrase]"
- "[phrase]"

### Explaining why a signal is not enough
- "[phrase]"
- "[phrase]"

### Rating close
- "[phrase]"
- "[phrase]"

## Polished adaptable comment templates
1. "[template]"
2. "[template]"
3. "[template]"
```

---

## 7. Example Case Node

# Case Node: Quiz/App Companion for a Real-World Trail

## Case type
A quiz, AR, QR-code, or smartphone component supports a real-world outdoor trail, city route, museum route, scavenger hunt, or educational walk.

## Source basis
This node was extracted from a completed rating discussion about a quiz trail product. The task screenshot was used for grounding during extraction. The final comment served as the verdict anchor.

## Final verdict anchor
Rating: No  

Final comment:
> The main offer is an outdoor trail activity with a companion quiz app. Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed. Since it is framed as part of a real-world trail experience rather than as a clear video game, I would rate it No.

## Visible evidence pattern
- The offer is centered on a real-world trail or location-based activity.
- The quiz/app element appears to accompany that activity.
- The visible content does not clearly present the product as an online game, downloadable game, mobile game, video game, game platform, gameplay media, or game-development product.

## Core reasoning path
The quiz element is game-like, but the main advertised product is the real-world trail activity. A companion app, QR code, AR layer, quiz mechanic, or challenge mechanic is not enough by itself to make the product a video game.

The decisive question is not "does this have game-like elements?" but "what is the main offer being advertised?" If the answer is a physical trail or real-world route with a digital quiz layer, the case should be treated as outside Video Games unless the visible content clearly frames the app itself as a playable digital game.

## Decision shortcut
When a quiz/app component supports a real-world trail or activity, rate based on the real-world activity. Do not treat quiz wording, AR wording, QR codes, or smartphone use as enough by themselves to make it a video game.

## Abandoned reasoning paths / negative direction
- Do not rate Yes just because the word "quiz" appears.
- Do not rate Yes just because the creative uses wording such as "challenge," "trail," "quizmaster," "AR," or "QR code."
- Do not rate Yes just because a smartphone or app is involved.
- Do not over-rely on the phrase "standalone video game," because some valid video games are not fully standalone. Prefer "clear video game" or "clearly framed as a video game."
- Do not mark Unrateable if the product is assessable but borderline. Give the best Yes/No rating and explain uncertainty if needed.

## Boundary conditions

### Use this node when:
- The visible offer is an outdoor trail, city trail, museum trail, walking route, educational route, scavenger-hunt-like route, or location-based real-world activity.
- The quiz, AR, app, QR-code, or challenge component appears to support that real-world activity.
- The visible content does not clearly show a digital game as the main product.

### Do not use this node when:
- The visible offer is clearly a trivia video game, quiz game app, browser game, mobile game, downloadable game, or online game.
- The app itself is clearly the main playable digital experience.
- The visible content shows gameplay, levels, missions, game characters, game currency, or other strong video-game framing.
- The page is about video-game media, game reviews, walkthroughs, game downloads, in-game rewards, game retail, or game development.

## Reusable comment phrases

### Naming the visible offer
- "The main offer is an outdoor trail activity with a companion quiz app."
- "The visible offer appears to be a real-world trail experience with a quiz/app component."
- "This looks like a location-based trail activity rather than a clear digital game."

### Acknowledging ambiguity
- "The quiz element feels game-like..."
- "Quizzes are not explicitly mentioned in the instructions, so I think the rating depends on how the quiz is framed."
- "There is some game-like wording here, but..."

### Explaining why a signal is not enough
- "...it appears to support a real-world trail experience rather than a clear video game."
- "...the app component seems secondary to the outdoor activity."
- "...I do not see enough visible evidence that the product itself is a video game."

### Rating close
- "...so I would rate it No."
- "...so I would not treat this as Video Games based on the visible evidence."
- "...so I would rate it No, with some uncertainty."

## Polished adaptable comment templates
1. "The main offer appears to be a real-world trail activity with a companion quiz app. The quiz element feels game-like, but it supports the trail experience rather than clearly presenting a video game, so I would rate it No."

2. "This uses quiz-style wording, but the visible offer is mainly an outdoor trail experience. Since the app appears to accompany that real-world activity rather than function as a clear video game, I would rate it No."

3. "I think the rating depends on how the quiz is framed. Here, it is presented as part of a real-world trail activity rather than as an online or downloadable game, so I would rate it No."

4. "The smartphone/quiz component makes the offer feel somewhat game-like, but the main product is still the trail experience. I would rate it No based on the visible evidence."

---

## 8. Phrase-Bank Integration Rule

Reusable comment phrases should live in the rating-comment guidance, not in the main decision manual.

The decision manual should explain what to rate and why.

The comment guide should explain how to phrase the rating naturally.

Suggested names for an expanded comment document:

- `rating_comment_style_and_phrase_guide.md`
- `rating_comment_guide_and_phrase_bank.md`
- `rating_comment_style_guide_with_phrase_bank.md`
- `rating_comment_style_and_reusable_phrasing.md`

Within that document, useful sections would be:

- Core Writing Goal
- Natural Comment Style
- Reusable Comment Snippets
- Borderline Case Phrasing
- Phrases to Use Carefully
- Adaptable Comment Templates

Reusable wording should shorten the path to a good comment, not replace judgment.

Good reuse:
> The quiz element feels game-like, but it appears to support a real-world trail experience rather than a clear video game.

Bad reuse:
> This is not a video game because quizzes are never video games.

The second version is too broad and would fail on actual quiz/trivia games.

---

## 9. Application Rule

A case node is useful only when the current task shares the same decisive structure.

Do not apply a node just because it shares one word.

Example:

- A real-world quiz trail and a mobile trivia game both contain "quiz."
- The decisive structure differs.
- The trail case should not control the trivia game case.

Use the node to shorten reasoning, not to skip judgment.
