export const MAX_COVER_BYTES: number;
export function readSongMetadata(source: string): Record<string, unknown> | null;
export function extractSongFromHtml(
  html: string
): { title: string; artist: string; cover: Uint8Array | null; coverRef: { tokenId: number; contractId: string | null } | null } | null;
export function findCoverReference(source: string): { tokenId: number; contractId: string | null } | null;
