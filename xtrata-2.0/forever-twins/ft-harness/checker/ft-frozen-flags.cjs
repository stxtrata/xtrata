// Forever Twins — frozen-flag reader (v1).
// Reads, for each collection, whether the owner has locked ("frozen") the token link, straight from chain.
// Read-only: GET contract source, GET data-var, Hiro read-only calls. No signing, no writes, no wallet.
// Hiro allows CORS, so this runs in any browser tab. Keep the tab visible; the run takes a few minutes (about 0.35 s between calls).
//
//   1. Paste this file into the page console.
//   2. FTFROZEN.run(await (await fetch('<url of frozen-read-list.json>')).json())     // or pass an array of contract ids
//   3. copy(FTFROZEN.json())  -> save as frozen-flags.json, then:  python3 -I export_checker_data.py --frozen frozen-flags.json
//
// What it can say about each collection (state):
//   frozen       a flag was read and it is true
//   not_frozen   every flag found was read and all are false
//   no_flag      the source has no boolean freeze/frozen variable we know how to read (this is NOT "not frozen")
//   read_failed  the source or a flag could not be read (this is NOT "not frozen"); run() retries these on the next call
(function (root) {
  'use strict';

  // ---------- pure parts (tested in Node) ----------

  /** Hex of a Clarity value -> true / false, looking through ok(...) and some(...); anything else -> null. */
  function decodeBool(hex) {
    if (typeof hex !== 'string') return null;
    let h = hex.startsWith('0x') ? hex.slice(2) : hex;
    while (h.startsWith('07') || h.startsWith('0a')) h = h.slice(2); // ok / some wrappers
    if (h === '03') return true;
    if (h === '04') return false;
    return null;
  }

  // A name that talks about freezing. 'lock' alone is deliberately left out: it often means something else (staking, transfers).
  const FLAG_NAME = /frozen|freeze/i;
  const NAME = '[a-zA-Z][a-zA-Z0-9?!_-]*';

  /**
   * Which flags in this contract source can we read? Boolean data variables first; zero-argument read-only functions only
   * if there is no such variable (a function usually just returns the variable, so reading both would be a wasted call).
   * Only real definitions count: a comment or string that mentions "frozen" does not.
   */
  function flagCandidates(source) {
    const src = String(source || '');
    const vars = [...src.matchAll(new RegExp(`\\(define-data-var\\s+(${NAME})\\s+bool\\b`, 'g'))]
      .map((m) => m[1]).filter((n) => FLAG_NAME.test(n)).map((name) => ({ kind: 'var', name }));
    if (vars.length) return dedupe(vars);
    const fns = [...src.matchAll(new RegExp(`\\(define-read-only\\s+\\(\\s*(${NAME})\\s*\\)`, 'g'))]
      .map((m) => m[1]).filter((n) => FLAG_NAME.test(n)).map((name) => ({ kind: 'fn', name }));
    return dedupe(fns);
  }
  function dedupe(list) {
    const seen = new Set();
    return list.filter((c) => (seen.has(c.kind + ':' + c.name) ? false : seen.add(c.kind + ':' + c.name)));
  }

  /** flags: [{value: true|false|null}] for the candidates we tried to read. */
  function classify(candidates, flags) {
    if (flags.some((f) => f.value === true)) return 'frozen'; // one true flag settles it, even if another read failed
    if (candidates.length === 0) return 'no_flag';
    if (flags.length === candidates.length && flags.every((f) => f.value === false)) return 'not_frozen';
    return 'read_failed';
  }

  // ---------- reader (fetch and sleep are injected so the tests can fake the network) ----------

  function createReader(deps) {
    const base = deps.base || 'https://api.hiro.so';
    const fetchFn = deps.fetch;
    const sleep = deps.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
    const store = deps.store || null; // optional { get(), set(obj) } for resuming
    const reader = { gapMs: deps.gapMs == null ? 350 : deps.gapMs, results: (store && store.get()) || {}, log: [] };
    let last = 0;

    async function call(path, opts, tries = 4) {
      let why = 'network';
      for (let k = 0; k < tries; k++) {
        const wait = Math.max(0, last + reader.gapMs - Date.now());
        if (wait) await sleep(wait);
        last = Date.now();
        try {
          const r = await fetchFn(base + path, opts);
          if (r.status === 429) { why = 'http429'; await sleep(5000 * (k + 1)); continue; }
          if (!r.ok) return { ok: false, why: 'http' + r.status };
          return { ok: true, json: await r.json() };
        } catch (e) {
          why = 'network: ' + String((e && e.message) || e).slice(0, 60);
          await sleep(1500);
        }
      }
      return { ok: false, why };
    }

    async function readOne(id) {
      const at = new Date().toISOString();
      const [addr, name] = String(id).split('.');
      if (!addr || !name) return { state: 'read_failed', flags: [], at, error: 'not a contract id' };
      const src = await call(`/v2/contracts/source/${addr}/${name}?proof=0`);
      if (!src.ok) return { state: 'read_failed', flags: [], at, error: 'source ' + src.why };
      const candidates = flagCandidates(src.json && src.json.source);
      const flags = [];
      for (const c of candidates) {
        if (c.kind === 'var') {
          const r = await call(`/v2/data_var/${addr}/${name}/${c.name}?proof=0`);
          if (!r.ok) { flags.push({ ...c, value: null, error: r.why }); continue; }
          const value = decodeBool(r.json && r.json.data);
          flags.push(value === null ? { ...c, value, error: 'not a boolean' } : { ...c, value });
        } else {
          const r = await call(`/v2/contracts/call-read/${addr}/${name}/${c.name}`, {
            method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: addr, arguments: [] }),
          });
          if (!r.ok) { flags.push({ ...c, value: null, error: r.why }); continue; }
          if (!r.json || !r.json.okay) { flags.push({ ...c, value: null, error: 'call failed' }); continue; }
          const value = decodeBool(r.json.result);
          flags.push(value === null ? { ...c, value, error: 'not a boolean' } : { ...c, value });
        }
      }
      return { state: classify(candidates, flags), flags, at };
    }

    /** Walk the ids. Anything already read (frozen / not_frozen / no_flag) is skipped; read_failed ones are tried again. */
    async function run(ids, opts = {}) {
      for (const id of ids) {
        const have = reader.results[id];
        if (have && have.state !== 'read_failed') continue;
        reader.results[id] = await readOne(id);
        if (store) store.set(reader.results);
        if (opts.onProgress) opts.onProgress(id, reader.results[id]);
      }
      return reader.summary(ids);
    }
    reader.summary = (ids) => {
      const out = { frozen: 0, not_frozen: 0, no_flag: 0, read_failed: 0, not_read: 0 };
      for (const id of ids || Object.keys(reader.results)) out[(reader.results[id] || { state: 'not_read' }).state]++;
      return out;
    };
    reader.readOne = readOne;
    reader.run = run;
    reader.json = () => JSON.stringify({ version: 1, generated: new Date().toISOString(), results: reader.results });
    return reader;
  }

  const api = { decodeBool, flagCandidates, classify, createReader };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  // ---------- browser wiring ----------
  if (root && root.document) {
    // Timers go through a worker: hidden tabs throttle page timers to about one a minute (same trick as ft-census.js).
    const w = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id), e.data.ms)'], { type: 'text/javascript' })));
    const waiting = {}; let n = 0; w.onmessage = (e) => { const f = waiting[e.data]; delete waiting[e.data]; f && f(); };
    const sleep = (ms) => new Promise((r) => { const id = ++n; waiting[id] = r; w.postMessage({ id, ms }); });
    const KEY = 'ftfrozen-v1';
    const store = {
      get() { try { return JSON.parse(root.localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } },
      set(obj) { try { root.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) { /* storage can be unavailable; the run still works */ } },
    };
    root.FTFROZEN = createReader({ fetch: root.fetch.bind(root), sleep, store });
  }
})(typeof window !== 'undefined' ? window : null);
