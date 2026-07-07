// Client for the server-side relationship lineage endpoint
// (functions/index/relations/[contract].ts). Returns the full ancestor and
// descendant lineage (depth-tagged) plus half-siblings for one inscription,
// resolved from the D1 edge index in a single round-trip. Falls back to null on
// any failure so the caller can degrade to the local IndexedDB scan.

export type LineageNode = { id: bigint; depth: number };

export type LineageResult = {
  parents: bigint[];
  children: bigint[];
  ancestors: LineageNode[];
  descendants: LineageNode[];
  siblings: bigint[];
  mintedCount: bigint;
  syncedCount: bigint;
  complete: boolean;
};

const toBigInt = (value: unknown): bigint | null => {
  try {
    return BigInt(value as string | number | bigint);
  } catch {
    return null;
  }
};

const toIdList = (value: unknown): bigint[] => {
  if (!Array.isArray(value)) return [];
  const out: bigint[] = [];
  for (const entry of value) {
    const id = toBigInt(entry);
    if (id !== null) out.push(id);
  }
  return out;
};

const toNodeList = (value: unknown): LineageNode[] => {
  if (!Array.isArray(value)) return [];
  const out: LineageNode[] = [];
  for (const entry of value) {
    const id = toBigInt((entry as { id?: unknown })?.id);
    const depthRaw = Number((entry as { depth?: unknown })?.depth);
    if (id !== null && Number.isFinite(depthRaw) && depthRaw > 0) {
      out.push({ id, depth: Math.floor(depthRaw) });
    }
  }
  return out;
};

export const fetchLineage = async (params: {
  contractId: string;
  id: bigint;
  origin?: string;
}): Promise<LineageResult | null> => {
  const origin = params.origin ?? '';
  const url =
    `${origin}/index/relations/${params.contractId}?id=${params.id.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const body = (await response.json()) as Record<string, unknown>;
    if (body && typeof body === 'object' && 'error' in body) return null;
    return {
      parents: toIdList(body.parents),
      children: toIdList(body.children),
      ancestors: toNodeList(body.ancestors),
      descendants: toNodeList(body.descendants),
      siblings: toIdList(body.siblings),
      mintedCount: toBigInt(body.mintedCount) ?? 0n,
      syncedCount: toBigInt(body.syncedCount) ?? 0n,
      complete: body.complete === true
    };
  } catch {
    return null;
  }
};

// Reverse dependency lookup: the inscriptions that DEPEND ON this id — i.e. its
// replies in a thread. Backed by functions/index/dependents/[contract].ts (the
// inscription_dependencies edge table). Returns ids in mint order (chronological).
export type DependentsResult = {
  dependents: bigint[];
  mintedCount: bigint;
  syncedCount: bigint;
  complete: boolean;
  hasMore: boolean;
};

export const fetchDependents = async (params: {
  contractId: string;
  id: bigint;
  origin?: string;
  limit?: number;
}): Promise<DependentsResult | null> => {
  const origin = params.origin ?? '';
  const limit = params.limit ?? 100;
  const url =
    `${origin}/index/dependents/${params.contractId}?id=${params.id.toString()}&limit=${limit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const body = (await response.json()) as Record<string, unknown>;
    if (body && typeof body === 'object' && 'error' in body) return null;
    const rows = Array.isArray(body.dependents) ? (body.dependents as Array<{ id?: unknown }>) : [];
    const pagination = (body.pagination as { hasMore?: unknown } | undefined) ?? {};
    return {
      dependents: toIdList(rows.map((row) => row?.id)),
      mintedCount: toBigInt(body.mintedCount) ?? 0n,
      syncedCount: toBigInt(body.syncedCount) ?? 0n,
      complete: body.complete === true,
      hasMore: pagination.hasMore === true
    };
  } catch {
    return null;
  }
};
