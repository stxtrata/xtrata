import {profileAddress,validateChallenge,verifyProfile} from '../../scripts/wizard/music-profile-proof.mjs';
export async function resolveProfileOwner(name:string,transport:typeof fetch=fetch){
 const r=await transport(`https://api.bnsv2.com/names/${encodeURIComponent(name)}/owner`,{signal:AbortSignal.timeout(10000),cache:'no-store'});
 if(!r.ok)throw Error('BNS ownership is unavailable. Try again later.');
 const d=await r.json() as any;
 if(d.status!=='active'||!Number.isSafeInteger(d.current_burn_block)||!/^\d+$/.test(String(d.renewal_height))||BigInt(d.renewal_height)<=BigInt(d.current_burn_block))throw Error('BNS name is not currently active.');
 return profileAddress(d.owner);
}
export function requireSupportProof(c:any,signature:unknown,now:number,allowPending=false){
 validateChallenge(c,now,allowPending);if(!verifyProfile(c,'support',signature,c.support))throw Error('The support wallet has not approved this request.');
}
export function verifyProfileTransfer(c:any,tx:any,txid:string,seenAt:number|null,now:number){
 if(tx.tx_id?.toLowerCase()!==txid||tx.tx_type!=='token_transfer'||tx.sender_address!==c.owner||tx.token_transfer?.recipient_address!==c.support||tx.token_transfer?.amount!==String(c.amount)||tx.sponsored===true)throw Error('Transfer does not match this request.');
 const memo=tx.token_transfer?.memo;
 if(typeof memo!=='string'||!/^0x([a-fA-F0-9]{2}){1,34}$/.test(memo))throw Error('The verification memo is missing.');
 const decoded=new TextDecoder().decode(Uint8Array.from(memo.slice(2).match(/../g)!,x=>parseInt(x,16))).replace(/\0+$/,'');
 if(decoded!=='XM'+c.id.slice(0,30))throw Error('The verification memo does not match this request.');
 if(tx.tx_status==='pending'){
  if(now>c.expires&&!seenAt)throw Error('Transfer was not submitted before expiry.');
  if(!Number.isSafeInteger(tx.receipt_time)||tx.receipt_time*1000<c.issued-1000||tx.receipt_time*1000>c.expires)throw Error('Transfer is outside the submission window.');
  return 'pending';
 }
 if(tx.tx_status!=='success'||tx.canonical!==true||tx.is_unanchored===true)throw Error('Transfer is not confirmed on the canonical chain.');
 const time=tx.block_time??tx.burn_block_time;
 if(!Number.isSafeInteger(time)||time*1000<c.issued-1000||(!seenAt&&time*1000>c.expires)||now>c.expires+3600000)throw Error('Transfer is outside the verification window.');
 return 'confirmed';
}
