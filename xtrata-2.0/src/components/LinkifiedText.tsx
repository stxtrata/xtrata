import { Fragment, type ReactNode } from 'react';

// Collection descriptions support a tiny, safe subset of formatting:
//   **bold**   *italic*   ***bold italic***   and https:// links.
// Everything is rendered as React text/elements (never HTML), so a description
// cannot inject markup or scripts. Markers only apply within one line and must
// hug the text (`** not bold **` stays literal), so stray asterisks are harmless.
const URL_PATTERN = /https:\/\/[^\s<>"']+/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;
const EMPHASIS_PATTERN =
  /\*\*\*(?=\S)([^\n]*?\S)\*\*\*|\*\*(?=\S)([^\n]*?\S)\*\*|\*(?=[^\s*])([^\n*]*?[^\s*])\*/g;

export const splitLinks = (text: string): Array<{ text: string; href?: string }> => {
  const parts: Array<{ text: string; href?: string }> = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    let candidate = match[0];
    const trailing = candidate.match(TRAILING_PUNCTUATION)?.[0] ?? '';
    candidate = candidate.slice(0, candidate.length - trailing.length);
    let href: string | null = null;
    try {
      const parsed = new URL(candidate);
      href = parsed.protocol === 'https:' && parsed.hostname ? parsed.href : null;
    } catch {
      href = null;
    }
    if (!href) {
      continue;
    }
    if (start > last) {
      parts.push({ text: text.slice(last, start) });
    }
    parts.push({ text: candidate, href });
    last = start + candidate.length;
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last) });
  }
  return parts;
};

export type FormattedSegment = { text: string; bold?: boolean; italic?: boolean };

export const splitFormatting = (text: string): FormattedSegment[] => {
  const parts: FormattedSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(EMPHASIS_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) {
      parts.push({ text: text.slice(last, start) });
    }
    if (match[1] !== undefined) {
      parts.push({ text: match[1], bold: true, italic: true });
    } else if (match[2] !== undefined) {
      // Italic inside bold: **Two *layers*. One signal.**
      for (const inner of splitFormatting(match[2])) {
        parts.push({ text: inner.text, bold: true, italic: inner.italic });
      }
    } else {
      parts.push({ text: match[3], italic: true });
    }
    last = start + match[0].length;
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last) });
  }
  return parts;
};

/** Plain text with formatting markers removed, for cards, previews and metadata. */
export const stripFormatting = (text: string) =>
  splitFormatting(text)
    .map((part) => part.text)
    .join('');

const renderLinks = (text: string, keyPrefix: string) =>
  splitLinks(text).map((part, index) =>
    part.href ? (
      <a
        key={`${keyPrefix}-${index}`}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {part.text}
      </a>
    ) : (
      <Fragment key={`${keyPrefix}-${index}`}>{part.text}</Fragment>
    )
  );

export default function LinkifiedText({ text }: { text: string }): ReactNode {
  return (
    <>
      {splitFormatting(text).map((segment, index) => {
        let content: ReactNode = renderLinks(segment.text, String(index));
        if (segment.italic) {
          content = <em>{content}</em>;
        }
        if (segment.bold) {
          content = <strong>{content}</strong>;
        }
        return <Fragment key={index}>{content}</Fragment>;
      })}
    </>
  );
}
