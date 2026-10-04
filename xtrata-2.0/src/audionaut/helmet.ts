// Helmet picture for an Audionaut, shown as a small still in the gate bar. Display only.
// The ten helmet pictures live in one Xtrata inscription (#3059, a JSON payload of WebP
// images). Each Audionaut wears one of them with its own hue rotation and finish, which is
// the table in helmet-data.ts (taken from the Audionauts engine). Nothing here plays audio,
// runs the player, or makes anything clickable: it only returns an image and how to tint it.
import { CORE_ASSET_ID } from './core';
import {
  HELMET_ASSETS,
  HELMET_CUTOUTS,
  HELMET_FINISHES,
  HELMET_MEMBERS,
  HELMET_PIXEL
} from './helmet-data';

const CORE_CONTRACT_ID = CORE_ASSET_ID.split('::')[0];
export const HELMET_BUNDLE_TOKEN = 3059;
const BUNDLE_URL = `/i/${HELMET_BUNDLE_TOKEN}?contractId=${encodeURIComponent(CORE_CONTRACT_ID)}&network=mainnet`;
const PAYLOAD_START = '<script type="application/json" id="audionauts-helmets-v1">';

export type HelmetLook = {
  name: string; // the Audionaut's call sign, e.g. "Callisto"
  src: string; // data: URL of the helmet picture
  filter: string; // CSS filter that gives this Audionaut its colour and finish
  clipPath?: string; // outline that trims the picture background, when the helmet has one
  pixel: boolean; // pixel-art helmets must not be smoothed
};

// helmet name -> data: URL, or null when the payload is not what we expect.
export const parseHelmetBundle = (html: unknown): Record<string, string> | null => {
  if (typeof html !== 'string') return null;
  const start = html.indexOf(PAYLOAD_START);
  if (start < 0) return null;
  const end = html.indexOf('</script>', start + PAYLOAD_START.length);
  if (end < 0) return null;
  try {
    const payload = JSON.parse(html.slice(start + PAYLOAD_START.length, end)) as {
      format?: string;
      assets?: Record<string, { mime?: string; base64?: string }>;
    };
    if (payload.format !== 'audionauts-helmets-v1' || !payload.assets) return null;
    const out: Record<string, string> = {};
    for (const name of HELMET_ASSETS) {
      const asset = payload.assets[`${name}.webp`];
      if (!asset || asset.mime !== 'image/webp' || typeof asset.base64 !== 'string') return null;
      out[name] = `data:image/webp;base64,${asset.base64}`;
    }
    return out;
  } catch {
    return null;
  }
};

// How edition 1..111 is dressed, without the picture itself.
export function helmetStyle(edition: number): Omit<HelmetLook, 'src'> & { asset: string } | null {
  const row = Number.isInteger(edition) ? HELMET_MEMBERS[edition - 1] : undefined;
  if (!row) return null;
  const [assetIndex, hue, finishIndex, name] = row;
  const asset = HELMET_ASSETS[assetIndex];
  const finish = HELMET_FINISHES[finishIndex] ?? '';
  const outline = HELMET_CUTOUTS[asset];
  return {
    asset,
    name,
    filter: `hue-rotate(${hue}deg)${finish ? ` ${finish}` : ''}`,
    clipPath: outline
      ? `polygon(${outline.map(([x, y]) => `${+(x * 100).toFixed(2)}% ${+(y * 100).toFixed(2)}%`).join(',')})`
      : undefined,
    pixel: !!HELMET_PIXEL[asset]
  };
}

let bundle: Promise<Record<string, string> | null> | undefined;

export type HelmetOptions = { fetchImpl?: typeof fetch; signal?: AbortSignal };

function loadBundle(opts: HelmetOptions): Promise<Record<string, string> | null> {
  if (!bundle) {
    const doFetch = opts.fetchImpl ?? fetch;
    bundle = doFetch(BUNDLE_URL, { headers: { Accept: 'text/html' }, signal: opts.signal })
      .then(async (res) => (res.ok ? parseHelmetBundle(await res.text()) : null))
      .catch(() => null)
      .then((result) => {
        if (!result) bundle = undefined; // allow a later retry
        return result;
      });
  }
  return bundle;
}

export async function fetchHelmet(edition: number, opts: HelmetOptions = {}): Promise<HelmetLook | null> {
  const style = helmetStyle(edition);
  if (!style) return null;
  const images = await loadBundle(opts);
  const src = images?.[style.asset];
  if (!src) return null;
  const { asset: _asset, ...rest } = style;
  return { ...rest, src };
}
