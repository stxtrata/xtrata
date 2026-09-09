// Read-only completion after all 14 transactions were already successful.
// No wallet files, keys, transaction builder or broadcast functions are used.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {XtrataReader,PeerRegistry,verifyArchive,decode} from './modules.mjs';
const dir='reviews/3037',s=JSON.parse(readFileSync(dir+'/live-state.json')),base='https://api.mainnet.hiro.so';
const row=s.transactions.find(t=>t.label==='peer-result-inscription');assert.equal(row.status,'success');
s.resultInscription=Number(decode(row.result.hex).value['token-id']);assert.equal(s.resultInscription,3038);
const reader=new XtrataReader({override:base});
const sealed=await reader.text(s.resultInscription);assert.equal(sealed,readFileSync(dir+'/registered-peer-result.json','utf8'));
const registry=new PeerRegistry(s.peerRegistry,'mainnet',base),opening=await registry.confirmed(s.peerGame);
await verifyArchive(JSON.parse(sealed),opening);
writeFileSync(dir+'/sealed-result.json',sealed);
const check={name:'Sealed on-chain result bytes match and independently verify',passed:true,inscription:s.resultInscription,sha256:createHash('sha256').update(sealed).digest('hex')};
s.checks=s.checks.filter(c=>c.name!==check.name);s.checks.push(check);
s.endBalances={};for(const address of Object.keys(s.startBalances)) {const r=await fetch(base+'/extended/v1/address/'+address+'/stx');assert(r.ok,'Balance read '+r.status);s.endBalances[address]=(await r.json()).balance;}
s.completedAt=new Date().toISOString();s.success=true;if(s.lastError){s.recoveredHarnessError=s.lastError;delete s.lastError;}
const net=Object.keys(s.startBalances).reduce((n,a)=>n+BigInt(s.startBalances[a])-BigInt(s.endBalances[a]),0n);
const predicted=Object.fromEntries(Object.entries(s.startBalances).map(([a,b])=>[a,BigInt(b)]));
for(const t of s.transactions){predicted[t.sender]-=BigInt(t.feeUstx);for(const e of t.events){if(e.event_type==='stx_asset'){const a=e.asset;if(a.sender in predicted)predicted[a.sender]-=BigInt(a.amount);if(a.recipient in predicted)predicted[a.recipient]+=BigInt(a.amount);}}}
for(const a of Object.keys(predicted))assert.equal(predicted[a],BigInt(s.endBalances[a]),'Receipt/balance reconciliation '+a);
s.cost={netFleetDecreaseUstx:String(net),networkFeesUstx:String(s.transactions.reduce((n,t)=>n+BigInt(t.feeUstx),0n)),remainingSponsorshipReserveUstx:'86000',nonrefundableUstx:String(net-86000n)};
writeFileSync(dir+'/live-state.json',JSON.stringify(s,null,2)+'\n');console.log(JSON.stringify({success:s.success,inscription:s.resultInscription,balances:s.endBalances,cost:s.cost,check},null,2));
