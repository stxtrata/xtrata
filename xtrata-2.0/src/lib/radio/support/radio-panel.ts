import { mountSupportPanel } from './panel';
import type { ReadOnlyCompanion } from './protocol';

export function attachRadioSupport(doc: Document, companion?: ReadOnlyCompanion) {
  if (doc.defaultView?.top !== doc.defaultView || doc.documentElement.dataset.radioEmbed === 'true') return;
  if (doc.querySelector('[data-radio-support]')) return;
  const shell = doc.createElement('details'); shell.dataset.radioSupport = 'true';
  const heading = doc.createElement('summary'); heading.textContent = 'Support as you listen · preview';
  const host = doc.createElement('div'); shell.append(heading,host);
  shell.style.cssText='box-sizing:border-box;width:100%;max-width:650px;padding:12px;border:1px solid #44616d;border-radius:8px;overflow-wrap:anywhere;background:#091118;color:#edf5f5';
  const station = doc.querySelector('#stage .col-station');
  const home = doc.querySelector('#registryIntro');
  if (station) station.append(shell);
  else if (home) home.insertAdjacentElement('afterend',shell);
  else (doc.querySelector('main') || doc.body).append(shell);
  // The read-only panel stays inert until deliberately expanded.
  let panel: ReturnType<typeof mountSupportPanel> | undefined;
  shell.ontoggle=()=>{if(shell.open&&!panel) panel=mountSupportPanel(host,companion);};
  const cleanup=()=>{panel?.dispose();shell.remove();};
  doc.defaultView?.addEventListener('pagehide',cleanup,{once:true});
  return cleanup;
}
