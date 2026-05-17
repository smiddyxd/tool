# Search Experience to Product Usefulness — Concept Guide + Analysis Template
**Source:** Telus Digital, April 2024 | **Task:** Rate how useful a product result is for a given search query

This file has two parts. Part 1 is the concept reference (definitions, tiers, calibration). Part 2 is the analysis template that is executed per task and references Part 1 by section name throughout.

---

# PART 1 — CONCEPT REFERENCE

## Overview

You are evaluating the **product** shown in a search result — not an ad creative. This is distinct from "Search Experience to Ad Usefulness." Always focus on the actual product being presented.

**Rating scale:** Egregious → Poor → Okay → Good (continuous slider)

**Worksheet heuristic (color-coded grid):**
- ≥1 red answer → Egregious
- No red + ≥1 yellow → Poor
- No red/yellow + mix of green/blue → Okay
- All/nearly all blue → Good

**Worksheet questions:**
| Question | Egregious | Poor | Okay | Good |
|---|---|---|---|---|
| Before interacting, could product ever be useful? | Could never be useful | — | Could be, unsure yet | — |
| Does product match a reasonable interpretation of query? | Unrelated / misinterpretation | Possible but unlikely interpretation | Related to reasonably likely interpretation | Related to very likely interpretation |
| How closely does product address user intent? | Not at all related | Only distantly, doesn't address intent | Addresses nearby intent approx/indirectly | Addresses user intent exactly |
| How well does product satisfy query requirements? | Misses 1+ necessary requirements, no acceptable alt | Misses 1+ important requirements, not an acceptable alt | Misses 1+ but offers good substitute, missed ones aren't important | Meets all requirements |
| Does product offer an alternative to what user seeks? | No solution at all | Unacceptable alt / tries to meet needs in radically different way | Reasonable alt with meaningful differences | Exactly what user seeks / good alt |

This is a rough pre-filter, not the primary evaluation tool. The later position calibration framework handles detailed placement.

---

## Key Definitions

**Necessary requirement** — Essential to query intent at the category level. Remove it and the query loses intelligible product-seeking meaning entirely — not merely broadens to a larger category. If removing the requirement leaves a coherent product-seeking query with the same category substrate, the requirement is Important, not Necessary. The test is collapse vs. generalization: does removal destroy the query, or just widen it?
- *Ex: [leather boots] → "boots" is necessary. Remove it and "leather" has no coherent product intent — collapse.*
- *Ex: [original The Beatles concert poster] → "The Beatles" is Important, not Necessary. Remove it and "original concert poster" remains a coherent product-seeking query — generalization, not collapse. The band narrows which concert poster; it does not define whether this is a product-seeking query at all.*

**Applying Necessary correctly.** Remove-and-check is the test — strike the term from the query and see if the remainder is still a coherent product search. Product category (and its absolute functional properties) typically survives; retailer, brand, price tier, and style/material/temporal qualifiers fail it. [leather boots from REI] without "REI" is still a coherent query, so "REI" is Important at most, not Necessary. Missing Important-tier constraints lands in the Poor-to-Okay range via Brand/Retailer/Platform Logic and substitute acceptability — not in Egregious via a Necessary floor. The single exception is compatibility/fitment: when a product is functionally unusable without the fitment anchor, fitment becomes Necessary-by-function even though the reduced query is grammatically coherent.

**Important requirement** — Substantially shapes the product's character, suitability, or tier. ◆ Remove it and the query still has clear meaning, but the product becomes a meaningfully different thing. ◆ Whether missing an important requirement produces Poor or Okay depends on whether the substitute is acceptable — the requirement carries enough weight that the miss *might* derail a substitute, and you have to evaluate whether it did. ◆
- *Ex: [leather boots] → "leather" is important. Without it, [boots] still makes sense, but the product's character shifts — leather defines a price tier, aesthetic, and durability profile. Whether a substitute is acceptable depends on how far it drifts: faux leather may be borderline, rubber wellington boots are clearly Poor.* ◆

**Preferential requirement** — A real specification that narrows choice, but the product's core character and function are preserved without it. ◆ Whether missing a preferential requirement lands at Good or Okay depends on how much the miss matters to the user's experience. ◆ Slight misses stay at Good — the product is still what the user wanted, without meaningful differences. More noticeable misses drop toward Okay — the product still works, but the user is getting an acceptable alternative rather than a match. ◆
- *Ex: [realme watch s charger original] → "original" is preferential. A compatible charger addressing the brand and model but not explicitly claiming 'original' is still a great experience for the user, because the user would not feel they'd been shown the wrong thing — the miss is slight enough to stay at Good.* ◆
- *Ex: [wooden cutting board] → "wooden" is preferential. A bamboo substitute serves the same function, and no cutting board material shifts the product's character enough to reach Poor — but bamboo is a noticeable enough departure from what was asked for that it drops toward Okay rather than staying at Good.* ◆

◆ **How the three tiers relate to the worksheet:** The worksheet's "How well does product satisfy query requirements?" row maps as follows: missing a necessary requirement → Egregious (the product can't satisfy the query's core identity). Missing an important requirement → Poor *if* the substitute is unacceptable, but Okay *if* the substitute still works — the worksheet's Poor column says "not an acceptable alt," and that conjunction matters. Missing only preferential requirements → Good if the miss is slight enough that the product remains a great experience, Okay if the miss is noticeable enough that the product feels like a substitute rather than a match. ◆ The worksheet's "missed ones aren't important" captures this range — the misses don't carry enough weight to reach Poor, but how much friction they introduce determines where within Good-to-Okay the product lands. ◆ The key insight is that important requirements sit in a contested zone: the same miss can produce different ratings depending on the specific substitute. ◆

---

## Rating Tiers (Short)

### GOOD
> Product is an exact match for all query terms. Extremely likely to be useful.

### OKAY
> Not an exact match, but somewhat likely to be useful. Well related to user's overall goal or intent.

### POOR
> Unlikely to be useful despite a connection to the query. Does not address the purpose/function of what user is seeking.

### EGREGIOUS
> Very unlikely or impossible to be useful for the given query.

---

## Task Categories ‡

Personal taxonomy — not exhaustive, open to expansion. ‡

**Substitute quality:** ‡
- Bad substitute (Poor): tries but fails to be a substitute, to whatever degree ‡
- Same problem space / relevant product (Okay): not a substitute, but part of the same problem space and relevant enough to show in context ‡

**Product–accessory relationships:** ‡
- Product vs. accessory: the task involves a product and a closely related product such as an accessory, part, or consumable. ‡ Directionality doesn't matter — either can be the query or the shown product. Compatibility doesn't affect whether this category applies; the relationship is purely conceptual. ‡ *Ex: PS5 and PS5 controller, coffee machine and ground coffee, car and car part.* ‡
- Accessory vs. accessory: both query and product relate to a third thing as accessories, parts, or consumables — neither is the main product itself. ‡

**Query–product specificity:** ‡
- Generic query vs. specific product match ‡
- Specific query vs. specific product match ‡

---

## Guideline Concepts ‡

Official concept labels from the task guidelines. The position calibration below provides evaluative depth for each. ‡

**Poor:** ‡
- Product Seeking – Related product result but does not match purpose / function
- Product / Product group – slightly connected result (unhelpful)
- Information Seeking – Product (unhelpful)
- Retailer / Brand – Product from unacceptable alternative retailer / brand

**Okay:** ‡
- Product Seeking – Result is a viable substitute / relevant product
- Information Seeking – Result is a relevant product
- Retailer / Brand – Product from acceptable alternative retailer / brand

**Good:** ‡
- Match – Plausible Intent – Product (generic)
- Match – Plausible Intent – Product (specific)
- Match – Plausible Intent – Product
- Match – Retailer / Brand – Product

---

## Query Ambiguity — Bounded vs. Unbounded

Query ambiguity is separate from query coherence. A query can be coherent as written while still failing to provide a sufficiently bounded intent space for confident usefulness analysis.

After research, a query should fall into one of three interpretive states:

- **None / research-resolved** — the query has a stable enough operating meaning to support ordinary downstream analysis, whether that meaning was obvious from the surface or clarified through research.
  - Examples: `[bloop]`, `[grrm]`, `[9780553211764]`, `[8675309]`.

- **Ambiguous (bounded)** — the query has several reasonable, identifiable interpretations, but they form a small and coherent enough set that the task remains rateable.
  - Example: `[java]` could plausibly refer to coffee, the programming language, or the island.
  - A product that fits one genuinely reasonable branch may be evaluated against that branch. Ambiguity itself is not a defect.

- **Ambiguous (unbounded)** — even after research, no stable likely intent or bounded set of plausible interpretations emerges.
  - This includes queries whose possible meanings remain too scattered to anchor a rating, such as `[clip]` or `[mrrg]`, and apparent strings whose meaning remains unsupported after research, such as `[kwortle]`, `[k9787738]`, or `[7586930]`.
  - Do not invent a product-friendly interpretation merely to make the result seem more useful. A product that only fits a speculative or unsupported reading receives little or no interpretive credit for that fit.

## Heuristic Overview

The framework's standard machinery runs to completion before any categorical-miss evaluation. Categorical-miss subtypes (defined in **Categorical Miss Subtype Assessment** at the end of Part 2) operate as overrides on top of the standard-machinery rating, evaluated at the end of the analysis — not as a gating diagnosis at the start. This prevents premature regime commitment from contaminating the standard analysis.

The standard machinery runs on a small set of recurring principles:

Addressing user intent pushes a rating up significantly. Mere relatedness pushes it up only somewhat. This single gradient operates at every tier of the scale — at the bottom it distinguishes commercial domain overlap from topical overlap, in the middle it distinguishes functional substitutes from thematically adjacent products, at the top it distinguishes products that serve the user's actual need from products that are just in the right category.

**Purpose-structure polarity.** Product domains differ in what kind of similarity most naturally preserves user intent during substitute evaluation.

- **Purpose-convergent domains** are organized around a bounded outcome, task, or problem to solve. In these domains, substitute quality is often driven primarily by **purpose convergence**: does the shown product plausibly reach the same end-state, even if the mechanism, implementation, or form differs?
- **Mechanism-divergent domains** are organized around a broad umbrella purpose that contains many internally distinct modes of satisfaction. Entertainment, self-expression, sensory pleasure, aesthetic identity, and hobby experience often behave this way. In these domains, broad-purpose overlap is weak by itself; substitute quality depends more heavily on **mechanism / mode / form-of-satisfaction preservation**.
- **Mixed domains** contain both structures. Watches, shoes, furniture, tools with aesthetic identity, and many consumer electronics can have a practical-purpose axis and a mechanism/style/experience axis at the same time.

**Default polarity and query shift.** Treat purpose structure as a two-step composition:

1. **Domain-default polarity** — the category carries a weak prior toward purpose-convergent, mechanism-divergent, or mixed substitute evaluation.
2. **Query-induced polarity shift** — the query may reinforce, weaken, or reverse that default through modifiers that foreground an outcome, a mechanism, a form, a genre, an experiential mode, a style, or another load-bearing axis.

The final **operative substitute axis** is whatever survives after combining the domain default with the query wording.

- In a normally purpose-convergent domain, `[manual hand-crank coffee grinder]` shifts the substitute axis toward mechanism/form; an electric grinder preserves the broad purpose but misses the foregrounded mode.
- In a normally mechanism-divergent domain, `[games to relax after work]` shifts the substitute axis toward purpose/outcome; different game genres may become more substitutable if they plausibly converge on the requested relaxed-use goal.
- In a mechanism-divergent case like `[puzzle game] → military shooter game`, preserving only the umbrella purpose of “entertainment” is usually not enough; the query’s meaningful internal slice of the domain has changed.

**Guardrail:** Domain-default polarity is not an unstated query requirement. It is a substitute-evaluation prior used to decide what kind of overlap is most meaningful when the query/product relationship turns on purpose versus mechanism. Broad generic queries remain broad unless the query itself narrows them.

Query specificity determines the range width available. Generic queries compress toward the center of the scale because they're less discriminatory — there's less to get wrong. Specific queries produce a wider, more decentral range because each requirement either hits or misses, and the cumulative effect is more pronounced.

Within specific queries, not all requirements weigh equally. The question is: relative to the item and the query context, how explicit does a requirement feel? Color might be a preference, dimensions might be a hard requirement due to physical constraints. The same attribute can shift weight depending on the query — "blue running shoes" makes color soft, a [hi-vis yellow work vest] makes color hard — it's a safety requirement, legally mandated. † Explicit negative requirements (vegan, excluding a brand) are almost always stronger than positive ones by default, because the user was actively filtering. When an explicit exclusion is violated — the product contains or *is* the excluded element — the result is Poor. The user's constraint isn't a preference; it's a filter, and the product failed it. *Ex: [gluten-free bread] → standard wheat bread = Poor.* †

◆ The three requirement tiers — necessary, important, preferential — determine how much risk a miss carries, not a deterministic rating. Missing a necessary requirement collapses the match entirely (Egregious floor). Missing a preferential requirement stays within the Good-to-Okay range — the product's core identity is preserved either way, and the rating depends on how much the miss matters. A slight preferential miss like "original" in [realme watch s charger original] stays at Good — the product is still a great experience, because the user would not feel they'd been shown the wrong thing. A more noticeable one like *[wooden cutting board] → bamboo cutting board* † drops toward Okay — the function is identical but the user is getting a recognizable substitute. Missing an important requirement is the contested zone: the same miss can produce Poor or Okay depending on whether the substitute is acceptable. [Left-handed guitar] → right-handed guitar † is Poor because the instrument is functionally wrong for the user — the important requirement "left-handed" defines usability and no substitute works. But [analog wristwatch] → digital wristwatch † is Okay because the main function (timekeeping) is preserved despite "analog" being important — the substitute is acceptable. ◆

Some contextual qualifiers can also reclassify a requirement's weight. A demographic qualifier can elevate what would normally be a preferential requirement (like product form) into an important or even necessary one, ◆ if the specified demographic makes the form impractical. *Ex: [arthritis-friendly jar opener] → standard twist-grip opener = Poor* † — the demographic implies reduced grip strength, so the standard form defeats the product's entire purpose. Similarly, a product that borrows aesthetic elements from a queried style without actually being that product type fails on purpose, not just spec: *[victorian gothic dress] → modern black dress with lace trim = Poor.* † The product is style-inspired, not a style match.

Brand and retailer queries follow a tier-spanning pattern worth naming explicitly. A bare brand query (e.g., [dyson]) † with any product from that brand = Good — the brand name signals commercial intent, and any product from the brand satisfies it. A product from a similarly functioning alternative brand = Okay (e.g., [bose] → Sony headphones). † A product from a brand with a significant gap in tier, specialization, or positioning = Poor (e.g., [Herman Miller Aeron] → cheap mesh office chair from Amazon). † The same axis applies to price tier and temporal positioning: high-end vs. budget, vintage vs. modern — *[vintage levis 501s] → brand new primark jeans = Poor* † — two products can share a category and function identically, yet the gap in brand positioning or price tier makes substitution implausible.

### Requirement-weight heuristics for common requirement types

Use these heuristics as a starting point before assigning **Filter Strength**, tier, and population-overlap factors. They do not override the full tier tests; they prevent accidental over-weighting of easy-to-name constraints like brand and retailer.

**Core product function / category.** Usually the strongest axis. If the requirement defines what the product does — especially for inherently functional goods such as auto parts, chargers, filters, printer cartridges, tools, medicines, safety equipment, and replacement components — treat the requirement as strong and often compatibility/fitment-sensitive. Missing it can make the product unusable, not merely different.

**Compatibility / fitment / system lock-in.** Strong by default when real-world use depends on the anchor: year/make/model for auto parts, device model for batteries or cases, printer model for toner, pod system for coffee, console/platform for games. Same broad category or same brand is not enough when fitment breaks.

