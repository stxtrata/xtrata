export const WALLET_DB='xtrata-radio-test-wallet-v1';
export const CONTRACT='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
export const HOLDER=50n;
export const RESERVE=1000n;
export type Entry={id:string;address:string;kind:'play'|'withdraw';core:number;song:number;recipient:string;amount:string;fee:string;nonce:string;created:number;status:'prepared'|'signed'|'unknown'|'pending'|'confirmed'|'failed'|'cancelled';txid?:string;raw?:string;confirmedAt?:number;actualFee?:string;note?:string;previewBytes?:number};
export type Policy={fee:string;budget:string;max:number;expires:number;core:number;songs:number[]};
export function micro(value:string):bigint{
 if(!/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(value))throw Error('Use STX with up to six decimal places.');
 const [whole,fraction='']=value.split('.');return BigInt(whole)*1000000n+BigInt(fraction.padEnd(6,'0'));
}
export function stx(value:bigint|string){const n=BigInt(value);return `${n/1000000n}.${(n%1000000n).toString().padStart(6,'0')}`;}
export function feeValue(value:string){const fee=micro(value);if(fee<1n||fee>10000n)throw Error('For this canary, choose a fee from 0.000001 to 0.01 STX.');return fee;}
export function validatePolicy(p:Policy,now=Date.now()){
 if(!/^\d+$/.test(p.fee)||BigInt(p.fee)<1n||BigInt(p.fee)>10000n||!/^\d+$/.test(p.budget)||BigInt(p.budget)>1000000n||BigInt(p.budget)<BigInt(p.fee)+HOLDER)throw Error('Invalid fee or budget (maximum 1 STX).');
 if(!Number.isInteger(p.max)||p.max<1||p.max>20||!Number.isFinite(p.expires)||p.expires<=now||p.expires>now+30*60000||![1,2,3].includes(p.core)||!p.songs.length||p.songs.length>20||p.songs.some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Invalid test session. Maximum 20 starts and 30 minutes.');
}
export const unresolved=(e:Entry)=>!['confirmed','failed','cancelled'].includes(e.status);
export function safeReport(entries:Entry[]){return entries.map(({raw,...e})=>e);}
export class Budget {
 private used=0n;private count=0;
 constructor(readonly policy:Policy){validatePolicy(policy);}
 consume(core:number,song:number,fee:bigint,now=Date.now()){
  const p=this.policy,cost=fee+HOLDER;
  if(now>=p.expires||this.count>=p.max||fee!==BigInt(p.fee)||core!==p.core||!p.songs.includes(song)||this.used+cost>BigInt(p.budget))throw Error('Test session limit reached or terms changed.');
  this.used+=cost;this.count++;
 }
}
