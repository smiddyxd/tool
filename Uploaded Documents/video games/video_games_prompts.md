# Video Games External Prompts

These are copy-and-paste operational prompts. Keep them external to the Video Games manual, chat-processing framework, and rating comment style and phrase guide.

Use Prompts 1–4 while rating a task. After a completed case, use Prompt 5, approve or revise its handoff, and then use Prompt 6.

---

## 1. Apply the Video Games Manual

Apply `video_games_manual.md` from project context to this Video Games rating task.

Use the task input, which may be an attached screenshot, OCR text, or both, and execute the manual’s full task-analysis process.

Full task OCR:

[PASTE FULL TASK OCR HERE]

---

## 2. Add Context to the Current Task

Consider this additional context for the current Video Games rating task. The added input may be an attached screenshot, OCR text, or both.

Treat it as additional evidence for the same task. Apply `video_games_manual.md` from project context and compare the new context with the earlier task evidence, verified research, rating, confidence, case-node analysis, and rating comment.

Determine whether it meaningfully changes the rating, confidence, applicable case nodes, research findings, or rating comment.

Keep visible evidence, verified research, and inference conceptually distinct. Do not assume unsupported unseen landing-page or post-click behavior.

If an updated comment is useful, apply `rating_comment_style_and_phrase_guide(1).md` so that the revision remains accurately grounded and consistent with the comment guide.

Output:

- Does this change the rating? Yes / No / Maybe
- Why or why not?
- Research impact, if any
- Updated rating and confidence, if changed
- Updated applicable case-node analysis, if changed
- Updated comment, if useful

---

## 3. Transcribe a Multi-Screenshot Task

The attached screenshots are parts of one multi-screenshot task.

Transcribe and visually describe each screenshot in attachment order so the final task prompt can reference the written chat content instead of relying on earlier image attachments.

For each screenshot, capture:

- visible instructions and question text;
- answer choices, fields, labels, and visible URLs;
- visually relevant content that could affect later classification;
- page state, selections, warnings, and navigation context.

Separate literal transcription from visual description where useful. Mark anything unreadable or uncertain rather than guessing.

Do not research, rate, interpret, or solve the full task yet. Do not infer hidden behavior beyond what the screenshots show.

Output concise, clearly numbered notes for each screenshot.

---

## 4. Get Feedback on a Rating Comment

Give me feedback on my rating comment using `rating_comment_style_and_phrase_guide(1).md` from project context.

Use the current task evidence and any verified research established in the chat. Keep the rating and intended meaning unless the reasoning clearly needs correction. If it does, identify the issue before rewriting the comment.

Review all materially applicable signed-off Video Games patterns and rank them by how directly their wording fits the reasoning that needs to appear. Reuse applicable wording at whatever level fits naturally—complete template, sentence, clause, phrase structure, hedge, contrast construction, or individual phrase—without forcing an entire template.

If no signed-off pattern applies, use natural novel wording.

Focus on making the comment natural, personally written, concise, specific, accurately grounded in the task evidence and verified research, and consistent with the guide.

Briefly explain any important issue and provide a polished version if useful.

Draft comment:

[PASTE DRAFT COMMENT HERE]

---

## 5. Select the Abstraction Before Processing

Before processing this completed Video Games rating chat according to `video_games_chat_processing_framework(4).md` from project context, perform a separate abstraction-selection step.

Do not apply the processing framework yet, draft insertion-ready material, or edit the project documents. Your task in this step is only to recommend the abstraction and integration decisions that should later control processing.

Use:

- the completed chat history;
- the attached screenshot or OCR, if present;
- the final rating comment;
- the current Video Games manual and rating comment guide;
- any verified research already used in the chat.

Treat the final rating comment as the verdict anchor.

Before choosing an abstraction:

- Keep visible evidence, verified research, and inference conceptually distinct.
- Identify and research every visible clue that could materially affect identity, meaning, advertised subject, or classification, including advertisers, developers, publishers, companies, brands, products, games, apps, services, platforms, titles, slogans, acronyms, specialist terms, and ordinary-looking wording with a plausible secondary meaning.
- Search exact wording and useful contextual variants, prefer authoritative primary sources where available, and disambiguate similarly named entities using the task context.
- Do not assume unsupported unseen landing-page or post-click behavior.
- Do not reopen the rating merely because the case is borderline. If task evidence or verified research materially contradicts the verdict anchor, flag the conflict before recommending an abstraction.

Please do the following:

1. Identify the exact concrete case.

2. Identify the decisive mechanism, evidence relationship, main-subject distinction, classification boundary, or assessability problem that caused the rating.

3. Separate:

   - features that are causally necessary to the reasoning;
   - supporting evidence;
   - characteristics that merely describe the anchor case.

4. List several possible abstraction levels from narrowest to broadest.

