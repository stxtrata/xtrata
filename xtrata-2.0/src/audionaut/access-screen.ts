// The Audionaut access screen: identity check -> access granted -> lock release -> unlocked.
// Ported from the standalone access screen. It owns the panel (lamps, readout, meter, lock row)
// and its sounds, but knows nothing about wallets: the page hands it a promise for the real
// verdict and it plays the sequence around it.
import { createAccessAudio } from './access-audio';

export type ScreenState = 'sealed' | 'scanning' | 'granted' | 'unlocking' | 'unlocked' | 'relocking' | 'denied';

export type ScanOutcome =
  | { kind: 'found'; idText: string; tokenId?: number }
  | { kind: 'denied'; reason: string }
  | { kind: 'fault'; message: string };

export type ScanResult = 'unlocked' | 'denied' | 'fault';

// light colour, pulse, phase label, caption
const LIGHTS: Record<ScreenState, [string, string, string, string]> = {
  sealed: ['red', 'steady', 'LOCKED', 'A–07 · sealed'],
  scanning: ['amber', 'slow', 'SCANNING', 'A–07 · verifying'],
  granted: ['green', 'blink', 'GRANTED', 'A–07 · cleared'],
  unlocking: ['amber', 'fast', 'RELEASE', 'A–07 · cycling'],
  unlocked: ['green', 'steady', 'UNLOCKED', 'A–07 · open'],
  relocking: ['amber', 'slow', 'SEALING', 'A–07 · cycling'],
  denied: ['red', 'flash', 'DENIED', 'A–07 · fault']
};

const SCAN_GUARD_MS = 45_000;
const CONNECT_LABEL = 'CONNECT WALLET';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Sleep that collapses to a blink for visitors who asked for reduced motion. */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, reduced() ? 15 : ms));

