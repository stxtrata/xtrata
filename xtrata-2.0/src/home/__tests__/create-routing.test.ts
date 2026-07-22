import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  STANDARD_CREATE_MAX_BYTES,
  classifyCreateFiles
} from '../../lib/create-routing.js';

const file = (size: number, name = 'work.bin') =>
  new File([new Uint8Array(size)], name, { type: 'application/octet-stream' });

describe('create routing', () => {
  it('keeps one file at or below 512 KB in standard Create', () => {
    expect(classifyCreateFiles([file(1)]).destination).toBe('create');
    expect(classifyCreateFiles([file(STANDARD_CREATE_MAX_BYTES)]).destination).toBe('create');
  });

  it('sends a file larger than 512 KB to Wizard', () => {
    expect(classifyCreateFiles([file(STANDARD_CREATE_MAX_BYTES + 1)])).toMatchObject({
      destination: 'wizard',
      reason: 'large'
    });
  });

  it('sends multiple files to Wizard regardless of their individual sizes', () => {
    expect(classifyCreateFiles([file(1, 'a'), file(1, 'b')])).toMatchObject({
      destination: 'wizard',
      reason: 'multiple'
    });
  });

  it('sends folder drops to Wizard', () => {
    expect(classifyCreateFiles([file(1)], { containsDirectory: true })).toMatchObject({
      destination: 'wizard',
      reason: 'folder'
    });
  });
});

describe('create routing integration', () => {
  it('sends bounty calls to action to Create and shares the automatic drop router', () => {
    const html = readFileSync(
      new URL('../../../proofzero/index.html', import.meta.url),
      'utf8'
    );
    expect(html).toContain('data-create-link');
    expect(html).not.toContain('data-wizard-link');
    expect(html).toContain('src="/create-routing.js"');
    expect(html).toContain('continueWithSelection');
  });

  it('wires both Create and Wizard to the shared handoff', () => {
    const createSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
    const wizardHtml = readFileSync(
      new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url),
      'utf8'
    );
    expect(createSource).toContain('routeCreateSelection');
    expect(createSource).toContain('takeCreateHandoff');
    expect(wizardHtml).toContain('XtrataWizardImportFiles');
    expect(wizardHtml).toContain('takeCreateHandoff');
  });
});
