Boilerplate prompt:
Apply `weight_loss_manual_final.md` from project context to this Weight Loss rating task.

Use the task input, which may be an attached screenshot, OCR text, or both, and execute the manual’s full task-analysis process. Return the result in the manual’s required output format.

Full task OCR:

[PASTE FULL TASK OCR HERE]

Rating comment feedback prompt:
Give me feedback on my rating comment using `rating_comment_style_and_phrase_guide.md` from project context.

Use the current task evidence and any verified research established in the chat. Preserve the current rating and intended meaning unless the reasoning clearly requires correction. If it does, identify that issue before rewriting the comment.

Review all materially applicable signed-off Weight Loss patterns. Reuse their wording at whatever level fits naturally without forcing a complete template. The optional cross-category wording bank may be used as inspiration only; do not import Video Games classification logic.

Focus on making the comment natural, personally written, concise, specific, and accurately grounded. Briefly explain any important issue and provide a polished version if useful.

Draft comment:

[PASTE DRAFT COMMENT HERE]


Chat processing prompt:
Apply `weight_loss_chat_processing_framework.md` from project context to this completed Weight Loss rating chat.

Use the completed chat history, attached screenshot or OCR if present, final rating comment, and user-approved abstraction handoff below.

Treat:

* the final rating comment as the verdict anchor;
* the approved abstraction handoff as fixed controlling input.

Do not independently broaden, narrow, replace, or reselect the approved abstraction frame. Follow the framework’s complete research, evidence-separation, Weight Loss pitch-guardrail, conflict, integration, and output rules.

Return:

A. Manual integration result
B. Comment-guide integration result
C. Processing record

For each document, use the framework’s permitted result types. An explicit “No insertion recommended” result with `None` as the insertion-ready material is valid and must not be replaced with speculative content.

If the task evidence or verified research materially conflicts with the verdict anchor or approved abstraction handoff, flag the conflict before producing insertion-ready material rather than silently changing the rating or abstraction.

User-approved abstraction handoff:

[PASTE APPROVED ABSTRACTION HANDOFF HERE]

Final rating comment:

[PASTE FINAL COMMENT HERE]



Abstraction level prompt:
Before processing this completed Weight Loss rating chat according to `weight_loss_chat_processing_framework.md` from project context, perform a separate abstraction-selection step.

Do not apply the processing framework yet, draft insertion-ready material, or edit the project documents. Your task in this step is only to recommend the abstraction and integration decisions that should later control processing.

Use:

* the completed chat history;
* the attached screenshot or OCR, if present;
* the final rating comment;
* the current Weight Loss manual and rating comment guide;
* any verified research already used in the chat.

Treat the final rating comment as the verdict anchor.

Before choosing an abstraction:

* Keep visible evidence, verified research, and inference conceptually distinct.
* Identify and research every visible clue that could materially affect identity, meaning, advertised purpose, or classification.
* Search exact wording and useful contextual variants, prefer authoritative primary sources, and disambiguate similarly named entities using the task context.
* Apply the Weight Loss pitch guardrail: research may establish the purpose of the exact offer but must not manufacture a Weight Loss pitch from general brand associations, other campaigns, or possible incidental uses.
* Classify what the offer promotes, not whether its method is medically effective.
* Do not assume unsupported unseen landing-page or post-click behavior.
* Do not reopen the rating merely because the case is borderline. If task evidence or verified research materially contradicts the verdict anchor, flag the conflict before recommending an abstraction.

Please do the following:

1. Identify the exact concrete case.
2. Identify the decisive mechanism, evidence relationship, advertised-purpose boundary, or assessability problem that caused the rating.
3. Separate:

   * causally necessary features;
   * supporting evidence;
   * details that merely describe the anchor case.
4. List several possible abstraction levels from narrowest to broadest.
5. For each level, explain:

   * what it captures;
   * what other cases it could validly cover;
   * what it excludes;
   * which features merely reflect the anchor;
   * whether it is too narrow, appropriately reusable, or so broad that it loses the decisive mechanism.
6. Apply this removal test to every proposed node-level condition:

   If the case lacked this feature but retained the same decisive evidence relationship, would the same reasoning still apply?

   If yes, treat the feature as supporting or anchor evidence rather than a node-level eligibility condition.
7. Compare the proposed frame with all materially applicable Official guidance, Added guidance, adapted seed nodes, and case-derived nodes. Compare decisive mechanisms rather than shared wording. Rank applicable nodes as Direct, Partial, or Broad and label their roles Primary, Supporting, or Contrast.
8. Recommend one manual integration direction:

   * new case-derived node;
   * edit or extension to existing material;
   * no insertion recommended.

   Avoid near-duplicate nodes. An adapted seed may be refined without automatically becoming a separate case-derived node.
9. Recommend the best manual-node abstraction and identify:

   * its reusable frame;
   * decisive conditions;
   * supporting evidence;
   * anchor-only details;
   * the point where further abstraction would become too broad;
   * its reusable decision principle.
10. Assess the comment-guide contribution separately. Review existing signed-off patterns and identify genuinely reusable templates, sentences, clauses, phrase structures, hedges, contrasts, or individual phrases.

Do not invent an abstract comment principle merely to parallel the manual node. Treat the optional cross-category wording bank as inspiration, not precedent.

Recommend one guide integration direction:

* new signed-off pattern or wording component;
* edit or extension to an existing pattern;
* no insertion recommended.

Finish with exactly this handoff:

**Recommended abstraction handoff**

* Verdict anchor:
* Manual-node frame:
* Decisive node-level conditions:
* Supporting evidence:
* Anchor-only details:
* Causal-condition removal result:
* Point where further abstraction becomes too broad:
* Reusable decision principle:
* Relationship to existing guidance and nodes:
* Proposed manual integration direction:
* Comment-guide wording scope:
* Relationship to existing guide patterns:
* Proposed guide integration direction:
* Evidence and research basis:

  * Visible evidence:
  * Verified research:
  * Inference:
* Material unresolved findings:

Do not proceed to processing. Wait for me to approve or revise the recommended handoff.

Final rating comment:

[PASTE FINAL COMMENT HERE]


Additional context prompt:
Consider this additional context for the current Weight Loss rating task. The added input may be an attached screenshot, OCR text, or both.

Treat it as additional evidence for the same task. Apply `weight_loss_manual_final.md` from project context and compare the new context with the earlier task evidence, verified research, rating, confidence, reasoning-node analysis, and comment.

Determine whether it meaningfully changes the rating, confidence, research findings, applicable reasoning nodes, or rating comment.

Keep visible evidence, verified research, and inference conceptually distinct. Do not assume unsupported unseen landing-page or post-click behavior. If an updated comment is useful, apply `rating_comment_style_and_phrase_guide.md`.

Output:

* Does this change the rating? Yes / No / Maybe
* Why or why not?
* Research impact, if any
* Updated rating and confidence, if changed
* Updated applicable reasoning-node analysis, if changed
* Updated comment, if useful


Multi-screenshot batch prompt:
The attached screenshots are parts of one multi-screenshot task.

Transcribe and visually describe each screenshot in attachment order so the final task prompt can reference this written chat content instead of relying on earlier image attachments.

For each screenshot, capture:

* visible instructions and question text;
* answer choices, fields, labels, and visible URLs;
* visually relevant content that could affect later classification;
* page state, selections, warnings, and navigation context.

Separate literal transcription from visual description where useful. Mark anything unreadable or uncertain rather than guessing.

Do not research, rate, interpret, or solve the full task yet. Do not infer hidden behavior beyond what the screenshots show.

Output concise, clearly numbered notes for each screenshot.






























