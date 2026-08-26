# Weight Loss Manual — Final

This manual contains original task guidance plus added supplemental guidance. Added guidance is placed next to the most relevant official passage and is meant to clarify practical application, especially for screenshot/OCR-based rating workflows.

## Source labels

- **Official guidance** = original task instructions and category guidance.
- **Added guidance** = supplemental guidance integrated into this manual to clarify practical application; it is part of this manual but not part of the original official guidance.
- **Non-manual indicators** = useful case-specific indicators not explicitly present anywhere in this manual; these may be mentioned in per-task output when relevant.
- **Adapted seed nodes** = reusable borderline-reasoning mechanisms translated from structurally analogous category-rating cases and checked against the Weight Loss guidance. They are starting hypotheses, not Weight Loss precedents, and should be refined or replaced when completed Weight Loss cases provide better evidence.
- **Case-derived reasoning nodes** = reusable borderline-case reasoning patterns extracted from completed Weight Loss rating discussions. Multiple nodes may apply to one task. These remain subordinate to Official and Added guidance.

---

# Official guidance

**N.B.: this document was updated on February 12, 2019.Please review carefully.**

In this project you are asked to review ad creatives or web pages, and to decide whether or not they fall under the Weight Loss category. The results of this work will allow publishers to exclude ads related to Weight Loss from their websites.

**Note:** If you have any ad blocking software enabled, please pause it for the duration of this task, or you will not be able to complete it.

## Task structure

Each task will contain one ad creative or one web page. Your task is to review this ad creative or web page and decide whether it falls under the Weight Loss category. You might get a lot of ad creative tasks or a lot of web page tasks in a row; this is normal and expected.

