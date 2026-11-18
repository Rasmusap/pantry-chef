// Bentes køkken — extra recipes, batch 1: breakfast, brunch and snacks. Original text written for this app.
(window.PC_EXTRA = window.PC_EXTRA || { recipes: [], words: {} });
window.PC_EXTRA.recipes.push(
  {
    id: 'cottage-cheese-scramble', name: 'Soft scrambled eggs with cottage cheese', time: 15, serves: 2,
    tags: ['breakfast', 'eggs', 'high protein', 'french', 'trending', 'quick', 'vegetarian'], meals: ['breakfast', 'late'],
    ingredients: [
      { n: 'egg', q: 4, u: 'pcs' }, { n: 'cottage cheese', q: 100, u: 'g' }, { n: 'butter', q: 15, u: 'g', alt: ['oil'] },
      { n: 'chives', q: 1, u: 'tbsp', opt: true, alt: ['spring onion'] }, { n: 'bread', q: 2, u: 'pcs', opt: true, alt: ['rye bread'] },
    ],
    steps: [
      'Whisk the eggs with a pinch of salt until smooth, then stir in the cottage cheese.',
      'Melt the butter in a small pan over low heat. Add the eggs and stir slowly and constantly with a spatula, scraping the bottom. This is the French way: low heat and patience make the eggs creamy instead of dry and lumpy.',
      'After 5–8 minutes, when the eggs are thick but still look a little wet, take the pan off the heat. They keep cooking for a moment on their own.',
      'Season with pepper, scatter over the chives and serve straight away, on toast if you like.',
    ],
    da: {
      name: 'Bløde røræg med hytteost',
      steps: [
        'Pisk æggene med en knivspids salt, til de er ensartede, og rør hytteosten i.',
        'Smelt smørret på en lille pande ved svag varme. Hæld æggene i, og rør langsomt og hele tiden med en spatel, så du skraber bunden med. Det er den franske metode: Svag varme og tålmodighed gør røræggene cremede i stedet for tørre og klumpede.',
        'Tag panden af varmen efter 5–8 minutter, når æggene er tykke, men stadig ser lidt våde ud. De trækker lidt videre af sig selv.',
        'Krydr med peber, drys purløg over, og server med det samme – gerne på ristet brød.',
      ],
    },
  },
  {
    id: 'banana-baked-oats', name: 'Banana baked oats', time: 30, serves: 2,
    tags: ['breakfast', 'sweet', 'oven', 'trending', 'vegetarian'], meals: ['breakfast'],
    ingredients: [
      { n: 'banana', q: 2, u: 'pcs' }, { n: 'oat', q: 100, u: 'g' }, { n: 'egg', q: 1, u: 'pcs' },
      { n: 'milk', q: 150, u: 'ml', alt: ['kefir'] }, { n: 'baking powder', q: 1, u: 'tsp' },
      { n: 'cinnamon', q: 1, u: 'tsp', opt: true }, { n: 'berry', q: 50, u: 'g', opt: true }, { n: 'honey', q: 1, u: 'tbsp', opt: true },
    ],
    steps: [
      'Heat the oven to 190 °C and grease a small ovenproof dish or two ramekins.',
      'Mash 1½ bananas in a bowl, then stir in the oats, egg, milk, baking powder, cinnamon and a pinch of salt. Let it stand for 5 minutes so the oats soften.',
      'Pour into the dish, press the berries in and lay slices of the last half banana on top.',
      'Bake for 20–25 minutes until risen, golden and just set in the middle. Drizzle with honey and eat warm.',
    ],
    remix: 'Leftover baked oats keep for 3 days in the fridge. Eat them cold, or warm them for 1 minute in the microwave.',
    da: {
      name: 'Bagt havregrød med banan',
      steps: [
        'Tænd ovnen på 190 °C, og smør et lille ovnfast fad eller to små forme.',
        'Mos 1½ banan i en skål, og rør havregryn, æg, mælk, bagepulver, kanel og en knivspids salt i. Lad dejen stå i 5 minutter, så havregrynene bliver bløde.',
        'Hæld dejen i fadet, tryk bærrene ned i den, og læg skiver af den sidste halve banan ovenpå.',
        'Bag i 20–25 minutter, til den bagte grød er hævet, gylden og netop fast i midten. Dryp med honning, og server lun.',
      ],
      remix: 'Rester af den bagte grød kan holde sig 3 dage i køleskabet. Spis dem kolde, eller lun dem 1 minut i mikroovnen.',
    },
  },
  {
    id: 'apple-overnight-oats', name: 'Apple and cinnamon overnight oats', time: 240, serves: 2,
    tags: ['breakfast', 'no cook', 'sweet', 'vegetarian'], meals: ['breakfast'],
    ingredients: [
      { n: 'oat', q: 80, u: 'g' }, { n: 'milk', q: 200, u: 'ml', alt: ['kefir'] }, { n: 'yogurt', q: 100, u: 'g', alt: ['skyr'] },
      { n: 'apple', q: 1, u: 'pcs' }, { n: 'cinnamon', q: 1, u: 'tsp' },
      { n: 'honey', q: 1, u: 'tbsp', opt: true }, { n: 'almond', q: 20, u: 'g', opt: true },
    ],
    steps: [
      'Grate half the apple coarsely, skin and all. Keep the other half for the morning.',
      'Stir the oats, milk, yogurt, cinnamon, grated apple and a pinch of salt together, and divide between two jars or bowls.',
      'Cover and leave in the fridge overnight, or for at least 4 hours, so the oats soak up the liquid and turn soft and creamy.',
      'In the morning, stir, loosen with a splash of milk if it is too thick, and top with the rest of the apple in small cubes, a little honey and chopped almonds.',
    ],
    da: {
      name: 'Overnight oats med æble og kanel',
      steps: [
        'Riv halvdelen af æblet groft med skrællen på. Gem den anden halvdel til om morgenen.',
        'Rør havregryn, mælk, yoghurt, kanel, revet æble og en knivspids salt sammen, og fordel blandingen i to glas eller skåle.',
        'Dæk til, og stil glassene i køleskabet natten over eller i mindst 4 timer, så havregrynene suger væden til sig og bliver bløde og cremede.',
        'Rør rundt om morgenen, og spæd op med lidt mælk, hvis grøden er for tyk. Top med resten af æblet i små tern, lidt honning og hakkede mandler.',
      ],
    },
  },
  {
    id: 'cottage-cheese-pancakes', name: 'Cottage cheese pancakes', time: 20, serves: 2,
    tags: ['breakfast', 'high protein', 'trending', 'sweet', 'vegetarian'], meals: ['breakfast'],
    ingredients: [
      { n: 'cottage cheese', q: 250, u: 'g' }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'flour', q: 60, u: 'g', alt: ['oat'] },
      { n: 'baking powder', q: 1, u: 'tsp' }, { n: 'butter', q: 15, u: 'g', alt: ['oil'] },
      { n: 'berry', q: 100, u: 'g', opt: true, alt: ['banana'] }, { n: 'honey', q: 1, u: 'tbsp', opt: true },
    ],
    steps: [
      'Blend the cottage cheese and eggs smooth with a stick blender (blend in the oats too, if you use them instead of flour). Without a blender, whisk hard for a slightly lumpier batter.',
      'Stir in the flour, baking powder and a pinch of salt until just combined. The batter should be thick.',
      'Melt a little butter in a pan over medium-low heat. Fry spoonfuls of batter for 2–3 minutes until golden underneath and set at the edges, then flip and fry for 1–2 minutes more.',
      'Keep the pancakes warm while you fry the rest, and serve with berries and honey.',
    ],
    da: {
      name: 'Pandekager med hytteost',
      steps: [
        'Blend hytteost og æg glat med en stavblender – blend også havregrynene med, hvis du bruger dem i stedet for mel. Uden blender kan du piske kraftigt, så bliver dejen lidt mere klumpet.',
        'Rør mel, bagepulver og en knivspids salt i, til dejen netop er samlet. Dejen skal være tyk.',
        'Smelt lidt smør på en pande ved middelsvag varme. Steg skefulde af dejen i 2–3 minutter, til undersiden er gylden og kanterne er stivnet. Vend pandekagerne, og steg dem 1–2 minutter mere.',
        'Hold pandekagerne lune, mens du steger resten, og server dem med bær og honning.',
      ],
    },
  },
  {
    id: 'egg-muffins', name: 'Vegetable egg muffins', time: 30, serves: 4,
    tags: ['breakfast', 'eggs', 'oven', 'batch cook', 'italian', 'high protein', 'vegetarian'], meals: ['breakfast', 'lunch'],
    provides: ['leftover frittata'],
    ingredients: [
      { n: 'egg', q: 8, u: 'pcs' }, { n: 'bell pepper', q: 1, u: 'pcs', alt: ['zucchini', 'tomato'] },
      { n: 'spinach', q: 60, u: 'g', alt: ['kale', 'broccoli'] }, { n: 'spring onion', q: 2, u: 'pcs', alt: ['onion'] },
      { n: 'cheese', q: 60, u: 'g', alt: ['feta cheese', 'parmesan cheese'] }, { n: 'milk', q: 50, u: 'ml', alt: ['cream'] },
      { n: 'oil', q: 1, u: 'tbsp' },
    ],
    steps: [
      'Heat the oven to 180 °C and brush a 12-hole muffin tin well with oil.',
      'Chop the pepper, spinach and spring onions small and soften them in a pan with a little oil for 3–4 minutes. Cooking them first drives off their water, so the muffins do not turn soggy.',
      'Whisk the eggs with the milk, ½ tsp salt and some pepper. Divide the vegetables and most of the cheese between the holes and pour the egg over until each is about three-quarters full.',
      'Scatter over the rest of the cheese and bake for 18–20 minutes until puffed and just firm in the middle. Like an Italian frittata, they set gently in the heat of the oven instead of on a hot pan, so they stay tender.',
      'Let them cool for 5 minutes before easing them out with a knife.',
    ],
    remix: 'The muffins keep for 4 days in the fridge. Warm them for 30 seconds in the microwave, or tuck one into a wrap with salad for lunch.',
    da: {
      name: 'Æggemuffins med grøntsager',
      steps: [
        'Tænd ovnen på 180 °C, og pensl en muffinform med 12 huller godt med olie.',
        'Hak peberfrugt, spinat og forårsløg fint, og svits grøntsagerne med lidt olie på en pande i 3–4 minutter. Når grøntsagerne svitses først, damper vandet af, så muffinsene ikke bliver vandede.',
        'Pisk æggene med mælk, ½ tsk salt og lidt peber. Fordel grøntsagerne og det meste af osten i hullerne, og hæld æggemassen over, så hvert hul er fyldt ca. tre fjerdedele op.',
        'Drys resten af osten over, og bag muffinsene i 18–20 minutter, til de er hævede og netop faste i midten. Ligesom en italiensk frittata stivner de nænsomt i ovnens varme i stedet for på en hed pande, så de holder sig møre.',
        'Lad muffinsene køle af i 5 minutter, før du lirker dem ud med en kniv.',
      ],
      remix: 'Muffinsene kan holde sig 4 dage i køleskabet. Lun dem 30 sekunder i mikroovnen, eller kom én i en wrap med salat til frokost.',
    },
  },
  {
    id: 'avocado-toast-jammy-egg', name: 'Avocado toast with a soy-marinated egg', time: 30, serves: 2,
    tags: ['breakfast', 'eggs', 'japanese', 'trending', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'egg', q: 2, u: 'pcs' }, { n: 'soy sauce', q: 3, u: 'tbsp' }, { n: 'honey', q: 1, u: 'tsp', alt: ['sugar'] },
      { n: 'avocado', q: 1, u: 'pcs' }, { n: 'bread', q: 2, u: 'pcs', alt: ['rye bread'] }, { n: 'lemon', q: 0.5, u: 'pcs', alt: ['lime'] },
      { n: 'chili flake', q: 0.25, u: 'tsp', opt: true }, { n: 'sesame seed', q: 1, u: 'tsp', opt: true },
      { n: 'spring onion', q: 1, u: 'pcs', opt: true, alt: ['chives'] },
    ],
    steps: [
      'Lower the eggs into boiling water and cook for exactly 6½ minutes, then move them straight into cold water so the yolks stay soft and jammy.',
      'Peel the eggs. Mix the soy sauce, honey and 3 tbsp water in a small bowl or bag and add the eggs. This is a quick Japanese ajitama: the eggs soak up salty-sweet flavour and colour. Leave for at least 15 minutes, turning now and then, or overnight in the fridge.',
      'Toast the bread. Mash the avocado with lemon juice and a pinch of salt and spread it thickly on the toast.',
      'Halve the eggs, lay them on top and spoon over a little of the marinade. Finish with chili flakes, sesame seeds and spring onion.',
    ],
    da: {
      name: 'Avocadotoast med sojamarineret æg',
      steps: [
        'Læg æggene i kogende vand, og kog dem i præcis 6½ minut. Kom dem straks i koldt vand, så blommerne forbliver bløde og cremede.',
        'Pil æggene. Bland sojasauce, honning og 3 spsk vand i en lille skål eller pose, og læg æggene i. Det er en hurtig udgave af japansk ajitama: Æggene suger den salte, søde smag og farven til sig. Lad dem trække i mindst 15 minutter, og vend dem af og til – eller natten over i køleskabet.',
        'Rist brødet. Mos avocadoen med citronsaft og en knivspids salt, og smør et tykt lag på brødet.',
        'Halver æggene, læg dem ovenpå, og hæld lidt af marinaden over. Drys chiliflager, sesamfrø og forårsløg over.',
      ],
    },
  },
  {
    id: 'kefir-smoothie-bowl', name: 'Kefir and banana smoothie bowl', time: 5, serves: 2,
    tags: ['breakfast', 'no cook', 'quick', 'trending', 'bowl', 'sweet', 'vegetarian'], meals: ['breakfast'],
    ingredients: [
      { n: 'kefir', q: 300, u: 'ml', alt: ['yogurt', 'skyr'] }, { n: 'banana', q: 2, u: 'pcs' }, { n: 'berry', q: 150, u: 'g' },
      { n: 'oat', q: 30, u: 'g' }, { n: 'almond', q: 20, u: 'g', opt: true }, { n: 'honey', q: 1, u: 'tsp', opt: true },
    ],
    steps: [
      'Slice the bananas. Frozen banana and frozen berries make the bowl thick and cold, so use them straight from the freezer if you have them.',
      'Blend the kefir, most of the banana, 100 g of the berries and 2 tbsp of the oats until thick and smooth. Add a splash more kefir only if the blender gets stuck.',
      'Pour into two bowls and top with the rest of the banana, berries and oats, the chopped almonds and a drizzle of honey.',
    ],
    da: {
      name: 'Smoothiebowl med kefir og banan',
      steps: [
        'Skær bananerne i skiver. Frosne bananer og frosne bær gør bowlen tyk og kold, så brug dem direkte fra fryseren, hvis du har dem.',
        'Blend kefir, det meste af bananen, 100 g af bærrene og 2 spsk af havregrynene til en tyk og glat smoothie. Tilsæt kun lidt mere kefir, hvis blenderen går i stå.',
        'Hæld smoothien i to skåle, og top med resten af banan, bær og havregryn, de hakkede mandler og en stribe honning.',
      ],
    },
  },
  {
    id: 'potato-breakfast-burrito', name: 'Breakfast burrito with crispy potato and egg', time: 35, serves: 2,
    tags: ['breakfast', 'eggs', 'potato', 'beans', 'high protein', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'potato', q: 300, u: 'g', alt: ['cooked potato', 'sweet potato'] }, { n: 'egg', q: 4, u: 'pcs' },
      { n: 'black bean', q: 200, u: 'g', alt: ['kidney bean', 'bean'] }, { n: 'tortilla', q: 2, u: 'pcs' },
      { n: 'cheese', q: 50, u: 'g', alt: ['cheddar cheese'] }, { n: 'paprika', q: 1, u: 'tsp', alt: ['cumin', 'chili powder'] },
      { n: 'oil', q: 2, u: 'tbsp' }, { n: 'sour cream', q: 2, u: 'tbsp', opt: true, alt: ['yogurt'] },
      { n: 'spring onion', q: 2, u: 'pcs', opt: true }, { n: 'sriracha', q: 1, u: 'tsp', opt: true, alt: ['chili flake'] },
    ],
    steps: [
      'Cut the potatoes into 1 cm cubes. Fry them in the oil in a large pan over medium heat for 15–18 minutes, turning now and then, until crisp and tender (leftover cooked potatoes need only 8 minutes). Season with salt and the paprika at the end.',
      'Push the potatoes to one side, add the drained beans and warm them through for 2 minutes, then tip it all into a bowl.',
      'Whisk the eggs with a pinch of salt and scramble them softly in the same pan over low heat.',
      'Warm the tortillas in a dry pan or for 20 seconds in the microwave. Fill the middle with potatoes, beans, egg and cheese, add sour cream, spring onion and hot sauce, fold in the sides and roll up tightly.',
      'For a crisp outside, put the burritos seam-side down in the hot pan for 1–2 minutes on each side.',
    ],
    da: {
      name: 'Morgenmadsburrito med sprøde kartofler og æg',
      steps: [
        'Skær kartoflerne i tern på 1 cm. Steg dem i olien på en stor pande ved middel varme i 15–18 minutter, og vend dem af og til, til de er sprøde og møre (kogte kartoffelrester skal kun have 8 minutter). Krydr med salt og paprika til sidst.',
        'Skub kartoflerne til side, tilsæt de afdryppede bønner, og varm dem igennem i 2 minutter. Hæld det hele over i en skål.',
        'Pisk æggene med en knivspids salt, og rør dem til bløde røræg på samme pande ved svag varme.',
        'Lun tortillaerne på en tør pande eller 20 sekunder i mikroovnen. Fordel kartofler, bønner, æg og ost midt på, tilsæt creme fraiche, forårsløg og chilisauce, fold siderne ind, og rul tortillaerne stramt sammen.',
        'Vil du have en sprød skal, så læg burritoerne med samlingen nedad på den varme pande i 1–2 minutter på hver side.',
      ],
    },
  },
  {
    id: 'turkish-eggs', name: 'Turkish eggs with garlic yogurt', time: 15, serves: 2,
    tags: ['breakfast', 'eggs', 'trending', 'quick', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'egg', q: 4, u: 'pcs' }, { n: 'yogurt', q: 250, u: 'g', alt: ['skyr'] }, { n: 'garlic', q: 1, u: 'pcs' },
      { n: 'butter', q: 30, u: 'g' }, { n: 'chili flake', q: 1, u: 'tsp', alt: ['paprika'] }, { n: 'vinegar', q: 1, u: 'tbsp' },
      { n: 'dill', q: 1, u: 'tbsp', opt: true, alt: ['parsley'] }, { n: 'bread', q: 2, u: 'pcs', opt: true },
    ],
    steps: [
      'Take the yogurt out of the fridge, grate in the garlic, add a pinch of salt and stir. Spread it in two shallow bowls; yogurt at room temperature keeps the eggs warm.',
      'Bring a wide pan of water to a gentle simmer with the vinegar. Crack each egg into a cup, stir the water into a slow swirl and slide in one or two eggs at a time. Poach for 3 minutes until the whites are set and the yolks soft, then lift out with a slotted spoon.',
      'Melt the butter in a small pan until it foams and smells nutty, then take it off the heat and stir in the chili flakes.',
      'Set the eggs on the yogurt, spoon over the red chili butter, scatter with dill and serve with bread for dipping.',
    ],
    da: {
      name: 'Tyrkiske æg med hvidløgsyoghurt',
      steps: [
        'Tag yoghurten ud af køleskabet, riv hvidløget i, tilsæt en knivspids salt, og rør rundt. Fordel yoghurten i to dybe tallerkener – yoghurt ved stuetemperatur holder æggene varme.',
        'Bring vand og eddike i let kog i en bred gryde. Slå hvert æg ud i en kop, rør vandet rundt i en langsom hvirvel, og lad et eller to æg glide i ad gangen. Pochér dem i 3 minutter, til hviderne er stivnet og blommerne stadig er bløde, og løft dem op med en hulske.',
        'Smelt smørret i en lille gryde, til det skummer og dufter nøddeagtigt. Tag gryden af varmen, og rør chiliflagerne i.',
        'Læg æggene på yoghurten, hæld det røde chilismør over, drys med dild, og server med brød til at dyppe i.',
      ],
    },
  },
  {
    id: 'green-shakshuka', name: 'Green shakshuka with spinach and feta', time: 25, serves: 2,
    tags: ['breakfast', 'eggs', 'one pot', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'egg', q: 4, u: 'pcs' }, { n: 'spinach', q: 200, u: 'g', alt: ['kale'] }, { n: 'leek', q: 1, u: 'pcs', alt: ['onion', 'spring onion'] },
      { n: 'garlic', q: 2, u: 'pcs' }, { n: 'cumin', q: 1, u: 'tsp' }, { n: 'feta cheese', q: 80, u: 'g', alt: ['yogurt'] },
      { n: 'olive oil', q: 1, u: 'tbsp' }, { n: 'butter', q: 15, u: 'g', alt: ['oil'] },
      { n: 'lemon', q: 0.5, u: 'pcs', opt: true }, { n: 'chili flake', q: 0.5, u: 'tsp', opt: true }, { n: 'bread', q: 2, u: 'pcs', opt: true },
    ],
    steps: [
      'Halve the leek lengthwise, rinse out any grit and slice it thinly. Soften it in the oil and butter in a wide pan with a lid over medium-low heat for 8 minutes.',
      'Add the sliced garlic and cumin for 1 minute, then add the spinach a handful at a time until it wilts. Add 3–4 tbsp water, season and simmer for 2 minutes.',
      'Make 4 hollows with a spoon, crack an egg into each and crumble the feta around them. Cover and cook over low heat for 5–7 minutes until the whites are set and the yolks still soft.',
      'Squeeze over a little lemon, scatter with chili flakes and eat straight from the pan with bread.',
    ],
    da: {
      name: 'Grøn shakshuka med spinat og feta',
      steps: [
        'Halver porren på langs, skyl eventuel jord ud, og snit den fint. Svits porren i olie og smør på en bred pande med låg ved middelsvag varme i 8 minutter.',
        'Tilsæt hvidløg i skiver og spidskommen, og svits i 1 minut. Kom spinaten på panden en håndfuld ad gangen, til spinaten falder sammen. Tilsæt 3–4 spsk vand, smag til med salt og peber, og lad det hele simre i 2 minutter.',
        'Lav 4 fordybninger med en ske, slå et æg ud i hver, og smuldr fetaen ud omkring æggene. Læg låg på, og lad æggene trække ved svag varme i 5–7 minutter, til hviderne er stivnet og blommerne stadig er bløde.',
        'Pres lidt citron over, drys med chiliflager, og spis direkte fra panden med brød.',
      ],
    },
  },
  {
    id: 'aeggekage', name: 'Danish egg cake with bacon, tomato and chives', time: 25, serves: 2,
    tags: ['danish classic', 'eggs', 'pork', 'breakfast'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'egg', q: 6, u: 'pcs' }, { n: 'milk', q: 100, u: 'ml', alt: ['cream'] }, { n: 'flour', q: 1, u: 'tbsp' },
      { n: 'bacon', q: 150, u: 'g', alt: ['ham', 'sausage'] }, { n: 'tomato', q: 2, u: 'pcs' },
      { n: 'chives', q: 3, u: 'tbsp', alt: ['spring onion'] }, { n: 'butter', q: 10, u: 'g' },
      { n: 'rye bread', q: 2, u: 'pcs', opt: true }, { n: 'mustard', q: 1, u: 'tbsp', opt: true },
    ],
    steps: [
      'Fry the bacon in a large pan until crisp, lift it onto kitchen paper and pour off most of the fat, leaving a thin layer.',
      'Whisk the eggs with the milk, flour, ½ tsp salt and some pepper until no lumps of flour are left.',
      'Add the butter to the pan over low heat, pour in the eggs and cover with a lid. Cook for 10–12 minutes without stirring, until set on top but still soft and juicy. Gently lift the edge now and then to check the bottom is not burning.',
      'Lay the bacon and tomato wedges on top, scatter generously with chives and serve from the pan with rye bread and mustard.',
    ],
    da: {
      name: 'Æggekage med bacon, tomat og purløg',
      steps: [
        'Steg baconen sprød på en stor pande, læg den på køkkenrulle, og hæld det meste af fedtet fra, så der kun er et tyndt lag tilbage.',
        'Pisk æggene med mælk, mel, ½ tsk salt og lidt peber, til der ikke er klumper af mel.',
        'Kom smørret på panden ved svag varme, hæld æggemassen i, og læg låg på. Lad æggekagen stivne i 10–12 minutter uden omrøring, til den er fast i overfladen, men stadig blød og saftig. Løft forsigtigt i kanten en gang imellem, og tjek, at bunden ikke brænder på.',
        'Læg bacon og tomatbåde ovenpå, drys rigeligt med purløg, og server æggekagen direkte fra panden med rugbrød og sennep.',
      ],
    },
  },
  {
    id: 'smorrebrod-egg-shrimp', name: 'Open rye sandwich with egg and shrimp', time: 20, serves: 2,
    tags: ['danish classic', 'eggs', 'fish', 'quick'], meals: ['lunch'],
    ingredients: [
      { n: 'rye bread', q: 4, u: 'pcs' }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'shrimp', q: 150, u: 'g' },
      { n: 'mayonnaise', q: 3, u: 'tbsp' }, { n: 'dill', q: 1, u: 'tbsp' }, { n: 'lemon', q: 0.5, u: 'pcs' },
      { n: 'butter', q: 15, u: 'g', opt: true }, { n: 'lettuce', q: 0.25, u: 'pcs', opt: true, alt: ['cucumber'] },
    ],
    steps: [
      'Boil the eggs for 9 minutes, cool them in cold water and peel. Rinse the shrimp, drain them well and pat them dry, so the bread does not go soggy.',
      'Butter the rye bread thinly right to the edges and lay a lettuce leaf on each slice.',
      'Slice the eggs and lay the slices overlapping on the bread. Pile the shrimp on top.',
      'Finish each one with a spoonful of mayonnaise, a small sprig of dill and a thin, twisted slice of lemon, and grind over a little pepper.',
    ],
    da: {
      name: 'Smørrebrød med æg og rejer',
      steps: [
        'Kog æggene i 9 minutter, køl dem af i koldt vand, og pil dem. Skyl rejerne, lad dem dryppe godt af, og dup dem tørre, så rugbrødet ikke bliver blødt.',
        'Smør rugbrødet tyndt med smør helt ud til kanten, og læg et salatblad på hver skive.',
        'Skær æggene i skiver, og læg skiverne taglagt på brødet. Læg rejerne ovenpå i en lille bunke.',
        'Top hvert stykke med en klat mayonnaise, en lille dildkvist og en tynd, snoet citronskive, og kværn lidt peber over.',
      ],
    },
  },
  {
    id: 'croque-monsieur', name: 'Croque monsieur', time: 25, serves: 2,
    tags: ['french', 'oven', 'pork'], meals: ['lunch', 'late'],
    ingredients: [
      { n: 'bread', q: 4, u: 'pcs' }, { n: 'ham', q: 100, u: 'g' }, { n: 'cheese', q: 100, u: 'g', alt: ['gouda cheese', 'cheddar cheese'] },
      { n: 'butter', q: 25, u: 'g' }, { n: 'flour', q: 15, u: 'g' }, { n: 'milk', q: 150, u: 'ml' },
      { n: 'mustard', q: 1, u: 'tsp', opt: true },
    ],
    steps: [
      'Heat the oven to 220 °C, or use the grill setting. Line a baking tray with baking paper.',
      'Make a quick béchamel: melt 15 g butter in a small pan, stir in the flour and cook for 1 minute. This is a roux, and cooking it takes away the raw flour taste. Whisk in the milk a little at a time so no lumps form, and simmer for 2–3 minutes until thick. Season and stir in a third of the cheese.',
      'Butter one side of two slices of bread and lay them butter-side down on the tray. Spread with mustard, add the ham and half of the remaining cheese, and close with the other two slices.',
      'Spread the rest of the béchamel over the tops, scatter with the last of the cheese and bake for 10–12 minutes until bubbling and golden in patches.',
    ],
    da: {
      name: 'Croque monsieur',
      steps: [
        'Tænd ovnen på 220 °C, eller brug grillfunktionen. Læg bagepapir på en bageplade.',
        'Lav en hurtig béchamel: Smelt 15 g smør i en lille gryde, rør melet i, og svits opbagningen i 1 minut, så smagen af råt mel forsvinder. Spæd op med mælken lidt ad gangen under piskning, så der ikke kommer klumper, og lad saucen simre i 2–3 minutter, til den er tyk. Smag til, og rør en tredjedel af osten i.',
        'Smør den ene side af to brødskiver, og læg dem med smørsiden nedad på pladen. Smør dem med sennep, læg skinken og halvdelen af den resterende ost på, og læg de to andre skiver ovenpå.',
        'Fordel resten af béchamelsaucen over toppen, drys resten af osten over, og bag i 10–12 minutter, til osten bobler og er gylden i pletter.',
      ],
    },
  },
  {
    id: 'hot-honey-halloumi-toast', name: 'Halloumi toast with hot honey', time: 15, serves: 2,
    tags: ['trending', 'quick', 'spicy', 'vegetarian', 'breakfast'], meals: ['breakfast', 'lunch', 'late'],
    ingredients: [
      { n: 'halloumi', q: 200, u: 'g' }, { n: 'bread', q: 2, u: 'pcs', alt: ['rye bread'] }, { n: 'honey', q: 2, u: 'tbsp' },
      { n: 'chili flake', q: 0.5, u: 'tsp', alt: ['chili'] }, { n: 'olive oil', q: 1, u: 'tbsp' },
      { n: 'vinegar', q: 1, u: 'tsp', opt: true, alt: ['lemon'] }, { n: 'tomato', q: 1, u: 'pcs', opt: true, alt: ['avocado', 'cucumber'] },
    ],
    steps: [
      'Make the hot honey: warm the honey and chili flakes in a small pan for 1 minute without letting it boil, take it off the heat and stir in the vinegar. Leave it to infuse while you cook.',
      'Cut the halloumi into 1 cm slices and pat dry. Fry them in a dry or lightly oiled pan over medium-high heat for 1–2 minutes on each side until deep golden.',
      'Toast the bread, drizzle with olive oil and lay sliced tomato on top with a pinch of salt.',
      'Lay the hot halloumi on top and spoon over the hot honey. Eat at once, while the cheese is soft.',
    ],
    da: {
      name: 'Toast med halloumi og chilihonning',
      steps: [
        'Lav chilihonningen: Varm honning og chiliflager i en lille gryde i 1 minut uden at lade honningen koge, tag gryden af varmen, og rør eddiken i. Lad honningen trække, mens du steger osten.',
        'Skær halloumien i skiver på 1 cm, og dup dem tørre. Steg skiverne på en tør eller let olieret pande ved god varme i 1–2 minutter på hver side, til de er dybt gyldne.',
        'Rist brødet, dryp med olivenolie, og læg tomatskiver ovenpå med en knivspids salt.',
        'Læg den varme halloumi ovenpå, og hæld chilihonningen over. Spis med det samme, mens osten er blød.',
      ],
    },
  },
  {
    id: 'whipped-feta-dip', name: 'Whipped feta dip with honey', time: 10, serves: 4,
    tags: ['snack', 'trending', 'quick', 'no cook', 'vegetarian'], meals: ['lunch', 'late'],
    ingredients: [
      { n: 'feta cheese', q: 200, u: 'g' }, { n: 'yogurt', q: 150, u: 'g', alt: ['cream cheese', 'skyr'] },
      { n: 'olive oil', q: 3, u: 'tbsp' }, { n: 'lemon', q: 0.5, u: 'pcs' }, { n: 'honey', q: 1, u: 'tbsp' },
      { n: 'garlic', q: 1, u: 'pcs', opt: true }, { n: 'chili flake', q: 0.25, u: 'tsp', opt: true },
      { n: 'cucumber', q: 1, u: 'pcs', alt: ['carrot', 'bell pepper'] }, { n: 'bread', q: 4, u: 'pcs', opt: true, alt: ['cracker'] },
    ],
    steps: [
      'Crumble the feta into a food processor or tall beaker with the yogurt, 2 tbsp olive oil, a squeeze of lemon and the garlic.',
      'Blend for 2–3 minutes, scraping down the sides, until completely smooth and light. Taste: feta is salty, so you rarely need more salt; add a little more lemon instead.',
      'Spread the dip in a shallow bowl with the back of a spoon, making swirls. Drizzle with the honey and the last olive oil, and scatter over chili flakes and pepper.',
      'Cut the cucumber into sticks and serve them with the dip, alongside toasted bread or crackers.',
    ],
    remix: 'Leftover whipped feta keeps for 4 days in the fridge and makes a good spread in wraps or under roasted vegetables.',
    da: {
      name: 'Pisket feta med honning',
      steps: [
        'Smuldr fetaen ned i en foodprocessor eller et højt bæger, og tilsæt yoghurt, 2 spsk olivenolie, et skvæt citronsaft og hvidløget.',
        'Blend i 2–3 minutter, og skrab ned fra siderne undervejs, til dippen er helt glat og luftig. Smag til – fetaen er salt, så du får sjældent brug for mere salt. Tilsæt hellere lidt mere citron.',
        'Smør dippen ud i en flad skål med bagsiden af en ske, så der bliver fine hvirvler. Dryp med honning og resten af olivenolien, og drys chiliflager og peber over.',
        'Skær agurken i stave, og server dem til dippen sammen med ristet brød eller knækbrød.',
      ],
      remix: 'Rester af pisket feta kan holde sig 4 dage i køleskabet og er gode at smøre i wraps eller under ovnbagte grøntsager.',
    },
  },
  {
    id: 'snack-plate', name: 'Snack plate with cheese, fruit and crackers', time: 10, serves: 2,
    tags: ['snack', 'no cook', 'trending', 'quick', 'vegetarian'], meals: ['lunch', 'late'],
    ingredients: [
      { n: 'cheese', q: 100, u: 'g', alt: ['cheddar cheese', 'gouda cheese', 'feta cheese'] },
      { n: 'cracker', q: 6, u: 'pcs', alt: ['bread', 'rye bread'] }, { n: 'cucumber', q: 0.5, u: 'pcs', alt: ['carrot', 'bell pepper'] },
      { n: 'apple', q: 1, u: 'pcs', alt: ['berry'] }, { n: 'olive', q: 50, u: 'g' },
      { n: 'almond', q: 30, u: 'g', opt: true }, { n: 'tomato', q: 2, u: 'pcs', opt: true },
      { n: 'ham', q: 50, u: 'g', opt: true }, { n: 'honey', q: 1, u: 'tbsp', opt: true },
    ],
    steps: [
      'Pick a board or a large plate. Cut the cheese into slices or cubes; a mix of shapes is easier to grab and looks more inviting.',
      'Cut the cucumber into sticks or rounds and the apple into thin wedges. Cut the apple last so it does not have time to brown.',
      'Lay out the bigger things first (cheese, crackers and ham) in small piles around the plate, then fill the gaps with cucumber, apple, tomatoes, olives and almonds.',
      'Put a small bowl of honey or a dip on the side if you have one, and serve straight away.',
    ],
    da: {
      name: 'Snackplatte med ost, frugt og knækbrød',
      steps: [
        'Find et bræt eller et stort fad. Skær osten i skiver eller tern – forskellige former er nemmere at tage og ser mere indbydende ud.',
        'Skær agurken i stave eller skiver og æblet i tynde både. Skær æblet til sidst, så æblebådene ikke når at blive brune.',
        'Læg de største ting først – ost, knækbrød og skinke – i små bunker rundt på fadet, og fyld hullerne ud med agurk, æble, tomater, oliven og mandler.',
        'Sæt en lille skål honning eller dip ved siden af, hvis du har det, og server med det samme.',
      ],
    },
  },
  {
    id: 'hummus', name: 'Homemade hummus', time: 15, serves: 4,
    tags: ['vegan', 'snack', 'beans', 'no cook', 'quick'], meals: ['lunch', 'late'],
    ingredients: [
      { n: 'chickpea', q: 240, u: 'g' }, { n: 'tahini', q: 3, u: 'tbsp' }, { n: 'lemon', q: 1, u: 'pcs' },
      { n: 'garlic', q: 1, u: 'pcs' }, { n: 'olive oil', q: 2, u: 'tbsp' }, { n: 'cumin', q: 0.5, u: 'tsp', opt: true },
      { n: 'paprika', q: 0.25, u: 'tsp', opt: true }, { n: 'carrot', q: 2, u: 'pcs', opt: true, alt: ['cucumber', 'bell pepper'] },
    ],
    steps: [
      'Drain the chickpeas and keep 4 tbsp of the liquid from the can. For extra-smooth hummus, rub off the loose skins in a bowl of water; it takes 5 minutes and is worth it.',
      'Blend the tahini, lemon juice, garlic and ½ tsp salt for 1 minute until pale and thick. Mixing the tahini with the lemon before the chickpeas go in makes the hummus creamier.',
      'Add the chickpeas and cumin and blend for 3–4 minutes, adding the chickpea liquid a spoonful at a time, until very smooth and soft. Taste for salt and lemon.',
      'Spread in a bowl, make a well with the spoon and fill it with olive oil and a pinch of paprika. Serve with carrot sticks or bread.',
    ],
    remix: 'Hummus keeps for 5 days in the fridge. Spread it in wraps, put it under a fried egg, or thin it with water and lemon as a salad dressing.',
    da: {
      name: 'Hjemmelavet hummus',
      steps: [
        'Hæld kikærterne i en si, og gem 4 spsk af væden fra dåsen. Vil du have helt glat hummus, så gnid de løse skind af kikærterne i en skål vand – det tager 5 minutter og er besværet værd.',
        'Blend tahin, citronsaft, hvidløg og ½ tsk salt i 1 minut, til blandingen er lys og tyk. Når tahinen blendes med citronen, før kikærterne kommer i, bliver hummussen mere cremet.',
        'Tilsæt kikærter og spidskommen, og blend i 3–4 minutter, mens du tilsætter kikærtevæden en skefuld ad gangen, til hummussen er helt glat og blød. Smag til med salt og citron.',
        'Smør hummussen ud i en skål, lav en fordybning med skeen, og fyld fordybningen med olivenolie og en knivspids paprika. Server med gulerodsstave eller brød.',
      ],
      remix: 'Hummus kan holde 5 dage i køleskabet. Brug resterne i wraps eller under et spejlæg, eller spæd hummussen op med vand og citron til en salatdressing.',
    },
  },
  {
    id: 'crispy-chickpeas', name: 'Crispy spiced chickpeas', time: 35, serves: 2,
    tags: ['snack', 'vegan', 'air fryer', 'oven', 'beans'], meals: ['late'],
    ingredients: [
      { n: 'chickpea', q: 240, u: 'g' }, { n: 'olive oil', q: 1, u: 'tbsp', alt: ['oil'] },
      { n: 'paprika', q: 1, u: 'tsp', alt: ['curry powder', 'chili powder'] }, { n: 'cumin', q: 0.5, u: 'tsp', alt: ['garam masala'] },
    ],
    steps: [
      'Heat the oven to 200 °C (or the air fryer to 190 °C). Drain and rinse the chickpeas.',
      'Dry them very well: roll them in a clean tea towel and pick off any loose skins. Dry chickpeas turn crisp; wet ones steam and stay soft.',
      'Toss with the oil and a good pinch of salt, spread out on a baking tray in one layer and roast for 25–30 minutes until golden and crunchy, shaking the tray halfway (air fryer: 12–15 minutes, shaking the basket twice).',
      'Toss the hot chickpeas with the spices straight away so they stick. Let them cool for 5 minutes; they crisp up more as they cool. Eat them the same day.',
    ],
    da: {
      name: 'Sprøde kikærter med krydderier',
      steps: [
        'Tænd ovnen på 200 °C (eller airfryeren på 190 °C). Hæld kikærterne i en si, og skyl dem.',
        'Tør kikærterne grundigt: Rul dem i et rent viskestykke, og pil de løse skind af. Tørre kikærter bliver sprøde, mens våde kikærter damper og forbliver bløde.',
        'Vend kikærterne med olien og en god knivspids salt, fordel dem i et enkelt lag på en bageplade, og rist dem i ovnen i 25–30 minutter, til de er gyldne og sprøde. Ryst pladen halvvejs (i airfryeren: 12–15 minutter, og ryst kurven to gange).',
        'Vend de varme kikærter i krydderierne med det samme, så krydderierne hænger fast. Lad kikærterne køle af i 5 minutter – de bliver sprødere, når de køler af. Spis dem samme dag.',
      ],
    },
  },
  {
    id: 'banana-bread', name: 'Banana bread', time: 75, serves: 10,
    tags: ['baking', 'sweet', 'oven', 'vegetarian'], meals: ['breakfast', 'late'],
    ingredients: [
      { n: 'banana', q: 3, u: 'pcs' }, { n: 'flour', q: 200, u: 'g' }, { n: 'sugar', q: 100, u: 'g' },
      { n: 'butter', q: 75, u: 'g', alt: ['oil'] }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'baking powder', q: 2, u: 'tsp' },
      { n: 'cinnamon', q: 1, u: 'tsp', opt: true }, { n: 'vanilla', q: 1, u: 'tsp', opt: true }, { n: 'almond', q: 50, u: 'g', opt: true },
    ],
    steps: [
      'Heat the oven to 175 °C and line a 1.5-litre (about 25 cm) loaf tin with baking paper. Melt the butter and let it cool a little.',
      'Mash the very ripe bananas well in a large bowl. Whisk in the sugar, eggs, melted butter and vanilla.',
      'Mix the flour, baking powder, cinnamon and a pinch of salt in another bowl, then fold it into the banana mix with a spatula until no dry flour is left. Stop there: overmixing makes the bread tough. Fold in the chopped almonds.',
      'Scrape the batter into the tin and bake for 50–60 minutes, until a skewer pushed into the middle comes out clean. Cover with foil if the top browns too fast.',
      'Cool in the tin for 10 minutes, then on a rack. Wrapped, it keeps for 3 days.',
    ],
    remix: 'Day-old banana bread is lovely toasted in a dry pan with butter, or used instead of bread for French toast.',
    da: {
      name: 'Bananbrød',
      steps: [
        'Tænd ovnen på 175 °C, og beklæd en franskbrødsform på 1,5 liter (ca. 25 cm) med bagepapir. Smelt smørret, og lad det køle lidt af.',
        'Mos de meget modne bananer godt i en stor skål. Pisk sukker, æg, det smeltede smør og vanilje i.',
        'Bland mel, bagepulver, kanel og en knivspids salt i en anden skål, og vend melblandingen i bananmassen med en dejskraber, til der netop ikke er mere tørt mel. Stop der – rører du for meget, bliver brødet sejt. Vend til sidst de hakkede mandler i.',
        'Hæld dejen i formen, og bag brødet i 50–60 minutter, til et grillspyd, der stikkes ind midt i brødet, kommer tørt ud. Læg et stykke stanniol over, hvis overfladen bliver for mørk.',
        'Lad brødet køle af i formen i 10 minutter og derefter på en bagerist. Pakket ind kan bananbrødet holde sig 3 dage.',
      ],
      remix: 'Bananbrød fra i går er dejligt ristet på en tør pande med smør eller brugt i stedet for brød til arme riddere.',
    },
  },
  {
    id: 'risengrod', name: 'Danish rice pudding (risengrød)', time: 60, serves: 4,
    tags: ['danish classic', 'sweet', 'rice', 'vegetarian'], meals: ['breakfast', 'dinner'],
    provides: ['leftover rice pudding'],
    ingredients: [
      { n: 'rice', q: 200, u: 'g' }, { n: 'milk', q: 1000, u: 'ml' }, { n: 'water', q: 150, u: 'ml' },
      { n: 'butter', q: 20, u: 'g' }, { n: 'sugar', q: 2, u: 'tbsp' }, { n: 'cinnamon', q: 2, u: 'tsp' },
      { n: 'vanilla', q: 1, u: 'tsp', opt: true },
    ],
    steps: [
      'Use short, round pudding rice. Bring the rice and water to the boil in a heavy pot and cook for 2 minutes, stirring, until the water is almost gone.',
      'Add the milk (and vanilla) and bring it to the boil while stirring, so the milk does not catch on the bottom.',
      'Turn the heat right down, cover and let the pudding barely simmer for 40–45 minutes. Stir well every 5 minutes, scraping the bottom, until the rice is soft and the pudding thick and creamy.',
      'Season with about ½ tsp salt; it brings out the sweetness. Mix the sugar and cinnamon.',
      'Serve hot in bowls with a knob of butter melting in the middle and cinnamon sugar on top.',
    ],
    remix: 'Cold leftover risengrød is the base for risalamande: fold it with whipped cream, vanilla and chopped almonds and serve with cherry sauce. You can also fry slices of cold pudding in butter.',
    da: {
      name: 'Risengrød',
      steps: [
        'Brug grødris. Bring ris og vand i kog i en tykbundet gryde, og kog i 2 minutter under omrøring, til vandet næsten er væk.',
        'Tilsæt mælken (og vaniljen), og bring grøden i kog under omrøring, så mælken ikke brænder på i bunden.',
        'Skru helt ned for varmen, læg låg på, og lad grøden simre ganske svagt i 40–45 minutter. Rør godt rundt hvert 5. minut, og skrab bunden med, til risene er møre og grøden er tyk og cremet.',
        'Smag til med ca. ½ tsk salt – saltet fremhæver sødmen. Bland sukker og kanel.',
        'Server grøden rygende varm i skåle med en klat smør i midten og kanelsukker på toppen.',
      ],
      remix: 'Kold risengrød er grundlaget for risalamande: Vend grøden med flødeskum, vanilje og hakkede mandler, og server med kirsebærsovs. Du kan også stege skiver af kold grød i smør.',
    },
  },
  {
    id: 'cottage-cheese-flatbread', name: 'Cottage cheese flatbread wrap', time: 45, serves: 2,
    tags: ['high protein', 'trending', 'oven', 'eggs', 'vegetarian', 'breakfast'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'cottage cheese', q: 250, u: 'g' }, { n: 'egg', q: 2, u: 'pcs' },
      { n: 'oregano', q: 0.5, u: 'tsp', opt: true, alt: ['chili flake'] },
      { n: 'ham', q: 60, u: 'g', opt: true, alt: ['smoked salmon', 'leftover roast chicken'] },
      { n: 'spinach', q: 30, u: 'g', opt: true, alt: ['lettuce'] }, { n: 'tomato', q: 1, u: 'pcs', opt: true, alt: ['cucumber'] },
    ],
    steps: [
      'Heat the oven to 180 °C and line a baking tray with baking paper (not foil; the flatbread sticks to it).',
      'Blend the cottage cheese and eggs until completely smooth with a pinch of salt and the oregano. Lumps of cheese will tear holes in the wrap.',
      'Pour onto the paper and spread into a thin, even rectangle about 25 × 30 cm with the back of a spoon.',
      'Bake for 30–35 minutes until golden all over and dry on top. If it is pale or soft in places, give it 5 minutes more; an underbaked flatbread tears.',
      'Let it cool for 5 minutes, peel off the paper and cut it in two. Fill with ham, spinach and tomato, and roll up like a wrap.',
    ],
    da: {
      name: 'Fladbrød af hytteost og æg',
      steps: [
        'Tænd ovnen på 180 °C, og beklæd en bageplade med bagepapir (ikke stanniol – fladbrødet sidder fast).',
        'Blend hytteost og æg helt glat med en knivspids salt og oreganoen. Klumper af ost giver huller i fladbrødet.',
        'Hæld massen på bagepapiret, og bred den ud med bagsiden af en ske til et tyndt, jævnt rektangel på ca. 25 × 30 cm.',
        'Bag i 30–35 minutter, til fladbrødet er gyldent overalt og tørt på overfladen. Er fladbrødet blegt eller blødt nogle steder, så giv det 5 minutter mere – et underbagt fladbrød går i stykker.',
        'Lad fladbrødet køle af i 5 minutter, træk papiret af, og skær fladbrødet i to. Fyld med skinke, spinat og tomat, og rul sammen som en wrap.',
      ],
    },
  },
  {
    id: 'tamagoyaki', name: 'Tamagoyaki (Japanese rolled omelette)', time: 20, serves: 2,
    tags: ['japanese', 'eggs', 'breakfast', 'quick', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'egg', q: 4, u: 'pcs' }, { n: 'sugar', q: 2, u: 'tsp', alt: ['honey'] }, { n: 'soy sauce', q: 1, u: 'tsp' },
      { n: 'water', q: 2, u: 'tbsp' }, { n: 'oil', q: 1, u: 'tbsp' },
      { n: 'cooked rice', q: 300, u: 'g', opt: true }, { n: 'spring onion', q: 1, u: 'pcs', opt: true },
    ],
    steps: [
      'Whisk the eggs gently with the sugar, soy sauce, water and a pinch of salt, trying not to make them foamy. Pour through a sieve if you want a very smooth omelette.',
      'Heat a small pan (square if you have one) over medium-low heat and wipe it with a piece of kitchen paper dipped in oil. Pour in a thin layer of egg and tilt the pan to cover the base.',
      'When the egg is almost set but still a little wet on top, roll it from the far side towards you with a spatula or chopsticks. This is tamagoyaki: the omelette is built from thin layers rolled around each other.',
      'Push the roll back to the far side, oil the pan again and pour in another thin layer, lifting the roll so egg runs underneath. Roll back towards you when almost set. Repeat until the egg is used up.',
      'Tip the roll onto a board and let it rest for 2 minutes to firm up, then cut into thick slices. Serve warm or cold, with rice and spring onion.',
    ],
    da: {
      name: 'Tamagoyaki – japansk rulleomelet',
      steps: [
        'Pisk æggene forsigtigt med sukker, sojasauce, vand og en knivspids salt, så æggemassen ikke bliver skummende. Si æggemassen, hvis du vil have en helt glat omelet.',
        'Varm en lille pande (gerne en firkantet) op ved middelsvag varme, og tør panden af med et stykke køkkenrulle dyppet i olie. Hæld et tyndt lag æggemasse på panden, og vip den, så bunden bliver dækket.',
        'Når ægget næsten er stivnet, men stadig er lidt vådt på overfladen, ruller du det fra den fjerne kant ind mod dig selv med en spatel eller spisepinde. Det er tamagoyaki: Omeletten bygges op af tynde lag, der rulles rundt om hinanden.',
        'Skub rullen tilbage til den fjerne kant, smør panden igen, og hæld et nyt tyndt lag i. Løft rullen, så æggemassen løber ind under. Rul omeletten mod dig igen, når laget næsten er stivnet. Gentag, til æggemassen er brugt.',
        'Vend rullen ud på et bræt, lad den hvile i 2 minutter, så den sætter sig, og skær den i tykke skiver. Server lun eller kold med ris og forårsløg.',
      ],
    },
  },
  {
    id: 'omelette-roulee', name: 'French rolled omelette with herbs', time: 10, serves: 1,
    tags: ['french', 'eggs', 'quick', 'breakfast', 'vegetarian'], meals: ['breakfast', 'lunch', 'late'],
    ingredients: [
      { n: 'egg', q: 3, u: 'pcs' }, { n: 'butter', q: 15, u: 'g' }, { n: 'chives', q: 1, u: 'tbsp', alt: ['parsley', 'dill'] },
      { n: 'cheese', q: 20, u: 'g', opt: true, alt: ['parmesan cheese'] }, { n: 'bread', q: 1, u: 'pcs', opt: true },
    ],
    steps: [
      'Beat the eggs with a fork with a pinch of salt and the finely chopped herbs, until yolks and whites are fully mixed.',
      'Heat a 20 cm non-stick pan over medium heat and melt most of the butter until it foams but does not brown. Pour in the eggs.',
      'Stir quickly with a spatula while shaking the pan for 20–30 seconds to make fine, soft curds. Then stop stirring, smooth the top and let the base set for 10 seconds. The top should still be slightly runny: that is what keeps a French omelette tender.',
      'Scatter over the cheese, tilt the pan away from you and roll the omelette from the handle side towards the far edge with the spatula, folding it over itself in thirds.',
      'Turn it out seam-side down onto a warm plate, rub the top with the last bit of butter and serve at once, with bread if you like.',
    ],
    da: {
      name: 'Fransk rulleomelet med krydderurter',
      steps: [
        'Pisk æggene sammen med en knivspids salt og de finthakkede krydderurter med en gaffel, til blommer og hvider er helt blandet.',
        'Varm en slip-let-pande på 20 cm op ved middel varme, og smelt det meste af smørret, til det skummer, men ikke tager farve. Hæld æggene i.',
        'Rør hurtigt med en spatel, mens du ryster panden i 20–30 sekunder, så æggene bliver til fine, bløde flager. Stop med at røre, glat overfladen ud, og lad bunden sætte sig i 10 sekunder. Overfladen skal stadig være let flydende – det er det, der gør en fransk omelet mør.',
        'Drys osten over, vip panden væk fra dig, og rul omeletten fra skaftsiden mod den fjerne kant med spatlen, så omeletten foldes i tre lag.',
        'Vend omeletten ud på en varm tallerken med samlingen nedad, gnid resten af smørret over toppen, og server med det samme, gerne med brød til.',
      ],
    },
  },
  {
    id: 'savory-yogurt-bowl', name: 'Savoury yogurt bowl with chili oil and egg', time: 15, serves: 2,
    tags: ['high protein', 'trending', 'bowl', 'eggs', 'breakfast', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'yogurt', q: 300, u: 'g', alt: ['skyr'] }, { n: 'egg', q: 2, u: 'pcs' }, { n: 'cucumber', q: 0.5, u: 'pcs' },
      { n: 'oil', q: 3, u: 'tbsp' }, { n: 'chili flake', q: 1, u: 'tsp' }, { n: 'garlic', q: 1, u: 'pcs' },
      { n: 'soy sauce', q: 1, u: 'tsp', opt: true }, { n: 'sesame seed', q: 1, u: 'tsp', opt: true },
      { n: 'spring onion', q: 1, u: 'pcs', opt: true, alt: ['chives'] }, { n: 'bread', q: 2, u: 'pcs', opt: true },
    ],
    steps: [
      'Boil the eggs for 6½–7 minutes, then cool them in cold water and peel.',
      'Make a quick chili oil: put the chili flakes, finely chopped garlic, sesame seeds and a pinch of salt in a heatproof cup. Heat the oil in a small pan until very hot but not smoking, then pour it over; it will sizzle. Stir and add the soy sauce.',
      'Stir a pinch of salt into the yogurt and spread it in two shallow bowls. Cut the cucumber into small cubes and scatter over.',
      'Halve the eggs and set them on top, spoon over the chili oil and finish with spring onion. Eat with bread if you like.',
    ],
    da: {
      name: 'Yoghurtbowl med chiliolie, agurk og æg',
      steps: [
        'Kog æggene i 6½–7 minutter, køl dem af i koldt vand, og pil dem.',
        'Lav en hurtig chiliolie: Kom chiliflager, finthakket hvidløg, sesamfrø og en knivspids salt i en varmefast kop. Varm olien i en lille gryde, til den er meget varm, men ikke ryger, og hæld den over krydderierne – det syder. Rør rundt, og tilsæt sojasaucen.',
        'Rør en knivspids salt i yoghurten, og fordel yoghurten i to dybe tallerkener. Skær agurken i små tern, og drys agurketernene over.',
        'Halver æggene, læg dem ovenpå, hæld chiliolien over, og drys med forårsløg. Spis gerne brød til.',
      ],
    },
  },
  {
    id: 'sweet-potato-hash', name: 'Sweet potato and black bean hash with eggs', time: 35, serves: 2,
    tags: ['one pot', 'eggs', 'potato', 'beans', 'breakfast', 'vegetarian'], meals: ['breakfast', 'lunch'],
    ingredients: [
      { n: 'sweet potato', q: 400, u: 'g', alt: ['potato'] }, { n: 'bell pepper', q: 1, u: 'pcs', alt: ['zucchini'] },
      { n: 'onion', q: 1, u: 'pcs', alt: ['red onion'] }, { n: 'black bean', q: 240, u: 'g', alt: ['kidney bean'] },
      { n: 'egg', q: 4, u: 'pcs' }, { n: 'paprika', q: 1, u: 'tsp' }, { n: 'cumin', q: 1, u: 'tsp' }, { n: 'oil', q: 2, u: 'tbsp' },
      { n: 'cilantro', q: 1, u: 'tbsp', opt: true, alt: ['parsley', 'spring onion'] },
    ],
    steps: [
      'Peel the sweet potato and cut it into 1–1.5 cm cubes. Fry in the oil in a large pan with a lid over medium heat for 10 minutes, covered, stirring now and then; the lid steams the cubes tender.',
      'Remove the lid, add the chopped onion and pepper, and fry for 8–10 minutes more, until the sweet potato is browned at the edges.',
      'Stir in the paprika, cumin and the drained beans, season well and cook for 2 minutes until the beans are hot.',
      'Make 4 hollows, crack in the eggs, cover and cook over low heat for 5–6 minutes until the whites are set. Scatter with herbs and serve from the pan.',
    ],
    remix: 'Leftover hash (without the eggs) makes a good tortilla filling the next day with a little cheese.',
    da: {
      name: 'Biksemad med søde kartofler og sorte bønner',
      steps: [
        'Skræl de søde kartofler, og skær dem i tern på 1–1½ cm. Steg dem i olien på en stor pande med låg ved middel varme i 10 minutter, og rør af og til – låget damper kartoffeltternene møre.',
        'Tag låget af, tilsæt hakket løg og peberfrugt, og steg i 8–10 minutter mere, til kartoflerne er brunede i kanterne.',
        'Rør paprika, spidskommen og de afdryppede bønner i, smag godt til, og steg i 2 minutter, til bønnerne er varme.',
        'Lav 4 fordybninger, slå æggene ud i dem, læg låg på, og lad æggene trække ved svag varme i 5–6 minutter, til hviderne er stivnet. Drys med krydderurter, og server direkte fra panden.',
      ],
      remix: 'Rester af biksemaden (uden æg) er gode som fyld i tortillas dagen efter – med lidt ost.',
    },
  },
);
Object.assign(window.PC_EXTRA.words, {
  // no new ingredient words needed for this batch
});
