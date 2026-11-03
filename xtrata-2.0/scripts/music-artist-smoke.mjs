// Fresh extension-free browser. Wallet requests and server records are simulated;
// the canary address is public identity only, with no key or actual signature.
import { chromium } from 'playwright';
import { build } from 'esbuild';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url), artist = '/music/artist/', ledgerPath = artist + 'royalties/collections/audionauts-1-0/';
const api = '/api/music/artist/royalties/collections/audionauts-1-0', sessionApi = '/api/music/artist/session';
const admin = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', receiver = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX', txId = '0x' + 'a'.repeat(64);
const compiled = await build({ entryPoints: [new URL('src/audionaut-royalties/page.ts', root).pathname], bundle: true, format: 'esm', platform: 'browser', write: false,
  plugins: [{ name: 'simulated-wallet', setup(builder) {
    builder.onResolve({ filter: /\/wallet\/(adapter|connect|structured-sign)$/ }, args => ({ path: args.path.split('/').at(-1), namespace: 'simulated-wallet' }));
    builder.onLoad({ filter: /.*/, namespace: 'simulated-wallet' }, args => ({ contents: args.path === 'adapter'
      ? `export const createStacksWalletAdapter=()=>({ getSession:()=>window.simulatedWallet,connect:async()=>window.simulatedWallet,disconnect:async()=>{} });`
      : args.path === 'connect' ? `export const connectWallet=async()=>window.simulatedWallet;export const showStxTransfer=options=>{window.transferRequests.push({recipient:options.recipient,amount:options.amount,memo:options.memo,sender:options.stxAddress});queueMicrotask(()=>{if(window.walletAction==='cancel')options.onCancel();else if(window.walletAction==='error')options.onError(Error('Ambiguous wallet connection loss.'));else options.onFinish({txId:'${txId}'});});};`
      : `export const requestStructuredSignature=async()=>{throw Error('Unexpected sign-in request');};` }));
  } }] });
const catalogue = JSON.parse(await readFile(new URL('functions/lib/audionaut-royalties-catalogue.json', root), 'utf8'));
const baseRows = catalogue.editions.slice(0,2).map((row,i)=>({...row,tokenId:3100+i,mintedAt:100,firstSongId:577,dueMicroStx:5000000,
  receivingAddress:i===0?receiver:admin,status:i===0?'unrecorded':'retained',recipient:i===0?null:admin,txId:i===0?null:txId,proofKind:i===0?undefined:'sale',note:i===0?'No receipt.':'Royalty retained by Xtrata.'}));
