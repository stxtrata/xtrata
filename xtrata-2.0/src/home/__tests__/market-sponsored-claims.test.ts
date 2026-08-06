import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';

/**
 * Keeps the market page's sponsorship copy tied to what it can actually do.
 *
 * The page once advertised "Buy — no STX needed" and a green badge on sponsored
 * listings while `marketBuy` called `showContractCall` unconditionally, so the
 * buyer always paid their own fee. That sent zero-STX buyers into a transaction
 * they could not pay for.
 *
 * Stage 2 of docs/plans/SPONSORED-MARKET-BUY-PLAN.md wired the sponsored branch.
 * Stage 3 restored the copy on 2026-08-06: the testnet rehearsal it was gated on
 * is superseded by mainnet evidence (plan §0.1), there being no testnet.
 *
 * The guards therefore changed shape rather than relaxing. They no longer assert
 * "nothing promises free checkout"; they assert the promise is made **only where
 * it is true** — per listing, from real state, degrading to "you pay network fee"
 * when the escrow or the relayer cannot back it, and never in a market label that
 * cannot know which buyer is reading it.
 *
 * The blanket-claim guards stay, because the blanket claim is what caused the
 * 2026-08-06 overcharge.
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
 * Market section with comments stripped — both `//` lines and `/* *\/` blocks.
 * The copy assertions must test what a user can read, not the comments
 * explaining why the copy changed: those legitimately quote the removed
 * phrases, and a block comment doing so used to defeat these guards.
 */
