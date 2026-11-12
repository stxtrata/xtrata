export const ARTIST_CREDITS: Readonly<Record<string, string>>;
export function radioArtist(id: number | string, fallback?: string): string;
export const EXPLICIT_SONGS: readonly number[];
export function isExplicitSong(id: number | string): boolean;
export function radioTitle(id: number | string, fallback?: string): string;
