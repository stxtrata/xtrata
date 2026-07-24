import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "../../../xtrata-2.0/node_modules/playwright/index.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const engine = readFileSync(join(root, "artifacts/proof-of-free-engine-v3.js"), "utf8");
const controller =
  "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.proof-of-free-v1";
const config = {
  protocol: "proof-of-free/master",
  version: 3,
  engineId: 123,
  engineSha256: "ab".repeat(32),
  controllerContract: controller,
  campaignId: 0,
  registryUrl: "https://registry.invalid/pof"
};
const html = `<!doctype html><html><body>
<script id="pof-master" type="application/json">${JSON.stringify(config)}</script>
<script>${engine.replaceAll("</script>", "<\\/script>")}</script>
</body></html>`;

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
try {
  const failPage = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await failPage.route(config.registryUrl, route => route.fulfill({ status: 503, body: "offline" }));
  await failPage.setContent(html);
  await failPage.waitForTimeout(150);
  const failure = await failPage.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let lit = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] || pixels[index + 1] || pixels[index + 2]) lit += 1;
    }
    return {
      lit,
      disabled: document.querySelector(".pof-play").disabled,
      status: document.querySelector(".pof-count").textContent
    };
  });
  assert.equal(failure.lit, 0);
  assert.equal(failure.disabled, true);
  assert.match(failure.status, /REGISTRY UNVERIFIED/);
  await failPage.close();

  const claimPage = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await claimPage.route(config.registryUrl, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      protocol: "proof-of-free/claimed-registry",
      version: 1,
      contractId: controller,
      campaignId: 0,
      engineId: 123,
      engineSha256: "ab".repeat(32),
      maxSupply: 1024,
      active: true,
      policy: { onePerWallet: true, requireBns: true, onePerBns: true },
      claims: [
        { edition: 1, tokenId: 7001 },
        { edition: 1024, tokenId: 8024 }
      ]
    })
  }));
  await claimPage.setContent(html);
  await claimPage.waitForTimeout(150);
  const reveal = await claimPage.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    const rgb = (x, y) => [...context.getImageData(x, y, 1, 1).data.slice(0, 3)];
    return {
      first: rgb(16, 16),
      unclaimed: rgb(48, 16),
      last: rgb(1008, 1008),
      disabled: document.querySelector(".pof-play").disabled
    };
  });
  assert.ok(reveal.first.some(Boolean));
  assert.deepEqual(reveal.unclaimed, [0, 0, 0]);
  assert.ok(reveal.last.some(Boolean));
  assert.equal(reveal.disabled, false);

  const canvas = claimPage.locator("canvas");
  const box = await canvas.boundingBox();
  assert.ok(box);
  const before = await claimPage.locator("body > div").count();
  await claimPage.mouse.click(box.x + box.width * (1.5 / 32), box.y + box.height * (0.5 / 32));
  await claimPage.waitForTimeout(50);
  assert.equal(await claimPage.locator("body > div").count(), before);
  await claimPage.mouse.click(box.x + box.width * (0.5 / 32), box.y + box.height * (0.5 / 32));
  await claimPage.waitForTimeout(50);
  assert.equal(await claimPage.locator("body > div").count(), before + 1);
  await claimPage.close();

  console.log("browser smoke: fail-closed black grid and claimed-only triggering passed");
} finally {
  await browser.close();
}
