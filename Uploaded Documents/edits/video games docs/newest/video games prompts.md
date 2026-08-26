Boilerplate prompt:
Apply `video_games_manual_final.md` from project context to this Video Games rating task.

Use the task input, which may be an attached screenshot, OCR text, or both, and execute the manual’s full task-analysis process.

Full task OCR: [full task ocr]

Rating comment feedback prompt:
Give me feedback on my rating comment using `rating_comment_style_and_phrase_guide.md` from project context.

Use the current task evidence and any verified research established in the chat. Keep the rating and intended meaning unless the reasoning clearly needs correction.

Focus on making the comment natural, personally written, concise, specific, and consistent with the guide. Reuse applicable signed-off wording at whatever level fits naturally, without forcing an entire template.

Briefly explain any important issue and provide a polished version if useful.

Draft comment:

[rating comment]


Chat processing prompt:
Apply `video_games_chat_processing_framework.md` from project context to this completed Video Games rating chat.

Use the completed chat history, attached screenshot/OCR if present, final rating comment, and user-approved abstraction handoff below.

Treat:

* the final rating comment as the verdict anchor;
* the approved abstraction handoff as fixed controlling input.

Do not independently broaden, narrow, or replace the approved abstraction frame.

Produce:

A) Video Games manual insertion block
B) Rating comment guide insertion block

If the task evidence or verified research materially conflicts with the verdict anchor or approved abstraction handoff, flag the conflict before producing the insertion blocks rather than silently changing the rating or abstraction.

User-approved abstraction handoff:

[PASTE APPROVED ABSTRACTION HANDOFF HERE]

Final rating comment:

[PASTE FINAL COMMENT HERE]


Abstraction level prompt
Before processing this completed Video Games rating chat according to `video_games_chat_processing_framework.md` in project context, perform a separate abstraction-selection step.

Do not apply the processing framework yet, draft the insertion blocks, or edit the project documents. Your task in this step is only to recommend the abstraction and integration decision that should later control processing.

Use:

* the completed chat history;
* the attached screenshot/OCR, if present;
* the final rating comment;
* the current Video Games manual and rating comment guide;
* any verified research already used in the chat.

Treat the final rating comment as the verdict anchor.

Before choosing an abstraction frame:

* Keep visible evidence, verified research, and inference conceptually distinct.
* Identify and research every visible clue that could materially affect the meaning or classification, including names, titles, brands, slogans, acronyms, specialist terms, and ordinary-looking wording with a plausible secondary meaning.
* Search exact wording and useful contextual variants, prefer authoritative primary sources where available, and disambiguate similarly named entities using the task context.
* Do not assume unsupported unseen landing-page or post-click behavior.
* Do not re-open the rating merely because the case is borderline. If task evidence or verified research materially contradicts the verdict anchor, flag the conflict before recommending a final abstraction frame.

Please do the following:

1. Identify the exact concrete case.

2. Identify the decisive mechanism, evidence relationship, or classification boundary that caused the rating.

3. Separate:

   * features that are causally necessary to the reasoning;
   * supporting evidence;
   * characteristics that merely describe the anchor example.

4. List several possible abstraction levels from narrowest to broadest.

5. For each proposed level, explain:

   * what it captures;
   * what other cases it could validly cover;
   * what it excludes;
   * which included features may merely reflect the anchor example;
   * whether it is too narrow, appropriately reusable, or so broad that it loses the decisive mechanism.

6. Apply this removal test to every feature proposed for the manual-node title, case type, decision shortcut, and use conditions:

   > If the case lacked this feature but retained the same decisive evidence relationship, would the same reasoning still apply?

   If yes, treat the feature as anchor evidence rather than a node-level eligibility condition.

7. Compare the proposed frame with existing manual nodes by decisive mechanism, main advertised subject, classification boundary, and evidence relationship—not merely shared wording or subject matter.

8. Recommend whether the manual should:

   * extend an existing node;
   * add a genuinely distinct specialized node;
   * synthesize existing nodes;
   * or create a new node.

   Avoid near-duplicate nodes at slightly different abstraction levels.

9. Recommend the best manual-node abstraction and state:

   * the reusable frame;
   * the decisive node-level conditions;
   * the anchor-specific details that should not become eligibility conditions;
   * the point at which further abstraction would lose useful decision logic;
   * the reusable decision principle in one sentence.

10. Assess the rating-comment-guide contribution separately.

Do not invent an abstract comment-pattern principle. Instead:

* review the existing comment patterns;
* identify genuinely reusable templates, sentences, clauses, phrase structures, hedges, contrast constructions, or individual phrases;
* state the precise condition under which that wording is useful;
* recommend whether to extend an existing pattern, add a new pattern, or make no guide addition.

11. Finish with this handoff:

**Recommended abstraction handoff**

* Verdict anchor:
* Manual-node frame:
* Decisive node-level conditions:
* Supporting evidence:
* Anchor-only details:
* Point where further abstraction becomes too broad:
* Existing-node integration recommendation:
* Reusable decision principle:
* Comment-guide wording scope:
* Existing-pattern integration recommendation:
* Evidence and research basis:
* Material unresolved findings:

Do not proceed to the processing-framework step. Wait for me to approve or revise the recommended handoff.

Final rating comment:

[PASTE FINAL COMMENT HERE]

Additional context prompt:
Consider this additional context for the current Video Games rating task. The added input may be an attached screenshot, OCR text, or both.

Treat it as additional evidence for the same task. Apply `video_games_manual_final.md` from project context and compare the new context with the earlier task evidence, verified research, rating, and reasoning.

Determine whether it meaningfully changes the rating, confidence, applicable case-node analysis, research findings, or rating comment.

Keep visible evidence, verified research, and inference conceptually distinct. Do not assume unsupported unseen landing-page or post-click behavior.

Output:

* Does this change the rating? Yes / No / Maybe
* Why or why not?
* Research impact, if any
* Updated rating and confidence, if changed
* Updated applicable case-node analysis, if changed
* Updated comment, if useful


Multi-screenshot batch prompt:
The attached screenshots are parts of one multi-screenshot task.

Transcribe and visually describe each screenshot in attachment order so the final task prompt can reference the written chat content instead of relying on earlier image attachments.

For each screenshot, capture:

* visible instructions and question text;
* answer choices, fields, labels, and visible URLs;
* visually relevant content that could affect later classification;
* page state, selections, warnings, and navigation context.

Separate literal transcription from visual description where useful. Mark anything unreadable or uncertain rather than guessing.

Do not research, rate, interpret, or solve the full task yet. Do not infer hidden behavior beyond what the screenshots show.

Output concise, clearly numbered notes for each screenshot.





