export function createAccessScreen() {
  const $ = (id: string) => document.getElementById(id) as HTMLElement;
  const root = $('stage');
  const locks = [...root.querySelectorAll<HTMLElement>('.lock')];
  const action = $('action') as HTMLButtonElement;
  let state: ScreenState = 'sealed';
  let lightColor = 'red';
  let soundEnabled = false;
  let fault = false;

  const audio = createAccessAudio({ isEnabled: () => soundEnabled, reducedMotion: reduced });

  function setLights(color: string, pulse: string) {
    root.dataset.light = color;
    root.dataset.pulse = pulse;
    if (color !== lightColor) {
      lightColor = color;
      audio.lamp(color);
    }
  }
  function setState(next: ScreenState, status?: string, label?: string) {
    state = next;
    root.dataset.state = next;
    const [color, pulse, phase, caption] = LIGHTS[next];
    setLights(color, pulse);
    $('phase').textContent = phase;
    $('caption').textContent = caption;
    if (status) $('statusText').textContent = status;
    if (label) $('actionLabel').textContent = label;
  }
  function setScreen(headline: string, detail: string, progress: number, mode?: string, idText?: string) {
    $('headline').textContent = headline;
    $('detail').textContent = detail;
    $('meter').style.width = progress + '%';
    if (mode) root.dataset.mode = mode;
    if (idText !== undefined) $('idText').textContent = idText;
  }
  function setBusy(value: boolean) {
    action.disabled = value;
    root.setAttribute('aria-busy', String(value));
  }
  function setFault(value: boolean) {
    fault = value;
    root.dataset.fault = value ? '1' : '0';
  }
  function resetLocks() {
    for (const l of locks) l.classList.remove('released', 'working');
  }
  function toSealed() {
    resetLocks();
    setFault(false);
    setScreen('Awaiting identity', 'Present Audionaut credential', 0, 'idle', 'ID --');
    setState('sealed', 'SEALED · AWAITING AUDIONAUT', CONNECT_LABEL);
  }

  /** The wallet prompt is open: stay sealed, show what is being waited for. */
  function waitingForWallet() {
    resetLocks();
    setFault(false);
    setScreen('Awaiting identity', 'Approve the wallet prompt', 0, 'idle', 'ID --');
    setState('sealed', 'WAITING FOR WALLET', CONNECT_LABEL);
    setBusy(true);
  }

  function sealed() {
    toSealed();
    setBusy(false);
  }

  /** Red "no Audionaut" screen. Stays up until the visitor acts. */
  function showDenied(reason = 'No Audionaut in wallet') {
    resetLocks();
    setFault(false);
    setScreen('Access denied', reason, 100, 'denied', 'ID NONE');
    setState('denied', 'ACCESS DENIED · NOTHING UNLOCKED', 'CHECK AGAIN');
    audio.deny();
    setBusy(false);
  }

  /** Red "could not check" screen (lookup failed, wrong network, wallet error). */
  function showFault(message: string) {
    resetLocks();
    setFault(true);
    setScreen('Signal lost', message, 100, 'denied', 'ID ERROR');
    setState('denied', 'FAULT · READY TO RETRY', 'TRY AGAIN');
    audio.deny();
    setBusy(false);
  }

  /**
   * Play the check. `verdict` is the real lookup, already running; the scan stages play at their
   * own pace and then wait for it if it has not finished.
   */
  async function scan(verdict: Promise<ScanOutcome>, hooks: { onGranted?: (outcome: Extract<ScanOutcome, { kind: 'found' }>) => void } = {}): Promise<ScanResult> {
    audio.resume();
    setBusy(true);
    let guard: ReturnType<typeof setTimeout> | undefined;
    try {
      resetLocks();
      setFault(false);
      const settled: Promise<ScanOutcome> = Promise.race([
        verdict,
        new Promise<ScanOutcome>((resolve) => {
          guard = setTimeout(() => resolve({ kind: 'fault', message: 'The registry did not answer. Try again.' }), SCAN_GUARD_MS);
        })
      ]).catch((error: unknown) => ({ kind: 'fault', message: (error as Error)?.message || 'Something went wrong.' }) as ScanOutcome);

      setState('scanning', 'CHECKING FOR AUDIONAUTS · HOLD POSITION', 'SCANNING');
      setScreen('Checking for Audionauts', 'Contacting Xtrata registry', 18, 'scan', 'ID --');
      audio.clunk(0.12);
      audio.scan();
      audio.beep(790, 0.07, 0.08);
      await wait(460);
      setScreen('Checking for Audionauts', 'Matching wallet signature', 47);
      audio.beep(860, 0.07, 0.08);
      await wait(620);
      setScreen('Checking for Audionauts', 'Verifying on-chain profile', 74);
      audio.beep(930, 0.07, 0.08);
      await wait(680);

      const outcome = await settled;
      if (outcome.kind === 'denied') {
        showDenied(outcome.reason);
        return 'denied';
      }
      if (outcome.kind === 'fault') {
        showFault(outcome.message);
        return 'fault';
      }

      setScreen('Audionaut found', 'Clearance granted', 100, 'found', 'ID ' + outcome.idText);
      setState('granted', 'AUDIONAUT VERIFIED · CLEARANCE GRANTED', 'AUTHORISED');
      audio.clunk(0.25);
      audio.success();
      hooks.onGranted?.(outcome);
      await wait(900);

      setState('unlocking', 'RELEASING LOCKS · STAND CLEAR', 'UNLOCKING');
      setScreen('Releasing locks', 'Disengaging seal 0 / 4', 0, 'found');
      audio.wheel();
      for (let i = 0; i < locks.length; i++) {
        locks[i].classList.add('working');
        await wait(300);
        locks[i].classList.remove('working');
        locks[i].classList.add('released');
        audio.clunk(0.35 + i * 0.1);
        setScreen('Releasing locks', `Disengaging seal ${i + 1} / 4`, (i + 1) * 25);
        await wait(120);
      }
      audio.hiss();
      await wait(420);
      setScreen('Access granted', 'Airlock unlocked · welcome aboard', 100, 'found');
      setState('unlocked', 'AUDIONAUT VERIFIED · AIRLOCK UNLOCKED', 'ENTERING');
      audio.portal();
      return 'unlocked';
    } catch (error) {
      showFault((error as Error)?.message || 'Unlock sequence interrupted.');
      return 'fault';
    } finally {
      clearTimeout(guard);
      // The page keeps the button busy while it reveals the sequencer after an unlock.
      if (state !== 'unlocked') setBusy(false);
    }
  }

  /** Locks re-engage and the panel returns to sealed (disconnect). */
  async function relock() {
    if (state === 'sealed') {
      setBusy(false);
      return;
    }
    audio.resume();
    setBusy(true);
    try {
      if (state === 'unlocked') {
        setState('relocking', 'ENGAGING LOCKS · SEALING', 'SEALING');
        setScreen('Engaging locks', 'Sealing chamber', 100, 'scan');
        for (let i = locks.length - 1; i >= 0; i--) {
          locks[i].classList.remove('released');
          locks[i].classList.add('working');
          await wait(170);
          locks[i].classList.remove('working');
          audio.clunk(0.3);
          $('meter').style.width = i * 25 + '%';
        }
        await wait(200);
      }
      toSealed();
    } finally {
      setBusy(false);
    }
  }

  $('sound').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const button = $('sound');
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', soundEnabled ? 'Disable sound effects' : 'Enable sound effects');
    $('soundLabel').textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    audio.resume();
    audio.mute(!soundEnabled);
    if (soundEnabled) audio.powerOn();
  });

  return {
    get state() {
      return state;
    },
    get fault() {
      return fault;
    },
    setBusy,
    waitingForWallet,
    sealed,
    scan,
    relock,
    showDenied,
    showFault
  };
}

export type AccessScreen = ReturnType<typeof createAccessScreen>;
