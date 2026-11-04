// Fetches the two real DOG tokens on Stacks (ALEX runes-dog, Pontis pontis-bridge-DOG) through the xtrata.xyz Hiro proxy.
// Usage: node tools/fetch-dog-stacks.mjs   -> writes art/dog/stacks.json (read by the data.json build)
import { writeFileSync } from 'node:fs';
const P = 'https://xtrata.xyz/hiro/mainnet';
const TOKENS = {
  alex: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.runes-dog',
  pontis: 'SP14NS8MVBRHXMM96BQY0727AJ59SWPV7RMHC0NCG.pontis-bridge-DOG',
};
const j = async (u, o) => { const r = await fetch(u, o); if (!r.ok) throw new Error(r.status + ' ' + u); return r.json(); };
// Clarity uint response: 0x07 (ok) 0x01 (uint) + 16 bytes big-endian
const uint = (hex) => BigInt('0x' + hex.slice(6));
const out = { fetchedAt: new Date().toISOString(), tokens: {} };
for (const [k, c] of Object.entries(TOKENS)) {
  const [addr, name] = c.split('.');
  const meta = await j(`${P}/metadata/v1/ft/${c}`);
  const sup = await j(`${P}/v2/contracts/call-read/${addr}/${name}/get-total-supply`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: addr, arguments: [] }),
  });
  out.tokens[k] = {
    contract: c, name: meta.name, symbol: meta.symbol, decimals: meta.decimals,
    supplyMetadataApi: meta.total_supply, supplyReadOnlyCall: uint(sup.result).toString(),
    image_uri: meta.image_uri, image_thumbnail_uri: meta.image_thumbnail_uri, token_uri: meta.token_uri,
    sources: [`${P}/metadata/v1/ft/${c}`, `${P}/v2/contracts/call-read/${addr}/${name}/get-total-supply`],
  };
}
writeFileSync(new URL('../art/dog/stacks.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
