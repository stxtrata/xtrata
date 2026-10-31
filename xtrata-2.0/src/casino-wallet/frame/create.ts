/**
 * https://casino-wallet.xtrata.xyz/create: makes a casino-wallet passkey at the top level, for browsers that refuse to create one
 * inside the casino's wallet frame (WebKit: Safari and every iPhone browser). Same as the radio's create page: it only registers the
 * passkey. It never evaluates PRF, derives a key, signs or stores anything.
 */
import { browserPasskey } from '../../listening-wallet/frame/passkey';
import { parseCreateRequest } from '../../listening-wallet/frame/create-request';
import { CASINO_NAME, CASINO_PASSKEY } from './options';
import '../../listening-wallet/frame/wallet.css';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const ok = $('c-ok') as HTMLButtonElement;
const error = $('c-error');
const request = parseCreateRequest(location.hash, CASINO_NAME);
history.replaceState(null, '', location.pathname);

if (!request) {
  ok.hidden = true;
  $('c-intro').textContent = 'This link is not complete. Go back to the casino and tap “Make my passkey” again.';
} else {
  $('c-name').textContent = `It will be named “${request.name}”.`;
  const passkey = browserPasskey(CASINO_PASSKEY);
  if (!passkey.available()) {
    ok.hidden = true;
    error.textContent = 'This browser cannot make passkeys. Go back to the casino and choose "Play without a passkey".';
  }
  ok.onclick = async (event) => {
    if (!event.isTrusted) return;
    ok.disabled = true;
    error.textContent = '';
    try {
      const created = await passkey.create(request.exclude, request.name, request.userId);
      created.prf?.fill(0);
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
  setTimeout(() => { $('c-close').replaceWith(Object.assign(document.createElement('p'), { textContent: 'You can close this tab and switch back.', className: 'muted' })); }, 300);
});