**Explicit exclusions and safety/compliance constraints.** Strong by default. "No X," "without X," "gluten-free," "vegan," "non-toxic," high-visibility workwear, child safety, medical/pet constraints, or legally/safety-relevant specs are active filters, not soft preferences.

**Demographic / recipient constraints.** Weak to medium when they merely describe audience; strong when the product form would not work for the demographic. "For kids" can be strong for sizing/safety; "for dad" is usually a gift-audience cue, not a hard product constraint.

**Use-case / application.** Medium by default, strong when the product would fail the job. "For hiking" on a jacket is medium-to-strong depending on weather/terrain demands; "for paper crafts" on glue is strong because construction adhesive changes the use case completely.

**Material / ingredient / style / aesthetic.** Weak to medium by default in ordinary functional goods. Strong when the material or style is the point of the product, changes performance, signals authenticity/tier, carries safety or ethical meaning, **or serves as the main mode-bearing feature in a mechanism-divergent or query-shifted case**. Color is usually weak unless it is safety-coded, uniform-coded, brand/signature-coded, or the main decorative point.

**Mode / mechanism / experiential structure.** Medium by default, but strong when the domain is mechanism-divergent by default or when the query shifts evaluation toward mechanism/form. This includes genre, gameplay loop, interaction mode, sensory profile, experiential format, aesthetic grammar, or product mechanism when those features define the user's intended way of being satisfied. Missing this axis can exclude a large share of users even when the broad parent category or umbrella purpose is preserved.

**Price tier / market tier.** Medium by default, strong when the query clearly targets a prestige, budget, professional, vintage, luxury, or collectible tier. A large tier gap can make an otherwise functional substitute unacceptable.

**Freshness / recency / currentness.**
Treat recency as rating-relevant when the query explicitly asks for the latest, newest, current, this-year, or otherwise time-sensitive version of a product or product information.

For generic queries with no temporal signal, do not assume only the most recent version can satisfy the user; however, a clearly outdated result may still lower confidence or position within a band when currentness is reasonably implied by the product context.

**Brand / manufacturer / product line.** Usually weak-to-medium as a filter when the product category and function are preserved. Treat it as strong only when the brand/product line is itself the thing being sought, encodes compatibility/ecosystem lock-in, authenticity, collectibility, official/licensed status, safety/trust, prestige/tier, or a uniquely recognizable design/function. Do not mark a positive brand term strong merely because it is explicit.

**Retailer / platform.** Usually weak-to-medium as a filter. Treat it as strong only when the retailer/platform is part of the actual need: in-stock at that retailer, pickup/returns, marketplace trust, membership pricing, gift card use, store-exclusive product, regional availability, official storefront, or a query about that retailer's assortment. If the product is otherwise equivalent and another reputable retailer would normally work, the retailer factor should be light.

**Multiple soft commercial constraints.** Do not multiply brand, manufacturer, and retailer as if each independently excludes most users unless each one encodes a different real constraint. When they point to the same commercial idea — e.g., a licensed product line sold at a known retailer — use high acceptance rates for interchangeable axes or merge them conceptually in the explanation while keeping separate factors if the template requires separate factors.

A quick binary for borderline Okay/Poor calls: would most users with this query be satisfied — or redirect their intent — after seeing this product? Scope "most users" against the full query population, not a sub-segment matching the product profile (see Substitute acceptability test > Population framing). If no → Poor. If yes, even imperfectly → Okay.

### Query-type framing guardrails

**Core principle — query type is a matter of framing.** Classify the query by what it is, as a whole, framed as the user trying to obtain, access, or have fulfilled — not by whichever isolated noun sounds most product-like or service-like.

- **Product** — the query is framed around finding or acquiring a physical or digital item. This includes apps when the query is explicitly about the app itself, even if the app later facilitates shopping, delivery, or some other service.
  - `[sephora lipstick]`
  - `[Taylor Swift tickets]`
  - `[ubereats app]`

- **Service** — the query is framed around booking, delivery, a transaction process, or human/business fulfillment. A product may be involved, but the service route is what defines the query.
  - `[hilton hotel rooms]`
  - `[pizza delivery]`
  - `[realtor]`
  - `[renting in Bergenfield]`
  - `[ticketmaster]`

- **Retailer-Brand** — the query names a brand, retailer, or organization without itself explicitly framing a product or service. Do not classify a bare commercial entity as Product merely because it sells products, or as Service merely because it provides customer-facing services.
  - `[Sephora]`

- **Information** — the query is framed around learning, checking, comparing, ranking, or finding out. It remains informational even when the subject matter is commercial or shopping-adjacent.
  - `[best food processors]`
  - `[cost of X]`
  - `[X reviews]`

- **Other** — use only when the query is not naturally captured by the above frames.

**Borderline guardrail.** Some queries require case-by-case judgment rather than a blanket category rule. Tickets are the clearest example: `[Taylor Swift tickets]` is most plausibly product-like, because the ticket is the immediate object of acquisition; `[ticketmaster]` is more service-like, because the platform is primarily a route for ticket purchasing and fulfillment. The same principle applies elsewhere: identify the query’s framed object, not just the domain it touches.

Info queries (and likely service queries) are compressed at the top, maxing out at okay. The evaluation question shifts from requirement matching to: does the product help them with their info/service intent, or is it just related? Addressing intent pushes up significantly within the compressed range; relatedness pushes up only somewhat. Service is a hybrid — it has the commercial frame of product queries but the conceptual fuzziness of info queries, so it gets the info ceiling but can be evaluated with product-query logic where requirements are identifiable.

### Info Query Compression Tiers

Info queries cap at Okay but compress differently based on commercial proximity:

- Normal info query (how does X work, why does Y happen) — caps around mid okay.
- Commercial-in-spirit info query (best X, X reviews, X comparison) — caps around high okay.
- Transaction-framed info query ([price of X at Y], [cost of X], [X in stock at Y], [when is X on sale]) — caps at Okay but reaches high okay more readily when the product-side match is strong.

Classification stays informational across all three tiers. Do not reclassify a query as Product just because shopping intent is obvious — the informational framing is genuine and determines the ceiling.

**Transaction-framed queries and requirement analysis.** These queries share structure with product-seeking queries and use the product-query machinery to diagnose retailer, brand, and price-tier misses — meaning a missed retailer is a Poor-direction miss, not a Necessary-requirement-missed Egregious floor. The info ceiling still applies: the final rating lands slightly more compressed than the equivalent product-seeking query with the same miss would produce. Machinery determines the shape of the miss; compression determines the final position.

---

## Position Calibration

**Egregious** — the product has no business being shown to this user.

Low egregious is noise. No meaningful connection between query and product. The result might as well be random.

Mid egregious has a topical link — shared theme, shared word, some surface-level reason you can see why an algorithm might have surfaced it — but no commercial domain overlap. A [dog training whistle] query returning a ceramic dog ornament: † "dog" is the shared topical domain, but training equipment and home decor occupy completely different commercial aisles. ◆ This tier also covers the **descriptively-assisting mistreatment** pattern, where the algorithm latches onto a modifier that narrows or describes the main term and surfaces it as if it were the main term itself. A [drawer organizer for bedside table] query returning a dining table: the algorithm took "table" as the load-bearing anchor and surfaced a different type of table entirely, ignoring the drawer organizer. The product isn't doing anything coherent in parallel to the query — it latched onto a structural hint that wasn't load-bearing. ◆ Relatedness is real but it doesn't bring you any closer to the purchase the user is trying to make. This aligns with the principle that weak relatedness can push above the floor of egregious but stays egregious.

**High egregious** covers two patterns. ◆

**The first:** the product shares a commercial domain with the query — you're in the right aisle of the store — but zero specific requirements are met and the function is categorically wrong. [2019 Ford F-150 brake pads] → 2024 Toyota Camry floor mats: † both car parts/accessories, zero overlap in fitment, function, or vehicle. ◆ The commercial domain link is inherently stronger than a topical one (since the context is product recommendation), which lifts this above mid egregious.

◆ **The commercial domain overlap gradient and rating floors.** Commercial domain overlap is not binary — it is a gradient with distinct floors at each rung. Pattern 1's high egregious applies cleanly only to the broad-domain rung; tighter rungs lift the floor independently of substitute acceptability or intent satisfaction. 

◆ **Scope note for overlap-based floors:** These floors apply only when the shared anchor places the query inside a coherent commercial merchandise, product-system, or ecosystem context. They do not apply merely because a non-commercial factual query names a person, celebrity, public figure, or other entity whose name also appears on merchandise or a branded collaboration. ◆

The four readings: ◆

- ◆ **Exact-anchor shared** — query and product are organized around the same specific entity (same phone: [iPhone 15 Pro Max overheating] → iPhone 15 Pro Max silicone case; same appliance: [Dyson V11 filter cleaning] → Dyson V11 wall mount bracket; same platform/system: [how to descale Nespresso] → Nespresso pods). The user is already inside a coherent merchandise context for that anchor, and the product belongs to it. **Floor: Poor**, regardless of commitment level — the exact-entity anchor is concrete enough that the user is already in the right merchandise context, even when the purchase itself is deliberate and specific. Position within Poor depends on substitute acceptability, broadened-intent fit, and commitment level (and is further compressed by any active info-query ceiling). ◆
- ◆ **Tight domain** — same brand or same narrow product family without exact-entity match. *[Bosch dishwasher salt] → Bosch dishwasher salt is exact-anchor; [Bosch dishwasher salt] → Bosch cordless drill is tight domain — same brand, different product line.* **Floor: high egregious to low poor**, depending on commitment and browse-adjacency. High commitment with no plausible cross-line browse → high egregious; low commitment with plausible cross-line browse → low poor. ◆
- ◆ **Broad domain** — same aisle of the store, no specific brand or entity anchor. *[2019 Ford F-150 brake pads] → 2024 Toyota Camry floor mats:* † both car parts, no overlap in fitment, brand, or vehicle. **Floor: high egregious** (the Pattern 1 base case). Position within high egregious depends on commitment: high-commitment pairs sit at the top of high egregious, while low-commitment pairs with plausible browse-adjacency lift to low poor. ◆
- ◆ **Adjacent / loose / none** — no shared aisle; topical or word-only link at most. **Floor: mid to low egregious** per the Mid Egregious discussion above. ◆

◆ **Commitment and browse-adjacency are position-within-floor modifiers, not floor-setters.** They determine where within the floor's tier the rating lands; they cannot override a tighter rung's floor. An exact-anchor shared reading establishes a Poor floor even when commitment is high — the anchor itself does the floor-setting work, because the user is already inside that anchor's merchandise context. The position-within-floor logic that previously distinguished high egregious from low poor still operates, but only within the broad-domain rung where the floor is high egregious to begin with: nobody browsing for a specific professional-grade espresso machine is going to impulse-buy a commercial soft-serve ice cream maker † — both are broad domain (commercial kitchen equipment), and the high commitment keeps that case at high egregious. Kitchen gadgets under $15 † occupy a low-commitment, browse-friendly broad-domain space where a user shopping for one gadget might genuinely think "eh, I'll grab that too" → low poor. Large appliances † are a broad-domain example where commitment is high enough that browse-adjacent redirect is almost never plausible — nobody shopping for a dishwasher impulse-buys a washing machine. If the same dishwasher query returned a replacement door seal for that exact model, the exact-anchor reading would set a Poor floor regardless of the high commitment, because the user is in that specific dishwasher's merchandise context. ◆

◆ **Cross-reference to the Rating Synthesis Commercial domain overlap indicator** — the four rung labels above match the indicator readings in Part 2's Rating Synthesis. The Position Calibration Check's "Why not Poor?" question routes through this gradient: cite the indicator reading and apply the floor stated above. An exact-anchor reading cannot answer "Why not Poor?" with generic Poor-floor rules from elsewhere in the framework — the gradient floor takes precedence over substitute-acceptability or intent-adjacency arguments. ◆

◆ **The second high egregious pattern: parallel descriptive structure with a weak, non-identifying commercial link.** The query and product share the same descriptive scaffolding — both have a main term plus a modifier that narrows for occasion, season, or loose context — and the modifier is mirrored across both. The main terms are clearly different product types that can't reasonably be argued into each other's category, and the shared modifier isn't commercially or culturally identifying enough to hold them together. *Ex: [graduation watch] → graduation cap and gown.* † Both products have a main term (watch / cap and gown) and a shared descriptively-assisting modifier (graduation). The modifier does the same kind of narrowing work in each, so the structural logic is mirrored — the product is doing something coherent within its own frame (academic regalia marketed for graduations is a legitimate product category). But watches and graduation regalia are distinct product types — a cap and gown isn't a type of watch by any stretch — and "graduation" as a shared modifier isn't commercially or culturally identifying enough to hold a product family together the way a licensed IP, specific event, or culturally entrenched tradition like Christmas would. The user ends up with a coherent-but-wrong product, lifted above mid egregious by the real (if weak) commercial parallel, but not enough to reach Poor. ◆

◆ **The scope boundary on Mode B: the main terms must be clearly different product types.** If the query's main term is a broad category (e.g., "decor," "decorations," "accessories," "gear") that the product could plausibly be argued into, the failure is evaluated as ⬥ a broad-category substitute (high poor) ⬥ rather than a descriptive-mirroring Egregious. *Ex: [lilac birthday decor] → lilac disposable salad plates = Poor* ⬥ — plates are arguably a form of party decor/tableware, so the product is within the requested category on a technicality most users would reject (most users searching [birthday decor] want banners, balloons, streamers, room decoration — not dinnerware). This makes it a broad-category substitute case rather than a wrong-category-with-matching-modifier case. The test: can the product plausibly be claimed to fall within the category the query's main term names on a technicality most users would reject? If yes → high poor as a broad-category substitute. If no → high egregious via descriptive mirroring. ⬥ ◆

