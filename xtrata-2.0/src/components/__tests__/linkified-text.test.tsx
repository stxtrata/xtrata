// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import LinkifiedText, { splitLinks } from '../LinkifiedText';

afterEach(cleanup);

describe('description links', () => {
  it('makes https links clickable and keeps surrounding text', () => {
    const { container } = render(<p><LinkifiedText text={'Hear the original on Bitcoin: https://ordinals.com/inscription/95768432\nNext line.'} /></p>);
    const link = container.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://ordinals.com/inscription/95768432');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
    expect(container.textContent).toBe('Hear the original on Bitcoin: https://ordinals.com/inscription/95768432\nNext line.');
  });

  it('leaves trailing punctuation out of the link', () => {
    expect(splitLinks('See https://xtrata.xyz/i/3060.')).toEqual([
      { text: 'See ' }, { text: 'https://xtrata.xyz/i/3060', href: 'https://xtrata.xyz/i/3060' }, { text: '.' }
    ]);
  });

  it('never links other schemes or renders markup', () => {
    const { container } = render(<p><LinkifiedText text={'javascript:alert(1) http://plain.example <b>x</b>'} /></p>);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
  });
});
