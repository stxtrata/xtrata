import { XtrataClientError } from '@xtrata/collections-client';
import { verifyDeployedSource, type SourceVerification } from '../studio/template';
import type { NetworkType } from '../../wallet/network';

/**
 * The canary's evidence layer.
 *
 * Everything here is a PURE comparison over data someone else fetched, so the
 * failure modes named in the test plan — bad dependency address, name conflict,
 * source mismatch — are unit-testable without a chain. The chain reads live in
 * `chain.ts`; nothing in this module performs I/O.
 */

export { verifyDeployedSource };
export type { SourceVerification };

// --- interface probe -------------------------------------------------------

export type FunctionAccess = 'public' | 'read_only' | 'private';

export interface ContractFunction {
  name: string;
  access: FunctionAccess;
  /** Argument count. Names/types are not compared — arity is the contract. */
  arity: number;
}

/** The shape the Hiro `/v2/contracts/interface` endpoint returns. */
export interface ContractInterface {
  functions: { name: string; access: string; args: unknown[] }[];
}

const ACCESS: Record<string, FunctionAccess> = {
  public: 'public',
  read_only: 'read_only',
  'read-only': 'read_only',
  private: 'private'
};

/** Normalize an API interface response into the comparable shape. */
export const parseInterfaceResponse = (response: ContractInterface): ContractFunction[] =>
  (response.functions ?? [])
    .map((entry) => ({
      name: entry.name,
      access: ACCESS[entry.access] ?? 'private',
      arity: Array.isArray(entry.args) ? entry.args.length : 0
    }))
    .filter((entry) => entry.access !== 'private');

/**
 * Extract the callable surface from Clarity source.
 *
 * Balanced-paren scan of the signature form rather than a regex over the whole
 * body: `(define-public (mint-seal (hash (buff 32)) (token-uri (optional
 * (string-ascii 256)))) …)` has nested parens in every argument, so counting
 * top-level groups inside the signature is the only way to get arity right.
 */
export const parseLocalInterface = (rawSource: string): ContractFunction[] => {
  // A commented-out definition is not part of the interface.
  const source = stripClarityComments(rawSource);
  const out: ContractFunction[] = [];
  const define = /\(define-(public|read-only)\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = define.exec(source)) !== null) {
    const access: FunctionAccess = match[1] === 'public' ? 'public' : 'read_only';
    // Cursor sits just after the signature's opening paren.
    let cursor = define.lastIndex;
    const nameMatch = /^\s*([^\s()]+)/.exec(source.slice(cursor));
    if (!nameMatch) continue;
    cursor += nameMatch[0].length;

    let depth = 0;
    let arity = 0;
    let closed = false;
    for (; cursor < source.length; cursor += 1) {
      const char = source[cursor];
      if (char === '(') {
        if (depth === 0) arity += 1;
        depth += 1;
      } else if (char === ')') {
        if (depth === 0) {
          closed = true;
          break;
        }
        depth -= 1;
      }
    }
    if (!closed) continue;
    out.push({ name: nameMatch[1]!, access, arity });
  }

  return out;
};

export interface InterfaceProbe {
  ok: boolean;
  /** In the local source, absent on chain — a renamed or dropped function. */
  missing: ContractFunction[];
  /** On chain, absent locally — the deployed contract is not this source. */
  unexpected: ContractFunction[];
  /** Same name, different arity or access. */
  mismatched: { name: string; local: ContractFunction; onChain: ContractFunction }[];
  localCount: number;
  onChainCount: number;
}

const key = (fn: ContractFunction): string => fn.name;

/**
 * Compare the deployed callable surface against the local source.
 *
 * A source-hash match already proves byte equality, so this is the independent
 * second opinion: it catches the case where the API returns a source we cannot
 * hash-compare (whitespace round-tripping, a wallet that reformatted) but the
 * contract is nonetheless not the one we wrote.
 */
export const probeInterface = (params: {
  localSource: string;
  onChain: ContractFunction[];
}): InterfaceProbe => {
  const local = parseLocalInterface(params.localSource);
  const localByName = new Map(local.map((fn) => [key(fn), fn]));
  const chainByName = new Map(params.onChain.map((fn) => [key(fn), fn]));

  const missing = local.filter((fn) => !chainByName.has(key(fn)));
  const unexpected = params.onChain.filter((fn) => !localByName.has(key(fn)));
  const mismatched: InterfaceProbe['mismatched'] = [];
  for (const fn of local) {
    const onChain = chainByName.get(key(fn));
    if (!onChain) continue;
    if (onChain.arity !== fn.arity || onChain.access !== fn.access) {
      mismatched.push({ name: fn.name, local: fn, onChain });
    }
  }

  return {
    ok: missing.length === 0 && unexpected.length === 0 && mismatched.length === 0,
    missing,
    unexpected,
    mismatched,
    localCount: local.length,
    onChainCount: params.onChain.length
  };
};

// --- dependency principals -------------------------------------------------

export interface DependencyCheck {
  ok: boolean;
  /** Contract ids the deployed source actually references. */
  found: string[];
  /** Expected ids that do not appear in the deployed source. */
  missing: string[];
  /** Referenced ids that were not expected — a wrong core or drops principal. */
  unexpected: string[];
}