◆ **Distinguishing high egregious Mode B from mid poor's "right context, wrong object"**: the key question is whether the shared context is commercially or culturally identifying. ◆ [Taylor Swift Eras Tour hoodie] → Taylor Swift Eras Tour keychain † is mid poor because "Taylor Swift Eras Tour" identifies a specific licensed merchandise family — users perceive products under that label as a cohesive line, so wrong-product-type within it still has real commercial relevance. [Graduation watch] → graduation cap and gown † is high egregious because "graduation" is descriptive (it narrows the search) but not identifying (there's no canonical graduation product family with stable branding). The shared term narrows what to look for without specifying what the product is, so when the main term is missed, there's no load-bearing identity to hold the rating up.
◆ **Cultural identification counts too, not just commercial**. Some contexts that look like occasions or seasons are actually identifying enough to function like a licensed brand, because they carry widely recognized visual/stylistic conventions that shape how products within them are designed. Christmas is the clearest case — "Christmas baubles," "Christmas stockings," "Christmas lights," "Christmas wreaths" are genuine product categories with stable iconography (red/green, trees, tartan, snowflakes, Santa), and products within that tradition share a recognizable design language. Halloween behaves similarly (orange/black, pumpkins, skeletons, cobwebs). ⬥ Other occasions (weddings, Easter, Valentine's Day) sit in borderline territory — some stable conventions, but looser than Christmas or Halloween; see the borderline cases discussion below. ⬥ These culturally identifying contexts hold wrong-product-type cases in mid poor rather than letting them fall to high egregious — [red christmas baubles] → red christmas stockings = Poor because Christmas is identifying via cultural convention, even though no one licenses it. Father's Day, graduation, anniversary, and most personal occasions don't have this property — they're purely calendar-based without stable design traditions — and remain in high egregious territory for wrong-product-type. ◆

The three-way split:

**Shared context is commercially or culturally identifying**, main terms are different product types → mid poor, right-context-wrong-object (Taylor Swift Eras Tour, Loki, branded IP; Christmas, Halloween via cultural convention)
**Shared context is merely descriptive**, main terms are clearly different product types → high egregious, descriptive mirroring (graduation watch → cap and gown)
**Shared context is merely descriptive**, product plausibly falls within the query's main term as a broad category on a technicality most users would reject → ⬥ high poor as a broad-category substitute (lilac birthday decor → salad plates) ⬥

### Borderline cases

⬥ Ambiguity on either axis of the three-way split. The split relies on two judgments: (a) is the shared context commercially or culturally identifying? (b) is the query's main term a clearly specific product type or a broad category? Both judgments have middle zones where the criteria don't resolve cleanly.

**Axis 1 — context identification.** Christmas and Halloween are clearly identifying via cultural convention; Father's Day, graduation, and anniversary are clearly not. Weddings, Easter, Valentine's Day, and some culturally specific occasions (Diwali, Hanukkah, Lunar New Year) sit between — they have *some* stable design conventions but looser than Christmas. For a wrong-product-type failure within a borderline-identifying context, the rating lands in a range between high egregious and mid poor rather than one or the other.

**Axis 2 — main term broadness.** "Decor," "decorations," "accessories," "gear" are clearly broad categories. "Backpack," "watch," "baubles" are clearly specific product types. "Gift," "supplies," "essentials," and category nouns with wide internal range ("costume," "basket") sit between — a product could plausibly or implausibly be argued into them depending on how generously the term is read. For a failure where the main term's broadness is uncertain, the rating lands between high egregious (if read narrowly) and high poor broad-category substitute (if read broadly).

**Practical rule for borderline cases:** if the framework's criteria don't resolve a case cleanly, use the more charitable reading when the alternate reading would push toward Egregious. Borderline cultural identification is enough to clear the egregious floor. Borderline main-term broadness is enough to keep a case in Poor rather than pushing to Egregious. The cost of over-rating a borderline case is small; the cost of rating a plausibly defensible case as Egregious is larger — it treats a real but weak link as noise. ⬥

### What prevents Egregious

Two mechanisms prevent Egregious under standard machinery: substrate preservation (see **Substrate preservation floor** below) and the commercial domain overlap gradient at the exact-anchor or qualifying tight-domain rungs (see **The commercial domain overlap gradient and rating floors**). Both operate as hard floors, not soft considerations. Other within-machinery mechanisms (weak-but-real commercial link, borderline charitable reading, broadened-intent fit for a non-trivial user subset) also lift the floor and are covered in the relevant tier discussions below.

Note: categorical-miss subtypes (defined in **Categorical Miss Subtype Assessment** at the end of Part 2) are not within-machinery floor-setters — they operate as overrides at the end of the analysis. A standard-machinery rating that avoids Egregious can still be overridden to Egregious if a categorical-miss subtype applies. The override is evaluated separately, not within the mechanisms discussed here.

One specific clarification: the info-query ceiling is not one of these mechanisms. It caps the top of the rating range and does not interact with the floor. When writing the Position Calibration Check's "why not Egregious?" justification, name the actual mechanism at work (substrate preservation, borderline charitable reading, weak-but-real commercial link, or whatever applies). Do not cite the info-query ceiling as the reason Egregious is avoided — that is not what the ceiling does.

### Substrate preservation floor

If the product lands in the query's core product category (the main product-type noun of the query), the Egregious floor is lifted regardless of other misses. The standard-machinery rating cannot be Egregious when substrate is preserved — Poor is the floor. The size of the use-case, author, brand, qualifier, or modifier miss on top of preserved substrate is a Poor/Okay positioning question, not an Egregious-floor question.

*Examples:*
- *[Bosch dishwasher salt] → generic dishwasher salt* — substrate preserved (both are dishwasher salt); brand missed; Okay.
- *[leather boots] → rubber wellington boots* — substrate preserved (both are boots); material missed; Poor (important-requirement miss with unacceptable substitute).
- *[first-edition Hemingway novel] → first-edition Steinbeck novel* — substrate preserved (both are first-edition American novels); author missed; Poor.

Substrate preservation operates as a hard floor, not a soft consideration. It is structurally equivalent to the exact-anchor rung of the commercial domain overlap gradient: once present, the Egregious band is unavailable under standard machinery regardless of downstream weakness.

**Poor** — the product is clearly wrong but there's a real connection to the query.

**Same-category-with-use-case-miss is a major route into Poor.** When the product is in the same product category as the query's main subject and misses on use-case, application, modifier, qualifier, brand, provider, or other named requirements — regardless of how large the gap — the case routes through standard substitute-acceptability machinery into Poor or Okay, never into Egregious via a categorical-miss floor. Canonical examples:

- *[motor oil for diesel engine] → motor oil for gasoline engine* — both motor oil; miss on engine-type compatibility; Poor.
- *[glue for paper crafts] → construction adhesive* — both adhesives; miss on use scale and application; Poor.
- *[wooden cutting board] → bamboo cutting board* — both cutting boards; miss on material (preferential-tier); Okay.

The substitute acceptability test (does the product still work as a plausible substitute for most users with this query?) determines position within Poor or whether the case lifts to Okay. The size of the use-case gap is a Poor/Okay positioning question, not an Egregious-floor question.

**Low poor** has some specific link to the query — not just a shared commercial domain, but something more concrete that you can point to. [How to remove red wine stains] → fabric protector spray: † the link is specific (textile stain management) and the products are adjacent in purpose, but the user already *has* the stain — this prevents the next one rather than fixing the current one. The product might interest a subset of users who'd consider changing their intent, but that change of mind is a stretch — most users with this query want a solution now, not prevention for later. This is also where info queries can land when compression from the top pushes the best available position downward: a product topically relevant to an informational query but not particularly helpful to the actual intent would otherwise rate higher, but the info ceiling caps the top of the range low enough that this lands in low poor. The info ceiling is not raising a floor here; it is lowering the top, and this product's position relative to that lowered top happens to be low poor. Fitment-sensitive products live here too, and they deserve a specific note: when a query specifies a product whose compatibility depends on multiple interlocking dimensions (year, make, model, fitment for auto parts; printer model for toner; device model for specific replacement batteries), the specificity rule applies maximally — the potential to fail is enormous and the window for actual alignment is narrow. A [2018 Honda Civic brake rotor] returning a 2022 Toyota Corolla brake rotor: † same part type, wrong vehicle entirely, incompatible — it shares one anchor point (brake rotor) but misses the specific fitment, which pins it at the floor of poor despite the concrete link. ◆

**Mid poor** is decently topically related and either borders on attempting to be a substitute without getting there ([Taylor Swift Eras Tour poster] → Taylor Swift phone case † — right artist, right merch context, wrong product type) or is a recognizably bad substitute that preserves some intent but misses too much ([vintage brass desk lamp] → modern LED desk lamp in brass color † — both desk lamps, but the aesthetic and temporal specificity are wrong; the brass color references the original but the era and material authenticity define the appeal). A specific time-blocking planner for [how to be more productive] † probably lives around here, maybe mid-high at most — it's a product suggestion for an informational query, which already compresses the ceiling, and while it's genuinely related to the intent (it is a thing that could help productivity), it's making large assumptions about what the user means and what kind of answer they're looking for. Similarly, a portable air conditioning unit for [how to stay cool in summer] † — it addresses the goal, but the user might want tips on hydration, clothing, or shade rather than a major appliance purchase. The product is trying harder than low poor, but it's not close enough to feel like it could actually serve the user. A useful shorthand for one common mid-poor pattern: "the right context, wrong object" — the product is from the correct brand, event, or category context but is a different product type. *Ex: [Nintendo Switch carrying case] → Nintendo Switch sticker set = Poor.* † ◆ **The identifying context can also be cultural rather than commercial**: [red christmas tree baubles] → red christmas stockings = Poor — Christmas is culturally identifying enough (stable design tradition, recognizable iconography) to hold a coherent product family together the way a licensed IP would, so wrong-product-type within it still lands in mid poor rather than falling to egregious. ◆ This shorthand applies cleanly when the shared context is commercially or culturally identifying — a specific brand, IP, licensed event, coherent merchandise line, or broader cultural tradition with stable design conventions like Christmas or Halloween. When the shared context is merely descriptive (an occasion, a season, a loose framing without a stable design tradition), the outcome depends on whether the product falls within the query's category: if it plausibly does on a technicality most users would reject, † it lands at high poor as a broad-category substitute (see the ⬥ lilac birthday decor ⬥ case); if it clearly doesn't, the rating falls to high egregious via descriptive mirroring ([graduation watch] → graduation cap and gown). See the high egregious discussion for the full three-way split. ◆

**High poor** matches a significant proportion of requirements while remaining functionally too different to be a real substitute. ◆ Two sub-patterns sit here. ◆ ◆ **Partial substitute** — the product is literally incomplete: [Black full wetsuit for diving] → blue wetsuit top/jacket only † — same sport, same garment family, almost a substitute, but the top is literally half the wetsuit and would need to be paired with bottoms to be usable. The product can't complete the task on its own; the user would still need more. ◆ ◆ **Broad-category substitute** — the product redefines the category in a way most users would reject: ⬥ [lilac birthday decor] → lilac disposable salad plates † — same color, same occasion, and plates can technically be argued into "decor" as a broad category (tableware counts). But most users searching [birthday decor] don't mean dinnerware — they mean banners, balloons, streamers, room decoration. The product claims the category on a technicality the user wouldn't accept. ⬥ ◆ Both sub-patterns share the signature: the product matches many requirements on paper but fails as a real substitute in practice. This is the tier where you start feeling the pull toward okay and have to ask: could the user actually use this? If the answer is "not really, but I see why you'd think so," it's high poor.

**Okay** — the product is a defensible result even if it's not what the user wanted.

**Low okay** is the floor of permissibility. The product is barely a substitute or barely addresses the user's intent in a way that's technically defensible but not satisfying. [Creed Aventus] → a £5 body spray labeled "inspired by Aventus" † — same scent reference, same olfactory target, but the product form, prestige tier, and entire purchase experience are worlds apart. [Prescription codeine for chronic pain] → over-the-counter co-codamol at a much lower dose † — same active ingredient family, same problem space, but vastly different potency and medical context. [IKEA billy bookcase dimensions] → similar bookcase from Wayfair † — the query is informational about a specific product at a specific retailer, and the result ignores both (worth noting that this is an info query — the user is seeking dimensions/pricing, not a product — so the info ceiling caps the top of the range lower than a product-seeking version of the same query; the position within that lowered range is determined by the substitute analysis, not by info-query status). Also where products land that are in the same general problem space without being direct substitutes: [windscreen de-icer] → windscreen washer fluid † — both are car windscreen liquid products, but one solves frozen glass in winter and the other cleans bugs and dirt; adjacent shelf, different actual problem. ◆ The worksheet's "addresses nearby intent approx/indirectly" captures why this is Okay rather than Poor: the product doesn't address the user's exact problem, but it addresses a nearby one within the same problem space — windscreen maintenance is the shared intent, and the product gets close enough to be defensible. ◆ The common thread is: you can construct an argument for why this result isn't useless, but you have to work for it.

**Mid okay** is a decent substitute with notable attribute misses, or a product that clearly addresses the intent but with meaningful gaps. A product where only the retailer diverges from an otherwise solid match. [Bosch dishwasher salt] → generic dishwasher salt †. A brand alternative that's in the right product category and serves the same function but isn't what was asked for. The product works for the user's purpose — you don't have to squint to see it — but something specific and identifiable is missing.

**Mid-high okay** is where the product is a strong substitute with one soft requirement missed, or addresses the intent well with only minor friction. This is also roughly where the best product suggestions for naturally informational queries land. The [how to organize my closet] → closet divider/shelf organizer † example is instructive here: the query is informational in nature — the user is looking for guidance, not necessarily shopping — but a closet organizer is probably at the high end of products you could defensibly show, because it directly helps with the stated goal. There's no closet type specified; the query is broad. But because the intent leans instructional rather than transactional, even a strong product suggestion like an organizer caps out around mid-high to mid okay rather than pushing into good. Compare this with [gift ideas for dad], † which leans more naturally toward product suggestions — a user asking for gift ideas is arguably browsing for things to buy, so a good product suggestion there could cap out at high okay.

This introduces an important principle: **info query ceilings aren't uniform.** They vary based on how naturally the query lends itself to product recommendations. [Gift ideas for dad] † is informational in form but commercial in spirit — showing a product is very reasonable here, so the ceiling is high okay. [How to organize my closet] † is more instructional — the user's primary intent is knowledge, and a product is a secondary consideration, so the ceiling drops to mid-high or mid okay. A purely instructional query like [what is the theory of relativity] → physics textbook † would have an even lower ceiling because no product meaningfully addresses that intent.

**High okay** is the top of the substitute range for product queries and should be relatively rare, because most results that get this close to good actually are good. This is where a product substitute is strong enough to feel like a real alternative but has one clear divergence the user would notice — and that divergence is meaningful enough that you can't just wave it away as a preference difference, but not so meaningful that the product fails to serve the purpose.

**Good** — the product is what the user was looking for, or close enough that the differences don't matter.

**Low good** is where all requirements are technically met but the product has some quality that makes it less broadly appealing or slightly more niche than what the query implies. The product is right — it's the thing the user is looking for — but something about it introduces a faint friction. Maybe the product is a specialized variant that most users issuing this query wouldn't gravitate toward, or it has a qualifier that narrows its appeal beyond what the query specified. The [canon pixma ts3350 ink cartridges] → compatible cartridges that fit but are the XL/high-yield variant when standard was implied † example is instructive: the query is reasonably specific, so the ceiling is well above mid good — but the product shown is a different edition that technically fits but isn't what was implied, which bumps it down to around mid or mid-low good. With specific queries more broadly, the question for low good is: what divergence is less substantial than wrong color or different size range (which both warrant okay — those are real attribute misses the user would notice and care about) but still enough to keep the result from sitting comfortably at mid good? I think the answer lives in the territory of things the user wouldn't explicitly object to but also didn't ask for: a product that's technically correct but is a different edition, a slightly different form factor that serves the same purpose equally well, packaging aimed at a different but overlapping audience (professional vs consumer labeling for the same product), or a bundle/multi-pack when singles were implied. These are divergences you notice on inspection but that don't change whether the product works for you.

Also worth noting that **the most generic queries compress the rating range at the top, capping at around mid good.** A query like [coffee mug] gives the system almost nothing to fail on — but also almost nothing to prove it succeeded with. If the product shown is a coffee mug but has a mildly opinionated, decently agreeable political slogan on it, † it's borderline: technically matches the query, but the slogan introduces a quality that some users would appreciate and others would rather avoid. That's not a miss exactly, but you can't call it a confident hit either, and the query was too generic to push higher. The compression works in both directions — generic queries are forgiving (less to get wrong, so the floor rises) but also limiting (less to verify, so the ceiling drops).

**Mid good** is a strong match with most requirements met and only minor divergences that don't meaningfully affect whether the product serves the user. Brand + product type queries with exact brand match and a product that's clearly the right kind of thing tend to cluster here. The product is satisfying — the user would look at this and think "yes, this is what I was looking for" — but the query didn't give enough specificity to push higher, or one small attribute sits slightly off from ideal.

**Mid-high good** is where brand + product type queries land when the product is an excellent match and there's some additional signal (beyond just category membership) confirming alignment — a popular or canonical variant, attributes that match implied preferences, nothing that raises any question. Also where very specific queries land when everything important is met and only a trivial, truly inconsequential attribute differs. The user would be satisfied and wouldn't feel the need to keep searching.

**High good** is near-perfect or perfect. The product matches the query on all identifiable dimensions — brand, product type, specific model if named, key attributes. This position requires a specific enough query that you can actually verify fulfillment, because for generic queries the ceiling compresses below this point. If the query is just a brand plus a product category with no further specificity, high good is hard to justify — you only know the category is right, not that this particular product is the one.

---

# PART 2 — ANALYSIS TEMPLATE

This is a Search Experience to Product Usefulness task. The task input may be either an attached screenshot or labeled OCR text in the chat. When labeled text is provided, treat `Query:` as the user query and `Product Text:` as the product ad text.

**Reference primacy:** ⬥ Every description, test, definition, and threshold in this template is a compressed summary of content that exists in fuller form in Part 1 above. Treat Part 1 as the authoritative source and this template as a structural scaffold for the analysis. When this template's phrasing of a concept differs from Part 1, defer to Part 1. When a category, tier, or boundary mentioned here is ambiguous, resolve the ambiguity by reading the referenced Part 1 section — not by extrapolating from the summary. Cross-references throughout this template point to specific Part 1 sections; consult them when the named concept is load-bearing for the rating. ⬥

**Query research:** Before analyzing the query, web-search any terms that are not self-evidently common English in the meaning the query intends. The test is not "do I recognize this word" — it is "is the most common everyday-English interpretation of this term the same as its meaning here?" If there's any chance the term is a brand, product line, model number, program name, regional usage, jargon, acronym with multiple expansions, multi-word proper noun, or recent release the model wouldn't reliably know, verify it. When the task locale or query language may affect interpretation, do not default to a generic dictionary or broad English-language reading: locale-specific usage can change what real-world thing, product/service class, or practical intent the query is pointing to. Brand-as-common-word ("Apple," "Coach," "Polo," "Subway," "Dove," "Shell") is a particularly common failure mode — the surface reading produces a coherent-but-wrong subject and contaminates everything downstream.

**Screenshot evidence discipline:** Use only evidence visible in the screenshot plus Part 1. If a title, model, retailer, price, spec, or visual detail is unclear, mark it unclear rather than infer it. Do not hallucinate hidden compatibility, material, size, or variant information from blurry text.

**Product card anatomy:** Standard product cards are laid out top-to-bottom as:
1. Product image.
2. Product title (often containing descriptive specs; sometimes truncated if long)
3. Price.
4. Retailer.

Parse each position deliberately. Do not mistake the retailer for the brand, or the title's descriptive fragments for the category anchor. The retailer is the bottom line, not the brand; the brand, if present, is inside the title or inferable from the image. When the title and image appear to disagree, the title is authoritative for what is actually being sold.

Create the following overview:

## Output Completeness Contract

The numbered **Mandatory headings** list below defines the final output structure. Every heading in that list is mandatory and must appear in the final output in the same order.

Other top-level sections in Part 2 are instruction blocks for producing that output and are not themselves required output headings unless they also appear in the numbered list.

Do not skip a section because it seems inapplicable, redundant, obvious, or already covered elsewhere. If a section does not apply, include the heading and write `N/A — [specific reason]`.

Sections marked “if applicable” still require a heading. “If applicable” controls how much content goes inside the section, not whether the section appears.

Before finalizing, perform a section-by-section completeness pass against the Part 2 heading list. If any required heading is missing, add it before answering.

Mandatory headings:
1. Query Coherence Check
2. Decision Gates
3. Interpretations Table
4. Query Components
5. Query Meaning
6. Product Overview
7. Product Assessment
8. Requirement Analysis
9. Brand / Retailer / Platform Logic
10. Shared-Context Test
11. Relatedness vs Intent Satisfaction
12. Substitute & Compatibility Tests
13. Applicable Task Categories / Concepts
14. Rating Synthesis
15. Standard-Machinery Rating Suggestion
16. Rating Guardrails Audit
17. Position Calibration Check
18. Borderline cases
19. Categorical Miss Subtype Assessment
20. Override Impact
21. Formatting compliance check

Only `Override Impact` may be reduced to one line when no subtype candidate is surfaced: `No override under consideration; standard-machinery rating stands.`

## Query Coherence Check

If the literal query is viable, this section is "N/A — literal reading viable" and downstream sections operate on the literal query as written. Otherwise, fill the table.

| Field | Value |
|---|---|
| Coherence | viable / internally inconsistent / impossible |
| Impossibility | what specifically cannot be true |
| Evidence | source establishing the impossibility |
| Most plausible reconstruction | closest viable reading the user likely meant |
| Reconstruction confidence | high / medium / low |
| Operating reading | reconstruction (default when coherence ≠ viable) / literal (only if reconstruction confidence is low and multiple incompatible reconstructions are equally plausible) |

**Propagation.** When operating reading is the reconstruction, all downstream sections — Decision Gates' Main interpretive anchor, Interpretations Table, Query Components, Query Meaning, requirement analysis, substitute and broadened-intent checks, Rating Synthesis — operate on the reconstruction. The literal query is documented here and does not propagate further. Products that fit the operating reading qualify as non-trivial subset under Broadened-intent check by default, because the literal reading cannot serve as the baseline against which "non-trivial subset" is measured when no user can have intended exactly what the literal query says.

Query Coherence Check sits at the top for the symmetric reason: its function is to define the baseline the analysis runs against, so it must precede the standard machinery. Override-style mechanisms (categorical misses) run after; baseline-defining mechanisms run before.

## Decision Gates (lock these first)

Before running any detailed assessment, resolve these structural constraints — they determine the available rating range before the framework even engages with requirement-matching:
- **Query coherence**: literal reading viable / internally inconsistent / impossible.
- **Query ambiguity:** none / research-resolved / ambiguous (bounded) / ambiguous (unbounded).
  - **None / research-resolved:** the query has a stable enough meaning to support ordinary downstream analysis, either from the surface wording or after research.
  - **Ambiguous (bounded):** several reasonable interpretations remain, but they form a small, coherent, rateable set. The product may be assessed against a genuinely reasonable product-relatable branch; ambiguity itself is not a defect.
  - **Ambiguous (unbounded):** research does not establish a stable likely intent or bounded rateable interpretation set. Do not let the product invent the operating reading. A product-relatable guess may be documented, but it remains speculative and should receive little or no credit merely for matching that guess.
- **Query type:** Surface one of `Product / Information / Service / Retailer-Brand / other`, followed by a brief inline framing explanation answering: **what is the query, as a whole, framed as the user trying to obtain, access, or have fulfilled?**
  - **Product** — framed as finding or acquiring a physical or digital item. Apps explicitly named as apps count here, even when they facilitate a downstream service.
  - **Information** — framed as learning, checking, comparing, ranking, or finding out. Info queries retain their informational classification even when shopping intent is clear — do not reclassify as Product.
  - **Service** — framed as booking, delivery, a transaction process, or human/business fulfillment. A product may be involved, but the service route defines the query.
  - **Retailer-Brand** — framed around a bare brand, retailer, or organization without an explicit product or service object.
  - **other** — state the framing briefly.

  **Surfaced field format:**  
  `Query type: [label] — [one-sentence framing explanation].`

  **Examples:**  
  `Query type: Service — the query is framed around obtaining delivery fulfillment, not merely acquiring pizza as a product.`  
  `Query type: Retailer-Brand — the query names Sephora as a commercial entity without specifying a product or service.`  
  `Query type: Product — the query is framed around acquiring the Uber Eats app itself, which is a digital product even though it facilitates a downstream delivery service.`

- **Information-query ceiling subtype** *(only when Query type = Information)*:
  - Normal info query (how does X work, why does Y happen) → cap around mid okay.
  - Commercial-in-spirit info query (best X, X reviews, X comparison) → cap around high okay.
  - Transaction-framed info query ([price of X at Y], [cost of X], [X in stock at Y], [when is X on sale]) → cap remains at Okay (not Good — still an info query) but can reach high okay cleanly. Retailer, brand, and price-tier misses on these queries are diagnosed via the product-query machinery (a missed retailer is a Poor-direction miss, not a Necessary-missed Egregious floor), with the info ceiling still compressing the final position.
- **Specificity:** generic / moderately specific / highly specific. Generic queries compress the top range (cap around mid good); specific queries unlock the full range (see **Position Calibration** discussion of generic-query compression in Part 1).
- **Main interpretive anchor:** what is actually being sought.
- **Remaining rating range after these gates.**
- **Operative lens:** substitute acceptability / intent satisfaction. Derived from query type:
  - Product queries → substitute acceptability is operative; intent satisfaction is N/A.
  - Commercial-in-spirit info queries (gift ideas, "best X for Y," recommendation requests) → intent satisfaction is operative; substitute acceptability is N/A — the oduct isn't trying to be a substitute for information, it's a candidate answer.
  - Instructional info queries (how-to, why-does, what-is) → intent satisfaction is operative. The activity-enabling reading is specifically available here when the oduct is a tool the activity requires (not when the product is just topically related).
  - Service queries → substitute acceptability is operative (service substitution is the natural frame).
  - Retailer-Brand queries → substitute acceptability is operative, interpreted through **Brand / Retailer / Platform Logic**; intent satisfaction is N/A.

  The non-operative row in Rating Synthesis is filled "N/A — non-operative for this query type." Substitute & Compatibility Tests and Rating Synthesis row guardrails reference this commitment.

- **Purpose-structure polarity:** lock the substitute-similarity axis for this query after combining domain structure with the query wording.
  - **Domain-default polarity:** purpose-convergent / mechanism-divergent / mixed / N/A — no purpose-structure issue materially affects this case.
  - **Query-induced polarity shift:** none / toward purpose / toward mechanism / mixed / N/A.
  - **Operative substitute axis:** purpose convergence / mechanism-mode preservation / mixed / N/A.
  - **Guardrail:** the domain default is a prior, not a hidden requirement. It affects how substitute quality is evaluated when purpose-vs-mechanism tension is relevant; it does not add unspoken constraints to broad generic queries.

## Interpretations Table

| Likelihood | Interpretation |

One line per row describing what the user is probably trying to find.

**When Query Coherence Check declared the literal reading viable**: identify the interpretation most relatable to the product and treat it as the working interpretation for all subsequent assessments. If the product-relatable interpretation is significantly less likely than the leading one, flag the tension — a product that only serves an unlikely interpretation is penalized by the implausibility of that interpretation, not rewarded by the fit.

**When Query Coherence Check declared an operating reading other than the literal**: the Interpretations Table enumerates plausible reconstructions only. The literal reading does not appear as a row. Ranking reflects the reconstruction confidence stated in the coherence check — low-medium confidence means rows should be roughly equal rather than sharply ordered. The working interpretation is the operating reading set in the coherence check, not a single row promoted from this table; the table's purpose here is to make the reconstruction space visible, not to re-rank against the literal.

**Ambiguity-state note:** The Query ambiguity field in Decision Gates should inform how confidently interpretations are framed here, but it does not replace the Interpretations Table's job of surfacing the most relevant reasonable readings. For bounded ambiguity, list the reasonable branches normally and identify the branch most relatable to the product. For unbounded ambiguity, still surface any candidate readings that research or the result context suggests may be relevant, but clearly mark them as weak, scattered, speculative, or unsupported where appropriate rather than presenting them as stable interpretations.

**Respect the user’s wording.** Do not silently normalize away wording choices that may shift intent, such as singular vs. plural, action wording, format terms, delivery/service terms, or small modifiers that change what kind of result the user likely expects. These may turn out to be weak or strong signals depending on context, but they should first be noticed and reflected in the interpretation space rather than erased during paraphrase.

## Query Components

| Match | Term | What it is |

Keep explanations as short as possible — ideally just a label like “brand,” “model number,” or “file format.” But explain by default when a term is niche, technical, automotive/device/parts-related, foreign-domain, jargon, a product-specific compound, or at least **3/10 unfamiliar for a non-native English speaker**. Do not assume compound words are self-explanatory just because the individual words are common.

When expanding, give the shortest explanation that creates an accurate layman mental model: what the thing basically is, what it is used for, and — if the practical connection is not obvious — why it exists. For product-specific or technical terms, include the clearest German equivalent in parentheses when helpful.

Example:
hitch bike rack | bike carrier (**Fahrradträger für Anhängerkupplung**) that attaches to the metal towing connector at the back of a car
wheel chock | wedge-shaped block (**Unterlegkeil**) placed against a wheel so a vehicle or trailer cannot roll away
stud finder | wall-scanning tool (**Ortungsgerät**) used to find supports behind a wall before drilling

Flag and briefly gloss any model/platform/product-line identifiers that are not self-evident.

## Query Meaning (bullet points)

One concise snapshot of what real-world results this query implies: typical products, price range, likely brands/retailers, hard constraints. This is the baseline against which the product is judged.

- **TL;DR / ELI5:** explain the query for someone who does **not** know the key terms. Decode every load-bearing non-everyday term before judging the product. If a term is automotive/device/parts-related, product-specific, technical, brand/platform-specific, or a compound whose purpose is not obvious from the words alone, explain it even if it seems only mildly unfamiliar.
  - **Layman-context threshold:** if a term would be at least **3/10 unfamiliar for a non-native English speaker**, explain it by default. Treat the reader as smart but not specialized. The explanation can be longer when the term needs context to make sense, especially when the literal words do not explain the product’s purpose.
  - Include the practical “why it exists,” not just a synonym.
  - Do not assume compound words are self-explanatory.
  - For product-specific or technical terms, add the most understandable German term in parentheses when one exists.
  - Bad: "A hitch bike rack is a bike rack for a hitch."
  - Better: "A bike carrier (**Fahrradträger für Anhängerkupplung**) that attaches to the metal towing connector at the back of a car."
- Product Target Customer (abbreviated) (if applicable)
- Brand Target Customer (abbreviated) (if applicable)

## Product Overview

First line: what the product is — Category, Brand, Modifiers/Misc.

Second line: **TL;DR / ELI5:** strip the visible product down to what it basically is, especially in relation to the query — what someone would picture, what it is used for, and any obvious defining traits. If the product title contains a technical, product-specific, brand/platform-specific, or compound term that a layman/non-native speaker may not understand, briefly decode it instead of repeating it. Include the clearest German equivalent in parentheses when helpful. No rating logic.

Example:
A bike carrier (**Fahrradträger für Anhängerkupplung**) that attaches to the metal towing connector at the back of a car and carries bikes behind the vehicle.

| Match | Component | Explanation |

Rows: product type, brand, color, all other direct product attributes.

## Product Assessment

| Match | Dimension | Assessment |

Rows covering applicable indirect/contextual factors: Intent, Purpose, Function, Context of use, Market segment, Price tier of Product/Brand, Target Demographic, Substitutability, Compatibility, Closest link, Product Target Customer, Brand Target Customer. Add or omit rows as applicable.

Use **Purpose** and **Function / mechanism / mode** distinctly:

- **Purpose** = the end-state, problem solved, or user outcome the product is meant to serve.
- **Function / mechanism / mode** = the operative way the product delivers that value: its method, form of use, interaction loop, experience structure, or satisfaction mechanism.

When the Decision Gates identify a non-N/A **Purpose-structure polarity**, make the distinction visible in Product Assessment rather than collapsing Purpose and Function into the same sentence. Add rows as applicable for:
- Purpose structure
- Query-induced polarity shift
- Operative substitute axis
- Axis preservation by the product

## Requirement Analysis

| Requirement | Explicit/Implicit | Met/Partly/Missed | Filter Strength | Tier | What it's doing |

For each rating-relevant requirement:

- **Explicit vs implicit:** is the term stated or assumed. Include load-bearing implicit requirements only where they materially affect the rating — no free association.
- **Met status:** met / partly met / missed.
- **Filter strength:** weak / medium / strong. Filter strength is the requirement's practical narrowing force in this case, not a synonym for explicitness and not the same thing as tier. Use the heuristics below before filling this column.

  **Filter-strength heuristics for common requirement types.** These are starting points, not overrides. They prevent accidental over-weighting of easy-to-name constraints like brand and retailer. Tier still comes from the worst-imaginable-substitute test below; population-overlap factors later should reuse the same practical weight logic.

  | Requirement type | Default weight | Strong when | Population-overlap implication |
  |---|---|---|---|
  | Core product function / category | Strong | Requirement defines what the product does, especially functional goods: auto parts, chargers, filters, printer cartridges, tools, medicine, safety equipment, replacement components | Missing function/category can mean low acceptance because the product no longer solves the job |
  | Compatibility / fitment / system lock-in | Strong | Real-world use depends on the anchor: year/make/model, device model, printer model, pod system, console/platform, proprietary connector | Same broad category or brand is not enough; missed fitment can be a functional break |
  | Explicit exclusions / safety / compliance | Strong | "No X," "without X," gluten-free, vegan, non-toxic, child safety, pet/medical constraints, high-visibility workwear, legal/safety specs | Violating an active exclusion or safety constraint usually excludes most users |
  | Demographic / recipient | Weak to medium | Product form, sizing, safety, accessibility, or usability depends on the demographic | "For kids" can be strong for sizing/safety; "for dad" is usually a gift-audience cue |
  | Use-case / application | Medium | Product would fail the job or create a meaningfully different task | Hiking/weather, craft vs construction, professional vs casual, indoor vs outdoor can become strong when the job changes |
  | Mode / mechanism / experiential structure | Medium | The domain is mechanism-divergent by default, or the query shifts the operative axis toward genre, interaction loop, sensory profile, aesthetic grammar, experiential format, or mechanism/form as the way the product satisfies intent | Missing this axis can exclude a large share of users even when the broad category or umbrella purpose is preserved |
  | Material / ingredient / style / aesthetic | Weak to medium | Material/style is the point, changes performance, signals authenticity/tier, carries safety/ethical meaning, or functions as the main mode-bearing feature in a mechanism-divergent or query-shifted case | Ordinary color/style cues often have moderate-to-high acceptance; mode-bearing aesthetic/style misses can exclude far more users when the query depends on that axis |
  | Price / market tier | Medium | Query clearly targets budget, luxury, professional, vintage, collectible, or prestige tier; gap is large | Large tier gaps can make an otherwise functional substitute unacceptable |
  | Brand / manufacturer / product line | Weak to medium | Brand/line is the named object, official/authentic/collectible, compatibility-linked, safety/trust-linked, prestige/tier-defining, or has unique design/function | Do not mark positive brand terms strong merely because they are explicit; use low acceptance only when there is a real rejection mechanism |
  | Retailer / platform | Weak to medium | Retailer/platform is the actual need: in-stock, pickup, returns, membership pricing, gift card, exclusive item, regional access, official storefront, marketplace trust, or retailer-specific assortment | Reputable alternate retailers often get high acceptance; low acceptance needs an access/exclusivity/trust reason |
  | Multiple soft commercial constraints | Usually not independently strong | Each axis encodes a different real constraint | Do not multiply brand + manufacturer + retailer as if each excludes most users unless each has an independent rejection mechanism |
  - **Strong:** missing the requirement usually makes the product unusable, unsafe, non-compliant, or commercially the wrong thing for most users. Common cases: core product function for inherently functional goods, compatibility/fitment, explicit exclusions, safety/compliance constraints, required sizing/dimensions, and use-case terms where the product would fail the job.
  - **Medium:** missing the requirement meaningfully changes suitability, character, tier, or target user, but a plausible substitute can still exist for a substantial subset. Common cases: important material, product form, use-case, market tier, age/recipient, and brand/retailer when they encode real positioning, access, trust, officialness, or exclusivity.
  - **Weak:** missing the requirement is noticeable but usually does not change the product's core job or acceptability for many users. Common cases: ordinary color/style preferences, interchangeable positive brand mentions, interchangeable retailers/platforms, and soft modifiers with no functional or access consequence.
  - **Brand / manufacturer / product line guardrail:** do not default to strong just because the brand is explicit. Strong only when brand/product line is the identity being sought, official/authentic/collectible, compatibility-linked, tier-defining, safety/trust-defining, or uniquely recognizable. Otherwise use weak or medium.
  - **Retailer / platform guardrail:** do not default to strong just because the retailer is explicit. Strong only when the retailer/platform is part of the actual need — in-stock/pickup/returns, gift card, membership pricing, store-exclusive item, official storefront, regional availability, or retailer-specific assortment. Otherwise use weak or medium.
- **Tier assignment — use the worst-imaginable-substitute test** (full tier definitions in **Key Definitions** in Part 1):

  For each requirement, ask: across the full range of plausible substitutes that miss this requirement, what is the worst rating any of them could reasonably produce? The answer determines the tier.

  - **Preferential:** the worst imaginable substitute still lands at Okay. No substitute that misses this requirement could produce Poor.
    - *Test example — [wooden cutting board] → "wooden"*: every plausible cutting-board material (plastic, bamboo, glass, marble, silicone) preserves the core function. None reaches Poor. "Wooden" is preferential.
  - **Important:** at least one plausible substitute that misses this requirement can produce Poor. Other substitutes may still produce Okay.
    - *Test example — [leather boots] → "leather"*: faux leather might stay at Okay, but a rubber wellington substitute clearly reaches Poor. The existence of a plausible Poor substitute establishes "leather" as important.
  - **Necessary:** missing this requirement destroys the query's core identity or usability. No plausible substitute preserves the match.
    - *Test example — [leather boots] → "boots"*: without "boots," no substitute can even be constructed — the query has no coherent product-seeking meaning. "Boots" is necessary.
    - **Remove-and-check guardrail** (expanded in **Key Definitions > Applying Necessary correctly** in Part 1): strike the term from the query. If the remainder is still a coherent product search, the term is not Necessary — it is Important at most. Only the product category (and its absolute functional properties) typically survives this test. Retailer, brand, price tier, style/material/temporal qualifiers all fail it and cap at Important, even when grammatically framed as hard constraints. Misses on them land in the Poor-to-Okay range via Brand/Retailer/Platform Logic and substitute acceptability — not in Egregious via a Necessary-tier floor.
    - **Single exception — compatibility/fitment:** if the product is functionally unusable without the fitment anchor (wrong battery, wrong printer toner, wrong car part), fitment is Necessary-by-function even though the reduced query is grammatically coherent. Handled by the Compatibility dimension.

  The tier is a *range-limit* definition, not a character definition. It asks: how bad can a miss get? That answer is baked into the definition of each tier.

  For tier assignments that aren't obvious, show the worst-case substitute briefly — just enough to establish which tier the range-limit falls into.
- **What it's doing:** change match type, substitutability, compatibility, usability, or preference.

## Brand / Retailer / Platform Logic (if applicable)

Distinguish:

- Brand as the core thing being sought
- Brand as proxy for a hidden product type or constraint
- Retailer/platform as mere means to an end
- Retailer/platform as part of the actual need

This affects whether brand/retailer mismatches count as acceptable alternatives (Okay), unacceptable alternatives (Poor), or something else. For the brand/price-tier substitution axis (bare brand queries → any brand product = Good; alt brand similar tier = Okay; significant tier/positioning gap = Poor), see the **Heuristic Overview** brand/retailer discussion in Part 1.

**Default posture.** Brand, manufacturer, product line, retailer, and platform are not automatically strong filters. Start from weak-to-medium when the alternative preserves product category, function, comparable tier, and normal purchase access. Escalate only when the term changes what the user can use, trust, recognize, collect, afford, access, or intentionally filter out.

| Requirement type | Usually light / medium when... | Strong only when... | Population-overlap implication |
|---|---|---|---|
| Brand | another reputable brand in the same category, function, quality tier, and style would usually work | brand is the named object, official/authentic/collectible, ecosystem/fitment-linked, safety/trust-linked, prestige/tier-defining, or has unique design/function | use high acceptance rates for interchangeable brands; low rates only for loyalty, officialness, collectibility, or tier gaps |
| Manufacturer | manufacturer is mainly attribution behind a product line | manufacturer determines compatibility, safety/trust, warranty, officialness, or product identity | avoid separately punishing manufacturer and brand when they describe the same commercial anchor |
| Product line / licensed line | product line is mostly a branding wrapper around a common product function | line is iconic, licensed/official, collectible, design-defining, or the query names the line as the product identity | estimate whether users want the line specifically or the underlying product function |
| Retailer / platform | retailer is a convenient source and the same product or close substitute is available elsewhere | retailer is the point: in-stock, pickup, returns, membership pricing, gift card, exclusive item, official storefront, regional access, marketplace trust, or retailer-specific assortment | use high acceptance rates for reputable alternate retailers; use low rates only when access/exclusivity/trust is load-bearing |

**Avoid double-counting.** If brand + manufacturer + retailer all point to one commercial cluster, do not treat them as three independent 25% filters unless the analysis explains three independent reasons users would reject alternatives. Example: [Hamilton Beach 12-cup coffee maker at Kohl's] → Mr. Coffee 12-cup coffee maker from Best Buy should not automatically treat non-Hamilton Beach and non-Kohl's as two harsh filters; many users mainly want an inexpensive 12-cup drip coffee maker. Example: [Realspace white cube organizer at Office Depot] → IKEA KALLAX white cube organizer should weigh storage form, dimensions, color, and price tier more heavily than the brand or retailer unless Office Depot access is itself part of the need.

## Shared-Context Test

If query and product share an event, season, occasion, franchise, licensed property, or visual tradition, classify that shared context as (full treatment in **Position Calibration** three-way-split discussion in Part 1):

- **Commercially identifying** (specific brand, IP, licensed event, coherent merchandise line)
- **Culturally identifying** (widely recognized visual/stylistic conventions — Christmas, Halloween)
- **Borderline identifying** (weddings, Easter, Valentine's Day, culturally specific occasions)
- **Merely descriptive** (no stable design tradition — Father's Day, graduation, anniversary, birthday)

Then distinguish which pattern applies:

- **Right context, wrong object** → mid poor (identifying context + different product types)
- **Descriptive mirroring** → high egregious (descriptive context + clearly different product types)
- **Broad-category substitute on a technicality** → high poor (descriptive context + product arguably within broad main term on a technicality most users would reject)

## Relatedness vs Intent Satisfaction

Do not blur these levels (see **Heuristic Overview** "Addressing user intent pushes a rating up significantly" in Part 1). A product only climbs upward by moving through the ladder:

1. Shared words / same theme (weakest)
2. Same aisle / same problem space
3. Plausible substitute / goal-advancing product (a product that helps the user reach their goal through an alternative pathway, e.g. a functional component a how-to activity requires)
4. Actual match (strongest)

Topical overlap or shared commercial domain is not equivalent to serving intent.

**Purpose-structure guardrail.** Before treating broad-purpose overlap as enough to reach “Plausible substitute / goal-advancing product,” check the operative substitute axis from Decision Gates.

- In a **purpose-convergent** case, a product may climb into substitute territory by reaching the same practical end-state through a different but user-plausible route.
- In a **mechanism-divergent** case, preserving only the umbrella purpose is usually not enough. The product should also preserve the relevant mechanism, genre, interaction loop, sensory profile, aesthetic grammar, experiential format, or other mode-bearing structure that gives the query its meaningful internal specificity.
- In a **mixed** case, or when the query shifts the default polarity, weight the axis the query actually foregrounds after domain default and modifiers are combined.

Shared broad purpose can establish relatedness. It does not automatically establish substitute acceptability.

## Substitute & Compatibility Tests

**Substitute acceptability test** (see **Key Definitions > Important requirement** in Part 1 for the underlying Poor-vs-Okay logic): For every missed important requirement, explicitly answer: does the product still work as a plausible substitute for most users with this query? If yes, lean Okay. If no, lean Poor.

Population framing. State the query's user population explicitly before evaluating "most users" — see Rating Synthesis Query population scope. A heterogeneous query covers multiple segments (different recipients, budgets, styles, sub-intents); a fully-pinned query is a single segment. A product that fits one segment of a heterogeneous query is "acceptable for a sub-segment," not "acceptable for most" — even if the fit within that segment is perfect. The denominator is the full query population, not the slice the product happens to serve.

Pair the query population statement with an explicit product target population statement before evaluating substitute acceptability — the comparison is between the two populations, and the answer is determined by their overlap. A substitute reading that names a population not stated in either Query population scope or Product target population is doing implicit re-narrowing and should be rewritten. See Rating Synthesis Product target population for the row that captures this.

Ex: [how to set up a home office] → standing desk treadmill. Query population spans desk/chair basics, monitor and lighting setups, organization systems, ergonomic upgrades, across budget tiers and work styles. A standing desk treadmill fits one slice (active-work advocates with space and budget for premium ergonomic equipment). Acceptable for a sub-segment, not most → Poor direction.

**Operative-lens rule.** The operative lens for this query is locked in Decision Gates per the Operative lens bullet — see there for the query-type-to-lens mapping. The rule below references that commitment: when this section's tests are evaluated, only the operative lens fires; the non-operative test is skipped and its Rating Synthesis row reads "N/A — non-operative for this query type."

**Purpose-structure test:** Run this when the query and product share a broad category or umbrella purpose, but differ in mechanism, mode, genre, form, sensory profile, aesthetic structure, or experiential format.

| Field | Assessment |
|---|---|
| Domain-default polarity | purpose-convergent / mechanism-divergent / mixed |
| Query-induced polarity shift | none / toward purpose / toward mechanism / mixed |
| Operative substitute axis | purpose convergence / mechanism-mode preservation / mixed |
| What the product preserves | purpose / mechanism-mode / both / neither |
| What the product misses | brief description of the load-bearing divergence |
| Substitute implication | explain whether the preserved overlap is enough for the operative substitute axis |

Decision rule:
- **Purpose-convergent:** same-end-state alignment can support substitute acceptability despite mechanism differences, unless the query shifted the axis toward mechanism/form.
- **Mechanism-divergent:** shared umbrella purpose alone rarely supports a strong substitute reading; the product should preserve the relevant mode/mechanism unless the query shifted the axis toward purpose/outcome.
- **Mixed:** use the query’s foregrounding to decide which axis is more load-bearing.

**Broadened-intent check:** Before rejecting a product as an unacceptable substitute, construct the most plausible broadened reading of the query that the product WOULD satisfy. Then ask: would a non-trivial subset of users with this query accept the product under that broadened reading? A product that serves a broadened reading of the query is typically Poor (acceptable alternative for some users, not most) rather than Egregious, regardless of how far the product is from the narrow reading. Egregious is reserved for products where no plausible broadened reading of the query accommodates them.
- *Ex: [original The Beatles concert poster] → original Nick Drake concert poster. Broadened reading: "original concert posters (any artist)." Some collectors of original concert posters more broadly would accept this despite the massive artist-profile gap (world-famous pop institution vs. cult critically-revered niche artist). Poor, not Egregious.*

Internally inconsistent queries. If Query Coherence Check flagged the literal reading as inconsistent or impossible, evaluate this check against the operating reading specified there, not the literal query. Products that fit the operating reading qualify as non-trivial subset by default.

**Compatibility / fitment dimension** (see **Position Calibration > Low poor** fitment-sensitive products discussion in Part 1):

If the product is one where real-world usability depends on matching a specific interlocking anchor (physical fitment, model-specific compatibility, consumable match, platform/system lock-in, or any case where "it has to actually work with X"), treat compatibility as its own evaluation dimension — potentially necessary rather than a side detail. Same category is not enough. Same brand is not enough. The shared fitment anchor matters more than broad substitution rules.

Examples of where this typically applies, not an exhaustive list: parts and accessories (auto parts, device batteries, printer toner, filters), consumables tied to specific systems (pod coffee, cartridges, specific chargers), platform-specific items (console games, proprietary connectors, brand-locked ecosystems).

The test: if the product misses the fitment anchor, is it functionally unusable for the user's actual query? If yes → treat fitment as necessary, not as a preferential or important spec. A result that shares one anchor point (same category, same brand) but misses the specific fitment is fundamentally useless and pins to the floor of Poor despite superficial relatedness.

## Applicable Task Categories / Concepts

| Query Type | Concept | Why |

Query Type = category (Product Seeking, Information Seeking, Retailer, Brand, etc.). Concept = the specific pattern from Part 1 — draw from **Task Categories** and **Guideline Concepts** sections (Related but Wrong Purpose/Function, Acceptable Alternative, Broad-Category Substitute, Right Context Wrong Object, Descriptive Mirroring, etc.). Why = one-line justification.

## Rating Synthesis

Compress the preceding analysis into a case profile along the dimensions that drive the rating. **Description only — no rating prescription, no routing language.** The Rating Suggestion section reads from this profile holistically; do not pre-route to a rating here.

**Linkage** — does a connection exist, and at what depth?

| Indicator | Reading |
|---|---|
| Topical/word overlap | shared terms (list them — include vehicle/device/platform identifiers, not just subject-related terms) / none |
| Commercial domain overlap | exact-anchor shared (name the anchor) / tight domain (brand or narrow family) / broad domain (same aisle / same product category, even with different use case) / adjacent (related product categories, e.g. hammer vs nails) / none — see **Position Calibration > High egregious (Pattern 1)** and the concrete-vs-abstract domain-link discussion. **Same product category is broad domain at minimum, never adjacent — even when use cases differ substantially. Hammer A vs hammer B is broad domain; hammer vs nails is adjacent.** |
| Subject participation | direct match (product engages the query subject) / context-adjacent (subject missed; commercial/anchor context matched, e.g. tie clip for [how to tie a tie]) / shared-modifier-only (matches a contextual modifier but neither subject nor commercial anchor) / no participation |

**Match quality** — given linkage exists, how good?

| Indicator | Reading |
|---|---|
| Requirement coverage | necessary ✅/❌; important: M met / P partly / X missed; preferential: M met / X missed — see **Key Definitions** |
| Purpose-structure polarity | domain default = purpose-convergent / mechanism-divergent / mixed / N/A; query shift = none / toward purpose / toward mechanism / mixed / N/A; operative substitute axis = purpose convergence / mechanism-mode preservation / mixed / N/A |
| Operative-axis preservation | full / strong / partial / weak / none / N/A — state whether the product preserves the axis identified above, not merely whether it shares the broad parent category |
| Query population scope | broad/heterogeneous (multiple recipient profiles, budgets, styles, or sub-intents plausible — name the segments) / moderate / narrow (query pins most attributes to a single segment) — denominator for Substitute acceptability and Intent satisfaction below |
| Product target population | who the product is designed, priced, marketed, and sized for — segments named explicitly (demographic, budget tier, use-case, style orientation, product-form fit, occasion specificity). For [how to set up a home office] → standing desk treadmill: active-work advocates with space and budget for premium ergonomic equipment. **Each named dimension that narrows the query population becomes a factor in Population overlap estimate below.** |
| Population overlap estimate | rough fraction of Query population scope falling within Product target population — the starting denominator for Substitute acceptability and Intent satisfaction below, not the final answer for either. List each narrowing dimension named in Product target population and estimate its filter rate; aggregate by multiplication to a final percentage. The estimate is rough, not precise; the purpose is to prevent hand-waving readings like "acceptable for many" or "strong subset" that name no population fraction. For [how to set up a home office] → standing desk treadmill: ergonomic-upgrade subset of home-office-setup ≈25% × has space for treadmill desk ≈40% × budget for premium ergonomic equipment ≈30% = ~3% of query population. Substitute acceptability and Intent satisfaction each compute their own answer against this denominator below. The aggregated multiplication is the answer. Do not add post-hoc adjustments like "broader acceptance lifts relevance to X%" or "softer reading would put it at Y%." Filter rates already represent soft narrowing — a 70% rate already accounts for users at the edges who'd accept the product despite imperfect fit. Layering a second "broader" pass on top double-counts and inflates the result. If the rates feel too strict, revise the rates upward and re-multiply — do not adjust the aggregate. The single final percentage from one multiplication is what feeds Substitute acceptability and Intent satisfaction below — the downstream rows must cite that exact number, not a separately derived "broader" figure. Format requirement for downstream rows: Substitute acceptability and Intent satisfaction must be written as "[percentage] → [band] → [label]" (e.g., "11% → <25% band → not a substitute"). A bare label without the percentage and band citation is invalid — the lookup is the reading. **Every narrowing axis between Query population scope and Product target population must appear as a separate factor in the multiplication, but every factor must reflect real user rejection, not mere term mismatch.** Do not fold multiple axes into a single rate (e.g., "outdoor/waterproof feature preference" combines use-case and product feature — these are independent and must be separate factors). Cross-check by walking each dimension named in Product target population: demographic, budget tier, use-case, style/aesthetic, product-form fit, occasion specificity. If a dimension narrows the query population, it gets its own factor. **Common axes that get illegitimately folded or omitted:** recipient demographic (gender, age, profession), budget acceptability, style/aesthetic preference, use-case applicability, product-form preference within category, brand/tier sensitivity. If the product is narrowed on N dimensions, the multiplication must have N factors. **Factor-rate heuristics:** core function/category and compatibility/fitment can be low acceptance when missed because they often determine usability; use-case/application can be medium or low depending on whether the product can do the job; price/tier gaps can be low when large and deliberate; ordinary style/color/material cues usually stay moderate-to-high unless they are the point of the query; positive brand/manufacturer/product-line misses are often high-to-moderate acceptance when the alternative preserves category/function/tier; retailer/platform misses are often high acceptance when a reputable alternative source works. Use low brand/retailer factors only when **Requirement Analysis > Filter-strength heuristics** or **Brand / Retailer / Platform Logic** identifies a real reason: officialness, collectibility, exclusivity, ecosystem/fitment, safety/trust, unique identity, membership/gift-card/access, store-exclusive assortment, or large tier gap. **Do not assign 25% just because a brand or retailer was explicit.** If brand, manufacturer, and retailer are commercially linked rather than independently constraining, keep their individual rates high or explain the independent rejection mechanism for each. Example correction patterns: [Hamilton Beach 12-cup coffee maker at Kohl's] → Mr. Coffee 12-cup coffee maker from Best Buy should not automatically use accepts non-Hamilton Beach ≈25% × accepts non-Kohl's ≈25%; the preserved function, capacity, tier, and common retailer interchangeability are stronger than the ordinary brand/retailer miss. A disciplined structure might be: 12-cup drip coffee-maker need ≈85–95% × accepts comparable budget appliance brand ≈70–90% × accepts reputable alternate retailer ≈75–95% × accepts any visible price/tier gap ≈60–90%. [Realspace white cube organizer at Office Depot] → IKEA KALLAX white cube organizer should not automatically use accepts non-Realspace ≈25% × accepts non-Office Depot ≈25%; storage form/dimensions/color/price tier usually drive acceptance more than brand or retailer. A disciplined structure might be: cube-organizer need ≈80–95% × accepts comparable store-brand/private-label alternative ≈70–90% × accepts reputable alternate retailer ≈70–95% × accepts dimension/style/tier gap from visible evidence ≈50–90%. |
| Substitute acceptability | N/A — non-operative for this query type (when the operative lens per Decision Gates is intent satisfaction). Otherwise: direct match / acceptable for most / acceptable for some / not a substitute — see **Substitute & Compatibility Tests**. **Reading derived from a substitute-acceptance percentage: of the query population, what fraction would accept this product as a substitute for what they asked for? Population overlap estimate above is the starting denominator — users outside the overlap rarely accept; users inside it usually do, but not always. Map: ≥~70% → "acceptable for most"; ~25–70% → "acceptable for some"; <~25% → "not a substitute." Hedging language like "acceptable for many" or "strong subset" without a fraction is not a valid reading.** **'Acceptable for some' fires when a non-trivial subset of users would accept the product as a substitute even if most wouldn't. 'Not a substitute' is reserved for cases where almost no user would accept it. For [waterproof jacket for hiking] → casual rain jacket, a non-trivial subset of hikers in mild conditions or low-intensity day hikes might accept the casual jacket as adequate → 'acceptable for some,' not 'not a substitute.'** **The reading must be exactly one of the four labels with no qualifying clauses.** "Acceptable for some-to-many," "addresses directly for a subset," "acceptable for most practical-gift buyers" and similar hedges are invalid — they smuggle population narrowing back into a categorical reading. If the percentage lands at a band boundary, pick the lower band; if a qualifying clause feels necessary, the correct reading is one band lower. **Format requirement.** The reading must show the derivation: "[percentage from Population overlap estimate] → [band] → [label]." A bare label without the percentage and band citation is invalid — the lookup is the reading, not a separate justification step. **Substitute concepts forbidden.** The Population overlap estimate is the only valid input; the activity-enabling extension is the only valid addend above it. No alternative metric — "gift-idea relevance," "candidate-answer strength," "subject participation level," "topical fit," etc. — may stand in for the overlap or be added to it. Outputs that route to a label via a freeform concept rather than a derived percentage (e.g., "gift-idea relevance exceeds overlap → addresses directly") are invalid regardless of whether the label feels right. **Default derivation (when this row is operative — see operative-lens rule):** Substitute acceptability % = Population overlap estimate %. Most users outside the demographic/budget/use-case overlap don't accept the product as a substitute, and most users inside it do — the two effects roughly cancel. **Deviating from the overlap % requires showing the math:** "X% inside overlap accept × overlap % + Y% outside overlap accept × non-overlap %." A bare percentage that doesn't equal the overlap and doesn't show this derivation is invalid — re-derive from the overlap.|
| Intent satisfaction | N/A — non-operative for this query type (when the operative lens per Decision Gates is substitute acceptability). Otherwise: addresses directly / activity-enabling (advances goal via alternative pathway) / sits nearby / does not advance — see **Relatedness vs Intent Satisfaction**. **Reading derived from an intent-served percentage: of the query population, whose intent does the product address or whose goal does it enable? This is a separate calculation from substitute acceptability — a product can fail as a substitute but enable the goal (whetstone for [how to sharpen a kitchen knife]: low substitute acceptability, high activity-enabling). Population overlap estimate above is the starting denominator for "addresses directly"; "activity-enabling" can extend beyond the overlap if the product enables the goal regardless of demographic fit. Map: ≥~70% → "addresses directly" or "activity-enabling"; ~25–70% → "sits nearby"; <~25% → "does not advance." "Addresses directly" and "activity-enabling" measure the share of users whose intent the product addresses or whose goal it enables, not the conceptual fit between product and query — a perfect-fit-for-one-slice reading is "sits nearby" or weaker.** **'Sits nearby' fires when the product is in the same problem space as the query, even if it solves a different specific problem within that space. 'Does not advance' is reserved for products with no problem-space relationship at all. For [windshield de-icer] → windshield washer fluid, both are windshield-maintenance products in the same problem space, even though they solve different problems → 'sits nearby,' not 'does not advance.'** **The reading must be exactly one of the four labels with no qualifying clauses.** "Acceptable for some-to-many," "addresses directly for a subset," "acceptable for most practical-gift buyers" and similar hedges are invalid — they smuggle population narrowing back into a categorical reading. If the percentage lands at a band boundary, pick the lower band; if a qualifying clause feels necessary, the correct reading is one band lower. **Format requirement.** The reading must show the derivation: "[percentage from Population overlap estimate] → [band] → [label]." A bare label without the percentage and band citation is invalid — the lookup is the reading, not a separate justification step. **Substitute concepts forbidden.** The Population overlap estimate is the only valid input; the activity-enabling extension is the only valid addend above it. No alternative metric — "gift-idea relevance," "candidate-answer strength," "subject participation level," "topical fit," etc. — may stand in for the overlap or be added to it. Outputs that route to a label via a freeform concept rather than a derived percentage (e.g., "gift-idea relevance exceeds overlap → addresses directly") are invalid regardless of whether the label feels right. **Default derivation (when this row is operative — see operative-lens rule):** Intent satisfaction % = Population overlap estimate %. **Activity-enabling extension:** if the product enables the goal regardless of demographic fit (e.g., whetstone for [how to sharpen a kitchen knife] enables sharpening for any user, regardless of age/gender/budget), the extension above the overlap % must be quantified and justified as a separate addend: "overlap % + activity-enabling extension % = total." The activity-enabling extension applies narrowly: the product must be a functional tool or component the query's activity requires, not a topically-related product. Without an explicit activity-enabling case and quantified extension, Intent satisfaction % defaults to the overlap %. A bare percentage above the overlap without this derivation is invalid.|
| Compatibility/fitment | matched / mismatched (functional break) / N/A — see **Substitute & Compatibility Tests > Compatibility / fitment dimension**. **'Mismatched (functional break)' fires only when the product is functionally unusable without the missing fitment anchor — wrong battery for a device that won't power on, wrong toner for a printer that won't accept the cartridge. Soft compatibility concerns (off-brand cartridge that may or may not work, accessory that fits loosely) are handled by substitute acceptability, not by this row. N/A applies when fitment isn't a relevant dimension for the product type at all.** |
| Broadened-intent fit | satisfies broadened reading for most users / for non-trivial subset / for almost no one / N/A (substitute acceptability already direct/acceptable) — see **Substitute & Compatibility Tests > Broadened-intent check**. State the broadened reading explicitly when the answer is anything other than "for most users" or N/A. **The check is whether the broadened reading accommodates the product, not whether the broadened reading satisfies the original narrow use-case. For [waterproof jacket for hiking] → casual rain jacket, the broadened reading is "any waterproof jacket"; that reading accommodates casual rain jackets, so the answer is "for non-trivial subset" or higher — even though casual rain jackets aren't built for hiking conditions. The hiking-suitability is what the substitute acceptability row evaluates; this row evaluates broader accommodation.** **Rating consequence: "for non-trivial subset" or stronger establishes a Poor floor — a case with non-trivial broadened-intent fit cannot be standard-machinery-rated Egregious.** **When the literal query is internally inconsistent or impossible, evaluate this row against the most plausible reconstructed reading, not the literal reading. The literal reading cannot serve as the baseline against which "non-trivial subset" is measured because no user can have intended exactly what the literal query says.** |

**Context modifiers**

| Indicator | Reading |
|---|---|
| Shared-context character | commercially identifying / culturally identifying / borderline / merely descriptive / N/A — see **Shared-Context Test** |
| Purchase commitment level | high (deliberate, costly, specific) / low (cheap, impulse-friendly) / N/A |
| Browse-adjacent plausibility | high / low / N/A — only fires when intent is missed and a domain link exists |

**Range constraints** (re-state from Decision Gates so the synthesis is self-contained)

| Indicator | Reading |
|---|---|
| Effective ceiling | active compressions: info tier (which?) / generic-query / none — see **Info Query Compression Tiers** |
| Effective floor | gradient floor at the commercial-domain rung (cite rung: exact-anchor / tight domain / broad domain / adjacent / none) / floor from missed-necessary requirement / none — see **Position Calibration > The commercial domain overlap gradient and rating floors** in Part 1. Do not cite categorical-miss subtypes here; those are evaluated as overrides in the Categorical Miss Subtype Assessment, not within the synthesis. |

**Discipline.** Every row must have a filled value; "N/A — [reason]" is a valid filled value (e.g., "N/A — info ceiling not active"). Empty rows are re-prompted. No row may state or imply a rating direction; if a reading naturally invites "→ poor" or "→ egregious" phrasing, that phrasing belongs in the Rating Suggestion section, not here.

## Standard-Machinery Rating Suggestion

Produce the rating implied by the **Rating Synthesis** above, applied through the standard framework machinery via subtractive evaluation: start from Good and work downward, eliminating each tier with a structural reason drawn from Part 1, until you reach the highest tier the case survives at. Do not start from a floor anchor and reason upward — that flow biases toward floor lock-in and under-credits substitute, broadened-intent, and same-category-with-use-case-miss mechanisms.

**Subtractive routing — each tier survives only if its survival test holds.**

- **Good survives only if** all necessary and important requirements are met with at most slight-preferential-only misses (**Key Definitions > Important requirement**; **Heuristic Overview** brand/retailer discussion).
- **Okay survives only if** at least one of: (a) Substitute acceptability is "direct match" or "acceptable for most"; (b) Intent satisfaction is "addresses directly" or "activity-enabling" against the full Query population scope; (c) Substitute acceptability is "acceptable for some" **and** the product preserves the query's main functional product category, has no compatibility/fitment break, and misses mainly soft-to-medium commercial, tier, style, retailer, or brand constraints rather than the job the product must perform. This third route is the low-Okay / same-problem-space route: the result is not what most users asked for, but it is a defensible product result in the same functional solution space. It does not apply when the missed requirement defines usability, safety, compliance, fitment, product form, or the use-case the product must accomplish. **Broadened-intent fit is not an Okay-survival mechanism at any strength.** Its only role is floor-setting: “for non-trivial subset” or stronger can prevent Egregious by establishing a Poor floor. It cannot lift a product from Poor to Okay. A product that fails “acceptable for most” can survive at Okay only through an explicitly defined substitute-acceptability route such as “acceptable for some” plus preserved functional product category, no fitment break, and mainly soft-to-medium commercial misses. Otherwise, it routes to Poor, with broadened-intent fit only preventing Egregious. (**Substitute & Compatibility Tests > Substitute acceptability test**; **Substitute & Compatibility Tests > Broadened-intent check**; **Position Calibration > Okay** range).
- **Poor survives only if** at least one of: real connection to the query (topical/word overlap or commercial-domain overlap); broadened-intent fit for a non-trivial subset; commercial-domain anchor at the exact-anchor or qualifying tight-domain rung; substrate preservation; same-category-with-use-case-miss routing (**Position Calibration > Poor** floor; **Position Calibration > Poor > Same-category-with-use-case-miss**; **Position Calibration > The commercial domain overlap gradient and rating floors**).
- **Egregious** is the residual when no higher tier survives.

**Discipline.** Survival reasons must quote the Rating Synthesis indicator label verbatim (e.g., "Substitute acceptability: acceptable for most"; "Substitute acceptability: acceptable for some"; "Intent satisfaction: sits nearby"), not a Part 1 section name (e.g., "Relatedness vs Intent Satisfaction") and not a paraphrase of the label (e.g., "sits in the problem space," "plausible candidate answer," "directly participates"). The verbatim label must appear in the tier's survival-condition list and any added guardrail must be named explicitly — if it doesn't, the tier doesn't survive. A survival reason that names a section without a specific reading, or paraphrases the label rather than quoting it, is invalid — re-derive the survival decision against the actual label text.

**Purpose-structure discipline.** The `Purpose-structure polarity` and `Operative-axis preservation` rows are diagnostic, not independent tier-survival mechanisms. When they are load-bearing, use them to explain why the operative `Substitute acceptability` or `Intent satisfaction` reading is strong or weak. Do not let shared broad purpose alone preserve an Okay reading in a mechanism-divergent case if the operative axis is not preserved enough to support that substitute reading. Conversely, do not penalize mechanism differences too harshly in a purpose-convergent case when the product still reaches the query’s end-state through a plausible alternative route.

**Reference list (consult all that apply, not just the first that matches):**
- **Key Definitions** for requirement tier interpretation
- **Heuristic Overview** for the relatedness vs intent satisfaction gradient and brand/retailer logic
- **Position Calibration** for tier definitions, the commercial domain gradient, the same-category-with-use-case-miss routing, the three-way split for shared-context cases, and the **Borderline cases** subsection
- **Info Query Compression Tiers** for any active ceiling
- **Substitute & Compatibility Tests** for substitute acceptability and broadened-intent check
- The synthesis's own indicator readings, treated as constraints on which tiers survive elimination

Suggest a rating (Egregious / Poor / Okay / Good) with a position within that range (low / mid / high), plus a short justification that names which higher tiers were eliminated and why each was eliminated, citing specific Rating Synthesis indicator readings and Part 1 mechanisms by name.

**Output format — fill exactly this template, no extra prose:**

| Tier | Status | Reason |
|---|---|---|
| Good | ❌ eliminated / ✅ survived | one-line reason citing the specific Rating Synthesis indicator reading and Part 1 mechanism by name; "—" if survived |
| Okay | ❌ eliminated / ✅ survived | one-line reason citing the specific Rating Synthesis indicator reading and Part 1 mechanism by name; "—" if survived |
| Poor | ❌ eliminated / ✅ survived | one-line reason citing the specific Rating Synthesis indicator reading and Part 1 mechanism by name; "—" if survived |
| Egregious | 🟡 residual / ⬜ not reached | "—" if not reached; otherwise leave blank (residual needs no reason — it's what's left after higher tiers eliminate) |

---

**Provisional rating before Rating Guardrails Audit:** [tier] ([low / mid / high])

This is the rating produced by the standard machinery before the targeted rating guardrails are checked. It is not yet final.
## Rating Guardrails Audit

After the standard machinery produces a provisional rating, run this targeted second-guess step before treating the rating as final.

This audit exists to catch recurring conceptual failure patterns that the standard machinery may technically have enough information to resolve, but can still mishandle through premature convergence, over-weighting, or under-crediting.

Only the **rating-affecting guardrails** below may revise the provisional rating.  
The **note-only surfaced reminders** near the end of this section do **not** by themselves change the rating; they exist to flag cases that may deserve manual attention, external checking, or fuzzy human judgment.

### How to run the audit

- Consider every rating-affecting guardrail below that plausibly applies.
- Include only guardrails that materially bear on the current task.
- Each included guardrail must identify:
  1. why it applies,
  2. which earlier premise it challenges,
  3. whether it creates upward pressure, downward pressure, or only within-band calibration,
  4. whether the provisional rating stays or is revised.
- If no rating-affecting guardrail materially applies, write:
  `N/A — no rating guardrail materially applies.`
- If one or more guardrails materially undermine the provisional rating, revise the rating here before continuing.
- The later **Position Calibration Check**, **Steelmanned Reality Check**, **Categorical Miss Subtype Assessment**, and **Override Impact** must operate on the **final rating after this audit**, not the provisional rating.

If one or more guardrails apply, use:

| Rating guardrail | Why it applies | Earlier premise challenged | Rating pressure | Audit conclusion |
|---|---|---|---|---|
| [guardrail name] | [brief] | [brief] | upward / downward / within-band only | keep provisional rating / revise to [rating] |

### Rating-affecting guardrails

#### Brand / retailer / product-line weighting — judge implied constraint, not mere mention

Use this guardrail when:
- the provisional rating is pushed downward mainly because the product misses a brand, retailer, manufacturer, or product line;
- the analysis treats the explicit mention itself as inherently high-weight.

Guardrail:
- Do not treat the mere fact that a brand, retailer, manufacturer, or product line was explicitly named as automatically strong.
- State what practical implication that commercial anchor carries here:
  - compatibility,
  - officialness,
  - authenticity,
  - collectibility,
  - prestige or price tier,
  - retailer-specific access,
  - assortment navigation,
  - trust,
  - or distinctive product identity.
- If no strong practical implication exists and the substitute preserves the product category, function, approximate tier, and normal shopping role, the commercial-anchor miss should be lighter.
- Do not stack brand + manufacturer + retailer as separate harsh penalties when they express one shared commercial idea.

#### Nearby intent — same practical goal, nearby route?

Use this guardrail when:
- the product is not a direct substitute,
- but it may still serve a genuinely nearby practical intent,
- meaning the user’s underlying goal remains recognizably close even if the product addresses a different adjacent problem within the same practical context.

Guardrail:
- Do not collapse every non-substitute into Poor.
- Consciously test whether the product addresses a genuinely nearby user intent — close enough that it still feels responsive to the practical problem space, not merely topically related.
- The connection should be meaningfully close, not merely “same broad category.”

Reference example:
- `[windscreen de-icer] → windscreen washer fluid` † — both are car windscreen liquid products, but one solves frozen glass in winter and the other cleans bugs and dirt; adjacent shelf, different actual problem. ◆ The worksheet's "addresses nearby intent approx/indirectly" captures why this is Okay rather than Poor: the product doesn't address the user's exact problem, but it addresses a nearby one within the same problem space — windscreen maintenance is the shared intent, and the product gets close enough to be defensible. ◆

#### Informational queries can be helped by products that materially enable the user’s goal

Use this guardrail when:
- the query is informational,
- the product is not an answer,
- but it may be a concrete tool, material, or product that substantively helps the user perform the queried activity or achieve the queried result.

Guardrail:
- For instructional or commercial-in-spirit information queries, distinguish:
  - a product that is merely topic-related,
  - from a product that materially helps accomplish the activity.
- A product that directly enables the queried activity can be Okay under **Information Seeking – Result is a relevant product**, even though it does not provide the requested instructions.

#### Broad idea query — too niche for the open-ended intent?

Use this guardrail when:
- the query asks for ideas, recommendations, or broad suggestions,
- and the shown product is only one narrow branch of a large possible answer space.

Guardrail:
- A product may still be relevant, but its rating should fall when it is unusually narrow across several independent dimensions:
  - recipient gender,
  - distinctive styling,
  - occasion fit,
  - premium pricing,
  - unusually specific taste profile,
  - or a very particular use case.
- Do not treat “it could be one possible idea” as enough for a strong Okay if the product is quite niche relative to the broad query population.
- In a broad idea query, Okay typically requires at least one of:
  1. the product is sufficiently generic / broadly plausible across the open-ended query population;
  2. the product matches one or more explicit query requirements strongly enough to justify the specificity of the suggestion.

#### Non-commercial query — same-name merchandise may still be irrelevant

Use this guardrail when:
- the query is clearly factual, biographical, or otherwise non-commercial,
- and the product merely shares the subject’s name, a collaboration name, or celebrity-related branding.

Guardrail:
- Same-name merchandise does not automatically create a Poor floor.
- A person/entity named in a non-commercial fact query is not equivalent to a product-system anchor such as a phone model, appliance, console, or platform.
- Treat the product as topical relatedness unless it actually helps answer or materially advance the informational intent.
- If the product is merely commercial merchandise attached to the named subject, Egregious may still be appropriate.

#### Broad query / specific product — do not over-penalize ordinary specifics

Use this guardrail when:
- the query is generic or broad,
- and the shown product is a concrete product listing with ordinary real-world details such as color, common age band, small size/capacity range, training wheels, normal variant styling, or retailer-specific packaging.

Guardrail:
- Every real product is specific. Do not penalize specificity merely because the query was broad.
- Ask whether the product’s added specifics are:
  - reasonably generic / broadly acceptable,
  - or genuinely niche enough to exclude much of the query population.
- If the added specifics are ordinary and non-exclusionary, they should not drag an otherwise relevant product down into Poor.

#### Price difference — real tier mismatch or ordinary variation?

Use this guardrail when:
- price difference is being used to push a substitute downward.

Guardrail:
- Ordinary price variation is not itself a strong reason to demote a plausible substitute.
- Price matters when it signals:
  - budget vs. luxury,
  - mass market vs. premium,
  - casual vs. professional,
  - or some other real positioning / tier break.
- If the price gap is modest or within a normal substitution range for the category, do not treat it as a decisive rejection mechanism.

### Final rating after the guardrails audit

**Final Rating:** [tier] ([low / mid / high])

Immediately below the final rating, add a short `Rating notes:` line when one or more surfaced note labels below materially apply.

Some surfaced notes correspond to rating-affecting guardrails that may also have influenced the final rating. Others are **note-only reminders**: they do not by themselves alter the rating, but flag ambiguity, visual verification needs, or fuzzy judgment that may deserve manual attention.

Use short semicolon-separated labels only. Omit the `Rating notes:` line entirely if no surfaced note applies.

Available surfaced note labels:

- `ambiguous query — consult Google results`
- `brand/retailer weighting — judge implied constraint, not mere mention`
- `nearby intent — same practical goal, nearby route?`
- `info-query product usefulness — does it materially help the activity?`
- `broad idea query — too niche for the open-ended intent?`
- `non-commercial query — same-name merchandise may still be irrelevant`
- `style similarity — might require personal judgment`
- `visual check — product image may resolve unclear requirement`
- `broad query / specific product — do not over-penalize ordinary specifics`
- `price difference — real tier mismatch or ordinary variation?`

**Rating notes:** [semicolon-separated surfaced note labels, if applicable]

**Position rationale:**
- [bullet citing the final decisive reasons for the audited rating and position]
- [add bullets as needed]

### Note-only surfaced reminders

These reminders may appear in `Rating notes:` but do not by themselves revise the rating.

#### Ambiguous query — consult Google results

Use this note when:
- the query is short, strange, idiomatic, malformed, or semantically unusual;
- multiple concrete interpretations remain plausible;
- the rating depends materially on how the query is interpreted;
- the product appears to match only by splitting query words across product title fragments, color names, or unrelated modifiers.

#### Style similarity — might require personal judgment

Use this note when:
- style, visual language, color, finish, print, pattern, or design identity is load-bearing;
- especially in fashion, decor, and other visually judged domains;
- the rating depends on whether two aesthetics are “similar enough,” “somewhat adjacent,” or “meaningfully different.”

#### Visual check — product image may resolve unclear requirement

Use this note when:
- no screenshot of the product is provided,
- a rating-relevant requirement is unclear from the visible product text alone,
- and looking at the product image could plausibly clarify whether that requirement is actually present.

## Position Calibration Check

Operates on the final rating produced by **Rating Guardrails Audit** above. If no guardrail revised the provisional rating, this is the same as the standard-machinery rating.

◆ **Cross-reference to the Rating Synthesis Commercial domain overlap indicator** — the four rung labels in **Position Calibration > The commercial domain overlap gradient and rating floors** in Part 1 match the indicator readings in the Rating Synthesis. The gradient floor stated for each rung constrains the band-boundary questions below: a proposed Egregious rating cannot answer "Why not one band higher?" against an exact-anchor reading except by revising the indicator reading itself, because the gradient floor at that rung is Poor. A proposed Poor rating answers "Why not one band lower?" by citing the gradient floor directly. Substitute-acceptability and intent-adjacency considerations operate within the floor, not against it — they determine position within the available range, but cannot drag a rating below its commercial-domain-overlap floor. ◆

Broadened-intent fit cannot answer "Why not one band lower?" when the proposed band is Okay. Broadened-intent fit at "for non-trivial subset" prevents Egregious by establishing a Poor floor; it does not prevent Poor. If the proposed rating is Okay and the only mechanism keeping it above Poor is broadened-intent fit for a non-trivial subset, the rating should be Poor — broadened-intent fit is operating one band lower than the answer claims.

Answers must cite specific Rating Synthesis indicator readings, not generic tier descriptions. When the Commercial domain overlap indicator reads exact-anchor or tight domain, the gradient floor in Part 1 is the operative constraint and must be addressed by name in the relevant band-boundary answer.

- Why not one band lower?
- Why not one band higher?
- Why this position within the band (low / mid / high) rather than one notch up or down?
- If rating is Egregious, state which position driver applies: commercial domain overlap (high), topical-only overlap (mid), no overlap (low). Do not default to mid or low without citing the driver.


### Steelmanned Reality Check

This section performs a top-down reassessment after the standard rating is complete.

Do **not** simply reuse Rating Synthesis readings as fixed facts. Treat them as earlier interpretive conclusions that may or may not be structurally sound. The goal is to identify whether the official rating depends on premises that are reasonably questionable, then construct 1–2 steelmanned alternative ratings from Part 1’s position-calibration framework.

This is not a rerun of the deductive machinery. It is a reality check against deductive isolation.

Start from Part 1’s tier gestalt:

* **Good:** product is what the user was looking for, or close enough that differences do not matter.
* **Okay:** defensible result; useful substitute or goal-advancing product despite notable mismatch.
* **Poor:** real connection, but unlikely to satisfy the user’s purpose/function.
* **Egregious:** product has no business being shown.

Then inspect whether the earlier analysis overcommitted on any premise that materially shaped the rating.

---

### 1. Fresh top-down impression

| Question                                                               | Answer                                                                                              |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Without relying on the prior routing, what does the product feel like? | exact match / strong substitute / weak substitute / related wrong product / random-or-nearly-random |
| Which Part 1 tier gestalt does that impression most resemble?          | Good / Okay / Poor / Egregious                                                                      |
| Does this impression agree with the official rating?                   | yes / no / partly                                                                                   |
| Main tension                                                           | one-line description                                                                                |

This first pass should be deliberately impressionistic but still framework-bound.

Bad: “Rating Synthesis says acceptable for some, so Poor.”
Good: “Stepping back, this looks like a same-category but wrong-use-case result: connected, but most users would not feel helped.”

---

### 2. Questionable premise audit

| Earlier premise                                                                                       | Did it materially drive the official rating? | Why it is questionable                                                      | More charitable realistic reading  | Rating effect if reweighted                                   |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------: | --------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| [e.g. requirement tier, product category, population overlap, intent satisfaction, context character] |                                       yes/no | [why the premise may have been too strict, too lenient, or over-formalized] | [best realistic alternate reading] | pushes toward Good / Okay / Poor / Egregious / no tier change |

Only include premises that could realistically change the rating band or within-band position.

Premises worth questioning include:

* whether the query’s main intent was read too narrowly;
* whether a requirement was treated as important when it may be preferential;
* whether a requirement was treated as necessary when it may only be important;
* whether population overlap was multiplied too harshly;
* whether brand, retailer, style, material, or demographic filters were overweighted;
* whether the product’s actual use-case was under-credited;
* whether same-problem-space usefulness was dismissed too quickly;
* whether broadened-intent fit was used too weakly or too aggressively;
* whether a shared context was treated as merely descriptive when it might be culturally/commercially identifying;
* whether the product was treated as a substitute when it is better understood as merely adjacent;
* whether the analysis confused visible evidence with assumptions.

Do **not** question hard constraints without a real basis:

* visible product category;
* visible incompatibility;
* clear explicit exclusion;
* clear fitment break;
* active info-query ceiling;
* clear substrate preservation floor;
* categorical miss strict-definition match;
* query coherence reconstruction already required by impossibility.

---

### 3. Steelmanned alternative rating space

| Candidate rating  |                Steelmannable? | Top-down case for it            | Premises reweighted              | Why it remains secondary                 |
| ----------------- | ----------------------------: | ------------------------------- | -------------------------------- | ---------------------------------------- |
| [Tier + position] | strong / moderate / weak / no | [Part 1 gestalt-based argument] | [questioned premises from audit] | [why official rating still holds better] |

Rules:

* Include **1–2 candidate ratings max**.
* Prefer ratings adjacent to the official rating.
* A non-adjacent alternative is allowed only when the premise audit reveals a genuine structural fork.
* Do not include an alternative blocked by hard floors, hard ceilings, fitment breaks, visible evidence, or categorical-miss rules.
* The alternative must be built from a coherent top-down story, not from isolated premise tweaks.

Rules:

- Include **1–2 candidate ratings max**.
- Candidate ratings should usually fall within a **3-position steelmannable range** from the official rating.
- Count positions as the ordered low/mid/high slots inside each tier:

  low Egregious → mid Egregious → high Egregious → low Poor → mid Poor → high Poor → low Okay → mid Okay → high Okay → low Good → mid Good → high Good

- One move between adjacent slots counts as **1 position**.
  - Example: **low Poor → mid Poor** = 1 position.
  - Example: **low Poor → low Okay** = 3 positions, so it is within the ordinary steelmannable range.
  - Example: **low Poor → mid Okay** = 4 positions, so it requires an unusually strong structural fork.
- Prefer the strongest adjacent or near-adjacent alternative first.
- A candidate more than 3 positions away is allowed only when the premise audit reveals a genuine structural fork, such as a questionable substrate-preservation call, categorical-miss call, compatibility-break call, or hard ceiling/floor interpretation.
- Do not include distant alternatives merely because a single premise can be tweaked.
- Do not include ratings blocked by hard floors, hard ceilings, fitment breaks, visible evidence, or categorical-miss rules.
- The alternative must be built from a coherent top-down story using Part 1’s tier gestalt, not from isolated premise manipulation.

---

### 4. Integrity verdict

| Field                      | Value                                                                        |
| -------------------------- | ---------------------------------------------------------------------------- |
| Official rating robustness | robust / moderately robust / fragile                                         |
| Main fragility             | premise most likely to have overdetermined the result                        |
| Best alternate rating      | tier + position / none                                                       |
| Final note                 | whether the official rating should stay, soften, or be flagged as borderline |

## Borderline cases

If the case is borderline on cultural identification or main-term broadness, use the practical rule from **Position Calibration > Borderline cases** in Part 1: charitable reading when the alternate would push toward Egregious. Borderline cultural identification clears the egregious floor. Borderline main-term broadness keeps a case in Poor rather than Egregious.

### Query Ambiguity Note — descriptive only, not a rating input

This field records the query’s ambiguity state for interpretive transparency. It does **not** independently raise, lower, cap, floor, or otherwise modify the rating. The rating must still be derived from the standard machinery above.

| Field           | Value                                                                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query ambiguity | none / research-resolved / ambiguous (bounded) / ambiguous (unbounded)                                                                                                                                                      |
| Comment         | Briefly state why this ambiguity state applies, especially whether research stabilized the query, whether several reasonable interpretations remain, or whether the intent space stayed too scattered to bound confidently. |

## Categorical Miss Subtype Assessment

Sits at the end of the analysis, after the Standard-Machinery Rating Suggestion, Rating Guardrails Audit, and Position Calibration Check are complete. Those produce the final rating under default operating mode. This section evaluates whether a categorical-miss subtype applies as an override on top of that already-locked rating.

**Best-fit identification, not diagnosis.** Surface the closest-fitting subtype candidate from **Categorical Misses** below and present the structural evidence for and against the fit. The override decision itself is made externally, informed by this assessment plus the Override Impact delta below.

| Field | Value |
|---|---|
| Best-fitting subtype candidate | name from the subtype definitions below in **Categorical miss subtypes**, or "none" |
| Strict-definition match | strong / borderline / weak / none |
| Structural features that fit | mapped to the subtype's strict definition criteria |
| Structural features that don't fit | especially divergences from the subtype's canonical examples |
| Boundary text in Part 1 that potentially applies | cite "not to be confused with" passages from the relevant subtype, when present |

If the candidate is "none," Override Impact reduces to "no override under consideration" and the standard-machinery rating stands without modification.

- **Categorical miss — burden of proof.** Categorical miss is reserved for cases where the product does not participate in the query's subject at all. A product that matches the query's main subject (same product category as the thing the query is about) and misses only qualifiers, modifiers, brand, provider, subsidy program, or other named requirements is NOT a categorical miss — it is a requirements failure, which routes through the standard Poor/Okay machinery via substitute analysis. Severity flows from the analysis; it is not evidence for a categorical miss. Do not invent new subtypes, extend subtype definitions to cover new patterns, or label a case as a categorical miss because the severity of the mismatch feels Egregious-worthy.

- **Categorical miss subtypes — strict definitions (each must fit exactly to trigger):**


- **Wrong product entirely** ‡
    - **No word match:** No word from the query appears in or refers to the product; no interpretive bridge via shared terminology. ‡ This subtype diagnoses the floor (Egregious) but does NOT determine position within Egregious. A "no word match" case can still land in high egregious when query and product share a commercial domain (same aisle of the store) — see **Position Calibration > High egregious (Pattern 1)** for the shared-commercial-domain lift. Position within Egregious is determined by whether any domain or browse-adjacency link exists, not by the word-match subtype alone. ‡
    - **Word match only:** One or more words from the query appear in the product, but refer to a different thing — different meaning, different entity, different referent. The shared word is a surface coincidence, not a category match. *Ex: [java tutorial] → Indonesian coffee beans — "java" is the same word but refers to a different thing.* ‡ NOT triggered when the shared word refers to the same product category in both query and product and the product merely misses a use-case, application, or variant constraint — regardless of how large the use-case gap is. [motor oil for diesel engine] → motor oil for gasoline engine is not word-match-only: "motor oil" refers to the same product category, the miss is on engine-type compatibility. Requirements failure, Poor direction. [glue for paper crafts] → construction adhesive is not word-match-only: both are adhesives — the miss is on use scale and application (delicate craft bonding vs. heavy-duty construction bonding). The application gap is large, but the shared category term still refers to the same category. Requirements failure, routed through substitute acceptability (construction adhesive is not an acceptable substitute for paper-craft glue — Poor). The "does the shared word refer to the same thing" test is strict about referent, not lenient about use-case proximity. A large use-case gap within the same product category is never word-match-only; it's a requirements failure. ‡ This subtype diagnoses the floor (Egregious) but does NOT determine position within Egregious. A "no word match" or "word match only" case can still land in high egregious when query and product share a commercial domain — see **Position Calibration > High egregious (Pattern 1)** for the shared-commercial-domain lift. Position within Egregious is determined by whether any domain or browse-adjacency link exists, not by the word-match subtype alone.
    - **Descriptively-assisting term treated as main term:** ‡ When a query contains a modifier that narrows or describes the main term, and the product matches the modifier while missing the main term, the modifier does not establish meaningful relatedness. ‡ Any relatedness between the product and the query's main subject exists independently of the shared modifier — the modifier's descriptively-assisting function makes it invalid as an anchor. ‡

    This is a subcategory of word match: the algorithm latches onto a contextual/descriptive term rather than the object being sought. It tends to be more ambiguous than straightforward word-match cases, which is why it warrants explicit treatment. ‡

    Examples: ◆
    - [drawer organizer for bedside table] → dining table ◆
    - [LED strip lights for gaming desk] → standing desk ◆
    - [phone holder for treadmill handlebar] → bicycle handlebar grips ◆

    In each case the algorithm latched onto a category noun (table, desk, handlebar) and surfaced a different type of that category, ignoring the actual object being sought. ◆ This is the mid egregious version of descriptively-assisting failure, where no meaningful commercial parallel exists between query and product. Two related-but-distinct patterns where the query and product share a descriptive modifier mirrored across both can land differently: at **high egregious** when the main terms are clearly different product types (*[graduation watch] → graduation cap and gown*), † or at ⬥ **high poor as a broad-category substitute** when the product plausibly falls within the query's main term as a broad category on a technicality most users would reject (*[lilac birthday decor] → lilac disposable salad plates*). ⬥ See the **Position Calibration** section below for the full distinction. ◆

    Because the descriptively-assisting term is invalid as an anchor, the remaining relatedness between product and query determines the rating — which in most cases is minimal, placing these in egregious.

    Not to be confused with info-query format mismatches. The descriptively-assisting pattern requires the shared term to be playing a non-main, modifier-like role in the query — narrowing, contextualizing, or describing the main subject. It does NOT apply when the shared term is the main subject of the query itself, even when the query is informationally framed. An informational wrapper ("reviews of X", "how to do X", "price of X at Y") does not demote X to a modifier — X is still the query subject, and a product that matches X is matching the subject, not latching onto a modifier.

    Commercial-in-spirit info queries — the query subject is a product asked about informationally. An air fryer product listing for [are air fryers worth it] is not descriptively-assisting; "air fryers" is the main subject, not a modifier.

    Domain-adjacent products for subject-missed queries — the query subject is not directly matched by the product, but a reasonable commercial context anchor exists (the domain the subject lives in) and the product sits within that domain. A tie clip or pocket square for [how to tie a tie] is not descriptively-assisting; "tie" is the main subject, and the product is domain-adjacent (menswear / tie-related accessories) rather than latching onto a subordinate term.

    Intent-supporting products — products that don't directly address an informational or service user intent but substantively help accomplish it through an alternative pathway — for example by providing a functional component the activity of a how-to query requires — can land in low to low-mid okay, compressed downward by range limits like info ceilings or generic queries. A whetstone for [how to sharpen a kitchen knife] — the whetstone is the tool the activity requires; the product advances the user's goal even without teaching the technique.

    The distinguishing test: does the product help the user reach their goal, or does it just sit nearby in the same commercial domain? A whetstone for [how to sharpen a kitchen knife] is activity-enabling — the whetstone is directly used in sharpening and is required for the result. A knife-block cutting board for the same query is browse-adjacent — kitchen-domain, plausibly impulse-added, but not part of reaching the sharpening goal. Same-domain products can fall into either category; the test is functional dependency on reaching the goal, not domain membership.

    Once the descriptively-assisting pattern is correctly ruled out, these cases route through the standard mechanisms. When a commercial context anchor exists and the query's direct intent is missed, apply the change-of-mind / browse-adjacent plausibility test from the low poor / high egregious discussion: concrete domain link plus low commitment and plausible browse-adjacent purchasing lands in low poor; abstract domain link plus high commitment pushes toward high egregious. A tie clip for [how to tie a tie] has a concrete domain anchor (tie-wearing / menswear accessories) and low commitment (cheap accessory) — low poor. The info-query ceiling compresses the top of the available range; it does not interact with the floor.

    The categorical-miss diagnosis requires a category jump: the product lands in an entirely different commercial category from what the query subject is about. An example: [how to polish leather boots] → boot-shaped keychain — the algorithm latching onto "boots" as a category noun and surfacing a different boot-shaped object from a different commercial category. Simply being a product when the user wanted something else, or being domain-adjacent to the subject, is not a category jump.

    - **Misinterpretation:** The system parsed the query incorrectly at the semantic level — the result responds to a different meaning of a word, phrase, or entity reference than any reasonable user would intend. Not to be confused with correctly-parsed queries where the product misses specific requirements (provider, brand, pricing tier, compatibility, subsidy program, etc.). When the product is recognizably responding to the same reading a reasonable user intended but fails to meet specific named requirements, that is a requirements failure handled by the standard machinery — Poor or Okay depending on substitute acceptability — not a misinterpretation.

- **No reasonable commercial intent:** The query has no purchase intent and no product can meaningfully satisfy it. ‡

## Override Impact (only filled if Categorical Miss Subtype Assessment surfaced a non-"none" candidate)

Subject participation: [standard reading] → [becomes structurally moot under override]
Effective floor: [standard reading per gradient] → [becomes Egregious under override]
Substitute acceptability: [standard reading] → [becomes moot under override]
Broadened-intent fit: [standard reading] → [becomes moot under override]
Net rating shift: [standard rating] → [override rating]

(All other indicator readings are decoupled from the regime and remain as stated in the synthesis.)

## Formatting

- Phrases over sentences. Cut all filler.
- No "this term refers to" or "the user is likely looking for" — just the payload.
- Every word must earn its place.
- Keep row names short (omit redundant words like "match" or "requirement").
- Expand abbreviations and acronyms on first use.
- Use ✅ / 🟡 / ❌ to visually indicate positive, mixed, or negative assessments wherever applicable.
