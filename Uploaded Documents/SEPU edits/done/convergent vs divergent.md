https://chatgpt.com/g/g-p-6a05799613f08191be2b41c4e68c503b-rating/c/6a057fc5-d1b8-83eb-a57e-09ed9ddb37bf

Yes. I think this is a **real upgrade** to the Search Experience to Product Usefulness framework.

Your distinction resolves an ambiguity that the manual currently handles **case by case**, but does not yet name as a general principle:

> **Some product intents are organized around an externally convergent purpose.**
> The user wants a result/state/problem solved. Different mechanisms may still be acceptable if they converge on that purpose.
>
> **Other product intents are organized around an internally divergent purpose-space.**
> The top-level purpose is too broad to discriminate meaningfully, so the **mode/mechanism/form of satisfaction** becomes the real core of the intent.

Or, in your wording:

> **Convergent purposes → evaluate convergent alignment; purpose is the distinguishing quality.**
> **Divergent purposes → evaluate similarity of mechanism; function is the distinguishing quality.**

That should absolutely be integrated into the Product Usefulness manual.

---

# 1. Why this matters for the current manual

The manual already has the raw ingredients:

* **Purpose** and **Function** as separate Product Assessment dimensions.
* A **Relatedness vs Intent Satisfaction** ladder.
* A **Substitute acceptability** test.
* Requirement-weight heuristics for:

  * core function/category,
  * use-case,
  * style/aesthetic,
  * price/tier,
  * etc.   

But it does **not yet explain when purpose should dominate substitute evaluation and when function/mechanism should dominate it**.

That is the missing meta-rule.

---

# 2. The key distinction

## A. Convergent-purpose domains

These are domains where the user’s intent points toward a **bounded external outcome**.

The product exists to:

* solve a problem,
* complete a task,
* produce a practical result,
* remove an obstacle,
* enable a specific real-world function.

Examples:

* remove limescale,
* keep mosquitoes away,
* cool a room,
* relieve muscle pain,
* charge a device,
* store clothes,
* clean a stain.

In these domains:

> The **purpose/end-state** is the main thing that matters.
> Different mechanisms may still be acceptable if they converge on the same purpose.

### Example

`[analog wristwatch] → digital wristwatch`

The manual already treats this as **Okay** because the main end-purpose — timekeeping — remains intact, even though the mechanism/form differs. 

That is a **convergent-purpose** judgment.

---

## B. Divergent-purpose domains

These are domains where the top-level purpose is **broad, diffuse, hedonic, expressive, or experiential**.

The user is not simply trying to produce one external result. They are selecting a **mode of experience**.

Examples:

* games,
* books,
* movies,
* music,
* perfumes,
* fashion aesthetics,
* decorative objects,
* collectible goods,
* hobby experiences.

The broad purpose may be:

* entertainment,
* self-expression,
* ambiance,
* enjoyment,
* identity signaling,
* sensory pleasure.

But that purpose is **too broad to be discriminative**.

So:

> The real core intent is often carried by **mechanism, genre, style, format, interaction loop, aesthetic grammar, or sensory profile**.

### Game example

The webinar says:

* Candy Crush and Call of Duty overlap in “entertainment,”
* but the way they fulfill entertainment is too different for **core functionality overlap**,
* while a puzzle game → another puzzle game might rate higher. 

That is exactly your divergent-purpose model.

---

# 3. The philosophical structure

I would formalize it like this:

| Intent structure       | What is stable?                           | What distinguishes good vs bad substitutes?            |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Convergent-purpose** | The desired end-state/problem solved      | **Purpose alignment**                                  |
| **Divergent-purpose**  | The broad umbrella purpose is too diffuse | **Mechanism / mode / experiential function alignment** |
| **Hybrid**             | Both matter                               | Whichever axis the query foregrounds                   |

---

# 4. Why “purpose” and “function” should mean different things in the manual

This insight also lets the manual clarify its currently under-defined **Purpose** and **Function** rows.

Right now the Product Assessment section says to evaluate:

* Intent,
* Purpose,
* Function,
* Context of use,
* etc. 

But without a sharper distinction, **Purpose** and **Function** can collapse into vague paraphrases of each other.

