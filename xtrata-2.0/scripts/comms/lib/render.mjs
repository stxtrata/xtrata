//
// Headless rendering for the comms harness.
//
// One browser, reused across every capture in a run, because launching
// Chromium per image turns a 30 second job into a 5 minute one.
//
// Captures are JPEG and generated cards are PNG. That is not arbitrary: a UI
// screenshot is photographic and compresses well as JPEG, while a card is flat
// colour and large text, where JPEG ringing around glyphs is visible and PNG is
// both smaller and sharper. The canary embeds every one of these as a data URI,
// so the choice decides whether the board is 3 MB or 12 MB.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// X shows a single attached image at 16:9. Anything else gets cropped in the
// timeline, and a cropped screenshot is how a legible UI shot becomes an
// illegible one.
export const TWEET_WIDTH = 1200;
export const TWEET_HEIGHT = 675;

let browserPromise = null;

const getBrowser = async () => {
  if (!browserPromise) {
    const { chromium } = await import('playwright');
    browserPromise = chromium.launch({ headless: true });
  }
  return browserPromise;
};

export const closeBrowser = async () => {
  if (!browserPromise) return;
  const browser = await browserPromise;
  await browser.close();
  browserPromise = null;
};

const withPage = async (options, fn) => {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: options.width ?? TWEET_WIDTH, height: options.height ?? TWEET_HEIGHT },
    deviceScaleFactor: options.scale ?? 2,
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  try {
    return await fn(page);
  } finally {
    await context.close();
  }
};

/**
 * Screenshot a live URL.
 *
 * Returns { ok, path, bytes } or { ok: false, error }. It never throws, because
 * a site being slow is not a reason to abandon a whole day's drafting, and a
 * failed capture must be visible as a failure rather than as a missing image
 * nobody notices.
 */
export const captureUrl = async (url, outPath, options = {}) => {
  // 'domcontentloaded' rather than 'networkidle'. The Xtrata site is a SPA that
  // polls, so the network never goes idle and every page but a static
  // inscription times out. Settling is handled by waitMs below, which is
  // explicit and does not depend on the page ever going quiet.
  const strategies = [options.waitUntil ?? 'domcontentloaded', 'commit'];
  const steps = [];

  try {
    return await withPage(options, async (page) => {
      let lastError = null;
      let landed = false;
      for (const waitUntil of strategies) {
        try {
          await page.goto(url, { waitUntil, timeout: options.timeout ?? 20000 });
          landed = true;
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (!landed) throw lastError;
      // Inscriptions are applications. They reconstruct themselves from the
      // chain after load, so the interesting pixels arrive well after the
      // network goes quiet.
      if (options.waitMs) await page.waitForTimeout(options.waitMs);

      // Some surfaces only show the interesting thing after a click. X Chess
      // opens on a "start a game" form, and a screenshot of an empty form with
      // its validation warnings showing is worse than no screenshot. Steps are
      // best-effort: if a selector has changed, the capture still happens and
      // the failure is reported rather than aborting the whole run.
      for (const step of options.actions ?? []) {
        try {
          if (step.fill) await page.fill(step.fill, String(step.value ?? ''), { timeout: 8000 });
          if (step.click) await page.click(step.click, { timeout: 8000 });
          if (step.waitMs) await page.waitForTimeout(step.waitMs);
        } catch (error) {
          steps.push(`action failed (${step.fill ?? step.click}): ${String(error).split('\n')[0].slice(0, 90)}`);
        }
      }
      if (options.hideSelectors?.length) {
        await page.addStyleTag({
          content: `${options.hideSelectors.join(',')} { visibility: hidden !important; }`
        });
      }
      mkdirSync(dirname(outPath), { recursive: true });
      const buffer = await page.screenshot({ type: 'jpeg', quality: options.quality ?? 82 });
      writeFileSync(outPath, buffer);
      return { ok: true, path: outPath, bytes: buffer.length, warnings: steps };
    });
  } catch (error) {
    return { ok: false, error: String(error).split('\n')[0].slice(0, 200) };
  }
};

/** Render an HTML string to PNG. Used for generated cards. */
export const captureHtml = async (html, outPath, options = {}) => {
  try {
    return await withPage(options, async (page) => {
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      mkdirSync(dirname(outPath), { recursive: true });
      const buffer = await page.screenshot({ type: 'png' });
      writeFileSync(outPath, buffer);
      return { ok: true, path: outPath, bytes: buffer.length };
    });
  } catch (error) {
    return { ok: false, error: String(error).split('\n')[0].slice(0, 200) };
  }
};
