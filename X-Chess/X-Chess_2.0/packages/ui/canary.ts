// The gates canary.
//
// Takes X Chess 2 from nothing to a permanent inscription, one physically
// gated step at a time, with every transaction signed by the browser wallet.
//
// NO SEED PHRASE. NO PRIVATE KEY. NO ENVIRONMENT VARIABLE. The page builds each
// request, shows it in full, and hands it to whichever wallet the browser has.
// Nothing is signed here and nothing is sent without a deliberate confirmation.
//
// Every irreversible step asks you to type what it is about to do before it
// will run. That is not ceremony: a deploy and an inscription cannot be undone,
// and the difference between "I meant that" and "I clicked that" is the whole
// reason this page exists.

import {
  PHASE_TITLES,
  STEPS,
  blockedBy,
  initialStates,
  invalidateFrom,
  isAvailable,
  progress
} from './gates.js';
import type { Phase, StepDef, StepStates } from './gates.js';
import { CSS as APP_CSS } from './shell.js';

export interface StepResult {
  ok: boolean;
  /** What was read back. Shown, and included in the report. */
  detail: string;
  /** Anything worth keeping for ops/RELEASES.md. */
  record?: Record<string, unknown>;
}

export type StepHandler = (ctx: CanaryContext) => Promise<StepResult>;

export interface CanaryContext {
  log: (level: 'info' | 'ok' | 'warn' | 'error', message: string, detail?: unknown) => void;
  /** Values gathered by earlier steps: the address, the contract id, game ids. */
  state: Record<string, unknown>;
  /** A field the operator filled in on this step's card. */
  input: (name: string) => string;
  /**
   * Wait for a transaction to leave the mempool, then say how it ended.
   *
   * Every step that sends something used to stop here and tell the operator to
   * come back and press Run again once it confirmed. Multiplied across a page
   * of twenty-six steps, several of which send more than one transaction, that
   * is a great deal of watching an explorer and clicking - and none of it is a
   * DECISION. Nobody is judging anything while they wait.
   *
   * So the page waits instead. What still needs a person is the signature and
   * the typed confirmation before an irreversible action, which are the two
   * things that should never be automated.
   */
  confirm: (txid: string, what?: string) => Promise<TxOutcome>;
}

export interface TxOutcome {
  /** True only for `success`. An abort is settled, and is not a success. */
  ok: boolean;
  /** The chain's own word: success, abort_by_post_condition, and so on. */
  status: string;
  txid: string;
  /** Set when the wait gave up rather than the chain answering. */
  timedOut?: boolean;
}

export interface CanaryOptions {
  handlers: Record<string, StepHandler>;
  /** Extra text inputs a step needs, by step id. */
  inputs?: Record<string, { name: string; label: string; placeholder?: string }[]>;
  document?: Document;
  /** Everything the build knows about itself. */
  build?: Record<string, unknown>;
}

export const CANARY_CSS = `${APP_CSS}
.phase { margin: 18px 0 8px; color: var(--gold); font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
.step { background: var(--panel); border: 1px solid var(--line); border-left-width: 4px; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
.step--waiting { border-left-color: var(--line); }
.step--running { border-left-color: var(--gold); }
.step--ok { border-left-color: var(--good); }
.step--failed { border-left-color: var(--warn); }
.step--locked { opacity: .55; }
.step-head { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
.step-num { color: var(--dim); font-family: ui-monospace, monospace; font-size: 12px; min-width: 3ch; }
.step-title { font-weight: 600; }
.step-why { color: var(--dim); font-size: 12px; margin: 6px 0 10px; }
.step-detail { font-family: ui-monospace, monospace; font-size: 11px; white-space: pre-wrap;
               background: #14120f; border: 1px solid var(--line); border-radius: 6px;
               padding: 8px; margin-top: 8px; max-height: 220px; overflow: auto; }
.tag { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; padding: 2px 6px;
       border-radius: 4px; border: 1px solid var(--line); color: var(--dim); }
.tag--irreversible { color: var(--warn); border-color: var(--warn); }
.tag--manual { color: var(--gold); border-color: var(--gold); }
.confirm { border: 1px solid var(--warn); border-radius: 6px; padding: 10px; margin-top: 8px; }
.confirm input { margin-top: 6px; }
#log { position: sticky; bottom: 0; max-height: 30vh; overflow: auto; font-family: ui-monospace, monospace;
       font-size: 11px; background: #14120f; border: 1px solid var(--line); border-radius: 8px; padding: 8px; }
.log-warn { color: var(--warn); }
.log-ok { color: var(--good); }
.log-info { color: var(--dim); }
`;