I would define them like this:

## Purpose

> **The end-state, problem solved, or user outcome the product is meant to serve.**

Examples:

* “remove ice from a windshield”
* “tell time”
* “provide entertainment”
* “decorate a birthday party”

## Function / mechanism / mode

> **The way the product delivers that value — its operative method, experience structure, interaction loop, form of use, or satisfaction mechanism.**

Examples:

* scraper vs spray de-icer,
* analog vs digital display,
* match-3 puzzle loop vs first-person shooter loop,
* gothic dress silhouette vs generic black lace dress,
* vanilla gourmand perfume vs fresh aquatic scent.

Then add:

> **Which of these matters more depends on the purpose structure of the domain.**
> In convergent-purpose domains, Purpose is often the decisive axis.
> In divergent-purpose domains, Function / mode / mechanism is often the decisive axis.

This would make those Product Assessment rows much more analytically useful.

---

# 5. The strongest manual-level addition: a new “Purpose-Structure Lens”

I would add a new Part 1 concept section, probably under **Heuristic Overview**, called:

# Purpose-Structure Lens: Convergent Purpose vs Divergent Purpose-Space

### Suggested manual wording

> Product categories differ in the structure of the user intent they support.
>
> **Convergent-purpose domains** are organized around a bounded end-state, task, or problem to solve. The user primarily cares about reaching the intended outcome. In these domains, substitute evaluation should focus heavily on **purpose alignment**: does the shown product plausibly achieve the same practical goal, even if the mechanism, form, or implementation differs?
>
> **Divergent-purpose domains** are organized around a broad top-level purpose that contains many internally distinct modes of satisfaction. Entertainment, self-expression, ambiance, taste, and identity are common examples. In these domains, the umbrella purpose is often too vague to establish strong usefulness by itself. Substitute evaluation should focus more heavily on **function / mechanism / mode alignment**: does the shown product preserve the specific kind of experience, style, interaction, sensory profile, or internal category slice the user appears to want?
>
> Many domains are **hybrid**. A product can serve a practical purpose while also carrying a strong aesthetic, experiential, or identity-bearing dimension. In hybrid cases, determine which axis the query foregrounds and weight misses accordingly.
>
> **Key rule:** Shared broad purpose is stronger evidence in convergent-purpose domains than in divergent-purpose domains. In divergent-purpose domains, preserving only the umbrella purpose often shows relatedness, not substitute acceptability.

---

# 6. How this changes substitute evaluation

The manual’s current substitute logic asks:

> Does the product still work as a plausible substitute for most users with this query? 

Your insight tells us **what “works as a substitute” should mean in different domain types**.

## In convergent-purpose domains

Ask:

> **Does the product converge on the same end-goal in a user-plausible way?**

Examples:

* `[remove kettle limescale]` → descaler liquid vs citric-acid descaler powder
  likely strong substitute
* `[cool bedroom at night]` → fan vs portable AC
  same purpose, different mechanism; maybe Okay depending on expectations
* `[how to remove red wine stains]` → fabric protector spray
  **not** a good substitute, because the purpose is prevention, not removal — the manual already treats this as low Poor. 

So in convergent domains, the question is not:

* “Is this the same kind of object?”

It is:

* “Does it actually get the user to the same intended result?”

---

## In divergent-purpose domains

Ask:

> **Does the product preserve the same mode of satisfaction?**

Examples:

* `[Candy Crush]` → Call of Duty
  broad entertainment preserved, but the satisfaction mechanism diverges radically → weak
* `[puzzle game]` → another puzzle game
  stronger preservation of the user’s intended entertainment mode
* `[victorian gothic dress]` → modern black dress with lace trim
  same broad clothing purpose, but the specific aesthetic mechanism is wrong; the manual already treats this as a failure on purpose, not just a weak style miss. 

So in divergent domains, the question is not:

* “Does this also entertain / decorate / express?”

It is:

* “Does this do so in the *same way* the user appears to be seeking?”

---

# 7. This should modify “Relatedness vs Intent Satisfaction”

The manual currently says:

1. shared words / same theme
2. same aisle / same problem space
3. plausible substitute / goal-advancing product
4. actual match 

