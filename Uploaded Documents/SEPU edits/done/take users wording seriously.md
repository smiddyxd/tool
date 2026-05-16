
## 2. Add a stronger “take the user’s wording seriously” doctrine

### Why

7.md says query wording itself carries intent:

* `[font]` vs `[fonts]` may imply different goals,
* users entered the query the way they did for a reason. 

Your guide is already very strong on specificity and requirements, but it could use a compact principle that stops the model from normalizing away small linguistic choices.

### Suggested addition

Under **Interpretations Table**, **Query Components**, or **Query Meaning**:

> **Respect the user’s wording.**
> Do not silently normalize away wording choices that may shift intent, such as singular vs. plural, action wording, format terms, delivery/service terms, or small modifiers that change what kind of result the user likely expects. These may be weak or strong requirements depending on context, but they should first be noticed rather than erased.

### Benefit

This will improve analysis of:

* singular/plural shifts,
* delivery/service modifiers,
* list-seeking vs definition-seeking queries,
* subtle info-vs-product framing differences.
