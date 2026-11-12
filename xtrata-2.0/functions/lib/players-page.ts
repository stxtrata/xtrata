/**
 * The free-player giveaway page (/players) is the giveaway page (public/giveaway.html) pointed at its own list.
 * This turns that page's HTML into the players page: its own title, description and link for search and for the
 * card shown when the address is shared, and a mark on <html> that tells the page's script which list to read.
 * Text only, no parsing: each change must find its place exactly once, so an edit to the page that moves one of
 * them fails the test rather than quietly shipping the album wording at /players.
 */
export const PLAYERS_URL = 'https://xtrata.xyz/players';
const TITLE = '1,000 Free Music Players · Xtrata Music';
const DESCRIPTION = '1,000 free music players, each loaded with paid plays: from 50 up to 1,000. One goes live at a time and one person gets it. No account, no app, nothing to buy.';
const SHORT = '1,000 free music players, loaded with paid plays. One goes live at a time. Be quick.';

const SWAPS: [RegExp, string][] = [
  [/<html lang="en">/, '<html lang="en" data-list="players">'],
  [/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`],
  [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${DESCRIPTION}" />`],
  [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${PLAYERS_URL}" />`],
  [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${TITLE}" />`],
  [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${SHORT}" />`],
  [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${PLAYERS_URL}" />`]
];

/** The players page, or null if the giveaway page no longer has every place this needs (the caller then serves it unchanged). */
export function playersPage(html: string): string | null {
  let out = html;
  for (const [find, put] of SWAPS) {
    if ((out.match(new RegExp(find.source, 'g')) ?? []).length !== 1) return null;
    out = out.replace(find, () => put);
  }
  return out;
}
