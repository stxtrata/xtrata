/**
 * The Music Hero award, walked through one screen at a time (docs/music/AWARDS-SERVER.md). It uses the same mount
 * and the same look as the welcome screens: three lights (Earned, Claim, Yours), the record itself to look at, one
 * button. Like those screens it only calls actions the panel already has and decides nothing: the server says where
 * the player stands, and the wallet box checks and signs the claim.
 *
 *   ready    the record is earned: "Claim my record"
 *   name     "Put your name on it?": the name it would carry, or the ways to get one on it, or the address alone
 *   have     a name in Leather or Xverse: connect that wallet, link the player to it, check for the name
 *   get      no name yet: where to get one, and the two ways to put it on the player
 *   making   the claim is confirming
 *   yours    the record, inscribed
 */
import { xtrataMark } from './brand';
import { stepLights } from './welcome';

export type AwardScreen = 'ready' | 'name' | 'have' | 'get' | 'making' | 'yours';
export const AWARD_STEPS = ['Earned', 'Claim', 'Yours'] as const;
export const NAME_STEPS = ['Connect', 'Link', 'Name'] as const;

export interface AwardWalkInput {
  screen: AwardScreen;
  tier: { id: string; name: string; mark: string };
  number: number;
  /** Plays that earned it. */
  need: number;
  /** The player's own address, as it will be on the plaque. */
  player: string;
  /** The name the record would carry: a name, null (none), or undefined (could not be checked yet). */
  name: string | null | undefined;
  /** What to show in the frame: the preview of what will be made, or the inscribed record. */
  art: string;
  inscription?: number;
  /** A link to the claim while it confirms. */
  claimLink?: string;
  status: HTMLElement[];
  asking: boolean;
  busy: boolean;
  /** For "have": a Stacks wallet is connected (and what to call it), the player can be linked to it, or already is. */
  main: string | null;
  canLink: boolean;
  linked: boolean;
  copyAddress(): HTMLElement;
  go(screen: AwardScreen): void;
  claim(name: 'auto' | 'none'): void;
  refresh(): void;
  connect(): void;
  link(): void;
  later(): void;
  done(): void;
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const button = (cls: string, label: string, run: () => void, disabled = false) => {
  const b = el('button', cls, label) as HTMLButtonElement;
  b.type = 'button'; b.disabled = disabled; b.onclick = run;
  return b;
};
const choice = (title: string, sub: string, run: () => void, disabled = false) => { const b = button('al-album', '', run, disabled); const t = el('span', 'al-album__t'); t.append(el('b', '', title), el('span', '', sub)); b.append(t); return b; };
const no = (n: number) => `No. ${String(n).padStart(4, '0')}`;
/** Which of Connect, Link, Name the listener is on. */
export const nameStepNow = (i: Pick<AwardWalkInput, 'main' | 'linked'>) => (!i.main ? 0 : !i.linked ? 1 : 2);

export function createAwardWalk(mount: HTMLElement) {
  const root = document.documentElement;
  let on = false;
  let shown = ''; // the frame is rebuilt only when what it shows changes, so the record does not reload on every tick
  let frame: HTMLElement | null = null;
  const art = (i: AwardWalkInput) => {
    if (frame && shown === i.art) return frame;
    shown = i.art;
    frame = el('div', 'aw-art');
    const f = document.createElement('iframe');
    f.src = i.art; f.title = `${i.tier.name} record. Drag to turn it.`; f.setAttribute('sandbox', 'allow-scripts');
    frame.append(f);
    return frame;
  };
  return {
    showing: () => on,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i: AwardWalkInput | null, otherActive = false) {
      if (!i) {
        if (on && !otherActive) { mount.hidden = true; mount.replaceChildren(); delete root.dataset.view; delete root.dataset.asking; }
        if (on) { delete root.dataset.award; shown = ''; frame = null; }
        on = false;
        return;
      }
      on = true;
      root.dataset.view = 'album';
      root.dataset.award = i.screen;
      if (i.asking) root.dataset.asking = '1'; else delete root.dataset.asking;
      const top = el('header', 'al-top');
      const brand = el('a', 'al-brand') as HTMLAnchorElement;
      brand.href = '/radio';
      brand.append(xtrataMark('al-logo'), el('span', '', 'Xtrata '), el('b', '', 'Music'));
      top.append(brand);
      const box = el('div', 'al-welcome');
      const s = i.screen, t = i.tier.name;
      const named = typeof i.name === 'string' && i.name ? i.name : null;
      box.append(s === 'have' ? stepLights(NAME_STEPS, nameStepNow(i)) : stepLights(AWARD_STEPS, s === 'making' ? 2 : s === 'yours' ? 3 : 1));
      if (s === 'making') { const d = el('div', 'tier-disc tier-disc--mid'); d.dataset.tier = i.tier.id; d.append(el('span', 'tier-disc__mark', i.tier.mark)); box.append(d); }
      else if (s !== 'have' && s !== 'get') { const f = art(i); f.classList.toggle('aw-art--small', s === 'name'); box.append(f); } // smaller where choices follow, so they are in view
      const title = s === 'ready' ? `Your ${t} record is ready` : s === 'name' ? 'Put your name on it?' : s === 'have' ? 'Use the name in your wallet'
        : s === 'get' ? 'Get a .btc name' : s === 'making' ? 'Making your record' : 'It’s yours';
      box.append(el('h1', '', title));
      const say = (text: string, cls = '') => box.append(el('p', cls, text));
      const actions: HTMLElement[] = [];
      if (s === 'ready') {
        say(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`);
        actions.push(button('al-primary', `Claim my ${t} record`, () => i.go('name'), i.busy), el('p', 'al-hint', 'Free. One tap with Face ID or your fingerprint.'), button('al-link', 'Later', i.later));
      } else if (s === 'name') {
        if (named) {
          say(`Your record will carry ${named} beside your player’s address.`);
          actions.push(button('al-primary', `Claim with ${named}`, () => i.claim('auto'), i.busy), button('al-link', 'Use my address only', () => i.claim('none'), i.busy));
        } else if (i.name === null) {
          say('Right now it will carry your player’s address. A .btc name makes it yours at a glance.');
          actions.push(choice('I have a name in Leather or Xverse', 'Connect that wallet and link your player to it', () => i.go('have'), i.busy),
            choice('I want to get a name', 'Where to get one, and how to put it on your player', () => i.go('get'), i.busy),
            button('al-primary', 'Claim with my address', () => i.claim('none'), i.busy));
        } else {
          say('Could not check for a .btc name just now.', 'ppp-warn');
          actions.push(button('al-primary', 'Check again', i.refresh, i.busy), button('al-link', 'Claim with my address only', () => i.claim('none'), i.busy));
        }
        actions.push(el('p', 'al-hint', 'What is on the plaque cannot be changed afterwards.'));
        // Always a way out: a claim that cannot go through right now must never leave the listener stuck on this screen.
        actions.push(button('al-link', 'Later', i.later));
      } else if (s === 'have') {
        if (!i.main) {
          say('Connect the Leather or Xverse wallet that holds your .btc name.');
          actions.push(button('al-primary', 'Connect my wallet', i.connect, i.busy));
        } else if (!i.linked && i.canLink) {
          say(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`);
          actions.push(button('al-primary', 'Link my player', i.link, i.busy));
        } else if (!i.linked) {
          say(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, 'ppp-warn');
          actions.push(button('al-primary', 'Show me how', () => i.go('get'), i.busy));
        } else if (named) {
          say(`Found it: ${named}. It goes on your plaque beside your player’s address.`);
          actions.push(button('al-primary', `Claim with ${named}`, () => i.claim('auto'), i.busy));
        } else {
          say(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : 'Could not check for the name just now.', i.name === null ? '' : 'ppp-warn');
          actions.push(button('al-primary', 'Check again', i.refresh, i.busy));
        }
        actions.push(button('al-link', 'Back', () => i.go('name')));
      } else if (s === 'get') {
        const list = el('ol', 'aw-steps');
        const one = el('li'); one.append('Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ');
        const a = el('a', '', 'Open BNS One ↗') as HTMLAnchorElement; a.href = 'https://bns.one'; a.target = '_blank'; a.rel = 'noopener'; one.append(a);
        const two = el('li'); two.append('Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:', el('span', 'ppp-addr-full', i.player), i.copyAddress());
        const three = el('li', '', 'Check again, and your name shows on the preview before you claim.');
        list.append(one, two, three);
        box.append(list);
        actions.push(button('al-primary', 'I have my name: check again', () => { i.refresh(); i.go('name'); }, i.busy), button('al-link', 'Back', () => i.go('name')));
      } else if (s === 'making') {
        say('It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself.');
        if (i.claimLink) { const p = el('p', 'al-hint'); const a = el('a', '', 'See the claim on-chain ↗') as HTMLAnchorElement; a.href = i.claimLink; a.target = '_blank'; a.rel = 'noopener'; p.append(a); box.append(p); }
      } else {
        say(`${t} record ${no(i.number)}${i.inscription !== undefined ? ` · Xtrata inscription #${i.inscription}` : ''}. In your player now, and yours for good.`);
        actions.push(button('al-primary', 'See it in my player', i.done));
        if (i.inscription !== undefined) { const a = el('a', 'al-link', 'Open it full screen ↗') as HTMLAnchorElement; a.href = `/i/${i.inscription}`; a.target = '_blank'; a.rel = 'noopener'; actions.push(a); }
      }
      if (i.status.length) { const st = el('div', 'al-status'); st.setAttribute('role', 'status'); st.append(...i.status); box.append(st); }
      if (i.asking) box.append(el('p', 'al-hint al-hint--ask', 'Continue in the box below.'));
      else box.append(...actions);
      const body = el('div', 'al-body al-body--welcome');
      body.append(box);
      mount.hidden = false;
      mount.replaceChildren(top, body);
    }
  };
}