const PRINCIPAL_REFERENCE = /'((?:SP|SM|ST|SN)[0-9A-HJKMNP-TV-Z]{38,41})\.([a-z][a-z0-9-]{0,39})/g;
/** Sugar for "a contract in this same deploying account". */
const LOCAL_REFERENCE = /(?<![\w'-])\.([a-z][a-z0-9-]{0,39})/g;

/**
 * Drop Clarity comments (`;` to end of line), string literals preserved.
 *
 * Not cosmetic: both contracts carry a commented-out mainnet variant of their
 * core constant ("Mainnet: (define-constant ALLOWED-NFT-CONTRACT 'SP3J…)"), and
 * a dependency scan that counted it would report a mainnet principal inside
 * every testnet deployment. Comments are not code; the scanner must agree.
 */
export const stripClarityComments = (source: string): string => {
  let out = '';
  let inString = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]!;
    if (inString) {
      out += char;
      if (char === '\\') {
        // Escape: copy the escaped character verbatim so `\"` cannot end it.
        i += 1;
        if (i < source.length) out += source[i];
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }
    if (char === ';') {
      while (i < source.length && source[i] !== '\n') i += 1;
      out += '\n';
      continue;
    }
    out += char;
  }
  return out;
};

/**
 * Every fully-qualified contract reference inside a Clarity source.
 *
 * `deployerAddress` resolves the `.name` sugar, which is how a leftover simnet
 * reference (`.mock-xtrata-core`) shows up as an unexpected dependency rather
 * than disappearing from the comparison.
 */
export const extractContractReferences = (source: string, deployerAddress?: string): string[] => {
  const code = stripClarityComments(source);
  const found = new Set<string>();
  for (const match of code.matchAll(PRINCIPAL_REFERENCE)) {
    found.add(`${match[1]}.${match[2]}`);
  }
  for (const match of code.matchAll(LOCAL_REFERENCE)) {
    found.add(deployerAddress ? `${deployerAddress}.${match[1]}` : `.${match[1]}`);
  }
  return [...found].sort();
};

/**
 * Threat 15: the deployed source must reference exactly the dependency
 * principals this run intended, and no others.
 */
export const verifyDependencies = (params: {
  source: string;
  expected: string[];
  deployerAddress?: string;
  /** Self-references (`.own-name`) are not dependencies. */
  selfContractId?: string;
}): DependencyCheck => {
  const expected = new Set(params.expected);
  const found = extractContractReferences(params.source, params.deployerAddress).filter(
    (id) => id !== params.selfContractId
  );
  const foundSet = new Set(found);
  const missing = [...expected].filter((id) => !foundSet.has(id)).sort();
  const unexpected = found.filter((id) => !expected.has(id));
  return { ok: missing.length === 0 && unexpected.length === 0, found, missing, unexpected };
};

// --- name conflict ---------------------------------------------------------

export type NameConflictStatus = 'available' | 'occupied' | 'unknown';

export interface NameConflict {
  contractId: string;
  status: NameConflictStatus;
  /** True when the occupant is byte-identical to what we were about to deploy. */
  identical?: boolean;
  detail: string;
}

/**
 * Deployed Clarity contracts CANNOT be overwritten, so a name that is already
 * taken is a hard stop discovered BEFORE the wallet opens, not after the
 * transaction aborts. `existingSource` is null when the API reported 404.
 */
export const detectNameConflict = (params: {
  contractId: string;
  existingSource: string | null;
  intendedSource: string;
}): NameConflict => {
  if (params.existingSource === null) {
    return {
      contractId: params.contractId,
      status: 'available',
      detail: `${params.contractId} does not exist yet`
    };
  }
  const verification = verifyDeployedSource({
    expected: params.intendedSource,
    actual: params.existingSource
  });
  const identical = verification.match !== 'none';
  return {
    contractId: params.contractId,
    status: 'occupied',
    identical,
    detail: identical
      ? `${params.contractId} already exists and its source matches this build — nothing to deploy`
      : `${params.contractId} already exists with DIFFERENT source (on-chain sha256 ${verification.actualHash}); ` +
        'Clarity contracts cannot be overwritten — choose a new versioned name'
  };
};

// --- network guard ---------------------------------------------------------

export interface NetworkGuardResult {
  ok: boolean;
  reason?: string;
}

/**
 * The per-stage network guard (threat 13).
 *
 * The testnet stages refuse a mainnet session and the mainnet stages refuse a
 * testnet one — in BOTH directions, because "wrong network" that only fires one
 * way is how a rehearsal ends up on mainnet.
 */
export const guardStageNetwork = (params: {
  requiredNetwork: NetworkType;
  walletNetwork: NetworkType | null;
  appNetwork: NetworkType;
}): NetworkGuardResult => {
  if (params.walletNetwork === null) {
    return { ok: false, reason: 'no wallet is connected' };
  }
  if (params.walletNetwork !== params.requiredNetwork) {
    return {
      ok: false,
      reason: `this stage requires a ${params.requiredNetwork} account; the connected account is ${params.walletNetwork}`
    };
  }
  if (params.appNetwork !== params.requiredNetwork) {
    return {
      ok: false,
      reason: `this stage requires a ${params.requiredNetwork} build; this build targets ${params.appNetwork}`
    };
  }
  return { ok: true };
};

export const assertStageNetwork = (params: {
  requiredNetwork: NetworkType;
  walletNetwork: NetworkType | null;
  appNetwork: NetworkType;
}): void => {
  const result = guardStageNetwork(params);
  if (!result.ok) {
    throw new XtrataClientError('plan-invalid', `wrong network: ${result.reason ?? 'unknown'}`);
  }
};
