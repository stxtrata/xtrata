import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { findAudionaut } from './core';
import { fetchEdition, lowestHeldAudionaut } from './edition';
import { fetchHelmet, helmetStyle } from './helmet';
import { createAccessScreen, wait, type ScanOutcome } from './access-screen';

// Where the sequencer lives. Empty = the unlocked state shows a "coming soon" card.
// Set to the sequencer inscription / hosted file (e.g. '/audionaut/daw.html').
const DAW_SRC = (document.body.dataset.dawSrc || '').trim();
const RECHECK_MS = 5 * 60 * 1000;
const REVEAL_PAUSE_MS = 1300; // let the "unlocked" chord finish before the screen steps aside

const wallet = createStacksWalletAdapter({ appName: 'Audionaut Sequencer', appIcon: location.origin + '/favicon.ico' });
const screen = createAccessScreen();
const $ = (id: string) => document.getElementById(id)!;

let busy = false;
let recheck: ReturnType<typeof setInterval> | undefined;
let sequencerLive = false;

const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-5);

// Top bar: a small still of the Audionaut's helmet, then its number (1 to 111) and Xtrata
// token id. Only one Audionaut is shown, the lowest-numbered one the wallet holds. The helmet
// is a plain image: no player, no audio, and nothing in it can be clicked.
function whoLabel(address: string, tokenId: number | undefined, edition?: number | null) {
  if (tokenId === undefined) return short(address);
  const xtrata = `Xtrata ID #${tokenId}`;
  return `${short(address)} · ${edition ? `Audionaut #${edition} · ${xtrata}` : xtrata}`;
}

let shownFor: string | undefined;
let identityRun = 0;

function clearIdentity() {
  identityRun++;
  shownFor = undefined;
  const thumb = $('granted-thumb');
  thumb.replaceChildren();
  thumb.hidden = true;
  $('granted-name').textContent = '';
}

async function resolveIdentity(address: string, gateTokenId: number | undefined) {
  const run = ++identityRun;
  shownFor = address;
  const who = $('granted-who');
  const thumb = $('granted-thumb');
  const current = () => run === identityRun && sequencerLive;
  const callsign = $('granted-name');
  who.textContent = short(address);
  callsign.textContent = '';
  thumb.replaceChildren();
  thumb.hidden = true;

  let pick = await lowestHeldAudionaut(address);
  if (!pick && gateTokenId !== undefined) pick = { tokenId: gateTokenId, edition: await fetchEdition(gateTokenId) };
  if (!current() || !pick) return;
  who.textContent = whoLabel(address, pick.tokenId, pick.edition);
  if (!pick.edition) return;
  callsign.textContent = helmetStyle(pick.edition)?.name ?? ''; // e.g. "Callisto"

  thumb.hidden = false; // hold the space while the picture loads
  const look = await fetchHelmet(pick.edition);
  if (!current()) return;
  if (!look) {
    thumb.hidden = true;
    return;
  }
  const img = document.createElement('img');
  img.src = look.src;
  img.alt = '';
  img.draggable = false;
  img.style.filter = look.filter;
  if (look.clipPath) img.style.clipPath = look.clipPath;
  if (look.pixel) img.style.imageRendering = 'pixelated';
  thumb.replaceChildren(img);
}

// The sequencer is mounted (and starts loading) the moment access is granted, under the access
// screen, so it is ready when the screen steps aside. It is never mounted before verification.
function prepareSequencer(address: string, tokenId: number | undefined) {
  sequencerLive = true;
  if (shownFor !== address) void resolveIdentity(address, tokenId);
  const frame = $('daw') as HTMLIFrameElement;
  const soon = $('daw-soon');
  $('state-granted').hidden = false;
  if (DAW_SRC) {
    if (frame.getAttribute('src') !== DAW_SRC) frame.setAttribute('src', DAW_SRC);
    frame.hidden = false;
    soon.hidden = true;
  } else {
    frame.hidden = true;
    soon.hidden = false;
  }
}
function stopSequencer() {
  sequencerLive = false;
  const frame = $('daw') as HTMLIFrameElement;
  frame.removeAttribute('src'); // stop the sequencer and drop its audio
  frame.hidden = true;
  $('state-granted').hidden = true;
  clearIdentity();
}

