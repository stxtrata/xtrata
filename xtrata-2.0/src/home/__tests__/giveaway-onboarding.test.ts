import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const page = read('../../../public/giveaway/onboarding.html');
const drop = read('../../../public/giveaway.html');

describe('/giveaway/onboarding: the challenge page for crypto people', () => {
  it('is a finished, indexable page with no template leftovers', () => {
    expect(page).toContain('rel="canonical" href="https://xtrata.xyz/giveaway/onboarding"');
    expect(page).not.toMatch(/<!--(THEMEBOOT|HEADER|BODY|FOOTER|THEMESEL)-->|\/\*CSS\*\//);
    expect(page.match(/<h1>/g)).toHaveLength(1);
  });

  it('sends the friend to the drop page and other crypto people to this page', () => {
    expect(page).toContain("var FRIEND='https://xtrata.xyz/giveaway';");
    expect(page).toContain("var PAGE='https://xtrata.xyz/giveaway/onboarding';");
    expect(page).toContain('href="/giveaway"');
  });

  it('keeps crypto words out of the message a non-crypto friend receives', () => {
    const msg = page.match(/id="msg">([^<]+)</)?.[1] ?? '';
    expect(msg).toContain('https://xtrata.xyz/giveaway');
    expect(msg).not.toMatch(/crypto|wallet|stx|stacks|blockchain|on-chain|seed|token|web3/i);
  });

  it('wires every id its script touches', () => {
    const script = page.slice(page.indexOf("var FRIEND="));
    const used = new Set([...script.matchAll(/\$\('([\w-]+)'\)/g)].map((m) => m[1]));
    for (const id of used) expect(page, id).toContain(`id="${id}"`);
  });

  it('is reachable from the drop page, which now points its challenge post here', () => {
    expect(drop).toContain('href="/giveaway/onboarding"');
    expect(drop).toContain("encodeURIComponent('https://xtrata.xyz/giveaway/onboarding')");
  });
});
