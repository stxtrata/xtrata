// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { createCanaryNavigation } from '../canary-navigation';
describe('canary navigation', () => {
  const fixture = () => { const app = document.createElement('div'); app.innerHTML = '<div class="card" id="collection-v15-deployment"><h2>Collection mint</h2><button>Deploy</button><div class="gate-step"><h2>Checks</h2><p>Evidence</p></div><h2 class="log-title">Deployment log</h2><pre>Events</pre></div>'; return app; };
  it('collapses sections and opens a linked card without running its actions', () => {
    const app = fixture(); const nav = createCanaryNavigation(); let calls = 0;
    app.querySelector('button')!.onclick = () => { calls++; };
    nav.apply(app);
    expect(app.querySelectorAll('details')).toHaveLength(3);
    expect(app.querySelector('details')!.open).toBe(false);
    app.querySelector('a')!.click();
    expect(app.querySelector('details')!.open).toBe(true);
    expect(calls).toBe(0);
  });
  it('preserves expanded state through renders and opens deep-link ancestors', () => {
    const nav = createCanaryNavigation(); const app = fixture(); nav.apply(app);
    nav.reveal(app, '#collection-v15-deployment-step-1', false);
    expect([...app.querySelectorAll('details')].filter(d => d.open)).toHaveLength(2);
    nav.remember(app); const next = fixture(); nav.apply(next);
    expect([...next.querySelectorAll('details')].filter(d => d.open)).toHaveLength(2);
    [...next.querySelectorAll('button')].find(b => b.textContent === 'Collapse all')!.click();
    expect([...next.querySelectorAll('details')].every(d => !d.open)).toBe(true);
  });
});
