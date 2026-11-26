// Primary BNS name for a Stacks address, read from the BNS-V2 contract (get-primary).
// A list of the names a wallet holds does not say which one is primary, so the contract is the only source used.
// No wallet, no signing: a public read-only call.
const C32='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const BNS='SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF/BNS-V2';
// "SP…"/"SM…" address -> clarity principal as hex (05 + version + 20-byte hash). Returns null if it does not decode.
export function principalHex(addr){
  if(typeof addr!=='string'||!/^S[0-9A-Z]{20,60}$/.test(addr))return null;
  const ver=C32.indexOf(addr[1]);if(ver<0)return null;
  let n=0n;for(const ch of addr.slice(2)){const v=C32.indexOf(ch);if(v<0)return null;n=n*32n+BigInt(v);}
  let hex=n.toString(16);if(hex.length>48)return null;hex=hex.padStart(48,'0');   // 20-byte hash + 4-byte checksum
  return '05'+ver.toString(16).padStart(2,'0')+hex.slice(0,40);
}
// (ok (some {name: (buff), namespace: (buff)})) -> "name.namespace"; anything else -> null.
export function parsePrimary(resultHex){
  try{const h=String(resultHex||'').replace(/^0x/,'');const b=h.match(/../g).map(x=>parseInt(x,16));let i=0;
    if(b[i++]!==0x07||b[i++]!==0x0a||b[i++]!==0x0c)return null;
    const count=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;i+=4;const out={};
    for(let k=0;k<count;k++){const kl=b[i++];const key=String.fromCharCode(...b.slice(i,i+kl));i+=kl;if(b[i++]!==0x02)return null;
      const vl=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;i+=4;const v=b.slice(i,i+vl);i+=vl;if(vl<1||vl>48||v.length!==vl||v.some(c=>c<0x20||c>0x7e))return null;out[key]=String.fromCharCode(...v);}
    if(!out.name||!out.namespace)return null;const full=(out.name+'.'+out.namespace).toLowerCase();
    return /^[a-z0-9_-]+\.[a-z0-9_-]+$/.test(full)?full:null;}catch(e){return null;}
}
const cache=new Map();
// Resolves to the primary name, or null when there is none or the lookup fails. One request per address per visit.
export function primaryName(addr,bases){
  if(cache.has(addr))return cache.get(addr);
  const arg=principalHex(addr);
  const p=(async()=>{if(!arg)return null;
    for(const base of bases){try{const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),9000);
      const r=await fetch(base.replace(/\/+$/,'')+'/v2/contracts/call-read/'+BNS+'/get-primary',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sender:addr,arguments:['0x'+arg]}),signal:ctl.signal});
      clearTimeout(tm);if(!r.ok)continue;const j=await r.json();if(!j||!j.okay)return null;return parsePrimary(j.result);}catch(e){}}
    return null;})();
  cache.set(addr,p);return p;
}
