#!/usr/bin/env node
// Phase 0 of BIP110-L1-INSCRIBER-DESIGN.md: cost model for inscribing data on
// Bitcoin L1 before vs after BIP-110's 256-byte push limit, next to Xtrata.
//
//   node scripts/l1-cost-model.mjs <bytes|e.g. 1mb> [satPerVb=10] [btcUsd=70000]
//
// Assumptions (documented so the numbers are contestable):
// - Witness bytes cost 0.25 vB each (segwit discount).
// - Classic ord envelope overhead: ~13 bytes + ~3 bytes per 520B push.
// - Post-110 push-drop envelope: ~3 bytes per 256B chunk (pushdata op + len +
//   amortised OP_2DROP) + ~20 bytes protocol header per tx.
// - Commit+reveal pair fixed cost: ~230 vB (commit ~110 vB + reveal frame
//   ~120 vB before witness data).
// - Standardness caps a tx at 400,000 WU; we budget 380,000 WU per reveal,
//   leaving ~370KB of raw witness capacity per pair.
// - Xtrata: observed production cost, ~0.1 STX per 100KB (rounded up), STX
//   price passed via XTRATA_STX_USD env or defaulted below.

const parseBytes = (s) => {
  const m = String(s).trim().toLowerCase().match(/^([\d.]+)\s*(gb|mb|kb|b)?$/);
  if (!m) return NaN;
  const mult = { gb: 1 << 30, mb: 1 << 20, kb: 1 << 10, b: 1 }[m[2] || 'b'];
  return Math.round(Number(m[1]) * mult);
};

export const model = (bytes, satPerVb = 10, btcUsd = 70000, stxUsd = Number(process.env.XTRATA_STX_USD || 1.5)) => {
  const WITNESS_VB = 0.25;
  const PAIR_FIXED_VB = 230;
  const TX_WITNESS_BUDGET = 370_000; // raw witness bytes per commit+reveal pair

  const plan = (chunkSize, perChunkOverhead, perTxHeader) => {
    const chunks = Math.ceil(bytes / chunkSize);
    const chunksPerTx = Math.floor(TX_WITNESS_BUDGET / (chunkSize + perChunkOverhead));
    const txs = Math.max(1, Math.ceil(chunks / chunksPerTx));
    const witnessBytes = bytes + chunks * perChunkOverhead + txs * perTxHeader;
    const vbytes = Math.ceil(witnessBytes * WITNESS_VB + txs * PAIR_FIXED_VB);
    const sats = vbytes * satPerVb;
    return { chunks, txs, vbytes, sats, btc: sats / 1e8, usd: (sats / 1e8) * btcUsd };
  };

  const classic = plan(520, 3, 13);       // pre-110 ord envelope
  const post110 = plan(256, 3, 20);       // push-drop envelope
  const xtrataStx = Math.max(0.05, Math.ceil(bytes / 102400) * 0.1);
  const xtrata = { stx: xtrataStx, usd: xtrataStx * stxUsd };

  return { bytes, satPerVb, btcUsd, classic, post110, xtrata,
    post110Premium: post110.usd / Math.max(classic.usd, 1e-9),
    xtrataAdvantage: post110.usd / Math.max(xtrata.usd, 1e-9) };
};

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const bytes = parseBytes(process.argv[2] || '1mb');
  const satPerVb = Number(process.argv[3] || 10);
  const btcUsd = Number(process.argv[4] || 70000);
  if (!Number.isFinite(bytes) || bytes <= 0) {
    console.error('usage: node scripts/l1-cost-model.mjs <bytes|1mb|500kb> [satPerVb] [btcUsd]');
    process.exit(1);
  }
  const r = model(bytes, satPerVb, btcUsd);
  const usd = (n) => `$${n.toFixed(2)}`;
  console.log(`\nInscribing ${(bytes / 1048576).toFixed(2)} MiB @ ${satPerVb} sat/vB, BTC ${usd(btcUsd)}\n`);
  console.log(`  Bitcoin L1 today (classic ord envelope):`);
  console.log(`    ${r.classic.txs} tx pair(s), ${r.classic.vbytes.toLocaleString()} vB → ${r.classic.btc.toFixed(5)} BTC (${usd(r.classic.usd)})`);
  console.log(`  Bitcoin L1 after BIP-110 (256B push-drop):`);
  console.log(`    ${r.post110.chunks.toLocaleString()} chunks, ${r.post110.txs} tx pair(s), ${r.post110.vbytes.toLocaleString()} vB → ${r.post110.btc.toFixed(5)} BTC (${usd(r.post110.usd)})`);
  console.log(`    (${((r.post110Premium - 1) * 100).toFixed(1)}% over today's cost)`);
  console.log(`  Xtrata (full file, Bitcoin-anchored via Stacks):`);
  console.log(`    ~${r.xtrata.stx.toFixed(2)} STX (${usd(r.xtrata.usd)}) — ${r.xtrataAdvantage.toFixed(0)}x cheaper than post-110 L1\n`);
}
