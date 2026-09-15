/** Disclosure state is kept in memory; opening navigation never runs a contract action. */
export function createCanaryNavigation() {
  const openSections = new Map<string, boolean>();
  const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const remember = (app: HTMLElement) => {
    app.querySelectorAll<HTMLDetailsElement>('details[id]').forEach(d => openSections.set(d.id, d.open));
  };
  const reveal = (app: HTMLElement, hash: string, scroll = true) => {
    const id = hash.replace(/^#/, '');
    const target = [...app.querySelectorAll<HTMLElement>('[id]')].find(n => n.id === id);
    if (!target) return;
    let parent: HTMLElement | null = target;
    while (parent && parent !== app) {
      if (parent instanceof HTMLDetailsElement) { parent.open = true; openSections.set(parent.id, true); }
      parent = parent.parentElement;
    }
    const child = target.querySelector<HTMLDetailsElement>(':scope > details');
    if (child) { child.open = true; openSections.set(child.id, true); }
    if (scroll) target.scrollIntoView?.({ block: 'start' });
  };
  const apply = (app: HTMLElement) => {
    const nav = document.createElement('nav'); nav.className = 'canary-index card'; nav.setAttribute('aria-label', 'Canary sections');
    const title = document.createElement('h2'); title.textContent = 'Quick access'; nav.append(title);
    const links = document.createElement('div'); links.className = 'canary-index-links'; nav.append(links);
    const wrap = (container: HTMLElement, id: string) => {
      const heading = container.querySelector<HTMLElement>(':scope > h2, :scope > .gate-heading');
      if (!heading) return;
      const d = document.createElement('details'); d.id = id; d.className = 'canary-section';
      const summary = document.createElement('summary'); summary.append(heading);
      d.append(summary, ...Array.from(container.childNodes)); container.append(d);
    };
    [...app.children].forEach((container, i) => {
      if (!(container instanceof HTMLElement)) return;
      const heading = container.querySelector('h2'); if (!heading) return;
      const title = heading.textContent || `Section ${i + 1}`;
      container.id ||= `canary-${slug(title)}`;
      container.querySelectorAll<HTMLElement>('.gate-step').forEach((step, n) => wrap(step, `${container.id}-step-${n + 1}`));
      // Logs remain available without making long event histories dominate each card.
      const logHeading = container.querySelector<HTMLElement>(':scope > .log-title');
      if (logHeading) {
        const log = document.createElement('div');
        while (logHeading.nextSibling) log.append(logHeading.nextSibling);
        log.prepend(logHeading); container.append(log); wrap(log, `${container.id}-log`);
      }
      wrap(container, `${container.id}-panel`);
      const link = document.createElement('a'); link.href = `#${container.id}`; link.textContent = title;
      link.onclick = () => reveal(app, link.hash); links.append(link);
    });
    app.querySelectorAll<HTMLDetailsElement>('details').forEach((d, i) => {
      d.id ||= `canary-detail-${slug(d.querySelector(':scope > summary')?.textContent || String(i))}`;
      if (openSections.has(d.id)) d.open = openSections.get(d.id)!;
    });
    const controls = document.createElement('div'); controls.className = 'row';
    for (const [label, open] of [['Expand all', true], ['Collapse all', false]] as const) {
      const button = document.createElement('button'); button.className = 'ghost'; button.textContent = label;
      button.onclick = () => app.querySelectorAll<HTMLDetailsElement>('details').forEach(d => { d.open = open; openSections.set(d.id, open); });
      controls.append(button);
    }
    nav.append(controls); app.prepend(nav);
    // Follow a deep link on first render, but respect later manual collapsing.
    if (!openSections.size) reveal(app, window.location.hash, false);
  };
  return { remember, apply, reveal };
}
