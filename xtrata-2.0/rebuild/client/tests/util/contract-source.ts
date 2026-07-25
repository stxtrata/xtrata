import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Drift guard: parse the actual Clarity sources so builder/codec tests fail if
 * the contract's function names, arities or error codes change underneath us.
 */

const CONTRACTS_DIR = resolve(
  import.meta.dirname,
  '../../../contracts/contracts'
);

export const loadContractSource = (fileName: string): string =>
  readFileSync(resolve(CONTRACTS_DIR, fileName), 'utf8');

export interface ClarFunction {
  name: string;
  kind: 'public' | 'read-only';
  argCount: number;
}

/** Extract every define-public / define-read-only with its arity. */
export const parseFunctions = (source: string): Map<string, ClarFunction> => {
  const out = new Map<string, ClarFunction>();
  const re = /\(define-(public|read-only)\s+\(([a-z0-9-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const kind = m[1] as 'public' | 'read-only';
    const name = m[2]!;
    // Count top-level args: walk from after the name to the matching close paren.
    let depth = 1;
    let i = re.lastIndex;
    let argCount = 0;
    while (i < source.length && depth > 0) {
      const ch = source[i]!;
      if (ch === '(') {
        if (depth === 1) argCount += 1;
        depth += 1;
      } else if (ch === ')') {
        depth -= 1;
      }
      i += 1;
    }
    out.set(name, { name, kind, argCount });
  }
  return out;
};

/** Extract `(define-constant ERR-… (err uNNN))` → { code: name }. */
export const parseErrorCodes = (source: string): Map<number, string> => {
  const out = new Map<number, string>();
  const re = /\(define-constant\s+(ERR-[A-Z0-9-]+)\s+\(err\s+u(\d+)\)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    out.set(Number(m[2]!), m[1]!);
  }
  return out;
};
