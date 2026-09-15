// @vitest-environment happy-dom
import {beforeEach, afterEach, describe, it, expect, vi} from 'vitest';
import {webcrypto} from 'node:crypto';
import {Cl, cvToHex} from '@stacks/transactions';
import source from '../../../../contracts/live/xtrata-collection-mint-v1.6.clar?raw';
import {COLLECTION_V16_NAME, COLLECTION_V16_CORE} from '../collection-v16-canary';
const wallet = vi.hoisted(()=>({connect:vi.fn(),deploy:vi.fn(),call:vi.fn()}));
vi.mock('../../wallet/connect',()=>({connectWallet:wallet.connect,disconnectWallet:vi.fn(),showContractDeploy:wallet.deploy,showContractCall:wallet.call}));
const deployer='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
let state:'missing'|'live'|'mismatch'|'unavailable';
let corePaused:boolean;
const card=()=>document.querySelector('#collection-v16-deployment') as HTMLElement;
function button(text:string, scope:ParentNode=document){return [...scope.querySelectorAll('button')].find(b=>b.textContent?.includes(text)) as HTMLButtonElement;}
async function preflight(){button('preflight',card()).click();await vi.waitFor(()=>{expect(button('preflight',card()).disabled).toBe(false);expect(card().textContent).toMatch(/OK —|FAILED/);});}
async function connect(address=deployer,network='mainnet'){wallet.connect.mockResolvedValue({isConnected:true,address,network});button('Connect wallet').click();await vi.waitFor(()=>expect(document.body.textContent).toContain('Disconnect'));}
beforeEach(async()=>{
 vi.resetModules();vi.clearAllMocks();localStorage.clear();state='missing';corePaused=false;
 vi.stubGlobal('crypto',webcrypto);
 vi.stubGlobal('fetch',vi.fn(async(url:any)=>{
  const path=String(url);
  if(path.includes('/interface/')&&path.endsWith('/'+COLLECTION_V16_NAME))return new Response('{}',{status:state==='unavailable'?503:state==='missing'?404:200});
  if(path.includes('/source/'))return new Response(JSON.stringify({source:state==='mismatch'?source+'\n':source}));
  if(path.includes('/interface/')&&path.endsWith('/xtrata-v3-2-3'))return new Response(JSON.stringify({functions:['get-id-by-hash','begin-or-get','add-chunk-batch','seal-recursive'].map(name=>({name}))}));
  if(path.includes('/call-read/')){
   const fn=path.split('/').pop();
   const value=fn==='get-locked-core-contract'?Cl.contractPrincipal(deployer,'xtrata-v3-2-3'):fn==='is-paused'?Cl.bool(corePaused):fn==='get-max-small-mint-chunks'?Cl.uint(32):Cl.uint(0);
   return new Response(JSON.stringify({okay:true,result:cvToHex(Cl.ok(value))}));
  }
  throw Error('Unexpected request: '+url);
 }));
 document.body.innerHTML='<main id="app"></main>';await import('../../../deploy-console');
});
afterEach(()=>vi.unstubAllGlobals());
describe('collection v1.6 wallet deployment',()=>{
 it('preflights without connecting and then displays a gated deploy button',async()=>{
  await preflight();expect(button('Deploy (sign',card()).disabled).toBe(true);expect(wallet.deploy).not.toHaveBeenCalled();expect(card().textContent).not.toContain('Wallet deployment blocked');
 });
 it.each([[deployer,'testnet'],['SP000000000000000000002Q6VF78','mainnet']])('rejects signer/network %s %s',async(address,network)=>{
  await preflight();await connect(address,network);expect(button('Deploy (sign',card()).disabled).toBe(true);
 });
 it('submits the pinned source as Clarity 4 once and handles cancellation',async()=>{
  await preflight();await connect();const deploy=button('Deploy (sign',card());deploy.click();deploy.click();
  await vi.waitFor(()=>expect(wallet.deploy).toHaveBeenCalledTimes(1));const args=wallet.deploy.mock.calls[0][0];
  expect(args).toMatchObject({contractName:COLLECTION_V16_NAME,codeBody:source,clarityVersion:4,fee:490000n,stxAddress:deployer});
  args.onCancel();expect(card().textContent).toContain('cancelled');expect(wallet.call).not.toHaveBeenCalled();
 });
 it('rechecks the chain at click time and suppresses duplicate publishing',async()=>{
  await preflight();await connect();state='live';button('Deploy (sign',card()).click();
  await vi.waitFor(()=>expect(card().textContent).toContain('already deployed'));expect(wallet.deploy).not.toHaveBeenCalled();
 });
 it('blocks on core pause and API failures',async()=>{
  corePaused=true;await preflight();expect(button('Deploy (sign',card())).toBeUndefined();
  corePaused=false;state='unavailable';await preflight();expect(card().textContent).toContain('HTTP 503');expect(wallet.deploy).not.toHaveBeenCalled();
 });
 it('blocks mismatched deployed source',async()=>{state='mismatch';await preflight();expect(card().textContent).toContain('source differs');expect(button('Deploy (sign',card())).toBeUndefined();});
 it('verifies an existing deployment and logs state without sending admin calls',async()=>{state='live';await preflight();expect(card().textContent).toContain('Deployed source and state verified');expect(card().textContent).toContain(COLLECTION_V16_CORE);expect(wallet.call).not.toHaveBeenCalled();});
});
