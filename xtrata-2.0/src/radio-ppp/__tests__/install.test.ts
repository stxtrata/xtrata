// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createInstall, INSTALL_TEXT, installKind, installSteps, iosBrowser, isIos } from '../install';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const MAC = IPAD;

function setup(env: { userAgent: string; maxTouchPoints?: number; standalone?: boolean }) {
  document.body.innerHTML = '<button id="a2hs" type="button" hidden></button>';
  const button = document.getElementById('a2hs') as HTMLButtonElement;
  const handlers: Record<string, (e: any) => void> = {};
  const state = { standalone: !!env.standalone };
  const install = createInstall({
    button, icon: '/radio/icons/app-192.png', mount: document.body,
    env: () => ({ userAgent: env.userAgent, maxTouchPoints: env.maxTouchPoints ?? 0, standalone: state.standalone }),
    target: { addEventListener: ((name: string, fn: (e: any) => void) => { handlers[name] = fn; }) as any }
  });
  return { button, handlers, install, state, sheet: () => document.querySelector('.a2hs-sheet') as HTMLElement | null };
}
beforeEach(() => { document.body.innerHTML = ''; });

describe('who is offered "Add to Home Screen"', () => {
  it('tells an iPhone and an iPad (which says it is a Mac) from a Mac', () => {
    expect(isIos({ userAgent: IPHONE, maxTouchPoints: 5 })).toBe(true);
    expect(isIos({ userAgent: IPAD, maxTouchPoints: 5 })).toBe(true);
    expect(isIos({ userAgent: MAC, maxTouchPoints: 0 })).toBe(false);
    expect(isIos({ userAgent: ANDROID, maxTouchPoints: 5 })).toBe(false);
  });
  it('the browser\'s own prompt where there is one, the three taps on an iPhone, nothing once it is on the home screen', () => {
    expect(installKind({ userAgent: ANDROID, maxTouchPoints: 5, standalone: false }, true)).toBe('prompt');
    expect(installKind({ userAgent: ANDROID, maxTouchPoints: 5, standalone: false }, false)).toBeNull(); // not offered yet: no dead button
    expect(installKind({ userAgent: IPHONE, maxTouchPoints: 5, standalone: false }, false)).toBe('ios');
    expect(installKind({ userAgent: IPHONE, maxTouchPoints: 5, standalone: true }, false)).toBeNull();
    expect(installKind({ userAgent: ANDROID, maxTouchPoints: 5, standalone: true }, true)).toBeNull();
    expect(installKind({ userAgent: MAC, maxTouchPoints: 0, standalone: false }, false)).toBeNull();
  });
});

describe('the steps are the ones for the browser in hand', () => {
  const SAFARI26 = IPHONE.replace('Version/18.1', 'Version/26.1');
  const CHROME = IPHONE.replace('Version/18.1 Mobile', 'CriOS/130.0.6723.90 Mobile');
  it('tells Safari with the three-dots menu from older Safari and from other iPhone browsers', () => {
    expect(iosBrowser(SAFARI26)).toBe('safari-dots');
    expect(iosBrowser(IPHONE)).toBe('safari');
    expect(iosBrowser(CHROME)).toBe('other');
  });
  it('newer Safari starts at the three dots, bottom right; older Safari at Share; each ends with Add', () => {
    expect(installSteps('safari-dots')).toMatchObject({ where: 'bottom-right' });
    expect(installSteps('safari-dots').steps).toEqual(['Tap ••• at the bottom right of your screen', 'Tap Share', 'Scroll down and tap “Add to Home Screen”', 'Tap Add']);
    expect(installSteps('safari')).toMatchObject({ where: 'bottom' });
    expect(installSteps('safari').steps[0]).toMatch(/Share button at the bottom/);
    expect(installSteps('other')).toMatchObject({ where: 'top-right' });
    for (const b of ['safari-dots', 'safari', 'other'] as const) expect(installSteps(b).steps.at(-1)).toBe('Tap Add');
  });
  it('on newer Safari the sheet points at the bottom right corner', () => {
    const s = setup({ userAgent: SAFARI26, maxTouchPoints: 5 });
    s.button.click();
    expect(s.sheet()!.className).toContain('a2hs-sheet--bottom-right');
    expect(s.sheet()!.querySelector('.a2hs-steps li span')!.textContent).toBe('Tap ••• at the bottom right of your screen');
  });
});

