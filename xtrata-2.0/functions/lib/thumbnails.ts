import { queryAll, type Env } from './db';

// Stored grid thumbnails for the Explorer.
//
// A song or HTML inscription is expensive to show: the file is megabytes, read
// from chain, and runs its own scripts. The grid needs only a small picture, so
// we keep one WebP per inscription in the THUMBNAILS R2 bucket and index them in
// D1 (table inscription_thumbnails, migration 021). The grid then draws a plain
// <img>; the real inscription loads only when a tile is selected.
//
// Everything here is shared by the /thumb endpoint, /index/page and the tests.
// scripts/backfill-thumbnails.mjs keeps its own copy of the key and text rules
// (it is plain Node), and a test asserts the two stay identical.

/** Longest side of a stored thumbnail, in pixels. */
export const THUMBNAIL_SIZE = 256;
/** Titles and artists come from untrusted on-chain files, so they are capped. */
export const THUMBNAIL_MAX_TEXT = 120;

// A Stacks contract principal: address, dot, contract name. Deliberately strict,
// because the value ends up in an R2 key and a URL path.
const CONTRACT_PATTERN = /^S[A-Z0-9]{30,50}\.[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const VERSION_PATTERN = /^[A-Za-z0-9_-]{4,64}$/;

export type ThumbnailRequest = { contractId: string; tokenId: number };

/** Validates path parameters from /thumb/<contract>/<tokenId>. Null when invalid. */
export const parseThumbnailRequest = (
  contractId: unknown,
  tokenId: unknown
): ThumbnailRequest | null => {
  if (typeof contractId !== 'string' || !CONTRACT_PATTERN.test(contractId)) return null;
  if (typeof tokenId !== 'string' || !/^\d{1,10}$/.test(tokenId)) return null;
  const id = Number(tokenId);
  // Token ids start at 0 on some contracts (v2 has a #0).
  if (!Number.isSafeInteger(id) || id < 0) return null;
  return { contractId, tokenId: id };
};

/** The R2 object key for a token's thumbnail. */
export const thumbnailKey = (contractId: string, tokenId: number | string): string =>
  `thumbs/${contractId}/${tokenId}.webp`;

/** True when `?v=` looks like a version we issued (hex or url-safe base64). */
export const isThumbnailVersion = (value: string | null): value is string =>
  typeof value === 'string' && VERSION_PATTERN.test(value);

/**
 * Makes an untrusted title or artist safe to store and show: no control or
 * invisible-direction characters, single spaces, capped length. It is still data,
 * never markup; the client must only ever insert it with textContent.
 */
export const cleanThumbnailText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const cleaned = value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(cleaned).slice(0, THUMBNAIL_MAX_TEXT).join('');
};

export type ThumbnailInfo = {
  /** Version for the /thumb URL when a picture exists, otherwise null. */
  version: string | null;
  title: string;
  artist: string;
};

/**
 * Looks up which of these tokens have a stored thumbnail (or at least a known
 * title and artist). Never throws: if the table is missing because migration 021
 * has not been applied yet, the grid simply keeps its plain posters.
 */
export const loadThumbnailInfo = async (
  env: Env,
  contracts: string[],
  ids: number[]
): Promise<Map<string, ThumbnailInfo>> => {
  const out = new Map<string, ThumbnailInfo>();
  if (contracts.length === 0 || ids.length === 0) return out;
  try {
    const result = await queryAll(
      env,
      `SELECT contract_id, token_id, status, etag, title, artist
         FROM inscription_thumbnails
        WHERE contract_id IN (${contracts.map(() => '?').join(',')})
          AND token_id IN (${ids.map(() => '?').join(',')})
          AND status IN ('ready', 'none')`,
      [...contracts, ...ids]
    );
    for (const row of (result.results ?? []) as Array<{
      contract_id: string;
      token_id: number;
      status: string;
      etag: string | null;
      title: string | null;
      artist: string | null;
    }>) {
      out.set(`${row.contract_id}:${row.token_id}`, {
        version: row.status === 'ready' && isThumbnailVersion(row.etag) ? row.etag : null,
        title: cleanThumbnailText(row.title),
        artist: cleanThumbnailText(row.artist)
      });
    }
  } catch {
    // Table not created yet, or D1 unavailable: no thumbnails, nothing breaks.
  }
  return out;
};
