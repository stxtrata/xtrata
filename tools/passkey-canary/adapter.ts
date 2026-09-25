import {deserializeTransaction,PostConditionMode,AuthType,PayloadType,addressToString,emptyMessageSignature,isSingleSig} from '@stacks/transactions';
import {signStacksTransaction,deriveAddresses} from './upstream/src/index';

export const TESTNET_CONTRACT='ST7KN0NNFMEJVKD8AX54QSZ71GA9Q6HY8T1BFHK3.xtrata-v3-2-5-test1';
export type ReviewPolicy={contractId:string;functionNames:string[];maxMinerFee:bigint;expectedUnsignedHex:string};
export type BridgeSigned={kind:'complete';transactionHex:string;txid:string;publicKey:string}|{kind:'origin-signed';transactionHex:string;publicKey:string};
const hex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
export function readReviewedTransaction(unsignedHex:string,policy:ReviewPolicy){
 if(typeof unsignedHex!=='string'||!/^(?:[0-9a-f]{2})+$/i.test(unsignedHex)||unsignedHex.length>1200000)throw Error('Invalid transaction encoding.');
 if(unsignedHex!==policy.expectedUnsignedHex)throw Error('Transaction differs from the reviewed bytes.');
 const tx=deserializeTransaction(unsignedHex);
 if(tx.transactionVersion!==0x80||tx.chainId!==2147483648)throw Error('Only the Stacks Testnet chain is permitted.');
 if(tx.postConditionMode!==PostConditionMode.Deny)throw Error('Deny-mode spending protection is required.');
 if(tx.payload.payloadType!==PayloadType.ContractCall)throw Error('Only reviewed contract calls are permitted.');
 const contract=addressToString(tx.payload.contractAddress)+'.'+tx.payload.contractName.content;
 if(contract!==TESTNET_CONTRACT||contract!==policy.contractId||!policy.functionNames.includes(tx.payload.functionName.content))throw Error('Contract or function is outside the approved scope.');
 if(!isSingleSig(tx.auth.spendingCondition)||tx.auth.spendingCondition.signature.data!==emptyMessageSignature().data)throw Error('Expected an unsigned single-signature origin.');
 if(tx.auth.spendingCondition.fee>policy.maxMinerFee)throw Error('Miner fee exceeds the approved ceiling.');
 if(tx.auth.authType===AuthType.Sponsored && tx.auth.spendingCondition.fee!==0n)throw Error('Sponsored origin fee must be zero; the sponsor pays its separately approved fee.');
 return tx;
}
// Run inside the wallet origin after trusted review and a fresh ceremony, never in the embedding app.
// The policy is a wallet-owned approval, not untrusted request parameters.
export function signReviewed(prfBytes:Uint8Array,unsignedHex:string,policy:ReviewPolicy):BridgeSigned{
 try{
  const tx=readReviewedTransaction(unsignedHex,policy);
  const result=signStacksTransaction(prfBytes,tx);
  const transactionHex=hex(result.transaction);
  const signed=deserializeTransaction(result.transaction);
  signed.verifyOrigin();
  // Verify the signer changed only the origin signature.
  const normalized=deserializeTransaction(result.transaction);
  if(!isSingleSig(normalized.auth.spendingCondition))throw Error('Unexpected multisig result.');
  normalized.auth.spendingCondition.signature=emptyMessageSignature();
  if(hex(normalized.serializeBytes())!==unsignedHex.toLowerCase())throw Error('Signer changed the reviewed transaction.');
  if(result.kind==='origin-signed')return {kind:'origin-signed',transactionHex,publicKey:result.publicKey};
  return {kind:'complete',transactionHex,txid:result.txid,publicKey:result.publicKey};
 }finally{prfBytes.fill(0);}
}
export function publicAccount(prf:Uint8Array){try{return deriveAddresses(prf,{network:'testnet'}).stacks;}finally{prf.fill(0);}}
