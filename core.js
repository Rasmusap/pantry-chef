// Bentes køkken — core logic with no DOM access: names, units, parsing, matching, cooking,
// the recipe generator, text helpers and backup validation. Used by app.js and by the Node tests.
(function (root) {
  'use strict';
  const D = root.PC_DATA;
  const I = root.PC_I18N;

  // Extra recipes and ingredient words from web/recipes/*.js are merged in once, before anything else runs.
  const X = root.PC_EXTRA;
  if (X && !X.merged) {
    X.merged = true;
    for (const [c, w] of Object.entries(X.words || {})) {
      I.ING_DA[c] = w.da;
      for (const d of w.daInput || []) I.DA_INPUT[d] = c;
      for (const a of w.aliases || []) D.ALIASES[a] = c;
      if (w.enPlural) I.EN_PLURAL[c] = w.enPlural;
      if (w.cat && D.CATEGORIES[w.cat] && !D.CATEGORIES[w.cat].includes(c)) D.CATEGORIES[w.cat].push(c);
    }
    for (const r of X.recipes || []) {
      if (D.RECIPES.some((x) => x.id === r.id)) continue;
      const { da, ...en } = r;
      D.RECIPES.push(en);
      if (da) I.RECIPES_DA[r.id] = da;
    }
  }

  // Own-property lookup, so names like "constructor" never hit Object's built-ins.
  const own = (obj, k) => (obj && Object.prototype.hasOwnProperty.call(obj, k) ? obj[k] : undefined);

  // ---------- text ----------
  function t(lang, key, vars = {}) {
    const s = own(I.UI[lang], key) ?? own(I.UI.en, key) ?? key;
    if (typeof s === 'function') return s(vars);
    return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  }
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const joinList = (arr, lang) => (arr.length <= 1 ? (arr[0] || '') : `${arr.slice(0, -1).join(', ')} ${t(lang, 'and')} ${arr[arr.length - 1]}`);
  function ingName(c, plural, lang) {
    if (lang === 'da') {
      const v = own(I.ING_DA, c);
      if (v == null) return c;
      return Array.isArray(v) ? v[plural ? 1 : 0] : v;
    }
    return (plural && own(I.EN_PLURAL, c)) || c;
  }
  // Danish shows mass amounts in plural ("500 g kartofler"); both languages pluralise counted items > 1.
  const pluralFor = (q, u, lang) => (u === 'pcs' && q > 1) || (lang === 'da' && (u === 'g' || u === 'ml'));
  // Name shown next to an amount: "2 fed hvidløg" / "2 garlic cloves" rather than "2 hvidløg".
  const MASS_PLURAL = new Set(['oat', 'pea', 'lentil', 'chickpea', 'kidney bean', 'black bean', 'bean', 'noodle', 'chili flake', 'green bean', 'olive']);
  function ingLabel(c, q, u, lang) {
    if (c === 'garlic' && u === 'pcs') return lang === 'da' ? 'fed hvidløg' : (q > 1 ? 'garlic cloves' : 'garlic clove');
    if (lang === 'en' && (u === 'g' || u === 'ml') && MASS_PLURAL.has(c)) return ingName(c, true, lang); // "100 g oats"
    return ingName(c, pluralFor(q, u, lang), lang);
  }
  const recipeById = (id) => D.RECIPES.find((r) => r.id === id);
  const da = (r, lang) => (lang === 'da' && own(I.RECIPES_DA, r.id)) || null;
  const recipeName = (r, lang) => (r.generated ? r.name : (da(r, lang) || r).name);
  const recipeSteps = (r, lang) => (r.generated ? r.steps : (da(r, lang) || r).steps);
  const recipeRemix = (r, lang) => (r.generated ? null : (da(r, lang) || r).remix || null);
  const tagName = (tag, lang) => (lang === 'da' ? own(I.TAGS_DA, tag) || tag : tag);
  const dishName = (x, lang) => { const r = x.recipeId && recipeById(x.recipeId); return r ? recipeName(r, lang) : x.name; };

  // ---------- dates (local calendar days as YYYY-MM-DD) ----------
  const pad = (n) => String(n).padStart(2, '0');
  function isoDay(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  const today = () => isoDay(new Date());
  function parseDay(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); } // noon: safe from clock changes
  const daysBetween = (from, to) => Math.round((parseDay(to) - parseDay(from)) / 86400000);
  const addDays = (s, n) => { const d = parseDay(s); d.setDate(d.getDate() + n); return isoDay(d); };
  const fmtDay = (s, lang) => parseDay(s).toLocaleDateString(lang === 'da' ? 'da-DK' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  // ---------- names & matching ----------
  function sing(w) {
    if (w.length <= 3) return w;
    if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.endsWith('oes')) return w.slice(0, -2);
    if (/(ch|sh|x)es$/.test(w)) return w.slice(0, -2);
    if (w.endsWith('ss') || w.endsWith('us')) return w;
    if (w.endsWith('s')) return w.slice(0, -1);
    return w;
  }
  // crème → creme, jalapeño → jalapeno; Danish æ, ø, å are kept as they are.
  const ACCENTS = { 'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'î': 'i', 'ï': 'i', 'í': 'i',
    'ñ': 'n', 'ô': 'o', 'ö': 'o', 'ó': 'o', 'û': 'u', 'ü': 'u', 'ú': 'u' };
  const deaccent = (s) => s.replace(/[àáâäçèéêëîïíñôöóûüú]/g, (ch) => ACCENTS[ch]);
  // Any typed name (English or Danish, singular or plural) → one English "canonical" name.
  function canon(s) {
    const clean = deaccent(String(s).toLowerCase()).replace(/[^a-zæøå\s]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
    if (own(I.DA_INPUT, clean)) return I.DA_INPUT[clean];
    const n = clean.split(' ').map(sing).join(' ');
    if (own(I.DA_INPUT, n)) return I.DA_INPUT[n];
    return own(D.ALIASES, n) || n;
  }
  const STAPLES = new Set(D.STAPLES.map(canon));
  const endsWithWord = (a, b) => a === b || a.endsWith(' ' + b);
  // "red onion" counts as "onion" (and the other way round); "chicken stock" does not count as "chicken".
  // Two-word ingredients that are something else than their last word: they only match exactly.
  const COMPOUNDS = new Set(['coconut milk', 'peanut butter', 'sesame oil', 'sweet potato', 'cream cheese', 'sour cream', 'spring onion',
    'creme fraiche', 'tomato paste', 'chili powder', 'curry paste', 'soy sauce', 'green bean']);
  function nameMatch(have, want) {
    if (have === want) return true;
    if (/^(leftover|cooked) /.test(want) || /^(leftover|cooked) /.test(have)) return false;
    if (COMPOUNDS.has(have) || COMPOUNDS.has(want)) return false;
    return endsWithWord(have, want) || endsWithWord(want, have);
  }
  const leftoverNames = (l) => {
    const c = canon(l.name);
    return [c, 'leftover ' + c, 'cooked ' + c, ...(l.provides || []).map(canon)];
  };
  function sources(state) {
    const list = state.pantry.map((p) => ({ kind: 'pantry', item: p, names: [canon(p.name)] }));
    for (const l of state.leftovers) if (l.servings > 0) list.push({ kind: 'leftover', item: l, names: leftoverNames(l) });
    return list;
  }
  function findSource(ing, srcs) {
    const wants = [ing.n, ...(ing.alt || [])].map(canon);
    // Exact names first (so "onion" uses your onions, not your spring onions), then looser matches.
    for (const w of wants) for (const s of srcs) if (s.names.includes(w)) return { ...s, via: w };
    for (const w of wants) {
      for (const s of srcs) {
        if (s.kind === 'pantry' && s.names.some((h) => nameMatch(h, w))) return { ...s, via: w };
      }
    }
    if (wants.some((w) => STAPLES.has(w))) return { kind: 'staple' };
    return null;
  }

  // ---------- units ----------
  const UNITS = { g: ['g', 1], gram: ['g', 1], grams: ['g', 1], kg: ['g', 1000], ml: ['ml', 1], l: ['ml', 1000], liter: ['ml', 1000], litre: ['ml', 1000],
    dl: ['ml', 100], cl: ['ml', 10], pc: ['pcs', 1], pcs: ['pcs', 1], piece: ['pcs', 1], pieces: ['pcs', 1], can: ['pcs', 1], cans: ['pcs', 1],
    tbsp: ['tbsp', 1], tsp: ['tsp', 1], cup: ['ml', 240], cups: ['ml', 240],
    stk: ['pcs', 1], 'dåse': ['pcs', 1], 'dåser': ['pcs', 1], spsk: ['tbsp', 1], tsk: ['tsp', 1] };
  const UNIT_CHOICES = ['', 'g', 'ml', 'pcs', 'tbsp', 'tsp'];
  const VOL = { ml: 1, tbsp: 15, tsp: 5 };
  // Rough weight of one piece, so "3 potatoes" and a recipe's "500 g potato" can be compared.
  const PCS_G = { potato: 200, 'sweet potato': 250, onion: 150, carrot: 80, tomato: 120, 'bell pepper': 150, zucchini: 250, leek: 200,
    cucumber: 300, banana: 120, lemon: 100, lime: 70, mushroom: 20, egg: 60, eggplant: 300, avocado: 170, apple: 180 };
  const PCS_KEYS = Object.keys(PCS_G).sort((a, b) => b.length - a.length); // "sweet potato" before "potato"
  function pieceWeight(c) { const k = PCS_KEYS.find((key) => endsWithWord(c, key)); return k ? PCS_G[k] : null; }
  function convert(q, from, to, c) {
    if (from === to) return q;
    if (VOL[from] && VOL[to]) return (q * VOL[from]) / VOL[to];
    const w = pieceWeight(c);
    if (w && from === 'pcs' && to === 'g') return q * w;
    if (w && from === 'g' && to === 'pcs') return q / w;
    return null;
  }
  function nice(q, u) {
    if (u === 'g' || u === 'ml') return q >= 50 ? Math.round(q / 10) * 10 : Math.max(5, Math.round(q / 5) * 5);
    if (u === 'serving') return Math.round(q * 2) / 2;
    return Math.max(0.5, Math.round(q * 2) / 2);
  }
  const round2 = (n) => Math.round(n * 100) / 100;
  function fmtNum(q, lang) {
    const n = round2(q);
    if (n === 0.5) return '½';
    if (n % 1 === 0.5) return `${Math.floor(n)}½`;
    return lang === 'da' ? String(n).replace('.', ',') : String(n);
  }
  function fmtQty(q, u, lang) {
    if (q == null) return '';
    const n = round2(q);
    if (u === 'pcs' || !u) return fmtNum(n, lang);
    if (u === 'serving') return `${fmtNum(n, lang)} ${t(lang, 'u_serving', { n })}`;
    if (u === 'g' && n >= 1000) return `${fmtNum(Math.round(n / 100) / 10, lang)} kg`;
    if (u === 'ml' && n >= 1000) return `${fmtNum(Math.round(n / 100) / 10, lang)} l`;
    return `${fmtNum(n, lang)} ${t(lang, 'u_' + u)}`;
  }

  // "500g pasta", "1,5 kg kartofler", "4 æg", "2 dl mælk", "broccoli" → { name, qty, unit }
  function parseItem(raw) {
    const s = String(raw).trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);
    if (!s) return null;
    const m = s.match(/^(\d+(?:[.,]\d+)?)\s*(\S*)\s*(.*)$/);
    if (!m) return { name: s, qty: null, unit: '' };
    let qty = parseFloat(m[1].replace(',', '.'));
    let unit = m[2].replace(/\.$/, '');
    let name = m[3];
    if (unit && own(UNITS, unit)) { const [u, f] = UNITS[unit]; unit = u; qty *= f; } else { name = [m[2], name].filter(Boolean).join(' '); unit = 'pcs'; }
    name = name.replace(/^(of|af) /, '').trim();
    if (!name) return null;
    if (!(qty > 0)) { qty = null; unit = ''; }
    return { name, qty, unit };
  }
  // "1,5 kg kartofler, 2 æg" → ["1,5 kg kartofler", "2 æg"]: a comma between digits is a decimal comma.
  const splitItems = (text) => String(text).split(/[;\n]+|,(?!\d)|(?<!\d),/).map((x) => x.trim()).filter(Boolean).slice(0, 50);
  // Add an item to a pantry-like list, merging with an existing entry of the same ingredient.
  function addToList(list, item, uid) {
    const c = canon(item.name);
    const ex = list.find((p) => canon(p.name) === c);
    if (!ex) { list.push({ id: uid(), name: item.name, qty: item.qty ?? null, unit: item.unit || '' }); return; }
    if (item.qty == null) return;
    if (ex.qty == null) { ex.qty = item.qty; ex.unit = item.unit; return; }
    const conv = convert(item.qty, item.unit, ex.unit, c);
    if (conv != null) ex.qty = round2(ex.qty + conv);
    else list.push({ id: uid(), name: item.name, qty: item.qty, unit: item.unit });
  }

  // ---------- time of day ----------
  // Meal for a local clock time: breakfast 05–10, lunch 11–14, dinner 15–21, late 22–04.
  const MEALS = ['breakfast', 'lunch', 'dinner', 'late'];
  function mealSlot(date = new Date()) {
    const h = date.getHours();
    if (h >= 5 && h < 11) return 'breakfast';
    if (h >= 11 && h < 15) return 'lunch';
    if (h >= 15 && h < 22) return 'dinner';
    return 'late';
  }
  const recipeMeals = (r) => r.meals || own(D.MEALS, r.id) || [];
  const suitsMeal = (r, meal) => !!meal && recipeMeals(r).includes(meal);

  // ---------- diet and allergens ----------
  // Worked out from the ingredients. Flags: meat, fish, shellfish, honey (not vegan) and the EU allergens
  // gluten, dairy, egg, nuts, peanut, soy, sesame, mustard, celery. "?x" = may contain x (check the label).
  // Every ingredient the recipes use must be listed here (a test checks it), so nothing is missed.
  const MEAT = ['meat'];
  const DAIRY = ['dairy'];
  const ALLERGENS = {
    // meat
    beef: MEAT, pork: MEAT, chicken: MEAT, turkey: MEAT, bacon: MEAT, ham: MEAT, chorizo: MEAT, 'minced beef': MEAT, 'minced pork': MEAT,
    'pork and veal mince': MEAT, 'pork belly': MEAT, 'pork tenderloin': MEAT, sausage: ['meat', '?gluten', '?dairy'],
    'chicken stock': ['meat', '?celery'], 'leftover roast chicken': MEAT, 'leftover bolognese': ['meat', '?celery'],
    // fish and shellfish
    fish: ['fish'], cod: ['fish'], salmon: ['fish'], 'smoked salmon': ['fish'], tuna: ['fish'], 'white fish': ['fish'], shrimp: ['shellfish'],
    // dairy
    butter: DAIRY, cheese: DAIRY, 'cheddar cheese': DAIRY, 'gouda cheese': DAIRY, 'mozzarella cheese': DAIRY, 'parmesan cheese': DAIRY,
    'feta cheese': DAIRY, halloumi: DAIRY, 'cottage cheese': DAIRY, 'cream cheese': DAIRY, 'creme fraiche': DAIRY, 'sour cream': DAIRY,
    cream: DAIRY, milk: DAIRY, yogurt: DAIRY, kefir: DAIRY, skyr: DAIRY,
    // egg
    egg: ['egg'], mayonnaise: ['egg', '?mustard'], remoulade: ['egg', 'mustard'],
    // gluten
    bread: ['gluten'], 'rye bread': ['gluten'], flour: ['gluten'], breadcrumb: ['gluten'], pasta: ['gluten'], 'cooked pasta': ['gluten'],
    orzo: ['gluten'], gnocchi: ['gluten'], couscous: ['gluten'], noodle: ['gluten', '?egg'], tortilla: ['gluten'], cracker: ['gluten'],
    biscuit: ['gluten', 'egg', '?dairy'], oat: ['gluten'], 'baking powder': ['?gluten'],
    // soy, sesame, nuts, mustard, celery
    'soy sauce': ['soy', 'gluten'], gochujang: ['soy', 'gluten'], tofu: ['soy'], 'sesame oil': ['sesame'], 'sesame seed': ['sesame'],
    tahini: ['sesame'], hummus: ['sesame'], almond: ['nuts'], pesto: ['dairy', 'nuts'], 'peanut butter': ['peanut'], mustard: ['mustard'],
    celery: ['celery'], stock: ['?celery', '?gluten'], 'vegetable stock': ['?celery'], 'curry powder': ['?mustard', '?celery'],
    'curry paste': ['?shellfish', '?fish'], kimchi: ['?fish', '?shellfish'], honey: ['honey'],
    // leftovers: it depends on the dish they came from
    'leftover chili': ['?meat'], 'leftover curry': ['?meat', '?dairy'], 'leftover soup': ['?meat', '?dairy', '?celery'],
    'leftover risotto': DAIRY, 'leftover rice pudding': DAIRY, 'leftover frittata': ['egg', 'dairy'], 'cooked rice': [], 'cooked potato': [],
  };
  // Plants, spices and other ingredients with none of the above.
  for (const c of ['apple', 'asparagus', 'avocado', 'banana', 'basil', 'bean', 'bean sprout', 'beetroot', 'bell pepper', 'berry', 'black bean',
    'black pepper', 'broccoli', 'cabbage', 'canned tomato', 'caper', 'carrot', 'cauliflower', 'cherry sauce', 'chickpea', 'chili', 'chili flake',
    'chili powder', 'chives', 'cilantro', 'cinnamon', 'cocoa', 'coconut milk', 'coffee', 'cucumber', 'cumin', 'dill', 'eggplant', 'garam masala',
    'garlic', 'ginger', 'green bean', 'kale', 'ketchup', 'kidney bean', 'leek', 'lemon', 'lentil', 'lettuce', 'lime', 'mushroom', 'oil', 'olive',
    'olive oil', 'onion', 'oregano', 'paprika', 'parsley', 'pea', 'pickled beetroot', 'potato', 'pumpkin', 'quinoa', 'red onion', 'rice', 'rosemary',
    'salt', 'spinach', 'spring onion', 'squash', 'sriracha', 'sugar', 'sun dried tomato', 'sweet potato', 'sweetcorn', 'thyme', 'tomato',
    'tomato paste', 'vanilla', 'vinegar', 'water', 'white bean', 'zucchini', 'cumin', 'tortilla chip', 'chives']) if (!own(ALLERGENS, c)) ALLERGENS[c] = [];
  const ALLERGEN_KEYS = ['gluten', 'dairy', 'egg', 'fish', 'shellfish', 'nuts', 'peanut', 'soy', 'sesame', 'mustard', 'celery'];
  const flagsOf = (n) => own(ALLERGENS, canon(n)) || null; // null = not classified yet
  const is = (flags, k) => !!flags && flags.includes(k);
  const animalFree = (flags) => !!flags && !flags.some((f) => ['meat', 'fish', 'shellfish', '?meat'].includes(f));

  // { diet: 'vegan'|'vegetarian'|'fish'|'meat'|'check', contains: [...], may: [...], optional: [...], swaps: [{from, to}], unknown: [...] }
  // Diet comes from the ingredients you must have; optional ones (garnish) are listed separately.
  function dietInfo(r) {
    const req = r.ingredients.filter((i) => !i.opt); const opt = r.ingredients.filter((i) => i.opt);
    const all = (list) => list.map((i) => flagsOf(i.n) || []);
    const reqFlags = all(req).flat();
    const unknown = r.ingredients.filter((i) => !flagsOf(i.n)).map((i) => canon(i.n));
    let diet = 'vegan';
    if (reqFlags.some((f) => f === 'dairy' || f === 'egg' || f === 'honey')) diet = 'vegetarian';
    if (reqFlags.some((f) => f === 'fish' || f === 'shellfish')) diet = 'fish';
    if (reqFlags.includes('?meat')) diet = 'check';
    if (reqFlags.includes('meat')) diet = 'meat';
    const contains = ALLERGEN_KEYS.filter((k) => reqFlags.includes(k));
    const may = ALLERGEN_KEYS.filter((k) => !contains.includes(k) && reqFlags.includes('?' + k));
    const optFlags = all(opt).flat();
    const optional = ALLERGEN_KEYS.filter((k) => !contains.includes(k) && optFlags.includes(k));
    // Vegetarian option: every meat/fish ingredient you must have offers an alternative without meat or fish.
    const swaps = [];
    let swappable = diet === 'meat' || diet === 'fish';
    for (const i of req) {
      const f = flagsOf(i.n);
      if (!f || animalFree(f)) continue;
      const to = (i.alt || []).find((a) => animalFree(flagsOf(a)));
      if (to) swaps.push({ from: canon(i.n), to: canon(to) }); else swappable = false;
    }
    // Vegetarian/vegan only if the bought products are (e.g. kimchi or curry paste without fish).
    const labelCheck = (diet === 'vegan' || diet === 'vegetarian') && (may.includes('fish') || may.includes('shellfish'));
    return { diet, labelCheck, contains, may, optional, swaps: swappable ? swaps : [], unknown };
  }
  const isVegetarian = (r) => ['vegan', 'vegetarian'].includes(dietInfo(r).diet);
  const isVegan = (r) => dietInfo(r).diet === 'vegan';
  const freeOf = (k) => (r) => { const d = dietInfo(r); return !d.contains.includes(k) && !d.may.includes(k); };

  // ---------- collections ("Under 30 min", "Budget friendly", cuisines …) ----------
  // Each collection is a rule over a recipe, so new recipes join automatically.
  const hasTag = (r, t) => (r.tags || []).includes(t);
  const reqIngs = (r) => r.ingredients.filter((i) => !i.opt && !STAPLES.has(canon(i.n)));
  const uses = (r, names) => r.ingredients.some((i) => [i.n, ...(i.alt || [])].some((n) => names.includes(canon(n))));
  // Pricier ingredients; a recipe with none of them and at most 6 main ingredients counts as budget friendly.
  // A rough guide based on typical Danish supermarket prices, not exact costs.
  const PREMIUM = ['salmon', 'smoked salmon', 'cod', 'white fish', 'shrimp', 'pork tenderloin', 'pork belly', 'beef', 'chicken', 'turkey', 'bacon',
    'ham', 'sausage', 'chorizo', 'leftover roast chicken', 'halloumi', 'parmesan cheese', 'feta cheese', 'mozzarella cheese', 'cream cheese',
    'cottage cheese', 'kefir', 'skyr', 'pesto', 'sun dried tomato', 'peanut butter', 'tahini', 'almond', 'avocado', 'coconut milk', 'gnocchi', 'quinoa'];
  // Older recipes that belong to a cuisine but predate the cuisine tags.
  const CUISINE_IDS = {
    italian: ['aglio', 'tomato-pasta', 'pasta-bake', 'risotto', 'frittata'],
    mexican: ['chili', 'chili-wraps', 'chili-potato', 'quesadillas', 'breakfast-wraps'],
    indian: ['dal', 'curry-wraps'],
    'middle eastern': ['shakshuka'],
  };
  const cuisine = (tag, ingredients = []) => (r) => hasTag(r, tag) || (CUISINE_IDS[tag] || []).includes(r.id) || (ingredients.length > 0 && uses(r, ingredients));
  const COLLECTIONS = [
    { key: 'under30', icon: '⏱️', test: (r) => r.time <= 30 },
    { key: 'budget', icon: '💰', test: (r) => reqIngs(r).length <= 6 && !r.ingredients.some((i) => !i.opt && PREMIUM.includes(canon(i.n))) },
    { key: 'under15', icon: '⚡', test: (r) => r.time <= 15 },
    { key: 'few', icon: '5️⃣', test: (r) => reqIngs(r).length <= 5 },
    { key: 'vegetarian', icon: '🥕', test: isVegetarian },
    { key: 'vegan', icon: '🌱', test: isVegan },
    { key: 'glutenfree', icon: '🌾', test: freeOf('gluten') },
    { key: 'dairyfree', icon: '🥛', test: freeOf('dairy') },
    { key: 'protein', icon: '💪', test: (r) => hasTag(r, 'high protein') },
    { key: 'onepot', icon: '🍲', test: (r) => hasTag(r, 'one pot') },
    { key: 'leftovers', icon: '♻️', test: (r) => hasTag(r, 'leftover remix') || r.ingredients.some((i) => /^(leftover|cooked) /.test(canon(i.n))) },
    { key: 'italian', icon: '🇮🇹', test: cuisine('italian') },
    { key: 'french', icon: '🇫🇷', test: cuisine('french') },
    { key: 'japanese', icon: '🇯🇵', test: cuisine('japanese') },
    { key: 'korean', icon: '🇰🇷', test: cuisine('korean', ['gochujang', 'kimchi']) },
    { key: 'mexican', icon: '🇲🇽', test: cuisine('mexican', ['tortilla chip']) },
    { key: 'indian', icon: '🇮🇳', test: cuisine('indian', ['garam masala']) },
    { key: 'middleeast', icon: '🧆', test: cuisine('middle eastern', ['tahini']) },
    { key: 'danish', icon: '🇩🇰', test: (r) => hasTag(r, 'danish classic') },
    { key: 'dessert', icon: '🍰', test: (r) => hasTag(r, 'dessert') || (hasTag(r, 'sweet') && !hasTag(r, 'breakfast')) },
  ];
  // All selected collections must match (Under 30 min + Vegetarian = quick vegetarian recipes).
  const inCollections = (r, keys) => keys.every((k) => { const c = COLLECTIONS.find((x) => x.key === k); return !c || c.test(r); });

  // ---------- recipe analysis ----------
  function analyse(state, r, servings = r.serves) {
    const srcs = sources(state);
    const f = servings / r.serves;
    const rows = r.ingredients.map((ing) => {
      const src = findSource(ing, srcs);
      const need = ing.q * f;
      let short = null;
      if (src && src.kind === 'pantry' && src.item.qty != null) {
        const have = convert(src.item.qty, src.item.unit, ing.u, src.names[0]);
        if (have != null && have < need * 0.95) short = have;
      }
      if (src && src.kind === 'leftover' && ing.u === 'serving' && src.item.servings < need) short = src.item.servings;
      const staple = STAPLES.has(canon(ing.n));
      return { ing, c: canon(ing.n), src, need, short, staple };
    });
    const req = rows.filter((x) => !x.ing.opt && !x.staple);
    const missing = req.filter((x) => !x.src);
    const have = req.length - missing.length;
    return { rows, req, missing, have, pct: req.length ? have / req.length : 1, usesLeftover: rows.some((x) => x.src && x.src.kind === 'leftover') };
  }
  // Best match first. With a meal ("breakfast" …), recipes for that meal come first within the same readiness.
  function rankRecipes(state, meal = null) {
    const score = (x) => (suitsMeal(x.r, meal) ? 20 : 0) + (x.a.usesLeftover ? 0.5 : 0) + x.a.pct * 10 - x.a.missing.length * 0.1;
    return D.RECIPES.map((r) => ({ r, a: analyse(state, r), forMeal: suitsMeal(r, meal) })).sort((x, y) => score(y) - score(x));
  }

  // ---------- cooking ----------
  // Subtracts what the recipe uses, stores uneaten servings as a leftover dish and returns a
  // "just cooked" summary stored as data (not text), so it can be shown in either language.
  function cook(state, r, servings, eaten, opts) {
    const { uid, day = today(), lang = 'en' } = opts;
    const f = servings / r.serves;
    const srcs = sources(state);
    const rows = [];
    for (const ing of r.ingredients) {
      const src = findSource(ing, srcs);
      const need = ing.q * f;
      if (!src) { if (!ing.opt) rows.push({ c: canon(ing.n), used: { q: need, u: ing.u }, left: { k: 'missing' }, tone: 'warn' }); continue; }
      if (src.kind === 'staple') continue;
      if (src.kind === 'pantry') {
        const p = src.item;
        if (p.qty == null) { rows.push({ name: p.name, used: { q: need, u: ing.u }, left: { k: 'untracked' } }); continue; }
        if (p.qty <= 0) continue; // already used up by an earlier line of this recipe
        const conv = convert(need, ing.u, p.unit, canon(p.name));
        if (conv == null) { rows.push({ name: p.name, used: { q: need, u: ing.u }, left: { k: 'diff', q: p.qty, u: p.unit }, tone: 'warn' }); continue; }
        const used = Math.min(p.qty, conv);
        p.qty = Math.max(0, round2(p.qty - conv));
        const out = p.qty <= 0.001;
        rows.push({ name: p.name, used: { q: used, u: p.unit, approx: ing.u !== p.unit }, left: out ? { k: 'out' } : { k: 'qty', q: p.qty, u: p.unit }, tone: out ? 'out' : '' });
      } else {
        const l = src.item;
        if (l.servings <= 0) continue;
        const take = ing.u === 'serving' ? Math.min(need, l.servings) : l.servings;
        l.servings = Math.max(0, round2(l.servings - take));
        const out = l.servings <= 0;
        rows.push({ lo: { name: l.name, recipeId: l.recipeId }, used: { q: take, u: 'serving' }, left: out ? { k: 'out' } : { k: 'qty', q: l.servings, u: 'serving' }, tone: out ? 'out' : '' });
      }
    }
    state.pantry = state.pantry.filter((p) => p.qty == null || p.qty > 0.001);
    state.leftovers = state.leftovers.filter((l) => l.servings > 0);
    const extra = Math.max(0, round2(servings - eaten));
    const recipeId = r.generated ? null : r.id;
    const name = recipeName(r, lang);
    if (extra > 0) state.leftovers.unshift({ id: uid(), name, servings: extra, cooked: day, provides: r.provides || [], recipeId });
    state.log.unshift({ id: uid(), date: day, name, recipeId, servings, eaten, leftover: extra });
    state.log = state.log.slice(0, 100);
    state.lastCook = { name, recipeId, date: day, rows, leftover: extra };
    return state.lastCook;
  }

  // ---------- recipe generator ("Create a recipe") ----------
  const AROM = new Set(['onion', 'garlic', 'spring onion', 'red onion', 'shallot']);
  const DEF = { pasta: [200, 'g'], rice: [150, 'g'], 'cooked rice': [400, 'g'], 'cooked pasta': [400, 'g'], noodle: [200, 'g'], tortilla: [4, 'pcs'],
    egg: [4, 'pcs'], garlic: [2, 'pcs'], onion: [1, 'pcs'], 'spring onion': [2, 'pcs'], 'red onion': [1, 'pcs'], 'soy sauce': [2, 'tbsp'],
    'curry powder': [1, 'tbsp'], 'curry paste': [2, 'tbsp'], 'canned tomato': [400, 'g'], 'coconut milk': [400, 'ml'], stock: [750, 'ml'],
    cream: [100, 'ml'], milk: [100, 'ml'], butter: [20, 'g'], potato: [600, 'g'], 'sweet potato': [500, 'g'], lemon: [1, 'pcs'], lime: [1, 'pcs'],
    ginger: [1, 'tsp'], pesto: [3, 'tbsp'], honey: [1, 'tbsp'], mustard: [1, 'tsp'], 'bell pepper': [1, 'pcs'], zucchini: [1, 'pcs'], carrot: [2, 'pcs'],
    leek: [1, 'pcs'], tomato: [2, 'pcs'], cucumber: [1, 'pcs'], chili: [1, 'pcs'], avocado: [1, 'pcs'], lettuce: [1, 'pcs'], tuna: [1, 'pcs'],
    'kidney bean': [400, 'g'], chickpea: [400, 'g'], lentil: [200, 'g'], tofu: [300, 'g'], bacon: [150, 'g'], bread: [2, 'pcs'], yogurt: [4, 'tbsp'],
    'sour cream': [3, 'tbsp'], 'creme fraiche': [3, 'tbsp'], 'sesame oil': [1, 'tsp'], sriracha: [1, 'tbsp'], vinegar: [1, 'tbsp'], 'tomato paste': [2, 'tbsp'] };
  const DEF_ROLE = { protein: [300, 'g'], veg: [150, 'g'], carb: [200, 'g'], dairy: [60, 'g'], flavour: [1, 'tsp'] };
  function lookupDef(c) { if (own(DEF, c)) return DEF[c]; const k = Object.keys(DEF).find((key) => endsWithWord(c, key)); return k ? DEF[k] : null; }
  function amountFor(e, role, mult = 1) {
    if (e.leftover) return { n: e.c, q: Math.min(2, e.leftover.servings), u: 'serving' };
    let [q, u] = lookupDef(e.c) || DEF_ROLE[role] || [1, 'pcs'];
    q *= mult;
    const p = e.item;
    if (p && p.qty != null) {
      const conv = convert(q, u, p.unit, e.c);
      if (conv != null) { q = Math.min(conv, p.qty); u = p.unit; }
      else { u = p.unit; q = p.unit === 'pcs' ? Math.min(p.qty, 2) : Math.min(p.qty, DEF_ROLE[role] ? DEF_ROLE[role][0] : q); }
    }
    let rounded = nice(q, u);
    if (p && p.qty != null && p.unit === u) rounded = Math.min(rounded, p.qty); // never more than you have
    return { n: e.c, q: rounded, u };
  }
  function pools(state) {
    const P = { protein: [], veg: [], carb: [], dairy: [], flavour: [], egg: null, cookedRice: null, cookedPasta: null };
    for (const p of state.pantry) {
      const c = canon(p.name);
      const e = { c, item: p };
      if (c === 'egg') { P.egg = e; continue; }
      for (const [cat, words] of Object.entries(D.CATEGORIES)) {
        if (cat === 'dairy' && c === 'coconut milk') continue;
        if (words.some((w) => endsWithWord(c, canon(w)))) P[cat].push(e);
      }
    }
    for (const l of state.leftovers) {
      if (l.servings <= 0) continue;
      const n = leftoverNames(l);
      if (n.includes('cooked rice')) P.cookedRice = { c: 'cooked rice', leftover: l };
      if (n.includes('cooked pasta')) P.cookedPasta = { c: 'cooked pasta', leftover: l };
    }
    const isCarb = (e) => P.carb.includes(e);
    P.arom = P.veg.filter((v) => AROM.has(v.c));
    P.mainVeg = P.veg.filter((v) => !AROM.has(v.c) && !isCarb(v) && v.c !== 'canned tomato' && v.c !== 'chili');
    P.chili = P.veg.find((v) => v.c === 'chili');
    P.cheese = P.dairy.find((x) => x.c.endsWith('cheese'));
    P.cream = P.dairy.find((x) => ['cream', 'creme fraiche', 'sour cream'].includes(x.c));
    P.butter = P.dairy.find((x) => x.c === 'butter');
    P.tomatoes = P.flavour.find((f) => f.c === 'canned tomato');
    P.stock = P.flavour.find((f) => f.c.endsWith('stock'));
    P.coconut = P.flavour.find((f) => f.c === 'coconut milk');
    P.curry = P.flavour.find((f) => f.c.startsWith('curry'));
    P.soy = P.flavour.find((f) => f.c === 'soy sauce');
    P.citrus = P.flavour.find((f) => f.c === 'lemon' || f.c === 'lime');
    P.spices = P.flavour.filter((f) => !['canned tomato', 'coconut milk', 'soy sauce', 'lemon', 'lime', 'tomato paste'].includes(f.c) && !f.c.startsWith('curry') && !f.c.endsWith('stock'));
    P.pasta = P.carb.find((x) => x.c === 'pasta');
    P.rice = P.carb.find((x) => x.c === 'rice');
    P.noodle = P.carb.find((x) => x.c === 'noodle');
    P.tortilla = P.carb.find((x) => x.c === 'tortilla');
    P.potato = P.carb.find((x) => x.c === 'potato' || x.c === 'sweet potato');
    return P;
  }
  // English title adjectives (Danish titles are "<Dish> med …" and don't use them).
  const ADJ = { 'soy sauce': 'Soy-glazed', 'curry powder': 'Curried', paprika: 'Smoky', 'chili flake': 'Spicy', 'chili powder': 'Spicy', chili: 'Spicy',
    lemon: 'Zesty', lime: 'Zingy', pesto: 'Pesto', honey: 'Sticky', ginger: 'Gingery', cumin: 'Warm-spiced', basil: 'Herby', parsley: 'Herby',
    oregano: 'Herby', thyme: 'Herby', rosemary: 'Herby', mustard: 'Tangy', garlic: 'Garlicky', sriracha: 'Fiery' };
  function helpers(P, lang) {
    const names = (arr, plural) => arr.filter(Boolean).map((e) => ingName(e.c, plural, lang));
    return {
      n: (e, plural = true) => (e ? ingName(e.c, plural, lang) : ''),
      list: (arr, plural = true) => joinList(names(arr, plural), lang),
      join: (arr) => joinList(arr, lang),
      cap,
      adj: (...extra) => {
        const pick = [...extra, ...P.spices, P.citrus, P.chili, P.arom.find((a) => a.c === 'garlic')].filter(Boolean).find((f) => own(ADJ, f.c));
        return pick ? own(ADJ, pick.c) : 'Simple';
      },
    };
  }
  const NO_FRY = ['lentil', 'kidney bean', 'chickpea'];
  // Each template picks ingredients (d) and amounts; the words come from I.GEN[lang][key].
  const TEMPLATES = [
    { key: 'curry', meals: ['dinner'], ok: (P) => (P.curry || P.coconut) && (P.protein.length || P.mainVeg.length), parts(P) {
      const d = { prot: P.protein[0], veg: P.mainVeg.slice(0, 2), base: P.rice || P.cookedRice, arom: P.arom.slice(0, 2), curry: P.curry, coconut: P.coconut, tomatoes: P.tomatoes };
      return { d, time: 35, serves: 3, provides: ['leftover curry'], ings: [d.prot && amountFor(d.prot, 'protein'), ...d.veg.map((v) => amountFor(v, 'veg')),
        ...d.arom.map((a) => amountFor(a, 'veg')), d.curry && amountFor(d.curry, 'flavour'), d.coconut && amountFor(d.coconut, 'flavour'),
        d.tomatoes && amountFor(d.tomatoes, 'flavour'), d.base && amountFor(d.base, 'carb'), { n: 'oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'pasta', meals: ['lunch', 'dinner', 'late'], ok: (P) => P.pasta || P.cookedPasta, parts(P) {
      const sauce = P.tomatoes || P.cream || P.flavour.find((f) => f.c === 'pesto');
      const d = { base: P.pasta || P.cookedPasta, prot: P.protein.find((x) => x.c !== 'lentil'), veg: P.mainVeg.slice(0, 2), arom: P.arom.slice(0, 2),
        sauce, tomato: !!sauce && sauce === P.tomatoes, cheese: P.cheese, chili: P.chili };
      d.what = [d.prot, ...d.veg].filter(Boolean);
      return { d, time: 25, serves: 2, provides: ['cooked pasta'], ings: [amountFor(d.base, 'carb'), d.prot && amountFor(d.prot, 'protein'),
        ...d.veg.map((v) => amountFor(v, 'veg')), ...d.arom.map((a) => amountFor(a, 'veg')), sauce && amountFor(sauce, 'flavour'),
        d.cheese && amountFor(d.cheese, 'dairy'), d.chili && amountFor(d.chili, 'veg'), { n: 'olive oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'fried-rice', meals: ['lunch', 'dinner', 'late'], ok: (P) => (P.cookedRice || P.rice) && (P.egg || P.mainVeg.length), parts(P) {
      const d = { base: P.cookedRice || P.rice, egg: P.egg, prot: P.protein.find((x) => !NO_FRY.includes(x.c)), veg: P.mainVeg.slice(0, 3), soy: P.soy, arom0: P.arom[0] };
      return { d, time: 20, serves: 2, ings: [amountFor(d.base, 'carb'), d.egg && amountFor(d.egg, 'protein', 0.5), d.prot && amountFor(d.prot, 'protein', 0.7),
        ...d.veg.map((v) => amountFor(v, 'veg', 0.7)), d.soy && amountFor(d.soy, 'flavour'), d.arom0 && amountFor(d.arom0, 'veg'), { n: 'oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'frittata', meals: ['breakfast', 'lunch'], ok: (P) => P.egg && (P.mainVeg.length || P.potato || P.cheese), parts(P) {
      const d = { potato: P.potato, veg: P.mainVeg.slice(0, 2), onion: P.arom.find((a) => a.c !== 'garlic'), cheese: P.cheese };
      d.fillings = [d.potato, d.onion, ...d.veg].filter(Boolean);
      d.what = [d.potato, ...d.veg].filter(Boolean);
      return { d, time: 25, serves: 3, provides: ['leftover frittata'], ings: [amountFor(P.egg, 'protein', 1.5), d.potato && amountFor(d.potato, 'carb', 0.5),
        ...d.veg.map((v) => amountFor(v, 'veg')), d.onion && amountFor(d.onion, 'veg'), d.cheese && amountFor(d.cheese, 'dairy'),
        P.butter ? amountFor(P.butter, 'dairy') : { n: 'oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'wraps', meals: ['breakfast', 'lunch', 'late'], ok: (P) => P.tortilla && (P.protein.length || P.mainVeg.length), parts(P) {
      const sauce = P.dairy.find((x) => ['yogurt', 'sour cream', 'creme fraiche'].includes(x.c));
      const d = { prot: P.protein[0], veg: P.mainVeg.slice(0, 2), cheese: P.cheese, spice: P.spices[0] };
      return { d, time: 20, serves: 2, ings: [amountFor(P.tortilla, 'carb'), d.prot && amountFor(d.prot, 'protein'), ...d.veg.map((v) => amountFor(v, 'veg')),
        d.cheese && amountFor(d.cheese, 'dairy'), sauce && amountFor(sauce, 'dairy'), d.spice && amountFor(d.spice, 'flavour'), { n: 'oil', q: 1, u: 'tbsp' }] };
    } },
    { key: 'tray-bake', meals: ['dinner'], ok: (P) => P.potato && (P.protein.length || P.mainVeg.length >= 1), parts(P) {
      const onion = P.arom.find((a) => a.c === 'onion' || a.c === 'red onion');
      const d = { potato: P.potato, prot: P.protein.find((x) => !['lentil', 'tuna'].includes(x.c)), veg: P.mainVeg.slice(0, 3), spice: P.spices[0], citrus: P.citrus };
      return { d, time: 50, serves: 3, provides: d.prot ? ['leftover roast ' + d.prot.c] : [], ings: [amountFor(d.potato, 'carb'), d.prot && amountFor(d.prot, 'protein', 1.5),
        ...d.veg.map((v) => amountFor(v, 'veg')), onion && amountFor(onion, 'veg'), d.spice && amountFor(d.spice, 'flavour'),
        d.citrus && amountFor(d.citrus, 'flavour'), { n: 'oil', q: 3, u: 'tbsp' }] };
    } },
    { key: 'stir-fry', meals: ['lunch', 'dinner'], ok: (P) => (P.protein.length && P.mainVeg.length) || P.mainVeg.length >= 2, parts(P) {
      const ginger = P.flavour.find((f) => f.c === 'ginger');
      const d = { prot: P.protein.find((x) => !NO_FRY.includes(x.c)), veg: P.mainVeg.slice(0, 3), arom: P.arom.slice(0, 2), soy: P.soy, base: P.noodle || P.rice || P.cookedRice };
      return { d, time: 20, serves: 2, provides: d.base && d.base.c === 'rice' ? ['cooked rice'] : [], ings: [d.prot && amountFor(d.prot, 'protein'),
        ...d.veg.map((v) => amountFor(v, 'veg')), ...d.arom.map((a) => amountFor(a, 'veg')), d.soy && amountFor(d.soy, 'flavour'),
        ginger && amountFor(ginger, 'flavour'), d.base && amountFor(d.base, 'carb'), { n: 'oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'soup', meals: ['lunch', 'dinner'], ok: (P) => P.mainVeg.length + (P.potato ? 1 : 0) >= 2, parts(P) {
      const d = { veg: [P.potato, ...P.mainVeg].filter(Boolean).slice(0, 3), arom: P.arom.slice(0, 2), stock: P.stock, cream: P.cream, spice: P.spices[0] };
      return { d, time: 35, serves: 4, provides: ['leftover soup'], ings: [...d.veg.map((v) => amountFor(v, 'veg', 2)), ...d.arom.map((a) => amountFor(a, 'veg')),
        d.stock ? amountFor(d.stock, 'flavour') : { n: 'water', q: 800, u: 'ml' }, d.cream && amountFor(d.cream, 'dairy'),
        d.spice && amountFor(d.spice, 'flavour'), P.butter ? amountFor(P.butter, 'dairy') : { n: 'oil', q: 2, u: 'tbsp' }] };
    } },
    { key: 'salad', meals: ['lunch'], ok: (P) => P.mainVeg.length >= 2, parts(P) {
      const veg = P.mainVeg.filter((v) => !['potato', 'mushroom', 'eggplant', 'leek', 'broccoli', 'cauliflower', 'pumpkin', 'squash'].includes(v.c)).slice(0, 3);
      if (veg.length < 2) return null;
      const d = { veg, cheese: P.cheese, prot: P.protein[0], citrus: P.citrus };
      return { d, time: 10, serves: 2, ings: [...veg.map((v) => amountFor(v, 'veg')), d.cheese && amountFor(d.cheese, 'dairy'),
        d.prot && amountFor(d.prot, 'protein', 0.6), d.citrus && amountFor(d.citrus, 'flavour'), { n: 'olive oil', q: 3, u: 'tbsp' }] };
    } },
  ];
  // Returns { recipe, count, index } or null; `index` wraps around the ideas that fit the pantry.
  // With a meal, ideas that suit it come first.
  function generate(state, lang, index = 0, meal = null) {
    const P = pools(state);
    const h = helpers(P, lang);
    const fits = (tp) => (meal && tp.meals.includes(meal) ? 0 : 1);
    const built = TEMPLATES.filter((tp) => tp.ok(P)).sort((a, b) => fits(a) - fits(b)).map((tp) => {
      const p = tp.parts(P);
      if (!p) return null;
      return { ...p, ...I.GEN[lang][tp.key](p.d, h), key: tp.key, meals: tp.meals };
    }).filter(Boolean);
    if (!built.length) return null;
    const n = Number.isFinite(index) ? Math.trunc(index) : 0;
    const i = ((n % built.length) + built.length) % built.length;
    const g = built[i];
    const seen = new Set();
    const ingredients = g.ings.filter(Boolean).filter((x) => { const c = canon(x.n); if (seen.has(c)) return false; seen.add(c); return true; });
    return { index: i, count: built.length, recipe: { id: 'gen-' + g.key, generated: true, name: g.name.replace(/\s+/g, ' ').trim(),
      time: g.time, serves: g.serves, tags: [], meals: g.meals, provides: g.provides || [], ingredients, steps: g.steps.filter(Boolean) } };
  }

  // Plain-text recipe for sharing.
  function recipeText(state, r, servings, lang) {
    const a = analyse(state, r, servings);
    const lines = [recipeName(r, lang), `${r.time} min · ${servings} ${t(lang, 'u_serving', { n: servings })}`, '', t(lang, 'ingredients') + ':'];
    for (const x of a.rows) lines.push(`• ${fmtQty(x.need, x.ing.u, lang)} ${ingLabel(x.c, x.need, x.ing.u, lang)}${x.ing.opt ? ` (${t(lang, 'st_opt')})` : ''}`.replace('•  ', '• '));
    lines.push('', t(lang, 'method') + ':');
    recipeSteps(r, lang).forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('', t(lang, 'sharedFrom'));
    return lines.join('\n');
  }

  // ---------- supermarket offers ----------
  // Offer headings are Danish product names ("Dava danske frilandsæg"). offerIngredient() finds which
  // ingredient an offer is, or null for everything else (non-food, drinks, ready meals …).
  let daLex = null;
  function daLexicon() {
    if (daLex) return daLex;
    daLex = new Map();
    for (const [w, c] of Object.entries(I.DA_INPUT)) daLex.set(w, c);
    for (const [c, v] of Object.entries(I.ING_DA)) for (const w of (Array.isArray(v) ? v : [v])) if (!daLex.has(w.toLowerCase())) daLex.set(w.toLowerCase(), c);
    for (const k of [...daLex.keys()]) if (/^(rester af|kogt|kogte|skive|skiver|dåse|dåser) /.test(k) || /^(leftover|cooked) /.test(daLex.get(k)) || STAPLES.has(daLex.get(k))) daLex.delete(k);
    return daLex;
  }
  // Products that contain an ingredient word but are something else.
  const OFFER_BLOCK = /pålæg|postej|tærte|makrel|sild\b|tørkost|vådfoder|hele bønner|kaffebønner|kakao\S*mælk|fyldt pasta|prosecco|rioja|valpolicella|cava\b|champagne|salat\b.*(?:mayo|dressing)|færdigret|pizza|burger|suppe|juice|saft|sodavand|drik|smoothie|is\b|chips|slik|chokolade|kage|kiks\b|bolle|müsli|mysli|shampoo|sæbe|vask|creme\b|lotion|kat|hund|foder|blomst|plante|lys\b|vin\b|øl\b|snaps|spiritus|likør|te\b|kapsler|tyggegummi|vitamin|pastil|bouillonterning|krydderi(?:blanding)?|marinade|dressing|sauce\b|pesto.*pasta|leverpostej|frikadeller|nuggets|pålægs|spegepølse|salami|rullepølse|hamburgerryg|kakaomælk|drikkeyoghurt|yoghurt.*(?:drik|shot)|mos\b|remoulade.*sild/;
  // Short words only count as a whole word or with these safe endings.
  const SHORT_SUFFIX = { 'æg': /(?:lands|skrabe|øko|hønse|bur)æg$/, 'ost': /(?:skære|skive|rive|pizza|grill|fast|frisk)ost$/, 'ris': /(?:grød|jasmin|basmati|parboiled|fuldkorns)ris$/, 'løg': /(?:salat|skalotte|zitauer|bage)løg$/ };
  const NO_SUFFIX = new Set(['salat', 'kål', 'bær', 'brød', 'olie', 'bønner', 'sennep', 'eddike', 'karry', 'honning', 'sukker', 'kaffe', 'kakao', 'vanilje', 'kanel', 'kiks', 'mandler', 'nudler', 'chili', 'lime', 'fisk', 'skinke', 'ærter', 'laks', 'majs', 'kefir']);
  function offerIngredient(heading) {
    const c = offerIngredientRaw(heading);
    // Smoked or cured salmon is a different ingredient from fresh salmon.
    return c === 'salmon' && /røget|gravad/i.test(String(heading)) ? 'smoked salmon' : c;
  }
  function offerIngredientRaw(heading) {
    const text = String(heading || '').toLowerCase().replace(/[^a-zæøåéü0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text || OFFER_BLOCK.test(text)) return null;
    const lex = daLexicon();
    // What comes after "med" or "i" is flavouring or packing ("pølser med purløg", "makrel i tomat"), not the product.
    const words = text.split(/ (?:med|i|m) /)[0].split(' ');
    for (let n = Math.min(3, words.length); n >= 1; n--) {       // longest phrase first
      for (let i = 0; i + n <= words.length; i++) { const c = lex.get(words.slice(i, i + n).join(' ')); if (c) return c; }
    }
    for (const w of words) {                                     // Danish compounds: the last part is the food ("piskefløde")
      for (const [short, re] of Object.entries(SHORT_SUFFIX)) if (re.test(w)) return lex.get(short);
      let best = null;
      for (const [k, c] of lex) if (k.length >= 4 && !k.includes(' ') && !NO_SUFFIX.has(k) && w.length > k.length && w.endsWith(k) && (!best || k.length > best[0].length)) best = [k, c];
      if (best) return best[1];
    }
    return null;
  }
  // Remote data → safe, small structure. Unknown or malformed parts are dropped.
  const OFFER_CHAINS = ['netto', 'foetex', 'meny', 'kvickly'];
  function sanitizeOffers(raw) {
    const out = { updated: '', chains: {} };
    if (!raw || typeof raw !== 'object') return out;
    out.updated = typeof raw.updated === 'string' ? raw.updated.slice(0, 30) : '';
    for (const id of OFFER_CHAINS) {
      const ch = raw.chains && raw.chains[id];
      if (!ch || !Array.isArray(ch.offers)) continue;
      out.chains[id] = { name: str(ch.name, 30) || id, offers: ch.offers.slice(0, 600).map((o) => o && str(o.h, 120) && num(o.p) != null && isDay(o.from) && isDay(o.till) && own(I.ING_DA, o.c) != null && {
        h: str(o.h, 120), c: o.c, p: o.p, pp: num(o.pp), q: str(o.q, 40) || '', from: o.from, till: o.till }).filter(Boolean) };
    }
    return out;
  }
  // Map: ingredient → offers valid on `day` from the chosen chains, cheapest first.
  function offersIndex(data, chains, day = today()) {
    const idx = new Map();
    for (const id of OFFER_CHAINS) {
      if (!chains.includes(id) || !data.chains[id]) continue;
      for (const o of data.chains[id].offers) {
        if (o.from > day || o.till < day) continue;
        if (!idx.has(o.c)) idx.set(o.c, []);
        idx.get(o.c).push({ ...o, chain: id, chainName: data.chains[id].name });
      }
    }
    for (const list of idx.values()) list.sort((x, y) => x.p - y.p);
    return idx;
  }
  // Offers for a recipe's ingredients: [{ c (ingredient), offers: [...] }], staples left out.
  function recipeOffers(r, idx) {
    const out = [];
    for (const g of r.ingredients) {
      const c = canon(g.n);
      if (STAPLES.has(c)) continue;
      const hits = [];
      for (const [oc, list] of idx) if (nameMatch(oc, c)) hits.push(...list);
      if (hits.length) out.push({ c, offers: hits.sort((x, y) => x.p - y.p) });
    }
    return out;
  }

  // ---------- state & backups ----------
  const LOOKS = ['auto', 'fresh', 'diner', 'midnight'];
  const blankState = () => ({ v: 2, savedAt: 0, pantry: [], leftovers: [], shopping: [], log: [], lastCook: null, look: 'auto', lang: null, keepDays: 3, reminders: true, timeAware: true, offersOn: true, offerChains: ['netto', 'foetex', 'meny', 'kvickly'] });
  const str = (x, max = 80) => (typeof x === 'string' ? x.slice(0, max) : null);
  const num = (x) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 && x < 1e7 ? x : null);
  const isDay = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);
  const okUnit = (u) => (['', 'g', 'ml', 'pcs', 'tbsp', 'tsp'].includes(u) ? u : '');
  const okId = (x, uid) => (typeof x === 'string' && /^[a-z0-9]{1,20}$/.test(x) ? x : uid());
  // Turns anything (old saved data, an imported backup file) into a safe, complete state.
  // Throws only when `strict` and the input is not a Bentes køkken backup at all.
  function sanitizeState(raw, uid, strict = false) {
    const s = blankState();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { if (strict) throw new Error('not-a-backup'); return s; }
    if (strict && !('pantry' in raw || 'leftovers' in raw)) throw new Error('not-a-backup');
    const items = (arr) => (Array.isArray(arr) ? arr.slice(0, 500) : []);
    s.pantry = items(raw.pantry).map((p) => p && str(p.name) && { id: okId(p.id, uid), name: str(p.name), qty: num(p.qty), unit: num(p.qty) == null ? '' : okUnit(p.unit) || 'pcs' }).filter(Boolean);
    s.shopping = items(raw.shopping).map((p) => p && str(p.name) && { id: okId(p.id, uid), name: str(p.name), qty: num(p.qty), unit: num(p.qty) == null ? '' : okUnit(p.unit) || 'pcs', done: p.done === true }).filter(Boolean);
    s.leftovers = items(raw.leftovers).map((l) => l && str(l.name) && num(l.servings) > 0 && isDay(l.cooked) && {
      id: okId(l.id, uid), name: str(l.name), servings: num(l.servings), cooked: l.cooked,
      provides: items(l.provides).map((x) => str(x)).filter(Boolean).slice(0, 10), recipeId: l.recipeId && recipeById(l.recipeId) ? l.recipeId : null }).filter(Boolean);
    s.log = items(raw.log).map((x) => x && str(x.name) && isDay(x.date) && {
      id: okId(x.id, uid), date: x.date, name: str(x.name), recipeId: x.recipeId && recipeById(x.recipeId) ? x.recipeId : null,
      servings: num(x.servings) ?? 0, eaten: num(x.eaten) ?? 0, leftover: num(x.leftover) ?? 0 }).filter(Boolean).slice(0, 100);
    const lc = raw.lastCook;
    if (lc && typeof lc === 'object' && Array.isArray(lc.rows) && lc.rows.every((r) => r && typeof r === 'object' && r.left && typeof r.left === 'object' && r.used && typeof r.used === 'object')) {
      s.lastCook = { name: str(lc.name) || '', recipeId: lc.recipeId && recipeById(lc.recipeId) ? lc.recipeId : null, date: isDay(lc.date) ? lc.date : today(), leftover: num(lc.leftover) ?? 0,
        rows: lc.rows.slice(0, 40).map((r) => ({ name: str(r.name) ?? undefined, c: str(r.c) ?? undefined, lo: r.lo && str(r.lo.name) ? { name: str(r.lo.name), recipeId: r.lo.recipeId && recipeById(r.lo.recipeId) ? r.lo.recipeId : null } : undefined,
          used: { q: num(r.used.q) ?? 0, u: str(r.used.u, 10) || '', approx: r.used.approx === true },
          left: { k: ['qty', 'out', 'untracked', 'missing', 'diff'].includes(r.left.k) ? r.left.k : 'untracked', q: num(r.left.q) ?? 0, u: str(r.left.u, 10) || '' },
          tone: ['warn', 'out', ''].includes(r.tone) ? r.tone : '' })) };
    }
    s.look = LOOKS.includes(raw.look) ? raw.look : 'auto';
    s.lang = I.LANGS.includes(raw.lang) ? raw.lang : null;
    s.keepDays = Number.isInteger(raw.keepDays) && raw.keepDays >= 1 && raw.keepDays <= 7 ? raw.keepDays : 3;
    s.reminders = raw.reminders !== false;
    s.timeAware = raw.timeAware !== false;
    s.offersOn = raw.offersOn !== false;
    s.offerChains = Array.isArray(raw.offerChains) ? OFFER_CHAINS.filter((c) => raw.offerChains.includes(c)) : OFFER_CHAINS.slice();
    s.savedAt = typeof raw.savedAt === 'number' && Number.isFinite(raw.savedAt) && raw.savedAt > 0 ? raw.savedAt : 0;
    return s;
  }

  const core = { D, I, t, cap, joinList, ingName, ingLabel, pluralFor, recipeById, recipeName, recipeSteps, recipeRemix, tagName, dishName,
    today, parseDay, daysBetween, addDays, fmtDay, canon, nameMatch, leftoverNames, sources, findSource, STAPLES,
    UNIT_CHOICES, convert, nice, fmtNum, fmtQty, parseItem, splitItems, addToList, analyse, rankRecipes, OFFER_CHAINS, offerIngredient, sanitizeOffers, offersIndex, recipeOffers, ALLERGENS, ALLERGEN_KEYS, dietInfo, COLLECTIONS, inCollections, MEALS, mealSlot, recipeMeals, suitsMeal, cook, generate, recipeText,
    LOOKS, blankState, sanitizeState };
  root.PC_CORE = core;
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
})(typeof window !== 'undefined' ? window : globalThis);
