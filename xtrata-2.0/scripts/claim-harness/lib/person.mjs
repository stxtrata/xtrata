// A person trying to get from a gift link to playing music. They look at what is on screen and do the one
// obvious thing, exactly as a first-time listener would: tap the main button. Every tap is counted, because taps
// are the cost this harness exists to drive down. Scenarios can interfere (cancel a prompt, reload, lose storage)
// through `hooks`, which is how real-world messes are reproduced.
import { WALLET } from './world.mjs';

const MAIN_BUTTONS = ['Open album', 'Continue listening', 'Claim my gift · no wallet needed', 'Start listening'];

export async function walletFrame(page) {
  return page.frames().find((f) => f.url().startsWith(WALLET) && !f.url().includes('/create')) ?? null;
}

/** What the wallet frame is asking, if anything. */
export async function panelNow(page) {
  const frame = await walletFrame(page);
  if (!frame) return null;
  try {
    return await frame.evaluate(() => {
      const panel = document.getElementById('panel');
      if (!panel || panel.hidden) return null;
      const ok = document.getElementById('p-ok');
      return { title: document.getElementById('p-title')?.textContent ?? '', label: ok?.textContent ?? '', enabled: !!ok && !ok.disabled, error: document.getElementById('p-error')?.textContent ?? '' };
    });
  } catch { return null; }
}

/**
 * Music can be played: the album view's play button is live, or the panel shows plays left on an open album.
 * (The wallet frame must also be out of the way: no panel is waiting for a tap.)
 */
export async function playable(page) {
  if (await panelNow(page)) return false;
  return page.evaluate(() => {
    const b = document.querySelector('.al-play');
    if (b && !b.disabled && b.getBoundingClientRect().height > 0) return true;
    const t = document.querySelector('#ppp')?.textContent ?? '';
    return /[\d,]+ plays left/.test(t) && !/Your plays are arriving/i.test(t);
  }).catch(() => false);
}

/**
 * WebKit (every iPhone browser) cannot make a passkey inside the wallet frame, so the frame sends the person to a
 * wallet page in a new tab, they make it there, and come back. Every tap on the way counts. (How the "tab" is modelled:
 * see startWorld in world.mjs.)
 */
async function makePasskeyInNewTab({ page, record, tap, frame }) {
  await tap('frame', 'Make my passkey (new tab)', () => frame.locator('#p-ok').click({ timeout: 5000 }).catch(() => {}));
  const tab = page.frameLocator('#harness-newtab');
  const make = tab.getByRole('button', { name: 'Create passkey' });
  await make.waitFor({ timeout: 8000 }).catch(() => {});
  record({ kind: 'mark', label: 'switched-to-new-tab' });
  await tap('tab', 'Create passkey', () => make.click({ timeout: 5000 }).catch(() => {}));
  await tab.getByText('Passkey saved ✓').waitFor({ timeout: 8000 }).catch(() => {});
  await tap('tab', 'Switch back to the radio tab', () => page.evaluate(() => document.getElementById('harness-newtab')?.remove()));
  record({ kind: 'mark', label: 'back-in-radio-tab' });
  return true;
}

/** Words a first-time music listener should never have to read on the way to their album. ("passkey" is allowed: the phone itself says it.) */
const JARGON = [['STX', /\bSTX\b/], ['Stacks', /\bStacks\b/], ['wallet', /\bwallet/i], ['crypto', /\bcrypto/i], ['blockchain', /\bblockchain/i], ['on-chain', /\bon-chain/i], ['seed', /\bseed\b/i], ['address', /\baddress\b/i], ['gas', /\bgas\b/i]];

/** The words on screen right now that a listener should not need: in the page's panel and in the wallet box. */
export async function jargonOnScreen(page) {
  const own = await page.evaluate(() => {
    const ppp = document.querySelector('#ppp');
    return ppp && ppp.getBoundingClientRect().height > 0 ? ppp.innerText : '';
  }).catch(() => '');
  const frame = await walletFrame(page);
  const box = frame ? await frame.evaluate(() => { const p = document.getElementById('panel'); return p && !p.hidden ? p.innerText : ''; }).catch(() => '') : '';
  const text = own + '\n' + box;
  return JARGON.filter(([, re]) => re.test(text)).map(([w]) => w);
}

export function person({ page, context, auth, record, hooks = {}, maxMs = 40_000, goal = () => true }) {
  let taps = 0;
  const seenJargon = new Set();
  const log = (e) => record(e);
  const tap = async (where, label, run) => {
    taps++;
    log({ kind: 'tap', where, label });
    await run();
  };
  return {
    get taps() { return taps; },
    /** Keep doing the obvious thing until music can be played, or give up like a real person would. */
    async run() {
      const t0 = Date.now();
      let lastPanel = '', lastNudge = 0;
      while (Date.now() - t0 < maxMs) {
        for (const w of await jargonOnScreen(page)) if (!seenJargon.has(w)) { seenJargon.add(w); log({ kind: 'jargon', word: w }); }
        // The harness' chain is instant; tell the page to look again, as a real balance poll would.
        if (Date.now() - lastNudge > 1500) { lastNudge = Date.now(); await page.evaluate(() => window.dispatchEvent(new Event('xtrata:wallet-changed'))).catch(() => {}); }
        if (goal() && await playable(page)) { log({ kind: 'playable' }); return true; }
        const panel = await panelNow(page);
        if (panel) {
          if (panel.title !== lastPanel) { lastPanel = panel.title; log({ kind: 'panel', title: panel.title, label: panel.label }); }
          if (hooks.onPanel && (await hooks.onPanel(panel, { page, context }))) { lastPanel = ''; await page.waitForTimeout(400); continue; }
          // The frame says the sheet gave back the wrong passkey: a person looks at the list and picks the newest one.
          if (/different passkey/i.test(panel.error) && auth) {
            const all = await auth.credentials();
            for (const c of all.slice(0, -1)) await auth.cdp.send('WebAuthn.removeCredential', { authenticatorId: auth.authenticatorId, credentialId: c.credentialId }).catch(() => {});
            await tap('sheet', 'Pick the newest passkey in the list', async () => {});
            await page.waitForTimeout(300);
          }
          if (panel.enabled) {
            const frame = await walletFrame(page);
            if (/\(new tab\)/.test(panel.label)) { await makePasskeyInNewTab({ page, record, tap, frame }); await page.waitForTimeout(800); continue; }
            await tap('frame', panel.label, () => frame.locator('#p-ok').click({ timeout: 5000 }).catch(() => {}));
            // A person waits to see what happened before tapping again.
            await page.waitForTimeout(1500);
          } else await page.waitForTimeout(150);
          continue;
        }
        lastPanel = '';
        // Not in the wallet box: look for the page's own main button.
        let pressed = false;
        for (const name of MAIN_BUTTONS) {
          const b = page.getByRole('button', { name }).first();
          if (await b.isVisible().catch(() => false) && await b.isEnabled().catch(() => false)) {
            if (hooks.onMainButton && (await hooks.onMainButton(name, { page, context }))) { pressed = true; break; }
            await tap('page', name, () => b.click({ timeout: 5000 }).catch(() => {}));
            pressed = true; break;
          }
        }
        await page.waitForTimeout(pressed ? 500 : 250);
      }
      log({ kind: 'gave-up' });
      return false;
    }
  };
}
