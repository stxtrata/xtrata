import { boolCV, bufferCV, listCV, standardPrincipalCV, stringAsciiCV, uintCV, validateStacksAddress, type ClarityValue } from '@stacks/transactions';

type Field = [string, string];
export const collectionActions: Record<string, Field[]> = {
  'set-collection-metadata': [['name','ascii64'],['symbol','ascii16'],['base-uri','ascii256'],['description','ascii256'],['reveal-at','uint']],
  'set-mint-price': [['amount (micro-STX)','uint']],
  'set-max-supply': [['amount — permanent, one-time supply','uint']],
  'set-recipients': [['artist','principal'],['marketplace','principal'],['operator','principal']],
  'set-splits': [['artist basis points','uint'],['marketplace basis points','uint'],['operator basis points','uint']],
  'set-registered-token-uri': [['protocol rolling hash (32 bytes hex)','hash'],['token-uri','ascii256']],
  'set-default-token-uri': [['token-uri','ascii256']],
  'set-default-dependencies': [['token IDs, comma separated','list']],
  'set-max-per-wallet': [['amount','uint']],
  'set-allowlist-enabled': [['enabled (true/false)','bool']],
  'set-allowlist': [['owner','principal'],['allowance','uint']],
  'set-phase': [['phase-id','uint'],['enabled (true/false)','bool'],['start-block','uint'],['end-block (0 = none)','uint'],['price (micro-STX)','uint'],['max-per-wallet','uint'],['max-supply','uint'],['allowlist-mode (0 inherit, 1 public, 2 global, 3 phase)','uint']],
  'set-active-phase': [['phase-id (0 = default)','uint']],
  'set-phase-allowlist': [['phase-id','uint'],['owner','principal'],['allowance','uint']],
  'set-reservation-expiry-blocks': [['expiry','uint']],
  'set-paused': [['paused (true/false)','bool']]
};
export const collectionLookups: Record<string, Field[]> = {
  'get-registered-token-uri': [['rolling hash','hash']],
  'get-hash-reservation': [['rolling hash','hash']],
  'get-reservation': [['buyer','principal'],['rolling hash','hash']],
  'get-wallet-stats': [['buyer','principal']],
  'get-phase': [['phase-id','uint']],
  'get-phase-stats': [['phase-id','uint']],
  'get-minted-id': [['index','uint']],
  'get-token-mint-context': [['token-id','uint']]
};
export function collectionArgs(name: string, values: string[]): ClarityValue[] {
  const fields = collectionActions[name] ?? collectionLookups[name];
  if (!fields || fields.length !== values.length) throw new Error('Unknown operation or missing arguments.');
  const uint = (v: string) => { if (!/^\d+$/.test(v) || BigInt(v) >= 2n ** 128n) throw new Error('Enter an unsigned 128-bit integer.'); return uintCV(BigInt(v)); };
  const args = fields.map(([,type], i) => {
    const raw = values[i], v = raw.trim();
    if (type === 'uint') return uint(v);
    if (type === 'bool') { if (v !== 'true' && v !== 'false') throw new Error('Use true or false.'); return boolCV(v === 'true'); }
    if (type === 'hash') { const h = v.replace(/^0x/,''); if (!/^[a-fA-F0-9]{64}$/.test(h)) throw new Error('Hash must contain exactly 64 hex characters.'); return bufferCV(Uint8Array.from(h.match(/../g)!, b => parseInt(b,16))); }
    if (type === 'principal') { if (!v.startsWith('SP') || !validateStacksAddress(v)) throw new Error('Enter a mainnet standard principal.'); return standardPrincipalCV(v); }
    if (type === 'list') { const ids = v ? v.split(',').map(s => s.trim()) : []; if (ids.length > 50 || new Set(ids.map(s => BigInt(s).toString())).size !== ids.length) throw new Error('Use at most 50 distinct dependency IDs.'); return listCV(ids.map(uint)); }
    if (!/^[\x00-\x7f]*$/.test(raw) || raw.length > Number(type.slice(5))) throw new Error(`Value must fit ${type}.`);
    return stringAsciiCV(raw);
  });
  if (name === 'set-splits' && values.reduce((sum,v) => sum + BigInt(v),0n) > 10000n) throw new Error('Combined splits cannot exceed 10,000 basis points.');
  if (name === 'set-max-supply' && BigInt(values[0]) === 0n) throw new Error('Supply must be positive.');
  if (name === 'set-phase' && (BigInt(values[0]) === 0n || BigInt(values[7]) > 3n || (BigInt(values[3]) !== 0n && BigInt(values[3]) < BigInt(values[2])))) throw new Error('Invalid phase ID, dates or allowlist mode.');
  return args;
}