describe('the button at the top of the radio', () => {
  it('on Android it appears when the browser offers to install, and one tap shows the browser\'s own prompt', () => {
    const s = setup({ userAgent: ANDROID, maxTouchPoints: 5 });
    expect(s.button.hidden).toBe(true);
    const prompt = vi.fn(async () => undefined), preventDefault = vi.fn();
    s.handlers.beforeinstallprompt({ preventDefault, prompt });
    expect(preventDefault).toHaveBeenCalled();                 // ours to show, when the listener asks
    expect(s.button.hidden).toBe(false);
    expect(s.button.getAttribute('aria-label')).toBe('Add to Home Screen');
    s.button.click();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(s.sheet()).toBeNull();
    expect(s.button.hidden).toBe(true);                        // a prompt can be shown once
    s.button.click();
    expect(prompt).toHaveBeenCalledTimes(1);
  });
  it('on an iPhone it shows the three taps, in order, and closes again', () => {
    const s = setup({ userAgent: IPHONE, maxTouchPoints: 5 });
    expect(s.button.hidden).toBe(false);
    s.button.click();
    const sheet = s.sheet()!;
    expect(sheet.getAttribute('role')).toBe('dialog');
    expect([...sheet.querySelectorAll('.a2hs-steps li span')].map((n) => n.textContent)).toEqual(installSteps('safari').steps);
    expect(sheet.querySelectorAll('.a2hs-steps button, .a2hs-steps a, .a2hs-steps svg')).toHaveLength(0);   // nothing in the steps looks tappable
    expect([...sheet.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Got it']);
    expect(sheet.className).toContain('a2hs-sheet--bottom');
    expect(sheet.querySelector('.a2hs-arrow')).not.toBeNull();
    expect(sheet.textContent).toContain(INSTALL_TEXT.title);
    expect((sheet.querySelector('img') as HTMLImageElement).getAttribute('src')).toBe('/radio/icons/app-192.png');
    s.button.click();
    expect(document.querySelectorAll('.a2hs-sheet')).toHaveLength(1);   // never two
    (sheet.querySelector('.a2hs-close') as HTMLButtonElement).click();
    expect(s.sheet()).toBeNull();
  });
  it('is not there once the player is on the home screen, or after it has just been installed', () => {
    expect(setup({ userAgent: IPHONE, maxTouchPoints: 5, standalone: true }).button.hidden).toBe(true);
    const s = setup({ userAgent: ANDROID, maxTouchPoints: 5 });
    s.handlers.beforeinstallprompt({ preventDefault() {}, prompt: async () => undefined });
    expect(s.button.hidden).toBe(false);
    s.handlers.appinstalled({});
    expect(s.button.hidden).toBe(true);
  });
  it('a desktop browser that cannot install gets no button', () => {
    expect(setup({ userAgent: MAC }).button.hidden).toBe(true);
  });
});

describe('what the phone is told about the app', () => {
  const manifest = JSON.parse(readFileSync('public/radio/app.webmanifest', 'utf8'));
  const page = readFileSync('public/radio.html', 'utf8');
  it('opens as its own app, straight to the player, with the Xtrata mark as its icon', () => {
    expect(manifest).toMatchObject({ name: 'Xtrata Music', display: 'standalone', start_url: '/radio?novice=1&source=home', scope: '/' });
    expect(manifest.icons.map((i: any) => `${i.sizes} ${i.purpose}`)).toEqual(['192x192 any', '512x512 any', '512x512 maskable']);
    for (const i of manifest.icons) expect(readFileSync('public' + i.src).subarray(1, 4).toString()).toBe('PNG');
    expect(JSON.stringify(manifest)).not.toMatch(/on-chain|blockchain|crypto|wallet/i);
  });
  it('the radio page names the manifest, the iPhone icon and the button', () => {
    expect(page).toContain('<link rel="manifest" href="/radio/app.webmanifest" />');
    expect(page).toContain('<link rel="apple-touch-icon" href="/radio/icons/apple-touch-180.png" />');
    expect(page).toContain('<meta name="apple-mobile-web-app-capable" content="yes" />');
    expect(page).toMatch(/<button class="a2hs" id="a2hs" type="button" hidden>/);
    expect(readFileSync('public/radio/icons/apple-touch-180.png').subarray(1, 4).toString()).toBe('PNG');
  });
});
