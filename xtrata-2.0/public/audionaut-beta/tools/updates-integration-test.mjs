// Combined UI, mix export and inscription handoff checks. No wallet or external requests.
import assert from "node:assert/strict";
import { browser, page, serve } from "./serve.mjs";
const { srv, url } = await serve();
const b = await browser(), logs = [];
try {
  const p = await page(b, url, { logs });
  await p.goto(`${url}/audionaut-beta/daw.html`);
  await p.waitForFunction(() => document.querySelectorAll(".channel.instrument").length === 4);
  await p.waitForTimeout(500);
  const result = await p.evaluate(async () => {
    const { store, makeProject } = await import("/audionaut-beta/daw/js/state.js");
    const { engine } = await import("/audionaut-beta/daw/js/engine.js");
    const history = await import("/audionaut-beta/daw/js/history.js");
    const { changeSynth } = await import("/audionaut-beta/daw/js/synth-selection.js");
    const { setMidiTarget, getMidiTarget } = await import("/audionaut-beta/daw/js/midi-input.js");
    const persist = await import("/audionaut-beta/daw/js/persistence.js");
    const { renderMix } = await import("/audionaut-beta/daw/js/render-mix.js");
    const { prepareInscription } = await import("/audionaut-beta/daw/js/publish.js");
    const { takeCreateHandoff } = await import("/create-routing.js");
    const { Kit } = await import("/audionaut-beta/daw/js/plugin-faces/runtime.js");
    const { pluginDefaults, makeSlot } = await import("/audionaut-beta/daw/js/plugins.js");
    await import("/audionaut-beta/daw/js/plugin-faces/filter.js");
    await import("/audionaut-beta/daw/js/plugin-faces/formant.js");
    const wait = ms => new Promise(r => setTimeout(r, ms));
    store.loadProject(makeProject()); engine.ensureContext();
    history.resetHistory();
    const result = {};
    const original = { master: store.project.masterVolume, sample: store.channel(0).volume };
    store.project.masterVolume = 0.21; store.emit("project"); history.record(true);
    store.setChannelProp(0, "volume", 0.17); history.record(true);
    history.undo(); history.undo(); await wait(130);
    result.gains = { original, master: engine.masterGain.gain.value, sample: engine.channelGains[0].gain.value,
      header: +document.querySelector("#master-volume").value };
    changeSynth(0, "fm4"); store.setInstrumentProp(0, "params", { algo: 3, mod: 0.48 });
    changeSynth(0, "vox"); store.setInstrumentProp(0, "params", { vowel: 2 });
    changeSynth(0, "fm4"); const restored = structuredClone(store.instrument(0).params);
    const changed = changeSynth(0, "fm4");
    result.patches = { restored, changed, same: structuredClone(store.instrument(0).params) };
    setMidiTarget(2);
    document.querySelector(".channel.instrument[data-inst='0'] .mute").click();
    result.muteTarget = getMidiTarget();
    store.setInstrumentProp(0, "mute", false);

    // Mount actual effect faces and exercise their pointer gestures, including fine-mode entry.
    const host = document.createElement("div"); host.style.cssText = "position:fixed;inset:0;width:960px;height:600px;background:white;z-index:99999";
    document.body.append(host);
    const testFace = type => {
      let params = pluginDefaults(type);
      const mounted = Kit.mount(host, type, { getParams: () => params, setParams: next => { params = next; }, getEnabled: () => true,
        setEnabled: () => {}, onChange: () => () => {}, inst: () => null, taps: () => null });
      return mounted;
    };
    const gesture = (el, shift) => {
      const rect = el.getBoundingClientRect(), x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
      for (const [type, dx] of [["pointerdown", 0], ["pointermove", rect.width * .1], ["pointerup", rect.width * .1]])
        el.dispatchEvent(new PointerEvent(type, { pointerId: 999, button: 0, clientX: x + dx, clientY: y, shiftKey: shift, bubbles: true }));
    };
    const measureXY = (mount, selector, xKey, yKey) => {
      const P = mount.P, el = host.firstElementChild.firstElementChild.shadowRoot.querySelector(selector);
      P.setNorm(xKey, .5); P.setNorm(yKey, .5); gesture(el, false); const normal = P.norm(xKey) - .5;
      P.setNorm(xKey, .5); P.setNorm(yKey, .5); gesture(el, true); const fine = P.norm(xKey) - .5;
      el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      return { normal, fine, reset: P.get(xKey), expected: pluginDefaults(selector.includes("cutoff") ? "filter" : "formant")[xKey] };
    };
    let mounted = testFace("filter");
    result.filter = measureXY(mounted, '[data-bind="cutoff,q"]', "cutoff", "q"); mounted.dispose();
    mounted = testFace("formant");
    result.formant = measureXY(mounted, '[data-bind="vowel,shift"]', "vowel", "shift"); mounted.dispose(); host.remove();

    const project = makeProject(); project.projectName = "Export integration"; project.bpm = 420;
    project.instruments[0].synthId = "tonewheel"; project.instruments[0].volume = .5;
    project.sequences[0].notes[0] = [{ step: 0, dur: 4, pitch: 60, vel: .7 }, { step: 48, dur: 4, pitch: 67, vel: .7 }];
    const before = JSON.stringify(store.project), context = engine.ctx;
    const blob = await renderMix(project, [], { tail: .2 });
    const bytes = await blob.arrayBuffer();
    const decoded = await engine.ctx.decodeAudioData(bytes.slice(0));
    const data = decoded.getChannelData(0); let energy = 0; for (const v of data) energy += v * v;
    result.mix = { type: blob.type, bytes: blob.size, duration: decoded.duration, rms: Math.sqrt(energy / data.length),
      unchanged: before === JSON.stringify(store.project), contextUnchanged: engine.ctx === context };
    const sampleProject = makeProject(); sampleProject.bpm = 420;
    sampleProject.channels[0].source = { type: "file", value: "decoded-test-tone" };
    sampleProject.sequences[0].steps[0][0] = 1;
    const sample = engine.ctx.createBuffer(1, 44100, 44100);
    sample.getChannelData(0).forEach((_, i, values) => { values[i] = .3 * Math.sin(2 * Math.PI * 2000 * i / 44100); });
    const sampleEnergy = async () => {
      const output = await renderMix(sampleProject, [sample], { tail: .1 });
      const wave = await engine.ctx.decodeAudioData(await output.arrayBuffer());
      return wave.getChannelData(0).reduce((sum, value) => sum + value * value, 0);
    };
    const dry = await sampleEnergy();
    sampleProject.channels[0].fx = [makeSlot("filter", { cutoff: 80, q: .7, lfoDepth: 0, follow: 0, drive: 0 })];
    const filtered = await sampleEnergy(); sampleProject.channels[0].mute = true;
    const muted = await sampleEnergy();
    result.sampleMix = { dry, filtered, muted };
    const routes = [];
    for (const file of [new File(['{"test":1}'], "project.json", { type: "application/json" }), new File([new Uint8Array(512 * 1024 + 1)], "mix.wav", { type: "audio/wav" })]) {
      const route = new URL(await prepareInscription(file), location.origin);
      const record = await takeCreateHandoff(route.searchParams.get("handoffId"));
      routes.push({ path: route.pathname, source: record.source, name: record.files[0].name, size: record.files[0].size,
        consumed: await takeCreateHandoff(route.searchParams.get("handoffId")) === null });
    }
    result.routes = routes;
    store.project.projectName = "Integration recovery"; store.emit("project"); await persist.autosave({ force: true });
    const saved = await persist.listSavedProjects(); const newest = saved.find(s => s.projectName === "Integration recovery" && s.isLatest);
    store.loadProject(makeProject()); await persist.restoreSavedProject(newest.id);
    result.recovered = store.project.projectName;
    return result;
  });
  assert.ok(Math.abs(result.gains.master - result.gains.original.master) < .002);
  assert.ok(Math.abs(result.gains.sample - result.gains.original.sample) < .002);
  assert.equal(result.gains.header, result.gains.original.master);
  assert.deepEqual(result.patches, { restored: { algo: 3, mod: .48 }, changed: false, same: { algo: 3, mod: .48 } });
  assert.equal(result.muteTarget, 2);
  for (const type of ["filter", "formant"]) {
    assert.ok(result[type].normal > .05, `${type} normal drag`);
    assert.ok(result[type].fine > 0 && result[type].fine < result[type].normal * .3, `${type} fine drag`);
    assert.equal(result[type].reset, result[type].expected, `${type} reset`);
  }
  assert.equal(result.mix.type, "audio/wav"); assert.ok(result.mix.rms > .001); assert.ok(result.mix.duration > 2.4);
  assert.ok(result.mix.unchanged && result.mix.contextUnchanged);
  assert.ok(result.sampleMix.dry > 1 && result.sampleMix.filtered < result.sampleMix.dry * .1, "sample filter is included in mix");
  assert.equal(result.sampleMix.muted, 0, "sample mute is included in mix");
  assert.deepEqual(result.routes.map(r => r.path), ["/inscribe", "/wizard/"]);
  assert.ok(result.routes.every(r => r.source === "audionaut-beta" && r.consumed)); assert.equal(result.routes[1].size, 512 * 1024 + 1);
  assert.equal(result.recovered, "Integration recovery");
  // Exercise preparation in the real modal and its edit invalidation.
  await p.locator("#btn-publish").click();
  await p.locator("#publish-format").selectOption("project");
  await p.locator("#publish-prepare").click();
  await p.waitForFunction(() => !document.querySelector("#publish-download").disabled);
  await p.evaluate(async () => { const { store } = await import("/audionaut-beta/daw/js/state.js"); store.setInstrumentProp(0, "volume", .4); });
  assert.equal(await p.locator("#publish-continue").isDisabled(), true);
  await p.locator("#publish-close").click();
  await p.reload(); await p.waitForFunction(() => document.querySelectorAll(".channel.instrument").length === 4);
  assert.equal(await p.evaluate(async () => (await import("/audionaut-beta/daw/js/state.js")).store.project.projectName), "Integration recovery");
  for (const width of [1440, 1180, 800, 390]) {
    await p.setViewportSize({ width, height: 900 });
    for (const id of ["#btn-projects", "#btn-publish", "#btn-load", "#btn-new", "#btn-settings", "#artist-name", "#live-instrument", "#live-panic", "#arp-enabled"]) {
      const box = await p.locator(id).boundingBox(); assert.ok(box && box.x >= 0 && box.x + box.width <= width, `${id} fits ${width}px`);
    }
    await p.locator("#btn-publish").click();
    const box = await p.locator("#modal-publish .modal-box").boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width);
    if (process.env.SCREENSHOT_DIR) await p.screenshot({ path: `${process.env.SCREENSHOT_DIR}/audionaut-publish-${width}.png` });
    await p.locator("#publish-close").click();
  }
  assert.deepEqual(logs.filter(line => line.startsWith("pageerror")), []);
  console.log("PASS integrated gain undo, synth patches, target selection, effect gestures, WAV mix, inscription handoff, recovery, publish UI and responsive controls", JSON.stringify(result));
} catch (error) { console.error(logs); throw error; }
finally { await b.close(); srv.close(); }
