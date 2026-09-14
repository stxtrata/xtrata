const KEY='xtrata.radio.likes';
let busy=false,dirty=false,attempts=0;
/** Sync the latest saved set; cumulative clicks are never sent as likes. */
export function syncRadioLikes(){dirty=true;void flush();}
async function flush(){
 if(busy||!dirty)return;busy=true;dirty=false;
 try {
  let browserId=localStorage.getItem('xtrata.radio.likes.browser');
  if(!browserId){browserId=crypto.randomUUID();localStorage.setItem('xtrata.radio.likes.browser',browserId);}
  const saved=JSON.parse(localStorage.getItem(KEY)||'[]');
  const ids=[...new Set<number>((Array.isArray(saved)?saved:[]).slice(0,200).map((l:{tokenId:unknown})=>Number(l.tokenId)).filter((n:number)=>Number.isSafeInteger(n)&&n>0))];
  const revision=Math.max(Date.now(),Number(localStorage.getItem('xtrata.radio.likes.revision')||0)+1);
  localStorage.setItem('xtrata.radio.likes.revision',String(revision));
  const response=await fetch('/radio/likes',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({browserId,operationId:crypto.randomUUID(),revision,ids}),signal:AbortSignal.timeout(5000),keepalive:true});
  if(!response.ok)throw Error('Retry');attempts=0;
 }catch{dirty=true;attempts++;}
 finally{busy=false;if(dirty&&attempts<6)setTimeout(()=>void flush(),Math.min(60000,2000*2**attempts));}
}
