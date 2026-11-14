// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { createWelcomeView, stepNow, WELCOME_STEPS, type WelcomeInput } from '../welcome';
import { BANNED_WORDS } from '../novice';

const input = (over: Partial<WelcomeInput>): WelcomeInput => ({
  mode: 'gift', status: [], asking: false, busy: false, canStart: true, plays: null, from: null, tier: null, mystery: true, albums: [],
  start() {}, returning() {}, unlock() {}, restock() {}, full() {}, ...over
});
const show = (over: Partial<WelcomeInput>) => {
  const mount = document.createElement('div');
  createWelcomeView(mount).render(input(over));
  const lights = [...mount.querySelectorAll('.al-steps li')].map((li) => `${li.className || '-'}:${li.querySelector('span')!.textContent}`);
  return { mount, lights };
};

describe('getting started, as three lights', () => {
  it('lights the steps behind a newcomer and glows on the one they are on', () => {
    expect(show({ mode: 'gift' }).lights).toEqual(['is-done:Picked', 'is-now:Passkey', '-:Listen']);
    expect(show({ mode: 'gift', asking: true }).lights).toEqual(['is-done:Picked', 'is-now:Passkey', '-:Listen']);
    expect(show({ mode: 'new' }).lights).toEqual(['is-done:Welcome', 'is-now:Passkey', '-:Listen']);
    expect(show({ mode: 'arriving' }).lights).toEqual(['is-done:Picked', 'is-done:Passkey', 'is-now:Listen']);
    expect(show({ mode: 'landed', tier: { id: 'gold', name: 'Gold', mark: 'G' } }).lights).toEqual(['is-done:Picked', 'is-done:Passkey', 'is-done:Listen']);
  });

  it('shows no lights on a return visit, an empty player or the holding screen', () => {
    for (const mode of ['back', 'empty', 'checking'] as const) { expect(stepNow(mode)).toBe(-1); expect(show({ mode }).lights).toEqual([]); }
  });

  it('says where they are for a screen reader', () => {
    expect(show({ mode: 'gift' }).mount.querySelector('.al-steps')!.getAttribute('aria-label')).toBe('Step 2 of 3: Passkey');
    expect(show({ mode: 'landed' }).mount.querySelector('.al-steps')!.getAttribute('aria-label')).toBe('All steps done');
  });

  it('puts the Xtrata mark at the top and something to look at on every getting-started screen', () => {
    for (const mode of ['gift', 'new', 'arriving', 'landed'] as const) {
      const { mount } = show({ mode, tier: mode === 'landed' ? { id: 'gold', name: 'Gold', mark: 'G' } : null });
      expect(mount.querySelector('.al-brand svg.al-logo')).not.toBeNull();
      expect(mount.querySelector('.tier-disc, .al-hero-mark')).not.toBeNull();
    }
    expect(show({ mode: 'gift' }).mount.querySelector('.tier-disc')!.getAttribute('data-tier')).toBe('mystery');
    expect(show({ mode: 'landed', tier: { id: 'gold', name: 'Gold', mark: 'G' } }).mount.querySelector('.tier-disc')!.getAttribute('data-tier')).toBe('gold');
  });

  it('keeps the step names free of the words a newcomer should never meet', () => {
    for (const label of [...WELCOME_STEPS.gift, ...WELCOME_STEPS.fresh]) expect(label).not.toMatch(BANNED_WORDS);
  });
});
