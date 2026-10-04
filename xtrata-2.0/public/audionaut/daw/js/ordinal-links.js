// Canonical provenance links; independent of the gateway used to fetch audio.
export function sourceOrdinalId(source) {
  if (!source) return null;
  if (typeof source === "object") {
    if (!["ordinal", "url"].includes(source.type)) return null;
    source = source.value;
  }
  if (typeof source !== "string") return null;
  const value = source.trim();
  const match =
    value.match(/^([a-f0-9]{64}i\d+)$/i) ||
    value.match(
      /^(?:https?:\/\/[^/]+)?\/(?:content|inscription)\/([a-f0-9]{64}i\d+)(?:[?#].*)?$/i,
    );
  return match ? match[1].toLowerCase() : null;
}
export function ordinalReference(source, label = "Inscription") {
  const id = sourceOrdinalId(source);
  return id
    ? {
        label,
        id,
        inscriptionUrl: `https://ordinals.com/inscription/${id}`,
        contentUrl: `https://ordinals.com/content/${id}`,
      }
    : null;
}
export function renderOrdinalReferences(container, references = []) {
  container.replaceChildren();
  for (const reference of references) {
    const ref = ordinalReference(
      reference.source ?? reference.id,
      reference.label,
    );
    if (!ref) continue;
    const row = document.createElement("div");
    row.className = "ordinal-reference";
    const label = document.createElement("span");
    label.className = "ordinal-label";
    label.textContent = ref.label;
    const id = document.createElement("a");
    id.className = "ordinal-id";
    id.textContent = ref.id;
    id.href = ref.inscriptionUrl;
    id.title = "Open original ordinal inscription";
    id.dataset.ordinalId = ref.id;
    const content = document.createElement("a");
    content.className = "ordinal-content";
    content.textContent = "Content";
    content.href = ref.contentUrl;
    content.title = "Open original inscription content";
    for (const link of [id, content]) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    row.append(label, id, content);
    container.append(row);
  }
  container.hidden = !container.childElementCount;
}

// Compact form for crowded rows (the channel list): one small button that keeps the row
// at its normal height. Hovering or focusing it floats a card with the inscription id and
// both links, so the provenance stays one step away without taking a line of its own.
export function renderOrdinalChip(container, references = []) {
  container.replaceChildren();
  const ref = references
    .map((r) => ordinalReference(r.source ?? r.id, r.label))
    .find(Boolean);
  container.classList.toggle("empty", !ref);
  if (!ref) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ch-btn ord";
  button.textContent = "ORD";
  button.setAttribute("aria-label", `${ref.label}: show ordinal links`);
  const card = document.createElement("div");
  card.className = "ord-card";
  const box = document.createElement("div");
  box.className = "ord-card-box";
  const label = document.createElement("span");
  label.className = "ordinal-label";
  label.textContent = ref.label;
  const id = document.createElement("a");
  id.className = "ordinal-id";
  id.textContent = ref.id;
  id.href = ref.inscriptionUrl;
  id.title = "Open original ordinal inscription";
  id.dataset.ordinalId = ref.id;
  const content = document.createElement("a");
  content.className = "ordinal-content";
  content.textContent = "Content";
  content.href = ref.contentUrl;
  content.title = "Open original inscription content";
  for (const link of [id, content]) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  box.append(label, id, content);
  card.append(box);
  container.append(button, card);
}
