/* TEST STUB of window.ParallaxLAYRAccount for the standalone Rare Pepe Directory page. It is the casino adapter with its own
   storage keys, so it can never read or change a real casino balance. */
/* One existing LAYR account for the room and every cabinet.
   This local adapter does not claim to verify or transfer on-chain tokens. */
(() => {
  'use strict';
  try {
    if (window.parent !== window && window.parent.ParallaxLAYRAccount) {
      window.ParallaxLAYRAccount = window.parent.ParallaxLAYRAccount;
      return;
    }
  } catch (_) {}
  const KEY = 'xtrata.parallax.test.rare-pepe-directory.layr.v1', LEGACY_KEY='xtrata.parallax.test.none', LOCK = 'xtrata.parallax.test.rare-pepe-directory.layr.v1';
  let owned = false, acquiring = null, releaseLock = null, room = null, draft = null, fault = '';
  const LEASE_KEY='xtrata.parallax.test.rare-pepe-directory.lease.v1',LEASE_MS=60000;
  let leaseDB=null,leaseToken=null,leaseTimer=null,leaseFallback=false;
  const metadata = new WeakMap(), listeners = new Set();
  const copy = value => JSON.parse(JSON.stringify(value));
  function amount(value) {
    if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100))) throw Error('Invalid LAYR amount.');
    return Math.round(value * 100) / 100;
  }
  function read() {
    const raw = localStorage.getItem(KEY),legacy=raw===null?localStorage.getItem(LEGACY_KEY):null,r = raw ? JSON.parse(raw) : legacy ? JSON.parse(legacy) : {};
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw Error('The shared LAYR account could not be read.');
    // Preserve an existing room balance; a new installation starts at zero.
    r.bank = typeof r.bank === 'number' ? amount(r.bank) : 0;
    r.layrGames = r.layrGames && typeof r.layrGames === 'object' && !Array.isArray(r.layrGames) ? r.layrGames : {};
    return r;
  }
  function ready(){
    if(!owned)return false;
    if(!leaseFallback)return true;
    try{const lease=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');return !!lease&&lease.id===leaseToken&&lease.expires>Date.now()+5000;}catch(_){return false;}
  }
  function assertOwned() { if (!ready()) throw Error(fault || 'The LAYR account is active in another tab or its lease has paused. Reconnect before playing.'); }
  function publish() { for (const fn of listeners) { try { fn(); } catch (e) { console.warn('LAYR display could not refresh.', e); } } }
  function write(r) {
    assertOwned();
    r.bank = amount(r.bank); r.layrSchema = 1; r.layrMode = 'local';
    delete r.cashier; // The former STX faucet and unverified exchange receipts are retired.
    localStorage.setItem(KEY, JSON.stringify(r));
  }
  function balance() {
    try { return draft ? draft.bank : amount(room ? room.available() : read().bank); }
    catch (e) { fault = e.message; return 0; }
  }
  async function openLeaseDB(){
    if(leaseDB)return leaseDB;
    if(!window.indexedDB)throw Error('Shared LAYR storage is unavailable in this browser.');
    leaseDB=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('xtrata-parallax-test-rare-pepe-directory-lock',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('leases');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    return leaseDB;
  }
  async function leaseOperation(release=false){
    const db=await openLeaseDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('leases','readwrite'),store=tx.objectStore('leases'),request=store.get(LOCK);let next=null,accepted=false;
      request.onsuccess=()=>{
        const current=request.result,now=Date.now();
        if(release){if(current?.id===leaseToken){store.delete(LOCK);accepted=true;}return;}
        // IndexedDB serializes simultaneous acquisition and renewal attempts.
        if(current&&current.id!==leaseToken&&current.expires>now)return;
        next={id:leaseToken,expires:now+LEASE_MS};store.put(next,LOCK);accepted=true;
      };
      tx.oncomplete=()=>{
        if(accepted){
          try{
            if(release){const mirror=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');if(mirror?.id===leaseToken)localStorage.removeItem(LEASE_KEY);}
            else localStorage.setItem(LEASE_KEY,JSON.stringify(next));
          }catch(e){reject(e);return;}
        }
        resolve(accepted);
      };
      tx.onerror=tx.onabort=()=>reject(tx.error||Error('LAYR account lock failed.'));
    });
  }
  async function acquireFallback(){
    try{
      read();leaseFallback=true;
      if(!leaseToken)leaseToken=Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-');
      if(!await leaseOperation()){fault='The LAYR account is active in another tab. Close it, then reload or reconnect.';return false;}
      owned=true;
      if(!leaseTimer)leaseTimer=setInterval(()=>{
        if(!owned)return;
        leaseOperation().then(ok=>{if(!ok){owned=false;fault='The LAYR account moved to another tab. Reconnect before playing.';publish();}}).catch(e=>{owned=false;fault=e.message;publish();});
      },10000);
      publish();return true;
    }catch(e){fault=e.message;owned=false;return false;}
  }
  async function acquire() {
    if (ready()) return true;
    if (acquiring) return acquiring;
    fault = '';
    if(!navigator.locks){acquiring=acquireFallback().finally(()=>{acquiring=null;});return acquiring;}
    acquiring = new Promise(resolve => {
      navigator.locks.request(LOCK, { ifAvailable: true }, async lock => {
        if (!lock) { fault = 'The LAYR account is active in another tab. Close it, then reload or reconnect.'; resolve(false); return; }
        try { read(); } catch (e) { fault = e.message; resolve(false); return; }
        owned = true;
        const held = new Promise(done => { releaseLock = done; });
        resolve(true); publish(); await held;
        owned = false; releaseLock = null;
      }).catch(e => { fault = e.message; resolve(false); });
    }).finally(() => { acquiring = null; });
    return acquiring;
  }
  function serialize(state) {
    const saved = copy(state);
    for (const key of ['balance', 'cashouts', 'previewPaid', 'freePreview']) delete saved[key];
    return saved;
  }
  function attach(state, id, revision = 0) {
    delete state.balance;
    Object.defineProperty(state, 'balance', { configurable: true, enumerable: false,
      get: balance,
      set(value) {
        if (!draft || draft.state !== state) throw Error('Only a committed game action can change the shared LAYR balance.');
        draft.bank = amount(value);
      }
    });
    metadata.set(state, { id, revision });
    return state;
  }
  function commitState(state, r, nextBank) {
    const meta = metadata.get(state); if (!meta) throw Error('Machine is not linked to the LAYR account.');
    const previous = r.layrGames[meta.id];
    if ((previous?.revision || 0) !== meta.revision) throw Error('Machine state changed. Disconnect and reconnect before playing.');
    const revision = meta.revision + 1;
    r.layrGames[meta.id] = { revision, state: serialize(state) };
    r.bank = amount(nextBank + (room ? room.held() : 0));
    // Funds and the resulting pending/settled game state are one storage write.
    write(r); meta.revision = revision;
    if (room) { try { room.changed(nextBank); } catch (e) { console.warn('LAYR room display could not refresh.', e); } }
    publish();
  }
  function transact(state, fn) {
    assertOwned(); if (draft) throw Error('A LAYR transaction is already running.');
    const before = serialize(state), r = read();
    draft = { state, bank: balance() };
    try {
      const result = fn(), next = draft.bank;
      draft = null;
      commitState(state, r, next);
      return result;
    } catch (e) {
      draft = null;
      for (const key of Object.keys(state)) delete state[key];
      Object.assign(state, before);
      throw e;
    }
  }
  function saveGame(state) {
    if (!ready()) return false;
    if (draft) return true;
    commitState(state, read(), balance()); return true;
  }
  function machine(id, engine) {
    const api = { ...engine };
    api.fresh = () => attach(engine.fresh(), id);
    api.load = raw => attach(engine.load ? engine.load(raw) : { ...engine.fresh(), ...(raw || {}) }, id);
    for (const name of ['start', 'settle', 'pick', 'respin', 'collect', 'endFree', 'gamble']) {
      if (typeof engine[name] === 'function') api[name] = (state, ...args) => transact(state, () => engine[name](state, ...args));
    }
    return Object.freeze(api);
  }
  function openGame(id, engine) {
    const saved = read().layrGames[id], state = engine.load(saved?.state);
    return attach(state, id, saved?.revision || 0);
  }
  function saveRoom(values) {
    if (!ready()) return false;
    const r = read(); Object.assign(r, values); write(r); publish(); return true;
  }
  window.ParallaxLAYRAccount = Object.freeze({
    version: '1.0.0', mode: 'local', onChainConnected: false,
    acquire, ready, error: () => fault, balance, machine, openGame, saveGame, saveRoom,
    bindRoom(callbacks) { room = callbacks; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    roomState(){const r=read();return {bank:r.bank,hands:r.hands||0,net:r.net||0};},
    snapshot() { const r = read(); return { balance: balance(), currency: 'LAYR', mode: 'local', onChainConnected: false, available: ready(), games: Object.keys(r.layrGames) }; }
  });
  addEventListener('pagehide', () => { owned=false;if(releaseLock)releaseLock();if(leaseFallback){clearInterval(leaseTimer);leaseOperation(true).catch(()=>{});} });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&leaseFallback&&owned)leaseOperation().then(ok=>{if(!ok){owned=false;publish();}}).catch(()=>{owned=false;publish();});});
})();
