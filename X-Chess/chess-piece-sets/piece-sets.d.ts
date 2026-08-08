/** Types for piece-sets.js. Hand-written; keep in step with the module. */

export type PieceKey = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type PieceColor = 'white' | 'black';

export type SetId =
  | 'minimal'
  | 'staunton'
  | 'rounded'
  | 'lineart'
  | 'gothic'
  | 'bauhaus'
  | 'pixel'
  | 'deco'
  | 'scifi'
  | 'realistic';

/**
 * The role a path plays, which decides how it is coloured.
 *
 *  xb  body, inherits fill and stroke from the host `<svg>`
 *  xd  detail knocked out of the body, painted with --xcp-detail
 *  xs  detail drawn as a line, stroked with --xcp-detail
 *  xg  body filled by the turned set's gradient
 *  xh  specular highlight, painted with --xcp-spec
 */
export type ShapeRole = 'xb' | 'xd' | 'xs' | 'xg' | 'xh';

export interface ChessPieceSet {
  /** Human-readable name, for a picker. */
  name: string;
  /** One line on what makes this set itself. */
  note: string;
  strokeWidth: number;
  linejoin?: 'round' | 'miter' | 'bevel';
  linecap?: 'round' | 'butt' | 'square';
  /** Extra `<defs>` content the set needs, currently gradients only. */
  defs?: string;
  /** True when the set needs a symbol per colour rather than per piece. */
  perColor?: boolean;
  pieces: Record<PieceKey, ReadonlyArray<readonly [ShapeRole, string]>>;
}

export interface RenderOptions {
  /** Explicit width/height attributes. Omit to let CSS size the piece. */
  size?: number;
  /** Appended to the generated class list. */
  className?: string;
  /** Symbol id prefix, matching the one given to `spriteDefs`. */
  idPrefix?: string;
}

export interface PieceTheme {
  fill?: string;
  line?: string;
  detail?: string;
  spec?: string;
}

export declare const SETS: Record<SetId, ChessPieceSet>;
export declare const SET_IDS: SetId[];
export declare const PIECE_KEYS: PieceKey[];
export declare const PIECE_NAMES: Record<PieceKey, string>;
export declare const KEY_BY_TYPE: Record<number, PieceKey>;
export declare const THEMES: Record<PieceColor, Required<PieceTheme>>;

export declare function pieceMarkup(setId: SetId, key: PieceKey, color?: PieceColor): string;
export declare function pieceSVG(setId: SetId, key: PieceKey, color?: PieceColor, opts?: RenderOptions): string;
export declare function pieceUse(setId: SetId, key: PieceKey, color?: PieceColor, opts?: RenderOptions): string;
export declare function spriteDefs(setId: SetId, opts?: Pick<RenderOptions, 'idPrefix'>): string;
export declare function symbolId(setId: SetId, key: PieceKey, color?: PieceColor, idPrefix?: string): string;
export declare function pieceStandalone(setId: SetId, key: PieceKey, color?: PieceColor, theme?: PieceTheme): string;
export declare function setAttrs(setId: SetId): string;

declare const _default: {
  SETS: typeof SETS;
  SET_IDS: typeof SET_IDS;
  PIECE_KEYS: typeof PIECE_KEYS;
  PIECE_NAMES: typeof PIECE_NAMES;
  KEY_BY_TYPE: typeof KEY_BY_TYPE;
  THEMES: typeof THEMES;
  pieceSVG: typeof pieceSVG;
  pieceUse: typeof pieceUse;
  pieceMarkup: typeof pieceMarkup;
  spriteDefs: typeof spriteDefs;
  pieceStandalone: typeof pieceStandalone;
  setAttrs: typeof setAttrs;
  symbolId: typeof symbolId;
};
export default _default;
