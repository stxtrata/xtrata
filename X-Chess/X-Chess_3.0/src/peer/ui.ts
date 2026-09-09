import {Position,WHITE} from './chess/engine';
import {FORMAT,MAX_BYTES,canonical,hash,hex,bytes,insist,replay,merge,sign,actionFor,completed,parseArchive,type Archive,type Opening,type Action,type Key} from './protocol';
import {Store} from './storage';import {Peer} from './transport';import {load,read,type Config} from './registry';
import {serializePrincipal,serializeBool,serializeBuffer,serializeUint} from '../../../X-Chess_2.0/packages/chain/clarity';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const value=(id:string)=>(el(id) as HTMLInputElement).value.trim();
const notice=(s:string)=>{el('status').textContent=s;};
const store=new Store();let opening:Opening|null=null,archive:Archive|null=null,key:Key|null=null;
let state:Awaited<ReturnType<typeof replay>>|null=null,peer:Peer|null=null,provider:any,address='',config:Config|null=null;
let selected='',cursor='a8',flipped=false,busy=false,preparedHash='',clockRunning=false,clockSeen=0,clockTurn='white',clockSeq=0,clocks={white:0,black:0};
const wallet=(globalThis as any).XChessWallet;
function settings():Config{
  const api=new URL(value('api'));insist(api.protocol==='https:' || (api.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(api.hostname)),'Use HTTPS or a local chain API');
  insist(!api.username && !api.password && !api.search && !api.hash,'Use a plain chain API URL');
  const confirmations=Number(value('confirmations'));insist(Number.isSafeInteger(confirmations)&&confirmations>=0,'Invalid confirmation count');
  return {network:value('network'),registry:value('registry'),api:api.href.replace(/\/$/,''),confirmations};
}
function download(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
async function run(fn:()=>Promise<void>|void){if(busy)return;busy=true;try{await fn();}catch(e){notice((e as Error).message);}finally{busy=false;render();}}
function on(id:string,fn:()=>Promise<void>|void){el(id).addEventListener('click',()=>void run(fn));}
function clockTick(){if(clockRunning){const now=performance.now();clocks[clockTurn as 'white'|'black']-=now-clockSeen;clockSeen=now;}const show=(ms:number)=>{const n=Math.ceil(Math.max(0,ms)/1000);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};el('clocks').textContent=opening?.baseMs?`White ${show(clocks.white)} · Black ${show(clocks.black)} · advisory`:'Untimed';}
async function refresh(){
  if(!archive||!opening)return;const previous=state;state=await replay(archive,opening);
  if(clockRunning && state.seq!==clockSeq){clockTick();
    for(const p of archive.events.slice(clockSeq))if(p.action.kind==='move')clocks[p.action.side]+=opening.incrementMs;
    clockSeq=state.seq;clockTurn=state.position.turn===WHITE?'white':'black';
    if(state.outcome)clockRunning=false;
  }
  if(previous?.root!==state.root){preparedHash='';el('publication').hidden=true;}
  render();
}
function render(){
  const position=state?.position??new Position(),board=el('board');const restoreFocus=board.contains(document.activeElement);board.replaceChildren();
  const sq=position.squares();if(flipped)sq.reverse();
  const glyphs=['','♙','♘','♗','♖','♕','♔','', '', '♟','♞','♝','♜','♛','♚'];
  for(const s of sq){const b=document.createElement('button');b.dataset.square=s.square;
    b.tabIndex=s.square===cursor?0:-1;
    b.onfocus=()=>{cursor=s.square;for(const cell of board.querySelectorAll<HTMLButtonElement>('button'))cell.tabIndex=cell===b?0:-1;};
    b.onkeydown=e=>{const index=sq.indexOf(s),offset:{[k:string]:number}={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};
      let next=e.key==='Home'?(e.ctrlKey?0:Math.floor(index/8)*8):e.key==='End'?(e.ctrlKey?63:Math.floor(index/8)*8+7):index+(offset[e.key]??0);
      if(e.key in offset || e.key==='Home'||e.key==='End'){e.preventDefault();next=Math.max(0,Math.min(63,next));(board.children[next] as HTMLButtonElement).focus();}
    };
    b.className=((s.square.charCodeAt(0)-97+Number(s.square[1]))%2===0?'light':'dark')+(selected===s.square?' selected':'');
    b.textContent=s.piece?glyphs[s.piece.type+(s.piece.color===WHITE?0:8)]:'';
    b.setAttribute('aria-label',s.square+(s.piece?' '+(s.piece.color===WHITE?'white ':'black ')+['','pawn','knight','bishop','rook','queen','king'][s.piece.type]:' empty'));
    b.onclick=()=>void run(async()=>{
      insist(archive&&opening&&key,'Load your joined game in the browser holding its key');
      if(!selected){selected=s.square;return;}
      let move=selected+s.square;selected='';
      const candidates=position.movesUci().filter(m=>m.startsWith(move));
      if(candidates.some(m=>m.length===5))move+=value('promotion');
      if(!candidates.includes(move)){selected=s.square;return;}
      await action('move',move);
    });board.append(b);
  }
  if(restoreFocus)board.querySelector<HTMLButtonElement>(`[data-square="${cursor}"]`)?.focus();
  el('position').textContent=state?`${state.outcome?state.outcome.result+' · '+state.outcome.termination:(position.turn===WHITE?'White':'Black')+' to move'} · ${state.seq} signed actions`: 'Load an on-chain game to play.';
  el('moves').textContent=archive?.events.map(p=>p.action.kind==='move'?p.action.move:p.action.kind).join(' ')??'';
  for(const id of ['export','invite','answer','sync'])(el(id) as HTMLButtonElement).disabled=!archive;
  (el('complete') as HTMLButtonElement).disabled=!state?.outcome;
  const myTurn=!!key && !!opening && !state?.outcome && key.public===opening[position.turn===WHITE?'whiteKey':'blackKey'];
  for(const id of ['resign','offer-draw','accept-draw'])(el(id) as HTMLButtonElement).disabled=!myTurn;
}
async function send(){insist(archive,'Load a game first');await peer?.send(canonical(archive));}
async function receive(text:string){
  insist(opening&&archive,'Load the same joined game first');const incoming=parseArchive(text),o=opening,id=await hash(o);
  try{await store.lock(id,async()=>{const local=await store.history(id)??archive!;const next=await merge(local,incoming,o);await store.put('games',id,next);archive=next;});}
  catch(e){await store.put('games','evidence:'+id+':'+await hash(incoming),incoming);throw e;}
  await refresh();notice(state?.outcome?'Completed game verified. Either player can prepare the record.':'Signed history verified and saved.');
}
async function action(kind:Action['kind'],move=''){
  insist(opening&&archive&&key,'Your registered game key is unavailable');const o=opening,k=key,id=await hash(o);
  await store.lock(id,async()=>{
    const local=await store.history(id)??archive!,a=await actionFor(local,o,kind,move);
    insist(k.public===o[a.side==='white'?'whiteKey':'blackKey'],'Wait for your turn');
    const next={...local,events:[...local.events,await sign(a,k)]};await replay(next,o);
    await store.put('games',id,next);archive=next;
  });
  await refresh();notice('Signed action saved. Send the history manually if the peer is disconnected.');
  if(peer?.channel?.readyState==='open')await send();
}
async function transact(c:Config,functionName:string,functionArgs:string[]){
  insist(provider&&address,'Connect your wallet first');insist(await wallet.connect(provider,c.network)===address,'Wallet changed; reconnect');
  const result=await wallet.sign(provider,{contract:c.registry,functionName,functionArgs,network:c.network,postConditions:[]});
  const txid=result?.txid??result?.txId??result?.result?.txid??result?.result?.txId;
  insist(typeof txid==='string'&&/^(0x)?[0-9a-fA-F]{64}$/.test(txid),'No transaction ID returned. Check the wallet before retrying.');
  notice(`Submitted ${functionName}: ${txid}. Wait for confirmation before loading the game.`);
}
const providers=wallet.providers();for(let i=0;i<providers.length;i++){const option=document.createElement('option');option.value=String(i);option.textContent=providers[i].name;el('provider').append(option);}
on('wallet',async()=>{provider=providers[Number(value('provider'))]?.get();insist(provider,'No wallet detected; open in a wallet-enabled browser');address=await wallet.connect(provider,value('network'));el('address').textContent=address;notice('Wallet connected.');});
on('create',async()=>{
  const c=settings();insist(address,'Connect your wallet first');const opponent=value('opponent').toUpperCase();insist(opponent!==address,'Choose another player');const p=serializePrincipal(opponent);
  insist(await read(c,'get-format')===1n,'Peer registry unavailable');
  const k=await store.key(),[base,inc]=value('clock').split(',').map(Number);
  await transact(c,'create-game',[p,serializeBool(value('colour')==='white'),serializeBuffer(k.public),serializeUint(1),serializeUint(base),serializeUint(inc)]);
});
on('join',async()=>{const c=settings(),game=Number(value('game'));const {row}=await load(c,game);insist(row.opponent===address && row['opponent-key']===null,'Only the invited opponent may join an open game');const k=await store.key();await transact(c,'join-game',[serializeUint(game),serializeBuffer(k.public)]);});
on('load',async()=>{
  peer?.close();peer=null;opening=null;archive=null;state=null;key=null;clockRunning=false;preparedHash='';el('publication').hidden=true;
  config=settings();const game=Number(value('game'));const result=await load(config,game);
  el('match').textContent=`Game ${game} · ${result.row.creator} vs ${result.row.opponent}`;
  if(!result.opening){notice('Waiting for the named opponent to join on chain.');return;}
  opening=result.opening;const id=await hash(opening);archive=await store.history(id)??{format:FORMAT,opening,events:[]};
  const candidates=address===opening.white?[opening.whiteKey]:address===opening.black?[opening.blackKey]:[opening.whiteKey,opening.blackKey];
  for(const publicKey of candidates){const secret=await store.get('keys',publicKey);if(secret){key={public:publicKey,secret};break;}}
  await refresh();flipped=key?.public===opening.blackKey;notice(key?'Game loaded. Pair browsers or import the opponent’s signed history.':'Verified opening loaded for viewing. This browser has no registered game key.');
});
on('flip',()=>{flipped=!flipped;});
on('resign',async()=>{if(confirm('Sign a final resignation for this game?'))await action('resign');});
on('offer-draw',()=>action('offer-draw'));on('accept-draw',()=>action('accept-draw'));
on('start-clock',()=>{insist(opening&&state&&!state.outcome,'Load an unfinished game');clocks={white:opening.baseMs,black:opening.baseMs};clockTurn=state.position.turn===WHITE?'white':'black';clockSeq=state.seq;clockSeen=performance.now();clockRunning=opening.baseMs>0;clockTick();});
on('export',()=>{insist(archive,'Load a game');download('xchess-peer-'+archive.opening.game+'.json',canonical(archive));});
el('import').addEventListener('change',()=>void run(async()=>{const file=(el('import') as HTMLInputElement).files?.[0];insist(file&&file.size<=MAX_BYTES,'Choose a record smaller than 2 MB');await receive(await file.text());(el('import') as HTMLInputElement).value='';}));
on('complete',async()=>{insist(archive&&opening,'Load a game');const s=await completed(archive,opening);preparedHash=s.archiveHash;el('digest').textContent=`${s.outcome!.result} · ${s.outcome!.termination}\nFinal history: ${s.root}\nCanonical archive SHA-256: ${s.archiveHash}`;el('publication').hidden=false;download('xchess-peer-'+opening.game+'-completed.json',canonical(archive));notice('Completed record verified and downloaded. No opponent approval is needed.');});
on('record',async()=>{insist(archive&&opening&&config&&preparedHash,'Prepare the completed record first');const s=await completed(archive,opening);insist(s.archiveHash===preparedHash,'Record changed; prepare it again');const id=Number(value('inscription'));insist(value('inscription')!==''&&Number.isSafeInteger(id)&&id>=0,'Enter the sealed inscription number');await transact(config,'record-archive',[serializeUint(opening.game),serializeUint(id),serializeBuffer(bytes(preparedHash))]);});
function newPeer(){peer?.close();const ice=JSON.parse(value('ice'));insist(Array.isArray(ice)&&ice.length<=8,'Use an ICE server JSON array');peer=new Peer(ice,text=>{
  // Queue incoming records behind UI actions; never discard a move because a button is busy.
  if(incomingCount>=4){peer?.close();notice('Peer sent too many pending records. Reconnect or import manually.');return;}
  incomingCount++;
  incomingQueue=incomingQueue.then(async()=>{try{while(busy)await new Promise(r=>setTimeout(r,20));await run(()=>receive(text));}finally{incomingCount--;}});
},text=>{el('connection').textContent=text;},()=>{void send().catch(e=>notice(e.message));});return peer;}
let incomingQueue=Promise.resolve(),incomingCount=0;
async function signal(){insist(opening,'Load a joined game');const text=value('signal-in');insist(text.length<=100000,'Connection message too large');const v=JSON.parse(text);insist(v.format===FORMAT && v.match===await hash(opening),'Connection message is for another game');return v.sdp;}
async function output(sdp:RTCSessionDescriptionInit|null){insist(opening&&sdp,'No connection description');(el('signal-out') as HTMLTextAreaElement).value=JSON.stringify({format:FORMAT,match:await hash(opening),sdp});notice('Connection message ready. Copy it and send it privately to your opponent.');}
on('invite',async()=>{insist(archive,'Load a joined game');await output(await newPeer().offer());});
on('answer',async()=>{const sdp=await signal();await output(await newPeer().answer(sdp));});
on('finish',async()=>{insist(peer,'Make an invitation first');await peer.finish(await signal());});
on('copy',async()=>{await navigator.clipboard.writeText(value('signal-out'));notice('Connection message copied.');});
on('sync',send);on('disconnect',()=>{peer?.close();peer=null;});
(el('registry') as HTMLInputElement).value='STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.xchess-peer-v1';
(el('api') as HTMLInputElement).value='http://localhost:3999';
setInterval(clockTick,250);render();
