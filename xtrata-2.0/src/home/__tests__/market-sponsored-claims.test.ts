import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Keeps the market page's sponsorship copy tied to what it can actually do.
 *
 * The page once advertised "Buy — no STX needed" and a green badge on sponsored
 * listings while `marketBuy` called `showContractCall` unconditionally, so the
 * buyer always paid their own fee. That sent zero-STX buyers into a transaction
 * they could not pay for.
 *
 * Stage 2 of docs/plans/SPONSORED-MARKET-BUY-PLAN.md wired the sponsored branch,
 * so the capability is now real. The copy stays quiet anyway: restoring
 * buyer-facing sponsorship claims is Stage 3, gated on the testnet rehearsal in
 * the plan's §5. These guards therefore assert both halves — the branch exists,
 * and nothing promises free checkout ahead of that rehearsal — so the two can
 * only move together.
 */
const mainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');

/** The market half of main.js, so drops' legitimate sponsored copy is excluded. */
const marketSection = (() => {
  const start = mainSource.indexOf('const MARKET_LISTINGS_PER_CONTRACT');
  const end = mainSource.indexOf('const DROPS_DISPLAY_LIMIT');
  expect(start, 'market section start marker moved').toBeGreaterThan(-1);
  expect(end, 'drops section start marker moved').toBeGreaterThan(start);
  return mainSource.slice(start, end);
})();

/**
 * Market section with `//` comments stripped. The copy assertions must test
 * what a user can read, not the comments explaining why the copy changed —
 * those legitimately quote the removed phrases.
 */
const marketCopy = marketSection.replace(/^\s*\/\/.*$/gm, '');

const sponsoredBuyFn = (() => {
  const start = marketSection.indexOf('const marketSponsoredBuy');
  expect(start, 'marketSponsoredBuy not found').toBeGreaterThan(-1);
  // `const marketBuy = async` and not `const marketBuy`: marketBuyJourneys is
  // declared earlier and would slice this to an empty string.
  const end = marketSection.indexOf('const marketBuy = async', start);
  expect(end, 'marketBuy no longer follows marketSponsoredBuy').toBeGreaterThan(start);
  return marketSection.slice(start, end);
})();

const marketBuyFn = (() => {
  const from = marketSection.slice(marketSection.indexOf('const marketBuy = async'));
  return from.slice(0, from.indexOf('\n    };'));
})();

describe('sponsored buy is wired into the public market page', () => {
  it('marketBuy branches to the sponsored path before the self-paid call', () => {
    expect(marketBuyFn).toContain('marketSponsoredBuy');
    // Both paths must survive: the branch returns only when it took ownership.
    expect(marketBuyFn).toContain('showContractCall');
    expect(marketBuyFn).toMatch(/if \(handled\) return;/);
  });

  it('the branch is gated on the market being sponsored and no forced self-paid', () => {
    expect(marketBuyFn).toMatch(
      /!options\.forceSelfPaid && isSponsoredMarket\(listing\.entry\)/
    );
  });

  it('the sponsored path actually signs a sponsored transaction', () => {
    expect(sponsoredBuyFn).toContain('showSponsoredContractCall');
    expect(sponsoredBuyFn).toContain('sponsored: true');
    expect(sponsoredBuyFn).toContain('runSponsoredBuy');
  });

  it('an ineligible listing falls through to self-paid rather than blocking', () => {
    // Everything except an already-sold listing returns false, and false means
    // marketBuy carries on to showContractCall.
    expect(sponsoredBuyFn).toMatch(/if \(!eligibility\.ok\) \{[\s\S]*?return false;\s*\}/);
    expect(sponsoredBuyFn).toContain("eligibility.reason === 'listing-sold'");
  });

  it('a missing relayer configuration falls through instead of failing', () => {
    expect(sponsoredBuyFn).toMatch(/if \(!client\) return false;/);
  });

  it('a recoverable sponsored failure offers a self-paid retry', () => {
    expect(marketSection).toContain('Pay my own network fee instead');
    expect(marketSection).toMatch(/marketBuy\(listing, \{ forceSelfPaid: true \}\)/);
  });

  it('the retry button is withheld when a second attempt could cost a fee', () => {
    // fallbackToSelfPaid is false for an already-sold listing and for a buy that
    // may still be confirming; the button must respect that, not always render.
    expect(marketSection).toMatch(/if \(!phase\.fallbackToSelfPaid\) return;/);
  });

  it('relayer-supplied text is escaped before reaching innerHTML', () => {
    expect(sponsoredBuyFn).toMatch(/escapeHtml\(/);
    expect(marketSection).toContain('const escapeHtml =');
  });

  it('decisions come from the shared module, not a local copy', () => {
    // If these move back inline, the React surface and this page can disagree
    // again — which is the drift that produced the false promise.
    for (const shared of [
      'runSponsoredBuy',
      'sponsoredBuyIneligibilityMessage',
      'sponsoredBuyProgressLabel',
      'getSponsoredBuyEligibility'
    ]) {
      expect(mainSource, `${shared} should be imported, not redefined`).toContain(
        `      ${shared}`
      );
      expect(mainSource).not.toContain(`const ${shared} =`);
    }
  });
});

describe('market page does not promise sponsored checkout ahead of the rehearsal', () => {
  it('no market copy claims the buyer needs no STX', () => {
    expect(marketCopy).not.toMatch(/no STX needed/i);
  });

  it('the buy button is unconditionally labelled "Buy"', () => {
    expect(marketSection).toContain("buy.textContent = 'Buy';");
    expect(marketSection).not.toMatch(/buy\.textContent\s*=\s*sponsored\s*\?/);
  });

  it('the market footnote does not advertise zero-STX buying', () => {
    const raw = /id="marketFootnote"[^>]*>([\s\S]*?)<\/p>/.exec(indexHtml)?.[1] ?? '';
    const footnote = raw.replace(/\s+/g, ' ').trim(); // the markup hard-wraps
    expect(footnote.length, 'marketFootnote not found').toBeGreaterThan(0);
    expect(footnote).not.toMatch(/zero STX|no STX/i);
    expect(footnote).toMatch(/buyers pay their own network fee/i);
  });

  it('the only zero-fee statement is made after settlement, never before', () => {
    const claims = marketCopy.match(/paid no network fee/g) ?? [];
    expect(claims).toHaveLength(1);
    // It sits in the settled branch, so it reports an outcome rather than
    // promising one.
    expect(sponsoredBuyFn).toMatch(
      /finalPhase\.phase === 'settled'[\s\S]*?paid no network fee/
    );
  });

  it('sponsored markets are hidden from the sell selector while the flag is off', () => {
    expect(marketSection).toContain('const SPONSORED_CHECKOUT_ENABLED = false;');
    expect(marketSection).toMatch(
      /SPONSORED_CHECKOUT_ENABLED \|\| !isSponsoredMarket\(entry\)/
    );
  });

  it('drops sponsored copy is untouched — drops really is sponsored', () => {
    // Drops claims genuinely go through showSponsoredContractCall, so their
    // "no STX needed" copy is accurate and must survive this guard.
    const dropsSection = mainSource.slice(mainSource.indexOf('const DROPS_DISPLAY_LIMIT'));
    expect(dropsSection).toContain('showSponsoredContractCall');
    expect(dropsSection).toMatch(/no STX needed/i);
  });
});
