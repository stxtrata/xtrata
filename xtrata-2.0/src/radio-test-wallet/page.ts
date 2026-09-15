import QRCode from 'qrcode-generator';
import SignerWorker from './signer.worker?worker';
import {type Vault,parseVault} from './vault';
import {get,put,entries} from './storage';
import {type Entry,type Policy,Budget,RESERVE,HOLDER,micro,stx,feeValue,unresolved,safeReport,CONTRACT} from './model';
import * as chain from './chain';
import {loadAudio} from './audio';
import {Cl} from '@stacks/transactions';
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const input=(id:string)=>$<HTMLInputElement>(id).value;
const tell=(text:string)=>{$('status').textContent=text;};
let vault:Vault|undefined,backupVerified=false,unlocked=false,exclusive=false,busy=false,verified=false,log:Entry[]=[],balance=0n;
let unlockTimer:ReturnType<typeof setTimeout>|undefined;
let generation=0,session:Policy|null=null,sessionStarts=0,track:{id:number;core:number;receipt:string;charged:boolean}|null=null,selection=0,playlist:number[]=[];
let worker=new SignerWorker(),serial=0,workerFailed=false;
const requests=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void}>();
worker.onmessage=e=>{const pending=requests.get(e.data.id);if(!pending)return;requests.delete(e.data.id);e.data.error?pending.reject(Error(e.data.error)):pending.resolve(e.data.result);};
worker.onerror=()=>{workerFailed=true;for(const p of requests.values())p.reject(Error('Signer stopped. Lock and reload to recover.'));requests.clear();worker.terminate();generation++;session=null;unlocked=false;render();tell('Signer stopped. Reload to unlock and reconcile.');};
function signer(op:string,data:any={}){if(workerFailed)return Promise.reject(Error('Signer could not load. Reload after checking the deployed worker asset.'));return new Promise<any>((resolve,reject)=>{const id=++serial;requests.set(id,{resolve,reject});worker.postMessage({id,op,data});});}
function checkWallet(){if(!exclusive)throw Error('Another test-wallet tab is active. Close it and reload here.');if(!vault||!unlocked||!backupVerified)throw Error('Unlock the wallet and verify its backup first.');}
function idle(){checkWallet();if(log.some(unresolved))throw Error('An earlier transaction is unresolved. Use Reconcile before starting another.');}
function save(){return put('entries',log);}
function download(name:string,value:unknown){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function render(){
 $('mode').textContent=`${session?'AUTOMATIC TEST ACTIVE':'Automatic spending OFF'} · Wallet ${unlocked?'unlocked':'locked'}${exclusive?'':' · Read-only tab'}`;
 $('backup-status').textContent=backupVerified?'Encrypted backup verified. Keep it and the password somewhere safe.':'Download the encrypted backup, then select that file above to verify it with your password before funding.';
 $('funding').hidden=!vault||!backupVerified;$('funding-wait').hidden=!!vault&&backupVerified;
 if(vault&&backupVerified){$('address').textContent=vault.address;const qr=QRCode(0,'M');qr.addData(vault.address);qr.make();$('qr').innerHTML=qr.createImgTag(4,4);$('qr').querySelector('img')!.alt='Listening wallet mainnet address';}
 const reserved=log.filter(unresolved).reduce((s,e)=>s+BigInt(e.fee)+BigInt(e.amount),0n);
 $('balance').textContent=vault?stx(balance)+' STX':'—';$('reserved').textContent=stx(reserved)+' STX';$('available').textContent=stx(balance>reserved+RESERVE?balance-reserved-RESERVE:0n)+' STX';
 $('session-status').textContent=session?`Up to ${session.max} starts · ${sessionStarts} attempted · ${stx(session.budget)} STX maximum · ends ${new Date(session.expires).toLocaleTimeString()}`:'No spending authorised. Broadcast transactions may still confirm.';
 for(const id of ['create','unlock','backup','preview','session','withdraw','resend','free'])$<HTMLButtonElement>(id).disabled=busy||!exclusive||(id==='create'&&!!vault)||(id==='unlock'&&!vault)||(id==='backup'&&!vault);
 $<HTMLInputElement>('restore').disabled=busy||!exclusive;
 $('history').replaceChildren();
 for(const e of [...log].reverse()){
  const row=document.createElement('tr');const cells=[new Date(e.created).toLocaleString(),e.kind==='play'?`Core ${e.core} / #${e.song}`:'Withdrawal',e.status+(e.note?' · '+e.note:''),stx(e.fee),e.actualFee?stx(e.actualFee):'—',stx(e.amount),e.recipient,e.confirmedAt?`${((e.confirmedAt-e.created)/1000).toFixed(0)}s (observed)`:'—'];
  for(const text of cells){const td=document.createElement('td');td.textContent=text;row.append(td);}const td=document.createElement('td');if(e.txid){const a=document.createElement('a');a.href=`https://explorer.hiro.so/txid/${encodeURIComponent(e.txid)}?chain=mainnet`;a.target='_blank';a.rel='noopener noreferrer';a.textContent=e.txid.slice(0,12)+'…';td.append(a);}row.append(td);$('history').append(row);
 }
}
async function action(fn:()=>Promise<void>){if(busy)return;busy=true;render();try{await fn();}catch(e){if(session)await stop();tell(e instanceof Error?e.message:'Operation failed.');}finally{busy=false;render();void onAudibleStart();}}
function bind(id:string,fn:()=>Promise<void>){$(id).onclick=()=>void action(fn);}
async function stop(lock=false){generation++;session=null;sessionStarts=0;if(lock)unlocked=false;await signer(lock?'lock':'stop');render();}
$('stop').onclick=()=>{void stop();tell('New paid starts stopped. Audio can continue free; submitted payments may still confirm.');};
$('lock').onclick=()=>{void stop(true);tell('Wallet locked. No new signing is authorised.');};
$('password').onkeydown=e=>{if(e.key==='Enter')$('unlock').click();};
bind('create',async()=>{if(vault)throw Error('A wallet already exists. Back it up rather than replacing it.');const created=await signer('create',{password:input('password')});await put('vault',created);vault=created;$<HTMLInputElement>('password').value='';tell('Wallet created and locked. Download your backup, then select it to verify before funding.');});
bind('unlock',async()=>{if(!vault)throw Error('Create or restore a wallet first.');await signer('open',{vault,password:input('password')});$<HTMLInputElement>('password').value='';unlocked=true;tell('Unlocked. Spending is still OFF.');clearTimeout(unlockTimer);unlockTimer=setTimeout(()=>void stop(true),30*60000);});
bind('backup',async()=>{if(!vault)throw Error('No wallet to back up.');download('xtrata-listening-wallet-encrypted.json',vault);tell('Backup downloaded. Select that file above and enter your password to verify it.');});
$<HTMLInputElement>('restore').onchange=()=>void action(async()=>{
 const file=$<HTMLInputElement>('restore').files?.[0];if(!file)return;if(file.size>8192)throw Error('Backup too large.');const imported=parseVault(JSON.parse(await file.text()));
 if(vault&&vault.address!==imported.address)throw Error('This browser already has a different wallet. Use a separate browser profile to restore this backup.');
 const identity=await signer('verify-backup',{vault:imported,password:input('password')});if(identity.address!==imported.address)throw Error('Backup address mismatch.');
 if(!vault){await put('vault',imported);vault=imported;}await put('backupVerified',vault.address);backupVerified=true;$<HTMLInputElement>('password').value='';$<HTMLInputElement>('restore').value='';tell('Backup verified. This is your real mainnet funding address. Send 1 STX manually when ready; no spending starts automatically.');await refresh();
});
bind('get-address',async()=>{if(!vault||!backupVerified){$('wallet-setup').scrollIntoView({behavior:'smooth'});tell(!vault?'Create your dedicated wallet first, then download and verify its encrypted backup. Your funding address will appear after verification.':'Download and verify this wallet’s encrypted backup first. This protects access to any funds you send.');return;}render();$('address').scrollIntoView({behavior:'smooth',block:'center'});tell('This is your dedicated test wallet address on Stacks mainnet. Copy it or scan the QR code, then use Confirm funds received after sending your deposit. Funding does not start tests.');});
bind('copy',async()=>{if(!vault||!backupVerified)throw Error('Verify your backup first.');await navigator.clipboard.writeText(vault.address);tell('Funding address copied. Use Stacks mainnet.');});
async function refresh(){if(vault){balance=await chain.balance(vault.address);$('deposit-status').textContent=balance>0n?'Confirmed funds detected. They stay in your wallet until you approve a test.':'No confirmed funds yet. If you just sent a deposit, wait and refresh.';}render();}
bind('refresh',async()=>{await reconcile();await refresh();});
function values(){const core=Number(input('core')),song=Number(input('song')),fee=feeValue(input('fee'));if(![1,2,3].includes(core)||!/^\d+$/.test(input('song'))||!Number.isSafeInteger(song))throw Error('Enter a valid master core and inscription ID.');return {core,song,fee};}
function receipt(){return chain.hex(crypto.getRandomValues(new Uint8Array(16)));}
let approved: (()=>Promise<void>)|null=null;
function review(title:string,text:string,fn:()=>Promise<void>,low=false){$('review-title').textContent=title;$('review-text').textContent=text;$('low-fee-row').hidden=!low;$<HTMLInputElement>('low-fee').checked=false;approved=fn;$<HTMLDialogElement>('review').showModal();}
$('cancel').onclick=()=>{approved=null;$<HTMLDialogElement>('review').close();};
$<HTMLDialogElement>('review').onclose=()=>{approved=null;};
$('approve').onclick=()=>{if(!$('low-fee-row').hidden&&!$<HTMLInputElement>('low-fee').checked){tell('Acknowledge the below-baseline fee before approving.');return;}const fn=approved;approved=null;$<HTMLDialogElement>('review').close();if(fn)void action(fn);};
function terms(fee:bigint,recipient:string,bytes:number){return `Network: Stacks MAINNET\nListening wallet: ${vault!.address}\nMaster holder now: ${recipient}\nHolder payment: 0.000050 STX\nNetwork fee: ${stx(fee)} STX\nTotal per start: ${stx(fee+HOLDER)} STX\nTransaction size: ${bytes} bytes\nNo treasury deduction or automatic fee increase.\nIf the master is sold while pending, its holder at execution receives the payment.\nA confirmed failed transaction can still cost its network fee.`;}
bind('preview',async()=>{idle();const v=values(),r=receipt();const p=await chain.preview(vault!.address,vault!.publicKey,v.core,v.song,r,v.fee);if(BigInt(p.balance)<v.fee+HOLDER+RESERVE)throw Error('Fund the wallet first; retain 0.001 STX for recovery.');review('Approve ONE paid play',`Song #${v.song} · core ${v.core}\n${terms(v.fee,p.recipient,p.bytes)}\nAudio must begin before a transaction is signed. This approval lasts five minutes.`,async()=>{idle();await arm({fee:v.fee.toString(),budget:(v.fee+HOLDER).toString(),max:1,expires:Date.now()+5*60000,core:v.core,songs:[v.song]});playlist=[v.song];await startTrack(v.core,v.song);},v.fee<BigInt(p.bytes));});
async function arm(p:Policy){idle();new Budget(p);await signer('arm',p);session=p;sessionStarts=0;generation++;render();}
bind('session',async()=>{idle();const v=values();const ids=input('playlist').split(',').map(n=>n.trim());if(ids.some(n=>!/^\d+$/.test(n)))throw Error('Use comma-separated inscription IDs.');const songs=ids.map(Number),minutes=Number(input('minutes'));if(!Number.isInteger(minutes)||minutes<1||minutes>30)throw Error('Use 1–30 minutes.');const p:Policy={fee:v.fee.toString(),budget:micro(input('budget')).toString(),max:Number(input('max')),expires:Date.now()+minutes*60000,core:v.core,songs};new Budget(p);const preview=await chain.preview(vault!.address,vault!.publicKey,p.core,songs[0],receipt(),v.fee);if(v.fee<BigInt(preview.bytes))throw Error('Below-baseline fees are available for a single explicit test only. Raise the fee for automatic sessions.');if(BigInt(preview.balance)<BigInt(p.budget)+RESERVE)throw Error('Session budget exceeds your available balance after the recovery reserve.');review('Approve limited automatic test',`${terms(v.fee,preview.recipient,preview.bytes)}\nPlaylist IDs: ${songs.join(', ')}\nMaximum paid starts: ${p.max}\nMaximum spend: ${stx(p.budget)} STX\nExpires in ${minutes} minutes.\nOne unresolved payment at a time. Skips after audio starts remain payable.`,async()=>{idle();await arm({...p,expires:Date.now()+minutes*60000});playlist=songs;await startTrack(p.core,songs[0]);});});
const audio=$<HTMLAudioElement>('audio');
async function startTrack(core:number,id:number,resume=false){const token=++selection;audio.pause();track=null;const loaded=await loadAudio(core,id);if(token!==selection)return;const saved=resume?await get<any>('playback'):null;const active={id,core,receipt:resume&&saved?.id===id&&saved?.core===core?saved.receipt:receipt(),charged:resume};await put('playback',{...active,position:resume?saved?.position||0:0});if(token!==selection)return;track=active;audio.src=loaded.src;audio.currentTime=resume?saved?.position||0:0;$('now').textContent=loaded.title;await audio.play();}
bind('free',async()=>{await stop();const v=values();playlist=[v.song];await startTrack(v.core,v.song);tell('Free listening. No payment is authorised.');});
async function next(){if(!track)return;const index=playlist.indexOf(track.id),id=playlist[index+1]??playlist[0]??track.id;await startTrack(track.core,id);}
bind('next',next);
bind('resume',async()=>{await stop();const saved=await get<any>('playback');if(!saved)throw Error('No previous song saved in this browser.');playlist=[saved.id];await startTrack(saved.core,saved.id,true);tell('Resumed without a payment.');});
audio.onended=()=>{const at=track?playlist.indexOf(track.id):-1;if(at<playlist.length-1||$<HTMLInputElement>('loop').checked)void action(next);};
let lastPersist=0;audio.ontimeupdate=()=>{if(track&&Date.now()-lastPersist>5000){lastPersist=Date.now();void put('playback',{...track,position:audio.currentTime}).catch(()=>{void stop(true);tell('Storage failed; wallet locked.');});}};
async function onAudibleStart(){if(busy||!track||track.charged||audio.paused||audio.muted||audio.volume===0)return;track.charged=true;const selected={...track};if(!session)return;const policy=session,g=generation;
 if(log.some(unresolved)){await stop();tell('Paid test stopped because the previous operation is unresolved. Music continues free.');return;}
 busy=true;render();try{
  const p=await chain.preview(vault!.address,vault!.publicKey,selected.core,selected.id,selected.receipt,BigInt(policy.fee));
  if(g!==generation||session!==policy)return;
  const e:Entry={id:selected.receipt,address:vault!.address,kind:'play',core:selected.core,song:selected.id,recipient:p.recipient,amount:'50',fee:policy.fee,nonce:p.nonce,created:Date.now(),status:'prepared',previewBytes:p.bytes};log.push(e);await save();
  const signed=await signer('sign-play',{core:e.core,song:e.song,receipt:e.id,fee:e.fee,nonce:e.nonce,recipient:e.recipient});
  e.raw=signed.raw;e.txid=signed.txid;e.status='signed';sessionStarts++;await save();
  if(g!==generation){tell('Test stopped. A signed transaction was saved but not submitted. Reconcile before further tests.');return;}
  await submit(e);if(sessionStarts>=policy.max)await stop();
 }catch(error){const e=log.find(e=>e.id===selected.receipt);if(e?.status==='prepared'){e.status='cancelled';await save();}await stop();tell(error instanceof Error?error.message:'Paid start failed.');}finally{busy=false;render();}}
audio.onplaying=()=>void onAudibleStart();audio.onvolumechange=()=>void onAudibleStart();
async function submit(e:Entry){chain.validateSaved(e);const g=generation;e.status='unknown';await save();if(g!==generation){e.status='signed';e.note='Stopped before submission. Saved transaction requires explicit review.';await save();return;}try{await chain.broadcast(e.raw!,e.txid!);e.status='pending';e.note='Accepted by node; awaiting confirmation.';}catch(error){if((error as any)?.feeRejected)e.status='failed';e.note=error instanceof Error?error.message:'Submission unknown.';}await save();if(e.status==='failed'||e.status==='unknown')await stop();tell(e.note!);render();}
async function reconcile(all=true){
 if(!vault)return;if(!exclusive){await refresh();return;}
 for(const e of log.filter(e=>e.address===vault!.address&&e.txid&&(all||unresolved(e)))){
  const tx=await chain.transaction(e.txid!);if(!tx){if(e.status==='confirmed'){e.status='unknown';e.note='Previously confirmed transaction is no longer visible; reconciliation required.';}continue;}
  if(tx.sender_address!==e.address||tx.tx_id?.replace(/^0x/,'')!==e.txid!.replace(/^0x/,''))throw Error('Transaction identity mismatch.');
  if(e.kind==='play'&&(tx.tx_type!=='contract_call'||tx.contract_call?.contract_id!==CONTRACT||tx.contract_call?.function_name!=='play'))throw Error('Transaction contract mismatch.');
  if(e.kind==='withdraw'&&(tx.tx_type!=='token_transfer'||tx.token_transfer?.recipient_address!==e.recipient||String(tx.token_transfer?.amount)!==e.amount))throw Error('Withdrawal identity mismatch.');
  if(tx.canonical===true&&tx.is_unanchored===false&&Number.isSafeInteger(tx.block_height)&&tx.block_height>0){
   if(tx.tx_status==='success'){
    if(e.kind==='play'){const r=await chain.read('get-receipt',[Cl.standardPrincipal(e.address),Cl.buffer(chain.bytes(e.id))]);const v=r?.value?.value;if(!v||v.id?.value!==String(e.song)||v.core?.value!==String(e.core))throw Error('Confirmed transaction receipt is not available yet.');e.recipient=v.recipient.value;}
    e.status='confirmed';e.confirmedAt??=Date.now();e.note='Confirmed on chain.';
   }else if(String(tx.tx_status).startsWith('abort_')){e.status='failed';e.note='Included but failed; network fee may be spent.';}
   if(/^\d+$/.test(String(tx.fee_rate)))e.actualFee=String(tx.fee_rate);
  }else{e.status=String(tx.tx_status).startsWith('dropped_')?'unknown':'pending';e.note=String(tx.tx_status).startsWith('dropped_')?'Dropped by node. Keep the receipt; resolve nonce before another spend.':'Awaiting canonical confirmation.';}
 }
 await save();await refresh();
}
bind('reconcile',async()=>{await reconcile();tell('Saved transactions checked against the chain.');});
bind('resend',async()=>{checkWallet();const e=log.find(e=>unresolved(e)&&e.raw);if(!e)throw Error('No saved signed transaction to resend.');await reconcile();if(!unresolved(e))throw Error('That transaction has resolved. No resend needed.');review('Resend identical transaction',`This resends exactly ${e.txid}.\nIt does not create a new receipt or change the fee.\nRequested fee: ${stx(e.fee)} STX\nOnly do this after reconciliation.`,async()=>{checkWallet();await reconcile();if(unresolved(e))await submit(e);});});
bind('export',async()=>{download('radio-test-report.json',{network:'mainnet',contract:CONTRACT,exportedAt:new Date().toISOString(),entries:safeReport(log)});});
bind('withdraw',async()=>{idle();await stop();const recipient=input('recipient').trim(),amount=micro(input('withdraw-amount')),fee=feeValue(input('withdraw-fee'));const p=await chain.withdrawalPreview(vault!.address,vault!.publicKey,recipient,amount,fee);review('Approve withdrawal',`From: ${vault!.address}\nTo: ${recipient}\nAmount: ${stx(amount)} STX\nNetwork fee: ${stx(fee)} STX\nTotal: ${stx(amount+fee)} STX\nSize: ${p.bytes} bytes\nThis is an irreversible mainnet transfer. Check every address character.`,async()=>{idle();const g=generation;const e:Entry={id:receipt(),address:vault!.address,kind:'withdraw',core:0,song:0,recipient,amount:amount.toString(),fee:fee.toString(),nonce:p.nonce,created:Date.now(),status:'prepared'};log.push(e);await save();try{const signed=await signer('withdraw',{recipient,amount:e.amount,fee:e.fee,nonce:e.nonce});e.raw=signed.raw;e.txid=signed.txid;e.status='signed';await save();if(g!==generation){tell('Stopped before withdrawal submission. Reconcile the saved transaction.');return;}await submit(e);}catch(error){if(e.status==='prepared'){e.status='cancelled';await save();}throw error;}},fee<BigInt(p.bytes));});
bind('offline',async()=>{
 const tests:string[]=[];
 if(micro('0.0002')===200n&&micro('0.00005')===50n)tests.push('PASS — exact fee and holder-payment arithmetic');
 const p={fee:'300',budget:'350',max:1,expires:Date.now()+60000,core:3,songs:[2910]},b=new Budget(p);b.consume(3,2910,300n);try{b.consume(3,2910,300n);throw Error('Budget check failed.');}catch(e){if((e as Error).message==='Budget check failed.')throw e;tests.push('PASS — a second payment exceeds the one-play budget');}
 if(!JSON.stringify(safeReport([{raw:'excluded',id:'test'} as Entry])).includes('excluded'))tests.push('PASS — signed bytes excluded from exported reports');
 $('offline-result').textContent=tests.join('\n')+'\nNo network request, key creation or payment was performed.';
});
$('presets').onclick=e=>{const fee=(e.target as HTMLElement).dataset.fee;if(fee)$<HTMLInputElement>('fee').value=fee;};
async function boot(){
 if(!crypto.subtle||!navigator.locks||!globalThis.indexedDB)throw Error('Use a modern HTTPS browser with local storage and Web Locks support.');
 await new Promise<void>((resolve,reject)=>{navigator.locks.request('xtrata-radio-test-wallet-signer',{ifAvailable:true},async lock=>{exclusive=!!lock;resolve();if(lock)await new Promise<void>(release=>window.addEventListener('pagehide',()=>release(),{once:true}));}).catch(reject);});
 vault=await get<Vault>('vault');if(vault)parseVault(vault);backupVerified=!!vault&&await get('backupVerified')===vault.address;log=await entries();
 if(exclusive){for(const e of log)if(e.status==='prepared'&&!e.raw){e.status='cancelled';e.note='Interrupted before signing/submission.';}await save();}
 render();await signer('ping');await chain.verify();verified=true;$('contract-status').textContent='Deployed source and 50-microSTX holder payment verified.';if(vault)await reconcile();tell(exclusive?'Ready. Create or unlock your test wallet. Spending remains OFF.':'Another test-wallet tab holds the signer. Close it and reload this page.');
}
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
window.addEventListener('pagehide',()=>{generation++;session=null;worker.terminate();});
setInterval(()=>{if(session&&Date.now()>=session.expires)void stop();if(!busy&&vault&&exclusive)void action(()=>reconcile(false));},20000);
void boot().catch(e=>{tell(e.message);$('contract-status').textContent='Verification unavailable. Live tests will recheck before signing.';render();});
