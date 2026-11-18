#!/usr/bin/env node
// Bentes køkken — fetches this week's supermarket offers and writes offers.json for the app.
//
// Usage:  node tools/fetch_offers.js [web-folder]     (default: ../web next to this file, or .. when published)
// Exit:   0 = all chains fine · 2 = at least one chain failed its check (old data for it is kept)
//
// Each chain has one small READER below. When a chain changes how it publishes its leaflet, only its
// reader needs fixing. Readers return raw offers: [{ heading, price, prePrice, quantity, from, till }].
// The script keeps only offers that match an ingredient the app knows (core.js offerIngredient).
//
// Source today: the Tjek leaflet service the chains' own "avis" pages use (no key needed, read-only).
// Be gentle: a handful of requests per chain, once a day.
const fs = require('node:fs');
const path = require('node:path');

const WEB = path.resolve(process.argv[2] || (fs.existsSync(path.join(__dirname, '../web/core.js')) ? path.join(__dirname, '../web') : path.join(__dirname, '..')));
const OUT = path.join(WEB, 'offers.json');
const UA = 'bentes-koekken-offers/1.0 (weekly offers for a small recipe app)';
const MIN_OFFERS = 15; // fewer matched offers than this from a chain = something is broken

// ---------- load the app's ingredient knowledge ----------
globalThis.window = globalThis;
require(path.join(WEB, 'data.js'));
require(path.join(WEB, 'i18n.js'));
const R = path.join(WEB, 'recipes');
for (const f of ['words.js', ...fs.readdirSync(R).filter((x) => /^batch-.*\.js$/.test(x)).sort()]) require(path.join(R, f));
const C = require(path.join(WEB, 'core.js'));

// ---------- helpers ----------
async function getJSON(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dkDay = (iso) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Europe/Copenhagen' }); // YYYY-MM-DD in Danish time
function quantityText(q) {
  if (!q || !q.size || !q.unit) return '';
  const num = (n) => String(Math.round(n * 100) / 100).replace('.', ',');
  const size = q.size.from === q.size.to ? num(q.size.from) : `${num(q.size.from)}–${num(q.size.to)}`;
  const unit = { pcs: 'stk', g: 'g', kg: 'kg', ml: 'ml', cl: 'cl', l: 'l' }[q.unit.symbol] || q.unit.symbol;
  const pieces = q.pieces && q.pieces.from > 1 ? `${q.pieces.from} × ` : '';
  return `${pieces}${size} ${unit}`;
}

// ---------- reader: Tjek leaflet service ----------
// Picks the leaflets that are valid today and look like the weekly food leaflet, then reads their offers.
const TJEK = 'https://squid-api.tjek.com/v2';
const SKIP_LEAFLET = /nonfood|non-food|legetøj|julegave|katalog|indstik|skønhed|ud af huset|opskrift|magasin|vin\b|have|bolig|elektronik/i;
async function tjekReader(dealerId) {
  const now = Date.now();
  const catalogs = await getJSON(`${TJEK}/catalogs?dealer_ids=${dealerId}&limit=24`);
  const current = catalogs.filter((c) => Date.parse(c.run_from) <= now && now <= Date.parse(c.run_till) && !SKIP_LEAFLET.test(c.label || ''));
  const offers = [];
  for (const cat of current.slice(0, 3)) {
    for (let offset = 0; offset < Math.min(cat.offer_count || 0, 600); offset += 100) {
      await sleep(400);
      const page = await getJSON(`${TJEK}/offers?catalog_id=${encodeURIComponent(cat.id)}&limit=100&offset=${offset}`);
      for (const o of page) {
        offers.push({ heading: o.heading, price: o.pricing && o.pricing.price, prePrice: o.pricing && o.pricing.pre_price,
          quantity: quantityText(o.quantity), from: dkDay(o.run_from), till: dkDay(o.run_till) });
      }
      if (page.length < 100) break;
    }
  }
  return { leaflets: current.map((c) => c.label), offers };
}

// ---------- the chains ----------
const CHAINS = [
  { id: 'netto', name: 'Netto', read: () => tjekReader('9ba51') },
  { id: 'foetex', name: 'føtex', read: () => tjekReader('bdf5A') },
  { id: 'meny', name: 'MENY', read: () => tjekReader('267e1m') },
  { id: 'kvickly', name: 'Kvickly', read: () => tjekReader('c1edq') },
];

async function main() {
  let previous = { chains: {} };
  try { previous = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* first run */ }
  const out = { v: 1, updated: new Date().toISOString(), note: 'Offers from the chains\' weekly leaflets. Prices can differ in your shop.', chains: {} };
  let failed = 0;
  for (const chain of CHAINS) {
    try {
      if (process.env.OFFERS_BREAK === chain.id) throw new Error('forced failure (self-test of the alarm)');
      const { leaflets, offers } = await chain.read();
      const seen = new Set();
      const matched = [];
      for (const o of offers) {
        if (typeof o.heading !== 'string' || typeof o.price !== 'number' || !(o.price > 0)) continue;
        const c = C.offerIngredient(o.heading);
        if (!c) continue;
        const key = `${o.heading}|${o.price}|${o.till}`;
        if (seen.has(key)) continue;
        seen.add(key);
        matched.push({ h: o.heading.trim().slice(0, 120), c, p: o.price, pp: typeof o.prePrice === 'number' ? o.prePrice : null, q: o.quantity, from: o.from, till: o.till });
      }
      if (matched.length < MIN_OFFERS) throw new Error(`only ${matched.length} food offers matched (from ${offers.length} offers in ${leaflets.length} leaflets) — the source may have changed`);
      matched.sort((a, b) => a.c.localeCompare(b.c) || a.p - b.p);
      out.chains[chain.id] = { name: chain.name, leaflets, read: offers.length, offers: matched };
      console.log(`OK    ${chain.name}: ${matched.length} food offers kept of ${offers.length} (${leaflets.join(', ')})`);
    } catch (e) {
      failed += 1;
      if (previous.chains && previous.chains[chain.id]) out.chains[chain.id] = previous.chains[chain.id]; // keep the last good data
      console.error(`FAIL  ${chain.name}: ${e.message}`);
    }
    await sleep(600);
  }
  // Check that the app itself accepts the file.
  const clean = C.sanitizeOffers(out);
  for (const id of Object.keys(out.chains)) {
    if (!clean.chains[id] || clean.chains[id].offers.length !== out.chains[id].offers.length) { console.error(`FAIL  ${id}: the app would reject some of these offers`); failed += 1; }
  }
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log(`wrote ${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
  process.exit(failed ? 2 : 0);
}
main().catch((e) => { console.error('FAIL  ' + e.message); process.exit(1); });
