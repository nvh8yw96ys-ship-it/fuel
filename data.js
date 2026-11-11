// ============================================================================
//  FUEL//OS — data layer
//  Products (prices, store sections, macros), recipes, weekly rotation, schedule.
//  Macros per 100 g: [kcal, protein g, carbs g].  Prices are ESTIMATES (Nov 2026)
//  — confirm in the store apps; you can edit any aisle # inside the app.
// ============================================================================
const DATA = (() => {
  const S = { W: "Walmart Supercenter — Harvey Mitchell", H: "H-E-B — Tejas Center", C: "Sam's Club — College Station", A: "Amazon" };

  // id: [name, store, section, where-to-look, packGrams, price, [kcal,P,C]/100g, unitLabel]
  const P = {
    // ---------------- Walmart (Harvey Mitchell) ----------------
    milk:      ["Great Value Whole Milk, 1 gal", "W", "Dairy", "Back-wall dairy cooler", 3900, 3.38, [61, 3.2, 4.8], "gal"],
    bread:     ["Great Value White Bread, 20 oz", "W", "Bakery / Bread", "Bread aisle near bakery (front-right of grocery)", 567, 1.48, [266, 8.9, 49], "loaf"],
    pb:        ["Great Value Creamy Peanut Butter, 40 oz", "W", "Pantry — PB & Jelly", "Center grocery aisle with jelly/honey (near cereal)", 1134, 4.97, [590, 23, 21], "jar"],
    honey:     ["Great Value Clover Honey Bear, 12 oz", "W", "Pantry — PB & Jelly", "Same aisle as peanut butter", 340, 3.48, [304, 0.3, 82], "bottle"],
    oats:      ["Great Value Old Fashioned Oats, 42 oz", "W", "Breakfast & Cereal", "Cereal aisle, bottom shelf hot-cereal section", 1190, 4.48, [379, 13, 68], "canister"],
    rice:      ["Great Value Long Grain White Rice, 10 lb", "W", "Pasta & Rice", "Rice/beans aisle (bottom shelf for 10 lb bags)", 4536, 6.48, [360, 6.7, 80], "bag"],
    spaghetti: ["Great Value Spaghetti, 1 lb", "W", "Pasta & Rice", "Pasta aisle", 454, 1.18, [371, 13, 75], "box"],
    penne:     ["Great Value Penne, 1 lb", "W", "Pasta & Rice", "Pasta aisle", 454, 1.18, [371, 13, 75], "box"],
    parm:      ["Great Value Grated Parmesan, 8 oz", "W", "Pasta & Rice", "Pasta-sauce aisle (shelf-stable shaker)", 227, 3.24, [420, 30, 4], "shaker"],
    velveeta:  ["Velveeta Original, 16 oz", "W", "Cheese (shelf-stable)", "Not in the cold case — by the deli / mac-and-cheese end cap", 454, 5.48, [286, 17, 11], "block"],
    creamch:   ["Campbell's Cream of Chicken, 10.5 oz", "W", "Canned Soup", "Soup aisle", 298, 1.42, [122, 2.4, 9], "can"],
    broth:     ["Great Value Chicken Broth, 32 oz", "W", "Canned Soup", "Soup aisle (cartons)", 946, 1.98, [5, 1, 0.3], "carton"],
    soy:       ["Great Value Soy Sauce, 15 oz", "W", "International", "Asian foods section", 444, 1.68, [53, 8, 5], "bottle"],
    ketchup:   ["Great Value Ketchup, 20 oz", "W", "Condiments", "Condiment aisle", 567, 1.48, [101, 1, 27], "bottle"],
    cornst:    ["Great Value Cornstarch, 16 oz", "W", "Baking", "Baking aisle (flour/sugar)", 454, 1.28, [381, 0.3, 91], "box"],
    evap:      ["Great Value Evaporated Milk, 12 oz", "W", "Baking", "Baking aisle (canned milk)", 354, 1.38, [134, 6.8, 10], "can"],
    oil:       ["Great Value Vegetable Oil, 48 oz", "W", "Baking", "Baking aisle (oils)", 1300, 3.78, [884, 0, 0], "bottle"],
    limej:     ["ReaLime Lime Juice, 15 oz", "W", "Produce", "Produce dept. by the lemons/limes", 443, 2.48, [25, 0.4, 8], "bottle"],
    butter:    ["Great Value Salted Butter, 4 sticks (1 lb)", "W", "Dairy", "Back-wall dairy cooler", 454, 3.97, [717, 0.9, 0.1], "pack"],
    creamchz:  ["Great Value Cream Cheese, 8 oz", "W", "Dairy", "Dairy cooler next to butter", 227, 1.97, [342, 6, 5.5], "brick"],
    yogurt:    ["Great Value Nonfat Plain Greek Yogurt, 32 oz", "W", "Dairy", "Yogurt section of dairy cooler", 907, 4.37, [59, 10.3, 3.6], "tub"],
    eggs:      ["Great Value Large Eggs, 18 ct", "W", "Dairy", "Egg cooler at end of dairy wall", 900, 3.97, [143, 12.6, 0.7], "carton"],
    gbeef:     ["Ground Beef 73/27, 3 lb roll", "W", "Meat", "Meat cooler — ground beef chubs", 1361, 12.97, [287, 16.6, 0], "roll"],
    potatoes:  ["Yellow Potatoes, 5 lb bag", "W", "Produce", "Produce dept. — potato/onion bins", 2268, 3.97, [77, 2, 17], "bag"],
    hashb:     ["Great Value Shredded Hash Browns, 30 oz", "W", "Frozen", "Frozen breakfast/potato doors", 850, 2.97, [80, 2, 17], "bag"],
    bananas:   ["Bananas (each)", "W", "Produce", "Produce dept. — front banana table", 118, 0.26, [89, 1.1, 23], "banana"],
    garlic:    ["Great Value Garlic Powder, 3.4 oz", "W", "Spices", "Spice aisle (baking side)", 96, 1.24, [0, 0, 0], "jar"],
    onionp:    ["Great Value Onion Powder, 2.6 oz", "W", "Spices", "Spice aisle", 74, 1.24, [0, 0, 0], "jar"],
    cumin:     ["Great Value Ground Cumin, 2 oz", "W", "Spices", "Spice aisle", 57, 1.24, [0, 0, 0], "jar"],
    paprika:   ["Great Value Smoked Paprika, 2.3 oz", "W", "Spices", "Spice aisle", 65, 1.98, [0, 0, 0], "jar"],
    chili:     ["Great Value Chili Powder, 2.5 oz", "W", "Spices", "Spice aisle", 70, 1.24, [0, 0, 0], "jar"],
    italian:   ["Great Value Italian Seasoning, 0.95 oz", "W", "Spices", "Spice aisle", 27, 1.24, [0, 0, 0], "jar"],
    cajun:     ["Tony Chachere's Creole Seasoning, 8 oz", "W", "Spices", "Spice aisle (Cajun section)", 227, 2.98, [0, 0, 0], "can"],
    // ---------------- H-E-B (Tejas Center) ----------------
    tortillas: ["H-E-B Burrito-Size Flour Tortillas, 10 ct", "H", "Tortillas", "Tortilla aisle (Mexican foods), near the bakery", 700, 3.48, [300, 7.1, 50], "pack"],
    chipotle:  ["La Costeña Chipotle Peppers in Adobo, 7 oz", "H", "Mexican Foods", "Hispanic foods aisle — canned chiles", 198, 1.48, [40, 1.5, 7], "can"],
    taco:      ["H-E-B Taco Seasoning, 1 oz packet", "H", "Mexican Foods", "Hispanic foods aisle — seasoning packets", 28, 0.68, [333, 6, 60], "packet"],
    enchilada: ["Old El Paso Red Enchilada Sauce, 19 oz", "H", "Mexican Foods", "Hispanic foods aisle — sauces", 538, 2.48, [40, 1, 6], "can"],
    zatarain:  ["Zatarain's Blackened Chicken Alfredo Pasta Dinner Kit", "H", "Boxed Dinners", "Rice & boxed-dinner aisle (Zatarain's section)", 227, 2.48, [380, 13, 70], "box"],
    skirt:     ["H-E-B Beef Inside Skirt Steak (per lb)", "H", "Meat", "Fresh meat case — fajita/skirt section", 454, 9.98, [240, 19.5, 0], "lb"],
    shrimp:    ["H-E-B Raw Peeled & Deveined Shrimp 41/50, 1 lb", "H", "Frozen Seafood", "Frozen seafood doors by the seafood counter", 454, 6.98, [85, 20, 0.2], "bag"],
    // ---------------- Logan's Monday prep (week of Nov 2) — macros from the H-E-B labels ----------------
    p_breast:  ["H-E-B Boneless Skinless Chicken Breasts, Value Pack (~4.85 lb)", "H", "Meat", "Fresh chicken case", 2200, 13.53, [120, 22.5, 0], "pack"],
    p_beef96:  ["H-E-B 96% Lean Ground Beef, 2 lb", "H", "Meat", "Fresh meat case — ground beef", 907, 13.98, [123, 21.2, 0], "pack"],
    p_taco:    ["Old El Paso Original Taco Seasoning, 1 oz", "H", "Mexican Foods", "Hispanic foods aisle", 28, 0.98, [268, 0, 54], "packet"],
    p_sausage: ["H-E-B Premium Smoked Sausage Links, Jalapeño, Texas-Size 10 ct", "H", "Meat", "Packaged sausage case", 810, 9.98, [247, 17.3, 2.5], "pack"],
    p_alfredo: ["Zatarain's Frozen Blackened Chicken Alfredo, Family Size", "H", "Frozen", "Frozen entrées", 1380, 9.48, [139, 5.2, 16.1], "bag"],
    p_bites:   ["Tyson Any'tizers Buffalo Style Boneless Chicken Bites, 24 oz", "H", "Frozen", "Frozen chicken / appetizers", 680, 10.98, [200, 14.1, 15.3], "bag"],
    p_eggs:    ["Hill Country Fare Large White Eggs, 36 ct", "H", "Dairy", "Egg cooler", 1800, 8.48, [140, 12, 0.8], "carton"],
    p_chorizo: ["Chorizo de San Manuel Beef Chorizo, 12 oz", "H", "Meat", "Packaged sausage / chorizo case", 340, 2.98, [247, 17.6, 3.5], "pack"],
    p_whey:    ["Optimum Nutrition Gold Standard Whey, Vanilla Ice Cream, 5 lb", "A", "Supplements", "Online", 2270, 74.99, [387, 77.4, 9.7], "tub"],
    // ---------------- Sam's Club (College Station) ----------------
    thighs:    ["Member's Mark Boneless Skinless Chicken Thighs (~6 lb)", "C", "Fresh Meat", "Meat cooler along the back wall", 2722, 16.48, [121, 19.7, 0], "pack"],
    cheese:    ["Member's Mark Shredded Mexican Blend, 2.5 lb", "C", "Dairy & Cheese", "Walk-in dairy cooler — shredded cheese", 1134, 10.48, [400, 23, 2], "bag"],
  };

  // Recipe ingredient: [productId, grams, "display amount"]
  const R = {
    burritos: {
      name: "Chipotle Beef & Egg Breakfast Burritos", short: "Breakfast Burritos", emoji: "🌯",
      source: { handle: "@bisongainz", url: "https://www.tiktok.com/@bisongainz/video/7646594287471316255", note: "Steak swapped for ground beef to fit the $100 budget; avocado removed." },
      servings: 14, servingLabel: "burrito", method: "Freezer batch", time: "45 min", tags: ["freezer", "microwave", "campus"],
      ingredients: [
        ["gbeef", 680, "1½ lb ground beef (73/27)"], ["eggs", 900, "18 large eggs"], ["tortillas", 980, "14 burrito-size flour tortillas"],
        ["cheese", 226, "2 cups shredded Mexican blend"],
        ["chipotle", 90, "3 chipotle peppers + 2 Tbsp adobo sauce, minced"], ["butter", 28, "2 Tbsp butter"],
        ["cumin", 4, "2 tsp cumin"], ["garlic", 4, "1½ tsp garlic powder"],
      ],
      steps: [
        "Brown the 1½ lb ground beef in a big skillet on medium-high, about 8 min. Drain most of the grease.",
        "Stir in the minced chipotles, adobo, cumin, garlic powder and 1 tsp salt. Cook 2 min, then move to a bowl.",
        "Lower to medium-low. Melt the butter, add the 18 whisked eggs and stir slowly until just set and creamy, 5–6 min. Don't rush it.",
        "Warm the tortillas 15 sec each in the microwave. Fill each one: about ⅓ cup eggs, ⅓ cup beef, 2 Tbsp cheese. (Add frozen hash browns some week if you have room in the budget.)",
        "Roll tight, tuck the ends, then wrap each in foil or plastic wrap. Freeze in a gallon bag.",
        "Reheat: unwrap, wrap in a damp paper towel, microwave 2:30 from frozen (flip halfway). Campus: grab 1–2 from the freezer in the morning; they thaw by lunch and need 1:15 in the microwave.",
      ],
    },
    lonestar: {
      name: "Crockpot Lone Star Chicken Spaghetti", short: "Lone Star Spaghetti", emoji: "🤠",
      source: { handle: "@kayleemorrow1", url: "https://www.tiktok.com/@kayleemorrow1/video/7682772407878225182", note: "Creamy Texas chicken spaghetti, made in the crockpot. Rotel is optional (you said no veggies)." },
      servings: 5, servingLabel: "container", method: "Crockpot", time: "10 min prep · 4 hr high", tags: ["crockpot", "microwave", "campus"],
      ingredients: [
        ["thighs", 1361, "3 lb boneless skinless chicken thighs"], ["spaghetti", 454, "1 lb spaghetti, broken in half"],
        ["creamchz", 227, "8 oz cream cheese"],
        ["creamch", 298, "1 can (10.5 oz) cream of chicken"], ["broth", 240, "1 cup chicken broth"],
        ["cheese", 226, "2 cups shredded Mexican blend (split)"], ["butter", 28, "2 Tbsp butter"],
        ["garlic", 3, "1 tsp garlic powder"], ["onionp", 3, "1 tsp onion powder"],
      ],
      steps: [
        "Put the chicken thighs in the crockpot. Add the garlic powder, onion powder, 1 tsp salt, ½ tsp black pepper, the cream of chicken, the broth and the butter.",
        "Cook on HIGH 4 hr (or LOW 7 hr) until the chicken shreds easily.",
        "Shred the chicken in the pot with two forks. Stir in the cream cheese and 1 cup of the shredded cheese; cover 15 min to melt, then stir smooth. (Swap in 8 oz cubed Velveeta for the extra-Texas version if the budget allows.)",
        "Meanwhile, boil the spaghetti 2 min less than the box says. Drain it, then fold it into the crockpot with the last cup of cheese.",
        "Optional: 1 drained can of Mild Rotel. Skip it if you don't want the tomato bits.",
        "Portion into 5 microwave containers. Reheat 2:30 with a splash of milk, stirring halfway.",
      ],
    },
    honeygarlic: {
      name: "Crockpot Honey Garlic Chicken & Rice", short: "Honey Garlic Chicken", emoji: "🍯",
      source: null,
      servings: 5, servingLabel: "container", method: "Crockpot", time: "5 min prep · 4 hr low", tags: ["crockpot", "microwave", "campus"],
      ingredients: [
        ["thighs", 1361, "3 lb boneless skinless chicken thighs"], ["honey", 170, "½ cup honey"], ["soy", 120, "½ cup soy sauce"],
        ["garlic", 6, "2 tsp garlic powder"],
        ["butter", 28, "2 Tbsp butter"], ["rice", 463, "2½ cups dry white rice (cooked separately)"],
      ],
      steps: [
        "Whisk the honey, soy sauce, garlic powder and ½ tsp black pepper in the crockpot.",
        "Add the chicken thighs and turn them to coat. Cook on LOW 4 hr (or HIGH 2½ hr).",
        "Take the chicken out and chop or shred it. Leave the lid off and cook the sauce on HIGH 20–30 min until it thickens and turns glossy, then return the chicken. (If you have ketchup or cornstarch, 2 Tbsp ketchup or a cornstarch slurry thickens it faster.)",
        "Rice: rinse 2½ cups rice. Simmer with 4¼ cups water, the butter and 1 tsp salt, covered, on low 18 min. Rest 5 min.",
        "Portion 5 containers: rice on the bottom, chicken and plenty of sauce on top. Microwave 2:30.",
      ],
    },
    beefrice: {
      name: "One-Pot Cheesy Taco Beef & Rice", short: "Cheesy Beef & Rice", emoji: "🧀",
      source: null,
      servings: 4, servingLabel: "container", method: "One pot", time: "30 min", tags: ["one-pot", "microwave", "campus"],
      ingredients: [
        ["gbeef", 680, "1½ lb ground beef (73/27)"], ["rice", 370, "2 cups dry white rice"], ["taco", 28, "1 packet taco seasoning"],
        ["broth", 700, "3 cups chicken broth + 1 cup water"], ["cheese", 226, "2 cups shredded Mexican blend"],
        ["garlic", 3, "1 tsp garlic powder"], ["onionp", 3, "1 tsp onion powder"],
      ],
      steps: [
        "Brown the 1½ lb beef in a large pot or deep skillet on medium-high, about 8 min. Drain off half the grease.",
        "Stir in the taco seasoning, garlic powder and onion powder, then the uncooked rice. Toast 1 min.",
        "Pour in the broth and water. Bring to a boil, cover, drop to LOW and cook 20 min without lifting the lid.",
        "Turn off the heat, sprinkle on the cheese, cover 5 min to melt, then fluff it all together.",
        "Portion 4 containers. Microwave 2:30 with 1 Tbsp water on top.",
      ],
    },
    tacobowls: {
      name: "Slow Cooker Chicken Taco Bowls", short: "Chicken Taco Bowls", emoji: "🌮",
      source: { handle: "@stealth_health_life", url: "https://www.tiktok.com/@stealth_health_life/video/7661767980694457630", note: "Corn and black beans removed (no veggies); extra rice and cheese instead." },
      servings: 5, servingLabel: "bowl", method: "Crockpot", time: "10 min prep · 6 hr low", tags: ["crockpot", "microwave", "campus"],
      ingredients: [
        ["thighs", 1134, "2½ lb boneless skinless chicken thighs"], ["taco", 84, "3 packets taco seasoning"],
        ["enchilada", 480, "2 cups red enchilada sauce"], ["rice", 463, "2½ cups dry rice"], ["broth", 830, "3½ cups chicken broth (for the rice)"],
        ["cheese", 226, "2 cups shredded Mexican blend"], ["butter", 28, "2 Tbsp butter (for the rice)"],
      ],
      steps: [
        "Put the chicken thighs in the crockpot. Sprinkle on the 3 taco seasoning packets and pour the enchilada sauce over the top.",
        "Cook on LOW 6 hr (or HIGH 3–4 hr). Shred in the pot and let it soak in the sauce 10 min.",
        "Rice: rinse 2½ cups rice. Simmer with 3½ cups broth, ½ cup water and the butter, covered, 18 min. Rest 5 min.",
        "Optional chipotle-lime sauce from the TikTok, if the budget has room: 1½ cups Greek yogurt, 2 chipotles, 1 Tbsp adobo, 2 Tbsp lime juice, 1 Tbsp honey, blended.",
        "Build 5 bowls: rice, chicken with its juices, then about ⅓ cup cheese on top.",
        "Microwave 2:30.",
      ],
    },
    chipotlechix: {
      name: "Creamy Chipotle Chicken & Potatoes", short: "Chipotle Chicken & Potatoes", emoji: "🔥",
      source: { handle: "@jalalsamfit", url: "https://www.tiktok.com/@jalalsamfit/video/7628279497476934934", note: "Red onion swapped for onion powder (no veggies). Full-fat milk and cream cheese for more calories." },
      servings: 5, servingLabel: "container", method: "Sheet pan", time: "20 min prep · 35 min bake", tags: ["sheet-pan", "microwave", "campus"],
      ingredients: [
        ["thighs", 1134, "2½ lb boneless skinless chicken thighs, trimmed"], ["potatoes", 1300, "2.9 lb (1300 g) yellow potatoes, cubed"],
        ["chipotle", 130, "1 can chipotles in adobo, blended (⅔ marinade, ⅓ sauce)"], ["limej", 30, "2 Tbsp lime juice"],
        ["oil", 45, "3 Tbsp vegetable oil"], ["butter", 28, "2 Tbsp butter"], ["evap", 354, "1 can (12 oz) evaporated milk"],
        ["creamchz", 113, "4 oz cream cheese"], ["garlic", 15, "5 tsp garlic powder (split)"], ["onionp", 15, "5 tsp onion powder (split)"],
        ["paprika", 12, "6 tsp smoked paprika (split)"], ["cumin", 5, "2½ tsp cumin"],
      ],
      steps: [
        "Marinade: toss the chicken with ⅔ of the blended chipotles, the lime juice, 1 Tbsp oil, 1 tsp each garlic powder, onion powder and smoked paprika, the cumin and 2 tsp salt. Marinate overnight if you can, or at least 30 min.",
        "Heat the oven to 425°F. Toss the potato cubes with 2 Tbsp oil, 2 tsp each garlic powder, onion powder and smoked paprika, and 1 tsp salt. Spread on a sheet pan.",
        "Put the chicken on a second sheet pan. Bake both 30–35 min, flipping the potatoes once, until the chicken reaches 175°F and the potatoes are crispy.",
        "Sauce: melt the butter on low, then add the rest of the chipotle, 2 tsp each garlic powder and onion powder. Cook 3 min. Whisk in the evaporated milk and cream cheese until smooth, then simmer 3–4 min to thicken.",
        "Slice the chicken, toss it in the sauce and portion over the potatoes in 5 containers. Microwave 2:30.",
      ],
    },
    alfredo: {
      name: "Zatarain's Blackened Chicken Alfredo", short: "Blackened Alfredo", emoji: "🖤",
      source: { handle: "Your pick", url: null, note: "Boxed kit plus 1 lb of extra chicken for protein." },
      servings: 4, servingLabel: "container", method: "Stovetop", time: "30 min", tags: ["stovetop", "microwave", "campus"],
      ingredients: [
        ["zatarain", 454, "2 boxes Zatarain's Blackened Chicken Alfredo kit"], ["thighs", 454, "1 lb chicken thighs, bite-size pieces"],
        ["milk", 610, "2½ cups whole milk (about the box amount ×2; follow your box)"], ["butter", 56, "4 Tbsp butter"],
        ["paprika", 4, "2 tsp smoked paprika"], ["garlic", 3, "1 tsp garlic powder"],
      ],
      steps: [
        "Toss the chicken pieces with the smoked paprika, garlic powder, ½ tsp salt and plenty of black pepper (or Creole seasoning if you have it). Brown them in 1 Tbsp butter in a large deep skillet on medium-high until cooked through, 8–10 min. Set aside.",
        "In the same pan, add the water, milk and remaining butter the boxes call for (doubled for 2 boxes) and bring to a boil.",
        "Stir in both pasta and sauce packets. Simmer uncovered on medium-low 12–14 min, stirring often, until the pasta is tender and the sauce is thick.",
        "Stir the chicken back in. Rest 3 min; it thickens as it sits.",
        "Portion 4 containers. Reheat 2:30 with a splash of milk; alfredo dries out without it.",
      ],
    },
    shrimppasta: {
      name: "Cajun Cream Cheese Shrimp & Chicken Pasta", short: "Cream Cheese Shrimp Pasta", emoji: "🍤",
      source: { handle: "@goldengracekitchen", url: "https://www.tiktok.com/@goldengracekitchen/video/7679504126367042829", note: "Her 30-minute cream cheese shrimp pasta, bulked up with chicken. Full original recipe is on goldengracekitchen.com." },
      servings: 4, servingLabel: "container", method: "Stovetop", time: "30 min", tags: ["stovetop", "microwave"],
      ingredients: [
        ["shrimp", 454, "1 lb raw peeled shrimp (thawed)"], ["thighs", 454, "1 lb chicken thighs, bite-size pieces"], ["penne", 454, "1 lb penne"],
        ["creamchz", 227, "8 oz cream cheese"], ["milk", 244, "1 cup whole milk"], ["parm", 60, "½ cup grated parmesan"],
        ["butter", 42, "3 Tbsp butter"], ["cajun", 9, "1 Tbsp Creole/Cajun seasoning"], ["garlic", 6, "2 tsp garlic powder"],
      ],
      steps: [
        "Boil the penne in salted water to al dente. Save 1 cup of pasta water, then drain.",
        "Season the chicken and shrimp with the Creole seasoning. In a big skillet, cook the chicken in 1 Tbsp butter on medium-high, 7 min. Add the shrimp and cook 2–3 min until pink. Set aside.",
        "Lower to medium. Melt 2 Tbsp butter, add the garlic powder, then the cubed cream cheese and the milk. Whisk until smooth, 3 min.",
        "Stir in the parmesan, then the pasta, chicken and shrimp. Loosen with pasta water until creamy.",
        "Portion 4 containers. Eat the shrimp within 3 days; freeze any extra. Reheat 2:00 with a splash of milk.",
      ],
    },
    carneasada: {
      name: "Chipotle Carne Asada Rice Bowls", short: "Carne Asada Bowls", emoji: "🥩",
      source: { handle: "@bisongainz", url: "https://www.tiktok.com/@bisongainz/video/7652428567300672799", note: "Same marinade, half skirt steak and half chicken thigh to stay under $100. Cilantro is optional." },
      servings: 5, servingLabel: "bowl", method: "Skillet", time: "Marinate overnight · 30 min", tags: ["skillet", "microwave", "campus"],
      ingredients: [
        ["skirt", 680, "1½ lb skirt steak"], ["thighs", 680, "1½ lb chicken thighs"], ["chipotle", 120, "4 chipotle peppers in adobo + 2 Tbsp sauce"],
        ["oil", 110, "½ cup vegetable oil"], ["limej", 45, "3 Tbsp lime juice (replaces OJ + lime)"], ["soy", 15, "1 Tbsp soy sauce"],
        ["cumin", 6, "1 Tbsp cumin"], ["garlic", 6, "2 tsp garlic powder"], ["rice", 463, "2½ cups dry rice"],
        ["butter", 28, "2 Tbsp butter (for the rice)"], ["cheese", 113, "1 cup shredded Mexican blend (topping)"],
      ],
      steps: [
        "Marinade: blend the chipotles and adobo, oil, lime juice, soy sauce, cumin, garlic powder, 1 tsp salt and ¼ tsp cinnamon if you have it. Coat the steak and chicken and refrigerate overnight.",
        "Rice: simmer 2½ cups rinsed rice with 4¼ cups water, the butter, 1 tsp salt and a squeeze of lime, covered, 18 min.",
        "Heat a cast iron or heavy skillet on HIGH until smoking. Sear the skirt steak 2 min per side, then rest it 5 min.",
        "Cook the chicken thighs in the same pan, 5–6 min per side, until they reach 175°F.",
        "Slice the steak thin against the grain and chop the chicken. Toss both with a little lime juice.",
        "Build 5 bowls: rice, meat, about 3 Tbsp cheese. Microwave 2:00.",
      ],
    },
    // ---------- Logan's Monday prep (week of Nov 2) ----------
    pscramble: {
      name: "Chorizo & Egg Scramble with Rice", short: "Chorizo & Egg Scramble", source: { handle: "Your prep", url: null, note: "Your leftover eggs and San Manuel beef chorizo, about 1 oz of chorizo a morning. Replaces the breakfast burritos while the eggs and chorizo last." },
      servings: 1, servingLabel: "plate", method: "Skillet", time: "8 min", tags: ["home"],
      ingredients: [["p_eggs", 200, "4 large eggs"], ["p_chorizo", 28, "1 oz beef chorizo"], ["rice", 114, "2 cups cooked white rice"]],
      steps: ["Crumble the chorizo into a non-stick pan on medium and cook 3–4 min until browned. Don't drain; the fat is calories you want.",
        "Lower the heat, add the 4 whisked eggs, and stir slowly until just set, about 2 min.",
        "Serve over 2 cups of warmed rice (microwave 1 min with a splash of water)."],
    },
    pshake: {
      name: "Vanilla Whey & Whole Milk Shake", short: "Protein Shake", emoji: "🥤", source: { handle: "Your protein", url: null, note: "1 scoop of Optimum Nutrition Gold Standard Whey (Vanilla Ice Cream) in 4 cups of whole milk. Replaces the old mass-gainer shake. Your food already covers protein, so the milk adds the calories." },
      servings: 1, servingLabel: "shake", method: "Shaker / blender", time: "1 min", tags: ["no-cook"],
      ingredients: [["p_whey", 31, "1 scoop whey (Vanilla Ice Cream)"], ["milk", 976, "4 cups whole milk"]],
      steps: ["Add the milk first, then the scoop, and shake or blend 20 sec.", "On Mon/Wed, make it before you leave and drink it on the way."],
    },
    pchicken: {
      name: "Chicken Breast & Rice", short: "Chicken & Rice", source: { handle: "Your prep", url: null, note: "The 4.85 lb value pack split into 8 even portions (about 7 oz cooked each)." },
      servings: 1, servingLabel: "container", method: "Reheat", time: "2.5 min", tags: ["microwave", "campus"],
      ingredients: [["p_breast", 275, "⅛ of the cooked chicken (about 7 oz cooked)"], ["rice", 114, "2 cups cooked white rice"]],
      steps: ["Sprinkle 1 Tbsp water over the rice, cover loosely, and microwave 2:30, stirring halfway.", "Chicken breast dries out; a splash of water or a sauce packet helps."],
    },
    pbeef: {
      name: "Taco Beef & Rice", short: "Taco Beef & Rice", source: { handle: "Your prep", url: null, note: "2 lb of H-E-B 96% lean beef with 1 packet of Old El Paso taco seasoning, split into 8 portions of ¼ lb, each with about ¾ cup of rice." },
      servings: 1, servingLabel: "container", method: "Reheat", time: "2 min", tags: ["microwave", "campus"],
      ingredients: [["p_beef96", 113, "⅛ of the taco beef (¼ lb raw)"], ["p_taco", 3.5, "⅛ packet taco seasoning (already mixed in)"], ["rice", 43, "¾ cup cooked white rice"]],
      steps: ["Microwave 2:30 with 1 Tbsp water, stirring halfway."],
    },
    psausage: {
      name: "Jalapeño Sausage & Rice", short: "Jalapeño Sausage & Rice", source: { handle: "Your prep", url: null, note: "2 of the 10 H-E-B Texas-size jalapeño links per meal (5 meals)." },
      servings: 1, servingLabel: "container", method: "Reheat", time: "2 min", tags: ["microwave", "campus"],
      ingredients: [["p_sausage", 162, "2 jalapeño smoked sausage links, sliced"], ["rice", 114, "2 cups cooked white rice"]],
      steps: ["Slice the links into coins so they heat evenly.", "Microwave 2:00 with the rice, covered."],
    },
    palfredo: {
      name: "Zatarain's Blackened Chicken Alfredo (2 cups)", short: "Blackened Alfredo", source: { handle: "Your prep", url: null, note: "Family-size bag, about 6 cups, so 3 meals of 2 cups." },
      servings: 1, servingLabel: "bowl", method: "Reheat", time: "2.5 min", tags: ["microwave"],
      ingredients: [["p_alfredo", 460, "2 cups blackened chicken alfredo"]],
      steps: ["Add a splash of milk, cover, and microwave 2:30, stirring halfway so the sauce stays creamy."],
    },
    pbites: {
      name: "Buffalo Chicken Bites (6 oz)", short: "Buffalo Chicken Bites", source: { handle: "Your prep", url: null, note: "Tyson Any'tizers, 24 oz bag: 4 snacks of 6 oz (2 label servings)." },
      servings: 1, servingLabel: "snack", method: "Reheat", time: "1.5 min", tags: ["microwave"],
      ingredients: [["p_bites", 170, "6 oz buffalo chicken bites (about 6–7 pieces)"]],
      steps: ["Microwave 1:30, or air fry 4 min at 380°F to crisp them back up."],
    },
    pbitesrice: {
      name: "Buffalo Chicken Bites & Rice", short: "Buffalo Bites & Rice", source: { handle: "Your prep", url: null, note: "6 oz of the Tyson buffalo bites over 2 cups of rice, so the bites work as a full meal." },
      servings: 1, servingLabel: "plate", method: "Reheat", time: "3 min", tags: ["microwave", "campus"],
      ingredients: [["p_bites", 170, "6 oz buffalo chicken bites (about 6–7 pieces)"], ["rice", 114, "2 cups cooked white rice"]],
      steps: ["Cook the bites per the bag (air fryer 380°F for 10–12 min is crispiest), or microwave 1:30 if already cooked.", "Serve over 2 cups of warm rice. Packed: keep the bites and rice in one container and microwave 2:30."],
    },
    pbsand: {
      name: "PB & Honey Sandwich", short: "PB & Honey Sandwich", emoji: "🥜",
      source: null, servings: 1, servingLabel: "sandwich", method: "No cook", time: "2 min", tags: ["no-cook", "cold", "campus"],
      ingredients: [["bread", 56, "2 slices white bread"], ["pb", 40, "2½ Tbsp peanut butter"], ["honey", 21, "1 Tbsp honey"]],
      steps: ["Spread the peanut butter on both slices so the honey doesn't soak in, drizzle on the honey and close.", "Bag it. Good cold all day in a backpack."],
    },
    milkglass: {
      name: "Whole Milk, 16 oz", short: "Whole Milk 16 oz", emoji: "🥛",
      source: null, servings: 1, servingLabel: "glass", method: "Pour", time: "0 min", tags: ["no-cook"],
      ingredients: [["milk", 488, "2 cups whole milk"]], steps: ["Drink it with dinner or before bed."],
    },
  };

  // Rotation: 3-week cycle. Each main batch is cooked once that week (Sunday prep).
  // Lunch/dinner slots, Mon..Sun, reference main index 0/1/2 → counts 5/5/4.
  const ROTATION = [
    { name: "Rotation A", mains: ["lonestar", "honeygarlic", "beefrice"] },
    { name: "Rotation B", mains: ["tacobowls", "chipotlechix", "alfredo"], extras: [["20:00", "pbsand", 1, "home", "cold", "Rotation B calorie top-up"]] },
    { name: "Rotation C", mains: ["carneasada", "lonestar", "shrimppasta"] },
  ];
  const SLOTS = [[0, 1], [2, 0], [1, 2], [0, 1], [2, 0], [1, 2], [0, 1]]; // [lunch, dinner] per weekday Mon..Sun
  const DAILY_FIXED = [["burritos", 2], ["pshake", 1], ["pbsand", 1], ["milkglass", 1]];

  // Campus hours from Logan (0 = Mon). null = home all day.
  const CAMPUS = [[8, 21], [10.83, 15.5], [8, 18.5], [10.83, 12.5], null, null, null];

  // Meal timeline templates by weekday. type: which item, where: campus/home, heat: microwave/cold/cook/none
  // slot "L"/"D" = lunch main / dinner main.
  const TEMPLATES = [
    // Monday 8a–9p (long day: 4 packed items)
    [["7:00", "pshake", 1, "home", "none", "Shake before you leave"], ["7:10", "burritos", 1, "home", "microwave", "Eat 1 now"],
     ["10:30", "burritos", 1, "campus", "microwave", "Packed — thawed by now, 1:15 in the microwave"], ["12:45", "L", 1, "campus", "microwave", "Packed container"],
     ["15:30", "pbsand", 1, "campus", "cold", "Backpack snack"], ["18:15", "D", 1, "campus", "microwave", "Packed container (keep in lunch bag with ice pack)"],
     ["21:30", "milkglass", 1, "home", "none", "Home — drink before bed"]],
    // Tuesday 10:50a–3:30p
    [["8:30", "burritos", 2, "home", "microwave", ""], ["9:30", "pshake", 1, "home", "none", ""],
     ["12:30", "L", 1, "campus", "microwave", "Packed container"], ["15:00", "pbsand", 1, "campus", "cold", "Before the walk home"],
     ["18:30", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
    // Wednesday 8a–6:30p
    [["7:00", "pshake", 1, "home", "none", "Shake before you leave"], ["7:10", "burritos", 1, "home", "microwave", ""],
     ["10:30", "burritos", 1, "campus", "microwave", "Packed"], ["13:15", "L", 1, "campus", "microwave", "Packed container"],
     ["16:00", "pbsand", 1, "campus", "cold", "Backpack snack"], ["19:15", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
    // Thursday 10:50a–12:30p
    [["8:30", "burritos", 2, "home", "microwave", ""], ["9:30", "pshake", 1, "home", "none", ""],
     ["11:45", "pbsand", 1, "campus", "cold", "Between classes"], ["13:15", "L", 1, "home", "microwave", "Home for lunch"],
     ["18:30", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
    // Friday — home
    [["9:00", "burritos", 2, "home", "microwave", ""], ["10:00", "pshake", 1, "home", "none", ""], ["13:00", "L", 1, "home", "microwave", ""],
     ["16:00", "pbsand", 1, "home", "cold", ""], ["19:00", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
    // Saturday — grocery day
    [["9:30", "burritos", 2, "home", "microwave", ""], ["10:30", "pshake", 1, "home", "none", "Then hit Sam's → Walmart → H-E-B"], ["13:30", "L", 1, "home", "microwave", ""],
     ["16:00", "pbsand", 1, "home", "cold", ""], ["19:00", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
    // Sunday — prep day
    [["9:30", "burritos", 2, "home", "microwave", "Last 2 burritos — make the new batch today"], ["10:30", "pshake", 1, "home", "none", "Start the crockpot meals now"],
     ["13:30", "L", 1, "home", "microwave", ""], ["16:00", "pbsand", 1, "home", "cold", ""], ["19:00", "D", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""]],
  ];

  // One-off events pulled from Google Calendar (week of Nov 2, 2026)
  const CAL_NOTES = {
    "2026-11-04": ["📝 PETE 310 Midterm 2, 11:30–12:20. Eat the packed burrito by 11:00 so you're not hungry during the exam.",
                   "🎤 SPE Executive Series (ExxonMobil), 6–7 PM, RICH 114. Eat dinner after 7."],
    "2026-11-05": ["📚 SPE Study Session, 3–5 PM, RICH 910 (snacks provided). Bring the PB sandwich and a milk anyway.",
                   "🛢️ SPE Tech Dev (AWA Oilfield), 6–7 PM, RICH 910. Have dinner at 5:15 between events, or pack it."],
  };

  // Prepped-food weeks: these dates replace the rotation. [time, recipeId, servings, where, heat, note]
  const OVERRIDES = {
    "2026-11-03": [["8:30", "pscramble", 1, "home", "cook", ""], ["9:30", "pshake", 1, "home", "none", ""],
      ["12:30", "pchicken", 1, "campus", "microwave", "Packed"], ["16:00", "lonestar", 1, "home", "microwave", "Home after class"],
      ["18:30", "pbeef", 1, "home", "microwave", ""], ["20:00", "pbites", 1, "home", "microwave", ""],
      ["21:30", "psausage", 1, "home", "microwave", ""], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-04": [["7:00", "pscramble", 1, "home", "cook", "Before you leave"], ["7:15", "pshake", 1, "home", "none", "Drink on the way"],
      ["10:30", "pchicken", 1, "campus", "microwave", "Eat before the 11:30 midterm"], ["13:30", "lonestar", 1, "campus", "microwave", "Packed"],
      ["16:30", "psausage", 1, "campus", "microwave", "Packed (lunch bag + ice pack)"], ["19:15", "palfredo", 1, "home", "microwave", "After the SPE talk"],
      ["21:00", "milkglass", 1, "home", "none", ""], ["22:00", "milkglass", 1, "home", "none", "Second glass: Wednesday top-up"]],
    "2026-11-05": [["8:30", "pscramble", 1, "home", "cook", ""], ["9:30", "pshake", 1, "home", "none", ""],
      ["11:45", "pbites", 1, "campus", "microwave", "Packed, between classes"], ["13:15", "pbeef", 1, "home", "microwave", ""],
      ["17:15", "lonestar", 1, "home", "microwave", "Between the two SPE events"], ["19:30", "pchicken", 1, "home", "microwave", ""],
      ["21:30", "psausage", 1, "home", "microwave", ""], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-06": [["9:00", "pscramble", 1, "home", "cook", ""], ["10:00", "pshake", 1, "home", "none", ""],
      ["12:30", "pchicken", 1, "home", "microwave", "Thawed overnight"], ["15:30", "palfredo", 1, "home", "microwave", ""],
      ["18:30", "pbeef", 1, "home", "microwave", "Thawed overnight"], ["20:30", "pchicken", 1, "home", "microwave", ""],
      ["21:30", "psausage", 1, "home", "microwave", ""], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-07": [["9:30", "pscramble", 1, "home", "cook", ""], ["10:30", "pshake", 1, "home", "none", ""],
      ["13:00", "pchicken", 1, "home", "microwave", "Thawed overnight"], ["16:00", "palfredo", 1, "home", "microwave", ""],
      ["18:30", "lonestar", 1, "home", "microwave", "Thawed overnight"], ["20:30", "pbites", 1, "home", "microwave", ""],
      ["21:30", "psausage", 1, "home", "microwave", ""], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-08": [["9:30", "pscramble", 1, "home", "cook", ""], ["10:30", "pshake", 1, "home", "none", ""],
      ["13:00", "pchicken", 1, "home", "microwave", "Thawed overnight"], ["16:00", "pbeef", 1, "home", "microwave", "Thawed overnight"],
      ["18:30", "lonestar", 1, "home", "microwave", "Thawed overnight"], ["20:30", "pbites", 1, "home", "microwave", ""],
      ["21:30", "pchicken", 1, "home", "microwave", ""], ["22:00", "milkglass", 1, "home", "none", "Shop and prep for next week today"]],
    // Week of Nov 9: taco beef, 2 bags blackened alfredo, 3 bags buffalo bites, eggs + chorizo
    "2026-11-09": [["7:00", "pshake", 1, "home", "none", "Shake before you leave"], ["7:10", "pscramble", 1, "home", "cook", ""], ["10:30", "pbsand", 1, "campus", "cold", "Packed"], ["12:45", "pbeef", 1, "campus", "microwave", "Packed"], ["15:30", "pbsand", 1, "campus", "cold", "Backpack snack"], ["18:15", "pbitesrice", 1, "campus", "microwave", "Packed (lunch bag + ice pack)"], ["21:15", "pbites", 1, "home", "microwave", "Home"], ["21:45", "milkglass", 1, "home", "none", ""], ["22:15", "milkglass", 1, "home", "none", "Second glass: long-day top-up"]],
    "2026-11-10": [["8:30", "pscramble", 1, "home", "cook", ""], ["9:30", "pshake", 1, "home", "none", ""], ["10:30", "pbsand", 1, "home", "cold", "Before class"], ["12:30", "pbeef", 1, "campus", "microwave", "Packed"], ["15:00", "pbsand", 1, "campus", "cold", "Before the walk home"], ["18:30", "palfredo", 1, "home", "microwave", ""], ["20:30", "pbites", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""], ["22:00", "pbsand", 1, "home", "cold", ""]],
    "2026-11-11": [["7:00", "pshake", 1, "home", "none", "Shake before you leave"], ["7:10", "pscramble", 1, "home", "cook", ""], ["10:30", "pbeef", 2, "campus", "microwave", "Packed: 2 containers"], ["13:15", "pbeef", 1, "campus", "microwave", "Packed"], ["16:00", "pbeef", 1, "campus", "microwave", "Packed (lunch bag + ice pack)"], ["19:15", "palfredo", 1, "home", "microwave", ""], ["20:30", "milkglass", 1, "home", "none", ""], ["21:00", "pbites", 1, "home", "microwave", ""], ["21:30", "pshake", 1, "home", "none", "Second shake: replaces the PB sandwiches"], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-12": [["8:30", "pscramble", 1, "home", "cook", ""], ["9:30", "pshake", 1, "home", "none", ""], ["11:45", "pbsand", 1, "campus", "cold", "Between classes"], ["13:15", "palfredo", 1, "home", "microwave", "Home for lunch"], ["16:00", "pbites", 1, "home", "microwave", ""], ["18:30", "pbitesrice", 1, "home", "microwave", ""], ["20:30", "pbsand", 1, "home", "cold", ""], ["21:30", "milkglass", 1, "home", "none", ""], ["22:00", "pbsand", 1, "home", "cold", ""]],
    "2026-11-13": [["9:00", "pscramble", 1, "home", "cook", ""], ["10:00", "pshake", 1, "home", "none", ""], ["13:00", "pbeef", 1, "home", "microwave", "Thawed overnight"], ["15:00", "pbsand", 1, "home", "cold", ""], ["16:30", "pbites", 1, "home", "microwave", ""], ["19:00", "palfredo", 1, "home", "microwave", ""], ["20:00", "pbsand", 1, "home", "cold", ""], ["21:00", "pbites", 1, "home", "microwave", ""], ["21:30", "milkglass", 1, "home", "none", ""], ["22:00", "milkglass", 1, "home", "none", ""]],
    "2026-11-14": [["9:30", "pscramble", 1, "home", "cook", ""], ["10:30", "pshake", 1, "home", "none", ""], ["13:30", "palfredo", 1, "home", "microwave", ""], ["15:00", "pbsand", 1, "home", "cold", ""], ["16:30", "pbites", 1, "home", "microwave", ""], ["19:00", "pbitesrice", 1, "home", "microwave", ""], ["20:30", "pbsand", 1, "home", "cold", ""], ["21:30", "milkglass", 1, "home", "none", ""], ["22:00", "pbsand", 1, "home", "cold", ""]],
    "2026-11-15": [["9:30", "pscramble", 1, "home", "cook", ""], ["10:30", "pshake", 1, "home", "none", ""], ["13:30", "palfredo", 1, "home", "microwave", ""], ["15:00", "pbsand", 1, "home", "cold", ""], ["16:30", "pbites", 1, "home", "microwave", ""], ["19:00", "pbitesrice", 1, "home", "microwave", ""], ["20:30", "pbsand", 1, "home", "cold", ""], ["21:30", "milkglass", 1, "home", "none", ""], ["22:00", "pbsand", 1, "home", "cold", "Shop and prep for next week today"]],
  };
  // Optional swaps on top of the rotation for a date range, e.g.
  // { from: "2026-11-16", to: "2026-11-22", replace: "burritos", with: "pscramble", topUp: "pbsand" }.
  // The first matching slot becomes `with`; extra slots become `topUp`, or one `topUp` is added 2 h later.
  const SWAPS = [];
  // Prep weeks (shown on the Week plan when that week has OVERRIDES).
  const PREP = [];
  PREP.push({
    label: "Your Monday prep", from: "2026-11-02", to: "2026-11-08",
    inventory: [["Chicken breast", "8 portions (4.85 lb)"], ["Taco ground beef", "4 portions (2 lb)"], ["Jalapeño sausage", "10 links → 5 meals"],
      ["Lone Star Spaghetti", "5 containers"], ["Blackened Chicken Alfredo", "~6 cups → 3 meals"], ["Buffalo chicken bites", "24 oz → 4 snacks"],
      ["Eggs + chorizo", "36 eggs, ½ pack chorizo"], ["Whole milk", "~2 gallons for the week"], ["Whey protein", "1 scoop a day"], ["White rice", "2 cups per rice meal (cook more as needed)"]],
    freeze: "Cooked food is good for about 4 days in the fridge, so Monday's prep is fine through Thursday. Tonight (Tue), freeze the Fri–Sun portions: 5 chicken, 2 taco beef, 2 Lone Star, and their rice. Move each one to the fridge the night before. Sausage links keep about a week in the fridge. If the alfredo and bites are still in their frozen bags, cook them the day you eat them.",
  });
  PREP.push({
    label: "Your food this week", from: "2026-11-09", to: "2026-11-15",
    inventory: [["Taco ground beef", "8 portions of ¼ lb + ¾ cup rice (2 lb) → Mon, Tue, Wed ×4, Fri, 1 spare"], ["Blackened Chicken Alfredo", "2 family bags (~12 cups) → 6 meals of 2 cups"],
      ["Buffalo chicken bites", "3 bags (72 oz) → 12 servings of 6 oz: 4 over rice, 8 as snacks"], ["Eggs + chorizo", "~28 eggs, ~7 oz chorizo (4 eggs + 1 oz a morning)"],
      ["Whole milk", "~3 gallons (shake + glasses)"], ["Whey protein", "1 scoop a day"], ["Bread + peanut butter", "19 PB & honey sandwiches → ~2 loaves"],
      ["White rice", "2 cups per rice meal (cook more as needed)"]],
    freeze: "Cooked taco beef is good for about 4 days in the fridge. If it was cooked over the weekend, freeze the Friday portion tonight and move it to the fridge Thursday night. The alfredo and bites stay frozen in their bags: cook what you need the day you eat it, or cook a batch and finish it within 3–4 days. Pack Mon/Wed campus meals the night before.",
  });

  // Fast food. Components: [name, kcal, protein, carbs]. Macros are approximate, from each chain's
  // published nutrition info; check the chain's app for current numbers. Prices are rough BCS estimates.
  const FASTFOOD = [
    { id: "lc", fav: true, chain: "Little Caesars", name: "Large Pepperoni + 2 Buffalo Dips", price: 9.97, color: "#f97316",
      parts: [["Classic Pepperoni, large (8 slices)", 2240, 104, 256], ["Buffalo dip ×2", 220, 0, 4]],
      portions: [["Whole", 1], ["Half", 0.5], ["3 slices", 0.375]] },
    { id: "panda", fav: true, chain: "Panda Express", name: "Plate: Fried Rice, Orange Chicken & Teriyaki Chicken", price: 11.5, color: "#ef4444",
      parts: [["Fried Rice (side)", 520, 11, 85], ["Orange Chicken (entrée)", 490, 25, 51], ["Grilled Teriyaki Chicken (entrée)", 275, 33, 14]],
      portions: [["Plate", 1], ["Half", 0.5]] },
    { id: "cfa", chain: "Chick-fil-A", name: "12-ct Nuggets, Large Fries & Chick-fil-A Sauce", price: 13.2, color: "#e11d48",
      parts: [["12-ct Nuggets", 380, 40, 16], ["Large Waffle Fries", 600, 7, 69], ["Chick-fil-A Sauce", 140, 0, 7]],
      portions: [["Meal", 1]] },
    { id: "canes", chain: "Raising Cane's", name: "3 Finger Combo (no slaw)", price: 11.0, color: "#facc15",
      parts: [["3 Chicken Fingers", 390, 39, 21], ["Crinkle Fries", 390, 5, 47], ["Texas Toast", 150, 4, 19], ["Cane's Sauce", 190, 0, 7]],
      portions: [["Combo", 1]] },
    { id: "whata", chain: "Whataburger", name: "Double Meat w/ Cheese (meat & cheese only) + Med Fries", price: 14.0, color: "#fb923c",
      parts: [["Double Meat Whataburger, cheese, no veggies", 1000, 57, 60], ["Medium Fries", 400, 5, 52]],
      portions: [["Meal", 1], ["Burger only", 0.71]] },
    { id: "chipotle", chain: "Chipotle", name: "Double Chicken Bowl (rice, cheese, sour cream)", price: 15.0, color: "#b91c1c",
      parts: [["White rice", 210, 4, 40], ["Double chicken", 360, 64, 0], ["Cheese", 110, 6, 1], ["Sour cream", 110, 2, 2]],
      portions: [["Bowl", 1]] },
  ];

  const PROFILE = { age: 20, heightIn: 76, weightLb: 200, goalLb: 220, sex: "M" };
  const GOALS = { kcal: 5000, protein: 220, carbs: 400 };
  const BUDGET = 100;

  return { STORES: S, PRODUCTS: P, RECIPES: R, ROTATION, SLOTS, DAILY_FIXED, CAMPUS, TEMPLATES, CAL_NOTES, FASTFOOD, OVERRIDES, SWAPS, PREP, PROFILE, GOALS, BUDGET };
})();
if (typeof module !== "undefined") module.exports = DATA;
