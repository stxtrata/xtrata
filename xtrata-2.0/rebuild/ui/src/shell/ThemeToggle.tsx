import { useCallback, useEffect, useState } from 'react';

/**
 * Theme follows `prefers-color-scheme` by default. The toggle writes an
 * explicit `data-theme` on <html> (persisted) so a person can override the OS
 * choice; "system" clears it and hands control back to the media query.
 */

export type ThemeChoice = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'xtrata.v3.theme';

const readStored = (): ThemeChoice => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
};

export const applyTheme = (choice: ThemeChoice): void => {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
};

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: 'light',
  light: 'dark',
  dark: 'system'
};

const LABEL: Record<ThemeChoice, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme'
};

export const ThemeToggle = (): JSX.Element => {
  const [choice, setChoice] = useState<ThemeChoice>('system');

  useEffect(() => {
    const stored = readStored();
    setChoice(stored);
    applyTheme(stored);
  }, []);

  const cycle = useCallback(() => {
    setChoice((current) => {
      const next = NEXT[current];
      applyTheme(next);
      try {
        if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage disabled — the in-memory choice still applies */
      }
      return next;
    });
  }, []);

  return (
    <button type="button" className="btn btn--sm" onClick={cycle} aria-label={LABEL[choice]}>
      {choice === 'dark' ? '◐' : choice === 'light' ? '○' : '◑'}
      <span className="visually-hidden">{LABEL[choice]}</span>
    </button>
  );
};
