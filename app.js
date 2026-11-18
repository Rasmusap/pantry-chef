// Bentes køkken — user interface. All cooking logic lives in core.js.
// Runs the same in a browser, as an installed web app (PWA) and inside the iOS app,
// where a small native bridge (window.webkit.messageHandlers.pc) adds saving, sharing and haptics.
(() => {
  'use strict';
  const C = window.PC_CORE;
  const VERSION = '1.0.0';
  const KEY = 'pantry-chef-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);

  // ---------- platform ----------
  const bridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.pc;
  const NATIVE = !!bridge;
  const STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const post = (msg) => { try { bridge && bridge.postMessage(msg); } catch { /* ignore */ } };
  document.documentElement.classList.toggle('native', NATIVE);
  document.documentElement.classList.toggle('standalone', NATIVE || STANDALONE);
  const haptic = (style = 'light') => post({ type: 'haptic', style });

  // ---------- state & saving ----------
  // The iOS app hands over its saved copy; the browser keeps one too. The newest one wins.
  function loadRaw() {
    let native = null; let local = null;
    const n = window.__PC_NATIVE__;
    if (n && n.state) { try { native = typeof n.state === 'string' ? JSON.parse(n.state) : n.state; } catch { /* ignore */ } }
    try { local = JSON.parse(localStorage.getItem(KEY)); } catch { /* ignore */ }
    if (native && local) return (Number(local.savedAt) || 0) > (Number(native.savedAt) || 0) ? local : native;
    return native || local;
  }
  let state = C.sanitizeState(loadRaw(), uid);
  function save() {
    state.savedAt = Date.now();
    undoFn = null; $('#toast-undo').hidden = true; // an older Undo must never wipe a newer change
    const json = JSON.stringify(state);
    try { localStorage.setItem(KEY, json); } catch { /* storage full or blocked: native copy still saved */ }
    post({ type: 'save', data: json });
    syncReminders();
  }
  // iOS app: a local notification on the eat-by day of each leftover dish.
  function syncReminders() {
    if (!NATIVE) return;
    const items = state.reminders ? state.leftovers.map((l) => ({ id: l.id, date: C.addDays(l.cooked, state.keepDays),
      title: t('remindTitle', { x: C.dishName(l, lang) }), body: t('remindBody', { s: qty(l.servings, 'serving') }) })) : [];
    post({ type: 'reminders', items });
  }
  function replaceState(next) { state = C.sanitizeState(next, uid); save(); applyLook(); setLang(state.lang || lang, true); }

  // ---------- language ----------
  const deviceLang = ((window.__PC_NATIVE__ && window.__PC_NATIVE__.lang) || navigator.language || '').toLowerCase();
  let lang = state.lang || (deviceLang.startsWith('da') ? 'da' : 'en');
  const t = (k, v) => C.t(lang, k, v);
  const ing = (c, plural) => C.ingName(c, plural, lang);
  const qty = (q, u) => C.fmtQty(q, u, lang);

  function applyStaticText() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    const other = lang === 'da' ? 'en' : 'da';
    const lt = $('#lang-toggle'); lt.textContent = t('switchTo'); lt.lang = other; lt.setAttribute('aria-label', t('switchToAria'));
    const quick = C.I.QUICK[lang] || C.D.QUICK;
    $('#quick').innerHTML = quick.map((q) => `<button class="chip" type="button" data-quick="${esc(q)}">+ ${esc(q)}</button>`).join('');
    $('#keep-days').innerHTML = [1, 2, 3, 4, 5, 6, 7].map((n) => `<option value="${n}">${esc(t('daysN', { n }))}</option>`).join('');
    $('#keep-days').value = String(state.keepDays);
    $('#version').textContent = t('version', { v: VERSION });
    $('#privacy-link').href = `privacy.html#${lang}`;
    $(`input[name=lang][value="${lang}"]`).checked = true;
    $(`input[name=look][value="${state.look}"]`).checked = true;
    $('#reminders').checked = state.reminders;
    $('#time-aware').checked = state.timeAware;
    $('#offers-on').checked = state.offersOn;
  }
  function setLang(l, quiet) {
    lang = C.I.LANGS.includes(l) ? l : 'en';
    if (state.lang !== lang) { state.lang = lang; save(); }
    post({ type: 'lang', lang });
    applyStaticText();
    renderAll();
    if (dlg.open && current) {
      if (current.recipe.generated) { const g = C.generate(state, lang, genIndex, currentMeal()); if (g) current = { ...current, recipe: g.recipe, count: g.count }; }
      renderDialog();
    }
    if (!quiet) haptic('selection');
  }

  // ---------- appearance ----------
  const THEME = { fresh: ['#f4f7f1', false], diner: ['#10625e', false], midnight: ['#0d1016', true] };
  const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function resolvedLook() { return state.look === 'auto' ? (darkMQ && darkMQ.matches ? 'midnight' : 'fresh') : state.look; }
  function applyLook() {
    const look = resolvedLook();
    document.documentElement.dataset.look = look;
    const [color, dark] = THEME[look];
    $('meta[name=theme-color]').content = color;
    post({ type: 'theme', mode: state.look === 'auto' ? 'auto' : (dark || look === 'diner' ? 'dark' : 'light'), color });
  }
  if (darkMQ) darkMQ.addEventListener('change', () => { if (state.look === 'auto') applyLook(); });

  // ---------- toast (with optional undo) ----------
  let toastTimer; let undoFn = null; let toastMs = 0;
  const hideToast = () => { $('#toast').classList.remove('show'); undoFn = null; };
  const armToast = () => { clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, toastMs); };
  function toast(msg, undo) {
    const el = $('#toast'); const b = $('#toast-undo');
    $('#toast-text').textContent = msg;
    undoFn = undo || null; b.hidden = !undo; b.textContent = t('undo');
    el.classList.add('show'); toastMs = undo ? 10000 : 4000; armToast();
  }
  // Keep the toast (and its Undo) while it is being used.
  ['focusin', 'pointerenter'].forEach((ev) => $('#toast').addEventListener(ev, () => clearTimeout(toastTimer)));
  ['focusout', 'pointerleave'].forEach((ev) => $('#toast').addEventListener(ev, () => { if ($('#toast').classList.contains('show')) armToast(); }));
  const announce = (msg) => { const el = $('#sr-status'); el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); };

  // In-page confirmation with a clearly named (and, if destructive, red) button. Resolves true/false.
  function confirmBox(message, okLabel, destructive) {
    const d = $('#confirm-dialog');
    $('#confirm-text').textContent = message;
    const ok = $('#confirm-ok'); ok.textContent = okLabel; ok.classList.toggle('danger-fill', !!destructive);
    $('#confirm-cancel').textContent = t('cancel');
    d.returnValue = ''; d.showModal(); $('#confirm-cancel').focus();
    return new Promise((resolve) => {
      d.addEventListener('close', () => resolve(d.returnValue === 'ok'), { once: true });
    });
  }
  $('#toast-undo').addEventListener('click', () => { if (undoFn) { undoFn(); undoFn = null; } $('#toast').classList.remove('show'); });
  // Snapshot before a destructive change; the returned function restores it.
  function undoable() { const snap = JSON.stringify(state); return () => { state = C.sanitizeState(JSON.parse(snap), uid); save(); renderAll(); haptic('light'); }; }

  // ---------- sharing & files ----------
  async function shareText(text, title) {
    if (NATIVE) { post({ type: 'share', text, title }); return; }
    if (navigator.share) { try { await navigator.share({ title, text }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(text); toast(t('copied')); } catch { prompt('', text); }
  }
  async function exportBackup() {
    const data = JSON.stringify({ app: 'pantry-chef', exported: new Date().toISOString(), ...state }, null, 2);
    const filename = `bentes-koekken-backup-${C.today()}.json`;
    if (NATIVE) { post({ type: 'export', filename, data }); return; }
    const file = new File([data], filename, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: filename }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(t('toastExported'));
  }

  // ---------- rendering ----------
  function setCount(id, n, key) {
    const el = $(id); el.textContent = n || '';
    el.setAttribute('aria-label', n ? t(key, { n }) : '');
  }
  function renderPantry() {
    const ul = $('#pantry-list');
    ul.innerHTML = state.pantry.length ? state.pantry.map((p) => `
      <li data-id="${p.id}">
        <span class="p-name">${esc(p.name)}</span>
        <span class="p-amt">
          <input type="number" inputmode="decimal" min="0" step="any" value="${p.qty ?? ''}" placeholder="—" aria-label="${esc(t('amountOf', { x: p.name }))}" data-qty>
          <select aria-label="${esc(t('unitFor', { x: p.name }))}" data-unit>${C.UNIT_CHOICES.map((u) => `<option value="${u}"${(p.unit || '') === u ? ' selected' : ''}>${esc(t('u_' + (u || 'unit')))}</option>`).join('')}</select>
        </span>
        <button class="icon-btn" type="button" data-remove aria-label="${esc(t('remove', { x: p.name }))}">✕</button>
      </li>`).join('') : `<li class="empty">${esc(t('pantryEmpty'))}<br><button class="btn small sample" type="button" data-sample>${esc(t('sampleBtn'))}</button></li>`;
    setCount('#count-pantry', state.pantry.length, 'countPantry');
    $('#clear-pantry').hidden = !state.pantry.length;
  }

  const missingNames = (a) => a.missing.map((x) => ing(x.c)).join(', ');

  // ---------- time of day ----------
  // The device clock is already local time wherever the user is, so no location is needed.
  let forcedMeal = null; // set by a #meal=… link (screenshots, testing)
  const currentMeal = () => (state.timeAware ? forcedMeal || C.mealSlot(new Date()) : null);
  const MEAL_ICON = { breakfast: '🌅', lunch: '☀️', dinner: '🍽️', late: '🌙' };
  const clockText = () => new Date().toLocaleTimeString(lang === 'da' ? 'da-DK' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  function renderMealNow(list, meal) {
    const box = $('#meal-now');
    const empty = !state.pantry.length && !state.leftovers.length;
    const picks = meal ? list.filter((x) => x.forMeal).slice(0, 3) : [];
    box.hidden = !meal || empty || !picks.length;
    if (box.hidden) { box.innerHTML = ''; return; }
    box.innerHTML = `
      <div class="meal-head">
        <span class="meal-icon" aria-hidden="true">${MEAL_ICON[meal]}</span>
        <div><h2 id="meal-now-title">${esc(t('mealHead_' + meal))}</h2><p class="meta" id="meal-time">${esc(t('mealNote', { time: forcedMeal ? '' : clockText() }))}</p></div>
        <button class="btn ghost small" type="button" data-meal-off>${esc(t('mealOff'))}</button>
      </div>
      <ul class="meal-picks" aria-label="${esc(t('mealListLabel'))}">${picks.map(({ r, a }) => `
        <li><button class="meal-pick" type="button" data-open="${r.id}">
          <span class="mp-name">${esc(C.recipeName(r, lang))}</span>
          <span class="mp-meta">${a.have}/${a.req.length} ${esc(t('ingredientsWord'))} · ${r.time} min${a.missing.length ? '' : ` · <strong class="ok">${esc(t('haveAll'))}</strong>`}</span>
        </button></li>`).join('')}</ul>`;
    if (forcedMeal) $('#meal-time').hidden = true;
  }
  let shownMeal = null;
  function refreshForClock() {
    const meal = currentMeal();
    if (meal !== shownMeal) { renderRecipes(); return; }
    const el = $('#meal-time'); if (el && !forcedMeal) el.textContent = t('mealNote', { time: clockText() });
  }
  setInterval(refreshForClock, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshForClock(); });
  function renderRecipes() {
    const onlyReady = $('#only-ready').checked;
    const q = $('#recipe-search').value.trim().toLowerCase();
    const meal = currentMeal(); shownMeal = meal;
    const list = C.rankRecipes(state, meal);
    const ready = list.filter((x) => x.a.missing.length <= 1 && x.a.have > 0);
    setCount('#count-recipes', ready.length, 'countReady');
    const matchesQuery = ({ r }) => !q || C.recipeName(r, lang).toLowerCase().includes(q)
      || r.tags.some((x) => C.tagName(x, lang).toLowerCase().includes(q) || x.includes(q))
      || r.ingredients.some((i) => ing(C.canon(i.n)).toLowerCase().includes(q));
    const matchesTag = ({ r, a }) => C.inCollections(r, [...activeColl]) && (!activeColl.has('offers') || missingOffers(r, a).length > 0);
    renderTagChips();
    const shown = (onlyReady ? ready : list).filter(matchesQuery).filter(matchesTag);
    const empty = !state.pantry.length && !state.leftovers.length;
    renderMealNow(list, meal);
    if (empty && !q) {
      $('#recipe-grid').innerHTML = `<div class="empty wide"><p>${esc(t('recipesEmpty'))}</p><button class="btn primary sample" type="button" data-sample>${esc(t('sampleBtn'))}</button></div>`;
      return;
    }
    if (q || activeColl.size) announce(t('resultsN', { n: shown.length }));
    const card = ({ r, a, forMeal }) => `<article class="recipe-card${a.pct === 1 ? ' full' : ''}">
          <div class="rc-top"><h3>${esc(C.recipeName(r, lang))}</h3><span class="badges">${forMeal ? `<span class="badge meal">${MEAL_ICON[meal]} ${esc(t('meal_' + meal))}</span>` : ''}${a.usesLeftover ? `<span class="badge">${esc(t('usesLeftovers'))}</span>` : ''}${missingOffers(r, a).length ? `<span class="badge offer">🏷️ ${esc(t('onOffer', { n: missingOffers(r, a).length }))}</span>` : ''}</span></div>
          ${dietBadges(r)}
          <p class="meta">${esc(t('cardMeta', { t: r.time, s: r.serves, tags: r.tags.map((x) => C.tagName(x, lang)).join(', ') }))}</p>
          <div class="meter" aria-hidden="true"><span style="width:${Math.round(a.pct * 100)}%"></span></div>
          <p class="have-line"><strong>${a.have}/${a.req.length}</strong> ${esc(t('ingredientsWord'))} · ${a.missing.length ? `<span class="miss">${esc(t('missing', { x: missingNames(a) }))}</span>` : `<span class="ok">${esc(t('haveAll'))}</span>`}</p>
          <button class="btn" type="button" data-open="${r.id}">${esc(t('viewRecipe'))}</button>
        </article>`;
    const readyShown = shown.filter((x) => x.a.missing.length <= 1 && x.a.have > 0);
    const rest = shown.filter((x) => !readyShown.includes(x));
    // Long lists: show the first PAGE of a group, then a "Show all" button.
    const PAGE = 12;
    const group = (key, title, items) => {
      if (!items.length) return '';
      const all = q || expanded.has(key) || items.length <= PAGE + 3;
      const visible = all ? items : items.slice(0, PAGE);
      return `<h3 class="group-title">${esc(title)} <span class="meta">(${items.length})</span></h3>${visible.map(card).join('')}`
        + (all ? '' : `<div class="show-more"><button class="btn" type="button" data-show-all="${key}">${esc(t('showAll', { n: items.length }))}</button></div>`);
    };
    $('#recipe-grid').innerHTML = shown.length ? group('ready', t('readyNow'), readyShown) + group('rest', t('moreRecipes'), rest)
      : `<p class="empty wide">${esc(q ? t('noMatch', { q }) : activeColl.size ? t('noTagMatch') : t('noReady'))}</p>`;
  }
  // ---------- supermarket offers ----------
  // offers.json is made by tools/fetch_offers.js (run daily on GitHub). The app only downloads that one file.
  const OFFERS_URLS = NATIVE ? ['https://rasmusap.github.io/pantry-chef/offers.json', 'offers.json'] : ['offers.json'];
  const OFFERS_CACHE = 'bentes-offers-v1';
  let offersData = C.sanitizeOffers((() => { try { return JSON.parse(localStorage.getItem(OFFERS_CACHE)); } catch { return null; } })());
  let offerIdx = new Map(); let offersExpanded = false;
  const rebuildOffers = () => { offerIdx = state.offersOn ? C.offersIndex(offersData, state.offerChains) : new Map(); };
  async function loadOffers() {
    if (!state.offersOn) { rebuildOffers(); return; }
    for (const url of OFFERS_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) continue;
        const fresh = C.sanitizeOffers(await res.json());
        if (!Object.keys(fresh.chains).length) continue;
        offersData = fresh;
        try { localStorage.setItem(OFFERS_CACHE, JSON.stringify(fresh)); } catch { /* cache is optional */ }
        break;
      } catch { /* offline: keep the cached offers */ }
    }
    rebuildOffers(); renderRecipes(); renderOffers();
  }
  // Offers that matter for a recipe: only for ingredients you don't have yet.
  function missingOffers(r, a) {
    if (!offerIdx.size) return [];
    const lacking = new Set(a.missing.map((x) => x.c)); // needed and not at home (optional extras don't count)
    return C.recipeOffers(r, offerIdx).filter((x) => lacking.has(x.c));
  }
  const price = (p) => `${lang === 'da' ? String(Math.round(p * 100) / 100).replace('.', ',') : String(Math.round(p * 100) / 100)} kr`;
  const offerText = (o) => `${o.chainName} ${price(o.p)} · ${o.h}${o.q ? ` (${o.q})` : ''}`;
  function renderOffers() {
    const box = $('#offers-card');
    const has = state.offersOn && Object.keys(offersData.chains).length > 0;
    box.hidden = !has;
    if (!has) { box.innerHTML = ''; return; }
    const all = [...offerIdx.entries()].flatMap(([c, list]) => list.map((o) => ({ ...o, c }))).sort((a, b) => ing(a.c).localeCompare(ing(b.c), lang) || a.p - b.p);
    const shown = offersExpanded ? all : all.slice(0, 15);
    const updated = offersData.updated ? new Date(offersData.updated).toLocaleDateString(lang === 'da' ? 'da-DK' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '';
    box.innerHTML = `
      <div class="card-head"><h2>${esc(t('offersTitle'))}</h2><span class="meta">${updated ? esc(t('offersUpdated', { d: updated })) : ''}</span></div>
      <div class="tag-chips offer-chains" role="group" aria-label="${esc(t('offerChainsLabel'))}">${C.OFFER_CHAINS.filter((id) => offersData.chains[id]).map((id) => `<button class="chip${state.offerChains.includes(id) ? ' on' : ''}" type="button" data-chain="${id}" aria-pressed="${state.offerChains.includes(id)}">${esc(offersData.chains[id].name)}</button>`).join('')}</div>
      ${all.length ? `<ul class="offers">${shown.map((o, i) => `<li>
          <div class="of-main"><strong>${esc(o.h)}</strong><span class="meta">${esc([o.chainName, o.q, t('offerUntil', { d: C.fmtDay(o.till, lang) })].filter(Boolean).join(' · '))}</span></div>
          <span class="of-price">${esc(price(o.p))}${o.pp ? ` <s>${esc(price(o.pp))}</s>` : ''}</span>
          <button class="icon-btn" type="button" data-offer-add="${esc(o.c)}" data-offer-label="${esc(o.chainName + ', ' + price(o.p))}" aria-label="${esc(t('offerAdd', { x: ing(o.c) }))}">+</button>
        </li>`).join('')}</ul>${all.length > shown.length ? `<div class="show-more"><button class="btn" type="button" data-offers-all>${esc(t('showAll', { n: all.length }))}</button></div>` : ''}`
      : `<p class="empty">${esc(t('offersEmpty'))}</p>`}
      <p class="hint">${esc(t('offersNote'))}</p>`;
  }

  // ---------- diet and allergen labels ----------
  const DIET_CODE = { vegan: 'VG', vegetarian: 'V' };
  const allergenList = (keys) => keys.map((k) => `${t('al_' + k)} (${t('ac_' + k)})`).join(', ');
  function dietBadges(r) {
    const d = C.dietInfo(r);
    const dietTxt = (DIET_CODE[d.diet] || t('diet_' + d.diet)) + (d.labelCheck ? '?' : '');
    const label = [t('dietName_' + d.diet) + (d.labelCheck ? t('dietLabelCheck') : ''), d.contains.length ? t('contains', { x: allergenList(d.contains) }) : t('noAllergens')].join('. ');
    return `<p class="diet-row" aria-label="${esc(label)}" title="${esc(label)}">
      <span class="diet ${d.diet}" aria-hidden="true">${esc(dietTxt)}</span>${d.contains.map((k) => `<span class="al" aria-hidden="true">${esc(t('ac_' + k))}</span>`).join('')}${d.may.length ? `<span class="al may" aria-hidden="true">${esc(d.may.map((k) => t('ac_' + k)).join(' '))}?</span>` : ''}</p>`;
  }
  function dietSection(r) {
    const d = C.dietInfo(r);
    const swaps = d.swaps.map((s) => t('swap', { from: ing(s.from), to: ing(s.to) })).join('; ');
    return `<section class="diet-box" aria-labelledby="diet-title">
      <h3 id="diet-title">${esc(t('dietTitle'))}</h3>
      <p><span class="diet ${d.diet}">${esc((DIET_CODE[d.diet] || t('diet_' + d.diet)) + (d.labelCheck ? '?' : ''))}</span> <strong>${esc(t('dietName_' + d.diet) + (d.labelCheck ? t('dietLabelCheck') : ''))}</strong>${swaps ? ` · ${esc(t('vegOption', { x: swaps }))}` : ''}</p>
      <p>${esc(d.contains.length ? t('contains', { x: allergenList(d.contains) }) : t('noAllergens'))}</p>
      ${d.may.length ? `<p>${esc(t('mayContain', { x: allergenList(d.may) }))}</p>` : ''}
      ${d.optional.length ? `<p>${esc(t('optionalContains', { x: allergenList(d.optional) }))}</p>` : ''}
      <p class="meta">${esc(t('allergyNote'))}</p>
    </section>`;
  }
  function renderLegend() {
    const keys = C.ALLERGEN_KEYS;
    $('#diet-legend').innerHTML = `<summary>${esc(t('legendTitle'))}</summary>
      <p><span class="diet vegan">VG</span> ${esc(t('dietName_vegan'))} · <span class="diet vegetarian">V</span> ${esc(t('dietName_vegetarian'))} · <span class="diet fish">${esc(t('diet_fish'))}</span> ${esc(t('dietName_fish'))} · <span class="diet meat">${esc(t('diet_meat'))}</span> ${esc(t('dietName_meat'))}</p>
      <p>${keys.map((k) => `<span class="al">${esc(t('ac_' + k))}</span> ${esc(t('al_' + k))}`).join(' · ')}</p>
      <p class="meta">${esc(t('legendMay'))} ${esc(t('allergyNote'))}</p>`;
  }

  // Collection chips ("Under 30 min", "Budget friendly", cuisines …). Several can be on at once; "All" clears them.
  // Only collections that have at least one recipe are shown. Not saved: they are for browsing right now.
  const activeColl = new Set(); const expanded = new Set();
  function renderTagChips() {
    renderLegend();
    const box = $('#tag-chips');
    const usable = C.COLLECTIONS.filter((c) => C.D.RECIPES.some(c.test));
    box.innerHTML = `<button class="chip${activeColl.size ? '' : ' on'}" type="button" data-tag="" aria-pressed="${!activeColl.size}">${esc(t('allRecipes'))}</button>`
      + (offerIdx.size ? `<button class="chip${activeColl.has('offers') ? ' on' : ''}" type="button" data-tag="offers" aria-pressed="${activeColl.has('offers')}"><span aria-hidden="true">🏷️</span> ${esc(t('coll_offers'))}</button>` : '')
      + usable.map((c) => `<button class="chip${activeColl.has(c.key) ? ' on' : ''}" type="button" data-tag="${c.key}" aria-pressed="${activeColl.has(c.key)}"><span aria-hidden="true">${c.icon}</span> ${esc(t('coll_' + c.key))}</button>`).join('');
  }

  function rowName(x) {
    if (x.lo) return `${C.dishName(x.lo, lang)} ${t('leftoverSuffix')}`;
    return x.name != null ? x.name : ing(x.c);
  }
  function rowLeft(x) {
    switch (x.left.k) {
      case 'qty': return qty(x.left.q, x.left.u);
      case 'out': return t('usedUp');
      case 'untracked': return t('untracked');
      case 'missing': return t('missingSkip');
      default: return t('diffUnit', { q: qty(x.left.q, x.left.u) });
    }
  }
  function renderLeftovers() {
    const lc = state.lastCook;
    $('#last-cook').innerHTML = lc ? `
      <div class="card last">
        <div class="card-head"><h2>${esc(t('justCooked', { x: C.dishName(lc, lang) }))}</h2><button class="btn ghost small" type="button" data-dismiss-last>${esc(t('dismiss'))}</button></div>
        <p class="sub">${esc(lc.leftover ? t('wentToLeftovers', { s: qty(lc.leftover, 'serving') }) : t('noLeftoverServings'))}${esc(t('whatTook'))}</p>
        ${lc.rows.length ? `<div class="table-wrap"><table><thead><tr><th scope="col">${esc(t('thIng'))}</th><th scope="col">${esc(t('thUsed'))}</th><th scope="col">${esc(t('thLeft'))}</th></tr></thead><tbody>
        ${lc.rows.map((x) => `<tr class="${x.tone || ''}"><th scope="row">${esc(rowName(x))}</th><td>${esc(qty(x.used.q, x.used.u))}${x.used.approx ? ' ≈' : ''}</td><td>${esc(rowLeft(x))}</td></tr>`).join('')}</tbody></table></div>`
        : `<p class="sub">${esc(t('onlyStaples'))}</p>`}
      </div>` : '';

    const total = state.leftovers.reduce((s, l) => s + l.servings, 0);
    $('#servings-total').textContent = total ? t('inFridge', { s: qty(total, 'serving') }) : t('fridgeEmpty');
    setCount('#count-left', state.leftovers.length, 'countLeft');
    const day = C.today();
    $('#leftover-list').innerHTML = state.leftovers.length ? state.leftovers.map((l) => {
      const left = state.keepDays - C.daysBetween(l.cooked, day);
      const status = left < 0 ? ['past', t('pastEat')] : left === 0 ? ['today', t('eatToday')] : ['fine', t('daysLeft', { n: left })];
      const names = C.leftoverNames(l);
      const uses = C.D.RECIPES.filter((r) => r.id !== l.recipeId && r.ingredients.some((i) => [i.n, ...(i.alt || [])].map(C.canon).some((w) => names.includes(w))));
      const own = l.recipeId && C.recipeById(l.recipeId);
      const remix = own && C.recipeRemix(own, lang);
      return `<li class="lo ${status[0]}" data-id="${l.id}">
        <div class="lo-main">
          <strong>${esc(C.dishName(l, lang))}</strong>
          <span class="meta">${esc(t('loMeta', { s: qty(l.servings, 'serving'), d: C.fmtDay(l.cooked, lang), e: C.fmtDay(C.addDays(l.cooked, state.keepDays), lang) }))}</span>
          <span class="status">${esc(status[1])}</span>
        </div>
        <div class="lo-actions">
          <button class="btn small" type="button" data-eat>${esc(t('ateOne'))}</button>
          <button class="btn ghost small" type="button" data-toss>${esc(t('toss'))}</button>
        </div>
        ${remix ? `<p class="idea">💡 ${esc(remix)}</p>` : ''}
        ${uses.length ? `<div class="uses"><span>${esc(t('useIn'))}</span> ${uses.map((r) => `<button class="chip" type="button" data-open="${r.id}">${esc(C.recipeName(r, lang))}</button>`).join('')}</div>` : ''}
      </li>`;
    }).join('') : `<li class="empty">${esc(t('loEmpty'))}</li>`;

    $('#log-list').innerHTML = state.log.length ? state.log.map((x) => `<li><span>${esc(C.fmtDay(x.date, lang))}</span> ${esc(t('logLine', { x: C.dishName(x, lang), s: qty(x.servings, 'serving'), e: qty(x.eaten, 'serving') }))}${x.leftover ? `<em>${esc(t('logLeft', { l: qty(x.leftover, 'serving') }))}</em>` : ''}</li>`).join('')
      : `<li class="empty">${esc(t('logEmpty'))}</li>`;
    $('#clear-log').hidden = !state.log.length;
  }

  const shopLabel = (p) => `${p.qty != null ? qty(p.qty, p.unit) + ' ' : ''}${p.name}`;
  function renderShopping() {
    $('#shop-list').innerHTML = state.shopping.length ? state.shopping.map((p) => `
      <li data-id="${p.id}" class="${p.done ? 'done' : ''}">
        <label class="shop-item"><input type="checkbox" data-done${p.done ? ' checked' : ''}> <span>${esc(shopLabel(p))}</span></label>
        <button class="icon-btn" type="button" data-remove aria-label="${esc(t('remove', { x: p.name }))}">✕</button>
      </li>`).join('') : `<li class="empty">${esc(t('shopEmpty'))}</li>`;
    const open = state.shopping.filter((p) => !p.done).length;
    setCount('#count-shop', open, 'countShop');
    const anyDone = state.shopping.some((p) => p.done);
    $('#shop-move').disabled = !anyDone; $('#shop-clear').disabled = !anyDone; $('#shop-share').disabled = !state.shopping.length;
  }

  function renderAll() { renderPantry(); renderRecipes(); renderLeftovers(); renderShopping(); renderOffers(); }

  // ---------- recipe dialog ----------
  const dlg = $('#recipe-dialog');
  let current = null; // { recipe, servings, count? }
  let genIndex = 0;
  function openRecipe(r, servings = r.serves, count) {
    current = { recipe: r, servings, count };
    renderDialog();
    if (!dlg.open) dlg.showModal();
    $('#dlg-title', dlg).focus({ preventScroll: true });
  }
  function renderDialog() {
    const { recipe: r, servings } = current;
    const a = C.analyse(state, r, servings);
    const ro = new Map(missingOffers(r, a).map((x) => [x.c, x.offers]));
    const eatenDefault = Math.min(servings, 2);
    const tags = r.generated ? [t('createdTag')] : r.tags.map((x) => C.tagName(x, lang));
    const remix = C.recipeRemix(r, lang);
    $('#dialog-body').innerHTML = `
      <div class="dlg-head">
        <div>
          <p class="eyebrow">${esc(r.generated ? t('eyebrowGen', { i: genIndex + 1, n: current.count }) : t('eyebrowRecipe'))}</p>
          <h2 id="dlg-title" tabindex="-1">${esc(C.recipeName(r, lang))}</h2>
          <p class="meta">${r.time} min · ${esc(tags.join(', '))}</p>
        </div>
        <button class="icon-btn" type="button" data-close aria-label="${esc(t('close'))}">✕</button>
      </div>
      <div class="dlg-tools">
        <div class="servings" role="group" aria-label="${esc(t('servings'))}">
          <span>${esc(t('servings'))}</span>
          <button class="icon-btn" type="button" data-serv="-1" aria-label="${esc(t('fewer'))}"${servings <= 1 ? ' disabled' : ''}>−</button>
          <output aria-live="polite">${servings}</output>
          <button class="icon-btn" type="button" data-serv="1" aria-label="${esc(t('more'))}"${servings >= 20 ? ' disabled' : ''}>+</button>
        </div>
        <button class="btn small" type="button" data-share>${esc(t('shareRecipe'))}</button>
      </div>
      <div class="dlg-cols">
        <div>
          <h3>${esc(t('ingredients'))}</h3>
          <ul class="ings">${a.rows.map((x) => {
            const st = x.staple && !x.src ? 'staple' : !x.src ? (x.ing.opt ? 'opt' : 'missing') : x.short != null ? 'short' : 'have';
            const label = st === 'have' ? t(x.src.kind === 'leftover' ? 'st_leftover' : x.src.kind === 'staple' ? 'st_staple' : 'st_have')
              : st === 'short' ? t('st_short', { q: qty(x.short, x.ing.u) }) : t('st_' + st);
            const sub = x.src && x.src.kind === 'pantry' && C.canon(x.src.item.name) !== x.c ? ` <span class="via">${esc(t('yours', { x: x.src.item.name }))}</span>` : '';
            const mark = st === 'have' && x.src.kind === 'pantry' ? `<span class="st tick" aria-label="${esc(label)}">✓</span>` : `<span class="st">${esc(label)}</span>`;
            return `<li class="${st}"><span class="amt">${esc(qty(x.need, x.ing.u))}</span> <span class="nm">${esc(C.ingLabel(x.c, x.need, x.ing.u, lang))}${sub}</span> ${mark}${ro.has(x.c) ? `<span class="of-line">🏷️ ${esc(ro.get(x.c).slice(0, 2).map(offerText).join(' · '))}</span>` : ''}</li>`;
          }).join('')}</ul>
          ${a.missing.length ? `<button class="btn small add-missing" type="button" data-missing>${esc(t('addMissingToList'))}</button>` : ''}
        </div>
        <div>
          <h3>${esc(t('method'))}</h3>
          <ol class="steps">${C.recipeSteps(r, lang).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
          ${remix ? `<p class="idea">💡 ${esc(t('leftoverIdea'))} ${esc(remix)}</p>` : ''}
        </div>
      </div>
      ${dietSection(r)}
      <form class="cook-box" data-cook>
        <h3>${esc(t('cookIt'))}</h3>
        <p>${t('cookingN', { n: servings })}</p>
        <div class="row wrap">
          <label class="narrow">${esc(t('eatenNow'))} <input type="number" inputmode="decimal" name="eaten" min="0" max="${servings}" step="0.5" value="${eatenDefault}" required></label>
          <button class="btn primary" type="submit">${esc(t('cookBtn'))}</button>
          ${r.generated && current.count > 1 ? `<button class="btn" type="button" data-regen>${esc(t('tryAnother'))}</button>` : ''}
        </div>
        ${a.missing.length ? `<p class="warn">${esc(t('missingWarn', { x: missingNames(a) }))}</p>` : ''}
      </form>
      <div class="cook-bar"><button class="btn primary" type="button" data-jump-cook>${esc(t('cookThis'))}</button></div>`;
  }
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) return dlg.close();
    const b = e.target.closest('button'); if (!b) return;
    if (b.matches('[data-close]')) dlg.close();
    else if (b.matches('[data-jump-cook]')) {
      const box = $('.cook-box', dlg); box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      $('input[name=eaten]', box).focus({ preventScroll: true });
    }
    else if (b.dataset.serv) {
      current.servings = Math.min(20, Math.max(1, current.servings + Number(b.dataset.serv)));
      renderDialog(); haptic('selection'); announce(`${current.servings} ${t('u_serving', { n: current.servings })}`);
      const again = $('[data-serv="' + b.dataset.serv + '"]', dlg); (again.disabled ? $('[data-serv]:not([disabled])', dlg) : again).focus();
    } else if (b.matches('[data-regen]')) {
      genIndex += 1;
      const g = C.generate(state, lang, genIndex, currentMeal());
      if (g) { genIndex = g.index; current = { recipe: g.recipe, servings: g.recipe.serves, count: g.count }; renderDialog(); $('[data-regen]', dlg)?.focus(); haptic('selection'); }
    } else if (b.matches('[data-share]')) {
      shareText(C.recipeText(state, current.recipe, current.servings, lang), C.recipeName(current.recipe, lang));
    } else if (b.matches('[data-missing]')) {
      const a = C.analyse(state, current.recipe, current.servings);
      for (const x of a.missing) {
        const counted = x.ing.u !== 'serving';
        C.addToList(state.shopping, { name: counted ? C.ingLabel(x.c, x.need, x.ing.u, lang) : ing(x.c), qty: counted ? C.nice(x.need, x.ing.u) : null, unit: counted ? x.ing.u : '' }, uid);
      }
      save(); renderShopping(); haptic('success');
      toast(t('toastAddedToList', { n: a.missing.length }));
      b.disabled = true;
    }
  });
  dlg.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-cook]')) return;
    e.preventDefault();
    const { recipe, servings } = current;
    const eaten = Math.min(servings, Math.max(0, Number(new FormData(e.target).get('eaten')) || 0));
    const undo = undoable();
    C.cook(state, recipe, servings, eaten, { uid, lang });
    save(); dlg.close(); renderAll(); selectTab('leftovers'); haptic('success');
    $('#panel-leftovers h1').focus();
    toast(`${t('toastCooked', { x: C.recipeName(recipe, lang) })}${servings - eaten > 0 ? t('toastSaved', { s: qty(servings - eaten, 'serving') }) : ''}.`, undo);
  });

  // ---------- tabs ----------
  const TABS = ['pantry', 'recipes', 'leftovers', 'shopping', 'settings'];
  function selectTab(name, focus = false) {
    for (const tb of TABS) {
      const on = tb === name; const tab = $('#tab-' + tb);
      tab.setAttribute('aria-selected', on); tab.tabIndex = on ? 0 : -1; $('#panel-' + tb).hidden = !on;
      if (on && focus) tab.focus();
    }
    if (name === 'recipes') renderRecipes();
    if (name === 'leftovers') { const d = $('#lo-date'); if (!d.value || d.max !== C.today()) { d.max = C.today(); d.value = C.today(); } }
    window.scrollTo({ top: 0 });
  }
  $('.tabs').addEventListener('click', (e) => { const b = e.target.closest('[role=tab]'); if (b) { selectTab(b.id.replace('tab-', '')); haptic('selection'); } });
  $('.tabs').addEventListener('keydown', (e) => {
    const i = TABS.findIndex((tb) => $('#tab-' + tb).getAttribute('aria-selected') === 'true');
    const n = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: TABS.length - 1 - i }[e.key]; if (n == null) return;
    e.preventDefault(); selectTab(TABS[(i + n + TABS.length) % TABS.length], true);
  });

  // ---------- events: ingredients ----------
  function addItems(text, list) {
    const items = C.splitItems(text).map(C.parseItem).filter(Boolean);
    items.forEach((it) => C.addToList(list, it, uid));
    return items;
  }
  $('#add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#add-input');
    const items = addItems(input.value, state.pantry);
    input.setAttribute('aria-invalid', String(!items.length)); $('#add-error').hidden = !!items.length;
    if (!items.length) { input.focus(); return; }
    input.value = ''; save(); renderAll(); haptic('light');
    toast(t('toastAdded', { x: items.map((i) => i.name).join(', ') }));
  });
  $('#quick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-quick]'); if (!b) return;
    addItems(b.dataset.quick, state.pantry); save(); renderAll(); haptic('light'); toast(t('toastAdded', { x: b.dataset.quick }));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-sample]')) return;
    addItems(t('sample'), state.pantry); save(); renderAll(); haptic('success');
  });
  $('#pantry-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]'); if (!b) return;
    const id = b.closest('li').dataset.id; const p = state.pantry.find((x) => x.id === id);
    const undo = undoable();
    state.pantry = state.pantry.filter((x) => x.id !== id); save(); renderAll();
    toast(t('toastRemoved', { x: p ? p.name : '' }), undo);
    ($('#pantry-list [data-remove]') || $('#add-input')).focus();
  });
  $('#pantry-list').addEventListener('change', (e) => {
    const li = e.target.closest('li'); const p = li && state.pantry.find((x) => x.id === li.dataset.id); if (!p) return;
    if (e.target.matches('[data-qty]')) {
      const v = e.target.value.trim(); const n = Number(v);
      p.qty = v === '' || !(n >= 0) ? null : Math.min(n, 1e6);
      if (p.qty != null && !p.unit) { p.unit = 'pcs'; li.querySelector('[data-unit]').value = 'pcs'; }
      if (p.qty == null) { p.unit = ''; li.querySelector('[data-unit]').value = ''; }
    }
    if (e.target.matches('[data-unit]')) p.unit = e.target.value;
    save(); renderRecipes();
  });
  $('#clear-pantry').addEventListener('click', () => {
    if (!state.pantry.length) return;
    const undo = undoable(); state.pantry = []; save(); renderAll(); toast(t('toastRemoved', { x: t('yourPantry') }), undo);
  });
  $('#go-recipes').addEventListener('click', () => selectTab('recipes', true));

  // ---------- events: recipes ----------
  $('#only-ready').addEventListener('change', renderRecipes);
  $('#recipe-search').addEventListener('input', renderRecipes);
  $('#tag-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]'); if (!b) return;
    const key = b.dataset.tag;
    if (!key) activeColl.clear(); else if (activeColl.has(key)) activeColl.delete(key); else activeColl.add(key);
    expanded.clear(); renderRecipes(); haptic('selection');
    $(`#tag-chips [data-tag="${key}"]`)?.focus();
  });
  $('#recipe-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-show-all]'); if (!b) return;
    expanded.add(b.dataset.showAll); renderRecipes();
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const r = C.recipeById(b.dataset.open); if (r) openRecipe(r);
  });
  $('#create-btn').addEventListener('click', () => {
    genIndex = 0;
    const g = C.generate(state, lang, 0, currentMeal());
    if (!g) return toast(t('needMore'));
    openRecipe(g.recipe, g.recipe.serves, g.count);
  });

  // ---------- events: leftovers ----------
  $('#panel-leftovers').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.matches('[data-dismiss-last]')) { state.lastCook = null; save(); renderLeftovers(); return; }
    const li = b.closest('li.lo'); const l = li && state.leftovers.find((x) => x.id === li.dataset.id); if (!l) return;
    const name = C.dishName(l, lang); const undo = undoable(); let msg = '';
    if (b.matches('[data-eat]')) { l.servings = Math.max(0, l.servings - 1); msg = l.servings ? t('toastEnjoy', { s: qty(l.servings, 'serving'), x: name }) : t('toastFinished', { x: name }); }
    if (b.matches('[data-toss]')) { l.servings = 0; msg = t('toastTossed', { x: name }); }
    state.leftovers = state.leftovers.filter((x) => x.servings > 0); save(); renderAll(); haptic('light');
    if (msg) toast(msg, undo);
  });
  $('#clear-log').addEventListener('click', () => { const undo = undoable(); state.log = []; save(); renderLeftovers(); toast(t('toastRemoved', { x: t('cookingLog') }), undo); });
  $('#leftover-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#lo-name').value.trim().slice(0, 80); const servings = Math.min(50, Number($('#lo-servings').value)); const cooked = $('#lo-date').value || C.today();
    if (!name || !(servings > 0)) return;
    const c = C.canon(name);
    const match = C.D.RECIPES.find((r) => C.canon(r.name) === c || (C.I.RECIPES_DA[r.id] && C.canon(C.I.RECIPES_DA[r.id].name) === c));
    state.leftovers.unshift({ id: uid(), name, servings, cooked, provides: match ? match.provides || [] : [], recipeId: match ? match.id : null });
    $('#lo-name').value = ''; save(); renderAll(); haptic('light'); toast(t('toastAddedLo', { x: name, s: qty(servings, 'serving') }));
  });

  // ---------- events: shopping ----------
  $('#shop-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#shop-input'); const items = addItems(input.value, state.shopping);
    if (!items.length) return;
    input.value = ''; save(); renderShopping(); haptic('light');
  });
  $('#shop-list').addEventListener('change', (e) => {
    const li = e.target.closest('li'); const p = li && state.shopping.find((x) => x.id === li.dataset.id); if (!p) return;
    p.done = e.target.checked; li.classList.toggle('done', p.done); save(); renderShopping(); haptic('selection');
    $(`#shop-list li[data-id="${p.id}"] [data-done]`)?.focus();
  });
  $('#shop-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]'); if (!b) return;
    const id = b.closest('li').dataset.id; const p = state.shopping.find((x) => x.id === id); const undo = undoable();
    state.shopping = state.shopping.filter((x) => x.id !== id); save(); renderShopping(); toast(t('toastRemoved', { x: p ? p.name : '' }), undo);
    ($('#shop-list [data-remove]') || $('#shop-input')).focus();
  });
  $('#shop-move').addEventListener('click', () => {
    const done = state.shopping.filter((p) => p.done);
    if (!done.length) return toast(t('toastNothingTicked'));
    const undo = undoable();
    done.forEach((p) => C.addToList(state.pantry, { name: p.name, qty: p.qty, unit: p.unit }, uid));
    state.shopping = state.shopping.filter((p) => !p.done); save(); renderAll(); haptic('success');
    toast(t('toastMoved', { n: done.length }), undo);
  });
  $('#shop-clear').addEventListener('click', () => {
    const undo = undoable(); const n = state.shopping.filter((p) => p.done).length; if (!n) return;
    state.shopping = state.shopping.filter((p) => !p.done); save(); renderShopping(); toast(t('toastRemoved', { x: String(n) }), undo);
  });
  $('#shop-share').addEventListener('click', () => {
    const open = state.shopping.filter((p) => !p.done);
    const items = open.length ? open : state.shopping;
    shareText([t('shopListTitle') + ':', ...items.map((p) => `• ${shopLabel(p)}`)].join('\n'), t('shopListTitle'));
  });

  // ---------- events: settings ----------
  $('.langs').addEventListener('change', (e) => setLang(e.target.value));
  $('#lang-toggle').addEventListener('click', () => setLang(lang === 'da' ? 'en' : 'da'));
  $('.looks').addEventListener('change', (e) => { state.look = e.target.value; save(); applyLook(); haptic('selection'); });
  $('#keep-days').addEventListener('change', (e) => { state.keepDays = Number(e.target.value); save(); renderLeftovers(); });
  $('#reminders').addEventListener('change', (e) => { state.reminders = e.target.checked; save(); haptic('selection'); });
  $('#offers-on').addEventListener('change', (e) => { state.offersOn = e.target.checked; save(); haptic('selection'); if (state.offersOn) loadOffers(); else { activeColl.delete('offers'); rebuildOffers(); renderRecipes(); renderOffers(); } });
  $('#offers-card').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.chain) {
      const id = b.dataset.chain;
      state.offerChains = state.offerChains.includes(id) ? state.offerChains.filter((x) => x !== id) : C.OFFER_CHAINS.filter((x) => x === id || state.offerChains.includes(x));
      save(); rebuildOffers(); renderRecipes(); renderOffers(); haptic('selection'); $(`#offers-card [data-chain="${id}"]`)?.focus();
    } else if (b.matches('[data-offers-all]')) { offersExpanded = true; renderOffers(); }
    else if (b.dataset.offerAdd) {
      C.addToList(state.shopping, { name: ing(b.dataset.offerAdd), qty: null, unit: '' }, uid);
      save(); renderShopping(); haptic('light'); toast(t('toastOfferAdded', { x: `${ing(b.dataset.offerAdd)} (${b.dataset.offerLabel})` }));
    }
  });
  $('#time-aware').addEventListener('change', (e) => { state.timeAware = e.target.checked; save(); renderRecipes(); haptic('selection'); });
  $('#panel-recipes').addEventListener('click', (e) => {
    if (!e.target.closest('[data-meal-off]')) return;
    state.timeAware = false; save(); $('#time-aware').checked = false; renderRecipes(); haptic('selection');
    toast(t('toastMealOff')); $('#recipe-search').focus();
  });
  $('#reminders-row').hidden = !NATIVE;
  $('#export-btn').addEventListener('click', exportBackup);
  $('#import-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error('too-big');
      const raw = JSON.parse(await file.text());
      C.sanitizeState(raw, uid, true); // throws if it is not a backup
      if (!(await confirmBox(t('confirmImport'), t('importOk'), true))) return;
      const undo = undoable(); replaceState(raw); toast(t('toastImported'), undo); haptic('success');
    } catch { toast(t('importFailed')); haptic('error'); }
  });
  $('#erase-btn').addEventListener('click', async () => {
    if (!(await confirmBox(t('confirmErase'), t('eraseOk'), true))) return;
    const keep = { look: state.look, lang: state.lang, keepDays: state.keepDays };
    replaceState({ ...C.blankState(), ...keep }); toast(t('toastErased')); haptic('warning');
  });
  $('#install-card').hidden = NATIVE || STANDALONE;

  // Native side can ask for a fresh save (e.g. when the app goes to the background).
  window.PCApp = { flush: save, version: VERSION };

  // The phone tab bar grows with the text size; keep content and toasts clear of it.
  if (window.ResizeObserver) {
    const bar = $('.tabs');
    new ResizeObserver(() => {
      const fixed = getComputedStyle(bar).position === 'fixed';
      document.documentElement.style.setProperty('--tabbar-h', fixed ? `${bar.offsetHeight}px` : '0px');
    }).observe(bar);
  }

  // ---------- start ----------
  $('#lo-date').value = C.today();
  $('#lo-date').max = C.today();
  applyLook();
  rebuildOffers();
  setLang(lang, true);
  syncReminders();
  loadOffers();
  // Deep links such as index.html#tab=recipes&open=shakshuka (used by the screenshot tool and shareable links).
  const hash = new URLSearchParams(location.hash.slice(1));
  if (C.MEALS.includes(hash.get('meal'))) { forcedMeal = hash.get('meal'); renderRecipes(); }
  if (hash.get('coll')) { for (const k of hash.get('coll').split(',')) if (C.COLLECTIONS.some((c) => c.key === k)) activeColl.add(k); renderRecipes(); }
  if (TABS.includes(hash.get('tab'))) selectTab(hash.get('tab'));
  if (hash.get('open')) { const r = C.recipeById(hash.get('open')); if (r) openRecipe(r); }
  if (hash.get('create')) { const g = C.generate(state, lang, Number(hash.get('create')) - 1 || 0, currentMeal()); if (g) { genIndex = g.index; openRecipe(g.recipe, g.recipe.serves, g.count); } }
  if ('serviceWorker' in navigator && !NATIVE && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();