5. For each proposed level, explain:

   - what it captures;
   - what other cases it could validly cover;
   - what it excludes;
   - which included features may merely reflect the anchor case;
   - whether it is too narrow, appropriately reusable, or so broad that it loses the decisive mechanism.

6. Apply this removal test to every feature proposed for the manual-node title, case type, decision shortcut, use conditions, and do-not-use conditions:

   > If the case lacked this feature but retained the same decisive evidence relationship, would the same reasoning still apply?

   If yes, treat the feature as supporting evidence or anchor detail rather than a node-level eligibility or exclusion condition.

7. Compare the proposed frame with all materially applicable Official guidance, Added guidance, and case-derived nodes.

   Compare them by decisive mechanism, main advertised subject, classification boundary, assessability issue, and evidence relationship—not merely shared wording or subject matter.

   Rank applicable nodes as Direct, Partial, or Broad, and identify their roles as Primary, Supporting, or Contrast where meaningful.

8. Recommend one manual integration direction:

   - new case-derived node;
   - edit or extension to existing Added guidance or a case-derived node;
   - no insertion recommended.

   Preserve Official guidance unchanged. Avoid near-duplicate nodes at slightly different abstraction levels.

   If existing nodes jointly cover the reusable reasoning, treat that synthesis as a basis for “No insertion recommended” and explain which nodes provide the necessary components.

   Recommend a new node only when the reusable causal structure is not already represented clearly enough.

   Prefer an edit or extension when the case sharpens an existing boundary, adds a material variant under the same causal structure, or contributes useful negative direction without requiring a separate abstraction.

   Recommend no insertion when current guidance already handles the case without meaningful loss; the proposed difference is only a new product, advertiser, visual treatment, or other anchor detail; the abstraction would merely restate existing guidance; the abstraction would be too narrow to transfer; or the evidence is too uncertain to support reusable material.

9. Recommend the best manual-node abstraction and state:

   - the reusable frame;
   - the decisive node-level conditions;
   - the supporting evidence;
   - the anchor-specific details that should not become eligibility or exclusion conditions;
   - the point at which further abstraction would lose useful decision logic;
   - the reusable decision principle in one sentence.

10. Assess the rating-comment-guide contribution separately.

Do not invent an abstract comment-pattern principle merely to parallel the manual node. Instead:

- review all existing signed-off Video Games patterns;
- rank all materially applicable patterns by how directly their wording fits the reasoning that needs to appear;
- identify genuinely reusable templates, sentences, clauses, phrase structures, hedges, contrast constructions, or individual phrases;
- state the precise condition under which each proposed wording component would be useful;
- recommend one guide integration direction:
  - new signed-off pattern or wording component;
  - edit or extension to an existing pattern;
  - no insertion recommended.

Prefer an edit or extension when an existing pattern can absorb the useful wording naturally. Recommend no insertion when the wording is already covered, is too case-specific, is not actually signed off, or adds no distinct and safely reusable value.

11. Finish with exactly this handoff:

**Recommended abstraction handoff**

- Verdict anchor:
- Manual-node frame:
- Decisive node-level conditions:
- Supporting evidence:
- Anchor-only details:
- Causal-condition removal result:
- Point where further abstraction becomes too broad:
- Reusable decision principle:
- Relationship to Official guidance, Added guidance, and existing case-derived nodes:
- Proposed manual integration direction:
- Comment-guide wording scope:
- Precise wording-use conditions:
- Relationship to existing guide patterns:
- Proposed guide integration direction:
- Evidence and research basis:
  - Visible evidence:
  - Verified research:
  - Inference:
- Material unresolved findings:

Do not proceed to the processing-framework step. Wait for me to approve or revise the recommended handoff.

Final rating comment:

[PASTE FINAL COMMENT HERE]

---

## 6. Apply the Processing Framework

Apply `video_games_chat_processing_framework(4).md` from project context to this completed Video Games rating chat.

Use the completed chat history, attached screenshot or OCR if present, final rating comment, and user-approved abstraction handoff below.

Treat:

- the final rating comment as the verdict anchor;
- the approved abstraction handoff as fixed controlling input.

Do not independently broaden, narrow, replace, reselect, or otherwise revise the approved abstraction frame or integration decisions. Follow the framework’s complete research, evidence-separation, conflict, integration, and output rules.

Return:

A. Manual integration result
B. Comment-guide integration result
C. Processing record

For each document, use the framework’s permitted result types. An explicit “No insertion recommended” result with `None` as the insertion-ready material is valid and must not be replaced with speculative content.

If the task evidence, verified research, or current project documents materially conflict with the verdict anchor or approved abstraction handoff, flag the conflict before producing insertion-ready material rather than silently changing the rating, abstraction, or integration direction.

User-approved abstraction handoff:

[PASTE APPROVED ABSTRACTION HANDOFF HERE]

Final rating comment:

[PASTE FINAL COMMENT HERE]
