import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Source-assertion tests (same style as recovery-safety.test.ts): these guard the
// reliability + progress-transparency invariants added to the browser agent and the
// two wizard surfaces. They fail loudly if a refactor drops a guarantee.
const agentSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url), 'utf8');
const sunoHtml = readFileSync(new URL('../../../xtrata-agent-one/wizard/suno.html', import.meta.url), 'utf8');

describe('NFT delivery is transient-aware', () => {
  it('routes every NFT transfer through the retrying wrapper', () => {
    expect(agentSource).toContain('async function sendNftRetry(');
    // The wrapper retries on the shared transient class (nonce/mempool/funding races).
    expect(agentSource).toContain('if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e)))');
    expect(agentSource).toMatch(/TRANSIENT_TX = \/[^/]*ConflictingNonceInMempool/);
    // The only bare `await sendNft(` left in the file is the one inside sendNftRetry.
    expect((agentSource.match(/await sendNft\(/g) || []).length).toBe(1);
    // The critical delivery hand-off uses the retrying wrapper.
    expect(agentSource).toContain('const deliverTx = await sendNftRetry(dep.key, dep.address, String(job.tokenId)');
  });

  it('preserves the broadcast reason for diagnosability', () => {
    expect(agentSource).toContain("throw new Error('nft: ' + res.error + (res.reason ? ' ' + res.reason : ''))");
    expect(agentSource).toContain("throw new Error('stx: ' + res.error + (res.reason ? ' ' + res.reason : ''))");
  });
});

describe('Deposit-wallet transactions are nonce-sequenced', () => {
  it('reads a mempool-aware nonce and threads it into each send', () => {
    expect(agentSource).toContain('possible_next_nonce');
    expect(agentSource).toContain('opts.nonce = await safeNonce(from, logId)');
    // sendStx resolves its own address first, then threads a mempool-aware nonce.
    expect(agentSource).toMatch(/const from = getAddressFromPrivateKey\(key, TransactionVersion\.Mainnet\);[\s\S]{0,160}safeNonce\(from\)/);
  });
});

describe('Funding gate is confirmation-consistent', () => {
  it('takes the best of several reads and never treats not-funded as fatal', () => {
    // Still three reads, best-of, for the same reason (Hiro load-balances across
    // nodes at different chain tips). The loop was reshaped so a FAILED read is no
    // longer reported as a zero balance — see balance-honesty.test.ts.
    expect(agentSource).toContain('const b = await balance(job.depositAddress); reads += 1; if (b > bal) bal = b;');
    expect(agentSource).toContain('for (let i = 0; i < 3; i++) {');
    // A lagging node read must not trip the refund failsafe.
    expect(agentSource).toContain('const FATAL_ERR = /TX abort|locked to|');
    expect(agentSource).not.toContain('const FATAL_ERR = /TX abort|not funded|locked to|');
  });
});

describe('Fee ceiling is coupled to the affordable balance', () => {
  it('never broadcasts a fee the deposit cannot cover, and budgets single-tx at the cap', () => {
    expect(agentSource).toContain('let effCap = MINT_CAP;');
    expect(agentSource).toContain('if (fee <= effCap) break;');
    expect(agentSource).toContain('marginal overage: clamp to cap');
    // Single-tx used to reserve the FULL cap regardless of size — a 64 KiB file was
    // quoted 2 STX of mining to spend about 0.15. It is now sized from the byte floor
    // and merely BOUNDED by the cap. Behaviour is covered for real in
    // fee-and-broadcast.test.ts; this just guards the shape.
    expect(agentSource).toContain('function minerBudget(');
    expect(agentSource).toContain('return reserve < MINT_CAP ? reserve : MINT_CAP;');
    expect(agentSource).not.toContain('q.single ? MINT_CAP');
  });
});

describe('Delivery is decoupled from the mint retry budget', () => {
  it('parks a minted-but-undelivered token to recovery instead of refunding it', () => {
    expect(agentSource).toContain('if (j.tokenId && !FATAL_ERR.test(msg)) {');
    expect(agentSource).toContain('parked as NEEDS_RECOVERY (not refunded)');
  });
});

describe('Progress narrates each transaction', () => {
  it('names every delivery + change transaction, not one lumped step', () => {
    expect(agentSource).toContain("prog('sending your inscription to your wallet')");
    expect(agentSource).toContain("prog('returning your change')");
    expect(agentSource).toContain('prog(`returning parent #${pid} to your wallet`)');
    expect(agentSource).toContain('prog(`delivering item ${deliverTxs.length + 1} of ${minted.length} to your wallet`)');
  });
});

describe('Wizard (index.html) shows a determinate, always-moving bar', () => {
  it('renders a progress bar with a steady in-band creep and a per-transaction sub-line', () => {
    expect(indexHtml).toContain('id="pbarFill"');
    expect(indexHtml).toContain('function barSync(');
    expect(indexHtml).toContain('a steady creep so a slow confirmation never looks frozen');
    expect(indexHtml).toContain('class="substep"');
    // The delivery phase header no longer implies a single atomic step.
    expect(indexHtml).toContain('a few separate transactions');
  });
});

describe('Suno wizard (suno.html) matches the same progress treatment', () => {
  it('adds the creep animator and surfaces the delivery narration', () => {
    expect(sunoHtml).toContain('const BAR={pct:0,floor:0,ceil:0,at:0,indet:false}');
    expect(sunoHtml).toContain('a slow confirmation never looks frozen');
    expect(sunoHtml).toContain("(st==='DELIVERING'||st==='INSCRIBED')&&job&&job.progress");
  });
});
