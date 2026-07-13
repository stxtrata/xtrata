import { describe, expect, it } from 'vitest';
import {
  isWizardShellRequest,
  WIZARD_EMBED_ROUTE,
  WIZARD_SHELL_ROUTE
} from '../page-mode.js';

describe('homepage page modes', () => {
  it('recognises the Wizard shell route without taking over normal inscription links', () => {
    expect(isWizardShellRequest('/inscribe', '?wizard=1')).toBe(true);
    expect(isWizardShellRequest('/inscribe', new URLSearchParams('wizard=1'))).toBe(true);
    expect(isWizardShellRequest('/inscribe', '?wizard=0')).toBe(false);
    expect(isWizardShellRequest('/inscribe', '')).toBe(false);
    expect(isWizardShellRequest('/wizard/', '?embed=1')).toBe(false);
  });

  it('keeps the shell and embedded Wizard routes distinct', () => {
    expect(WIZARD_SHELL_ROUTE).toBe('/inscribe?wizard=1');
    expect(WIZARD_EMBED_ROUTE).toBe('/wizard/?embed=1');
  });
});
