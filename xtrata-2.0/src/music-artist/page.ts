import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { fetchCreatorSession, signInCreator, signOutCreator, type CreatorSessionState } from '../manage/lib/creator-session';
import { ARTIST_SESSION_API, ROYALTIES_API, royaltyCollections } from './routes';
import type { RoyaltyRow } from '../../functions/lib/audionaut-royalties';

const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const adapter = createStacksWalletAdapter({ appName: 'Xtrata Music · Artist portal', appIcon: '/favicon.svg' });
let session: CreatorSessionState = { status: 'loading' }, generation = 0, busy = false;
const view = document.body.dataset.artistView;
const signInNote = 'Use your receiving wallet. Sign a free message to verify your address.';

// The registry supplies links only. Access and payment proof stay on the server.
const cards = document.getElementById('collection-cards');
if (cards) cards.replaceChildren(...royaltyCollections.map(collection => {
  const card = document.createElement('article'); card.className = 'portal-card';
  const h = document.createElement('h2'), a = document.createElement('a');
  a.href = collection.path; a.textContent = collection.title; h.append(a);
  const description = document.createElement('p'); description.textContent = collection.royalty + '.';
  const rule = document.createElement('p'); rule.className = 'muted'; rule.textContent = collection.receivingRule + '.';
  const status = document.createElement('p'); status.id = 'audionaut-summary'; status.className = 'source-summary';
  status.textContent = 'Sign in to check your royalties.';
  const open = document.createElement('a'); open.href = collection.path; open.className = 'button-link'; open.textContent = 'View royalty ledger →';
  card.append(h, description, rule, status, open); return card;
}));
function summary(text: string) {
  const target = document.getElementById('audionaut-summary'); if (target) target.textContent = text;
}
function renderSession() {
  const active = session.status === 'signed-in';
  el('sign-in').hidden = active; el('sign-out').hidden = !active;
  el('wallet-address').hidden = !active;
  el('wallet-address').textContent = session.status === 'signed-in' ? session.address : '';
  el('access-title').textContent = active ? 'Artist portal · signed in' : 'Sign in to your artist portal';
  el('access-note').textContent = active ? 'Your sign-in works across the artist portal. Each ledger checks its receiving wallets.' : signInNote;
  summary(active ? 'Checking your Audionaut royalties…' : 'Sign in to check your royalties.');
}
async function refresh() {
  if (busy) return;
  busy = true; const mine = ++generation;
  el<HTMLButtonElement>('retry').disabled = true;
  try {
    const next = await fetchCreatorSession(ARTIST_SESSION_API);
    if (mine !== generation) return;
    if (next.status === 'unavailable' && session.status === 'signed-in') {
      renderSession(); summary('Royalty checks are temporarily unavailable.');
      el('retry').hidden = false; el('message').textContent = 'Your sign-in is saved. Could not check your session; please retry.'; return;
    }
    session = next; renderSession();
    el('retry').hidden = session.status !== 'unavailable';
    el('message').textContent = session.status === 'unavailable' ? 'Could not check your sign-in. Please retry.' : '';
    if (session.status !== 'signed-in') return;
    const endpoint = view === 'plays' ? ROYALTIES_API + '/plays' : royaltyCollections[0].api;
    const response = await fetch(endpoint, { credentials: 'same-origin', cache: 'no-store' });
    const body = await response.json();
    if (mine !== generation) return;
    if (response.status === 401) {
      session = { status: 'signed-out', mode: 'enforce' }; renderSession(); return;
    }
    if (!response.ok) {
      summary(response.status === 403 ? 'This wallet does not currently hold an Audionaut artist’s receiving song.' : 'Royalty checks are temporarily unavailable.');
      el('retry').hidden = response.status === 403;
      el('message').textContent = response.status === 403 ? '' : 'Your sign-in is saved. Retry the royalty checks shortly.';
      return;
    }
    if (view === 'plays') {
      el('plays-status').textContent = body.message || 'Artist pay-per-play reporting is being prepared.';
      return;
    }
    const address = session.address;
    const rows = (body.rows as RoyaltyRow[]).filter(row => row.receivingAddress === address || row.recipient === address);
    const paid = rows.filter(row => row.status === 'paid' || row.status === 'retained').length;
    const unrecorded = rows.filter(row => row.status === 'unrecorded').length;
    const unverified = rows.filter(row => row.status === 'unverified').length;
    summary(`${rows.length} minted editions linked to your wallet · ${paid * 5} STX settled · ${unrecorded} without a recorded receipt${unverified ? ` · ${unverified} need verification` : ''}.`);
  } catch {
    if (mine !== generation) return;
    summary('Royalty checks are temporarily unavailable.');
    el('message').textContent = 'Could not load your artist dashboard. Check your connection and retry.';
    el('retry').hidden = false;
  } finally { busy = false; el<HTMLButtonElement>('retry').disabled = false; }
}
el('sign-in').onclick = async () => {
  const button = el<HTMLButtonElement>('sign-in'); button.disabled = true;
  try {
    ++generation;
    el('message').textContent = 'Choose your receiving wallet, then approve the sign-in message.';
    await adapter.connect();
    const address = adapter.getSession().address;
    if (!address || !/^(SP|SM)/.test(address)) throw Error('Choose a Stacks mainnet receiving wallet.');
    const result = await signInCreator(address, requestStructuredSignature, ARTIST_SESSION_API);
    if (result.status !== 'signed-in') throw Error('Could not confirm your sign-in. Please retry.');
    session = result; renderSession(); await refresh();
  } catch (error) {
    el('message').textContent = error instanceof Error ? error.message : 'Sign-in was cancelled.';
  } finally { button.disabled = false; }
};
el('sign-out').onclick = async () => {
  ++generation; session = { status: 'signed-out', mode: 'enforce' }; renderSession();
  el('retry').hidden = true; el('message').textContent = '';
  await signOutCreator(ARTIST_SESSION_API); await adapter.disconnect();
};
el('retry').onclick = () => void refresh();
void refresh();
setInterval(() => { if (session.status === 'signed-in' && !document.hidden && !busy) void refresh(); }, 60_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) void refresh(); });
window.addEventListener('pageshow', event => { if (event.persisted) void refresh(); });