1. **IMPORTANT:** When labelling a web page, please `take its URL into account`. You will find the URL right underneath the web page. If there is evidence in the text of the URL itself that the content of the webpage belongs to the Weight Loss category, please rate accordingly. Example:
    - [http://www.realdose.com/k/weight-loss/lose-belly-fat-naturally/] (weight-loss/lose-belly-fat)
    - [http://www.youtube.com/user/insanehomefatloss] (fatloss)

### Added guidance — URL evidence

A visible webpage URL can be sufficient evidence when it clearly points to the Weight Loss category, even if the visible page or creative is sparse. Do not rely on the URL alone if its category implication is weak, generic, or contradicted by the visible content.

2. **Some ad creatives and web pages might be unrateable.** The most common reasons to select "unrateable" are:
    - content is not primarily in your rating language
    - content does not load
    - content has no text, or contains too little content to understand what it is about
    - content does not render well enough to interpret
    - there's an error preventing you from viewing the content
    - page contains little content and requires registering or logging in
    - web page contains a video and lacks textual content that describes its contents
    - web page has offensive content that you're not comfortable examining closely

    Please leave a brief comment explaining why you think the ad creative or the web page is Unrateable.

3. **Comments**. If you have comments regarding particular tasks, please use the comment section for that.
4. **Not sure how to rate.** If you are not sure how to rate a whole task or part of it, please still provide your best answer and additionally add a brief comment saying that you are not sure. For example, "not sure how to rate" or "not sure how to rate creative since ...". It is very important that you leave comments in such situations. It will allow us to confirm the ratings and enrich this set of guidelines with additional explanations.

### Added guidance — task grounding and research

Begin with everything present in the task: visible text, URL, imagery, advertiser or brand information, product and program names, CTA, page state, and other visible details.

Research is a normal and expected part of task analysis. Before rating, identify and research every visible clue whose identity or meaning could materially affect the Weight Loss classification, including:

- advertisers, companies, providers, clinics, brands, products, programs, apps, services, campaigns, diets, procedures, therapies, ingredients, medications, supplements, devices, wearables, and websites;
- words or multi-word phrases that could plausibly be names, titles, slogans, program names, product names, service names, campaign names, or other specific references, even when they also make sense as ordinary language;
- abbreviations, acronyms, stylized spellings, unusual capitalization, compound words, usernames, domains, and unfamiliar labels;
- medical, nutritional, cosmetic, fitness, wellness, therapeutic, or industry terminology that may have a specialized meaning;
- ordinary-looking wording that may have a non-obvious secondary meaning relevant to weight loss, fat reduction, dieting, general wellness, disease management, athletic preparation, or another competing purpose.

When uncertain whether a visible clue warrants research, research it. Search the exact visible wording first and, when useful, test contextual variants or combinations with other visible clues, such as `[term] weight loss`, `[term] fat reduction`, `[term] diet`, `[term] slimming`, `[term] product`, `[term] program`, or `[term] meaning`. Do not stop after one formulation while another plausible identity or meaning remains unresolved.

Prefer authoritative first-party sources when available, such as official provider, product, program, manufacturer, app-store, clinic, or campaign pages. Use reliable secondary sources when first-party material does not adequately resolve the question. Disambiguate similarly named entities using the surrounding task context.

Research may establish the identity, nature, category, marketed purpose, or relevant meaning of something actually present in the task. It may resolve a case toward Yes, No, or continued uncertainty. This is different from inventing unseen behavior.

### Added guidance — Weight Loss research pitch guardrail

Weight Loss classification depends on the purpose of the particular advertised offer, not merely on a broad association with health, fitness, dieting, medication, wellness, beauty, or a provider that sometimes offers weight-loss services.

- Research about the exact visible product, program, campaign, procedure, provider, or term may establish a weight-loss or fat-reduction purpose.
- General facts about a brand, product, ingredient, medication, clinic, or provider must not manufacture a weight-loss pitch that is absent from the advertised task.
- Do not import the purpose of a different campaign, another product line, an unrelated page, or one possible use of a multi-purpose product into the current creative.
- When an exact product has several uses, determine which use the current offer promotes. A possible weight-loss use is not enough by itself.
- Research must correspond to the exact task clue and support the property or purpose used in the rating.

Do not:

- assume what happens after clicking a CTA unless the destination or behavior is actually researched;
- invent unseen landing-page content;
- attribute a weight-loss purpose to the task merely because the advertiser operates somewhere in the weight-management ecosystem;
- treat a similarly named but different entity as evidence;
- merge visible evidence, verified research, and inference into one undifferentiated claim.

Keep visible task evidence, verified research findings, and inference conceptually distinct.

### Added guidance — classify the promoted claim, not its medical truth

The task asks whether content promotes weight loss or fat reduction. It does not ask whether the advertised method is medically effective, scientifically supported, safe, or advisable.

- A visible weight-loss or fat-reduction claim can establish category relevance even if its effectiveness is doubtful.
- Do not turn the classification into medical fact-checking.
- Research may clarify what is being claimed or marketed, but should not replace the advertised purpose with an assessment of whether the claim is true.

### Added guidance — Unrateable vs uncertain

- Unrateable means you cannot assess the content at all because it failed to load, is in the wrong language, is behind a login wall, has too little visible evidence, or otherwise cannot be interpreted.
- Uncertain means there is assessable content but classification is difficult; in that case, give your best rating and leave a brief comment.
- Do not use Unrateable as a fallback for ambiguous but assessable Weight Loss cases.
- If the official manual gives a category-specific uncertainty rule, apply that rule when choosing the best Yes/No rating.
- Before selecting Unrateable because the content contains too little information, complete the research sweep. Sparse visible content may still contain a name, phrase, domain, slogan, product, procedure, or program that research can resolve.
- Do not treat something as unidentifiable merely because its meaning is not self-explanatory from the creative.

---

# Scope of the Weight Loss category

## Official guidance

The Weight Loss category **includes** ad creatives and web pages related to all products, procedures, therapy and advice intended to promote weight loss and/or fat reduction.

It **excludes** ad creatives and web pages related to therapies, training or weight management plans whose aim is not to promote weight loss or fat reduction.

### Added guidance — practical core test

Ask whether the visible content promotes weight loss or fat reduction through products, procedures, therapy, training, plans, advice, or related services. This is a shorthand for applying the official scope above, not a replacement for it.

### Added guidance — applying scope in gray-area cases

- The same therapy or product can rate positive or negative depending entirely on the pitch.
- Weight loss mentioned alongside other purposes can still rate positive when it is a visible stated purpose or meaningful part of the pitch. Do not require weight loss to be the only purpose.
- Do not treat generic wellness, fitness, nutrition, detox, cleanse, spa, therapy, or coaching content as positive unless the visible pitch is intended to promote weight loss and/or fat reduction.

---

# Topics included in the Weight Loss category

## Official guidance

### **(1) Content related to diets and weight loss plans**.

This includes diets, plans, training and advice intended to promote weight loss; any ads mentioning diets and dieting generically (without further specification); and calorie/bite counters, low-calories / low-fat food, snacks and drinks. However it excludes ads related to dieting for purposes other than losing weight, e.g. diets to manage or treat specific health conditions like diabetes or digestive tract ailments, or diets designed for athletic preparation.

#### Canonical **Positive** Topics:

- ✔️ advice and plans for losing weight
- ✔️ diets and `recipes`
- ✔️ training and coaching
- ✔️ `dietitians' directories`
- ✔️ `low-fat / low-calories food and drinks`
- ✔️ calorie counters, bite counters and `dieting apps`

### Added guidance — practical positive signals for task-evidence rating

• explicit mention of losing weight, fat loss, fat reduction, or fat burning (partly redundant with: official scope includes content intended to promote weight loss or fat reduction)
• calorie counting, bite counting, dieting apps, food-tracking tools, or similar measurement tools used for dieting or weight loss (partly redundant with: official positive topics include calorie counters, bite counters and dieting apps)
• recipes, diet plans, or meal plans when presented in a weight-loss, dieting, low-calorie, or low-fat context
• weight management as a stated service when it is visible as a meaningful part of the pitch
• training or coaching where weight loss, fat loss, waist reduction, slimming, or ideal-weight achievement is the stated goal
• generic “diet” or “diet plan” offers, even without a more specific fat-loss claim, when the visible content does not indicate a non-weight-loss purpose (partly redundant with: official topic includes ads mentioning diets and dieting generically)
• low-fat, low-calorie, low-carb, sugar-free, or “slim” food/drink products when the visible pitch supports a dieting or weight-loss reading

#### Canonical **Negative** Topics:

- ❌ workout diets and meal plans that are not intended for weight loss
- ❌ generic info on nutrition, tips for healthier eating, recipes
- ❌ non-weight loss diets e.g. for diabetes, weight gain
- ❌ `coaching / advice that might include, but not specifically focus on, weight management` (cryotherapy)

### Added guidance — practical negative signals for task-evidence rating

• healthy eating, nutrition tips, recipes, or general food content with no visible weight-loss claim (partly redundant with: official negatives exclude generic nutrition/healthy eating/recipe content)
• medical diets, such as diabetes, cholesterol, digestive-condition, or other treatment-oriented diets, when the aim is not losing weight
• general wellness or nutrition information with no weight-loss or fat-reduction angle
• nutritionist directories, as distinct from dietitians' directories
• personal training, coaching, exercise classes, or fitness support with no visible weight-loss mention
• weight loss appearing only as one item in a long list of wellness goals, with no meaningful weight-loss focus or pitch

### **Positive** Weight Loss examples:

- ✔️ Burn Fat, Feed MuscleResults oriented fitness traininginstant fat loss now
- ✔️ Really want to lose KG's?No Diets to buy, No Books, No weird Exercises or strange weight tips
- ✔️ Get to your ideal weight.Rivermont-area fitness programsExperienced fitness coaches
- ✔️ Abbs Cross Health&Fitnessconker your waistline save $145 no join fee & 3rd month free
- ✔️ Get Ripped With TGrip MaxPush Your Workout To The Max!Achieve Fat Shredding Results.
- ✔️ `Half Price Diet Plan1 Week Meals Delivered, Only $30.Promo Code 50OFF. As Seen On TV!`
- ✔️ Online Calorie CounterCalorie counting made easy.Search from over 70,000 foods.
- ✔️ `My Diet ShopWe specialise in low carb, sugar free, low fat and diabetic products`
- [✔️ http://www.MyFoodDiary.com/]
- [✔️ http://www.thenuclearoptiondiet.com]
- [✔️ http://michael849xtplb.mywapblog.com/the-flat-belly-diet-what-it-is.xhtml]
- [✔️ http://www.realdose.com/k/weight-loss/four-healthy-foods-that-create-belly-fat/]
- [✔️ http://www.kyleleon-customizedfatloss.com/]
- [✔️ `http://mydiet-shop.co.uk`]
- [✔️ http://www.nugonutrition.com/products/slim/]

### Added guidance — diet and mixed-purpose example notes

- Generic diet-plan wording can be positive without further specification as to fat loss or another purpose, as long as visible content does not indicate a non-weight-loss purpose. This reflects the official inclusion of ads mentioning diets and dieting generically.
- Low-carb, sugar-free, and low-fat food/drink examples can be positive when the visible offer supports a dieting or weight-loss reading, even if another purpose such as diabetic products is also mentioned as an aside.
- Weight-loss wording in the URL, domain, product name, or page text is a strong positive clue when supported by the visible content.
- A visible “wellness & weight management” phrase can be enough for a positive rating when weight management is a meaningful visible service, even if the creative also uses broader wellness framing. Do not generalize this to purely generic wellness content with no meaningful weight-loss or weight-management pitch.

### **Negative** Weight Loss examples:

- ❌ Great Pork RecipesGive A Fork About Pork and look for the Red Tractor Logo!
- ❌ Are You Over 65?Stay Healthy & Independent With Exercise Classes & Physio for 65+.
- ❌ Low Cholesterol DietCreate A Personal Health Plan Here & Start Meeting Your Health Goals!
- ❌ Personal Fitness Plan Support Sutton.Want Help From a Personal Trainer?
- [❌ http://www.surja.com/]
- [❌ http://www.nutritionist-resource.org.uk]
- [❌ http://www.diabetescare.net/About/WeightManagement/#.UUsD0leQOIQ]
- [❌ http://www.nutrihealthsystems.com/weight-gain-diet.htm]
- [❌ http://www.puristat.com/bloating/bloating-flatulence-gassiness.aspx]

---

## Official guidance

### **(2) Content related to weight loss products**.

This includes drinks, supplements, pills etc. However it excludes supplements not intended to promote weight loss, e.g. supplements for athletic preparation, vitamins, etc.

#### Canonical **Positive** Topics:

- ✔️ drinks, supplements, diet pills
- ✔️ hormone therapies or supplements that are weight-loss related
- ✔️ meal replacements
- ✔️ body wraps and other wearables

### Added guidance — practical positive signals for task-evidence rating

• explicit “weight loss,” “lose weight,” “fat burning,” “burn fat,” “slim,” or similar product claims on drinks, supplements, pills, shakes, coffees, body wraps, or wearables
• meal replacements paired with explicit weight-loss, appetite-control, hunger-control, dieting, or fat-burning claims (partly redundant with: official positive topics include meal replacements)
• hormone therapies or supplements when the visible content ties them to weight loss or fat reduction (partly redundant with: official positive topics include weight-loss-related hormone therapies or supplements)
• body wraps and other wearables when the visible content presents them as weight-loss, slimming, inch-loss, or fat-reduction products

#### Canonical **Negative** Topics:

- ❌ supplements for athletic training, fitness supplements
- ❌ energy drinks
- ❌ `meal plans`
- ❌ vitamins
- ❌ cooking ingredients for healthy diets

### Added guidance — practical negative signals for task-evidence rating

• non-weight-loss supplements, such as vitamins, thyroid products, energy boosters, athletic-preparation supplements, or fitness supplements (partly redundant with: official negatives exclude supplements not intended to promote weight loss)
• cooking ingredients, oils, superfoods, or healthy-diet ingredients with no visible weight-loss pitch
• energy drinks with no visible weight-loss or fat-reduction claim
• meal plans that are not presented as weight-loss products or diet plans

### **Positive** Weight Loss examples:

- ✔️ Lose Weight Quick & EasyHigh Quality Weight Loss DrinkMade Of Natural Ingredients. Call Now!
- ✔️ Meal Replacement Shakes2013's "10" Best Meal Replacements.Shakes That Stop Hunger & Burn Fat
- ✔️ Lose WeightJavita Coffee Natural weight loss without pillsInfused with Garcinia Cambogia herb
- ✔️ Lose 10 Pounds Fast?What is 2013's Best Supplement for Weight Loss?Lifetime Guarantee.
- ✔️ Sensible Weight LossGet The Natural Solution for Obesity and Metabolism Disorders
- [✔️ http://www.s-recipes.com/home/index.php]
- [✔️ http://www.DietPillUniverse.com]
- [✔️ http://www.newhomeliposuction.com]

    [](https://lh3.googleusercontent.com/Ekv44MI_Dp-jdHeWV8YJd3jOqjxfR9WqeDl0bFIjaA5xubu8hJfSYWItN372SVDsaw=w600)

### **Negative** Weight Loss examples:

- ❌ Top Thyroid SupplementTry Thyroid Helper for Better Thyroid, Energy & Metabolism
- ❌ Is Olive Oil Good Enough?Saffola Total With 2X Antioxidant Power of Olive Oil.Know More!
- ❌ Energy Drink SpecialOnly $18 for Celsius Clean Energy Sample Trio - Free Shipping
- ❌ Easy high protein recipesJoined a gym but getting nowhere?Try these easy protein recipes
- [❌ https://www.muscleguru.in]
- [❌ http://www.wellnessresources.com/products/thyroid_helpernn.php]
- [❌ http://www.nuts.com/nuts/coconut/oil.html]

---

## Official guidance

### **(3) Content related to weight loss and fat reduction procedures**.

This includes surgery and other procedures to achieve weight loss and fat reduction. However it excludes cosmetic procedures not aimed at weight loss or fat reduction, e.g. tuck, lifts etc.

#### Canonical **Positive** Topics:

**Note:** This includes promotions for fat-reduction treatments that are **not** dieting. Examples:

- ✔️ liposuction-alternative treatments
    - e.g. [https://airsculpt.elitebodysculpture.com/lp/results-ba/]
- ✔️ ultrasound / electro-stimulation treatments
    - e.g. [https://wardphotonics.com/ultraslim.php?t=Ultraslim]
- ✔️ gastric bands
- ✔️ sleeve gastrectomy
- ✔️ "Coolsculpting"
- ✔️ Any targeted fat-loss procedures
- ✔️ Other weight-loss or fat-reduction procedures

### Added guidance — practical positive signals for task-evidence rating

• liposuction itself, liposuction alternatives, laser lipo, fat freezing, fat removal, fat reduction, inch loss, or targeted fat-loss procedure language
• surgery or medical procedures when weight loss, fat reduction, slimming, or obesity treatment is the stated outcome
• gastric bands, sleeve gastrectomy, intra-gastric balloons, bariatric procedures, Coolsculpting, ultrasound treatment, or electro-stimulation treatment when presented for weight loss or fat reduction (partly redundant with: official positive topics list these procedures)

#### Canonical **Negative** Topics:

- ❌ tummy tucks
- ❌ face lifts
- ❌ other generic/unrelated cosmetic procedures

### Added guidance — practical negative signals for task-evidence rating

• skin-tightening, lifting, anti-aging, or similar cosmetic procedures with no visible weight-loss or fat-reduction aim
• body contouring, sculpting, spa, or cosmetic-clinic language with no explicit fat-removal, fat-reduction, inch-loss, slimming, or weight-loss claim
• tummy tucks, face lifts, or other cosmetic procedures when not presented as weight-loss or fat-reduction procedures (partly redundant with: official negative topics list tummy tucks, face lifts and unrelated cosmetic procedures)

### **Positive** Weight Loss examples:

- ✔️ Gastric Band $4995The UK's Lowest Cost Gastric Band.The UK's Leading Bariatric Hospital
- ✔️ Sleeve Gastrectomy (VSG)Experienced Michigan SurgeonPackage Pricing: $11,000
- ✔️ Dr Blair Bowden - OrberaOrbera is a non-surgical and proven intra-gastric weight-loss balloon.
- ✔️ Laser Lipo to Lose WeightLose 2-6cm of body fat in 30min.Painless. No surgery. No Starvation
- ✔️ Freeze The FatBest Fat Reduction Practice.Top New York certified dermatologist.
- [✔️ http://www.veinskin.com/fat_reduction_kelowna_coolsculpting]
- [✔️ http://www.wakehealth.edu/laparoscopic-surgery]
- [✔️ http://www.drpleatman.com]
- [✔️ http://www.trueresults.com/weight-loss-surgery]
- [✔️ http://www.hypoxi.com.hk]

### **Negative** Weight Loss examples:

- ❌ Terrified of a TummyTuck?Choose the natural way instead!European patent since 1998.
- ❌ B'ham Cosmetic DoctorsFind & Research Birmingham's Top Cosmetic Doctors
- [❌ http://www.cosmeticsurgery.sg/sculpted-body/tummy-tuck]
- [❌ http://harleystreetskinclinic.com/french-lift/]

---

## Official guidance

### **(4) Content related to softer treatment options to achieve weight loss and fat reduction**.

This includes softer therapies and treatments (e.g. hypnosis) intended to promote weight loss; clinics, spas or health resorts focusing on providing such treatments. However it excludes ads promoting similar treatments, whose emphasis is not on weight loss.

**Note:** This also includes alternative medicine treatments which emphasize weight loss, including those mentioning GI issues or gut health. Example:

- [https://www.humnutrition.com/product/9/skinny-bird]
- [https://www.youngliving.com/us/en/product/slique-citraslim]

### Added guidance — practical positive signals for task-evidence rating

• hypnosis, alternative medicine, clinic, spa, health-resort, therapy, or softer-treatment content when the visible emphasis is weight loss or fat reduction (partly redundant with: official topic includes softer therapies and treatments intended to promote weight loss)
• “slim,” “skinny,” or “lean” in the product name, brand name, URL, or domain when supported by weight-loss, slimming, or fat-reduction context
• visible weight-loss language in the URL or domain, especially when paired with softer-treatment, clinic, spa, health-resort, alternative-medicine, gut-health, or GI-health content
• alternative medicine treatments that emphasize weight loss, including those mentioning GI issues or gut health (partly redundant with: official note includes alternative medicine treatments that emphasize weight loss)

### Added guidance — practical negative signals for task-evidence rating

• cryotherapy, hypnosis, alternative therapy, clinic, spa, or health-resort content with no visible weight-loss or fat-reduction claim
• clinics or spas with no visible weight-loss focus
• general wellness, detox, cleanse, gut-health, GI-health, relaxation, beauty, or alternative-medicine framing with no visible weight-loss angle

### **Positive** Weight Loss examples:

- ✔️ Natural Weight LossAyurvedic Weight Loss Treatments In Kerala.Get More Details Now.
- ✔️ Weight Loss HypnotherapyEmpower Yourself to Beat Harmful Habits!Lifetime Guarantee.
- ✔️ Need to Lose Weight?Physician Supervised Weight Loss.6 Weeks To A New You! Call Today
- [✔️ http://medifastcalifornia.com/]
- [✔️ http://www.SuddenlySlimmer.com]
- [✔️ http://www.hypnoticweightloss.com.au]
- [✔️ http://www.dietassist.co.uk]

### **Negative** Weight Loss examples:

- [❌ http://www.pahypnosiscenter.com]
- [❌ http://revivesalonandspa.com]

---

# Reusable Borderline Reasoning

This section contains two kinds of reusable reasoning material:

- **Adapted seed nodes** translate useful causal structures from analogous category-rating cases into Weight Loss terms. They are grounded in this manual but are not substitutes for actual Weight Loss precedents.
- **Case-derived nodes** are added after completed Weight Loss chats are abstracted, approved, and processed. These may extend, replace, narrow, or split an adapted seed node.

All reasoning nodes remain subordinate to Official and Added guidance.

Identify all materially applicable nodes and rank them by relevance. A node can be a:

- **Direct match**: the task has substantially the same decisive structure.
- **Partial match**: the node resolves one important part of the task but not the whole case.
- **Broad conceptual match**: the node supplies a useful distinction or boundary without controlling the rating.
- **No match**: the node does not materially help.

Where useful, assign each applicable node a functional role:

- **Primary**: provides the main reasoning structure.
- **Supporting**: contributes an additional useful distinction or evidence relationship.
- **Contrast**: explains why a nearby interpretation or precedent does not control.

Nodes are modular, not votes. Use one node when it adequately resolves the case. When several nodes genuinely contribute, select only the relevant reasoning components and synthesize them according to their usefulness.

Rank nodes according to how much useful work they do in resolving the task, based on the decisive mechanism, advertised subject, purpose boundary, and evidence relationship rather than shared words or superficial resemblance. Match strength informs ranking but does not determine it automatically.

### Causal-condition rule

A node title, case type, decision shortcut, or use condition should express the causal or decisive feature of the rating—not merely a characteristic of the example that first suggested it.

Apply this removal test:

> If the case lacked this feature but retained the same decisive evidence relationship, would the same reasoning still apply?

If yes, keep that feature as example or anchor evidence rather than making it a node-level eligibility condition.

## Adapted Seed Node: Category-Adjacent Element Subordinate to a Broader Non-Weight-Loss Offer

### Source / status
Cross-category-adapted seed grounded in the official exclusion of coaching, advice, therapies, training, or plans whose aim is not weight loss or fat reduction.

### Case type
A broader wellness, health, fitness, lifestyle, medical, or service offer contains a weight-loss-adjacent element, but that element is incidental rather than a meaningful part of the pitch.

### Expected direction
Usually No.

### Core reasoning path
The decisive issue is not whether weight loss is mentioned somewhere, but whether it is a visible or reliably established purpose of the offer. A side reference, long-list item, background cue, or merely possible benefit should not override the main non-weight-loss subject.

### Decision shortcut
Do not rate Yes from an incidental weight-loss association. Determine whether weight loss or fat reduction is a meaningful promoted purpose.

### Use this node when
- The main advertised offer is identifiable.
- Weight loss appears only incidentally, peripherally, or as one weak item among broader goals.
- Removing the weight-loss-adjacent element would not materially change the advertised purpose.

### Do not use this node when
- Weight loss, fat reduction, slimming, dieting, or weight management is a meaningful part of the pitch.
- An Official positive topic applies independently, such as generic dieting, a calorie counter, a qualifying low-calorie offer, or an enumerated fat-reduction procedure.

## Adapted Seed Node: Research-Resolved Entity or Meaning

### Source / status
Cross-category-adapted seed supporting the manual-wide research process.

### Case type
A visible name, product, program, procedure, ingredient, term, phrase, advertiser, provider, or other clue has an externally verifiable identity or non-obvious meaning that materially resolves the classification.

### Expected direction
Yes, No, or continued uncertainty, depending on the verified finding.

### Core reasoning path
Research can establish what an exact visible entity or term is and what purpose it is marketed for. Apply the Weight Loss scope to that verified identity or meaning while preserving the pitch guardrail: a possible use or broad brand association must not replace the purpose of the particular advertised offer.

### Decision shortcut
Research a potentially decisive visible clue, verify the exact referent, and use the finding only to the extent it establishes the current offer's purpose.

### Use this node when
- The clue can be reliably identified or interpreted.
- The finding materially changes or resolves the Weight Loss analysis.
- The exact researched subject corresponds to the task.

### Do not use this node when
- Results are weak, conflicting, or refer to similarly named alternatives.
- Research only shows that weight loss is one possible use unrelated to the current pitch.
- The research does not materially clarify the task.

## Adapted Seed Node: Verified Weight-Loss Provider Promotion Without a Named Program

### Source / status
Conditional cross-category analogue. Weight Loss requires a stricter purpose connection than a general company-category association.

### Case type
A promotion centers on a provider reliably identified as specifically offering weight-loss or fat-reduction services, but it does not name an individual program, product, or procedure.

### Expected direction
Potentially Yes, when the provider's weight-loss service is itself the promoted subject.

### Core reasoning path
A provider-level promotion may qualify when the exact provider is demonstrably weight-loss-focused and the promotion concerns that service. Provider identity alone is insufficient when the business also offers unrelated medical, fitness, wellness, beauty, or spa services or when a separate non-weight-loss subject is advertised.

### Decision shortcut
A verified weight-loss provider can be the covered subject without a named program, but only when the promotion is actually for its weight-loss or fat-reduction service.

### Use this node when
- Reliable research establishes a specifically weight-loss-focused provider.
- The provider and its weight-loss service are central to the promotion.
- No separate non-weight-loss product or activity controls the task.

### Do not use this node when
- The visible provider is merely a general clinic, gym, spa, wellness brand, pharmacy, hospital, or health insurer.
- The promotion concerns recruitment, corporate information, unrelated treatment, general health, beauty, or another service.

## Adapted Seed Node: Health Assessment or Challenge Without Clear Weight-Loss Framing

### Source / status
Cross-category-adapted seed grounded in the distinction between general health activity and weight-loss purpose.

### Case type
A health quiz, assessment, challenge, habit program, coaching prompt, or interactive format is the main subject but is framed around general health, activity, nutrition, or wellbeing rather than weight loss or fat reduction.

### Expected direction
Usually No when the subject is assessable and no Official positive shortcut applies.

### Core reasoning path
An interactive challenge or assessment can be compatible with weight loss without being targeted toward it. The decisive question is the purpose established by the combined task evidence, not the mere presence of health, food, exercise, progress, challenge, or transformation cues.

### Decision shortcut
Health-oriented interactivity is not enough by itself. Rate according to whether the exact challenge or assessment promotes weight loss or fat reduction.

### Use this node when
- The health challenge or assessment is identifiable and assessable.
- Its established purpose is general health, activity, nutrition, or wellness.
- Category-specific weight-loss targeting is absent.

### Do not use this node when
- The challenge or assessment explicitly or reliably promotes losing weight, reducing fat, slimming, dieting, calorie reduction, appetite control, or ideal-weight achievement.
- The advertised subject remains unidentified after research; use an unresolved-subject node instead.

## Adapted Seed Node: Unresolved Health or App Offer After Advertiser and Product Research

### Source / status
Cross-category-adapted seed for app, download, platform, and generic service creatives.

### Case type
A health-, fitness-, wellness-, diet-, or app-style offer does not identify the advertised product or service, and research into its visible identifiers remains inconclusive.

### Expected direction
Unrateable when the subject itself remains unidentifiable.

### Core reasoning path
Generic app formatting, an Install/Open CTA, health imagery, or suggestive branding cannot establish what is being advertised. If the research sweep still cannot identify the subject, the problem is assessability rather than difficult Weight Loss classification.

### Decision shortcut
If an app or service remains unidentified after relevant research, do not assume a weight-loss purpose from generic health or diet-like branding; mark Unrateable.

### Use this node when
- The advertised app, platform, program, or service is not identified.
- Research into the advertiser, product, title, URL, and other clues remains inconclusive.
- The available signals are generic rather than category-specific.

### Do not use this node when
- The subject is identifiable but its Weight Loss classification is borderline; give the best Yes/No rating.
- Research resolves the exact subject as weight-loss-related or non-weight-loss-related.
- The task failed to load or has another ordinary Official Unrateable condition that already resolves it.

## Adapted Seed Node: Research-Resolved Weight-Loss Offer With Supporting Purpose Wording

### Source / status
Specialized form of the research-resolved-entity mechanism.

### Case type
Research identifies a visible named product, program, procedure, or service as a Weight Loss offer, while visible wording consistent with that purpose provides secondary support.

### Expected direction
Yes.

### Core reasoning path
The verified identity is decisive. Visible wording such as slimming, appetite control, calorie reduction, waist or inch reduction, fat burning, meal replacement, or similar purpose language corroborates the finding but should not be overstated as the sole proof when it is ambiguous by itself.

### Decision shortcut
When exact research establishes a Weight Loss offer and visible purpose wording independently points the same way, rate Yes and distinguish decisive research from supporting wording.

### Use this node when
- The exact named subject is reliably identified.
- Its marketed purpose is weight loss or fat reduction.
- Visible wording provides genuine, but not necessarily sufficient, support.

### Do not use this node when
- Research identifies only a possible weight-loss use rather than the current advertised purpose.
- The visible wording is the sole evidence and remains generic.
- The task already contains independently decisive explicit Weight Loss evidence and no borderline reasoning is needed.

## Adapted Seed Node: Unresolved Advertised Subject With Only Generic Wellness Wording

### Source / status
Cross-category-adapted seed distinguishing lack of assessability from an assessable general-wellness No.

### Case type
The advertised subject remains unidentified after research, and the only potentially relevant signals are vague words or imagery such as healthy, better, balance, transform, challenge, active, feel good, or wellbeing.

### Expected direction
Unrateable.

### Core reasoning path
Generic wellness language may be compatible with weight loss, but it neither identifies the product nor establishes the relevant purpose. When research does not resolve the subject, there is too little information to classify the task at all. If the subject is identifiable as a general-health offer, the correct issue is classification and the likely result is No instead.

### Decision shortcut
Generic wellness wording cannot identify an unknown offer. After an inconclusive research sweep, use Unrateable rather than forcing Yes or No.

### Use this node when
- The main advertised subject cannot be identified.
- Only generic wellness, health, lifestyle, or transformation signals remain.
- Plausible entity and secondary-meaning research has been completed without resolution.

### Do not use this node when
- The task clearly advertises an identifiable general-health, fitness, nutrition, or wellness offer; rate that subject under the scope.
- Specific evidence establishes a weight-loss or fat-reduction purpose.

## Adapted Seed Node: Weight-Loss-Adjacent Method With an Explicit Non-Weight-Loss Purpose

### Source / status
Cross-category-adapted seed directly supported by Official negative topics and purpose-specific exclusions.

### Case type
A diet, training plan, supplement, therapy, procedure, food, wearable, clinic, or other method associated with Weight Loss is explicitly promoted for a different purpose.

### Expected direction
No.

### Core reasoning path
The same method can fall inside or outside the category depending on its purpose. Disease management, athletic preparation, weight gain, energy, general nutrition, relaxation, skin tightening, lifting, and unrelated cosmetic treatment do not become Weight Loss merely because the method could also be used for slimming or fat reduction.

### Decision shortcut
When the task establishes an explicit non-weight-loss purpose, rate that purpose rather than the method's broader associations.

### Use this node when
- The advertised method is assessable.
- The combined task evidence establishes a specific competing purpose.
- Weight loss or fat reduction is not a meaningful promoted aim.

### Do not use this node when
- Weight loss or fat reduction is also a meaningful part of the pitch.
- Official guidance specifically includes the advertised form despite the absence of literal weight-loss wording.
- The competing purpose is merely speculative rather than established.

## Adapted Seed Node: Cumulative Implicit Weight-Loss Framing Without an Explicit Weight-Loss Label

### Source / status
Cross-category-adapted seed for converging category-specific evidence.

### Case type
The task does not literally say “weight loss” or “fat reduction,” but several specific, mutually reinforcing clues establish a covered dieting, slimming, appetite-control, calorie-reduction, or fat-reduction purpose.

### Expected direction
Yes when the clues specifically converge on a covered purpose.

### Core reasoning path
Literal category wording is not always required. Several specific signals can jointly establish purpose—for example slimming or waist reduction, appetite control, calorie deficit, fat burning, meal-replacement framing, inch loss, or a verified weight-loss product identity. The contrast is between category-specific convergence and generic health association.

An apple, sports equipment, active people, general healthy-food imagery, a challenge format, or broad wellbeing language may point toward healthy living without specifically establishing Weight Loss. Multiple generic health clues do not become category-specific merely by accumulation.

### Decision shortcut
Rate Yes without an explicit label only when the combined clues converge specifically on weight loss or fat reduction, not merely on health, fitness, nutrition, or wellbeing.

### Use this node when
- Several specific clues reinforce the same covered Weight Loss purpose.
- The subject is identifiable and assessable.
- The inference does not depend on hidden behavior or unrelated brand knowledge.

### Do not use this node when
- The clues are generic, isolated, conflicting, or equally compatible with general health.
- An explicit non-weight-loss purpose controls the offer.
- Exact research resolves the subject more directly; use the verified identity rather than presenting the result as purely implicit.

## Case-Derived Nodes

No Weight Loss case-derived node has been added in this transposition round. Add nodes here only after a completed Weight Loss rating chat has gone through the separate abstraction-approval and processing workflow.

---

# Task analysis template

This section is the per-task analysis template the LLM should execute after reading the manual above. It structures the rating output.

## Task-analysis process

1. Extract the task evidence from the screenshot, OCR, page, and visible URL. Record visible wording, branding, names, products, programs, providers, treatments, ingredients, imagery, CTA, and other potentially meaningful signals.

2. Perform the research sweep before classification. Research every visible identity or meaning candidate that could materially affect the rating, including ordinary-looking wording with a plausible secondary meaning. Use exact and contextual searches, prefer authoritative sources, disambiguate similarly named entities, and preserve material resolved, unresolved, ambiguous, or conflicting findings.

3. Verify that each researched finding corresponds to the exact task clue. Keep visible evidence, verified research, and inference conceptually distinct.

4. Determine what is actually being advertised or discussed and identify its main promoted purpose. Apply the Weight Loss research pitch guardrail: do not substitute a broad brand association, another campaign, or one possible product use for the purpose of the current offer.

5. Apply Official and Added guidance to the established subject and purpose. Do not require literal “weight loss” wording when an Official positive topic or sufficiently specific combined evidence establishes the covered purpose.

6. Identify all materially applicable adapted seed and case-derived nodes. Rank them by useful relevance to the decisive mechanism, advertised subject, purpose boundary, and evidence relationship. Assign Primary, Supporting, or Contrast roles where meaningful.

7. Use the nodes modularly. Use one node when it adequately resolves the case; otherwise select only the genuinely applicable reasoning components. Do not treat nodes as votes or let an adapted seed override the manual.

8. Check whether the task is assessable at all. Before selecting Unrateable for insufficient information, complete the research sweep. If the advertised subject remains unidentifiable or the task otherwise meets an Official Unrateable condition, rate Unrateable and briefly explain why.

9. If the subject is assessable but classification is difficult, give the best Yes/No rating and add a brief uncertainty comment. Do not use Unrateable as a fallback for an assessable borderline case.

10. When the rating is Yes, map the evidence to the most specific applicable topic: diet/plan, product, procedure, or softer treatment option.

11. Apply any Official uncertainty rule. If an exception or outlier example seems relevant, apply it only to sufficiently similar cases and return to the main category definition otherwise.

12. Classify the promoted claim or purpose; do not evaluate whether the weight-loss method is medically effective, safe, or advisable.

## Per-task indicator extraction

For each task, list indicators that apply based on the visible task evidence and any verified research findings. Separate matching indicators by source:
- Official = directly present in original official guidance.
- Added = directly present in added guidance sections of this manual.
- Adapted seed = directly supported by an applicable cross-category-adapted seed node.
- Case-derived = directly supported by one or more applicable Weight Loss case-derived nodes. Include useful indicators from all materially applicable nodes without duplicating the same indicator.
- Non-manual = useful practical indicators not explicitly present anywhere in this manual.

When listing indicators in the output table, prefix a non-official indicator with `~` if it is at least partly redundant with an Official indicator already listed for that same task.

- This applies to indicators in the **Added**, **Adapted seed**, **Case-derived**, and **Non-manual** rows.
- The `~` means: this indicator is still useful to surface, but it overlaps with an Official indicator already present and should not be read as fully independent extra evidence.
- Do not use `~` merely because an indicator is generally related to official guidance in the manual; use it only when the overlap is visible in the specific task’s extracted indicator set.

Use “None” in any indicator-table cell or Unrateable-indicator line where no matching indicator applies.

## Before-finalizing check

Before finalizing, check:
- Am I using Unrateable only because the task cannot be assessed at all?
- Did I research every visible name, product, program, procedure, ingredient, provider, URL/domain, unfamiliar term, and ordinary-looking phrase whose identity or meaning could materially affect the rating?
- Did I use exact and contextual searches and disambiguate similarly named entities?
- Did I distinguish visible evidence, verified research, and inference?
- If I rated Yes, is the rating supported by task evidence that establishes a weight-loss or fat-reduction purpose or an Official positive topic?
- If I rated No, am I ignoring an exact visible or researched clue that materially establishes a covered purpose?
- Did I avoid manufacturing a weight-loss pitch from a general brand association, another campaign, or one possible use of a multi-purpose product?
- Did I distinguish general health, fitness, nutrition, wellness, beauty, or medical relatedness from specific Weight Loss targetedness?
- Did I avoid fact-checking effectiveness instead of classifying the promoted claim?
- If the official manual gives an uncertainty-bias rule, did I apply it correctly?
- If an exception seems relevant, is this task sufficiently similar to the canonical/example exception?
- Did I identify all materially applicable reasoning nodes and match them by decisive mechanism rather than anchor-example details?
- Did I rank applicable nodes by the work they do and assign Primary, Supporting, or Contrast roles where meaningful?
- Did I avoid treating nodes as votes or adding unnecessary synthesis when one node resolves the case?

## Output format

Task:
[what is actually being advertised or discussed]

Evidence:
- Visible:
  - [key visible text, URL, imagery, CTA, names, and other task clues]
- Research findings:
  - [verified findings tied to the task; write “None material” if the research sweep produced no finding that materially affected classification]

Indicators:

| Source | Positive indicators | Negative indicators |
|---|---|---|
| Official | [...] | [...] |
| Added | [...] | [...] |
| Adapted seed | [...] | [...] |
| Case-derived | [...] | [...] |
| Non-manual | [...] | [...] |

Unrateable indicators:
- Official: [...]
- Added: [...]
- Adapted seed: [...]
- Case-derived: [...]
- Non-manual: [...]

Applicable reasoning nodes, ranked:
1. [Node name] — [Adapted seed / Case-derived] — [Direct / Partial / Broad conceptual] — [Primary / Supporting / Contrast]
   - Relevant here because: [...]
2. [...]

[Use “None” if no reasoning node materially applies. List only genuinely applicable nodes.]

Reasoning synthesis:
[Briefly identify the reasoning components used. Omit when one node applies straightforwardly.]

Ambiguity:
[include only if genuinely needed; otherwise omit this section]

Rating: Yes / No / Unrateable
Confidence: Low / Medium / High
Comment: [include if Unrateable, genuinely uncertain, specifically requested, or otherwise useful; otherwise omit]
