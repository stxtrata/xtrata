// The scenarios. Each is a real way a real person ends up with a gift link, and each says what a good outcome is.
// A scenario that exposes a mess is written FIRST (it fails or scores badly), then the product is changed until it
// passes. Never edit a scenario to make a number look better: add a new one when reality shows a new mess.
//
// env: { world, page, auth, record, mock, open(link), claim(link?, hooks?), frame(), clearWalletStorage() }
import { walletFrame } from '../lib/person.mjs';

/** Wallet-frame buttons are clicked by id; a person who closes a panel presses this. */
const cancelPanel = async (page) => (await walletFrame(page))?.locator('#p-cancel').click({ timeout: 3000 }).catch(() => {});

export const scenarios = [
  {
    name: 'first-claim',
    why: 'The happy path: a brand-new listener on a desktop browser taps a free-album link. This is the floor every other number is compared with.',
    device: 'desktop', ui: 'panel',
    async run(env) { await env.claim(); },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'first-claim-albumpage',
    why: 'Same, with the separate Album First page switched on (?albumpage=1), which has its own buttons and copy.',
    device: 'desktop', ui: 'albumpage',
    async run(env) { await env.claim(); },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'reload-after-create',
    why: 'The passkey is made, then the page reloads (phone tab discarded, accidental pull-to-refresh, a crash). The wallet has not been "remembered" yet, so the page thinks this device is new and offers to make another passkey.',
    device: 'desktop', ui: 'panel',
    async run(env) {
      let done = false;
      await env.claim(undefined, { onPanel: async (panel, { page }) => {
        if (done || panel.title !== 'One more check') return false;
        done = true; await page.reload(); return true;
      } });
    },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'close-panel-after-create',
    why: 'The passkey is made, then the person closes the confirmation panel (Cancel) and starts again. Nothing records the passkey that now exists.',
    device: 'desktop', ui: 'panel',
    async run(env) {
      let done = false;
      await env.claim(undefined, { onPanel: async (panel, { page }) => {
        if (done || panel.title !== 'One more check') return false;
        done = true; await page.waitForTimeout(900); await cancelPanel(page); return true;
      } });
    },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'prompt-fails-then-works',
    why: 'Control: Face ID fails once on the confirmation step (Stolen Device Protection, a timeout) and works on the retry. Retrying inside the panel should never create another passkey.',
    device: 'desktop', ui: 'panel',
    async run(env) {
      let done = false;
      await env.claim(undefined, { onPanel: async (panel) => {
        if (done || panel.title !== 'One more check') return false;
        done = true;
        await env.failNextPasskeyPrompt(); // the person taps as usual: the first try fails, the second works
        return false;
      } });
    },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'second-album-same-device',
    why: 'Someone who already has an album claims another from the giveaway. One passkey must hold many albums.',
    device: 'desktop', ui: 'panel',
    async run(env) {
      await env.claim();
      env.mark('second-album');
      await env.claim(env.mock.newGift().link);
    },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'storage-lost-then-second-album',
    why: 'The passkey is still in the password manager, but this browser forgot the wallet (cleared site data, a different browser or in-app browser on the same phone, Safari clearing storage). The next album link is treated as a brand-new person.',
    device: 'desktop', ui: 'panel',
    async run(env) {
      await env.claim();
      await env.clearWalletStorage();
      env.mark('second-album');
      await env.claim(env.mock.newGift().link);
    },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'iphone-first-claim',
    why: 'A brand-new listener on an iPhone (every iPhone browser is WebKit): the passkey must be made in a second tab and the person must come back. This is where most first-timers are lost.',
    device: 'iphone', ui: 'panel',
    async run(env) { await env.claim(); },
    good: { passkeys: 1, playable: true }
  },
  {
    name: 'iphone-reload-while-in-new-tab',
    why: 'The phone discards the radio tab while the person is making the passkey in the other one (iOS reclaims memory from background tabs). Back in the radio tab nothing remembers the passkey that was just made, so it offers to make another.',
    device: 'iphone', ui: 'panel',
    async run(env) {
      let done = false;
      await env.claim(undefined, { onPanel: async (panel, { page }) => {
        if (done || panel.title !== 'Made your passkey?') return false;
        done = true; await page.reload(); return true;
      } });
    },
    good: { passkeys: 1, playable: true }
  }
];
