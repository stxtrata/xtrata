// The world a claim run happens in: a real radio page and a real wallet frame in Chromium, a virtual passkey
// authenticator, and a mocked server and chain. Nothing here signs or broadcasts anything real (AGENTS.md):
// the treasury, the gift endpoints and Hiro are all answered locally.
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, TransactionVersion } from '@stacks/transactions';

export const SITE = 'https://radio.xtrata.test';
export const WALLET = 'https://wallet.xtrata.test';
const pub = new URL('../../../public/', import.meta.url);
const dist = new URL('../../../dist-listening-wallet/', import.meta.url);

export const DEVICES = {
  desktop: { viewport: { width: 1280, height: 900 } },
  // WebKit rules (passkeys cannot be created in the frame): Chromium wearing Safari's user agent, as the existing new-tab test does.
  iphone: {
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1'
  }
};

const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const addr = () => getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01', TransactionVersion.Mainnet);

export const ALBUM = {
  title: 'Harness Sessions', subtitle: 'The Test Band', cover: 1,
  tracks: [1, 2, 3].map((id) => ({ id, title: 'Song ' + id, artist: 'The Test Band' }))
};
export const giftCode = () => Array.from({ length: 22 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');

/** The mocked server and chain. `opts` lets a scenario make the network misbehave. */
export function makeMock(opts = {}) {
  const treasury = addr(), gifter = addr();
  const m = {
    treasury, gifter, claims: [], claimedBy: new Map(), codes: new Map(), balance: 0n, mined: false, unmocked: new Set(), requests: 0,
    txid: '0x' + 'c'.repeat(64), failClaimOnce: opts.failClaimOnce ?? false,
    /** A fresh album gift link, as the giveaway page would hand out. */
    newGift() { const code = giftCode(); m.codes.set(code, { claimed: false }); return { code, link: `${SITE}/radio.html#gift=${code}` }; }
  };
  return m;
}

export async function startWorld({ device = 'desktop', mock = makeMock(), headless = true, record = null } = {}) {
  const csp = /Content-Security-Policy: (.+)/.exec(await readFile(new URL('_headers', dist), 'utf8'))[1];
  const browser = await chromium.launch({ headless, executablePath: process.env.CHROME_PATH || undefined });
  const context = await browser.newContext({ ...DEVICES[device] });
  const limits = { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 };
  const first = mock.newGift();
  if (device === 'iphone') {
    // Chromium's virtual passkeys belong to one tab, so "a new tab" is modelled as a full-screen page on the wallet
    // origin in the SAME tab (same keychain, same user activation rules). The wallet frame's window.open is routed to it.
    await context.addInitScript(() => {
      if (window.top === window) {
        window.addEventListener('message', (e) => {
          if (!e.data || !e.data.__harnessOpen) return;
          document.getElementById('harness-newtab')?.remove();
          const f = document.createElement('iframe');
          f.id = 'harness-newtab'; f.src = e.data.__harnessOpen;
          f.allow = 'publickey-credentials-create *; publickey-credentials-get *';
          f.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483647;background:#fff';
          document.body.appendChild(f);
        });
      } else {
        window.open = (url) => { window.parent.postMessage({ __harnessOpen: String(url) }, '*'); return null; };
      }
    });
  }
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    mock.requests++;
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname === '/create' ? 'create.html' : url.pathname.slice(1);
      try { return await route.fulfill({ body: await readFile(new URL(path, dist)), headers: { 'content-type': type(path), 'content-security-policy': csp } }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin !== SITE) return route.abort();
    const p = url.pathname;
    if (p === '/radio/listening-wallet/config')
      return json(route, { enabled: true, allowed: false, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, passkeyOnly: true, limits,
        gifts: { enabled: true, treasury: mock.treasury, turnstileSiteKey: null, admin: false, fee: '3000' } });
    if (p === '/radio/gift/status') {
      const asked = JSON.parse(route.request().postData() || '{}').code;
      const g = mock.codes.get(asked);
      return json(route, { status: g?.claimed ? 'claiming' : 'live', amount: '250000', source: 'campaign', from: null, label: '', expires: Date.now() + 86400000, player: ALBUM });
    }
    if (p === '/radio/gift/slots') {
      const root = url.searchParams.get('root');
      const taken = [...mock.claimedBy.values()].filter((c) => c.root === root).length;
      return json(route, { next: taken + 1 });
    }
    if (p === '/radio/gift/claim') {
      const body = JSON.parse(route.request().postData());
      if (mock.failClaimOnce) { mock.failClaimOnce = false; return json(route, { error: 'Broadcast failed: ConflictingNonceInMempool' }, 500); }
      mock.claims.push(body); mock.claimedBy.set(body.wallet, { root: body.binding?.root ?? null, slot: body.binding?.slot ?? 0 });
      if (mock.codes.has(body.code)) mock.codes.get(body.code).claimed = true;
      // The gift "lands" at once: the harness measures what the listener must do, not how long a block takes.
      mock.balance += 250000n; mock.mined = true;
      record?.({ kind: 'claim', wallet: body.wallet });
      return json(route, { txid: mock.txid, amount: '250000', already: false });
    }
    if (p === '/radio/gift/for') {
      const w = url.searchParams.get('wallet');
      return json(route, { gift: mock.claimedBy.has(w) ? { returnTo: mock.treasury, from: null, source: 'campaign', amount: '250000', txid: mock.txid, label: '', state: 'sent', player: ALBUM } : null });
    }
    if (p.startsWith('/hiro/mainnet/v2/accounts/')) return json(route, { balance: '0x' + mock.balance.toString(16), nonce: 0 });
    if (p === `/hiro/mainnet/extended/v1/tx/${mock.txid}`) return mock.mined ? json(route, { tx_status: 'success', canonical: true, is_unanchored: false }) : json(route, {}, 404);
    if (p.startsWith('/hiro/') || p.startsWith('/radio/counts') || p.startsWith('/radio/chain-likes') || p.startsWith('/radio/gift/shelf')) return json(route, p.includes('shelf') ? { albums: [], next: null } : {}, p.includes('shelf') ? 200 : 404);
    try { const path = p.slice(1) || 'index.html'; return await route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
    catch { mock.unmocked.add(p); return route.fulfill({ status: 404, body: '' }); }
  });
  return { browser, context, mock, code: first.code, link: first.link };
}

/** A virtual passkey device on this page (and its frames). Counts every real WebAuthn operation as it happens. */
export async function addAuthenticator(context, page, record, { prf = true } = {}) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: prf, automaticPresenceSimulation: true } });
  cdp.on('WebAuthn.credentialAdded', () => record({ kind: 'webauthn', op: 'create' }));
  cdp.on('WebAuthn.credentialAsserted', () => record({ kind: 'webauthn', op: 'get' }));
  return {
    cdp, authenticatorId,
    credentials: async () => (await cdp.send('WebAuthn.getCredentials', { authenticatorId })).credentials,
    /** Make the next passkey prompts fail like a cancelled Face ID (NotAllowedError), or work again. */
    setUserVerified: (v) => cdp.send('WebAuthn.setUserVerified', { authenticatorId, isUserVerified: v })
  };
}
