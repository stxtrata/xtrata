// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CollectionStudioNav, { STUDIO_TASKS } from '../CollectionStudioNav';
afterEach(cleanup);
describe('collection studio navigation', () => {
  it('opens each setup task only on an explicit click', () => {
    const onSelect = vi.fn();
    render(<CollectionStudioNav collectionName="Numbers" fileCount={10} state="draft" onSelect={onSelect} />);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText('draft · 10 active files')).toBeTruthy();
    for (const task of STUDIO_TASKS) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(task.title.replace('&', '&')) }));
      expect(onSelect).toHaveBeenLastCalledWith(task.id);
    }
    expect(onSelect).toHaveBeenCalledTimes(9);
  });
  it('offers a clear starting point without a selected collection', () => {
    render(<CollectionStudioNav collectionName="" fileCount={0} state="" onSelect={vi.fn()} />);
    expect(screen.getByText('Start a new collection')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Collection setup tasks' })).toBeTruthy();
  });
});
