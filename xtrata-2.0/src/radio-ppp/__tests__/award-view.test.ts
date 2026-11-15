// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAwardWalk, nameStepNow, type AwardWalkInput } from '../award-view';

const ME = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N';
let mount: HTMLElement;
const calls: string[] = [];
const input = (over: Partial<AwardWalkInput> = {}): AwardWalkInput => ({
  screen: 'ready', tier: { id: 'gold', name: 'Gold', mark: '★' }, number: 412, need: 50, player: ME, name: null, art: '/awards/gold#n=412', status: [], asking: false, busy: false,
  main: null, canLink: false, linked: false,
  copyAddress: () => Object.assign(document.createElement('button'), { textContent: 'Copy my player’s address' }),
  go: (s) => calls.push('go:' + s), claim: (n) => calls.push('claim:' + n), refresh: () => calls.push('refresh'), connect: () => calls.push('connect'), link: () => calls.push('link'),
  later: () => calls.push('later'), done: () => calls.push('done'), ...over
});
const text = () => (mount.textContent || '').replace(/\s+/g, ' ');
const press = (label: RegExp) => { const b = [...mount.querySelectorAll('button')].find((x) => label.test(x.textContent || '')) as HTMLButtonElement | undefined; if (!b) throw new Error('no button ' + label); b.click(); };
const lights = () => [...mount.querySelectorAll('.al-steps li')].map((li) => `${li.className || '-'}:${li.querySelector('span')!.textContent}`).join(' ');
beforeEach(() => { document.body.innerHTML = '<div id="album" hidden></div>'; mount = document.getElementById('album')!; calls.length = 0; delete document.documentElement.dataset.view; });

describe('the Music Hero award, one screen at a time', () => {
  it('ready: the record to look at, one button, and "Later"', () => {
    const v = createAwardWalk(mount);
    v.render(input());
    expect(v.showing()).toBe(true);
    expect(document.documentElement.dataset.view).toBe('album');
    expect(lights()).toBe('is-done:Earned is-now:Claim -:Yours');
    expect(mount.querySelector('.aw-art iframe')!.getAttribute('src')).toBe('/awards/gold#n=412');
    expect(mount.querySelector('.aw-art iframe')!.getAttribute('sandbox')).toBe('allow-scripts');
    expect(text()).toContain('Your Gold record is ready');
    press(/Claim my Gold record/); press(/Later/);
    expect(calls).toEqual(['go:name', 'later']);
  });

  it('name: with a name it offers the name or the address; without one, the two ways to get one, or the address', () => {
    const v = createAwardWalk(mount);
    v.render(input({ screen: 'name', name: 'jim.btc' }));
    expect(text()).toContain('Your record will carry jim.btc beside your player’s address.');
    press(/Claim with jim\.btc/); press(/Use my address only/);
    v.render(input({ screen: 'name', name: null }));
    press(/I have a name in Leather or Xverse/); press(/I want to get a name/); press(/Claim with my address/);
    v.render(input({ screen: 'name', name: undefined }));
    expect(text()).toContain('Could not check for a .btc name just now.');
    press(/Check again/); press(/Claim with my address only/);
    expect(calls).toEqual(['claim:auto', 'claim:none', 'go:have', 'go:get', 'claim:none', 'refresh', 'claim:none']);
    expect(text()).toContain('What is on the plaque cannot be changed afterwards.');
  });

  it('have: connect, then link, then the name, each with its own light and one button', () => {
    const v = createAwardWalk(mount);
    v.render(input({ screen: 'have' }));
    expect(lights()).toBe('is-now:Connect -:Link -:Name');
    press(/Connect my wallet/);
    v.render(input({ screen: 'have', main: 'jim.btc', canLink: true }));
    expect(lights()).toBe('is-done:Connect is-now:Link -:Name');
    expect(text()).toContain('nothing is spent');
    press(/Link my player/);
    v.render(input({ screen: 'have', main: 'jim.btc', linked: true, name: 'jim.btc' }));
    expect(lights()).toBe('is-done:Connect is-done:Link is-now:Name');
    press(/Claim with jim\.btc/);
    v.render(input({ screen: 'have', main: 'SP10W2…9TM7', linked: true, name: null }));
    expect(text()).toContain('has no primary .btc name yet');
    press(/Check again/);
    v.render(input({ screen: 'have', main: 'SP10W2…9TM7', canLink: false }));
    expect(text()).toContain('Linking is not open for SP10W2…9TM7 right now.');
    press(/Show me how/); press(/Back/);
    expect(calls).toEqual(['connect', 'link', 'claim:auto', 'refresh', 'go:get', 'go:name']);
    expect([nameStepNow({ main: null, linked: false }), nameStepNow({ main: 'x', linked: false }), nameStepNow({ main: 'x', linked: true })]).toEqual([0, 1, 2]);
  });

  it('get: where to get a name, the player’s own address to send it to, and back to checking', () => {
    const v = createAwardWalk(mount);
    v.render(input({ screen: 'get' }));
    expect(mount.querySelector('.aw-steps a')!.getAttribute('href')).toBe('https://bns.one');
    expect(text()).toContain(ME);
    expect(mount.querySelector('.aw-art')).toBeNull();
    press(/I have my name: check again/);
    expect(calls).toEqual(['refresh', 'go:name']);
  });

  it('making and yours: the lights move on, and the inscribed record is shown', () => {
    const v = createAwardWalk(mount);
    v.render(input({ screen: 'making', claimLink: 'https://explorer.hiro.so/txid/0xabc?chain=mainnet' }));
    expect(lights()).toBe('is-done:Earned is-done:Claim is-now:Yours');
    expect(mount.querySelector('button')).toBeNull();
    expect(mount.querySelector('a[href^="https://explorer"]')).not.toBeNull();
    v.render(input({ screen: 'yours', art: '/i/48213', inscription: 48213 }));
    expect(lights()).toBe('is-done:Earned is-done:Claim is-done:Yours');
    expect(mount.querySelector('.aw-art iframe')!.getAttribute('src')).toBe('/i/48213');
    expect(text()).toContain('Gold record No. 0412 · Xtrata inscription #48213');
    press(/See it in my player/);
    expect(calls).toEqual(['done']);
  });

  it('while the wallet box asks there is nothing else to press, and it steps aside cleanly', () => {
    const v = createAwardWalk(mount);
    v.render(input({ screen: 'name', name: 'jim.btc', asking: true, busy: true }));
    expect(document.documentElement.dataset.asking).toBe('1');
    expect(mount.querySelector('button')).toBeNull();
    expect(text()).toContain('Continue in the box below.');
    const frame = mount.querySelector('.aw-art');
    v.render(input({ screen: 'name', name: 'jim.btc' }));
    expect(mount.querySelector('.aw-art')).toBe(frame);       // the record is not reloaded between ticks
    v.render(null);
    expect(v.showing()).toBe(false);
    expect(mount.hidden).toBe(true);
    expect(document.documentElement.dataset.view).toBeUndefined();
    // Another view owns the mount: this one leaves it alone.
    v.render(input()); mount.innerHTML = '<p>album</p>'; v.render(null, true);
    expect(mount.innerHTML).toBe('<p>album</p>');
    vi.restoreAllMocks();
  });
});
