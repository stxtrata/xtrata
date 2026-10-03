import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { findAudionaut } from './core';

// Where the sequencer lives. Empty = the unlocked state shows a "coming soon" card.
// Set to the sequencer inscription / hosted file (e.g. '/audionaut/daw.html').
const DAW_SRC = (document.body.dataset.dawSrc || '').trim();
const RECHECK_MS = 5 * 60 * 1000;

const wallet = createStacksWalletAdapter({ appName: 'Audionaut Sequencer', appIcon: location.origin + '/favicon.ico' });
const $ = (id: string) => document.getElementById(id)!;
const states = ['locked', 'working', 'denied', 'error', 'granted'] as const;
type State = (typeof states)[number];

let busy = false;
let recheck: ReturnType<typeof setInterval> | undefined;

function show(state: State) {
  for (const s of states) $('state-' + s).hidden = s !== state;
  document.body.dataset.state = state;
}
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-5);

function unlock(tokenId: number | undefined, address: string) {
  $('granted-who').textContent = `${short(address)}${tokenId !== undefined ? ` · Audionaut #${tokenId}` : ''}`;
  const frame = $('daw') as HTMLIFrameElement;
  const soon = $('daw-soon');
  if (DAW_SRC) {
    if (frame.getAttribute('src') !== DAW_SRC) frame.setAttribute('src', DAW_SRC);
    frame.hidden = false;
    soon.hidden = true;
  } else {
    frame.hidden = true;
    soon.hidden = false;
  }
  show('granted');
}
function relock() {
  const frame = $('daw') as HTMLIFrameElement;
  frame.removeAttribute('src'); // stop the sequencer and drop its audio
  frame.hidden = true;
}

async function verify(address: string, quiet = false) {
  if (!quiet) {
    show('working');
    $('working-msg').textContent = 'Scanning for an Audionaut…';
  }
  try {
    const result = await findAudionaut(address);
    if (result.holds) {
      unlock(result.tokenId, address);
      if (!recheck) recheck = setInterval(() => void verifySilently(), RECHECK_MS);
    } else {
      relock();
      clearInterval(recheck);
      recheck = undefined;
      $('denied-who').textContent = short(address);
      show('denied');
    }
  } catch (error) {
    if (quiet) return; // keep the sequencer open through a transient lookup failure
    $('error-msg').textContent = (error as Error).message || 'Something went wrong.';
    show('error');
  }
}
async function verifySilently() {
  const session = wallet.getSession();
  if (!session.isConnected || !session.address || busy) return;
  await verify(session.address, true);
}

async function enter() {
  if (busy) return;
  busy = true;
  try {
    show('working');
    $('working-msg').textContent = 'Opening your wallet…';
    const session = await wallet.connect();
    if (!session.isConnected || !session.address) {
      show('locked');
      return;
    }
    if (session.network && session.network !== 'mainnet') {
      $('error-msg').textContent = 'Switch your wallet to Stacks mainnet and try again.';
      show('error');
      return;
    }
    await verify(session.address);
  } catch (error) {
    $('error-msg').textContent = (error as Error).message || 'Could not connect the wallet.';
    show('error');
  } finally {
    busy = false;
  }
}
async function leave() {
  try {
    await wallet.disconnect();
  } catch {
    /* best effort */
  }
  clearInterval(recheck);
  recheck = undefined;
  relock();
  show('locked');
}

for (const id of ['connect', 'retry', 'switch']) $(id).addEventListener('click', () => void enter());
for (const id of ['leave', 'leave-denied']) $(id).addEventListener('click', () => void leave());
$('recheck').addEventListener('click', () => {
  const session = wallet.getSession();
  if (session.isConnected && session.address) void verify(session.address);
  else void enter();
});

// Returning visitor with a saved session: re-verify without a wallet popup.
{
  const session = wallet.getSession();
  if (session.isConnected && session.address && (!session.network || session.network === 'mainnet')) {
    busy = true;
    void verify(session.address).finally(() => {
      busy = false;
    });
  } else {
    show('locked');
  }
}
