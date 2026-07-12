import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TEXT_MIME,
  TEXT_MIME_PRESETS,
  defaultTextFileName
} from '../constants';

describe('text mime presets', () => {
  it('exposes the four supported presets', () => {
    expect(TEXT_MIME_PRESETS.map((p) => p.mime)).toEqual([
      'text/plain',
      'application/json',
      'text/markdown',
      'text/html'
    ]);
  });

  it('defaults to text/plain', () => {
    expect(DEFAULT_TEXT_MIME).toBe('text/plain');
  });

  it('derives a sensible filename+extension for each preset', () => {
    expect(defaultTextFileName('text/plain')).toBe('inscription.txt');
    expect(defaultTextFileName('application/json')).toBe('inscription.json');
    expect(defaultTextFileName('text/markdown')).toBe('inscription.md');
    expect(defaultTextFileName('text/html')).toBe('inscription.html');
  });

  it('falls back to .txt for an unknown mime', () => {
    expect(defaultTextFileName('application/octet-stream')).toBe(
      'inscription.txt'
    );
  });

  it('builds a File carrying the pasted text and chosen mime', () => {
    const text = '{"hello":"world"}';
    const file = new File([text], defaultTextFileName('application/json'), {
      type: 'application/json'
    });
    expect(file.name).toBe('inscription.json');
    expect(file.type).toBe('application/json');
    expect(file.size).toBe(new TextEncoder().encode(text).length);
  });
});