/**
 * The word an operator has to type before an irreversible step will run.
 *
 * Deliberately the step's own id rather than "yes" or "confirm". Typing
 * `prod-inscribe` requires having read which step you are on, which is exactly
 * the mistake being guarded against.
 */
export const confirmWord = (step: StepDef): string => step.id;

export class Canary {
  private readonly doc: Document;
  private readonly options: CanaryOptions;
  private states: StepStates = initialStates();
  /**
   * What the operator has typed, kept OUT of the DOM.
   *
   * `render()` rebuilds every card, so an input element does not survive a
   * re-render - and marking a step `running` triggers one. Reading the value
   * off the element at handler time therefore read a field that had been
   * destroyed and recreated empty a moment earlier, and every step with an
   * input failed as though nothing had been typed.
   */
  private readonly values: Record<string, string> = {};
  private readonly details: Record<string, string> = {};
  private records: Record<string, unknown> = {};
  private readonly context: CanaryContext;
  private root!: HTMLElement;
  private logNode!: HTMLElement;

  private readonly slot: string;

  constructor(options: CanaryOptions) {
    this.options = options;
    this.doc = options.document ?? document;
    // Keyed by what this page is FOR. A run against a different contract or a
    // different network is a different run, and must not resume into this one.
    this.slot = `xchess-gates:${String(options.build?.network)}:${String(options.build?.contract)}`;
    this.restore();
    this.context = {
      log: (level, message, detail) => this.log(level, message, detail),
      state: {},
      input: (name) => (this.values[name] ?? '').trim(),
      confirm: (txid, what) => this.confirm(txid, what)
    };
    this.mount();
    this.render();
  }

  /**
   * Watch a transaction until the chain has finished with it.
   *
   * Polled rather than pushed, because there is nothing to push from - no
   * server, and that is the whole point of this project. The interval is
   * deliberately unhurried: the public endpoint's allowance is shared with the
   * WALLET, and a page that hammered it while somebody was trying to sign the
   * next transaction would be taking away the thing it is waiting for.
   *
   * Gives up after twenty minutes and says so. A transaction that has not been
   * mined by then has usually been dropped for too low a fee, and telling
   * somebody that is more use than spinning forever.
   */
  private async confirm(txid: string, what = 'the transaction'): Promise<TxOutcome> {
    const id = txid.startsWith('0x') ? txid : `0x${txid}`;
    const base = String(this.options.build?.api ?? 'https://api.mainnet.hiro.so');
    const deadline = Date.now() + 20 * 60_000;
    let announced = false;

    for (;;) {
      try {
        const response = await fetch(`${base}/extended/v1/tx/${id}`);
        if (response.ok) {
          const body = (await response.json()) as { tx_status?: string };
          const status = String(body.tx_status ?? '');
          if (status && status !== 'pending') {
            const ok = status === 'success';
            this.log(
              ok ? 'ok' : 'error',
              `${what} ${ok ? 'confirmed' : `ended as ${status}`}`,
              id
            );
            return { ok, status, txid: id };
          }
        }
      } catch {
        // A read that failed is not an answer about the transaction. Keep
        // waiting: the endpoint being briefly unreachable says nothing.
      }

      if (!announced) {
        this.log('info', `waiting for ${what} to confirm; nothing else to do`, id);
        announced = true;
      }
      if (Date.now() > deadline) {
        this.log('warn', `gave up waiting for ${what} after twenty minutes`, id);
        return { ok: false, status: 'timeout', txid: id, timedOut: true };
      }
      await new Promise((done) => setTimeout(done, 10_000));
    }
  }

