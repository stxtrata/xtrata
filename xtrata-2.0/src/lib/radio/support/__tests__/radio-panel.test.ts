// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest';
import { attachRadioSupport } from '../radio-panel';
import { fakeCompanion } from '../fake';
afterEach(()=>{document.body.replaceChildren(); delete document.documentElement.dataset.radioEmbed;});
it.each(['<main></main>','<section id="registryIntro"></section><main hidden></main>','<main id="stage"><div class="col-station"></div></main>'])('attaches once without requesting status until opened: %s', async html=>{
  document.body.innerHTML=html;
  const bridge=fakeCompanion(); const status=vi.spyOn(bridge,'status');
  const dispose=attachRadioSupport(document,bridge); attachRadioSupport(document,bridge);
  expect(document.querySelectorAll('[data-radio-support]')).toHaveLength(1);
  expect(status).not.toHaveBeenCalled();
  expect(document.querySelector('main[hidden] [data-radio-support]')).toBeNull();
  const shell=document.querySelector('details')!; shell.open=true; shell.dispatchEvent(new Event('toggle'));
  for(let i=0;i<12;i++) await Promise.resolve();
  expect(status).toHaveBeenCalledTimes(1); dispose?.();
});
it('excludes embed pages',()=>{
  document.documentElement.dataset.radioEmbed='true';
  expect(attachRadioSupport(document)).toBeUndefined(); expect(document.body.children.length).toBe(0);
});
