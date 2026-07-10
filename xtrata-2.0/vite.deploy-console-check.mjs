import { resolve } from 'node:path';
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: '/tmp/xb-deploy',
    emptyOutDir: true,
    rollupOptions: { input: { 'deploy-console': resolve(process.cwd(), 'web/deploy-console.html') } }
  }
});
