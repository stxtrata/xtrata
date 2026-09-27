import { Fragment, type ReactNode } from 'react';

// Only https:// links are made clickable. Everything is rendered as React
// text/elements (never HTML), so a description cannot inject markup or scripts.
const URL_PATTERN = /https:\/\/[^\s<>"']+/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

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

export default function LinkifiedText({ text }: { text: string }): ReactNode {
  return (
    <>
      {splitLinks(text).map((part, index) =>
        part.href ? (
          <a key={index} href={part.href} target="_blank" rel="noopener noreferrer nofollow">
            {part.text}
          </a>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        )
      )}
    </>
  );
}
