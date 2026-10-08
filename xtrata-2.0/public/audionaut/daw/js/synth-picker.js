// synth-picker.js — folder-style synth chooser.
// Wraps the (hidden) native <select> built by fillSynthSelect() so every existing `select.value` /
// "change" listener keeps working, and puts a button in front of it. Clicking the button opens a
// folder tree: Bass ▸ Leads ▸ … ▸ Glass & Crystal; open a folder to see its synths, click one to
// load it. Empty folders are listed too (dimmed) so the gaps in the bank stay visible.
// Keyboard: ↑/↓ move, → open folder, ← close folder / jump to parent, Enter select, Esc close.

import { groupBank, categoryOf, CATEGORIES, fillSynthSelect } from "./synth-categories.js";

const valueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
const expanded = new Set(); // folder ids the user has opened (shared by every picker)
let current = null; // the open popover { pop, btn, off }

function closePopover(focusBtn = false) {
  if (!current) return;
  const { pop, btn, off } = current;
  current = null;
  off();
  pop.remove();
  btn.setAttribute("aria-expanded", "false");
  if (focusBtn) btn.focus({ preventScroll: true });
}

export function createSynthPicker(select, bank, { cls = "" } = {}) {
  fillSynthSelect(select, bank);
  const wrap = document.createElement("span");
  wrap.className = `synth-picker ${cls}`.trim();
  if (select.parentNode) select.replaceWith(wrap);
  select.hidden = true;
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "synth-picker-btn";
  btn.setAttribute("aria-haspopup", "tree");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<span class="sp-name"></span><span class="sp-folder"></span><span class="sp-caret" aria-hidden="true">▾</span>';
  btn.title = select.title || "Choose a synth";
  wrap.append(select, btn);

  const refresh = () => {
    const id = valueDesc.get.call(select);
    const def = bank[id];
    btn.querySelector(".sp-name").textContent = def ? def.name : "—";
    const cat = CATEGORIES.find((c) => c.id === categoryOf(id, def));
    btn.querySelector(".sp-folder").textContent = cat ? cat.label : "";
    btn.setAttribute("aria-label", `Synth: ${def ? def.name : "none"}${cat ? ", folder " + cat.label : ""}. Open folders`);
  };
  // programmatic `select.value = id` (row refresh, roll open, undo, load) must update the button too
  Object.defineProperty(select, "value", {
    configurable: true,
    get() { return valueDesc.get.call(this); },
    set(v) { valueDesc.set.call(this, v); refresh(); },
  });
  select.addEventListener("change", refresh);
  refresh();

  function choose(id) {
    valueDesc.set.call(select, id);
    refresh();
    closePopover(true);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function open() {
    closePopover();
    const curId = valueDesc.get.call(select);
    const curCat = categoryOf(curId, bank[curId]);
    const pop = document.createElement("div");
    pop.className = "synth-pop";
    pop.setAttribute("role", "tree");
    pop.setAttribute("aria-label", "Synth folders");

    for (const g of groupBank(bank)) {
      const isOpen = expanded.has(g.id) || g.id === curCat;
      const folder = document.createElement("div");
      folder.className = "sp-fold" + (g.ids.length ? "" : " empty") + (isOpen ? " open" : "");
      const head = document.createElement("button");
      head.type = "button";
      head.className = "sp-head";
      head.dataset.folder = g.id;
      head.setAttribute("role", "treeitem");
      head.setAttribute("aria-expanded", String(isOpen));
      head.title = g.blurb;
      head.innerHTML = `<span class="sp-twist" aria-hidden="true">${isOpen ? "▾" : "▸"}</span><span class="sp-ftitle"></span><span class="sp-count"></span>`;
      head.querySelector(".sp-ftitle").textContent = g.label;
      head.querySelector(".sp-count").textContent = g.ids.length ? String(g.ids.length) : "empty";
      const list = document.createElement("div");
      list.className = "sp-list";
      list.setAttribute("role", "group");
      list.hidden = !isOpen;
      if (g.ids.length) {
        for (const id of g.ids) {
          const it = document.createElement("button");
          it.type = "button";
          it.className = "sp-item" + (id === curId ? " sel" : "");
          it.dataset.id = id;
          it.setAttribute("role", "treeitem");
          it.setAttribute("aria-selected", String(id === curId));
          const dot = document.createElement("i");
          dot.style.background = bank[id].color || "#888";
          const nm = document.createElement("b");
          nm.textContent = bank[id].name;
          const tg = document.createElement("small");
          tg.textContent = bank[id].tagline || "";
          it.append(dot, nm, tg);
          it.addEventListener("click", () => choose(id));
          list.appendChild(it);
        }
      } else {
        const note = document.createElement("div");
        note.className = "sp-empty";
        note.textContent = `No synths yet — planned: ${g.blurb}`;
        list.appendChild(note);
      }
      head.addEventListener("click", () => {
        const now = list.hidden;
        list.hidden = !now;
        folder.classList.toggle("open", now);
        head.setAttribute("aria-expanded", String(now));
        head.querySelector(".sp-twist").textContent = now ? "▾" : "▸";
        if (now) expanded.add(g.id); else expanded.delete(g.id);
      });
      folder.append(head, list);
      pop.appendChild(folder);
    }

    document.body.appendChild(pop);
    // position under the button, keep inside the viewport
    const r = btn.getBoundingClientRect();
    const w = Math.max(300, r.width);
    pop.style.width = `${Math.min(w, innerWidth - 16)}px`;
    pop.style.left = `${Math.max(8, Math.min(r.left, innerWidth - Math.min(w, innerWidth - 16) - 8))}px`;
    const below = innerHeight - r.bottom - 12;
    const above = r.top - 12;
    if (below < 260 && above > below) {
      pop.style.bottom = `${innerHeight - r.top + 4}px`;
      pop.style.maxHeight = `${Math.max(200, above)}px`;
    } else {
      pop.style.top = `${r.bottom + 4}px`;
      pop.style.maxHeight = `${Math.max(200, below)}px`;
    }

    const visible = () => [...pop.querySelectorAll(".sp-head, .sp-list:not([hidden]) .sp-item")];
    const onKey = (e) => {
      const items = visible();
      const i = items.indexOf(document.activeElement);
      const act = document.activeElement;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closePopover(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); items[Math.min(items.length - 1, i + 1)]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[Math.max(0, i - 1)]?.focus(); }
      else if (e.key === "Home") { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1]?.focus(); }
      else if (e.key === "ArrowRight" && act?.classList.contains("sp-head") && act.getAttribute("aria-expanded") === "false") { e.preventDefault(); act.click(); }
      else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (act?.classList.contains("sp-head") && act.getAttribute("aria-expanded") === "true") act.click();
        else if (act?.classList.contains("sp-item")) act.closest(".sp-fold").querySelector(".sp-head").focus();
      } else if (e.key === "Tab") closePopover();
      e.stopPropagation(); // don't let the DAW's global key handlers play notes while browsing
    };
    const onDown = (e) => { if (!pop.contains(e.target) && !btn.contains(e.target)) closePopover(); };
    const onAway = () => closePopover();
    pop.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("resize", onAway);
    window.addEventListener("blur", onAway);
    const off = () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("resize", onAway);
      window.removeEventListener("blur", onAway);
    };
    current = { pop, btn, off };
    btn.setAttribute("aria-expanded", "true");
    (pop.querySelector(".sp-item.sel") || pop.querySelector(".sp-head"))?.focus({ preventScroll: true });
    pop.querySelector(".sp-item.sel")?.scrollIntoView({ block: "nearest" });
  }

  btn.addEventListener("click", () => (current && current.btn === btn ? closePopover(true) : open()));
  btn.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", " ", "Enter"].includes(e.key)) {
      e.preventDefault(); // Space would otherwise start the transport (global shortcut)
      e.stopPropagation();
      if (current && current.btn === btn) closePopover(true); else open();
    }
  });
  return wrap;
}
