import * as T from '@stacks/transactions';
import {sha256} from '@noble/hashes/sha256';
export const PROFILE_DOMAIN='xtrata.xyz/music/heroes';
export const PROFILE_TTL=15*60*1000;
export function profileName(value){
 if(typeof value!=='string'||!/^([a-z0-9_-]{1,37})\.([a-z0-9_-]{1,20})$/.test(value))throw Error('Enter a lowercase BNS name, such as jim.btc. Subdomains are not supported yet.');
 return value;
}
export function profileAddress(value){
 if(typeof value!=='string'||!value.startsWith('SP')||!T.validateStacksAddress(value))throw Error('A standard single-signature Stacks mainnet address is required.');return value;
}
export function validateChallenge(c,now=Date.now(),allowPending=false){
 if(!c||c.domain!==PROFILE_DOMAIN||c.network!=='mainnet'||!['link','unlink'].includes(c.action)||!['signature','transfer'].includes(c.method)||!/^[a-f0-9]{64}$/.test(c.id))throw Error('Invalid profile challenge.');
 profileAddress(c.support);profileName(c.name);
 if(c.action==='link')profileAddress(c.owner);
 if(!Number.isSafeInteger(c.issued)||!Number.isSafeInteger(c.expires)||c.expires-c.issued!==PROFILE_TTL||c.issued>now+30000||now>(allowPending?c.expires+60*60*1000:c.expires))throw Error('Profile request expired. Start again in the app.');
 if(!Number.isSafeInteger(c.amount)||c.amount<1000||c.amount>9999)throw Error('Invalid verification amount.');
 return c;
}
export function profileData(c,role){
 if(!['support','owner'].includes(role))throw Error('Invalid signing role.');
 return {domain:T.tupleCV({name:T.stringAsciiCV(PROFILE_DOMAIN),version:T.stringAsciiCV('1'),'chain-id':T.uintCV(1)}),message:T.tupleCV({purpose:T.stringAsciiCV('Music profile only; no spending permission'),action:T.stringAsciiCV(c.action),method:T.stringAsciiCV(c.method),role:T.stringAsciiCV(role),nonce:T.stringAsciiCV(c.id),support:T.standardPrincipalCV(c.support),name:T.stringAsciiCV(c.name),owner:T.stringAsciiCV(c.owner||''),issued:T.uintCV(c.issued),expires:T.uintCV(c.expires),amount:T.uintCV(c.amount)})};
}
export function signProfile(c,key){return T.signStructuredData({...profileData(c,'support'),privateKey:T.createStacksPrivateKey(key)}).data;}
export function verifyProfile(c,role,signature,address){
 try{
  if(typeof signature!=='string'||! /^[a-fA-F0-9]{130}$/.test(signature))return false;
  const hash=Array.from(sha256(T.encodeStructuredData(profileData(c,role))),v=>v.toString(16).padStart(2,'0')).join('');
  const publicKey=T.publicKeyFromSignatureRsv(hash,T.createMessageSignature(signature));
  return T.getAddressFromPublicKey(publicKey,T.TransactionVersion.Mainnet)===address;
 }catch{return false;}
}
