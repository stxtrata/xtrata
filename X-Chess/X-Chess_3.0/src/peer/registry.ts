import {deserialize,serializeUint} from '../../../X-Chess_2.0/packages/chain/clarity';
import {FORMAT,RULES,hex,checkOpening,insist,type Opening} from './protocol';
export type Config={network:string;registry:string;api:string;confirmations:number};
export async function read(config:Config,fn:string,args:string[]=[]):Promise<any>{
  insist(/^S[0-9A-Z]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(config.registry),'Invalid registry');
  const [address,name]=config.registry.split('.');
  const res=await fetch(`${config.api}/v2/contracts/call-read/${address}/${name}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify({sender:address,arguments:args})});
  insist(res.ok,'Registry API unavailable');const body=await res.json();insist(body.okay && typeof body.result==='string','Registry read failed');return deserialize(body.result);
}
export async function load(config:Config,game:number):Promise<{row:any;opening:Opening|null}>{
  insist(Number.isSafeInteger(game) && game>0,'Enter a positive game number');
  insist(await read(config,'get-format')===1n,'Unsupported registry');
  const row=await read(config,'get-game',[serializeUint(game)]);insist(row,'Game not found');
  insist(row.rules===1n,'Unsupported game rules');
  if(row['opponent-key']===null)return {row,opening:null};
  const cw=row['creator-white'];
  const opening:Opening={protocol:FORMAT,rules:RULES,network:config.network,registry:config.registry,game,
    white:cw?row.creator:row.opponent,black:cw?row.opponent:row.creator,
    whiteKey:hex(cw?row['creator-key']:row['opponent-key']),blackKey:hex(cw?row['opponent-key']:row['creator-key']),
    baseMs:Number(row['base-ms']),incrementMs:Number(row['increment-ms']),joinedHeight:Number(row['joined-height'])};
  await checkOpening(opening);
  const res=await fetch(config.api+'/v2/info',{signal:AbortSignal.timeout(15000)});insist(res.ok,'Cannot check chain tip');
  const info=await res.json();
  insist(info.network_id===(config.network==='mainnet'?1:2147483648),'API network does not match selected network');
  insist(Number.isSafeInteger(info.stacks_tip_height) && info.stacks_tip_height>=opening.joinedHeight+config.confirmations,'Waiting for game confirmations');
  return {row,opening};
}