// Retain unsent drafts and disclosure state across the console's full renders.
const drafts: Record<string,string[]> = {};
const expanded = new Set<string>();
export function renderCollectionManagement(run: (name: string, args: ClarityValue[], write: boolean) => Promise<unknown>) {
  const node = (tag: string, text = '') => { const n = document.createElement(tag); n.textContent = text; return n; };
  const details = (title: string) => { const d = document.createElement('details'); d.open = expanded.has(title); d.append(node('summary',title)); d.ontoggle = () => { if (d.open) expanded.add(title); else expanded.delete(title); }; return d; };
  const root = details('Collection v1.5 — manage contract & testing');
  const stages = [
    ['1. Local regression tests','Run permissions, split limits, phase dates/caps, reservation expiry, duplicate rejection and one-time supply/finalization cases locally. Command: npm --prefix contracts/clarinet test -- tests/xtrata-collection-mint-v1.5.test.ts'],
    ['2. Disposable test instance & fixtures','Use a separate helper and disposable wizard wallets A/B. Prepare unique tiny files and a manifest of bytes, MIME, URI and protocol rolling hash. Never configure production supply as a temporary test limit.'],
    ['3. Fee quote & capped budget','Record a current fee quote and obtain an explicit capped transaction/spending budget before funding or broadcasting test transactions. Respect wizard limits and kill switches. This menu does not fund or execute test mints.'],
    ['4. Mint evidence & contract lookups','Verify staged, atomic and two-item batch mints: ownership, reconstructed bytes/hash, receipts, recipient payments, minted index and released reservations. Test cancellation and duplicate rejection locally. Lookups below return on-chain evidence; they do not mark a test passed.'],
    ['5. Automated storage cleanup gate','Use isolated storage with deletion disabled first. Verify canonical core/token, full reconstruction, recovery backup and reference locks. Require at least six confirmations and a second reconstruction after the 24-hour grace period before deleting eligible staging objects. Test retries, reorgs and recovery restoration. A hash lookup alone is insufficient; never purge sealed core chunks. Worker deployment and audit evidence are separate from this console.'],
    ['6. Production configuration & release','Keep paused while configuring actual metadata, supply, price, recipients/splits, inventory, dependencies, phases and wallet caps. Supply is one-time. Review fresh preflight and configuration before unpausing. Finalization and ownership transfer remain outside this testing menu.']
  ];
  for (const [title,body] of stages) { const d = details(title); d.append(node('p',body)); root.append(d); }
  const forms = (title: string, operations: Record<string,Field[]>, write: boolean) => {
    const section = details(title);
    for (const [name,fields] of Object.entries(operations)) {
      const d = details(name); const values = drafts[name] ??= fields.map(() => '');
      fields.forEach(([label],i) => { const l = node('label',label); const input = document.createElement('input'); input.value = values[i]; input.oninput = () => { values[i] = input.value; }; l.append(input); d.append(l); });
      const result = node('pre'); result.style.whiteSpace = 'pre-wrap'; result.style.overflowWrap = 'anywhere';
      const button = document.createElement('button'); button.textContent = write ? 'Review transaction' : 'Read contract';
      button.onclick = async () => {
        try {
          const args = collectionArgs(name,values);
          if (write) {
            if (!window.confirm(`Mainnet ${name}\n${fields.map(([label],i) => `${label}: ${values[i]}`).join('\n')}\n${name === 'set-max-supply' ? 'Supply is permanent and can only be set once.\n' : ''}Open wallet for this configuration transaction?`)) return;
          }
          button.disabled = true; result.textContent = 'Checking…';
          result.textContent = JSON.stringify(await run(name,args,write),null,2);
        } catch (error) { result.textContent = error instanceof Error ? error.message : String(error); }
        finally { button.disabled = false; }
      };
      d.append(button,result); section.append(d);
    }
    root.append(section);
  };
  forms('Read inventory, reservations, phases & receipts',collectionLookups,false);
  forms('Configure production collection — wallet approval required',collectionActions,true);
  return root;
}