  private mount(): void {
    const style = this.doc.createElement('style');
    style.textContent = CANARY_CSS;
    this.doc.head.appendChild(style);

    this.doc.body.innerHTML = `
<main>
  <div class="topbar">
    <h1>X Chess 2 &mdash; gates</h1>
    <span id="build-tag" class="muted small mono"></span>
    <span id="progress" class="muted small"></span>
    <button class="action" id="report">Copy report</button>
    <button class="action" id="start-over">Start over</button>
  </div>
  <div class="notice notice--warn">
    Every step marked <span class="tag tag--irreversible">irreversible</span> spends money or
    writes something that cannot be withdrawn. Nothing runs until the step before it has been
    <strong>read back off chain</strong>, and nothing irreversible runs until you type its name.
  </div>
  <div id="steps"></div>
  <div id="log">ready</div>
</main>`;

    // Which build this is. During frequent rebuilds it is the first thing
    // worth knowing and the easiest thing to be wrong about.
    const build = this.options.build ?? {};
    this.doc.getElementById('build-tag')!.textContent = [
      build.version,
      build.built,
      build.hash ? `#${build.hash}` : null,
      build.network
    ]
      .filter(Boolean)
      .join(' · ');

    this.root = this.doc.getElementById('steps')!;
    this.logNode = this.doc.getElementById('log')!;
    this.doc.getElementById('report')!.addEventListener('click', () => this.copyReport());
    this.doc.getElementById('start-over')!.addEventListener('click', () => {
      // Only clears this page's record of the run. It cannot undo a deploy.
      if (this.doc.defaultView?.confirm('Forget this run? Nothing on chain is undone.')) {
        this.startOver();
      }
    });
  }

  log(level: 'info' | 'ok' | 'warn' | 'error', message: string, detail?: unknown): void {
    const line = this.doc.createElement('div');
    line.className = `log-${level === 'error' ? 'warn' : level}`;
    // BigInt breaks JSON.stringify, and a throw while LOGGING once made a
    // successful chain read report itself as a failure. Everything goes through
    // a replacer.
    const extra =
      detail === undefined
        ? ''
        : ` ${JSON.stringify(detail, (_, v) => (typeof v === 'bigint' ? `${v}` : v))}`;
    line.textContent = `${message}${extra}`;
    this.logNode.appendChild(line);
    this.logNode.scrollTop = this.logNode.scrollHeight;
  }

  private mark(id: string, state: StepStates[string], detail?: string): void {
    this.states[id] = state;
    if (detail !== undefined) this.details[id] = detail;
    this.save();
    this.render();
  }

  /**
   * Remember progress across a reload.
   *
   * A run takes a person through irreversible acts over however long it takes,
   * and losing the record of which ones already happened is how a contract gets
   * deployed twice. Nothing here is trusted as a substitute for verification -
   * every `ok` was put there by a read, and Redo re-opens anything.
   */
  private save(): void {
    try {
      this.doc.defaultView?.localStorage?.setItem(
        this.slot,
        JSON.stringify({ states: this.states, details: this.details, values: this.values, records: this.records })
      );
    } catch {
      // Private browsing, or a quota. The run still works; it just will not
      // survive a reload, which is what it did before this existed.
    }
  }

