/** Remove only favourites whose current on-chain state has been confirmed true.
 * Read the latest storage value so unimported/newly added favourites survive. */
export function removeConfirmedLocalLikes(ids:Iterable<string|number>,storage?:Pick<Storage,'getItem'|'setItem'|'removeItem'>):number {
 try {
  const store=storage??globalThis.localStorage;
  const confirmed=new Set(Array.from(ids,String));
  if(!confirmed.size)return 0;
  const saved=JSON.parse(store.getItem('xtrata.radio.likes')||'[]');
  if(!Array.isArray(saved))return 0;
  const remaining=saved.filter(item=>!item||item.tokenId==null||!confirmed.has(String(item.tokenId)));
  const removed=saved.length-remaining.length;
  if(removed){if(remaining.length)store.setItem('xtrata.radio.likes',JSON.stringify(remaining));else store.removeItem('xtrata.radio.likes');}
  return removed;
 }catch{return 0;} // Unavailable storage must not affect confirmed on-chain state.
}
