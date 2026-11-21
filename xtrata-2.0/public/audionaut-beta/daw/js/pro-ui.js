export function el(tag, text, attrs = {}) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') node.className = value;
    else if (key === 'value') node.value = value;
    else if (value !== false && value != null) node.setAttribute(key, value === true ? '' : String(value));
  }
  return node;
}
export function status(text, error = false) {
  const node = document.querySelector('#status-text');
  if (node) { node.textContent = text; node.classList.toggle('error', error); }
}
export function action(label, fn, attrs = {}) {
  const node = el('button', label, { type: 'button', ...attrs });
  node.addEventListener('click', async () => {
    try { await fn(node); } catch (error) { status(error.message, true); }
  });
  return node;
}
export function field(label, control) {
  const node = el('label', null, { className: 'pro-field' });
  node.append(el('span', label), control);
  control.setAttribute('aria-label', label);
  return node;
}
export function number(label, value, onChange, { min = 0, max = 1e6, step = .25 } = {}) {
  const input = el('input', null, { type: 'number', min, max, step, value });
  input.addEventListener('change', () => {
    const v = Number(input.value);
    if (!Number.isFinite(v)) return;
    input.value = Math.max(min, Math.min(max, v));
    try { onChange(Number(input.value)); } catch (error) { status(error.message, true); }
  });
  return field(label, input);
}
export function choice(label, values, current, onChange) {
  const select = el('select');
  for (const item of values) {
    const [value, text] = Array.isArray(item) ? item : [item, item];
    select.append(el('option', text, { value }));
  }
  select.value = current;
  select.addEventListener('change', () => { try { onChange(select.value); } catch (e) { status(e.message, true); } });
  return field(label, select);
}
export function toggle(label, checked, onChange) {
  const input = el('input', null, { type: 'checkbox' }); input.checked = !!checked;
  input.addEventListener('change', () => { try { onChange(input.checked); } catch (e) { status(e.message, true); } });
  return field(label, input);
}
export function textField(label, value, onChange) {
  const input = el('input', null, { type: 'text', value });
  input.addEventListener('change', () => { try { onChange(input.value); } catch (e) { status(e.message, true); } });
  return field(label, input);
}
export function row(...children) { const node = el('div', null, { className: 'pro-row' }); node.append(...children); return node; }
export const uid = () => crypto.randomUUID();
export const tracks = store => [...store.project.channels, ...store.project.instruments];
export const db = value => value > 0 ? 20 * Math.log10(value) : -90;
export const gain = value => value <= -90 ? 0 : 10 ** (value / 20);
export function bindRefresh(store, refresh, events = ['load', 'channels', 'instruments', 'timeline', 'automation', 'project']) {
  let pending = 0;
  const queue = () => { if (!pending) pending = requestAnimationFrame(() => { pending = 0; refresh(); }); };
  const offs = events.map(event => store.on(event, queue));
  return () => { cancelAnimationFrame(pending); for (const off of offs) off(); };
}
