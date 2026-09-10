// Test-only browser driver. This file is never bundled into the inscription.
import { verifyArchive } from '../../packages/peer/protocol.js';
import { Journal } from '../../packages/peer/store.js';
import { hash } from '../../packages/peer/crypto.js';
const side=new URL(location.href).searchParams.get('side')!;
const q=(name:string)=>document.querySelector<HTMLElement>(`#xchess-peer [data-p="${name}"]`)!;
const delay=(ms=30)=>new Promise(r=>setTimeout(r,ms));
async function until(fn:()=>unknown,timeout=20000){const end=Date.now()+timeout;while(Date.now()<end){if(fn())return;await delay();}throw Error('Browser condition timed out: '+q('status')?.textContent);}
async function click(name:string){await until(()=>q(name)&&!(q(name) as HTMLButtonElement).disabled);q(name).click();await until(()=>!(q('demo') as HTMLButtonElement).disabled);}
async function output(){await click('export-message');return (q('output') as HTMLTextAreaElement).value;}
async function command(c:any):Promise<any>{
  if(c.op==='open'){await until(()=>document.querySelector('#quick-play-open'));(document.querySelector('#quick-play-open') as HTMLButtonElement).click();await until(()=>q('demo'));return true;}
  if(c.op==='click'){await click(c.name);return {status:q('status').textContent,output:(q('output') as HTMLTextAreaElement).value};}
  if(c.op==='fill'){(q(c.name) as HTMLInputElement).value=c.value;return true;}
  if(c.op==='import'){(q('input') as HTMLTextAreaElement).value=c.text;await click('import');return {status:q('status').textContent,output:(q('output') as HTMLTextAreaElement).value};}
  if(c.op==='state')return {status:q('status').textContent,identity:q('identity').textContent,connection:q('connection').textContent,position:q('position').textContent,readiness:q('readiness').textContent,playableSquares:q('board').querySelectorAll('.sq--playable').length,pawns:[...q('board').querySelectorAll('.pc--p')].map(p=>({svg:!!p.querySelector('svg path'),fill:getComputedStyle(p.querySelector('svg')!).fill,stroke:getComputedStyle(p.querySelector('svg')!).stroke,color:p.classList.contains('pc--white')?'white':'black',height:p.getBoundingClientRect().height})),reviewDisabled:(q('review') as HTMLButtonElement).disabled,clocks:q('clocks').textContent,errors:(window as any).__peerErrors,external:(window as any).__peerExternal,viewportWidth:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,boardSquares:q('board').querySelectorAll('[data-square]').length,boardHeight:q('board').getBoundingClientRect().height,squareHeight:q('board').querySelector('[data-square]')!.getBoundingClientRect().height};
  if(c.op==='move'){
    for(const square of [c.uci.slice(0,2),c.uci.slice(2,4)]){const el=q('board').querySelector<HTMLElement>(`[data-square="${square}"]`);if(!el)throw Error('No square '+square);if((el as HTMLButtonElement).disabled)throw Error('Square is disabled: '+square+'; '+q('readiness').textContent);el.click();await until(()=>!(q('demo') as HTMLButtonElement).disabled);}
    return JSON.parse(await output());
  }
  if(c.op==='export')return JSON.parse(await output());
  if(c.op==='disableRTC'){(window as any).RTCPeerConnection=undefined;return true;}
  if(c.op==='file'){
    const dt=new DataTransfer();dt.items.add(new File([c.text],'fixture.json',{type:'application/json'}));const el=q(c.name) as HTMLInputElement;el.files=dt.files;el.dispatchEvent(new Event('change'));await until(()=>!(q('demo') as HTMLButtonElement).disabled);return q('status').textContent;
  }
  if(c.op==='verify')return (await verifyArchive(c.archive)).summary;
  if(c.op==='backup'){const journal=new Journal();const a=JSON.parse(await output());return journal.exportRecovery(hash(a.opening),'browser-recovery-test-password');}
  if(c.op==='seedPending'){const journal=new Journal();await journal.setMeta('pending-setup',{registry:'ST000000000000000000002AMW42H.xchess-peer-v1',network:'testnet',txid:'ab'.repeat(32)});return true;}
  if(c.op==='pending')return ['registry','network','game-id'].map(n=>(q(n) as HTMLInputElement).value);
  if(c.op==='keyboard'){const board=q('board');board.focus();board.dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}));board.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));return {active:board.getAttribute('aria-activedescendant'),focus:document.activeElement===board};}
  if(c.op==='reload'){setTimeout(()=>location.reload(),50);return true;}
  throw Error('Unknown test operation');
}
async function loop(){for(;;){try{const c=await(await fetch('/next?side='+side)).json();if(c){let result;try{result={ok:true,value:await command(c)};}catch(e){result={ok:false,error:String(e)};}await fetch('/done',{method:'POST',body:JSON.stringify({id:c.id,...result})});}else await delay(50);}catch{await delay(200);}}}
void loop();
