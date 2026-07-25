import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `@xtrata/collections-client` is a workspace `file:` dependency that ships raw
 * TypeScript with NodeNext-style `./module.js` specifiers. TypeScript maps
 * those onto `./module.ts` automatically; Vite/Rollup do not. This resolver
 * closes that gap for relative `.js` specifiers only, so the client can be
 * consumed as source without a build step.
 *
 * It must NOT touch anything inside `node_modules`. The dev dependency
 * pre-bundler emits its own relative `./chunk-XXXX.js` imports inside
 * `node_modules/.vite/deps`, and rewriting those to `.ts` makes every
 * pre-bundled module 404 — which silently blanks every page in `vite dev`
 * while `vite build` (no optimizer) keeps working.
 */
const resolveTsFromJsSpecifier = (): Plugin => ({
  name: 'xtrata:resolve-ts-from-js-specifier',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!importer || !source.startsWith('.') || !source.endsWith('.js')) return null;
    if (importer.includes('node_modules')) return null;
    const resolved = await this.resolve(`${source.slice(0, -3)}.ts`, importer, {
      ...options,
      skipSelf: true
    });
    return resolved ?? null;
  }
});

export default defineConfig({
  plugins: [resolveTsFromJsSpecifier(), react()],
  resolve: {
    // Only React. `@stacks/transactions` and `@stacks/network` deliberately
    // exist at two majors here (v7 for the client, v6 under the
    // `@stacks/transactions-v6` alias for the @stacks/connect 7.x wallet
    // bridge); deduping them would collapse the wrong versions together.
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    // Consumed as TypeScript source; pre-bundling would bypass the resolver above.
    exclude: ['@xtrata/collections-client']
  },
  server: {
    fs: {
      // The linked client package lives outside this project root.
      allow: ['..']
    }
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        studio: resolve(__dirname, 'studio.html'),
        drops: resolve(__dirname, 'drops.html'),
        canary: resolve(__dirname, 'canary.html')
      }
    }
  }
});