let mode='out', intents=[], confirmed=false, prepares=0, ledgerReads=0, attaches=0;
const browser=await chromium.launch({headless:true,channel:'chrome'}), page=await browser.newPage({viewport:{width:1280,height:1000}}), errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(({admin})=>{window.simulatedWallet={isConnected:true,address:admin,network:'mainnet'};window.transferRequests=[];window.walletAction='finish';},{admin});
await page.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url());if(url.origin!=='https://artist.test')return route.abort();
  if(url.pathname===sessionApi){if(request.method()==='DELETE')mode='out';return route.fulfill({json:mode==='out'?{signedIn:false,available:true}:{signedIn:true,available:true,address:mode==='recipient'?receiver:admin,admin:mode==='admin',expiresAt:Date.now()+600000}});}
  if(url.pathname===api){
    if(mode==='out')return route.fulfill({status:401,json:{error:'Sign in.'}});
    if(request.method()==='POST'){
      assert.equal(mode,'admin');const body=request.postDataJSON();
      if(body.action==='prepare'){prepares++;if(intents.some(i=>i.state==='awaiting-wallet'||i.state==='submitted'))return route.fulfill({status:409,json:{error:'Already reserved.'}});
        const intent={id:'intent-'+prepares,edition:1,recipient:receiver,sender:admin,state:'awaiting-wallet',tx_id:null,note:'Reserved.',created_at:Date.now(),updated_at:Date.now()};intents.unshift(intent);
        return route.fulfill({json:{...intent,amountMicroStx:5000000,memo:'audionaut:1'}});}
      const intent=intents.find(i=>i.id===body.intentId);assert(intent);
      if(body.action==='cancel')intent.state='cancelled';
      if(body.action==='submitted'){attaches++;assert.equal(body.txId,txId);intent.tx_id=txId;intent.state='submitted';intent.note='Waiting for confirmation.';}
      return route.fulfill({json:{ok:true}});
    }
    ledgerReads++;
    if(mode==='throttled')return route.fulfill({status:503,json:{error:'429',signedIn:true,retryable:true}});
    if(mode==='denied')return route.fulfill({status:403,json:{error:'No receiving song.'}});
    const rows=baseRows.map(r=>({...r}));if(confirmed){rows[0].status='paid';rows[0].txId=txId;rows[0].recipient=receiver;intents.forEach(i=>{if(i.state==='submitted')i.state='confirmed';});}
    return route.fulfill({json:{address:mode==='recipient'?receiver:admin,admin:mode==='admin',checkedAt:Date.now(),blockHeight:120,
      artists:catalogue.artists.map(a=>({...a,address:admin,error:null})),rows,intents,automation:{checkedAt:Date.now(),payers:[],candidates:[]}}});
  }
  if(url.pathname==='/api/music/artist/royalties/plays')return route.fulfill({json:{available:false,message:'Artist pay-per-play reporting is being prepared.'}});
  let file=url.pathname;if(file.endsWith('/'))file+='index.html';
  if(!file.startsWith(artist))return route.fulfill({body:''});
  if(file===artist+'assets/audionauts.js')return route.fulfill({contentType:'application/javascript',body:compiled.outputFiles[0].text});
  return route.fulfill({contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/javascript',body:await readFile(new URL(file.slice(1),root),'utf8')});
});
const settled=()=>page.waitForFunction(()=>!document.getElementById('message').textContent);
const openPayment=async()=>{await page.getByRole('button',{name:'Pay 5 STX',exact:true}).click();await page.locator('#payment-review').waitFor();assert.equal(await page.locator('#payment-recipient').textContent(),receiver);await page.click('#payment-send');};
try{
  await page.clock.install();await page.goto('https://artist.test'+artist);await settled();assert.equal(ledgerReads,0);assert(await page.locator('#sign-in').isVisible());
  mode='admin';await page.reload();await page.waitForFunction(()=>document.getElementById('audionaut-summary').textContent.includes('STX settled'));assert.equal(await page.locator('#sign-in').isVisible(),false);
  await page.locator('.portal-nav a').filter({hasText:'Royalties'}).click();await settled();
  await page.locator('.portal-nav a').filter({hasText:'Collections'}).click();await settled();
  await page.getByRole('link',{name:'View royalty ledger →'}).click();await page.locator('#rows tr').first().waitFor();assert.equal(page.url(),'https://artist.test'+ledgerPath);
  assert.equal(await page.getByRole('button',{name:'Pay 5 STX',exact:true}).count(),1);assert.equal(await page.getByRole('link',{name:'View Audionaut sale ↗'}).count(),1);
  await openPayment();await page.waitForFunction(()=>document.querySelector('#rows').textContent.includes('Pending confirmation'));
  assert.equal(prepares,1);assert.equal(await page.getByRole('button',{name:'Pay 5 STX',exact:true}).count(),0);
  assert.deepEqual(await page.evaluate(()=>window.transferRequests),[{recipient:receiver,amount:'5000000',memo:'audionaut:1',sender:admin}]);
  assert.equal(attaches,1);assert(await page.getByRole('link',{name:'View submitted transfer ↗'}).isVisible());
  confirmed=true;await page.clock.fastForward(60_000);await page.waitForFunction(()=>document.querySelector('#rows tr:first-child .paid')?.textContent==='Paid');
  assert.equal(await page.locator('#paid-total').textContent(),'10 STX');
  confirmed=false;intents=[];await page.reload();await page.locator('#rows tr').first().waitFor();
  await page.evaluate(()=>window.walletAction='cancel');await openPayment();await page.waitForFunction(()=>document.getElementById('message').textContent.includes('cancelled'));assert.equal(intents[0].state,'cancelled');
  await page.evaluate(()=>window.walletAction='error');await openPayment();await page.getByRole('button',{name:'Attach transaction ID'}).waitFor();assert.equal(intents[0].state,'awaiting-wallet');assert.equal(await page.getByRole('button',{name:'Pay 5 STX',exact:true}).count(),0);
  await page.getByRole('button',{name:'Attach transaction ID'}).click();await page.fill('#submitted-tx',txId);await page.getByRole('button',{name:'Save transaction ID'}).click();await page.waitForFunction(()=>document.querySelector('#rows').textContent.includes('Pending confirmation'));
  mode='recipient';await page.reload();await page.locator('#rows tr').first().waitFor();assert.equal(await page.getByRole('button',{name:'Pay 5 STX',exact:true}).count(),0);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await mkdir(new URL('_claude_scratch/music-artist/',root),{recursive:true});await page.screenshot({path:new URL('_claude_scratch/music-artist/ledger-mobile.png',root).pathname,fullPage:true});
  await page.goto('https://artist.test'+artist+'royalties/plays/');await settled();assert((await page.locator('#plays-status').textContent()).includes('being prepared'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.click('#sign-out');assert.equal(await page.locator('#wallet-address').textContent(),'');
  await page.goto('https://artist.test'+artist);await settled();assert.equal(await page.locator('#sign-in').isVisible(),true);
  assert((await page.locator('#audionaut-summary').textContent()).startsWith('Sign in'));
  assert.deepEqual(errors,[]);console.log('Artist portal browser smoke passed: shared sign-in/navigation, collection ledger, admin-only reviewed payment, automatic pending/confirmed ID updates, cancellation, ambiguous result recovery, recipient gate, planned plays, sign-out and mobile. All wallets and transfers simulated.');
}finally{await browser.close();}
