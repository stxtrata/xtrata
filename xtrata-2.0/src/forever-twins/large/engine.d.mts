// Type surface for engine.mjs (plain JavaScript with no build step, so it can run under node in the simulations).
export const CHUNK: number;
export const BATCH: number;
export const SINGLE_TX_MAX_BYTES: number;
export const CONFIG: Readonly<Record<string, any>>;
export const TERMINAL: Set<string>;
export function chunkBytes(bytes: Uint8Array): Uint8Array[];
export function rollingHashHex(chunks: Uint8Array[], sha256: (u: Uint8Array) => Uint8Array): string;
export function normHex(h: string): string;
export function planFunding(p: any, cfg?: any): any;
export function createEngine(o: { io: any; store: any; cfg?: any; onUpdate?: (j: any) => void; agentFeeAddress?: string | null }): any;
