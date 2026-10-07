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
  /** 1 = the original is animated, 0 = still, null = not checked. */
  animated: number | null;
};

/**
 * The thumbnail version the grid may use for a token. A picture file is only
 * replaced by its still thumbnail once it is known to be still: an animated or
 * unchecked picture gets no version, so it keeps loading (and playing) as before.
 * Everything else (a song's cover, for example) always gets its version.
 */
export const thumbnailVersionFor = (
  info: ThumbnailInfo | undefined,
  mime: string | null | undefined
): string | null => {
  if (!info?.version) return null;
  if (info.animated === 1) return null;
  const isPicture = typeof mime === 'string' && mime.toLowerCase().startsWith('image/');
  if (isPicture && info.animated !== 0) return null;
  return info.version;
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
  const select = (withAnimated: boolean) =>
    queryAll(
      env,
      `SELECT contract_id, token_id, status, etag, title, artist${withAnimated ? ', animated' : ''}
         FROM inscription_thumbnails
        WHERE contract_id IN (${contracts.map(() => '?').join(',')})
          AND token_id IN (${ids.map(() => '?').join(',')})
          AND status IN ('ready', 'none')`,
      [...contracts, ...ids]
    );
  try {
    let result;
    try {
      result = await select(true);
    } catch {
      // Migration 022 (the animated column) is not applied yet: songs keep their
      // covers, and picture files simply stay on their normal path.
      result = await select(false);
    }
    for (const row of (result.results ?? []) as Array<{
      contract_id: string;
      token_id: number;
      status: string;
      etag: string | null;
      title: string | null;
      artist: string | null;
      animated?: number | null;
    }>) {
      out.set(`${row.contract_id}:${row.token_id}`, {
        version: row.status === 'ready' && isThumbnailVersion(row.etag) ? row.etag : null,
        title: cleanThumbnailText(row.title),
        artist: cleanThumbnailText(row.artist),
        animated: row.animated === 0 || row.animated === 1 ? row.animated : null
      });
    }
  } catch {
    // Table not created yet, or D1 unavailable: no thumbnails, nothing breaks.
  }
  return out;
};
