import { check, canonical, hash, same, generateKey, sign, verify, raw, encode, randomHex, parseBounded, pubValid } from './crypto.js';
import type { GameKey, Signed } from './crypto.js';
import { replay, merge, makeMove, makeResignation, emptyGame, MAX_BYTES } from './protocol.js';
import type { Game, Opening, Side, Action, Move, Resignation } from './protocol.js';
const SLOT = (p:Action) => `${p.match}:${p.actor}:${p.kind === 'move' ? p.sequence : 'resign'}`;
export interface Reservation { payload:Action; signed?:Signed<Action> }
export class StaleState extends Error {}
export class Journal {
  constructor(private name='xchess-peer-v1') {}
  private async db():Promise<IDBDatabase> {
    return new Promise((resolve,reject)=>{
      let settled=false;
      const fail=(e:unknown)=>{if(!settled){settled=true;clearTimeout(timer);reject(e instanceof Error?e:Error('Persistent game storage unavailable'));}};
      const timer=setTimeout(()=>fail(Error('Persistent game storage timed out')),5000);
      let request:IDBOpenDBRequest;
      try { request=indexedDB.open(this.name,1); } catch(e){fail(e);return;}
      request.onupgradeneeded=()=>{for(const name of ['keys','games','slots','meta'])request.result.createObjectStore(name);};
      request.onerror=()=>fail(request.error);request.onblocked=()=>fail(Error('Close old peer-game tabs to unlock storage'));
      request.onsuccess=()=>{if(settled){request.result.close();return;}settled=true;clearTimeout(timer);request.result.onversionchange=()=>request.result.close();resolve(request.result);};
    });
  }
  private async read<T>(store:string,id:string):Promise<T|null> {
    const db=await this.db();
    try{return await new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly'),req=tx.objectStore(store).get(id);let value:T|null=null;req.onsuccess=()=>{value=req.result??null;};tx.oncomplete=()=>resolve(value);tx.onerror=tx.onabort=()=>reject(tx.error??Error('Storage read failed'));});}finally{db.close();}
  }
  private async put(store:string,id:string,value:unknown):Promise<void> {
    const db=await this.db();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value,id);tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(tx.error??Error('Storage write failed'));});}finally{db.close();}
  }
  async createKey():Promise<GameKey> {const key=await generateKey();await this.put('keys',key.public,key.secret);check(await this.key(key.public),'Game key could not be saved');return key;}
  async key(pub:string):Promise<GameKey|null> {const secret=await this.read<CryptoKey>('keys',pub);return secret?{public:pub,secret}:null;}
  async get(match:string):Promise<Game|null> {return this.read('games',match);}
  async meta<T>(name:string):Promise<T|null> {return this.read('meta',name);}
  async setMeta(name:string,value:unknown):Promise<void> {return this.put('meta',name,value);}
  async acceptDemo(nonce:string,match:string):Promise<void> {
    const db=await this.db();try{await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('meta','readwrite'),s=tx.objectStore('meta'),q=s.get('demo:'+nonce);let error:Error|null=null;
      q.onsuccess=()=>{if(q.result&&q.result!==match){error=Error('This demo invitation was already accepted with different keys');tx.abort();}else {try{s.put(match,'demo:'+nonce);}catch(e){error=e instanceof Error?e:Error('Demo acceptance failed');tx.abort();}}};
      tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(error??tx.error??Error('Demo acceptance could not be saved'));
    });}finally{db.close();}
  }
  private async commit(game:Game,expected:string|null,reservation?:Reservation):Promise<boolean> {
    check(encode(game).length<=MAX_BYTES,'Game evidence exceeds the archive limit; keep the incoming file separately');
    const db=await this.db(),match=hash(game.opening);
    try{return await new Promise((resolve,reject)=>{
      const tx=db.transaction(['games','slots'],'readwrite'),s=tx.objectStore('games'),q=s.get(match);let stale=false,error:unknown=null;
      q.onsuccess=()=>{try{
        if((q.result?hash(q.result):null)!==expected){stale=true;tx.abort();return;}
        s.put(game,match);
        if(reservation)tx.objectStore('slots').put(reservation,SLOT(reservation.payload));
      }catch(e){error=e;tx.abort();}};
      tx.oncomplete=()=>resolve(true);tx.onabort=tx.onerror=()=>stale?resolve(false):reject(error??tx.error??Error('Game was not saved. Nothing was sent.'));
    });}finally{db.close();}
  }
  async receive(incoming:Game):Promise<Game> {
    await replay(incoming);const match=hash(incoming.opening);
    for(let n=0;n<8;n++) {const current=await this.get(match),next=current?await merge(current,incoming):structuredClone(incoming);
      if(current&&hash(current)===hash(next))return current;
      if(await this.commit(next,current?hash(current):null))return next;
    }throw Error('Another tab is updating this game; try importing again');
  }
  async start(opening:Opening):Promise<Game> {return this.receive(emptyGame(opening));}
  private async reserve(game:Game,payload:Action):Promise<Reservation> {
    const db=await this.db();try{return await new Promise((resolve,reject)=>{
      const tx=db.transaction(['games','slots'],'readwrite'),s=tx.objectStore('slots'),q=tx.objectStore('games').get(hash(game.opening));let result:Reservation={payload},error:Error|null=null;
      q.onsuccess=()=>{
        if(!q.result||hash(q.result)!==hash(game)){error=new StaleState('Game changed in another tab');tx.abort();return;}
        const r=s.get(SLOT(payload));r.onsuccess=()=>{
          if(r.result&&hash(r.result.payload)!==hash(payload)){error=Error('This browser already reserved a different action here. Resume that action; a conflicting move will not be signed.');tx.abort();return;}
          if(r.result)result=r.result;else {try{s.put(result,SLOT(payload));}catch(e){error=e instanceof Error?e:Error('Move reservation failed');tx.abort();}}
        };
      };
      tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(error??tx.error??Error('Could not reserve this move. Nothing was signed.'));
    });}finally{db.close();}
  }
  async act(match:string,actor:Side,kind:'move'|'resignation',value='',expectedGameHash?:string):Promise<Game> {
    for(let n=0;n<8;n++) {
      const game=await this.get(match);check(game,'Game is not saved');if(expectedGameHash)check(hash(game)===expectedGameHash,'Saved history changed; refresh before signing this action');const key=await this.key(game.opening[actor].key);check(key,'This device does not have your registered game key. Restore an encrypted recovery save.');
      const payload=kind==='move'?await makeMove(game,actor,value):await makeResignation(game,actor);
      let slot:Reservation;
      try{slot=await this.reserve(game,payload);}catch(e){if(e instanceof StaleState)continue;throw e;}
      const signed=slot.signed??await sign(payload,key.secret);
      const evidence=structuredClone(game);
      if(payload.kind==='move')evidence.line.moves.push(signed as Signed<Move>);else evidence.line.resignations.push(signed as Signed<Resignation>);
      await replay(evidence);
      for(let i=0;i<8;i++) {
        const current=await this.get(match);check(current,'Game storage disappeared');const next=await merge(current,evidence);
        if(await this.commit(next,hash(current),{payload,signed}))return next;
      }throw Error('Signed action is reserved but could not be saved. Retry the same action; nothing was sent.');
    }throw Error('Game changed repeatedly; refresh this view');
  }
  private async snapshot(match:string):Promise<{game:Game|null;slots:Reservation[]}> {
    const db=await this.db();try{return await new Promise((resolve,reject)=>{
      const tx=db.transaction(['games','slots'],'readonly'),g=tx.objectStore('games').get(match),q=tx.objectStore('slots').getAll(IDBKeyRange.bound(match+':',match+':\uffff'));
      let game:Game|null=null,slots:Reservation[]=[];g.onsuccess=()=>{game=g.result??null;};q.onsuccess=()=>{slots=q.result;};
      tx.oncomplete=()=>resolve({game,slots});tx.onabort=tx.onerror=()=>reject(tx.error??Error('Recovery snapshot failed'));
    });}finally{db.close();}
  }
  async exportRecovery(match:string,password:string):Promise<string> {
    check(password.length>=10,'Use a recovery password of at least 10 characters');const {game,slots}=await this.snapshot(match);check(game,'Game not found');await replay(game);
    const keys:Array<{public:string;jwk:JsonWebKey}>=[];
    for(const side of ['white','black'] as Side[]) {const key=await this.key(game.opening[side].key);if(key)keys.push({public:key.public,jwk:await crypto.subtle.exportKey('jwk',key.secret)});}
    check(keys.length,'No private game key is available to back up');
    const salt=randomHex(16),iv=randomHex(12),iterations=310000;
    const key=await recoveryKey(password,salt,iterations);
    const data=encode({format:'xchess-peer-private-v1',game,keys,slots});
    const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv:raw(iv),additionalData:encode('xchess-peer-recovery-v1')},key,data);
    return canonical({format:'xchess-peer-recovery-v1',salt,iv,iterations,cipher:toBase64(new Uint8Array(cipher))});
  }
  async importRecovery(text:string,password:string):Promise<Game> {
    const envelope=parseBounded(text,4_000_000) as {format:string;salt:string;iv:string;iterations:number;cipher:string};
    check(envelope.format==='xchess-peer-recovery-v1'&&/^[0-9a-f]{32}$/.test(envelope.salt)&&/^[0-9a-f]{24}$/.test(envelope.iv)&&envelope.iterations===310000,'Unsupported encrypted recovery save');
    same(Object.keys(envelope).sort(),['format','salt','iv','iterations','cipher'].sort(),'Unknown recovery fields');
    const key=await recoveryKey(password,envelope.salt,envelope.iterations);let plaintext:ArrayBuffer;
    try{plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:raw(envelope.iv),additionalData:encode('xchess-peer-recovery-v1')},key,fromBase64(envelope.cipher));}catch{throw Error('Wrong recovery password or damaged recovery save');}
    const data=parseBounded(new TextDecoder().decode(plaintext),3_000_000) as {format:string;game:Game;keys:Array<{public:string;jwk:JsonWebKey}>;slots:Reservation[]};
    check(data.format==='xchess-peer-private-v1'&&Array.isArray(data.keys)&&data.keys.length>0&&data.keys.length<=2&&Array.isArray(data.slots)&&data.slots.length<=4100,'Invalid recovery contents');
    await replay(data.game);const match=hash(data.game.opening),keys:GameKey[]=[];
    for(const item of data.keys) {
      check(pubValid(item.public)&&[data.game.opening.white.key,data.game.opening.black.key].includes(item.public),'Recovery contains an unrelated key');
      const secret=await crypto.subtle.importKey('jwk',item.jwk,{name:'ECDSA',namedCurve:'P-256'},true,['sign']);
      await verify(await sign(['recovery-key-check',match],secret),item.public);keys.push({public:item.public,secret});
    }
    const reserved=new Set<string>();
    for(const slot of data.slots){await validateReservation(data.game,slot);check(!reserved.has(SLOT(slot.payload)),'Duplicate recovery reservation');reserved.add(SLOT(slot.payload));}
    // Merge and restore keys + anti-equivocation reservations in one IDB transaction.
    for(let n=0;n<8;n++) {
      const current=await this.get(match),game=current?await merge(current,data.game):data.game;
      const db=await this.db();
      try{const committed=await new Promise<boolean>((resolve,reject)=>{
        const tx=db.transaction(['games','keys','slots'],'readwrite'),gs=tx.objectStore('games'),ss=tx.objectStore('slots');let stale=false,error:Error|null=null;
        const q=gs.get(match);q.onsuccess=()=>{try{
          if((q.result?hash(q.result):null)!==(current?hash(current):null)){stale=true;tx.abort();return;}
          gs.put(game,match);for(const key of keys)tx.objectStore('keys').put(key.secret,key.public);
          for(const slot of data.slots) {
            const req=ss.get(SLOT(slot.payload));req.onsuccess=()=>{
              if(req.result&&hash(req.result.payload)!==hash(slot.payload)){error=Error('Recovery conflicts with a locally reserved action; existing data was preserved');tx.abort();return;}
              try{ss.put(req.result??slot,SLOT(slot.payload));}catch(e){error=e instanceof Error?e:Error('Recovery failed');tx.abort();}
            };
          }
        }catch(e){error=e instanceof Error?e:Error('Recovery failed');tx.abort();}};
        tx.oncomplete=()=>resolve(true);tx.onabort=tx.onerror=()=>stale?resolve(false):reject(error??tx.error??Error('Recovery could not be saved'));
      });if(committed)return game;}finally{db.close();}
    }throw Error('Another tab changed the game; try recovery again');
  }
}
async function validateReservation(game:Game,slot:Reservation):Promise<void> {
  const p=slot.payload;check(p&&p.match===hash(game.opening)&&(p.actor==='white'||p.actor==='black'),'Unrelated signing reservation');
  const sequence=p.kind==='move'?p.sequence-1:p.atSequence;
  const line=[game.line,...game.branches].find(l=>l.moves.length>=sequence && (sequence===0?hash([game.opening.descriptor.protocol+'/genesis',hash(game.opening),game.opening.descriptor.initialFen]):hash(l.moves[sequence-1].payload))===(p.kind==='move'?p.previousHash:p.atHash));
  check(line&&Number.isSafeInteger(sequence)&&sequence>=0,'Reservation has no matching history');
  const prefix:Game={opening:game.opening,line:{moves:line.moves.slice(0,sequence),resignations:[]},branches:[]};
  const expected=p.kind==='move'?await makeMove(prefix,p.actor,p.value):await makeResignation(prefix,p.actor);
  same(p,expected,'Invalid reserved action');if(slot.signed){same(slot.signed.payload,p);await verify(slot.signed,game.opening[p.actor].key);}
}
async function recoveryKey(password:string,salt:string,iterations:number):Promise<CryptoKey> {
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:raw(salt),iterations},key,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export function toBase64(bytes:Uint8Array):string {let str='';for(let i=0;i<bytes.length;i+=8192)str+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(str);}
export function fromBase64(text:string):Uint8Array<ArrayBuffer> {check(typeof text==='string'&&/^[A-Za-z0-9+/]*={0,2}$/.test(text),'Invalid base64');return Uint8Array.from(atob(text),c=>c.charCodeAt(0));}
