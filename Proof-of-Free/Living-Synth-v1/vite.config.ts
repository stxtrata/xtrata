import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { port: 4173 },
  build: { target: "es2022" }
});

