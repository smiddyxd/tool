https://chatgpt.com/g/g-p-6a05799613f08191be2b41c4e68c503b-rating/c/6a05e9ed-a3dc-83eb-8f3d-fd9330a7840e

Yes — I’d implement this as a **small Part 1 doctrine addition** plus a **surgical replacement of the existing `Query type` Decision Gates row**.

The key idea should be:

> **Query type is a matter of framing:** what is the query, as a whole, framed as the user trying to obtain, access, or have fulfilled?

That wording is elegant, generalizes well, and captures exactly what **2.md** is doing in the hotel / delivery / brand / ticket / app examples.

---

# Patch plan

## 1. Part 1 — add a compact conceptual subsection

**Insert this immediately before** the existing paragraph that begins:

> `Info queries (and likely service queries) are compressed at the top...`

```md
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
```

### Why this works

This cleanly converts **2.md** into a general doctrine instead of a loose list of examples:

* `[hilton hotel rooms]` and `[pizza delivery]` show that **service framing can dominate even when a tangible product/space appears in the query**.
* `[Sephora]` shows that **bare brands are not automatically product or service queries**.
* `[ubereats app]` shows that **an app remains a digital product query when the app itself is the framed object**.
* The tickets examples explicitly support **case-by-case framing judgment** rather than blanket rules.

---

## 2. Part 2 — replace the existing `Query type` Decision Gates bullet

**Find this current block:**

```md
- **Query type:** Product / Information / Service / Retailer-Brand / other. Info queries retain their informational classification even when shopping intent is clear — do not reclassify as Product. Compression tiers (see **Info Query Compression Tiers** in Part 1 for the full treatment):
  - Normal info query (how does X work, why does Y happen) → cap around mid okay.
  - Commercial-in-spirit info query (best X, X reviews, X comparison) → cap around high okay.
  - Transaction-framed info query ([price of X at Y], [cost of X], [X in stock at Y], [when is X on sale]) → cap remains at Okay (not Good — still an info query) but can reach high okay cleanly. Retailer, brand, and price-tier misses on these queries are diagnosed via the product-query machinery (a missed retailer is a Poor-direction miss, not a Necessary-missed Egregious floor), with the info ceiling still compressing the final position.
```

**Replace it with this:**

```md
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
```

### Why this works

This does three things better than the current version:

1. It makes **query-type classification visible in the actual analysis output**, rather than burying the logic in private reasoning.
2. It operationalizes your preferred framing concept directly:

   > *What is the query framed as?*
3. It separates **query-type classification** from the **information-query compression subtype**, which are currently mixed together in the same bullet.

---

## 3. Tiny cleanup I’d make while touching Decision Gates

The current **Operative lens** list maps:

* Product
* Commercial-in-spirit info
* Instructional info
* Service

…but **not Retailer-Brand**, even though `Retailer-Brand` already exists as a Decision Gates query type. That looks like a small structural omission.

I’d add this line under **Operative lens**:

```md
  - Retailer-Brand queries → substitute acceptability is operative, interpreted through **Brand / Retailer / Platform Logic**; intent satisfaction is N/A.
```

That keeps the Decision Gates taxonomy internally complete without changing the rating philosophy.

---

# Net effect

This change gives the manual a crisp doctrine:

> **Query type is not determined by which nouns appear. It is determined by the query’s dominant framing.**

And the per-task template will now visibly report that classification as:

> `Query type: Service — the query is framed around obtaining delivery fulfillment, not merely acquiring pizza as a product.`

That is exactly the kind of compact, operationally useful clarification **2.md** supports.
