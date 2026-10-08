import type { InscriptionMeta } from '../protocol/types';

export type TokenSummary = {
  id: bigint;
  owner: string | null;
  tokenUri: string | null;
  meta: InscriptionMeta | null;
  svgDataUri: string | null;
  sourceContractId?: string;
  /**
   * Version of the stored grid thumbnail (served at /thumb/<contract>/<id>?v=...),
   * when the index knows of one. Songs and HTML tiles use it instead of loading
   * the inscription itself.
   */
  thumbVersion?: string | null;
  /** Title and artist from the index. Untrusted text: insert with textContent only. */
  thumbTitle?: string | null;
  thumbArtist?: string | null;
};

export type StreamStatus = {
  id: string;
  phase: 'idle' | 'buffering' | 'playable' | 'loading' | 'complete' | 'error';
  bufferedSeconds: number;
  chunksLoaded: number;
  totalChunks: number;
  mimeType: string | null;
  updatedAt: number;
} | null;
