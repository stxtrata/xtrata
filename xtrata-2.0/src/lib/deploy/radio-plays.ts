import {Cl,makeUnsignedContractCall,makeStandardSTXPostCondition,FungibleConditionCode,PostConditionMode,AnchorMode} from '@stacks/transactions';
import {StacksMainnet} from '@stacks/network';
export const RADIO_PLAYS_NAME='xtrata-radio-plays-v1-0';
export const RADIO_PLAYS_SOURCE='contracts/live/xtrata-radio-plays-v1.0.clar';
export const RADIO_PLAYS_DEPLOYER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const RADIO_PLAYS_SHA256='b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1';
export const RADIO_PLAYS_BYTES=2381;
export const RADIO_PLAYS_CORES=['xtrata-v1-1-1','xtrata-v2-1-0','xtrata-v3-2-3'];
export function inspectRadioPlaysSource(code:string,hash:string):string[]{
 return hash===RADIO_PLAYS_SHA256&&new TextEncoder().encode(code).length===RADIO_PLAYS_BYTES?[]:['Radio paid-play source differs from the tested release. Do not deploy edited bytes.'];
}
export function inspectRadioPlaysConfig(decoded:any):string[]{
 const v=decoded?.success===true?decoded.value?.value:null;
 if(!v||v.version?.value!=='1'||v['holder-payment']?.value!=='50'||v['receipt-bytes']?.value!=='16'||RADIO_PLAYS_CORES.some((c,i)=>v['core-'+(i+1)]?.value!==RADIO_PLAYS_DEPLOYER+'.'+c))return ['Deployed paid-play configuration does not match the release.'];
 return [];
}
/** Offline standard-signature envelope sizing; public fixture only, never signs or broadcasts. */
export async function measureRadioPlay(){
 const tx=await makeUnsignedContractCall({contractAddress:RADIO_PLAYS_DEPLOYER,contractName:RADIO_PLAYS_NAME,functionName:'play',functionArgs:[Cl.uint(3),Cl.uint(2910),Cl.buffer(new Uint8Array(16))],publicKey:'0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',fee:200n,nonce:0n,network:new StacksMainnet(),anchorMode:AnchorMode.Any,postConditionMode:PostConditionMode.Deny,postConditions:[makeStandardSTXPostCondition(RADIO_PLAYS_DEPLOYER,FungibleConditionCode.Equal,50n)]});
 return {bytes:tx.serialize().length,requestedFee:200,holderPayment:50};
}