I would add this paragraph directly below that ladder:

### Suggested addition

> **Purpose-structure guardrail:**
> In **convergent-purpose** domains, a product may climb from same-problem-space into plausible-substitute territory when it reaches the same practical end-state through a different but user-plausible mechanism.
>
> In **divergent-purpose** domains, preserving only the broad umbrella purpose is usually not enough to reach plausible-substitute territory. The product should also preserve the relevant **mode of satisfaction**, such as genre, gameplay loop, aesthetic language, sensory profile, format, or other mechanism-level structure that gives the query its meaningful internal specificity.

That one paragraph would prevent a lot of overrating.

---

# 8. This should modify Requirement Analysis

The manual currently has:

* Core product function / category
* Compatibility
* Exclusions
* Demographic
* Use-case
* Material / ingredient / style / aesthetic
* Price / tier
* Brand / product line
* Retailer / platform 

I would add a new requirement type:

## New requirement type: Mode / mechanism / experiential structure

### Suggested table row

| Requirement type                              | Default weight | Strong when                                                                                                                                                                                          | Population-overlap implication                                                                                     |
| --------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Mode / mechanism / experiential structure** | Medium         | The domain has a divergent-purpose structure and the query’s genre, interaction loop, aesthetic grammar, sensory profile, format, or method is how the user specifies the desired kind of experience | Missing it can exclude a large share of users even when the parent category or broad umbrella purpose is preserved |

### Examples

* game genre / gameplay loop,
* perfume scent family,
* music/media genre,
* collectible format,
* fashion aesthetic,
* hobby mode,
* book tone/genre.

---

# 9. It should also refine the existing “style/aesthetic” heuristic

Current manual wording says style/aesthetic is usually weak-to-medium, strong only when it is the point of the product or changes authenticity/tier/performance. 

Your insight shows a more general rule:

> In divergent-purpose domains, style/aesthetic is often not a decorative side-spec. It may be the **main mechanism by which the product satisfies the user’s intent**.

### Suggested revision

Current idea:

> Material / ingredient / style / aesthetic: weak to medium by default; strong only when the material or style is the point of the product...

Better:

> Material / ingredient / style / aesthetic: weak to medium by default in ordinary functional goods. Treat as strong when it is the point of the product, changes performance, signals authenticity/tier, carries safety or ethical meaning, **or serves as the main mode-bearing feature in a divergent-purpose domain**.

That would formally justify why:

* gothic vs generic black dress can be a major miss,
* cozy farming game vs shooter is a major miss,
* a very different perfume family is not a casual preference miss.

---

# 10. It should affect Population Overlap estimates

The manual’s population-overlap section already warns that every real narrowing dimension must be separately accounted for and that style/aesthetic can be a narrowing axis. 

Your insight improves that section:

> In divergent-purpose domains, genre/style/mode should often be treated as a **large population filter**, not as a light preference factor.

### Suggested addition to population-overlap guidance

> In divergent-purpose domains, do not assign high acceptance to a result merely because it preserves the broad parent category. A mode-bearing miss — such as game genre, experiential format, aesthetic family, or sensory profile — may exclude a large portion of the query population because the user’s intent is distributed across internally distinct slices of the domain rather than converging on one external outcome.

This is especially useful for:

* game genres,
* music genres,
* perfume categories,
* fashion aesthetics,
* collectible formats.

---

# 11. Add a “Purpose-Structure Test” to Substitute & Compatibility Tests

I think this is the most operationally valuable template-level addition.

### Suggested subsection

## Purpose-Structure Test

Run this test when the query and product share a broad purpose or category, but differ in mechanism, mode, genre, style, sensory profile, or product form.

| Field                       | Assessment                                      |
| --------------------------- | ----------------------------------------------- |
| Intent structure            | convergent-purpose / divergent-purpose / hybrid |
| Query’s distinguishing axis | end-goal / mechanism-mode / mixed               |
| What the product preserves  | purpose / mechanism-mode / both / neither       |
| What the product misses     | [brief description]                             |
| Substitute implication      | why the preserved overlap is or is not enough   |

### Decision rule

