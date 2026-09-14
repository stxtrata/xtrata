import {Cl,PostConditionMode,validateStacksAddress,makeUnsignedContractCall,AnchorMode} from '@stacks/transactions';
import {StacksMainnet} from '@stacks/network';
import type {WalletSession} from '../wallet/types';
export type LikeChange={id:number;liked:boolean};
export function buildLikeCall(contract:string,changes:LikeChange[],session:WalletSession){
 if(!session.isConnected||session.network!=='mainnet'||!session.address?.startsWith('SP'))throw Error('Connect a mainnet wallet first.');
 if(!changes.length||changes.length>25||changes.some(c=>!Number.isSafeInteger(c.id)||c.id<0||typeof c.liked!=='boolean')||new Set(changes.map(c=>c.id)).size!==changes.length)throw Error('Select 1–25 different songs.');
 const parts=contract.split('.');const [contractAddress,contractName]=parts;
 if(parts.length!==2||!contractAddress.startsWith('SP')||!validateStacksAddress(contractAddress)||!/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(contractName))throw Error('Invalid likes contract.');
 return {contractAddress,contractName,functionName:changes.length===1?'set-liked':'set-likes',functionArgs:changes.length===1?[Cl.uint(changes[0].id),Cl.bool(changes[0].liked)]:[Cl.list(changes.map(c=>Cl.tuple({id:Cl.uint(c.id),liked:Cl.bool(c.liked)})))],network:new StacksMainnet(),stxAddress:session.address,sponsored:false,postConditionMode:PostConditionMode.Deny,postConditions:[],...(changes.length===1?{fee:200n}:{})};
}
export function importCandidates(saved:unknown,eligible:Set<number>,liked:Set<number>):number[]{
 if(!Array.isArray(saved))return [];
 return [...new Set(saved.map(row=>Number(row?.tokenId)).filter(id=>Number.isSafeInteger(id)&&eligible.has(id)&&!liked.has(id)))];
}

/** Standard single-signature size estimate only; never signs, broadcasts or fetches. */
export async function likeFeeSuggestion(contract:string,changes:LikeChange[],session:WalletSession){
 const call=buildLikeCall(contract,changes,session);
 const tx=await makeUnsignedContractCall({...call,publicKey:'0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',fee:0n,nonce:0n,anchorMode:AnchorMode.Any});
 const microStx=tx.serialize().length;
 return {microStx,totalStx:(microStx/1e6).toFixed(6),perSongStx:(microStx/changes.length/1e6).toFixed(6),count:changes.length};
}
