import { store } from "./state.js";
import { engine } from "./engine.js";
import {
  loadWordIndex,
  searchWordIndex,
  validateWordSelection,
} from "./word-index.js";
import { fetchAndDecode } from "./loader.js";
import { importSelection } from "./source-actions.js";
import { downloadBlob, encodeWav, selectionBounds } from "./audio-utils.js";
import { openLoader, openLibraryItem, setStatus } from "./ui.js";
import { LANDMARKS } from "./song-format.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
import { createWordTrimmer } from "./word-trimmer.js";
import { playPlaylist, stopPlaylist, isPlaylistActive } from "./playlist.js";

let cataloguePromise, closeActive;
const FAVOURITES = "audionalL1xL2.v1.favourites";
const make = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
const button = (text, handler) => {
  const b = make("button", text);
  b.type = "button";
  b.onclick = handler;
  return b;
};
export function searchCatalogue(entries, query = "", filter = "all") {
  const q = query.trim().toLocaleLowerCase();
  return entries.filter(
    (item) =>
      (!q ||
        [item.id, item.label, item.excerpt].some((v) =>
          v?.toLocaleLowerCase().includes(q),
        )) &&
      (filter === "all" ||
        (filter === "words" && item.words > 0) ||
        (filter === "metadata" && item.metadata) ||
        (filter === "curated" && item.curated)),
  );
}
export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES) || "[]")
      .map((x) =>
        validateWordSelection({
          ...x,
          text:
            typeof x.text === "string" ? x.text.slice(0, 160) : "Saved section",
        }),
      )
      .slice(0, 500);
  } catch {
    return [];
  }
}
function saveFavourites(items) {
  localStorage.setItem(FAVOURITES, JSON.stringify(items.slice(0, 500)));
}
function catalogue() {
  return (cataloguePromise ||= fetch(
    new URL("../data/l1-catalogue.json", import.meta.url),
  )
    .then((r) => {
      if (!r.ok)
        throw new Error(
          "Could not load the L1 catalogue. Reopen the browser to retry.",
        );
      return r.json();
    })
    .catch((e) => {
      cataloguePromise = null;
      throw e;
    }));
}
export function openSourceBrowser({
  ch = 0,
  mode = "audio",
  step = null,
} = {}) {
  closeActive?.();
  const project = store.project,
    sequence = store.seq,
    controller = new AbortController(),
    opener = document.activeElement;
  const trimmers = new Set();
  let waveforms = newWaveformQueue();
  function newWaveformQueue() {
    return {
      controller: new AbortController(),
      groups: new Map(),
      pending: [],
      running: 0,
    };
  }
  // Share each recording between its visible word results, with two loads at a time.
  function queueWaveform(source, editor) {
    const queue = waveforms;
    editor.setLoading();
    let group = queue.groups.get(source.value);
    if (!group) {
      group = { source, editors: new Set() };
      queue.groups.set(source.value, group);
      queue.pending.push(group);
    }
    group.editors.add(editor);
    queueMicrotask(() => loadWaveforms(queue));
  }
  function loadWaveforms(queue) {
    if (queue.controller.signal.aborted) return;
    while (queue.running < 2 && queue.pending.length) {
      const group = queue.pending.shift();
      queue.running++;
      fetchAndDecode(group.source, { signal: queue.controller.signal })
        .then(({ audioBuffer }) => {
          if (queue.controller.signal.aborted) return;
          for (const editor of group.editors)
            if (editor.element.isConnected) editor.setAudioBuffer(audioBuffer);
        })
        .catch((error) => {
          if (queue.controller.signal.aborted) return;
          for (const editor of group.editors)
            if (editor.element.isConnected) editor.setError(error.message);
        })
        .finally(() => {
          queue.groups.delete(group.source.value);
          queue.running--;
          loadWaveforms(queue);
        });
    }
  }
  const dialog = make("dialog", undefined, "source-browser");
  dialog.setAttribute("aria-label", "L1 audio and words");
  let busy = false,
    previewVersion = 0,
    data = null,
    words = null,
    offset = 0,
    query = "",
    filter = "all";
  const title = make("div", undefined, "browser-title"),
    heading = make("h2", "L1 Audio & Words");
  const status = make("p", "Loading recovered indexes…", "browser-status");
  status.setAttribute("role", "status");
  const stop = () => {
    previewVersion++;
    engine.stopPreview();
  };
  let off = () => {};
  const close = () => {
    waveforms.controller.abort();
    for (const trim of trimmers) trim.dispose();
    trimmers.clear();
    stop();
    controller.abort();
    off();
    dialog.close();
    dialog.remove();
    if (closeActive === close) closeActive = null;
    if (opener?.isConnected) opener.focus();
  };
  closeActive = close;
  title.append(heading, button("Close", close));
  const intro = make(
    "p",
    "Browse recovered Bitcoin audio or find spoken sections. Word waveforms load automatically; audio plays when you preview.",
    "browser-intro",
  );
  const destination = make("div", undefined, "browser-destination"),
    channel = make("select");
  channel.setAttribute("aria-label", "Destination channel");
  for (let i = 0; i < store.numChannels; i++) {
    const option = make("option", `${i + 1} · ${store.channel(i).name}`);
    option.value = i;
    channel.append(option);
  }
  channel.value = ch;
  const placement = make("select");
  placement.setAttribute("aria-label", "Placement");
  for (const [value, label] of [
    ["channel", "Channel trim"],
    ["step", "At a step"],
  ]) {
    const o = make("option", label);
    o.value = value;
    placement.append(o);
  }
  placement.value = step === null ? "channel" : "step";
  const stepInput = make("input");
  stepInput.type = "number";
  stepInput.min = "1";
  stepInput.max = "64";
  stepInput.value = step === null ? "1" : String(step + 1);
  stepInput.setAttribute("aria-label", "Destination step");
  stepInput.hidden = placement.value !== "step";
  placement.onchange = () => {
    stepInput.hidden = placement.value !== "step";
  };
  destination.append(
    make("span", `Destination · Seq ${project.currentSequence + 1}`),
    channel,
    placement,
    stepInput,
  );
  const tabs = make("nav", undefined, "browser-tabs"),
    tabButtons = {};
  for (const [value, label] of [
    ["audio", "Audio catalogue"],
    ["words", "Word search"],
    ["favourites", "Favourites"],
  ]) {
    tabButtons[value] = button(label, () => {
      if (busy) return;
      mode = value;
      offset = 0;
      syncTabs();
      render();
    });
    tabs.append(tabButtons[value]);
  }
  tabs.append(
    button("L2 / URL / File", () => {
      const target = +channel.value;
      close();
      openLoader(target);
    }),
  );
  const form = make("form", undefined, "browser-search"),
    input = make("input");
  input.type = "search";
  input.maxLength = 160;
  input.placeholder = "Search names, inscription IDs, words or phrases";
  input.setAttribute("aria-label", "Search L1 audio or words");
  const filters = make("select");
  filters.setAttribute("aria-label", "Catalogue filter");
  for (const [value, label] of [
    ["all", "All audio"],
    ["words", "Has word timings"],
    ["metadata", "Has analysis"],
    ["curated", "Curated samples"],
  ]) {
    const o = make("option", label);
    o.value = value;
    filters.append(o);
  }
  const search = button("Search");
  search.type = "submit";
  const queueOwner = {};
  const playAll = button("▶ Play all", () => {
    if (isPlaylistActive(queueOwner)) {
      stopPlaylist();
      return;
    }
    if (!data || !words || busy) return;
    try {
      const found =
        mode === "words"
          ? searchWordIndex(words, query, { limit: Number.MAX_SAFE_INTEGER })
              .matches
          : mode === "favourites"
            ? getFavourites().filter(
                (x) =>
                  !query || x.text?.toLowerCase().includes(query.toLowerCase()),
              )
            : searchCatalogue(data.entries, query, filter);
      const overrides = new Map(
        [...list.children]
          .filter((card) => card.playlistSelection)
          .map((card) => card.playlistSelection()),
      );
      const items = found.map((item) => {
        const selection =
          mode === "audio"
            ? null
            : overrides.get(`${item.ordinalId}:${item.start}:${item.end}`) ||
              item;
        return {
          label: item.text || item.label,
          source: { type: "ordinal", value: item.ordinalId || item.id },
          selection,
        };
      });
      playPlaylist(items, {
        owner: queueOwner,
        status: (message) => {
          if (!controller.signal.aborted) status.textContent = message;
        },
        state: (active) => {
          playAll.textContent = active ? "■ Stop all" : "▶ Play all";
          playAll.setAttribute("aria-pressed", String(active));
        },
      });
    } catch (error) {
      status.textContent = error.message;
    }
  });
  playAll.setAttribute("aria-pressed", "false");
  playAll.disabled = true;
  playAll.title =
    "Play every matching result, including results beyond this page; click again to stop";
  form.append(input, filters, search, playAll);
  const list = make("div", undefined, "browser-results"),
    more = button("More results", () => render(true)),
    faveTools = make("div", undefined, "browser-favourite-tools");
  const importFile = make("input");
  importFile.type = "file";
  importFile.accept = ".json";
  importFile.hidden = true;
  faveTools.append(
    button("Export favourites", () =>
      downloadBlob(
        new Blob(
          [
            JSON.stringify(
              { format: "audional-phrases/1", phrases: getFavourites() },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
        "audional-phrases.json",
      ),
    ),
    button("Import favourites", () => importFile.click()),
    importFile,
  );
  importFile.onchange = async () => {
    try {
      const file = importFile.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024)
        throw new Error("Phrase file is too large.");
      const json = JSON.parse(await file.text());
      if (json.format !== "audional-phrases/1" || !Array.isArray(json.phrases))
        throw new Error("Choose an Audional phrase-library file.");
      const imported = json.phrases.map((x) => validateWordSelection(x));
      saveFavourites(
        [...getFavourites(), ...imported].filter(
          (x, i, a) =>
            a.findIndex(
              (y) =>
                y.ordinalId === x.ordinalId &&
                y.start === x.start &&
                y.end === x.end,
            ) === i,
        ),
      );
      render();
    } catch (e) {
      status.textContent = e.message;
    } finally {
      importFile.value = "";
    }
  };
  dialog.append(
    title,
    intro,
    destination,
    tabs,
    form,
    faveTools,
    status,
    list,
    more,
  );
  document.body.append(dialog);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      close();
  });
  off = store.on("load", close);
  dialog.showModal();
  input.focus();
  function syncTabs() {
    for (const [key, b] of Object.entries(tabButtons)) {
      b.classList.toggle("active", mode === key);
      b.setAttribute("aria-pressed", String(mode === key));
    }
    filters.hidden = mode !== "audio";
    faveTools.hidden = mode !== "favourites";
  }
  async function act(action, work) {
    if (busy) return;
    busy = true;
    stop();
    dialog.setAttribute("aria-busy", "true");
    status.textContent = action;
    const fields = [...dialog.querySelectorAll("input,select,button")].filter(
      (n) => !["Close", "Stop"].includes(n.textContent),
    );
    for (const field of fields) field.disabled = true;
    try {
      await work();
    } catch (error) {
      if (!controller.signal.aborted) status.textContent = error.message;
    } finally {
      busy = false;
      dialog.removeAttribute("aria-busy");
      for (const field of fields) field.disabled = false;
    }
  }
  function resultRow(item, word) {
    const card = make("article", undefined, "source-card"),
      name = make("strong", word ? item.text : item.label);
    card.append(name);
    if (item.context || item.excerpt)
      card.append(make("p", item.context || item.excerpt, "source-context"));
    const id = word ? item.ordinalId : item.id;
    const links = make("div", undefined, "ordinal-links");
    renderOrdinalReferences(links, [
      { id, label: word ? "Audio inscription" : "Inscription" },
    ]);
    card.append(links);
    if (!word && LANDMARKS[id]) {
      const kind = LANDMARKS[id].kind;
      card.append(
        make(
          "p",
          kind === "song"
            ? "Song instructions · multi-channel arrangement"
            : "Original on-chain application · not an audio sample",
          "source-meta",
        ),
      );
      card.append(
        button(
          kind === "song" ? "Song options" : "Open original player",
          () => {
            close();
            openLibraryItem(id, +channel.value);
          },
        ),
      );
      return card;
    }
    if (!word)
      card.append(
        make(
          "p",
          `${item.words || 0} indexed words${item.metadata ? ` · ${Number(item.metadata.duration || 0).toFixed(3)}s · ${item.metadata.sampleRate || "—"} Hz · ${item.metadata.channels || "—"} ch` : ""}`,
          "source-meta",
        ),
      );
    const actions = make("div", undefined, "source-actions");
    const source = {
      type: "ordinal",
      value: id,
      label: word ? `Bitcoin ${id.slice(0, 12)}…` : item.label,
    };
    let trim = null;
    if (word) {
      trim = createWordTrimmer(item, {
        onEdit: () => {
          stop();
          status.textContent =
            "Selection adjusted. Preview to listen, or Reset trims to restore the word timings.";
        },
        onWaveform: (editor) => queueWaveform(source, editor),
      });
      trimmers.add(trim);
      card.append(trim.element);
      queueWaveform(source, trim);
    }
    const selected = () => (trim ? trim.selection() : null);
    if (word)
      card.playlistSelection = () => [
        `${item.ordinalId}:${item.start}:${item.end}`,
        selected(),
      ];
    actions.append(
      button("Preview", () =>
        act("Loading preview…", async () => {
          const selection = selected(),
            version = previewVersion,
            result = await fetchAndDecode(source, {
              signal: controller.signal,
            });
          if (controller.signal.aborted || version !== previewVersion) return;
          trim?.setAudioBuffer(result.audioBuffer);
          const bounds = selection
            ? selectionBounds(
                result.audioBuffer,
                selection.start,
                selection.end,
              )
            : { start: 0, end: Math.min(30, result.audioBuffer.duration) };
          engine.playBuffer(result.audioBuffer, bounds.start, bounds.end);
          status.textContent = selection
            ? "Playing selected section."
            : "Playing preview (up to 30 seconds).";
        }),
      ),
      button("Stop", () => {
        stop();
        status.textContent = "Preview stopped.";
      }),
    );
    actions.append(
      button("Load into sampler", () =>
        act("Loading selected audio…", async () => {
          const selectedStep =
            placement.value === "step" ? stepInput.valueAsNumber - 1 : null;
          const result = await importSelection(
            +channel.value,
            source,
            selected(),
            { signal: controller.signal, step: selectedStep, sequence },
          );
          if (controller.signal.aborted) return;
          setStatus(
            `Loaded into channel ${+channel.value + 1}${selectedStep !== null ? ` · step ${selectedStep + 1}` : ""} (${result.audioBuffer.duration.toFixed(2)}s source).`,
          );
          close();
        }),
      ),
    );
    if (word) {
      actions.append(
        button(
          mode === "favourites" ? "Remove favourite" : "Save phrase",
          () => {
            try {
              const selection = selected(),
                items = getFavourites();
              if (mode === "favourites") {
                saveFavourites(
                  items.filter(
                    (x) =>
                      !(
                        x.ordinalId === item.ordinalId &&
                        x.start === item.start &&
                        x.end === item.end
                      ),
                  ),
                );
                render();
              } else {
                if (
                  !items.some(
                    (x) =>
                      x.ordinalId === selection.ordinalId &&
                      x.start === selection.start &&
                      x.end === selection.end,
                  )
                )
                  items.push(selection);
                saveFavourites(items);
                status.textContent = "Phrase saved to favourites.";
              }
            } catch (e) {
              status.textContent = e.message;
            }
          },
        ),
        button("Download WAV", () =>
          act("Preparing section WAV…", async () => {
            const selection = selected(),
              { audioBuffer } = await fetchAndDecode(source, {
                signal: controller.signal,
              });
            if (controller.signal.aborted) return;
            downloadBlob(
              encodeWav(audioBuffer, selection),
              `${selection.text.replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 60) || "phrase"}.wav`,
            );
            status.textContent = "Section WAV exported.";
          }),
        ),
      );
    }
    card.append(actions);
    return card;
  }
  function render(append = false) {
    if (!data || !words) return;
    if (!append) stop();
    if (!append) {
      waveforms.controller.abort();
      waveforms = newWaveformQueue();
      offset = 0;
      for (const trim of trimmers) trim.dispose();
      trimmers.clear();
      list.replaceChildren();
    }
    let matches, total;
    if (mode === "words") {
      const found = searchWordIndex(words, query, { offset, limit: 30 });
      matches = found.matches;
      total = found.total;
    } else {
      const found =
        mode === "favourites"
          ? getFavourites().filter(
              (x) =>
                !query || x.text?.toLowerCase().includes(query.toLowerCase()),
            )
          : searchCatalogue(data.entries, query, filter);
      total = found.length;
      matches = found.slice(offset, offset + 30);
    }
    for (const item of matches) list.append(resultRow(item, mode !== "audio"));
    offset += matches.length;
    more.hidden = offset >= total;
    playAll.disabled = total === 0;
    status.textContent = total
      ? `${total.toLocaleString()} matches · showing ${offset.toLocaleString()}${mode === "audio" ? ` · ${data.cataloguedCount.toLocaleString()} saved catalogue IDs` : ""}`
      : mode === "words" && !query
        ? "Enter a word or consecutive phrase."
        : "No matches found.";
  }
  form.onsubmit = (event) => {
    event.preventDefault();
    if (busy) return;
    query = input.value.trim();
    filter = filters.value;
    render();
  };
  filters.onchange = () => {
    filter = filters.value;
    render();
  };
  syncTabs();
  search.disabled = true;
  more.hidden = true;
  Promise.all([catalogue(), loadWordIndex()])
    .then(([c, w]) => {
      if (controller.signal.aborted) return;
      data = c;
      words = w;
      search.disabled = false;
      render();
      intro.textContent = `${c.entries.length.toLocaleString()} L1 sources · ${c.wordCount.toLocaleString()} playable words across ${c.transcriptCount} recordings. Word waveforms load automatically. Existing timings; audio availability varies by gateway.`;
    })
    .catch((e) => {
      if (!controller.signal.aborted) status.textContent = e.message;
    });
  return close;
}
export function initSourceBrowser() {
  document.querySelector("#btn-l1-audio").onclick = () => openSourceBrowser();
  document.querySelector("#btn-l1-words").onclick = () =>
    openSourceBrowser({ mode: "words" });
  document.addEventListener("l1xl2:library", (event) =>
    openSourceBrowser(event.detail),
  );
}
