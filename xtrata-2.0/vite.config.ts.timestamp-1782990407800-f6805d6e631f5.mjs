// vite.config.ts
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "file:///sessions/compassionate-fervent-pasteur/mnt/xtrata/xtrata-2.0/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/compassionate-fervent-pasteur/mnt/xtrata/xtrata-2.0/node_modules/@vitejs/plugin-react/dist/index.js";
var OPUS_GENERATOR_PATH_PREFIX = "/opus-file-generator/";
var opusCrossOriginIsolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp"
};
var applyOpusGeneratorHeaders = (req, res, next) => {
  if (req.url?.startsWith(OPUS_GENERATOR_PATH_PREFIX)) {
    Object.entries(opusCrossOriginIsolationHeaders).forEach(([name, value]) => {
      res.setHeader(name, value);
    });
  }
  next();
};
var opusGeneratorHeadersPlugin = {
  name: "opus-generator-cross-origin-isolation-headers",
  configureServer(server) {
    server.middlewares.use(applyOpusGeneratorHeaders);
  },
  configurePreviewServer(server) {
    server.middlewares.use(applyOpusGeneratorHeaders);
  }
};
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hiroApiKey = env.HIRO_API_KEY || env.VITE_HIRO_API_KEY;
  const proxyHeaders = hiroApiKey ? { "x-hiro-api-key": hiroApiKey } : {};
  const hasHiroApiKey = Boolean(hiroApiKey);
  const bnsApiBase = env.VITE_BNS_API_MAINNET || env.VITE_BNS_API_BASE || "https://api.bns.xyz";
  const bnsV2MainnetApiBase = env.VITE_BNSV2_API_BASE_MAINNET || env.VITE_BNSV2_API_BASE || "https://api.bnsv2.com";
  const bnsV2TestnetApiBase = env.VITE_BNSV2_API_BASE_TESTNET || env.VITE_BNSV2_API_BASE || "https://api.bnsv2.com/testnet";
  return {
    plugins: [react(), opusGeneratorHeadersPlugin],
    define: {
      __XSTRATA_HAS_HIRO_KEY__: JSON.stringify(hasHiroApiKey)
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), "index.html"),
          workspace: resolve(process.cwd(), "workspace.html"),
          lab26: resolve(process.cwd(), "lab26/index.html"),
          migrate: resolve(process.cwd(), "web/migrate.html")
        },
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            tanstack: ["@tanstack/react-query"],
            stacks: ["@stacks/connect", "@stacks/network", "@stacks/transactions"],
            crypto: ["@noble/hashes"]
          }
        }
      }
    },
    server: {
      proxy: {
        "/bnsv2/mainnet": {
          target: bnsV2MainnetApiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bnsv2\/mainnet/, "")
        },
        "/bnsv2/testnet": {
          target: bnsV2TestnetApiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bnsv2\/testnet/, "")
        },
        "/bns": {
          target: bnsApiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bns/, "")
        },
        "/rpc-testnet": {
          target: "https://api.testnet.hiro.so",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rpc-testnet/, ""),
          headers: proxyHeaders
        },
        "/rpc": {
          target: "https://api.mainnet.hiro.so",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rpc/, ""),
          headers: proxyHeaders
        },
        "/hiro/testnet": {
          target: "https://api.testnet.hiro.so",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hiro\/testnet/, ""),
          headers: proxyHeaders
        },
        "/hiro/mainnet": {
          target: "https://api.mainnet.hiro.so",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hiro\/mainnet/, ""),
          headers: proxyHeaders
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvY29tcGFzc2lvbmF0ZS1mZXJ2ZW50LXBhc3RldXIvbW50L3h0cmF0YS94dHJhdGEtMi4wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvY29tcGFzc2lvbmF0ZS1mZXJ2ZW50LXBhc3RldXIvbW50L3h0cmF0YS94dHJhdGEtMi4wL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9jb21wYXNzaW9uYXRlLWZlcnZlbnQtcGFzdGV1ci9tbnQveHRyYXRhL3h0cmF0YS0yLjAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuY29uc3QgT1BVU19HRU5FUkFUT1JfUEFUSF9QUkVGSVggPSAnL29wdXMtZmlsZS1nZW5lcmF0b3IvJztcbmNvbnN0IG9wdXNDcm9zc09yaWdpbklzb2xhdGlvbkhlYWRlcnMgPSB7XG4gICdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeSc6ICdzYW1lLW9yaWdpbicsXG4gICdDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5JzogJ3JlcXVpcmUtY29ycCdcbn07XG5cbmNvbnN0IGFwcGx5T3B1c0dlbmVyYXRvckhlYWRlcnMgPSAoXG4gIHJlcTogeyB1cmw/OiBzdHJpbmcgfSxcbiAgcmVzOiB7IHNldEhlYWRlcjogKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgPT4gdm9pZCB9LFxuICBuZXh0OiAoKSA9PiB2b2lkXG4pID0+IHtcbiAgaWYgKHJlcS51cmw/LnN0YXJ0c1dpdGgoT1BVU19HRU5FUkFUT1JfUEFUSF9QUkVGSVgpKSB7XG4gICAgT2JqZWN0LmVudHJpZXMob3B1c0Nyb3NzT3JpZ2luSXNvbGF0aW9uSGVhZGVycykuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgcmVzLnNldEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbiAgbmV4dCgpO1xufTtcblxuY29uc3Qgb3B1c0dlbmVyYXRvckhlYWRlcnNQbHVnaW4gPSB7XG4gIG5hbWU6ICdvcHVzLWdlbmVyYXRvci1jcm9zcy1vcmlnaW4taXNvbGF0aW9uLWhlYWRlcnMnLFxuICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiB7IG1pZGRsZXdhcmVzOiB7IHVzZTogdHlwZW9mIGFwcGx5T3B1c0dlbmVyYXRvckhlYWRlcnMgfSB9KSB7XG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhcHBseU9wdXNHZW5lcmF0b3JIZWFkZXJzKTtcbiAgfSxcbiAgY29uZmlndXJlUHJldmlld1NlcnZlcihzZXJ2ZXI6IHsgbWlkZGxld2FyZXM6IHsgdXNlOiB0eXBlb2YgYXBwbHlPcHVzR2VuZXJhdG9ySGVhZGVycyB9IH0pIHtcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFwcGx5T3B1c0dlbmVyYXRvckhlYWRlcnMpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBjb25zdCBoaXJvQXBpS2V5ID0gZW52LkhJUk9fQVBJX0tFWSB8fCBlbnYuVklURV9ISVJPX0FQSV9LRVk7XG4gIGNvbnN0IHByb3h5SGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IGhpcm9BcGlLZXlcbiAgICA/IHsgJ3gtaGlyby1hcGkta2V5JzogaGlyb0FwaUtleSB9XG4gICAgOiB7fTtcbiAgY29uc3QgaGFzSGlyb0FwaUtleSA9IEJvb2xlYW4oaGlyb0FwaUtleSk7XG4gIGNvbnN0IGJuc0FwaUJhc2UgPVxuICAgIGVudi5WSVRFX0JOU19BUElfTUFJTk5FVCB8fCBlbnYuVklURV9CTlNfQVBJX0JBU0UgfHwgJ2h0dHBzOi8vYXBpLmJucy54eXonO1xuICBjb25zdCBibnNWMk1haW5uZXRBcGlCYXNlID1cbiAgICBlbnYuVklURV9CTlNWMl9BUElfQkFTRV9NQUlOTkVUIHx8XG4gICAgZW52LlZJVEVfQk5TVjJfQVBJX0JBU0UgfHxcbiAgICAnaHR0cHM6Ly9hcGkuYm5zdjIuY29tJztcbiAgY29uc3QgYm5zVjJUZXN0bmV0QXBpQmFzZSA9XG4gICAgZW52LlZJVEVfQk5TVjJfQVBJX0JBU0VfVEVTVE5FVCB8fFxuICAgIGVudi5WSVRFX0JOU1YyX0FQSV9CQVNFIHx8XG4gICAgJ2h0dHBzOi8vYXBpLmJuc3YyLmNvbS90ZXN0bmV0JztcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBvcHVzR2VuZXJhdG9ySGVhZGVyc1BsdWdpbl0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1hTVFJBVEFfSEFTX0hJUk9fS0VZX186IEpTT04uc3RyaW5naWZ5KGhhc0hpcm9BcGlLZXkpXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIG1haW46IHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgICAgICB3b3Jrc3BhY2U6IHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3dvcmtzcGFjZS5odG1sJyksXG4gICAgICAgICAgbGFiMjY6IHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ2xhYjI2L2luZGV4Lmh0bWwnKSxcbiAgICAgICAgICBtaWdyYXRlOiByZXNvbHZlKHByb2Nlc3MuY3dkKCksICd3ZWIvbWlncmF0ZS5odG1sJylcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICByZWFjdDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAgIHRhbnN0YWNrOiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxuICAgICAgICAgICAgc3RhY2tzOiBbJ0BzdGFja3MvY29ubmVjdCcsICdAc3RhY2tzL25ldHdvcmsnLCAnQHN0YWNrcy90cmFuc2FjdGlvbnMnXSxcbiAgICAgICAgICAgIGNyeXB0bzogWydAbm9ibGUvaGFzaGVzJ11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9ibnN2Mi9tYWlubmV0Jzoge1xuICAgICAgICAgIHRhcmdldDogYm5zVjJNYWlubmV0QXBpQmFzZSxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Juc3YyXFwvbWFpbm5ldC8sICcnKVxuICAgICAgICB9LFxuICAgICAgICAnL2Juc3YyL3Rlc3RuZXQnOiB7XG4gICAgICAgICAgdGFyZ2V0OiBibnNWMlRlc3RuZXRBcGlCYXNlLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYm5zdjJcXC90ZXN0bmV0LywgJycpXG4gICAgICAgIH0sXG4gICAgICAgICcvYm5zJzoge1xuICAgICAgICAgIHRhcmdldDogYm5zQXBpQmFzZSxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Jucy8sICcnKVxuICAgICAgICB9LFxuICAgICAgICAnL3JwYy10ZXN0bmV0Jzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLnRlc3RuZXQuaGlyby5zbycsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9ycGMtdGVzdG5ldC8sICcnKSxcbiAgICAgICAgICBoZWFkZXJzOiBwcm94eUhlYWRlcnNcbiAgICAgICAgfSxcbiAgICAgICAgJy9ycGMnOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGkubWFpbm5ldC5oaXJvLnNvJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3JwYy8sICcnKSxcbiAgICAgICAgICBoZWFkZXJzOiBwcm94eUhlYWRlcnNcbiAgICAgICAgfSxcbiAgICAgICAgJy9oaXJvL3Rlc3RuZXQnOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGkudGVzdG5ldC5oaXJvLnNvJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2hpcm9cXC90ZXN0bmV0LywgJycpLFxuICAgICAgICAgIGhlYWRlcnM6IHByb3h5SGVhZGVyc1xuICAgICAgICB9LFxuICAgICAgICAnL2hpcm8vbWFpbm5ldCc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FwaS5tYWlubmV0Lmhpcm8uc28nLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvaGlyb1xcL21haW5uZXQvLCAnJyksXG4gICAgICAgICAgaGVhZGVyczogcHJveHlIZWFkZXJzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVcsU0FBUyxlQUFlO0FBQ2pZLFNBQVMs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
