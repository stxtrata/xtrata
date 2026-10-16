export declare const HIDDEN_TRACK_MARKER: string;
export declare const HIDDEN_TRAILER_BYTES: number;
export declare const MEDIA_HEAD_BYTES: number;
export declare function hiddenTrackRange(tail: Uint8Array, total: number): { start: number; end: number } | null;
export declare function audioMime(head: Uint8Array): string;
export declare function webmCodecs(head: Uint8Array): string[];
export declare function webmAudioOnly(head: Uint8Array): boolean;
export declare function linkedAudioId(html: string): number | null;
export declare function linkedImageId(html: string): number | null;