* **Convergent-purpose:** purpose alignment can sustain substitute acceptability despite mechanism differences.
* **Divergent-purpose:** mechanism/mode alignment is usually required; shared umbrella purpose alone rarely sustains a strong substitute reading.
* **Hybrid:** weight whichever axis the query foregrounds.

This would plug directly into the manual’s existing **Substitute & Compatibility Tests** section. 

---

# 12. Add two synthesis indicators, but only when load-bearing

I would **not** force this into every task, because the manual is already large. But when the rating depends on purpose vs mechanism, the **Rating Synthesis** could include:

| Indicator               | Reading                                                  |
| ----------------------- | -------------------------------------------------------- |
| Purpose structure       | convergent-purpose / divergent-purpose / hybrid          |
| Primary substitute axis | end-goal convergence / mechanism-mode similarity / mixed |

This gives the final synthesis language to say:

* “Same problem end-state, different acceptable mechanism”
* or
* “Same broad entertainment umbrella, but mechanism-mode mismatch prevents substitute acceptability.”

---

# 13. This also clarifies “same category” cases

The manual already says:

* same product category avoids Egregious under standard machinery,
* but the case can still be Poor if it misses use-case or other important requirements. 

Your insight clarifies **why**:

## In convergent-purpose domains

Same category + same end-goal can often rise toward Okay.

## In divergent-purpose domains

Same parent category may only preserve broad domain overlap.
It does **not** automatically imply good substitute quality.

So:

* `[puzzle game]` → shooter game
  same broad category, but internal mode mismatch → likely Poor, not Okay.
* `[analog wristwatch]` → digital wristwatch
  different mechanism/form, but same convergent end-purpose → Okay can make sense.  

That is a clean contrast.

---

# 14. The hybrid case is especially important

Many products are neither purely convergent nor purely divergent.

## Example: watches

* Convergent dimension: tell time.
* Divergent dimension: fashion/status/aesthetic.

`[analog wristwatch] → digital wristwatch`

* timekeeping preserved,
* analog form missed,
* still Okay in the manual. 

But:
`[vintage gold dress watch] → modern rubber sports watch`

* convergent purpose still preserved,
* but the query foregrounds the divergent aesthetic/status dimension,
* likely Poor.

## Example: running shoes

* Convergent dimension: running performance.
* Divergent dimension: brand, fit feel, styling, training identity.

The substitutability webinar’s Nike → Adidas example works because:

* same use-case,
* same performance category,
* similar quality/tier,
* brand differs but the end-goal and product role align well enough. 

So hybrid domains require:

> **Which axis does the query foreground?**

That question deserves to be explicit in the manual.

---

# 15. One concise model for the manual

I would summarize the whole insight as:

> **When judging substitutes, first ask what kind of sameness the query is asking for.**
>
> * If the domain is **purpose-convergent**, sameness means **convergence on the same intended result**.
> * If the domain is **purpose-divergent**, sameness means **preserving the same mechanism or mode of satisfaction**.
> * If the domain is **hybrid**, the query tells you which axis is load-bearing.

That may be the most valuable sentence to add.

---

# 16. My recommendation: exactly what to change

## Definitely add

1. **New Part 1 concept:** Purpose-Structure Lens.
2. **Clarifying definitions** of Purpose vs Function in Product Assessment.
3. **New Requirement Analysis row:** Mode / mechanism / experiential structure.
4. **New note in Relatedness vs Intent Satisfaction** about convergent vs divergent domains.
5. **Purpose-Structure Test** in Substitute & Compatibility Tests.

## Strongly consider adding

6. A note in Population Overlap that mode/genre/style can be a large rejection factor in divergent domains.
7. Optional Rating Synthesis indicators for purpose structure and substitute axis when relevant.

---

# 17. The strongest conceptual payoff

This addition would prevent two opposite failure modes:

## Failure mode 1: overrating divergent-domain substitutes

> “Both are games, so this is a decent substitute.”

No — if the entertainment mode is different, the shared top-level purpose is too weak.

## Failure mode 2: underrating convergent-domain substitutes

> “Different product form, so this is not useful.”

No — if the query is goal-framed and the alternative reaches the same end-state plausibly, it may be a good substitute.

That is exactly the generalization your insight unlocks.