  private restore(): void {
    try {
      const raw = this.doc.defaultView?.localStorage?.getItem(this.slot);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        states?: StepStates;
        details?: Record<string, string>;
        values?: Record<string, string>;
        records?: Record<string, unknown>;
      };
      // A step left mid-flight cannot be resumed as running: nobody knows
      // whether its transaction landed. It goes back to open.
      for (const [id, state] of Object.entries(saved.states ?? {})) {
        this.states[id] = state === 'running' ? 'waiting' : state;
      }
      Object.assign(this.details, saved.details ?? {});
      Object.assign(this.values, saved.values ?? {});
      Object.assign(this.records, saved.records ?? {});
    } catch {
      // A corrupt store is not worth failing over; start clean.
    }
  }

  private startOver(): void {
    this.states = initialStates();
    for (const key of Object.keys(this.details)) delete this.details[key];
    for (const key of Object.keys(this.records)) delete this.records[key];
    try {
      this.doc.defaultView?.localStorage?.removeItem(this.slot);
    } catch {
      // Nothing to do.
    }
    this.log('warn', 'started over; nothing on chain was undone');
    this.render();
  }

  /**
   * ONE STEP AT A TIME, and this is not a nicety.
   *
   * Every transaction here is signed by the same account, and two signed close
   * together take the same nonce - so the second REPLACES the first and the
   * chain reports `dropped_replace_by_fee`. Work that was done correctly simply
   * vanishes, and the step that did it reports a failure it did not cause.
   *
   * It became reachable the moment steps started waiting for confirmations
   * instead of returning immediately. A step that takes a minute is a step
   * somebody will click past, which is reasonable of them - so the page has to
   * be the one that says no.
   */
  private running: string | null = null;

  private async run(step: StepDef): Promise<void> {
    const handler = this.options.handlers[step.id];
    if (!handler) {
      this.mark(step.id, 'failed', 'no handler is wired for this step');
      return;
    }

    if (this.running) {
      this.log(
        'warn',
        `not started: ${step.title} - "${this.running}" is still running`,
        'Two transactions signed close together take the same nonce, and the second replaces ' +
          'the first. Wait for the running step to finish.'
      );
      return;
    }
    this.running = step.title;

    this.mark(step.id, 'running');
    this.log('info', `running: ${step.title}`);
    try {
      const result = await handler(this.context);
      if (result.record) this.records[step.id] = result.record;
      if (result.ok) {
        this.mark(step.id, 'ok', result.detail);
        this.log('ok', `verified: ${step.title}`);
      } else {
        // NOT ok is not the same as threw. A step whose transaction succeeded
        // but whose read-back disagreed lands here, and that is the failure
        // this page exists to catch.
        this.mark(step.id, 'failed', result.detail);
        this.log('warn', `NOT verified: ${step.title}`, result.detail);
      }
    } catch (error) {
      const message = String((error as Error)?.message ?? error);
      this.mark(step.id, 'failed', message);
      this.log('error', `failed: ${step.title}`, message);
    } finally {
      // However it ended. A lock that outlived a thrown step would leave the
      // page unable to run anything at all, with no way back but a reload.
      this.running = null;
      this.render();
    }
  }

  private redo(step: StepDef): void {
    // Everything downstream goes back to waiting. Without this, redoing a
    // deploy would leave every later step marked ok against a contract that no
    // longer exists.
    this.states = invalidateFrom(step.id, this.states);
    this.log('warn', `reset from ${step.title}; every step after it is open again`);
    this.render();
  }

  private render(): void {
    this.root.replaceChildren();
    let phase: Phase | null = null;

    for (const [index, step] of STEPS.entries()) {
      if (step.phase !== phase) {
        phase = step.phase;
        const heading = this.doc.createElement('div');
        heading.className = 'phase';
        heading.textContent = PHASE_TITLES[phase];
        this.root.appendChild(heading);
      }

      const state = this.states[step.id];
      const available = isAvailable(step, this.states);
      const blocked = blockedBy(step, this.states);

      const card = this.doc.createElement('div');
      card.className = `step step--${state}${blocked.length ? ' step--locked' : ''}`;

      const head = this.doc.createElement('div');
      head.className = 'step-head';
      head.innerHTML = `<span class="step-num">${index + 1}</span><span class="step-title"></span>`;
      head.querySelector('.step-title')!.textContent = step.title;

      if (step.irreversible) {
        const tag = this.doc.createElement('span');
        tag.className = 'tag tag--irreversible';
        tag.textContent = 'irreversible';
        head.appendChild(tag);
      }
      if (step.manual) {
        const tag = this.doc.createElement('span');
        tag.className = 'tag tag--manual';
        tag.textContent = 'needs a person';
        head.appendChild(tag);
      }
      const stateTag = this.doc.createElement('span');
      stateTag.className = 'tag';
      stateTag.textContent = state;
      head.appendChild(stateTag);
      card.appendChild(head);

      const why = this.doc.createElement('div');
      why.className = 'step-why';
      why.textContent = step.why;
      card.appendChild(why);

      for (const field of this.options.inputs?.[step.id] ?? []) {
        const wrap = this.doc.createElement('div');
        wrap.className = 'field';
        const label = this.doc.createElement('label');
        label.textContent = field.label;
        const input = this.doc.createElement('input');
        input.type = 'text';
        input.dataset.input = field.name;
        if (field.placeholder) input.placeholder = field.placeholder;
        // Restored from the store, not from the element that just got replaced.
        input.value = this.values[field.name] ?? '';
        input.addEventListener('input', () => {
          this.values[field.name] = input.value;
        });
        wrap.append(label, input);
        card.appendChild(wrap);
      }

      if (blocked.length) {
        const note = this.doc.createElement('div');
        note.className = 'notice notice--info';
        note.textContent = `Waiting on: ${blocked.join('; ')}`;
        card.appendChild(note);
      }

      const row = this.doc.createElement('div');
      row.className = 'row';

      if (state === 'ok') {
        const redo = this.doc.createElement('button');
        redo.type = 'button';
        redo.className = 'action';
        redo.textContent = 'Redo, and reopen everything after this';
        redo.addEventListener('click', () => this.redo(step));
        row.appendChild(redo);
      } else if (step.irreversible) {
        // Typed confirmation, per step, every time.
        const confirm = this.doc.createElement('div');
        confirm.className = 'confirm';
        const word = confirmWord(step);
        confirm.innerHTML = `<div class="small">This cannot be undone. Type <code></code> to enable it.</div>`;
        confirm.querySelector('code')!.textContent = word;
        const typed = this.doc.createElement('input');
        typed.type = 'text';
        typed.placeholder = word;
        confirm.appendChild(typed);

        const go = this.doc.createElement('button');
        go.type = 'button';
        go.className = 'action action--primary';
        go.textContent = 'Run';
        go.disabled = true;
        typed.addEventListener('input', () => {
          go.disabled = typed.value.trim() !== word || !available;
        });
        go.addEventListener('click', () => void this.run(step));
        confirm.appendChild(go);
        card.appendChild(confirm);
        if (!available) confirm.classList.add('hide');
      } else {
        const go = this.doc.createElement('button');
        go.type = 'button';
        go.className = 'action action--primary';
        go.textContent = step.manual ? 'Record the result' : 'Run';
        go.disabled = !available;
        go.addEventListener('click', () => void this.run(step));
        row.appendChild(go);
      }

      card.appendChild(row);

      if (this.details[step.id]) {
        const detail = this.doc.createElement('div');
        detail.className = 'step-detail';
        detail.textContent = this.details[step.id];
        card.appendChild(detail);
      }

      this.root.appendChild(card);
    }

    const p = progress(this.states);
    this.doc.getElementById('progress')!.textContent =
      `${p.done} of ${p.total} verified` +
      (p.failed ? `, ${p.failed} failed` : '') +
      (p.complete ? ' — every gate is closed' : p.next ? ` — next: ${p.next.title}` : '');
  }

  /** Everything this run established, for ops/RELEASES.md. */
  report(): string {
    const lines = [
      '# X Chess 2 gate run',
      '',
      `build      ${JSON.stringify(this.options.build ?? {})}`,
      ''
    ];
    for (const step of STEPS) {
      lines.push(`[${this.states[step.id].padEnd(7)}] ${step.title}`);
      if (this.details[step.id]) {
        for (const line of this.details[step.id].split('\n')) lines.push(`            ${line}`);
      }
    }
    lines.push('', 'records:', JSON.stringify(this.records, (_, v) => (typeof v === 'bigint' ? `${v}` : v), 2));
    return lines.join('\n');
  }

  private copyReport(): void {
    const text = this.report();
    void this.doc.defaultView?.navigator?.clipboard?.writeText(text).catch(() => {});
    this.log('ok', 'report copied');
  }

  /** For tests. */
  get stepStates(): StepStates {
    return { ...this.states };
  }
}