const marketCopy = marketSection
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

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

  it('an ineligible listing stops and asks, instead of silently charging the buyer', () => {
    // This used to `return false`, which fell through to showContractCall and
    // opened a self-paid wallet prompt with no message. On 2026-08-06 that
    // charged a buyer 0.193 STX, 39 minutes after the same purchase was
    // sponsored for free, with nothing on screen to explain it.
    //
    // The buyer must still be ABLE to proceed self-paid — but by choosing to,
    // never by default. If this test fails because the code returns false here
    // again, fix the code: a silent fallback spends the buyer's money on a path
    // they did not pick.
    expect(sponsoredBuyFn).toContain("eligibility.reason === 'listing-sold'");
    expect(sponsoredBuyFn).not.toMatch(/if \(!eligibility\.ok\) \{[\s\S]*?return false;\s*\}/);
    // Says what happened, quotes the cost, and offers the choice.
    expect(sponsoredBuyFn).toMatch(/sponsored checkout unavailable/i);
    expect(sponsoredBuyFn).toMatch(/estimatedFeeUstx/);
    expect(sponsoredBuyFn).toMatch(/Pay my own network fee instead/);
    expect(sponsoredBuyFn).toMatch(/forceSelfPaid: true/);
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

  it('the sell selector is gated on what a market can accept, not a flag', () => {
    // The blanket SPONSORED_CHECKOUT_ENABLED gate is gone. It hid the only
    // markets that accept a v3 inscription, which left sellers with nowhere to
    // list at all. The gate is now the contract-level fact.
    expect(marketSection).not.toContain('SPONSORED_CHECKOUT_ENABLED');
    expect(marketSection).toMatch(
      /const sellEntries = \(\) =>\s*getSellableMarkets\(/
    );
  });

  it('a stale market selection is re-checked before the wallet opens', () => {
    expect(marketSection).toMatch(/if \(!marketAcceptsNftContract\(entry, activeNftContract\)\)/);
  });

  it('the sponsorship deposit is disclosed, in STX, before signing', () => {
    expect(marketCopy).toContain('Sponsorship deposit:');
    // Charged in STX on the sBTC and USDCx markets too, which is the detail a
    // seller is most likely to be caught by.
    expect(marketCopy).toMatch(/charged in STX even on an sBTC or USDCx listing/);
    // Refundability. Asserted on a phrase that survives the source's string
    // concatenation rather than one that spans a line join.
    expect(marketCopy).toMatch(/when the listing sells or you cancel/i);
  });

  it('the deposit is validated against the contract bounds before signing', () => {
    // list-token asserts fee-budget >= MIN-FEE-BUDGET, so an out-of-range
    // deposit would abort AFTER the seller approved and paid a miner fee.
    expect(marketSection).toContain('validateFeeBudget(budget)');
    expect(marketSection).toContain('clampFeeBudget');
  });

  it('drops sponsored copy is untouched — drops really is sponsored', () => {
    // Drops claims genuinely go through showSponsoredContractCall, so their
    // "no STX needed" copy is accurate and must survive this guard.
    const dropsSection = mainSource.slice(mainSource.indexOf('const DROPS_DISPLAY_LIMIT'));
    expect(dropsSection).toContain('showSponsoredContractCall');
    expect(dropsSection).toMatch(/no STX needed/i);
  });
});

describe('the market grid renders once per load', () => {
  const loadFn = (() => {
    const start = marketSection.indexOf('const loadMarketPage');
    expect(start, 'loadMarketPage not found').toBeGreaterThan(-1);
    const from = marketSection.slice(start);
    return from.slice(0, from.indexOf('\n    };'));
  })();

  it('the USD price book patches prices instead of re-rendering the grid', () => {
    // It used to call renderMarketListings, which replaceChildren's the grid and
    // rebuilds every card, thumbnail slot and button to change one text node
    // each — 48 thumbnail cache lookups for 24 cards. It was also what could
    // paint "no live listings" over a grid that was still loading, by winning
    // the race against the listings fetch.
    const usdCallback = loadFn.slice(loadFn.indexOf('loadUsdPriceBook'));
    const callbackBody = usdCallback.slice(0, usdCallback.indexOf('renderMarketToolbar'));
    expect(callbackBody).toContain('refreshMarketPrices');
    expect(callbackBody).not.toContain('renderMarketListings');
  });

  it('price nodes are addressable, which is what makes a targeted update possible', () => {
    expect(marketSection).toContain('price.dataset.marketPrice');
    expect(marketSection).toMatch(/const refreshMarketPrices = \(\) =>/);
    expect(marketSection).toContain('[data-market-price]');
  });

  it('reports how listings arrived, not merely that they did', () => {
    // "listings served from edge cache" printed identically for a 0.2s cache hit
    // and a ~4.5s cold origin scan, hiding the only number worth watching.
    // marketCopy has comments stripped: the comment explaining the rename
    // legitimately quotes the old string.
    expect(marketCopy).not.toContain('listings served from edge cache');
    expect(marketSection).toContain("debugLog('market', 'listings loaded'");
    expect(marketSection).toMatch(/elapsedMs: answer\.meta\.elapsedMs/);
    expect(marketSection).toMatch(/source: .*edge-cache.*origin-scan/s);
  });
});

describe('market registry labels make no fee promises', () => {
  // The original guard checked generated copy only, so it never saw the claim
  // baked into the registry's own `label` strings. Those printed straight into
  // the listing detail as "#6 on Xtrata Market sBTC v1.1 (Sponsored - no STX
  // needed)" while the same card said "sponsored checkout not yet enabled", and
  // a buyer went on to pay 0.193 STX. A label names a market; whether THIS buyer
  // pays a fee is decided per listing at render and re-checked at click time.
  const registry = JSON.parse(
    readFileSync(resolve(__dirname, '../../data/market-registry.json'), 'utf8')
  ) as Array<{ label: string }>;

  it('no label claims the buyer pays nothing', () => {
    for (const entry of registry) {
      expect(entry.label).not.toMatch(/no\s+(STX|fee)s?\s+needed/i);
      expect(entry.label).not.toMatch(/free/i);
      expect(entry.label).not.toMatch(/sponsored/i);
    }
  });
});

describe('the sponsored badge degrades honestly (plan Stage 3 tests)', () => {
  // SPONSORED-MARKET-BUY-PLAN.md §Stage 3: "assert exhausted-budget and
  // relayer-down listings do not advertise free checkout".
  //
  // The plan also warned that a badge rendered at list time cannot honestly
  // reflect click-time eligibility. That is why the badge is computed only from
  // state knowable at render (market kind, relayer configured, escrow covers the
  // floor) AND why marketSponsoredBuy stops and asks when the prediction is
  // wrong. Neither half is sufficient alone: without the badge the buyer reads
  // the market label, without the stop-and-ask the badge can silently overpromise.
  it('the badge is conditional on a relayer and a funded escrow', () => {
    expect(marketSection).toMatch(/sponsoredLikely[\s\S]{0,400}?isSponsoredMarket\(listing\.entry\)/);
    expect(marketSection).toMatch(/sponsoredLikely[\s\S]{0,400}?resolveSponsorBase\(listing\.entry\) !== null/);
    expect(marketSection).toMatch(/sponsoredLikely[\s\S]{0,400}?budgetRemaining >= SPONSOR_FEE_FLOOR_USTX/);
  });

  it('an exhausted or unsponsored listing says the buyer pays', () => {
    expect(marketSection).toMatch(/sponsoredLikely\s*\?[\s\S]{0,300}?You pay network fee/);
  });

  it('the badge never uses the phrasing the old false promise used', () => {
    // "no STX needed" was the label that cost a buyer 0.193 STX.
    expect(marketCopy).not.toMatch(/no STX needed/i);
  });
});
