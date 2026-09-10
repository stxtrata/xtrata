/** A single tab stop navigates every square, including a read-only replay. */
export function wireBoardKeyboard(root: HTMLElement, restore: string | null, hadFocus: boolean): void {
  const cells = [...root.querySelectorAll<HTMLButtonElement>('[data-square]')];
  root.tabIndex = 0;
  root.setAttribute('aria-rowcount', '8');
  root.setAttribute('aria-colcount', '8');
  const select = (cell: HTMLButtonElement): void => {
    for (const other of cells) other.classList.toggle('sq--focus', other === cell);
    root.dataset.focusSquare = cell.dataset.square;
    root.setAttribute('aria-activedescendant', cell.id);
  };
  cells.forEach((cell, i) => {
    cell.id = `${root.id || 'chess'}-square-${cell.dataset.square}`;
    cell.tabIndex = -1;
    cell.setAttribute('aria-rowindex', String(Math.floor(i / 8) + 1));
    cell.setAttribute('aria-colindex', String(i % 8 + 1));
  });
  const initial = cells.find(c => c.dataset.square === restore) ?? cells.find(c => !c.disabled) ?? cells[0];
  if (initial) select(initial);
  root.onkeydown = event => {
    const at = cells.findIndex(c => c.dataset.square === root.dataset.focusSquare);
    if (at < 0) return;
    let next = at;
    if (event.key === 'ArrowLeft') next = at % 8 ? at - 1 : at;
    else if (event.key === 'ArrowRight') next = at % 8 < 7 ? at + 1 : at;
    else if (event.key === 'ArrowUp') next = Math.max(at - 8, at % 8);
    else if (event.key === 'ArrowDown') next = Math.min(at + 8, 56 + at % 8);
    else if (event.key === 'Home') next = event.ctrlKey ? 0 : at - at % 8;
    else if (event.key === 'End') next = event.ctrlKey ? 63 : at - at % 8 + 7;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); event.stopPropagation();
      if (!cells[at].disabled) cells[at].click();
      return;
    } else return;
    event.preventDefault(); event.stopPropagation();
    select(cells[next]); root.focus({preventScroll: true});
  };
  if (hadFocus) root.focus({preventScroll: true});
}
