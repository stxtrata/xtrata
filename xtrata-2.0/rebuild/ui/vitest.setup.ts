import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'node:util';
import '@testing-library/jest-dom/vitest';

/**
 * jsdom + Node realms disagree about `Uint8Array`.
 *
 * Under `environment: 'jsdom'` the global `Uint8Array` is jsdom's, while Node's
 * `TextEncoder` returns a Uint8Array from Node's realm. `@stacks/common` and
 * `@noble/hashes` both gate on `x instanceof Uint8Array`, so every Clarity
 * string/principal serialization throws "Uint8Array list expected" in tests
 * while working perfectly in a browser.
 *
 * Fix at the source: a TextEncoder whose output is constructed with the ambient
 * `Uint8Array`, so exactly one Uint8Array identity exists in the test realm.
 */
class RealmTextEncoder {
  readonly encoding = 'utf-8';
  private readonly inner = new NodeTextEncoder();

  encode(input = ''): Uint8Array {
    return Uint8Array.from(this.inner.encode(input));
  }

  encodeInto(input: string, destination: Uint8Array): { read: number; written: number } {
    return this.inner.encodeInto(input, destination);
  }
}

Object.defineProperty(globalThis, 'TextEncoder', { writable: true, value: RealmTextEncoder });
Object.defineProperty(globalThis, 'TextDecoder', { writable: true, value: NodeTextDecoder });

// jsdom does not implement matchMedia, which the shell theme hook reads.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false
    })
  });
}
