// Bentes køkken — extra ingredient words used by the recipe batches (web/recipes/batch-*.js).
// Key = the English "canonical" name exactly as core.js canon() returns it (lowercase, singular).
//   da       Danish name, or [singular, plural]
//   daInput  Danish words a user may type for it (lowercase)
//   aliases  other English names (lowercase, singular) that mean the same
//   cat      protein | veg | carb | dairy | flavour  (lets "Create a recipe" use it)
//   enPlural English plural, only when it differs from adding nothing
(window.PC_EXTRA = window.PC_EXTRA || { recipes: [], words: {} });
Object.assign(window.PC_EXTRA.words, {
  'cottage cheese': { da: 'hytteost', daInput: ['hytteost'], cat: 'dairy' },
  'cream cheese': { da: 'flødeost', daInput: ['flødeost', 'smøreost'], cat: 'dairy' },
  kefir: { da: 'kefir', daInput: ['kefir'], cat: 'dairy' },
  skyr: { da: 'skyr', daInput: ['skyr'], cat: 'dairy' },
  tahini: { da: 'tahin', daInput: ['tahin', 'tahini', 'sesampasta'], cat: 'flavour' },
  'sun dried tomato': { da: 'soltørrede tomater', daInput: ['soltørrede tomater', 'soltørret tomat'], aliases: ['sundried tomato'], cat: 'flavour', enPlural: 'sun-dried tomatoes' },
  gochujang: { da: 'gochujang', daInput: ['gochujang', 'chilipasta'], cat: 'flavour' },
  kimchi: { da: 'kimchi', daInput: ['kimchi'], cat: 'veg' },
  orzo: { da: 'orzo', daInput: ['orzo', 'risoni'], cat: 'carb' },
  gnocchi: { da: 'gnocchi', daInput: ['gnocchi'], cat: 'carb' },
  chorizo: { da: 'chorizo', daInput: ['chorizo'], cat: 'protein' },
  'peanut butter': { da: 'peanutbutter', daInput: ['peanutbutter', 'jordnøddesmør'], cat: 'flavour' },
  'sesame seed': { da: 'sesamfrø', daInput: ['sesamfrø', 'sesam'], cat: 'flavour', enPlural: 'sesame seeds' },
  'tortilla chip': { da: 'tortillachips', daInput: ['tortillachips', 'nachochips', 'nachos'], enPlural: 'tortilla chips' },
  'minced pork': { da: 'hakket svinekød', daInput: ['hakket svinekød', 'svinefars', 'hakket svin'], aliases: ['ground pork', 'pork mince'], cat: 'protein' },
  'pork and veal mince': { da: 'hakket svine- og kalvekød', daInput: ['hakket svine- og kalvekød', 'hakket svine og kalvekød', 'blandet fars', 'fars'], cat: 'protein' },
  'pork belly': { da: 'stegeflæsk', daInput: ['stegeflæsk', 'flæsk', 'svinebryst'], cat: 'protein' },
  'pork tenderloin': { da: 'svinemørbrad', daInput: ['svinemørbrad', 'mørbrad'], cat: 'protein' },
  cod: { da: 'torsk', daInput: ['torsk', 'torskefilet', 'torskefileter'], cat: 'protein' },
  'white fish': { da: 'hvid fisk', daInput: ['hvid fisk', 'fiskefilet', 'fiskefileter', 'sej', 'kuller'], cat: 'protein' },
  'smoked salmon': { da: 'røget laks', daInput: ['røget laks', 'koldrøget laks'], cat: 'protein' },
  remoulade: { da: 'remoulade', daInput: ['remoulade'], cat: 'flavour' },
  almond: { da: 'mandler', daInput: ['mandel', 'mandler'], enPlural: 'almonds' },
  'cherry sauce': { da: 'kirsebærsovs', daInput: ['kirsebærsovs', 'kirsebærsauce'] },
  coffee: { da: 'kaffe', daInput: ['kaffe', 'espresso'] },
  cocoa: { da: 'kakao', daInput: ['kakao', 'kakaopulver'] },
  sugar: { da: 'sukker', daInput: ['sukker', 'rørsukker'] },
  'baking powder': { da: 'bagepulver', daInput: ['bagepulver'] },
  vanilla: { da: 'vanilje', daInput: ['vanilje', 'vaniljesukker', 'vaniljestang'] },
  biscuit: { da: ['kiks', 'kiks'], daInput: ['kiks', 'kammerjunkere', 'savoiardi'], enPlural: 'biscuits' },
  cracker: { da: ['knækbrød', 'knækbrød'], daInput: ['knækbrød', 'crackers'], enPlural: 'crackers' },
  'rye bread': { da: ['skive rugbrød', 'skiver rugbrød'], daInput: ['rugbrød', 'rugbrødsskiver'], cat: 'carb' },
  'white bean': { da: 'hvide bønner', daInput: ['hvide bønner', 'smørbønner', 'cannellinibønner'], aliases: ['butter bean', 'cannellini bean'], cat: 'protein', enPlural: 'white beans' },
  dill: { da: 'dild', daInput: ['dild'], cat: 'flavour' },
  caper: { da: 'kapers', daInput: ['kapers'], cat: 'flavour', enPlural: 'capers' },
  ketchup: { da: 'ketchup', daInput: ['ketchup'], cat: 'flavour' },
  breadcrumb: { da: 'rasp', daInput: ['rasp', 'panko'], enPlural: 'breadcrumbs' },
  berry: { da: ['bær', 'bær'], daInput: ['bær', 'blåbær', 'hindbær', 'jordbær', 'frosne bær'], aliases: ['blueberry', 'raspberry', 'strawberry', 'frozen berry'], enPlural: 'berries' },
  'garam masala': { da: 'garam masala', daInput: ['garam masala'], cat: 'flavour' },
  'cooked potato': { da: 'kogte kartofler', daInput: ['kogte kartofler', 'kolde kartofler', 'kogt kartoffel'], enPlural: 'cooked potatoes' },
  'leftover bolognese': { da: 'rester af kødsovs', daInput: ['rester af kødsovs', 'kødsovs'] },
  'leftover rice pudding': { da: 'rester af risengrød', daInput: ['rester af risengrød', 'risengrød'] },
});
