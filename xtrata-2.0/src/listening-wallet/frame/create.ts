/**
 * https://wallet.xtrata.xyz/create: makes a listening-wallet passkey at the top level, for browsers that refuse to
 * create one inside the radio's wallet frame (WebKit: Safari and every iPhone browser). It only registers the
 * passkey: it never evaluates PRF, derives a key, signs or stores anything. The frame then signs in with the new
 * passkey and checks it is this one by its user id (see engine.ts `create`).
 */
import { browserPasskey } from './passkey';
import { parseCreateRequest } from './create-request';
import './wallet.css';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const ok = $('c-ok') as HTMLButtonElement;
const error = $('c-error');
const request = parseCreateRequest(location.hash);
// The request is public, but there is no reason to keep it in the address bar or history.
history.replaceState(null, '', location.pathname);

if (!request) {
  ok.hidden = true;
  $('c-intro').textContent = 'This link is not complete. Go back to Xtrata Radio and tap “Make my passkey” again.';
} else {
  $('c-name').textContent = `It will be named “${request.name}”.`;
  const passkey = browserPasskey();
  if (!passkey.available()) {
    ok.hidden = true;
    error.textContent = 'This browser cannot make passkeys. Listening on Xtrata Radio stays free.';
  }
  ok.onclick = async (event) => {
    if (!event.isTrusted) return;
    ok.disabled = true;
    error.textContent = '';
    try {
      const created = await passkey.create(request.exclude, request.name, request.userId);
      created.prf?.fill(0); // not needed here: the wallet is derived in the radio's frame, from a fresh sign-in
      ok.hidden = true;
      $('c-intro').hidden = true;
      $('c-done').hidden = false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'The passkey could not be made.';
      error.textContent = message + (/cancelled|timed out/i.test(message)
        ? ' If no Face ID or Touch ID prompt appeared, check that passwords sync is on (on iPhone: Settings → your name → iCloud → Passwords).'
        : '');
      ok.disabled = false;
    }
  };
}
$('c-close').addEventListener('click', () => {
  window.close();
  // Some browsers do not let a page close its own tab: say what to do instead.
  setTimeout(() => { $('c-close').replaceWith(Object.assign(document.createElement('p'), { textContent: 'You can close this tab and switch back.', className: 'muted' })); }, 300);
});
