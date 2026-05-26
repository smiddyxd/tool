https://chatgpt.com/g/g-p-6a05799613f08191be2b41c4e68c503b-rating/c/6a05f069-ad00-83eb-bb81-588366a402e5

Yes — I’d integrate it as a **query-interpretation guardrail inside the existing Query research paragraph**, not as a separate comparison rule.

The relevant passage in **1.md** is the Q&A on **`Apartment` vs `Piso` in Spain**. The official takeaway is broader than synonym comparison: **a change in language and locale can change meaning, application, and context**, and raters should use locale-specific knowledge when that affects interpretation. The slide’s example says that in Spain, **`piso`** and **`apartamento`** are not interchangeable housing terms, with `apartamento` often implying a smaller dwelling and sometimes a holiday-home connotation.  

I’d replace your current paragraph with this version:

```md
**Query research:** Before analyzing the query, web-search any terms that are not self-evidently common English in the meaning the query intends. The test is not "do I recognize this word" — it is "is the most common everyday-English interpretation of this term the same as its meaning here?" If there's any chance the term is a brand, product line, model number, program name, regional usage, jargon, acronym with multiple expansions, multi-word proper noun, or recent release the model wouldn't reliably know, verify it. When the task locale or query language may affect interpretation, do not default to a generic dictionary or broad English-language reading: locale-specific usage can change what real-world thing, product/service class, or practical intent the query is pointing to. Brand-as-common-word ("Apple," "Coach," "Polo," "Subway," "Dove," "Shell") is a particularly common failure mode — the surface reading produces a coherent-but-wrong subject and contaminates everything downstream.
```

### Why this version works

It keeps the existing section’s function intact:

* **Trigger research when meaning may be unstable**
* **Prevent coherent-but-wrong query interpretations**
* **Frame locale as part of understanding the query itself**, not as a narrow “are these two words synonyms?” rule

I especially like the phrase:

> “what real-world thing, product/service class, or practical intent the query is pointing to”

because it makes the rule useful for this task type specifically. In Product Usefulness, the damage from misreading locale-sensitive language is downstream: you misidentify the query target, then the whole product-match analysis gets warped.
