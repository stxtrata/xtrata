// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import LinkifiedText, { splitLinks, stripFormatting } from '../LinkifiedText';

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

describe('description formatting', () => {
  const AUDIONAUTS = '**Two layers. One signal. 111 explorers.**\n\nTap one: **Inscription 95768432, “Opus of Efficiency”**, a song.\n\n**Hear the original on Bitcoin:**  \nhttps://ordinals.com/inscription/95768432\n\nA rare few carry **two stars**.';

  it('renders **bold** as <strong> and keeps links clickable', () => {
    const { container } = render(<p><LinkifiedText text={AUDIONAUTS} /></p>);
    const bold = [...container.querySelectorAll('strong')].map((node) => node.textContent);
    expect(bold).toEqual([
      'Two layers. One signal. 111 explorers.',
      'Inscription 95768432, “Opus of Efficiency”',
      'Hear the original on Bitcoin:',
      'two stars'
    ]);
    expect(container.querySelector('a')!.getAttribute('href')).toBe('https://ordinals.com/inscription/95768432');
    expect(container.textContent).not.toContain('*');
  });

  it('supports *italic*, ***bold italic*** and italic inside bold', () => {
    const { container } = render(<p><LinkifiedText text={'*soft* ***loud*** **Two *layers* here**'} /></p>);
    expect([...container.querySelectorAll('em')].map((n) => n.textContent)).toEqual(['soft', 'loud', 'layers']);
    expect([...container.querySelectorAll('strong')].map((n) => n.textContent)).toEqual(['loud', 'Two ', 'layers', ' here']);
  });

  it('leaves stray or spaced asterisks literal and never crosses lines', () => {
    const text = '5 * 3 = 15, ** not bold **, **open\nclose**';
    const { container } = render(<p><LinkifiedText text={text} /></p>);
    expect(container.querySelector('strong, em')).toBeNull();
    expect(container.textContent).toBe(text);
  });

  it('bold links still link, and markup is never rendered', () => {
    const { container } = render(<p><LinkifiedText text={'**https://xtrata.xyz** **<b>x</b>**'} /></p>);
    expect(container.querySelector('strong a')!.getAttribute('href')).toBe('https://xtrata.xyz/');
    expect(container.querySelector('b')).toBeNull();
  });

  it('stripFormatting gives plain text for cards', () => {
    expect(stripFormatting('**Two layers.** One *signal*.')).toBe('Two layers. One signal.');
  });
});
