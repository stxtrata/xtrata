import { defineConfig } from "vitest/config";
import { vitestSetupFilePath, getClarinetVitestsArgv } from "@stacks/clarinet-sdk/vitest";

export default defineConfig({
  test: {
    // _to_delete holds a superseded v2-era suite for a contract that no
    // longer exists in this project.
    exclude: ["**/node_modules/**", "_to_delete/**"],
    environment: "clarinet",
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    setupFiles: [vitestSetupFilePath],
    environmentOptions: { clarinet: getClarinetVitestsArgv() },
  },
});
