import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const core = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const suno = readFileSync(new URL('../../../xtrata-agent-one/wizard/suno.html', import.meta.url), 'utf8');
const wizard = readFileSync(new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url), 'utf8');
const home = readFileSync(new URL('../../home/main.js', import.meta.url), 'utf8');

describe('cancel is confirmed by something a browser cannot suppress', () => {
  it('uses an in-page dialog on both surfaces, not window.confirm', () => {
    // window.prompt broke the BNS chooser the same way: a browser may suppress a
    // native dialog, and a suppressed dialog is indistinguishable from a click.
    for (const [name, html] of [['suno', suno], ['wizard', wizard]] as const) {
      expect(html, `${name} still uses window.confirm to cancel`).not.toContain("confirm('Stop this job");
      expect(html).toContain('function confirmDanger(');
      expect(html).toContain('confirmLabel:\'Stop and refund me\'');
    }
  });

  it('fails safe — an unanswered question keeps the job running', () => {
    for (const html of [suno, wizard]) {
      // Escape and backdrop both resolve false, and the SAFE button takes focus so a
      // stray Return does not cancel a job.
      expect(html).toContain("if(e.key==='Escape'){ e.preventDefault(); close(false); }");
      expect(html).toContain("if(e.target===wrap) close(false)");
      expect(html).toMatch(/\[data-x="no"\]'\)\.focus\(\{preventScroll:true\}\)/);
    }
  });
});

describe('connecting a wallet does not move the user', () => {
  it('no longer jumps to My Xtrata based on what they hold', () => {
    expect(home).not.toContain('Opening My Wallet with your inscriptions');
    expect(home).toContain('Connecting a wallet is not a request to go anywhere');
    // The holdings are still loaded, so My Xtrata is ready when they choose it.
    expect(home).toContain('await loadWalletInscriptions();');
  });
});

describe('nothing on the SUNO page navigates away', () => {
  it('every real link opens a new tab', () => {
    const links = suno.match(/<a [^>]*href="[^#][^"]*"[^>]*>/g) || [];
    expect(links.length).toBeGreaterThan(0);
    const escapes = links.filter((a) => !a.includes('target="_blank"'));
    expect(escapes, `these would navigate away: ${escapes.join(' | ')}`).toEqual([]);
  });
});

describe('receipts come from the surface the user actually used', () => {
  it('threads an origin through job creation', () => {
    // suno.html sent `suno: true` for months; createJob destructured a fixed list and
    // dropped it, so the receipt could never know where the job came from.
    expect(core).toContain("origin = 'wizard'");
    expect(core).toContain('storageDurability: durability, origin,');
    expect(suno).toContain("origin:'suno'");
    expect(suno).not.toContain('suno:true');
  });

  it('brands both receipt templates from it, with no "Agent One" left', () => {
    expect(core).toContain('const ORIGIN_BRAND');
    expect(core).toContain("suno: 'SUNO More'");
    expect(core).toContain('${brandFor(d.origin)}');
    // Only internal comments may mention the engine name.
    const userFacing = core.split('\n').filter((l) => l.includes('Agent One') && !l.trim().startsWith('*') && !l.trim().startsWith('//'));
    expect(userFacing).toEqual([]);
  });

  it('fills the player details the receipt already had a slot for', () => {
    // receiptData() read job.sunoPlayer and nothing ever set it, so that section
    // rendered empty on every receipt.
    expect(core).toContain('sunoPlayer,');
    expect(suno).toContain('sunoPlayer: META ?');
  });
});

describe('the on-chain receipt is opt-in on SUNO', () => {
  it('defaults off and is passed explicitly', () => {
    // Omitting `receipt` means the agent's default of true — SUNO bought a receipt
    // token on every job while the main wizard defaulted it off.
    expect(suno).toContain('id="receiptToggle"');
    expect(suno).not.toMatch(/id="receiptToggle"[^>]*checked/);
    expect(suno).toContain('const wantReceipt=()');
    expect(suno).toContain('receipt:wantReceipt()');
  });

  it('re-quotes when it is toggled, since it changes the price', () => {
    expect(suno).toContain("$('#receiptToggle').addEventListener('change'");
  });
});

// Rendered, not asserted on source: the template is what a buyer keeps, so check the
// actual output rather than trusting that the interpolation is wired up.
describe('what the receipt actually renders', () => {
  const render = async (origin?: string) => {
    const { FakeChain, loadAgent, unloadAgent } = await import('./support/fake-chain');
    const agent: any = await loadAgent(new FakeChain());
    const html = agent.buildReceiptHtml({
      jobId: 'job-1', core: 'xtrata-v3-2-3', date: new Date(0).toISOString(), origin,
      outcome: 'inscribed', uri: 'xtrata:song/night-drive', mime: 'text/html', bytes: 100,
      tokenId: '1', agentIdentityId: '27', depositReceived: '1000', xtrataProtocol: '1',
      receiptProtocol: '0', networkFee: '1', agentFee: '0', changeReturned: '0', totalPaid: '1'
    });
    unloadAgent();
    return html;
  };

  it('defaults to Xtrata Inscription Wizard', async () => {
    const html = await render(undefined);
    expect(html).toContain('<title>Xtrata Inscription Wizard — Receipt job-1</title>');
    expect(html).toContain('<b>XTRATA</b> <i>Inscription Wizard</i>');
    expect(html).toContain('Inscription Wizard · identity');
    expect(html).not.toContain('Agent One');
  });

  it('says SUNO More when the job came from there', async () => {
    const html = await render('suno');
    expect(html).toContain('<title>Xtrata SUNO More — Receipt job-1</title>');
    expect(html).toContain('<b>XTRATA</b> <i>SUNO More</i>');
    expect(html).not.toContain('Agent One');
  });
});
