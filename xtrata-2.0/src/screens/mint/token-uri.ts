/**
 * Token-URI resolution for the mint flow.
 *
 * Historically the mint screen pre-filled an opaque default metadata URL into
 * the token-URI field and silently substituted it whenever the field was left
 * blank — so an inscription could be built with Xtrata's default metadata that
 * the user never knowingly chose. This resolver makes the choice explicit:
 * the default is only ever used when the caller has affirmatively selected it,
 * and a blank custom URI is an error rather than a silent fallback.
 */
export type TokenUriChoice = 'default' | 'custom';

export interface ResolveTokenUriParams {
  /** Restriction-forced URI (host embedding); always wins when present. */
  fixedTokenUri?: string;
  /** The user's explicit choice. */
  choice: TokenUriChoice;
  /** The custom URI the user typed (only used when choice === 'custom'). */
  customValue: string;
  /** Xtrata's shared default metadata URI. */
  defaultTokenUri: string;
}

export type ResolveTokenUriResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export const TOKEN_URI_REQUIRED_ERROR =
  'Enter a metadata URI, or choose "Use Xtrata default metadata".';

export const resolveMintTokenUri = ({
  fixedTokenUri,
  choice,
  customValue,
  defaultTokenUri
}: ResolveTokenUriParams): ResolveTokenUriResult => {
  if (fixedTokenUri) {
    return { ok: true, value: fixedTokenUri };
  }
  if (choice === 'default') {
    return { ok: true, value: defaultTokenUri };
  }
  const trimmed = customValue.trim();
  if (!trimmed) {
    return { ok: false, error: TOKEN_URI_REQUIRED_ERROR };
  }
  return { ok: true, value: trimmed };
};
