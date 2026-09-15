import { describe, expect, it } from 'vitest';
import { importAllowlist } from '../allowlist-import';
const wallet='ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
describe('allowlist import',()=>{
 it('accepts CSV header and removes only identical duplicates',()=>{const r=importAllowlist(`address,allowance\n${wallet},2\n${wallet},02`);expect(r.errors).toEqual([]);expect(r.count).toBe(1);expect(r.duplicates).toBe(1);});
 it('blocks conflicting allowances',()=>{expect(importAllowlist(`${wallet},2\n${wallet},3`).errors.join()).toContain('conflicting');});
 it('rejects invalid wallets, extra fields and oversized integers',()=>{expect(importAllowlist('bad,2').errors.length).toBeGreaterThan(0);expect(importAllowlist(`${wallet},2,3`).errors.length).toBeGreaterThan(0);expect(importAllowlist(`${wallet},${1n<<128n}`).errors.length).toBeGreaterThan(0);});
});
