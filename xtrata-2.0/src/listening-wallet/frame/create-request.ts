/**
 * The request carried to https://wallet.xtrata.xyz/create in the URL fragment (never sent to a server). Everything
 * in it is public: the new passkey's user id (16 random bytes the frame will look for on sign-in), its display
 * name, and the credentials it must not duplicate. Anything that does not match these exact shapes is refused, so
 * the page can never be made to show arbitrary text or create a passkey under another name.
 */
export interface CreateRequest {
  userId: string;
  name: string;
  exclude: string[];
}

const USER_ID = /^[A-Za-z0-9_-]{22}$/;
const NAME = /^Xtrata listening wallet( · S[PM][0-9A-Z]{4}…[0-9A-Z]{4})? · [A-Z0-9]{4}$/;
const CREDENTIAL = /^[A-Za-z0-9_-]{16,1400}$/;
export const MAX_EXCLUDE = 25;

export function parseCreateRequest(hash: string): CreateRequest | null {
  const p = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const userId = p.get('u') ?? '';
  const name = p.get('n') ?? '';
  const exclude = (p.get('x') ?? '').split(',').filter(Boolean);
  if (!USER_ID.test(userId) || !NAME.test(name)) return null;
  if (exclude.length > MAX_EXCLUDE || !exclude.every((id) => CREDENTIAL.test(id))) return null;
  return { userId, name, exclude };
}
