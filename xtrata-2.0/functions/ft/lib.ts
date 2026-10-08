// Forever Twins token-URI resolver: pure logic (no network), so it can be unit tested.
// Served at /ft/<collection>/<id>.json. The helper's canonical record fixes this URL for every twin,
// so what it returns must stay honest and stable: it describes the preserved on-chain bytes and
// where they came from. It never invents traits or claims things the chain does not show.

export type ManifestToken = {
  id: number;
  original: {
    metadataUri?: string;
    metadataSha256?: string;
    mediaUris?: string[];
    mediaSha256?: string[];
  };
  twin: {
    contentHash: string;
    sha256: string;
    mime: string;
    totalSize: number;
    tokenUri?: string;
    route?: string;
  };
};

export type Manifest = {
  collectionKey: string;
  source: string;
  sourceAsset?: string;
  snapshot?: { stacksTipHeight?: number; stacksTip?: string; takenAt?: string };
  count: number;
  tokens: ManifestToken[];
};

export type CollectionConfig = {
  label: string;
  source: string;
  helper: string | null;
  manifestPath: string;
  manifestSha256: string;
  manifestStatus: 'draft' | 'final';
};

export type ResolverConfig = {
  publicBase: string;
  network: string;
  master: string;
  collections: Record<string, CollectionConfig>;
};

export type ParsedPath = { key: string; id: number } | null;

// "12.json" -> 12, "0.json" -> 0 (some collections start at id 0). Rejects anything that is not a plain non-negative integer with the .json suffix.
export const parseTokenFile = (file: string): number | null => {
  const m = /^(0|[1-9][0-9]{0,8})\.json$/.exec(file);
  return m ? Number(m[1]) : null;
};

export const findToken = (manifest: Manifest, id: number): ManifestToken | undefined => {
  // Manifests list ids in order starting at the collection's first id, so try the direct index first.
  const direct = manifest.tokens[id - 1];
  if (direct && direct.id === id) return direct;
  return manifest.tokens.find((t) => t.id === id);
};

export type TwinState =
  | { status: 'inscribed'; xtrataId: bigint }
  | { status: 'not-inscribed' }
  | { status: 'helper-not-deployed' };

export const buildTwinMetadata = (params: {
  config: ResolverConfig;
  key: string;
  collection: CollectionConfig;
  manifest: Manifest;
  token: ManifestToken;
  state: TwinState;
}) => {
  const { config, key, collection, manifest, token, state } = params;
  const id = token.id;
  const preserved =
    state.status === 'inscribed'
      ? `${config.publicBase}/inscription/${config.network}/${config.master.split('.')[0]}/${config.master.split('.')[1]}/${state.xtrataId.toString()}`
      : undefined;

  const meta: Record<string, unknown> = {
    sip: 16,
    name: `${collection.label} #${id} (Forever Twin)`,
    description:
      `Forever Twin of ${collection.label} #${id}: the original artwork preserved byte for byte on-chain ` +
      `through Xtrata on Stacks, so it no longer depends on external hosting. ` +
      `This is a twin of the original NFT, not a replacement for it.`,
    external_url: `${config.publicBase}/forever-twins/collection/${key}`,
    properties: {
      collection: collection.label,
      forever_twin: true,
      status: state.status,
      original: {
        contract: collection.source,
        token_id: id,
        metadata_uri: token.original.metadataUri ?? null,
        media_uri: token.original.mediaUris?.[0] ?? null,
        media_sha256: token.original.mediaSha256?.[0] ?? null
      },
      twin: {
        core_contract: config.master,
        helper_contract: collection.helper,
        xtrata_id: state.status === 'inscribed' ? state.xtrataId.toString() : null,
        mime: token.twin.mime,
        bytes: token.twin.totalSize,
        sha256: token.twin.sha256,
        xtrata_content_hash: token.twin.contentHash
      },
      manifest: {
        sha256: collection.manifestSha256,
        status: collection.manifestStatus,
        snapshot_stacks_block: manifest.snapshot?.stacksTipHeight ?? null,
        snapshot_taken_at: manifest.snapshot?.takenAt ?? null
      }
    }
  };
  // Only point at an image once the twin really exists on-chain.
  if (preserved) {
    meta.image = preserved;
    meta.preserved_content_url = preserved;
  }
  return meta;
};

// Immutable once inscribed (bindings never change), short-lived while pending so a fresh inscription shows quickly.
export const cacheControlFor = (state: TwinState): string =>
  state.status === 'inscribed' ? 'public, max-age=86400' : 'public, max-age=30';
