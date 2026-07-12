/**
 * Monotonic selection guard for cancelling stale async work.
 *
 * File selection in the mint flow awaits `arrayBuffer()` (and a stored-attempt
 * lookup) with no cancellation. If a user picks file A then file B before A's
 * read resolves, A's continuation could clobber B's committed state. Each call
 * to {@link SelectionGuard.begin} invalidates any previously begun selection;
 * the returned `isCurrent()` checker returns false once a newer selection has
 * begun, so callers can bail after every `await`.
 */
export interface SelectionGuard {
  /**
   * Begin a new selection, invalidating any in-flight one. Returns a checker
   * that reports whether this selection is still the most recent.
   */
  begin: () => () => boolean;
}

export const createSelectionGuard = (): SelectionGuard => {
  let token = 0;
  return {
    begin: () => {
      const mine = ++token;
      return () => mine === token;
    }
  };
};
