import {Cl,PostConditionMode,validateStacksAddress} from '@stacks/transactions';
import {StacksMainnet} from '@stacks/network';
import type {WalletSession} from '../wallet/types';
export type LikeChange={id:number;liked:boolean};
export function buildLikeCall(contract:string,changes:LikeChange[],session:WalletSession){
 if(!session.isConnected||session.network!=='mainnet'||!session.address?.startsWith('SP'))throw Error('Connect a mainnet wallet first.');
 if(!changes.length||changes.length>25||changes.some(c=>!Number.isSafeInteger(c.id)||c.id<0||typeof c.liked!=='boolean')||new Set(changes.map(c=>c.id)).size!==changes.length)throw Error('Select 1–25 different songs.');
 const parts=contract.split('.');const [contractAddress,contractName]=parts;
 if(parts.length!==2||!contractAddress.startsWith('SP')||!validateStacksAddress(contractAddress)||!/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(contractName))throw Error('Invalid likes contract.');
 return {contractAddress,contractName,functionName:changes.length===1?'set-liked':'set-likes',functionArgs:changes.length===1?[Cl.uint(changes[0].id),Cl.bool(changes[0].liked)]:[Cl.list(changes.map(c=>Cl.tuple({id:Cl.uint(c.id),liked:Cl.bool(c.liked)})))],network:new StacksMainnet(),stxAddress:session.address,sponsored:false,postConditionMode:PostConditionMode.Deny,postConditions:[]};
}
export function importCandidates(saved:unknown,eligible:Set<number>,liked:Set<number>):number[]{
 if(!Array.isArray(saved))return [];
 return [...new Set(saved.map(row=>Number(row?.tokenId)).filter(id=>Number.isSafeInteger(id)&&eligible.has(id)&&!liked.has(id)))];
}