/** The real check. Never rejects: failures come back as a fault outcome for the screen. */
async function verifyAddress(address: string): Promise<ScanOutcome> {
  try {
    const result = await findAudionaut(address);
    if (result.holds) {
      const id = result.tokenId;
      return { kind: 'found', idText: id === undefined ? 'VERIFIED' : `XTRATA #${id}`, tokenId: id };
    }
    return { kind: 'denied', reason: 'No Audionaut in wallet' };
  } catch (error) {
    return { kind: 'fault', message: (error as Error).message || 'Something went wrong.' };
  }
}

function watch() {
  if (!recheck) recheck = setInterval(() => void verifySilently(), RECHECK_MS);
}
function unwatch() {
  clearInterval(recheck);
  recheck = undefined;
}

/** Runs the access screen for a connected address and, on success, steps aside for the sequencer. */
async function runScan(address: string) {
  $('denied-who').textContent = short(address);
  const result = await screen.scan(verifyAddress(address), {
    onGranted: (outcome) => prepareSequencer(address, outcome.tokenId)
  });
  if (result !== 'unlocked') {
    stopSequencer();
    return;
  }
  screen.setBusy(true); // hold the button while the screen steps aside
  await wait(REVEAL_PAUSE_MS);
  document.body.dataset.view = 'seq';
  watch();
}

async function verifySilently() {
  const session = wallet.getSession();
  if (!session.isConnected || !session.address || busy || document.body.dataset.view !== 'seq') return;
  const outcome = await verifyAddress(session.address);
  if (outcome.kind !== 'denied') return; // still a holder, or a lookup hiccup: keep the sequencer open
  unwatch();
  document.body.dataset.view = 'gate';
  $('denied-who').textContent = short(session.address);
  screen.showDenied('Audionaut no longer in wallet');
  await wait(500);
  stopSequencer();
}

async function enter() {
  if (busy) return;
  busy = true;
  try {
    screen.waitingForWallet();
    const session = await wallet.connect();
    if (!session.isConnected || !session.address) {
      screen.sealed();
      return;
    }
    if (session.network && session.network !== 'mainnet') {
      screen.showFault('Switch your wallet to Stacks mainnet and try again.');
      return;
    }
    await runScan(session.address);
  } catch (error) {
    screen.showFault((error as Error).message || 'Could not connect the wallet.');
  } finally {
    busy = false;
  }
}

async function recheckNow() {
  const session = wallet.getSession();
  if (!session.isConnected || !session.address) return enter();
  if (busy) return;
  busy = true;
  try {
    await runScan(session.address);
  } finally {
    busy = false;
  }
}

async function leave() {
  if (busy) return;
  busy = true;
  try {
    try {
      await wallet.disconnect();
    } catch {
      /* best effort */
    }
    unwatch();
    document.body.dataset.view = 'gate';
    $('denied-who').textContent = '';
    await wait(500); // the access screen fades back in over the sequencer
    stopSequencer();
    await screen.relock();
  } finally {
    busy = false;
  }
}

$('action').addEventListener('click', () => {
  if (screen.state === 'sealed') void enter();
  else if (screen.state === 'denied') void (screen.fault ? enter() : recheckNow());
});
$('switch').addEventListener('click', () => void enter());
for (const id of ['leave', 'leave-denied']) $(id).addEventListener('click', () => void leave());

// Returning visitor with a saved session: run the check again without a wallet popup.
{
  const session = wallet.getSession();
  if (session.isConnected && session.address && (!session.network || session.network === 'mainnet')) {
    busy = true;
    void runScan(session.address).finally(() => {
      busy = false;
    });
  }
}
