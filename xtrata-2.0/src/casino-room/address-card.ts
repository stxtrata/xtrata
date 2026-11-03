/**
 * A player's address, shown in full with a Copy button: yours in the Room panel, anyone else's when you tap their name in chat,
 * in "Here now", or tap them (their figure or name tag) in the casino.
 *
 * Two lines for one key: the testnet address the casino plays with (ST...), and the mainnet address of the same key (SP...). BNS names
 * live on mainnet, and the Salon looks a player's name up on that mainnet address, so a BNS name sent to the SP address is what lets
 * them into the Salon. Everything is put on the page as text, never as markup.
 */

export const ADDRESS_CSS = `
.pxaddr{display:flex;flex-direction:column;gap:6px;margin:4px 0 8px}
.pxaddr .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(227,184,74,.25)}
.pxaddr .k{flex:1 1 100%;font-size:11px;letter-spacing:.03em;color:var(--dim,#c9b894)}
.pxaddr code{flex:1 1 0;min-width:0;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink,#f6ead0);overflow-wrap:anywhere;word-break:break-all;user-select:all;-webkit-user-select:all}
:is(#pxroom-panel,#pxchat,body) .pxaddr button{flex:0 0 auto;margin:0;font:inherit;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button:hover{background:rgba(227,184,74,.22)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button.ok{background:rgba(70,140,90,.35);border-color:#9fd7b0}
`;

let styled = false;
function style() {
  if (styled) return; styled = true;
  const s = document.createElement('style'); s.textContent = ADDRESS_CSS; document.head.append(s);
}

/** Puts the text on the clipboard. Falls back to the old copy command (selecting the shown text) where the clipboard API is missing. */
export async function copyText(text: string, shown?: HTMLElement): Promise<boolean> {
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; } } catch { /* try the old way */ }
  try {
    const sel = window.getSelection(), range = document.createRange();
    let tmp: HTMLTextAreaElement | null = null;
    if (shown) range.selectNodeContents(shown);
    else { tmp = document.createElement('textarea'); tmp.value = text; tmp.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(tmp); tmp.select(); }
    if (shown && sel) { sel.removeAllRanges(); sel.addRange(range); }
    const ok = document.execCommand('copy');
    tmp?.remove();
    return ok;
  } catch { return false; }
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};

function line(label: string, address: string) {
  const r = el('div', undefined, 'r');
  const code = el('code', address);
  const b = el('button', 'Copy'); b.type = 'button';
  b.setAttribute('aria-label', `Copy ${label.toLowerCase()}`);
  let t = 0;
  b.onclick = async (e) => {
    e.stopPropagation();
    const ok = await copyText(address, code);
    b.textContent = ok ? 'Copied ✓' : 'Select it and copy';
    b.classList.toggle('ok', ok);
    window.clearTimeout(t); t = window.setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1800);
  };
  r.append(el('span', label, 'k'), code, b);
  return r;
}

/**
 * The address block. `mainnetOf` turns a testnet address into the mainnet address of the same key (it may throw on a malformed one;
 * then only the address itself is shown).
 */
export function addressBlock(address: string, mainnetOf?: (a: string) => string): HTMLElement {
  style();
  const box = el('div', undefined, 'pxaddr');
  const testnet = /^S[TN]/.test(address);
  let main: string | null = null;
  if (testnet && mainnetOf) { try { main = mainnetOf(address); } catch { main = null; } }
  box.append(line(testnet ? 'Testnet address · what the casino plays with' : 'Address', address));
  if (main && main !== address) box.append(line('Mainnet address (same key) · send BNS names here', main));
  return box;
}

/** A real Stacks address (the room's people are keyed by address; house regulars are not). */
export const isAddress = (a: unknown): a is string => typeof a === 'string' && /^S[PTMN][0-9A-Z]{37,41}$/.test(a);
