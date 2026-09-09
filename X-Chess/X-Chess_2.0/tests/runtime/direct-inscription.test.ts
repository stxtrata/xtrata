// The direct /i/<id> response observed at inscription 3034 on 2026-09-07.
// Unlike the framed viewer, it adds <base href="null"> and rewrites API URLs
// without injecting wallet or module scripts. Test the built artifact in that
// shape as well as the separate framed-runtime suite. No network or signing.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { afterEach, describe, expect, it } from 'vitest';

const artifact = readFileSync(fileURLToPath(new URL('../../dist/xchess.html', import.meta.url)), 'utf8');
const served = artifact
  .replace('<head>', '<head><base href="null">')
  .replace(/https:\/\/api\.mainnet\.hiro\.so/g, 'https://xtrata.xyz/hiro/mainnet')
  .replace(/https:\/\/api\.testnet\.hiro\.so/g, 'https://xtrata.xyz/hiro/testnet')
  .replace(/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, 'https://xtrata.xyz/hiro/mainnet')
  .replace(/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, 'https://xtrata.xyz/hiro/testnet');
const pages: JSDOM[] = [];
afterEach(() => { for (const page of pages.splice(0)) page.window.close(); });

function open(id: number) {
  const fetches: string[] = [];
  const walletCalls: string[] = [];
  const errors: string[] = [];
  const dom = new JSDOM(served, {
    url: `https://xtrata.xyz/i/${id}`,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      const globals = window as unknown as Record<string, unknown>;
      globals.fetch = async (path: string) => {
        fetches.push(String(path));
        return {
          ok: true, status: 200,
          json: async () => ({ okay: true, result: '0x0100000000000000000000000000000001' })
        };
      };
      // A direct extension, not a fabricated Xtrata bridge.
      globals.StacksProvider = {
        request: async (method: string) => {
          walletCalls.push(method);
          return { addresses: [{ symbol: 'STX', address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }] };
        }
      };
      window.addEventListener('error', event => errors.push(event.message));
      window.addEventListener('unhandledrejection', event => errors.push(String(event.reason)));
    }
  });
  pages.push(dom);
  return { dom, fetches, walletCalls, errors };
}

describe('the direct inscription response, without injected runtime scripts', () => {
  it.each([3034, 99999])('boots at inscription %i and reads through the proxy', async id => {
    const { dom, fetches, walletCalls, errors } = open(id);
    await expect.poll(() => fetches.length).toBeGreaterThan(0);
    expect(dom.window.document.compatMode).toBe('CSS1Compat');
    expect(dom.window.document.querySelector('base')?.getAttribute('href')).toBe('null');
    expect(dom.window.document.querySelectorAll('script[src]')).toHaveLength(0);
    expect(dom.window.document.querySelectorAll('#board')).toHaveLength(1);
    expect(dom.window.document.getElementById('open-game')).not.toBeNull();
    expect(fetches.some(path => path.startsWith('/hiro/mainnet/'))).toBe(true);
    expect(fetches.some(path => /api\.mainnet\.hiro\.so/.test(path))).toBe(false);
    expect(walletCalls).toEqual([]);
    expect(errors).toEqual([]);
  });

  it('does not attach a second wallet handler if the bundle executes twice', async () => {
    const { dom, walletCalls, errors } = open(3034);
    // mountShell replaces the body, removing the executing script element.
    const script = [...served.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
    dom.window.eval(script);
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await expect.poll(() => walletCalls.length).toBeGreaterThan(0);
    expect(walletCalls).toHaveLength(1);
    expect(walletCalls[0]).not.toMatch(/callContract|deployContract/);
    expect(dom.window.document.querySelectorAll('#connect')).toHaveLength(1);
    expect(errors).toEqual([]);
  });
});
