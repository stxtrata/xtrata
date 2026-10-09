#!/usr/bin/env node
// tools/picker-test.mjs — the folder-tree synth picker on the real daw.html.
// Checks: every row picker and the MIDI-roll picker list all 15 folders, none empty, every bank
// synth appears exactly once under its folder; choosing each of the given synths through the
// picker UI (open → folder → synth) on each row selects it and the row button shows its name.
//   node tools/picker-test.mjs [all|ids…]
import { serve, browser, page as mkPage } from "./serve.mjs";
import { POLISH } from "./ids.js";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const { srv, url } = await serve();
const b = await browser();
const logs = [], fails = [];
const ok = (c, m) => (c ? true : (fails.push(m), false));
const p = await mkPage(b, url, { logs });
await p.goto(`${url}/audionaut/daw.html`);
await p.waitForFunction(() => document.querySelectorAll(".channel.instrument .synth-picker-btn").length >= 4);

const tree = await p.evaluate(async () => {
  const { SYNTH_BANK } = await import("/audionaut/daw/js/synths.js");
  const { groupBank, CATEGORIES } = await import("/audionaut/daw/js/synth-categories.js");
  const g = groupBank(SYNTH_BANK);
  const sels = [...document.querySelectorAll(".inst-synth-select"), document.querySelector("#roll-synth-select")];
  return {
    folders: g.map((x) => ({ id: x.id, n: x.ids.length })),
    cats: CATEGORIES.filter((c) => c.id !== "other").length,
    bank: Object.keys(SYNTH_BANK),
    selects: sels.map((s) => ({ groups: s.querySelectorAll("optgroup").length, opts: [...s.querySelectorAll("option:not([disabled])")].map((o) => o.value) })),
  };
});
ok(tree.folders.length === 15, `expected 15 folders, got ${tree.folders.length}`);
for (const f of tree.folders) ok(f.n > 0, `folder ${f.id} is empty`);
tree.selects.forEach((s, i) => {
  ok(s.groups === 15, `picker ${i}: ${s.groups} folders`);
  ok(s.opts.length === tree.bank.length && new Set(s.opts).size === s.opts.length, `picker ${i}: ${s.opts.length} synths for a bank of ${tree.bank.length}`);
});

let ids = args.length ? args : POLISH;
if (ids[0] === "all") ids = tree.bank;
for (let row = 0; row < 4; row++) {
  for (const id of ids) {
    const btn = p.locator(".channel.instrument .synth-picker-btn").nth(row);
    await btn.click();
    const r = await p.evaluate(async ({ id, row }) => {
      const { SYNTH_BANK } = await import("/audionaut/daw/js/synths.js");
      const { categoryOf, CATEGORIES } = await import("/audionaut/daw/js/synth-categories.js");
      const label = CATEGORIES.find((c) => c.id === categoryOf(id, SYNTH_BANK[id])).label;
      const pop = document.querySelector(".sp-pop, [role=tree]");
      if (!pop) return { err: "no popover" };
      const items = [...pop.querySelectorAll("[role=treeitem]")];
      const folder = items.find((n) => n.textContent.includes(label) && n.getAttribute("aria-expanded") != null);
      if (!folder) return { err: `folder ${label} not found` };
      if (folder.getAttribute("aria-expanded") !== "true") folder.click();
      await new Promise((r) => setTimeout(r, 30));
      const leaf = [...pop.querySelectorAll("[role=treeitem]")].find((n) => n.getAttribute("aria-expanded") == null && n.textContent.trim().startsWith(SYNTH_BANK[id].name));
      if (!leaf) return { err: `synth ${SYNTH_BANK[id].name} not in folder ${label}` };
      leaf.click();
      await new Promise((r) => setTimeout(r, 30));
      const { store } = await import("/audionaut/daw/js/state.js");
      const b = document.querySelectorAll(".channel.instrument .synth-picker-btn")[row];
      return { got: store.instrument(row).synthId, shown: b.querySelector(".sp-name").textContent, want: SYNTH_BANK[id].name };
    }, { id, row });
    ok(!r.err && r.got === id && r.shown === r.want, `row ${row} pick ${id}: ${JSON.stringify(r)}`);
    await p.keyboard.press("Escape").catch(() => {});
  }
}
await b.close();
srv.close();
for (const f of fails.slice(0, 40)) console.log("FAIL", f);
for (const l of logs.slice(0, 20)) console.log("console", l);
console.log(fails.length || logs.length ? `${fails.length} failures, ${logs.length} console errors` : `picker ok: 15 folders, ${tree.bank.length} synths, ${ids.length} picked on 4 rows`);
process.exit(fails.length || logs.length ? 1 : 0);
