// Bentes køkken — built-in recipe data and ingredient vocabulary.
// Units: g, ml, pcs, tbsp, tsp, serving (serving = a portion of a leftover dish).
// Ingredient fields: n = name, q = amount for the recipe's base servings, u = unit,
// alt = other names that also count, opt = optional (not needed for a match).
// provides = what a leftover of this dish can stand in for in other recipes.

window.PC_DATA = {
  STAPLES: ['salt', 'black pepper', 'oil', 'olive oil', 'water'],

  // Different words for the same thing (singular forms). Left side → right side.
  ALIASES: {
    'ground beef': 'minced beef', 'mince': 'minced beef', 'beef mince': 'minced beef', 'minced meat': 'minced beef',
    'chopped tomato': 'canned tomato', 'tinned tomato': 'canned tomato', 'can tomato': 'canned tomato', 'crushed tomato': 'canned tomato',
    'scallion': 'spring onion', 'green onion': 'spring onion',
    'broth': 'stock', 'chilli': 'chili', 'chilli flake': 'chili flake', 'red pepper flake': 'chili flake', 'chilli powder': 'chili powder',
    'pepper': 'black pepper', 'capsicum': 'bell pepper', 'red pepper': 'bell pepper', 'green pepper': 'bell pepper', 'yellow pepper': 'bell pepper',
    'courgette': 'zucchini', 'aubergine': 'eggplant', 'prawn': 'shrimp', 'garbanzo': 'chickpea',
    'coriander': 'cilantro', 'yoghurt': 'yogurt',
    'spaghetti': 'pasta', 'penne': 'pasta', 'macaroni': 'pasta', 'fusilli': 'pasta', 'linguine': 'pasta', 'tagliatelle': 'pasta',
    'wrap': 'tortilla', 'chicken breast': 'chicken', 'chicken thigh': 'chicken', 'chicken fillet': 'chicken',
    'cheddar': 'cheddar cheese', 'mozzarella': 'mozzarella cheese', 'parmesan': 'parmesan cheese', 'parmigiano': 'parmesan cheese',
    'feta': 'feta cheese', 'gouda': 'gouda cheese', 'tuna can': 'tuna', 'canned tuna': 'tuna', 'corn': 'sweetcorn',
    'garlic clove': 'garlic', 'clove garlic': 'garlic', 'clove of garlic': 'garlic', 'can tuna': 'tuna', 'mayo': 'mayonnaise',
    'oat': 'oat', 'rolled oat': 'oat', 'baby spinach': 'spinach', 'cherry tomato': 'tomato', 'brown onion': 'onion', 'yellow onion': 'onion',
    'chive': 'chives', 'cinnamon stick': 'cinnamon', 'porridge oat': 'oat',
    'all purpose flour': 'flour', 'plain flour': 'flour', 'red lentil': 'lentil', 'kidney': 'kidney bean',
  },

  // Used by the "Create a recipe" generator to understand what each pantry item is.
  CATEGORIES: {
    protein: ['chicken', 'minced beef', 'beef', 'pork', 'bacon', 'sausage', 'ham', 'tuna', 'salmon', 'shrimp', 'fish', 'tofu',
      'chickpea', 'lentil', 'kidney bean', 'black bean', 'bean', 'turkey', 'halloumi'],
    veg: ['onion', 'garlic', 'tomato', 'bell pepper', 'broccoli', 'carrot', 'spinach', 'mushroom', 'zucchini', 'eggplant', 'pea',
      'sweetcorn', 'cabbage', 'kale', 'leek', 'celery', 'cucumber', 'cauliflower', 'green bean', 'spring onion', 'chili',
      'lettuce', 'avocado', 'asparagus', 'pumpkin', 'squash', 'olive', 'beetroot', 'sweet potato'],
    carb: ['pasta', 'rice', 'noodle', 'tortilla', 'bread', 'potato', 'sweet potato', 'couscous', 'quinoa'],
    dairy: ['cheese', 'milk', 'cream', 'butter', 'yogurt', 'sour cream', 'creme fraiche'],
    flavour: ['soy sauce', 'curry powder', 'curry paste', 'paprika', 'cumin', 'chili flake', 'chili powder', 'ginger', 'lemon',
      'lime', 'basil', 'parsley', 'cilantro', 'pesto', 'honey', 'mustard', 'canned tomato', 'coconut milk', 'stock',
      'vinegar', 'oregano', 'thyme', 'rosemary', 'sesame oil', 'sriracha', 'tomato paste', 'cinnamon', 'chives'],
  },

  QUICK: ['4 eggs', '500g pasta', '300g rice', '400g chicken', '2 onions', '4 garlic', '400g canned tomatoes', '200g cheese',
    '2 bell peppers', '250g mushrooms', '3 potatoes', '200ml milk', 'soy sauce', '4 tortillas', '400g kidney beans', 'broccoli'],

  RECIPES: [
    {
      id: 'aglio', name: 'Spaghetti aglio e olio', time: 15, serves: 2, tags: ['pasta', 'quick', 'vegetarian'],
      provides: ['cooked pasta'],
      ingredients: [
        { n: 'pasta', q: 200, u: 'g' }, { n: 'garlic', q: 4, u: 'pcs' }, { n: 'chili flake', q: 1, u: 'tsp', alt: ['chili'] },
        { n: 'olive oil', q: 4, u: 'tbsp' }, { n: 'parsley', q: 1, u: 'tbsp', opt: true }, { n: 'parmesan', q: 30, u: 'g', opt: true },
      ],
      steps: ['Boil the pasta in well-salted water until just al dente. Keep a cup of the cooking water.',
        'Meanwhile, slice the garlic thinly and warm it gently in the olive oil with the chili until pale gold.',
        'Toss the drained pasta in the pan with a splash of pasta water until glossy.',
        'Finish with parsley and parmesan if you have them.'],
      remix: 'Fry leftover pasta in a pan until crispy, then crack two eggs over it for a pasta frittata.',
    },
    {
      id: 'tomato-pasta', name: 'Simple tomato pasta', time: 25, serves: 2, tags: ['pasta', 'vegetarian'],
      provides: ['cooked pasta'],
      ingredients: [
        { n: 'pasta', q: 200, u: 'g' }, { n: 'canned tomato', q: 400, u: 'g', alt: ['tomato'] }, { n: 'onion', q: 1, u: 'pcs' },
        { n: 'garlic', q: 2, u: 'pcs' }, { n: 'olive oil', q: 2, u: 'tbsp' }, { n: 'basil', q: 1, u: 'tbsp', opt: true },
        { n: 'cheese', q: 40, u: 'g', opt: true },
      ],
      steps: ['Soften the chopped onion in olive oil for 5 minutes, add the garlic for 1 more.',
        'Add the tomatoes, season and simmer for 15 minutes while the pasta cooks.',
        'Toss the pasta through the sauce. Top with basil and cheese.'],
      remix: 'Leftovers make a great pasta bake: cover with cheese and bake at 200 °C for 15 minutes.',
    },
    {
      id: 'pasta-bake', name: 'Leftover pasta bake', time: 25, serves: 2, tags: ['pasta', 'leftover remix'],
      ingredients: [
        { n: 'cooked pasta', q: 400, u: 'g' }, { n: 'canned tomato', q: 200, u: 'g', alt: ['tomato'] }, { n: 'cheese', q: 100, u: 'g' },
        { n: 'spinach', q: 80, u: 'g', opt: true },
      ],
      steps: ['Heat the oven to 200 °C.', 'Mix the cooked pasta with the tomatoes (and spinach) in a baking dish.',
        'Cover with cheese and bake for 15–20 minutes until bubbling and golden.'],
    },
    {
      id: 'omelette', name: 'Loaded vegetable omelette', time: 12, serves: 1, tags: ['eggs', 'quick', 'vegetarian'],
      ingredients: [
        { n: 'egg', q: 3, u: 'pcs' }, { n: 'onion', q: 0.5, u: 'pcs', alt: ['spring onion'] }, { n: 'bell pepper', q: 0.5, u: 'pcs', alt: ['tomato', 'mushroom', 'spinach'] },
        { n: 'cheese', q: 30, u: 'g', opt: true }, { n: 'milk', q: 2, u: 'tbsp', opt: true }, { n: 'butter', q: 10, u: 'g', alt: ['oil'] },
      ],
      steps: ['Dice the vegetables and soften them in the butter for 3–4 minutes.', 'Whisk the eggs with the milk, salt and pepper.',
        'Pour the eggs over the vegetables, cook gently, pulling the edges in, until just set.', 'Scatter cheese over one half, fold and serve.'],
    },
    {
      id: 'stir-fry', name: 'Chicken & veg stir-fry with rice', time: 25, serves: 2, tags: ['rice', 'chicken'],
      provides: ['cooked rice'],
      ingredients: [
        { n: 'chicken', q: 300, u: 'g', alt: ['tofu', 'shrimp'] }, { n: 'rice', q: 150, u: 'g', alt: ['noodle'] },
        { n: 'bell pepper', q: 1, u: 'pcs' }, { n: 'broccoli', q: 200, u: 'g', alt: ['carrot', 'zucchini', 'green bean'] },
        { n: 'soy sauce', q: 3, u: 'tbsp' }, { n: 'garlic', q: 2, u: 'pcs' }, { n: 'ginger', q: 1, u: 'tsp', opt: true }, { n: 'oil', q: 2, u: 'tbsp' },
      ],
      steps: ['Start the rice. Cut the chicken and vegetables into bite-sized pieces.',
        'Stir-fry the chicken in a very hot pan with oil until browned, then set aside.',
        'Stir-fry the vegetables with garlic (and ginger) for 3–4 minutes; they should stay crisp.',
        'Return the chicken, add soy sauce, toss for 1 minute and serve over the rice.'],
      remix: 'Leftover rice is perfect for egg fried rice the next day — cold rice fries best.',
    },
    {
      id: 'fried-rice', name: 'Egg fried rice', time: 15, serves: 2, tags: ['rice', 'leftover remix', 'quick'],
      ingredients: [
        { n: 'cooked rice', q: 400, u: 'g' }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'pea', q: 100, u: 'g', alt: ['sweetcorn', 'carrot', 'bell pepper'] },
        { n: 'soy sauce', q: 2, u: 'tbsp' }, { n: 'spring onion', q: 2, u: 'pcs', alt: ['onion'] }, { n: 'oil', q: 2, u: 'tbsp' },
        { n: 'sesame oil', q: 1, u: 'tsp', opt: true },
      ],
      steps: ['Heat oil in a wok until very hot. Scramble the eggs quickly and push to one side.',
        'Add the vegetables and fry for 2 minutes, then add the cold rice and break up any clumps.',
        'Fry until the rice is hot and slightly crisp, add soy sauce and spring onion, toss and serve.'],
    },
    {
      id: 'chili', name: 'Chili con carne', time: 50, serves: 4, tags: ['beef', 'batch cook'],
      provides: ['leftover chili'],
      ingredients: [
        { n: 'minced beef', q: 400, u: 'g', alt: ['lentil'] }, { n: 'kidney bean', q: 400, u: 'g', alt: ['black bean', 'bean'] },
        { n: 'canned tomato', q: 400, u: 'g' }, { n: 'onion', q: 1, u: 'pcs' }, { n: 'garlic', q: 2, u: 'pcs' },
        { n: 'chili powder', q: 2, u: 'tsp', alt: ['chili flake', 'chili', 'paprika'] }, { n: 'cumin', q: 1, u: 'tsp', opt: true },
        { n: 'rice', q: 200, u: 'g', opt: true },
      ],
      steps: ['Brown the mince in a large pot, then add the chopped onion and garlic and cook for 5 minutes.',
        'Stir in the spices, then the tomatoes and drained beans.', 'Simmer gently for 30 minutes, stirring now and then. Season.',
        'Serve with rice, in tortillas or on a baked potato.'],
      remix: 'Chili is even better on day two: stuff it into baked potatoes or tortillas.',
    },
    {
      id: 'chili-potato', name: 'Chili-stuffed baked potatoes', time: 60, serves: 2, tags: ['leftover remix', 'potato'],
      ingredients: [
        { n: 'potato', q: 2, u: 'pcs', alt: ['sweet potato'] }, { n: 'leftover chili', q: 2, u: 'serving' }, { n: 'cheese', q: 50, u: 'g' },
        { n: 'sour cream', q: 2, u: 'tbsp', opt: true, alt: ['yogurt'] },
      ],
      steps: ['Prick the potatoes and bake at 200 °C for 50–60 minutes until soft inside.',
        'Reheat the chili until piping hot.', 'Split the potatoes, spoon in the chili, top with cheese and sour cream.'],
    },
    {
      id: 'chili-wraps', name: 'Chili quesadillas', time: 15, serves: 2, tags: ['leftover remix', 'quick'],
      ingredients: [
        { n: 'tortilla', q: 4, u: 'pcs' }, { n: 'leftover chili', q: 2, u: 'serving' }, { n: 'cheese', q: 80, u: 'g' },
      ],
      steps: ['Spread chili over two tortillas, cover with cheese and the other tortillas.',
        'Toast in a dry pan for 2–3 minutes per side until crisp and melted. Cut into wedges.'],
    },
    {
      id: 'shakshuka', name: 'Shakshuka', time: 30, serves: 2, tags: ['eggs', 'vegetarian'],
      ingredients: [
        { n: 'egg', q: 4, u: 'pcs' }, { n: 'canned tomato', q: 400, u: 'g', alt: ['tomato'] }, { n: 'onion', q: 1, u: 'pcs' },
        { n: 'bell pepper', q: 1, u: 'pcs' }, { n: 'garlic', q: 2, u: 'pcs' }, { n: 'cumin', q: 1, u: 'tsp', alt: ['paprika'] },
        { n: 'feta', q: 50, u: 'g', opt: true }, { n: 'bread', q: 2, u: 'pcs', opt: true },
      ],
      steps: ['Soften the onion and pepper in oil for 8 minutes, add garlic and spices for 1 more.',
        'Add the tomatoes and simmer for 10 minutes until thick.',
        'Make 4 hollows, crack in the eggs, cover and cook for 5–7 minutes until the whites set.', 'Crumble over feta, serve with bread.'],
    },
    {
      id: 'potato-soup', name: 'Potato & leek soup', time: 35, serves: 4, tags: ['soup', 'vegetarian', 'batch cook'],
      provides: ['leftover soup'],
      ingredients: [
        { n: 'potato', q: 500, u: 'g' }, { n: 'leek', q: 2, u: 'pcs', alt: ['onion'] }, { n: 'stock', q: 1000, u: 'ml' },
        { n: 'butter', q: 30, u: 'g', alt: ['oil'] }, { n: 'cream', q: 100, u: 'ml', opt: true, alt: ['milk'] },
      ],
      steps: ['Slice the leeks and soften in butter for 8 minutes without browning.',
        'Add diced potatoes and the stock, simmer 20 minutes until soft.', 'Blend until smooth, stir in the cream and season.'],
      remix: 'Thick leftover soup makes a quick pasta sauce, or reheat with a handful of cheese stirred in.',
    },
    {
      id: 'greek-salad', name: 'Greek salad', time: 10, serves: 2, tags: ['salad', 'vegetarian', 'quick', 'no cook'],
      ingredients: [
        { n: 'tomato', q: 3, u: 'pcs' }, { n: 'cucumber', q: 1, u: 'pcs' }, { n: 'feta', q: 150, u: 'g' },
        { n: 'olive', q: 50, u: 'g', opt: true }, { n: 'red onion', q: 0.5, u: 'pcs', alt: ['onion'] }, { n: 'olive oil', q: 3, u: 'tbsp' },
        { n: 'oregano', q: 1, u: 'tsp', opt: true },
      ],
      steps: ['Cut the tomatoes and cucumber into chunks, slice the onion thinly.',
        'Toss with olives, olive oil, salt and oregano.', 'Top with a slab of feta.'],
    },
    {
      id: 'tray-bake', name: 'Chicken & veg tray bake', time: 50, serves: 4, tags: ['chicken', 'oven', 'batch cook'],
      provides: ['leftover roast chicken'],
      ingredients: [
        { n: 'chicken', q: 600, u: 'g' }, { n: 'potato', q: 600, u: 'g', alt: ['sweet potato'] }, { n: 'carrot', q: 3, u: 'pcs', alt: ['zucchini', 'bell pepper'] },
        { n: 'onion', q: 2, u: 'pcs' }, { n: 'paprika', q: 2, u: 'tsp', alt: ['thyme', 'rosemary', 'oregano'] }, { n: 'oil', q: 3, u: 'tbsp' },
        { n: 'lemon', q: 1, u: 'pcs', opt: true },
      ],
      steps: ['Heat the oven to 210 °C.', 'Cut the potatoes, carrots and onions into chunks and toss with oil, paprika, salt and pepper.',
        'Add the chicken on top and roast for 40–45 minutes, turning once, until the chicken is cooked through.',
        'Squeeze over lemon to serve.'],
      remix: 'Shred leftover chicken into wraps, fried rice or a quick salad.',
    },
    {
      id: 'chicken-wraps', name: 'Leftover chicken wraps', time: 10, serves: 2, tags: ['leftover remix', 'quick'],
      ingredients: [
        { n: 'tortilla', q: 4, u: 'pcs' }, { n: 'leftover roast chicken', q: 2, u: 'serving', alt: ['chicken'] },
        { n: 'lettuce', q: 1, u: 'pcs', alt: ['spinach', 'cucumber'] }, { n: 'yogurt', q: 4, u: 'tbsp', alt: ['mayonnaise', 'sour cream'] },
      ],
      steps: ['Warm the tortillas and shred the chicken.', 'Fill with chicken, greens and a spoon of yogurt. Roll up and eat.'],
    },
    {
      id: 'quesadillas', name: 'Bean & cheese quesadillas', time: 15, serves: 2, tags: ['vegetarian', 'quick'],
      ingredients: [
        { n: 'tortilla', q: 4, u: 'pcs' }, { n: 'kidney bean', q: 400, u: 'g', alt: ['black bean', 'bean'] }, { n: 'cheese', q: 100, u: 'g' },
        { n: 'bell pepper', q: 1, u: 'pcs', opt: true }, { n: 'cumin', q: 1, u: 'tsp', opt: true },
      ],
      steps: ['Roughly mash the beans with cumin and a pinch of salt.', 'Spread on two tortillas, add pepper and cheese, top with the others.',
        'Toast in a dry pan for 2–3 minutes per side.'],
    },
    {
      id: 'pancakes', name: 'Banana pancakes', time: 20, serves: 2, tags: ['breakfast', 'sweet', 'vegetarian'],
      ingredients: [
        { n: 'banana', q: 2, u: 'pcs' }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'flour', q: 100, u: 'g', alt: ['oat'] },
        { n: 'milk', q: 150, u: 'ml' }, { n: 'butter', q: 15, u: 'g', alt: ['oil'] }, { n: 'honey', q: 2, u: 'tbsp', opt: true },
      ],
      steps: ['Mash the bananas, whisk in the eggs and milk, then the flour, until just combined.',
        'Fry small ladlefuls in a buttered pan for 2 minutes per side.', 'Serve with honey.'],
    },
    {
      id: 'risotto', name: 'Mushroom risotto', time: 40, serves: 3, tags: ['rice', 'vegetarian'],
      provides: ['cooked rice', 'leftover risotto'],
      ingredients: [
        { n: 'rice', q: 250, u: 'g' }, { n: 'mushroom', q: 250, u: 'g' }, { n: 'onion', q: 1, u: 'pcs' }, { n: 'stock', q: 900, u: 'ml' },
        { n: 'parmesan', q: 50, u: 'g', alt: ['cheese'] }, { n: 'butter', q: 30, u: 'g' }, { n: 'garlic', q: 1, u: 'pcs', opt: true },
      ],
      steps: ['Fry the mushrooms in half the butter until golden; set aside.', 'Soften the onion (and garlic), add the rice and stir for 1 minute.',
        'Add hot stock a ladle at a time, stirring, for about 18 minutes until creamy and just tender.',
        'Stir in the mushrooms, the rest of the butter and the cheese. Rest 2 minutes.'],
      remix: 'Roll cold leftover risotto into balls around a cube of cheese, coat in flour and fry: crispy rice cakes.',
    },
    {
      id: 'rice-cakes', name: 'Crispy rice cakes', time: 20, serves: 2, tags: ['rice', 'leftover remix'],
      ingredients: [
        { n: 'cooked rice', q: 300, u: 'g', alt: ['leftover risotto'] }, { n: 'egg', q: 1, u: 'pcs' }, { n: 'cheese', q: 50, u: 'g' },
        { n: 'flour', q: 40, u: 'g' }, { n: 'spring onion', q: 1, u: 'pcs', opt: true }, { n: 'oil', q: 3, u: 'tbsp' },
      ],
      steps: ['Mix the cold rice with the egg, cheese, flour and spring onion.', 'Shape into small patties.',
        'Fry in oil for 3–4 minutes per side until crisp and golden.'],
    },
    {
      id: 'dal', name: 'Red lentil & coconut dal', time: 35, serves: 4, tags: ['vegan', 'curry', 'batch cook'],
      provides: ['leftover curry'],
      ingredients: [
        { n: 'lentil', q: 250, u: 'g' }, { n: 'onion', q: 1, u: 'pcs' }, { n: 'garlic', q: 3, u: 'pcs' }, { n: 'canned tomato', q: 400, u: 'g', alt: ['tomato'] },
        { n: 'curry powder', q: 2, u: 'tbsp', alt: ['curry paste'] }, { n: 'coconut milk', q: 400, u: 'ml' }, { n: 'spinach', q: 100, u: 'g', opt: true },
        { n: 'rice', q: 200, u: 'g', opt: true },
      ],
      steps: ['Soften the onion and garlic in oil, add the curry powder for 1 minute.',
        'Add rinsed lentils, tomatoes, coconut milk and 300 ml water. Simmer 20–25 minutes until thick.',
        'Stir in the spinach to wilt. Serve with rice.'],
      remix: 'Leftover dal makes a great wrap filling with cucumber and yogurt.',
    },
    {
      id: 'curry-wraps', name: 'Curry wraps with yogurt', time: 10, serves: 2, tags: ['leftover remix', 'quick'],
      ingredients: [
        { n: 'tortilla', q: 4, u: 'pcs' }, { n: 'leftover curry', q: 2, u: 'serving' }, { n: 'cucumber', q: 0.5, u: 'pcs', alt: ['lettuce', 'spinach'] },
        { n: 'yogurt', q: 4, u: 'tbsp' },
      ],
      steps: ['Reheat the curry until thick and piping hot.', 'Spoon onto warm tortillas with cucumber and yogurt, roll up.'],
    },
    {
      id: 'frittata', name: 'Potato & spinach frittata', time: 30, serves: 4, tags: ['eggs', 'vegetarian'],
      provides: ['leftover frittata'],
      ingredients: [
        { n: 'egg', q: 6, u: 'pcs' }, { n: 'potato', q: 300, u: 'g' }, { n: 'onion', q: 1, u: 'pcs' }, { n: 'spinach', q: 100, u: 'g', alt: ['kale', 'bell pepper', 'zucchini'] },
        { n: 'cheese', q: 80, u: 'g' },
      ],
      steps: ['Slice and boil the potatoes for 8 minutes; drain.', 'Fry the onion and potatoes in an ovenproof pan until golden, wilt in the spinach.',
        'Pour over the beaten eggs and cheese, cook 5 minutes, then finish under a hot grill until set.'],
      remix: 'Cold frittata is great in a lunchbox or a sandwich.',
    },
    {
      id: 'tuna-pasta', name: 'Tuna & sweetcorn pasta salad', time: 15, serves: 2, tags: ['pasta', 'quick', 'fish'],
      ingredients: [
        { n: 'pasta', q: 200, u: 'g', alt: ['cooked pasta'] }, { n: 'tuna', q: 1, u: 'pcs' }, { n: 'sweetcorn', q: 150, u: 'g' },
        { n: 'mayonnaise', q: 3, u: 'tbsp', alt: ['yogurt'] }, { n: 'spring onion', q: 1, u: 'pcs', opt: true }, { n: 'lemon', q: 0.5, u: 'pcs', opt: true },
      ],
      steps: ['Cook the pasta, rinse under cold water and drain well.', 'Mix with drained tuna, sweetcorn, mayonnaise and lemon.',
        'Season and scatter spring onion over.'],
    },
    {
      id: 'mushroom-toast', name: 'Garlic mushrooms on toast', time: 12, serves: 2, tags: ['quick', 'vegetarian'],
      ingredients: [
        { n: 'mushroom', q: 250, u: 'g' }, { n: 'bread', q: 2, u: 'pcs' }, { n: 'garlic', q: 2, u: 'pcs' }, { n: 'butter', q: 20, u: 'g' },
        { n: 'parsley', q: 1, u: 'tbsp', opt: true }, { n: 'cream', q: 50, u: 'ml', opt: true },
      ],
      steps: ['Fry sliced mushrooms in butter on high heat until golden.', 'Add garlic for 1 minute, then a splash of cream if you like.',
        'Pile onto hot toast and finish with parsley.'],
    },
    {
      id: 'scrambled-eggs', name: 'Creamy scrambled eggs on toast', time: 10, serves: 2, tags: ['breakfast', 'eggs', 'quick', 'vegetarian'],
      ingredients: [
        { n: 'egg', q: 4, u: 'pcs' }, { n: 'bread', q: 2, u: 'pcs' }, { n: 'butter', q: 15, u: 'g', alt: ['oil'] },
        { n: 'milk', q: 2, u: 'tbsp', opt: true, alt: ['cream'] }, { n: 'chives', q: 1, u: 'tbsp', opt: true, alt: ['spring onion'] },
      ],
      steps: ['Whisk the eggs with the milk and a pinch of salt.', 'Melt the butter in a pan over low heat, add the eggs and stir slowly until just set and still soft.',
        'Toast the bread, pile the eggs on top and finish with pepper and chives.'],
    },
    {
      id: 'porridge', name: 'Banana oat porridge', time: 10, serves: 2, tags: ['breakfast', 'quick', 'vegetarian'],
      ingredients: [
        { n: 'oat', q: 100, u: 'g' }, { n: 'milk', q: 400, u: 'ml', alt: ['water'] }, { n: 'banana', q: 1, u: 'pcs', alt: ['apple'] },
        { n: 'honey', q: 1, u: 'tbsp', opt: true }, { n: 'cinnamon', q: 0.5, u: 'tsp', opt: true },
      ],
      steps: ['Bring the oats and milk to a simmer with a pinch of salt, stirring.', 'Cook for 4–5 minutes until thick and creamy.',
        'Top with sliced banana, honey and cinnamon.'],
    },
    {
      id: 'yogurt-bowl', name: 'Yogurt bowl with fruit and oats', time: 5, serves: 1, tags: ['breakfast', 'quick', 'no cook', 'vegetarian'],
      ingredients: [
        { n: 'yogurt', q: 200, u: 'g' }, { n: 'banana', q: 1, u: 'pcs', alt: ['apple'] }, { n: 'oat', q: 30, u: 'g' }, { n: 'honey', q: 1, u: 'tbsp', opt: true },
      ],
      steps: ['Spoon the yogurt into a bowl.', 'Slice the fruit on top and scatter over the oats.', 'Drizzle with honey.'],
    },
    {
      id: 'french-toast', name: 'French toast', time: 15, serves: 2, tags: ['breakfast', 'sweet', 'vegetarian'],
      ingredients: [
        { n: 'bread', q: 4, u: 'pcs' }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'milk', q: 100, u: 'ml' }, { n: 'butter', q: 20, u: 'g', alt: ['oil'] },
        { n: 'cinnamon', q: 1, u: 'tsp', opt: true }, { n: 'honey', q: 2, u: 'tbsp', opt: true },
      ],
      steps: ['Whisk the eggs, milk and cinnamon in a shallow dish.', 'Soak each slice of bread for a few seconds on each side.',
        'Fry in butter for 2–3 minutes per side until golden. Serve with honey.'],
    },
    {
      id: 'breakfast-wraps', name: 'Breakfast egg wraps', time: 15, serves: 2, tags: ['breakfast', 'eggs', 'quick', 'vegetarian'],
      ingredients: [
        { n: 'tortilla', q: 2, u: 'pcs' }, { n: 'egg', q: 4, u: 'pcs' }, { n: 'cheese', q: 40, u: 'g' },
        { n: 'bell pepper', q: 1, u: 'pcs', alt: ['tomato', 'spinach', 'mushroom'] }, { n: 'spring onion', q: 1, u: 'pcs', opt: true, alt: ['onion'] },
      ],
      steps: ['Dice the pepper and fry it for 3 minutes.', 'Add the beaten eggs and scramble until just set.',
        'Spoon onto warm tortillas, top with cheese and spring onion, and roll up.'],
    },
  ],
  // Which meals each recipe suits: breakfast, lunch, dinner, late (a late-evening snack).
  // Used to put the right recipes first for the time of day on the user's device.
  MEALS: {
    aglio: ['dinner', 'late'], 'tomato-pasta': ['lunch', 'dinner'], 'pasta-bake': ['lunch', 'dinner'], omelette: ['breakfast', 'lunch', 'late'],
    'stir-fry': ['dinner'], 'fried-rice': ['lunch', 'dinner', 'late'], chili: ['dinner'], 'chili-potato': ['lunch', 'dinner'],
    'chili-wraps': ['lunch', 'late'], shakshuka: ['breakfast', 'lunch'], 'potato-soup': ['lunch', 'dinner'], 'greek-salad': ['lunch'],
    'tray-bake': ['dinner'], 'chicken-wraps': ['lunch'], quesadillas: ['lunch', 'late'], pancakes: ['breakfast'], risotto: ['dinner'],
    'rice-cakes': ['lunch', 'late'], dal: ['dinner'], 'curry-wraps': ['lunch'], frittata: ['breakfast', 'lunch'], 'tuna-pasta': ['lunch'],
    'mushroom-toast': ['breakfast', 'lunch', 'late'], 'scrambled-eggs': ['breakfast', 'late'], porridge: ['breakfast'],
    'yogurt-bowl': ['breakfast', 'late'], 'french-toast': ['breakfast'], 'breakfast-wraps': ['breakfast', 'lunch'],
  },
};
