#!/usr/bin/env node
// Turns art/mempool-source.json (the real mempool.space snapshot taken at build time) into:
//   art/snapshot.js    window.MM_SNAPSHOT = {...}   (objects instead of columns; the game's offline fallback)
//   art/sources.json   where every figure came from, definitions, and the logos list (none used)
// Mempool Madness has no image art: every symbol is an original data tile drawn from these figures.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(join(HERE, 'art/mempool-source.json'), 'utf8'));
const rows = (cols, list) => list.map(r => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
const stuck = rows(src.stuckColumns, src.stuck);
const snap = {
  takenAt: src.takenAt, source: src.source, tip: src.tip, fees: src.fees, mempool: src.mempool,
  blocks: src.mempoolBlocks, recentBlocks: rows(src.blockColumns, src.blocks),
  whales: rows(src.whaleColumns, src.whales),
  stuck,
  pending: [...stuck.map(s => ({ txid: s.txid, feeRate: s.feeRate, vsize: s.vsize, fee: s.fee })), ...rows(src.pendingColumns, src.pendingExtra)]
};
writeFileSync(join(HERE, 'art/snapshot.js'), '/* Mempool Madness build-time snapshot of the real Bitcoin mempool (mempool.space API). Offline fallback: the game shows a SNAPSHOT badge whenever it runs from this. */\nwindow.MM_SNAPSHOT=' + JSON.stringify(snap) + ';\n');
const sources = {
  machine: 'Mempool Madness', snapshotTakenAt: src.takenAt, api: 'https://mempool.space/api', note: 'Every symbol is an original data tile drawn from the figures below. No images, no third-party logos and none of mempool.space\'s own design or logo are used.',
  endpoints: { tipHeight: '/blocks/tip/height', tipHash: '/blocks/tip/hash', fees: '/v1/fees/recommended', projectedBlocks: '/v1/fees/mempool-blocks', mempool: '/mempool (count, vsize, fee_histogram)', recentBlocks: '/v1/blocks', blockTxs: '/block/<hash>/txs/<start>', mempoolTxids: '/mempool/txids', tx: '/tx/<txid>', txTimes: '/v1/transaction-times', recent: '/mempool/recent' },
  definitions: src.definitions,
  counts: { whales: snap.whales.length, stuck: snap.stuck.length, pending: snap.pending.length, recentBlocks: snap.recentBlocks.length, projectedBlocks: snap.blocks.length },
  txids: { whales: snap.whales.map(w => ({ txid: w.txid, btc: w.btc, block: w.height, url: 'https://mempool.space/api/tx/' + w.txid })), stuck: snap.stuck.map(s => ({ txid: s.txid, feeRate: s.feeRate, firstSeen: s.firstSeen, url: 'https://mempool.space/api/tx/' + s.txid })), pending: snap.pending.map(p => ({ txid: p.txid, feeRate: p.feeRate, url: 'https://mempool.space/api/tx/' + p.txid })) },
  honestyNotes: [
    'The fee histogram has no bucket above 10 sat/vB, so the 20 and 50 sat/vB band tiles cannot show a queued figure for those rates; they show the top of the projected next block instead.',
    'Fee band tiles show queued vsize (virtual bytes at or above the rate), not a transaction count, because the histogram is in vsize.',
    'At snapshot time the mempool was quiet (recommended fees 1 to 3 sat/vB), so most sampled "stuck" transactions sit at 0.1 to 0.14 sat/vB, below the 1 sat/vB default minimum relay rate shown by older nodes. Some had been waiting for months (see firstSeen). They are real, listed as found.',
    'Whale means the sum of a transaction\'s outputs is 100 BTC or more; change outputs are included in that sum, so it is a size of movement, not proof that one owner sent that much.',
    'Live top-up: the game re-reads the API about every 30 seconds and swaps these figures for fresh ones; if a read fails it goes back to this snapshot and shows a SNAPSHOT badge. Results never depend on either.'
  ],
  logosNeedingPermission: [], logosMissing: [], thirdPartyArt: false
};
writeFileSync(join(HERE, 'art/sources.json'), JSON.stringify(sources, null, 1));
console.log('art/snapshot.js', snap.whales.length, 'whales,', snap.stuck.length, 'stuck,', snap.pending.length, 'pending; art/sources.json');
