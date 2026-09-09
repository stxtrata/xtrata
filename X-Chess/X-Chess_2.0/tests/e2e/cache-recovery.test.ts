import { expect, it } from 'vitest';
import type { Store } from '../../packages/storage/verified-cache.js';
import { CachingReader, MemoryStore } from '../../packages/storage/verified-cache.js';
import type { ChainReader } from '../../packages/chain/client.js';
import { factsScope, rememberedGame, rememberGame } from '../../packages/chain/game-facts.js';
import { JSDOM } from 'jsdom';
const rows = Array.from({length: 100}, (_, seq) => ({seq, value: 'e2e4', sender: 'sender', height: 10}));
function setup(store: Store = new MemoryStore()) {
  let reads = 0;
  const chain = {contractId: 'contract', getEntry: async (_: number, seq: number) => {reads++; return rows[seq];},
    getPage: async (_: number, start: number) => {reads++; return rows.slice(start, start + 50);},
    getRankedGame: async () => {reads++; return 1;}} as unknown as ChainReader;
  return {reader: new CachingReader(chain, store), reads: () => reads, store};
}
it.each(['{', 'null', '42', '{"seq":0}', JSON.stringify({...rows[0], seq: 9}), JSON.stringify({...rows[0], height: -1})])('repairs invalid cached entries: %s', async bad => {
  const {reader, reads, store} = setup();
  await store.set('contract|entry|1|0', bad);
  expect(await reader.getAllEntries(1, 100)).toEqual(rows);
  expect(await reader.getEntry(1, 0)).toEqual(rows[0]);
  expect(reads()).toBe(3); // two full pages and the terminating empty page
});
it.each(['{', 'null', '"7"', '-1', '0', '{}'])('repairs invalid ranked IDs: %s', async bad => {
  const {reader, reads, store} = setup(); await store.set('contract|ranked|0', bad);
  expect(await reader.getRankedGame(0)).toBe(1); expect(await reader.getRankedGame(0)).toBe(1);
  expect(reads()).toBe(1);
});
it('still reads when storage access throws', async () => {
  const broken = {get: async () => {throw Error('private');}, set: async () => {throw Error('quota');}, clear: async () => {throw Error('private');}};
  const {reader} = setup(broken);
  expect(await reader.getAllEntries(1, 100)).toEqual(rows); await reader.clear();
});
it('uses two bulk reads and zero chain requests for a warm 100-entry log', async () => {
  const store = new MemoryStore(); let batches = 0;
  const bulk = Object.assign(store, {getMany: async (keys: string[]) => {batches++; return Promise.all(keys.map(k => store.get(k)));}});
  const {reader, reads} = setup(bulk);
  await reader.getAllEntries(1); const cold = reads(); batches = 0;
  expect(await reader.getAllEntries(1, 100)).toEqual(rows);
  expect(batches).toBe(2); expect(reads()).toBe(cold);
});
it('isolates tournament facts by network, contract and cache schema', () => {
  const dom = new JSDOM('', {url: 'https://example.test'});
  const previous = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: dom.window.localStorage});
  try {
    const scope = factsScope({contractId: 'contract', network: 'mainnet'});
    const row = {nextSeq: 0, rulesKey: '', facts: {rulesHash: null, result: null}, firstHeight: null, entries: 0};
    rememberGame(1, row as never, scope);
    expect(rememberedGame(1, scope)).toEqual(row);
    expect(rememberedGame(1, factsScope({contractId: 'other', network: 'mainnet'}))).toBeNull();
    expect(rememberedGame(1, factsScope({contractId: 'contract', network: 'testnet'}))).toBeNull();
    dom.window.localStorage.setItem('xchess:facts:2', JSON.stringify(row));
    expect(rememberedGame(2, scope)).toBeNull();
  } finally { Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: previous}); dom.window.close(); }
});
