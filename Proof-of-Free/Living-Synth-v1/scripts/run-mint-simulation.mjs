import { spawn } from "node:child_process";

const executable = process.platform === "win32"
  ? "node_modules/.bin/vitest.cmd"
  : "node_modules/.bin/vitest";
const child = spawn(executable, ["run", "tests/mint-simulation.test.ts", "--reporter=dot"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"]
});

let stdout = "";
let stderr = "";
child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");
child.stdout.on("data", chunk => { stdout += chunk; });
child.stderr.on("data", chunk => { stderr += chunk; });
child.on("error", error => {
  console.error(`Unable to start the mint simulation: ${error.message}`);
  process.exitCode = 1;
});
child.on("close", code => {
  const report = stdout.split(/\r?\n/).find(line => line.startsWith("MINT_SIMULATION_REPORT="));
  if (code === 0 && report) {
    console.log(report);
    console.log("Mint simulation passed: no network calls, broadcasts, or real STX spending.");
    return;
  }
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  if (code === 0) console.error("Mint simulation passed without producing its required report.");
  process.exitCode = code || 1;
});
