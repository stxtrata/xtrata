import { describe, expect, it } from 'vitest';
import { browserName, inAppBrowser, openInBrowserHref } from '../in-app';

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36';

describe("apps' built-in browsers", () => {
  it('names the app from its user agent, Meta apps before the shared Facebook tokens', () => {
    expect(inAppBrowser(`${IOS} Instagram 400.0.0.0 (iPhone17,2; iOS 26_0; en_GB)`)).toBe('Instagram');
    expect(inAppBrowser(`${IOS} [FBAN/FBIOS;FBAV/500.0.0;FBBV/1;FBDV/iPhone17,2]`)).toBe('Facebook');
    expect(inAppBrowser(`${IOS} [FBAN/MessengerForiOS;FBAV/500.0]`)).toBe('Messenger');
    expect(inAppBrowser(`${IOS} Barcelona 360.0`)).toBe('Threads');
    expect(inAppBrowser(`${IOS} Twitter for iPhone/11.0`)).toBe('X');
    expect(inAppBrowser(`${ANDROID} TwitterAndroid`)).toBe('X');
    expect(inAppBrowser(`${IOS} musical_ly_37.0 BytedanceWebview/d8a21c6`)).toBe('TikTok');
    expect(inAppBrowser(`${IOS} [LinkedInApp]/9.30`)).toBe('LinkedIn');
    expect(inAppBrowser(`${IOS} GSA/380.0`)).toBe('the Google app');
  });
  it('leaves real browsers (and apps that use Safari\'s own view, which keep Safari\'s user agent) alone', () => {
    expect(inAppBrowser(`${IOS} Version/26.0 Safari/604.1`)).toBeNull();
    expect(inAppBrowser(`${IOS} CriOS/141.0 Safari/604.1`)).toBeNull();
    expect(inAppBrowser('Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36')).toBeNull();
    expect(inAppBrowser('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15')).toBeNull();
  });
});

describe('open in the real browser', () => {
  const url = 'https://radio.xtrata.xyz/radio#gift=AbCdEfGhIjKlMnOpQrStUv';
  it('iPhone: Safari, keeping the gift code', () => {
    expect(openInBrowserHref(url, IOS)).toBe('x-safari-https://radio.xtrata.xyz/radio#gift=AbCdEfGhIjKlMnOpQrStUv');
    expect(browserName(IOS)).toBe('Safari');
  });
  it('Android: Chrome via an intent that falls back to the page itself', () => {
    const href = openInBrowserHref(url, ANDROID)!;
    expect(href.startsWith('intent://radio.xtrata.xyz/radio#gift=AbCdEfGhIjKlMnOpQrStUv#Intent;scheme=https;package=com.android.chrome;')).toBe(true);
    expect(href).toContain('S.browser_fallback_url=' + encodeURIComponent(url));
    expect(browserName(ANDROID)).toBe('Chrome');
  });
  it('nothing on desktop, and never for a non-https page', () => {
    expect(openInBrowserHref(url, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0')).toBeNull();
    expect(openInBrowserHref('http://radio.xtrata.xyz/radio', IOS)).toBeNull();
  });
});
