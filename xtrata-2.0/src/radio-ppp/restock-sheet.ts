/**
 * "Add plays": the one place a listener goes when their plays run low or run out. A pop-up over the radio, opened
 * from every "Add plays" button on the page. It lists the packs (in plays), the ways to pay (restock.ts: STX today;
 * card and Bitcoin are shown as "Soon" until a deployment switches them on) and, for STX, exactly what to send where.
 *
 * It moves no money and signs nothing. With STX the listener sends it themselves; the page already watches the
 * player's balance, so the plays appear without anything further here.
 */
import { stx as stxText } from '../lib/listening-wallet/policy';
import { packOffers, payText, restockMethods, type PackOffer, type RestockMethodId, type RestockSwitches } from '../lib/listening-wallet/restock';

export interface RestockInput {
  /** Plays the player can still pay for; null while that is not known. */
  playsLeft: number | null;
  balance: bigint | undefined;
  /** STX already on its way to the player (a deposit not confirmed yet). */
  incoming: bigint;
  fee: bigint;
  address: string;
  switches: RestockSwitches;
  /** What this player has done, as far as this device has seen. Null when there is nothing to say yet. */
  done: { plays: number; artists: number; likes: number } | null;
  /** Plays are on their way right now: say so and offer nothing to pay. */
  arriving: boolean;
}
export interface RestockDeps {
  input(): RestockInput | null;
  copyButton(key: string, label: string, text: () => string, cls: string): HTMLElement;
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

/** One sentence on what the player has already done: the reason it is worth restocking. */
export function doneLine(d: RestockInput['done']): string {
  if (!d || d.plays < 1) return '';
  const parts = [`paid for ${plural(d.plays, 'play', 'plays')}${d.artists > 0 ? ` to ${plural(d.artists, 'artist', 'artists')}` : ''}`];
  if (d.likes > 0) parts.push(`saved ${plural(d.likes, 'like', 'likes')}`);
  return `So far your player has ${parts.join(' and ')}, all on the public record.`;
}

export function createRestockSheet(deps: RestockDeps) {
  let dialog: HTMLDialogElement | null = null;
  let pack = 0;                       // plays chosen; 0 = not chosen yet
  let method: RestockMethodId = 'stx';

  const choose = (offers: PackOffer[]) => {
    if (offers.some((o) => o.plays === pack && o.fits)) return;
    // The second pack when it fits, else the biggest that does.
    const fitting = offers.filter((o) => o.fits);
    pack = (fitting.find((o) => o.plays === offers[1]?.plays) ?? fitting.at(-1))?.plays ?? 0;
  };

  function paint() {
    if (!dialog) return;
    const i = deps.input();
    if (!i) { dialog.close(); return; }
    const offers = packOffers(i.balance, i.fee, i.incoming);
    choose(offers);
    const methods = restockMethods(i.switches);
    if (!methods.find((m) => m.id === method)?.on) method = 'stx';
    const kids: HTMLElement[] = [];
    const head = el('h2', 'ppp-connect__title', 'Add plays'); head.id = 'ppp-restock-title';
    kids.push(head);
    kids.push(el('p', 'ppp-restock__left', i.playsLeft === null ? 'Checking your player…' : i.playsLeft === 0 ? 'Your player is out of plays.' : `Your player has ${plural(i.playsLeft, 'play', 'plays')} left.`));
    const done = doneLine(i.done);
    if (done) kids.push(el('p', 'ppp-restock__done', done));

    if (i.arriving) {
      kids.push(el('p', 'ppp-restock__wait', 'Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now.'));
    } else if (i.balance === undefined) {
      kids.push(el('p', 'ppp-restock__wait', 'Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment.'));
    } else if (!offers.some((o) => o.fits)) {
      kids.push(el('p', 'ppp-restock__wait', 'Your player is full: it holds as many plays as one player can. Come back when you have used some.'));
    } else {
      const grid = el('div', 'ppp-restock__packs');
      grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'How many plays');
      for (const o of offers) {
        const b = el('button', 'ppp-restock__pack' + (o.plays === pack ? ' is-on' : '')) as HTMLButtonElement;
        b.type = 'button'; b.disabled = !o.fits;
        b.setAttribute('aria-pressed', String(o.plays === pack));
        b.append(el('b', '', o.plays.toLocaleString()), el('span', '', 'plays'));
        b.onclick = () => { pack = o.plays; paint(); };
        grid.append(b);
      }
      kids.push(grid);

      const ways = el('div', 'ppp-restock__ways');
      ways.setAttribute('role', 'group'); ways.setAttribute('aria-label', 'How to pay');
      for (const m of methods) {
        const b = el('button', 'ppp-restock__way' + (m.id === method ? ' is-on' : '')) as HTMLButtonElement;
        b.type = 'button'; b.disabled = !m.on;
        b.setAttribute('aria-pressed', String(m.id === method));
        b.append(el('b', '', m.label), el('span', '', m.on ? m.blurb : 'Soon'));
        b.onclick = () => { method = m.id; paint(); };
        ways.append(b);
      }
      kids.push(ways);

      const chosen = offers.find((o) => o.plays === pack);
      if (chosen && method === 'stx') {
        const box = el('div', 'ppp-restock__pay');
        const amount = payText({ unit: 'microSTX', amount: chosen.stx });
        const line = el('p', 'ppp-restock__amount');
        line.append('Send ', el('b', '', amount), ' to your player:');
        box.append(line, el('p', 'ppp-addr-full ppp-restock__addr', i.address));
        const row = el('div', 'ppp-restock__row');
        row.append(deps.copyButton('restock-address', 'Copy address', () => i.address, 'primary'), deps.copyButton('restock-amount', 'Copy amount', () => stxText(chosen.stx), ''));
        box.append(row);
        box.append(el('p', 'ppp-restock__note', 'From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.'));
        kids.push(box);
      }
      // A converted method (card, Bitcoin) is paid through a restock service that is not live yet: restock.ts has its
      // quote and order rules ready, and this is where its pay button goes once a deployment switches it on.
    }
    kids.push(el('p', 'ppp-restock__why', 'Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it.'));
    const close = el('button', 'quiet ppp-connect__cancel', 'Close') as HTMLButtonElement;
    close.type = 'button'; close.onclick = () => dialog?.close();
    kids.push(close);
    dialog.replaceChildren(...kids);
  }

  return {
    isOpen: () => !!dialog,
    open() {
      if (dialog) return;
      if (!deps.input()) return;
      dialog = el('dialog', 'ppp-connect ppp-restock') as HTMLDialogElement;
      dialog.setAttribute('aria-labelledby', 'ppp-restock-title');
      const d = dialog;
      d.addEventListener('close', () => { d.remove(); if (dialog === d) dialog = null; });
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // tap outside the card
      document.body.appendChild(d);
      paint();
      if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: paint,
    close() { dialog?.close(); }
  };
}
