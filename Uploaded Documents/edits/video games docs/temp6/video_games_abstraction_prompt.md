# Video Games Pre-Processing Abstraction Prompt

Use this prompt before applying `video_games_chat_processing_framework.md` to a completed Video Games rating chat.

```txt
Before processing this completed Video Games rating chat according to `video_games_chat_processing_framework.md` in project context, perform a separate abstraction-selection step.

Do not apply the processing framework yet, do not draft either insertion block, and do not edit the project documents. Your task in this step is only to recommend the abstraction and integration decision that should later control processing.

Use:

- the completed chat history,
- the attached screenshot/OCR if present,
- the final rating comment,
- the current Video Games manual and rating comment guide from project context,
- any verified research already used in the chat.

Treat the final rating comment as the verdict anchor.

Before choosing an abstraction frame:

- Keep visible evidence, verified research, and inference conceptually distinct.
- Identify and research every visible clue that could materially affect the meaning or classification, including names, titles, brands, slogans, acronyms, specialist terms, and ordinary-looking wording with a plausible secondary meaning.
- Search exact wording and useful contextual variants, prefer authoritative primary sources where available, and disambiguate similarly named entities using the task context.
- Do not assume unsupported hidden landing-page or post-click behavior.
- Do not re-open the rating merely because the case is borderline. If visible evidence or verified research materially contradicts the verdict anchor, flag the conflict before recommending a final abstraction frame.

Please do the following:

1. Identify the exact concrete case.

2. Identify the decisive mechanism, evidence relationship, or classification boundary that caused the rating.

3. Separate:
   - features that are causally necessary to the reasoning;
   - supporting evidence;
   - characteristics that merely describe the anchor example.

4. List several possible abstraction levels from narrowest to broadest.

5. For each proposed level, explain:
   - what it captures;
   - what other cases it could validly cover;
   - what it excludes;
   - which included features may merely reflect the anchor example;
   - whether it is too narrow, appropriately reusable, or so broad that it loses the decisive mechanism.

6. Apply this removal test to every feature proposed for the manual-node title, case type, decision shortcut, and use conditions:

   > If the case lacked this feature but retained the same decisive evidence relationship, would the same reasoning still apply?

   If yes, treat that feature as anchor evidence rather than a node-level eligibility condition.

7. Review the existing manual nodes by decisive mechanism, main advertised subject, classification boundary, and evidence relationship—not merely by shared words or superficial subject matter.

8. Recommend whether the manual should:
   - extend an existing node;
   - add a genuinely distinct specialized node;
   - synthesize existing nodes;
   - or create a new node.

   Avoid near-duplicate nodes at slightly different abstraction levels.

9. Recommend the best manual-node abstraction. State:
   - the reusable frame in one sentence;
   - the decisive node-level conditions;
   - the anchor-specific details that should not become eligibility conditions;
   - the point at which further abstraction would lose useful decision logic;
   - the reusable decision principle in one sentence.

10. Assess the rating-comment-guide contribution separately.

   Do not invent a separate abstract “comment-pattern principle.” The guide stores reusable wording rather than abstract rating logic.

   Instead:
   - review the existing comment patterns;
   - identify any genuinely reusable complete template, sentence, clause, phrase structure, hedge, contrast construction, or individual phrase;
   - state the precise condition under which that wording is useful;
   - recommend whether to extend an existing pattern, add a new pattern, or make no guide addition.

11. Finish with a concise handoff block in this exact format:

   **Recommended abstraction handoff**

   - Verdict anchor:
   - Manual-node frame:
   - Decisive node-level conditions:
   - Supporting evidence:
   - Anchor-only details:
   - Point where further abstraction becomes too broad:
   - Existing-node integration recommendation:
   - Reusable decision principle:
   - Comment-guide wording scope:
   - Existing-pattern integration recommendation:
   - Evidence and research basis:
   - Material unresolved findings:

Do not proceed to the processing-framework step. Wait for me to approve or revise the recommended handoff.

Final rating comment:

[PASTE FINAL COMMENT HERE]
```
