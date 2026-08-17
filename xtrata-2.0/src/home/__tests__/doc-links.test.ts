import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Every GitHub link we publish must point at `main`.
 *
 * The homepage's Developers section shipped for months with 15 of its 16 doc
 * links pointing at `OPTIMISATIONS` — a feature branch — and the "Docs index"
 * button pointing at `main-staging`. Both resolved, so nothing looked wrong.
 * Both were one branch deletion or one force-push away from taking the entire
 * Developers section down, permanently and silently.
 *
 * A branch that is not `main` is not a promise. `main` is the only ref we do not
 * rewrite, delete or rebase, so it is the only one a public link may name.
 *
 * This checks the SHIPPED surfaces only. Archived copies under xtrata-1.0/,
 * Huge-Sphinx/ and Audionals/ are deliberately excluded: those are historical
 * records and dated research citations, and rewriting a citation's URL would
 * falsify what was read on the date it claims.
 */

const ROOT = resolve(__dirname, '../../..');

/**
 * Surfaces a reader can actually reach from the live site.
 *
 * `src` is in here because the first version of this guard omitted it, and two
 * React surfaces (PublicApp.tsx, SimplePublicHome.tsx) were still carrying
 * OPTIMISATIONS links that the sweep therefore missed. A guard that only checks
 * markup and markdown does not cover a site whose links are rendered from code.
 */
const SHIPPED = ['index.html', 'XTRATA_AGENT_SKILL.md', 'docs', 'flowproof', 'src'];

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.cache']);
const READ_EXT = /\.(html|md|ts|tsx|js|mjs|json)$/;

const walk = (path: string, out: string[] = []): string[] => {
  const stat = statSync(path, { throwIfNoEntry: false });
  if (!stat) return out;
  if (stat.isFile()) {
    if (READ_EXT.test(path)) out.push(path);
    return out;
  }
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    walk(join(path, entry), out);
  }
  return out;
};

const files = SHIPPED.flatMap((target) => walk(resolve(ROOT, target)));

/**
 * `…/blob/<ref>/…` AND `…/tree/<ref>/…` — capture the ref and where it was found.
 *
 * `tree` matters: a directory link is just as public and just as breakable as a
 * file link, and the first sweep of this cleanup missed four of them by pattern
 * matching on `blob` alone.
 */
const REPO_REF = /github\.com\/stxtrata\/xtrata\/(blob|tree)\/([A-Za-z0-9._-]+)\//g;

const links = files.flatMap((file) => {
  const text = readFileSync(file, 'utf8');
  return [...text.matchAll(REPO_REF)].map((m) => ({
    // Reported back verbatim: a failure that says "blob/" about a tree link
    // sends the reader searching for a string that is not in the file.
    kind: m[1],
    ref: m[2],
    file: relative(ROOT, file)
  }));
});

describe('published GitHub doc links', () => {
  it('finds links to check, so a silent zero cannot pass this suite', () => {
    expect(files.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('every published link points at main', () => {
    const strays = links.filter((l) => l.ref !== 'main');
    // Name the offenders: "expected 3 to be 0" would send someone hunting.
    const detail = strays.map((l) => `${l.file} → ${l.kind}/${l.ref}/`).join('\n  ');
    expect(strays.length, strays.length ? `non-main doc links:\n  ${detail}` : '').toBe(0);
  });

  it('names the two refs that caused this, so they cannot come back quietly', () => {
    const refs = new Set(links.map((l) => l.ref));
    expect(refs.has('OPTIMISATIONS')).toBe(false);
    expect(refs.has('main-staging')).toBe(false);
  });
});
