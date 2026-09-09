import { renderBoard, promotionChoices } from '../ui/board.js';
import { Position } from '../chess/engine.js';
import { connectWallet } from '../wallet/connect.js';
import { waitForProvider } from '../wallet/providers.js';
import type { ProviderEntry } from '../wallet/providers.js';
import { walletCall, contractCallParams } from '../wallet/requests.js';
import { canonical, check, hash, parseBounded, sign, same, encode, publicKey } from './crypto.js';
import type { Signed } from './crypto.js';
import { descriptor, archive, verifyArchive, replay, actorTurn, inviteDemo, verifyDemoInvite, demoOpening, MAX_BYTES } from './protocol.js';
import type { Game, Archive, Side, Network, DemoInvite, DemoJoin, Replay } from './protocol.js';
import { Journal } from './store.js';
import { PeerTransport } from './transport.js';
import { PeerRegistry, createArgs, joinArgs } from './registry.js';
import type { Invitation } from './registry.js';
import { sha256Hex } from '../protocol/sha256.js';

const HTML=`<header class="peer-header"><h2>Quick Play · peer-to-peer</h2><button data-p="close">Close</button></header>
<p>Signed moves, no move transactions. Direct connection or manual exchange. Clocks are advisory.</p>
<p data-p="status" role="status" aria-live="polite">Create a demonstration or load a registered game.</p>
<div class="layout"><section><p data-p="identity"></p><div data-p="clocks" class="mono"></div><div id="peer-board" data-p="board" class="board" role="grid" aria-label="Peer chessboard"></div><p data-p="position"></p><div data-p="promotion" hidden><label>Promotion <select data-p="piece"><option value="q">Queen</option><option value="r">Rook</option><option value="b">Bishop</option><option value="n">Knight</option></select></label><button data-p="promote">Promote</button><button data-p="cancel-promotion">Cancel</button></div><div class="peer-actions"><button data-p="flip">Flip board</button><button data-p="resign" disabled>Resign…</button><button data-p="refresh">Refresh saved history</button></div><div data-p="resignation" hidden><p>Sign a resignation at this position? Publication will not need another approval.</p><button data-p="confirm-resign">Sign resignation</button><button data-p="cancel-resign">Keep playing</button></div><p data-p="dispute" class="notice" hidden></p><label>Replay move <input data-p="replay" type="range" min="0" max="0" value="0" disabled></label><div data-p="history" class="mono peer-history"></div></section>
<section><div class="panel"><h2>Start or resume</h2><label>Advisory clock <select data-p="clock"><option value="0,0" selected>Untimed</option><option value="180000,2000">3 minutes + 2 seconds · advisory</option><option value="300000,3000">5 minutes + 3 seconds · advisory</option><option value="600000,5000">10 minutes + 5 seconds · advisory</option></select></label><button data-p="demo">Create demo invitation</button><button data-p="resume">Resume saved game</button><p>A demonstration uses two locally generated game keys. It does not verify Stacks identities. Send the invitation below; the other browser imports it and returns a join response.</p><details><summary>Register named players on chain</summary><p>This candidate includes an undeployed peer registry. Enter its address after deployment. Each player signs one setup transaction; actual network fees are shown by the wallet.</p><label>Network <select data-p="network"><option value="mainnet">Mainnet</option><option value="testnet">Testnet</option><option value="devnet">Devnet</option></select></label><label>Peer registry contract <input data-p="registry" placeholder="SP….xchess-peer-v1" autocomplete="off"></label><button data-p="wallet">Connect wallet</button><p data-p="wallet-address"></p><label>Opponent address <input data-p="opponent" autocomplete="off"></label><label>Your colour <select data-p="colour"><option value="white">White</option><option value="black">Black</option></select></label><button data-p="create">Create registered game</button><label>Game number or setup transaction ID <input data-p="game-id" autocomplete="off"></label><button data-p="load">Load registered game</button><button data-p="restore-setup">Restore setup transaction</button><p data-p="settings"></p><button data-p="join" disabled>Accept settings & join</button></details></div>
<div class="panel"><h2>Connect directly</h2><p data-p="connection" role="status">No peer connection. Signed-message exchange always remains available.</p><button data-p="offer" disabled>Create connection offer</button><button data-p="answer" disabled>Answer pasted offer</button><button data-p="accept-answer" disabled>Accept pasted answer</button><button data-p="disconnect">Disconnect</button><details><summary>Optional connection aids</summary><p>There is no default signaling or relay service. STUN can help discover a direct route; TURN relays traffic using an account you supply. They may be unavailable. Descriptions may reveal network addresses. Never inscribe them.</p><label>Optional STUN <input data-p="stun" placeholder="stun:your-server:3478"></label><label>Optional TURN <input data-p="turn" placeholder="turn:your-relay:3478"></label><label>TURN username <input data-p="turn-user" autocomplete="off"></label><label>TURN credential <input data-p="turn-password" type="password" autocomplete="off"></label></details></div>
<div class="panel"><h2>Manual exchange</h2><label>Paste invitation, signed message, or connection description <textarea data-p="input" rows="4" spellcheck="false"></textarea></label><button data-p="import">Import signed message</button><button data-p="export-message" disabled>Export signed message</button><label data-p="output-label">Message to send <textarea data-p="output" rows="4" readonly spellcheck="false"></textarea></label><button data-p="copy">Copy message</button><button data-p="download-message">Download message</button><label>Import message file <input data-p="message-file" type="file" accept=".json,application/json"></label></div>
<div class="panel"><h2>Archives and recovery</h2><button data-p="review" disabled>Review & Inscribe</button><button data-p="public" disabled>Download public archive</button><label>Open public archive offline <input data-p="archive-file" type="file" accept=".json,application/json"></label><button data-p="verify-opening" disabled>Verify opening on chain</button><p data-p="verification"></p><details><summary>Encrypted private recovery save</summary><p>This save contains your private game key and signing reservations. Use a strong password and keep it separate from public archives. It cannot spend wallet funds. An old backup cannot reveal actions made after it was saved; avoid running the same restored game key on multiple devices.</p><label>Recovery password <input data-p="password" type="password" autocomplete="new-password"></label><button data-p="backup" disabled>Download encrypted recovery</button><label>Restore encrypted recovery <input data-p="recovery-file" type="file" accept=".json,application/json"></label></details></div></section></div>
<dialog data-p="review-dialog"><h2>Completed signed game</h2><p data-p="review-text"></p><p>Either player can publish. No loser approval or terminal countersignature is required. This proves this signed line, not the absence of another branch.</p><button data-p="download-final">Download inscription JSON</button><a href="https://xtrata.xyz/" target="_blank" rel="noopener noreferrer">Open Xtrata uploader</a><p>Upload the downloaded JSON through Xtrata. Inscription may require several transactions. After sealing, download the inscribed bytes and open them here to compare the SHA-256 and verify the signed game.</p><button data-p="close-review">Close review</button></dialog>`;
function download(name:string,text:string):void {const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export class PeerApp {
  readonly dialog:HTMLDialogElement;
  readonly journal=new Journal();
  private game:Game|null=null;private verified:Replay|null=null;private actor:Side|null=null;private selected:string|null=null;private promotion:string|null=null;
  private flipped=false;private busy=false;private readOnly=false;private chainVerified=false;private address='';private invitation:Invitation|null=null;
  private transport:PeerTransport|null=null;private generation=0;private viewRevision=0;private timer:ReturnType<typeof setInterval>;
  private clock:{white:number;black:number;turn:Side;seen:number;running:boolean}|null=null;
  constructor(doc:Document=document) {
    this.dialog=doc.createElement('dialog');this.dialog.id='xchess-peer';this.dialog.setAttribute('aria-label','Peer-to-peer Quick Play');this.dialog.innerHTML=HTML;for(const b of this.dialog.querySelectorAll('button'))b.classList.add('action');doc.body.append(this.dialog);
    const style=doc.createElement('style');style.textContent='#xchess-peer{width:min(1120px,98vw);max-height:96vh;overflow:auto;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:10px}#xchess-peer::backdrop{background:#000b}#xchess-peer label{display:block;margin:8px 0}#xchess-peer input:not([type=range]):not([type=file]),#xchess-peer textarea{display:block;width:100%;max-width:100%;background:var(--panel);color:var(--ink);border:1px solid var(--line);padding:8px}#xchess-peer button.action{margin:3px}#xchess-peer summary{cursor:pointer;min-height:36px}#xchess-peer [data-p=clocks]{font-size:18px;margin-bottom:8px}.peer-header,.peer-actions{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.peer-history{max-height:160px;overflow:auto}#xchess-peer [data-p=review-dialog]{max-width:min(650px,94vw);background:var(--panel);color:var(--ink)}';doc.head.append(style);
    this.on('close',()=>this.dialog.close());this.dialog.addEventListener('close',()=>{if(this.clock)this.clock.running=false;});
    this.on('demo',()=>this.createDemo());this.on('resume',()=>this.resume());this.on('wallet',()=>this.connectWallet());
    this.on('restore-setup',()=>this.restoreSetup());this.on('create',()=>this.createRegistered());this.on('load',()=>this.loadRegistered());this.on('join',()=>this.joinRegistered());
    this.on('flip',()=>{this.flipped=!this.flipped;this.render();});this.on('refresh',()=>this.refresh());
    this.on('resign',()=>{this.el('resignation').hidden=false;this.el('confirm-resign').focus();});this.on('cancel-resign',()=>{this.el('resignation').hidden=true;});
    this.on('confirm-resign',async()=>{await this.act('resignation');this.el('resignation').hidden=true;});
    this.on('promote',async()=>{check(this.promotion,'No promotion selected');await this.act('move',this.promotion+this.value('piece'));this.promotion=null;this.el('promotion').hidden=true;});
    this.on('cancel-promotion',()=>{this.promotion=null;this.el('promotion').hidden=true;this.el('board').focus();});
    this.on('import',()=>this.importMessage(this.value('input')));this.on('export-message',()=>this.exportMessage());
    this.on('copy',async()=>{const out=this.el<HTMLTextAreaElement>('output');try{await navigator.clipboard.writeText(out.value);this.notice('Message copied.');}catch{out.focus();out.select();this.notice('Copy the selected text with your browser’s Copy command.');}});
    this.on('download-message',()=>{check(this.value('output'),'No message to download');download('xchess-peer-message.json',this.value('output'));});
    this.on('offer',async()=>{const t=await this.connection();this.output(canonical(await t.offer(this.networkOptions())),'Connection offer — temporary; never inscribe');});
    this.on('answer',async()=>{const t=await this.connection();this.output(canonical(await t.answer(this.value('input'),this.networkOptions())),'Connection answer — temporary; never inscribe');});
    this.on('accept-answer',async()=>{check(this.transport,'Create an offer first');await this.transport.acceptAnswer(this.value('input'));});
    this.on('disconnect',()=>{this.transport?.close();this.transport=null;this.el('connection').textContent='Disconnected. The game is saved; manual exchange still works.';});
    this.on('public',()=>this.downloadArchive());this.on('review',()=>this.review());this.on('download-final',()=>this.downloadArchive());this.on('close-review',()=>this.el<HTMLDialogElement>('review-dialog').close());
    this.on('verify-opening',()=>this.verifyOpening());
    this.on('backup',async()=>{check(this.game,'No saved game');const text=await this.journal.exportRecovery(hash(this.game.opening),this.value('password'));download('xchess-peer-private-recovery.json',text);this.el<HTMLInputElement>('password').value='';this.notice('Encrypted private recovery saved. Do not inscribe this file.');});
    this.file('message-file',text=>this.importMessage(text),MAX_BYTES);this.file('archive-file',text=>this.openArchive(text),MAX_BYTES);
    this.file('recovery-file',async text=>{const game=await this.journal.importRecovery(text,this.value('password'));this.el<HTMLInputElement>('password').value='';await this.useGame(game,false,false);this.notice('Private recovery restored. Synchronize the latest signed history with your peer before continuing.');},4_000_000);
    this.el<HTMLInputElement>('replay').addEventListener('input',()=>this.render());
    this.timer=setInterval(()=>{if(this.dialog.open)this.drawClock();},250);this.render();
  }
  private el<T extends HTMLElement=HTMLElement>(name:string):T {return this.dialog.querySelector(`[data-p="${name}"]`)! as T;}
  private value(name:string):string{return this.el<HTMLInputElement>(name).value.trim();}
  private on(name:string,fn:()=>unknown|Promise<unknown>):void{this.el(name).addEventListener('click',()=>{void this.run(fn);});}
  private file(name:string,fn:(text:string)=>Promise<unknown>,limit:number):void{this.el<HTMLInputElement>(name).addEventListener('change',()=>{void this.run(async()=>{const file=this.el<HTMLInputElement>(name).files?.[0];if(file){check(file.size<=limit,'File is too large');await fn(await file.text());}this.el<HTMLInputElement>(name).value='';});});}
  private async run(fn:()=>unknown|Promise<unknown>):Promise<void>{if(this.busy)return;this.busy=true;this.render();try{await fn();}catch(e){this.notice(e instanceof Error?e.message:String(e));}finally{this.busy=false;this.render();}}
  private notice(text:string):void{this.el('status').textContent=text;}
  private output(text:string,label='Signed message to send'):void {this.el<HTMLTextAreaElement>('output').value=text;this.el('output-label').firstChild!.textContent=label+' ';}
  open():void{this.dialog.showModal();if(this.clock){this.clock.seen=performance.now();this.clock.running=true;}this.render();}
  destroy():void{this.generation++;this.transport?.close();clearInterval(this.timer);this.dialog.remove();}
  private clockSettings():[number,number]{return this.value('clock').split(',').map(Number) as [number,number];}
  async createDemo():Promise<void>{
    const key=await this.journal.createKey(),[base,inc]=this.clockSettings(),invite=await inviteDemo(descriptor(base,inc),key);
    await this.journal.setMeta('pending-demo',invite);this.output(canonical(invite),'Demo invitation — send to the other browser');this.notice('Demo invitation saved. The other player imports it and sends their join response back.');
  }
  async importMessage(text:string):Promise<void>{
    const data=parseBounded(text,MAX_BYTES) as Archive|Signed<DemoInvite>|Signed<DemoJoin>;
    if('payload' in data&&data.payload?.format==='xchess-peer-demo-invite-v1'){
      const invite=data as Signed<DemoInvite>;await verifyDemoInvite(invite);check(!await this.journal.key(invite.payload.whiteKey),'This is your own invitation. Send it to the other player.');
      const saved=await this.journal.meta<Signed<DemoJoin>>('demo-response:'+hash(invite.payload));
      let join=saved;
      if(!join){const key=await this.journal.createKey();join=await sign({format:'xchess-peer-demo-join-v1',invite,blackKey:key.public},key.secret);await this.journal.setMeta('demo-response:'+hash(invite.payload),join);}
      const opening=await demoOpening(join);await this.journal.acceptDemo(opening.descriptor.nonce,hash(opening));
      const game=await this.journal.start(opening);await this.journal.setMeta('actor:'+hash(opening),'black');await this.useGame(game,false,false);
      this.output(canonical(join),'Demo join response — send back to the creator');this.notice('Demo joined as Black. Return this response, then connect or exchange signed moves.');return;
    }
    if('payload' in data&&data.payload?.format==='xchess-peer-demo-join-v1'){
      const join=data as Signed<DemoJoin>,opening=await demoOpening(join),pending=await this.journal.meta<Signed<DemoInvite>>('pending-demo');
      check(pending,'No matching locally created invitation');same(pending.payload,join.payload.invite.payload,'Join response belongs to another invitation');check(await this.journal.key(opening.white.key),'Creator game key is unavailable');
      await this.journal.acceptDemo(opening.descriptor.nonce,hash(opening));const game=await this.journal.start(opening);await this.journal.setMeta('actor:'+hash(opening),'white');await this.useGame(game,false,false);this.notice('Demo joined as White. Connect directly or make a move and export its signed message.');return;
    }
    const incoming=data as Archive;await verifyArchive(incoming);
    check(this.game,'Open a saved game or public archive first; a game invitation must be joined separately');same(incoming.opening,this.game.opening,'Message belongs to another game');
    await this.journal.receive(this.game);
    const current=await this.journal.receive({opening:incoming.opening,line:incoming.line,branches:incoming.branches});
    await this.useGame(current,this.chainVerified,this.readOnly,true);this.notice(current.branches.length||this.verified?.summary.status==='disputed'?'Conflicting signed evidence preserved. This game is disputed.':'Signed history verified and saved.');
  }
  async openArchive(text:string):Promise<void>{
    const a=parseBounded(text,MAX_BYTES) as Archive;await verifyArchive(a);
    await this.useGame({opening:a.opening,line:a.line,branches:a.branches},false,true);
    this.el('verification').textContent=`Public archive signatures and replay valid. ${a.opening.kind==='demo'?'Local demo; no verified Stacks identities.':'Chain opening not yet verified.'} File SHA-256: ${sha256Hex(text)}`;
    this.notice('Public archive opened offline. No connection or private key is needed to verify its signed line.');
  }
  async restoreSetup():Promise<void>{
    const pending=await this.journal.meta<{registry:string;network:string;txid:string}>('pending-setup');check(pending,'No saved setup transaction');
    for(const field of ['registry','network'] as const)this.el<HTMLInputElement>(field).value=pending[field];
    this.el<HTMLInputElement>('game-id').value=pending.txid;this.invitation=null;
    this.notice('Setup transaction restored. Load it to check confirmation; nothing has been resubmitted.');
  }
  async resume():Promise<void>{
    const match=await this.journal.meta<string>('last-game');
    if(!match){const invite=await this.journal.meta<Signed<DemoInvite>>('pending-demo');check(invite,'No saved game on this device');this.output(canonical(invite),'Saved demo invitation');this.notice('Saved invitation restored.');return;}
    const game=await this.journal.get(match);check(game,'Saved game not found');await this.useGame(game,false,false);this.notice(game.opening.kind==='chain'?'Saved history restored. Verify the chain opening to enable play.':'Saved demo restored. Reconnect or continue signed-message exchange.');
  }
  private async useGame(game:Game,verified:boolean,readOnly:boolean,keep=false):Promise<void>{
    const revision=++this.viewRevision,r=await replay(game);let actor:Side|null=null;
    if(!readOnly){
      const preferred=await this.journal.meta<Side>('actor:'+hash(game.opening));
      for(const side of (preferred?[preferred,preferred==='white'?'black':'white']:['white','black']) as Side[])if(await this.journal.key(game.opening[side].key)){actor=side;break;}
      if(revision!==this.viewRevision)return;
      await this.journal.setMeta('last-game',hash(game.opening));
    }
    if(revision!==this.viewRevision)return;
    const changed=!this.game||hash(this.game.opening)!==hash(game.opening),oldMoves=this.game?.line.moves.length??0;
    if(changed||!keep){this.generation++;this.transport?.close();this.transport=null;}
    this.tickClock();this.game=game;this.verified=r;this.chainVerified=verified;this.readOnly=readOnly;this.selected=null;this.actor=actor;
    if(changed||!keep||!this.clock)this.clock={white:game.opening.descriptor.clock.baseMs,black:game.opening.descriptor.clock.baseMs,turn:actorTurn(r.position),seen:performance.now(),running:this.dialog.open};
    else {
      this.tickClock();if(game.line.moves.length===oldMoves+1)this.clock[this.clock.turn]+=game.opening.descriptor.clock.incrementMs;
      this.clock.turn=actorTurn(r.position);this.clock.seen=performance.now();
    }
    const slider=this.el<HTMLInputElement>('replay');slider.max=String(game.line.moves.length);slider.value=slider.max;
    this.flipped=this.actor==='black';this.render();
  }
  async refresh():Promise<void>{check(this.game,'No active game');const game=await this.journal.get(hash(this.game.opening));check(game,'No saved copy on this device');await this.useGame(game,this.chainVerified,this.readOnly,true);this.notice('Saved signed history refreshed.');}
  private playable():boolean{return !!this.game&&!!this.actor&&!this.readOnly&&(this.game.opening.kind==='demo'||this.chainVerified)&&this.verified?.summary.status==='unfinished';}
  async act(kind:'move'|'resignation',value=''):Promise<void>{
    check(this.playable()&&this.game&&this.actor,'Resume your game and verify its opening before signing');const token=this.generation;
    const game=await this.journal.act(hash(this.game.opening),this.actor,kind,value,hash(this.game));if(token!==this.generation)return;
    await this.useGame(game,this.chainVerified,false,true);
    this.notice(this.verified?.summary.status==='finished'?'Finished result saved. It can be published without opponent approval.':'Your signed action was saved before sending.');
    await this.exportMessage();await this.sendCurrent();
  }
  private square(square:string):void{void this.run(async()=>{
    check(this.playable()&&this.verified&&actorTurn(this.verified.position)===this.actor,'It is not your turn');const legal=this.verified.position.movesUci();
    if(this.selected){const prefix=this.selected+square;if(promotionChoices(legal,this.selected,square).length){this.promotion=prefix;this.el('promotion').hidden=false;this.el('piece').focus();return;}if(legal.includes(prefix)){await this.act('move',prefix);return;}}
    this.selected=legal.some(m=>m.startsWith(square))?square:null;
  });}
  async exportMessage():Promise<void>{check(this.game,'No game to export');this.output(canonical(await archive(this.game)),'Public signed game message — no private keys');}
  private async sendCurrent():Promise<void>{if(this.transport?.connected&&this.game){try{await this.transport.send(canonical(await archive(this.game)));}catch(e){this.el('connection').textContent=`${e instanceof Error?e.message:e}. Your signed history remains saved.`;}}}
  private networkOptions(){return {stun:this.value('stun'),turn:this.value('turn'),username:this.value('turn-user'),credential:this.value('turn-password')};}
  private async connection():Promise<PeerTransport>{
    check(this.game&&this.actor&&!this.readOnly,'Resume a game with your private game key first');
    check(this.game.opening.kind==='demo'||this.chainVerified,'Verify the joined chain opening first');
    if(this.transport)return this.transport;const key=await this.journal.key(this.game.opening[this.actor].key);check(key,'Private game key unavailable');const opening=this.game.opening,token=this.generation;
    this.transport=new PeerTransport(opening,this.actor,key,async text=>{
      if(token!==this.generation)return;const a=parseBounded(text,MAX_BYTES) as Archive;await verifyArchive(a);same(a.opening,opening,'Peer sent another game');
      const incoming:Game={opening:a.opening,line:a.line,branches:a.branches},merged=await this.journal.receive(incoming);if(token!==this.generation)return;
      await this.useGame(merged,this.chainVerified,false,true);
      this.notice(this.verified?.summary.status==='disputed'?'Conflicting evidence preserved. No unique result is claimed.':this.verified?.summary.status==='finished'?'Finished signed result saved. Either player can publish.':'Peer’s signed history verified and saved.');
      if(hash(merged)!==hash(incoming))await this.sendCurrent();
    },text=>{if(token===this.generation)this.el('connection').textContent=text;},()=>{if(token===this.generation)void this.sendCurrent();});return this.transport;
  }
  private registry():PeerRegistry{return new PeerRegistry(this.value('registry'),this.value('network') as Network);}
  async connectWallet():Promise<void>{await waitForProvider();this.address=(await connectWallet()).address;this.el('wallet-address').textContent=this.address;}
  private async sendSetup(registry:PeerRegistry,fn:string,args:string[]):Promise<void>{
    check(this.address,'Connect your wallet first');await waitForProvider();const session=await connectWallet();check(session.address===this.address,'Wallet changed; reconnect before signing');
    check(registry.network==='mainnet'?this.address.startsWith('SP'):this.address.startsWith('ST'),'Wallet address is on the wrong network');
    const {result}=await walletCall('stx_callContract',(provider:ProviderEntry)=>contractCallParams(provider,{contract:registry.registry,functionName:fn,functionArgs:args,network:registry.network,postConditionMode:'deny',postConditions:[]}));
    const r=result as {txid?:string;txId?:string;result?:{txid?:string;txId?:string}};const txid=r.txid??r.txId??r.result?.txid??r.result?.txId;
    check(typeof txid==='string'&&/^(0x)?[0-9a-fA-F]{64}$/.test(txid),'Wallet result is uncertain. Check the wallet before submitting again.');
    this.el<HTMLInputElement>('game-id').value=txid;await this.journal.setMeta('pending-setup',{registry:registry.registry,network:registry.network,txid});
    this.notice(`Setup transaction submitted: ${txid}. Load it after confirmation; no automatic rebroadcast will occur.`);
  }
  async createRegistered():Promise<void>{
    const registry=this.registry();check(this.address,'Connect your wallet first');check(await registry.chain.callReadOnly('get-peer-format')===1n,'Peer registry is not deployed or unsupported');
    const [base,inc]=this.clockSettings(),d=descriptor(base,inc),key=await this.journal.createKey();check(this.value('opponent')!==this.address,'Choose a different opponent');
    await this.sendSetup(registry,'create-peer-game',createArgs(this.value('opponent'),this.value('colour')==='white',key.public,d));
  }
  async loadRegistered():Promise<void>{
    this.invitation=null;const registry=this.registry(),id=await registry.resolve(this.value('game-id')),row=await registry.game(id);await publicKey(row.creatorKey);this.invitation=row;this.el<HTMLInputElement>('game-id').value=String(id);
    this.el('settings').textContent=`Game ${id}: ${row.creator} (${row.creatorWhite?'White':'Black'}) vs ${row.opponent}. ${row.descriptor.clock.baseMs===0?'Untimed':`${row.descriptor.clock.baseMs/60000} minutes + ${row.descriptor.clock.incrementMs/1000} seconds, advisory`}. Initial position: ${row.descriptor.initialFen}. Settings hash ${row.descriptorHash}.`;
    if(!row.opponentKey){this.notice('The named opponent can review these settings and join.');return;}
    const opening=await registry.confirmed(id),game=await this.journal.start(opening);await this.useGame(game,true,false);this.notice('Joined chain opening confirmed. Moves now need no chain requests.');
  }
  async joinRegistered():Promise<void>{check(this.invitation&&this.address===this.invitation.opponent&&!this.invitation.opponentKey,'Only the named opponent can join');const registry=this.registry();const fresh=await registry.game(this.invitation.game);same(fresh,this.invitation,'Invitation changed; reload and review settings');const key=await this.journal.createKey();await this.sendSetup(registry,'join-peer-game',joinArgs(this.invitation,key.public));}
  async verifyOpening():Promise<void>{
    check(this.game?.opening.kind==='chain','Local demos do not have on-chain identities');const o=this.game.opening,registry=new PeerRegistry(o.registry,o.network as Network);same(await registry.confirmed(o.game),o,'Opening read-back mismatch');this.chainVerified=true;this.el('verification').textContent='Joined registry, named wallet identities, settings and game keys verified on chain. Signatures and replay checked independently.';
  }
  async downloadArchive():Promise<void>{check(this.game,'No game record');const a=await archive(this.game),text=canonical(a)+'\n';check(encode(a).length<=MAX_BYTES,'Archive too large');download(`xchess-peer-${a.final.status}-${a.final.root.slice(0,12)}.json`,text);}
  async review():Promise<void>{check(this.game&&this.verified?.summary.status==='finished','Only a completed, undisputed signed line can use this inscription review');const a=await archive(this.game),text=canonical(a)+'\n',size=new TextEncoder().encode(text).length;this.el('review-text').textContent=`${a.final.result} · ${a.final.termination}. ${a.opening.kind==='demo'?'Demonstration: no verified Stacks identities.':this.chainVerified?'Opening verified on chain.':'Opening has not been verified on chain in this session.'} ${size.toLocaleString()} bytes, ${Math.ceil(size/16384)} Xtrata chunks. SHA-256: ${sha256Hex(text)}. History hash: ${a.final.root}.`;this.el<HTMLDialogElement>('review-dialog').showModal();}
  private tickClock():void{if(!this.clock)return;const now=performance.now();if(this.clock.running&&this.verified?.summary.status==='unfinished')this.clock[this.clock.turn]=Math.max(0,this.clock[this.clock.turn]-(now-this.clock.seen));this.clock.seen=now;}
  private drawClock():void{this.tickClock();if(!this.game?.opening.descriptor.clock.baseMs){this.el('clocks').textContent='Untimed';return;}const fmt=(ms:number)=>{const sec=Math.ceil(Math.max(0,ms)/1000);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;};this.el('clocks').textContent=`Advisory · White ${fmt(this.clock?.white??0)} · Black ${fmt(this.clock?.black??0)}. Resets on reload; pauses when this view closes. Expiration never awards a win.`;}
  private render():void{
    const canMove=this.playable()&&!this.busy&&actorTurn(this.verified!.position)===this.actor;
    let position=this.verified?.position??new Position();const slider=this.el<HTMLInputElement>('replay'),index=Number(slider.value);
    if(this.game&&(this.readOnly||this.verified?.summary.status!=='unfinished')&&index<this.game.line.moves.length){position=new Position(this.game.opening.descriptor.initialFen);for(const m of this.game.line.moves.slice(0,index))position.applyUci(m.payload.value);}
    renderBoard(this.el('board'),{position,legalMoves:canMove?position.movesUci():[],flipped:this.flipped,selected:this.selected,lastMove:null,readOnly:!canMove},{onSquare:sq=>this.square(sq)});
    this.el('identity').textContent=this.game?`${this.game.opening.kind==='demo'?'Local demo · no verified Stacks identities':this.chainVerified?'Registered opening verified':'Opening not verified on chain'} · ${this.actor?`You: ${this.actor}`:'Replay viewer'}`:'No active game';
    this.el('position').textContent=this.verified?`${this.verified.summary.result} · ${this.verified.summary.termination??actorTurn(this.verified.position)+' to move'}`:'Starting position';
    this.el('history').textContent=position.pgnMoveText();
    this.el('dispute').hidden=this.verified?.summary.status!=='disputed';this.el('dispute').textContent='Disputed signed evidence. All known branches are preserved. No unique result, rating or timeout win is claimed. Download the evidence before leaving this browser.';
    const disabled=(name:string,value:boolean)=>{this.el<HTMLButtonElement>(name).disabled=value;};
    for(const name of ['demo','resume','wallet','create','load','restore-setup','import','refresh','copy','download-message','verify-opening'])disabled(name,this.busy);
    for(const name of ['offer','answer','accept-answer'])disabled(name,this.busy||!this.game||!this.actor||this.readOnly||(this.game.opening.kind==='chain'&&!this.chainVerified));
    disabled('join',this.busy||!this.invitation||!!this.invitation.opponentKey||this.address!==this.invitation.opponent);
    disabled('resign',this.busy||!this.playable());disabled('export-message',this.busy||!this.game);disabled('public',this.busy||!this.game);disabled('backup',this.busy||!this.actor||this.readOnly);disabled('review',this.busy||this.verified?.summary.status!=='finished');disabled('verify-opening',this.busy||this.game?.opening.kind!=='chain');
    slider.disabled=!this.game||this.game.line.moves.length===0||(!this.readOnly&&this.verified?.summary.status==='unfinished');this.drawClock();
  }
}
export function mountQuickPlay(doc=document):void {
  if(doc.getElementById('quick-play-open'))return;
  const global=globalThis as unknown as {__xchessPeer?:PeerApp};
  const button=doc.createElement('button');button.id='quick-play-open';button.className='tab';button.textContent='Quick Play';
  button.addEventListener('click',()=>{if(!global.__xchessPeer?.dialog.isConnected)global.__xchessPeer=new PeerApp(doc);global.__xchessPeer.open();});
  (doc.querySelector('.tabs')??doc.body).append(button);
}
