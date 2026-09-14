// @vitest-environment happy-dom
import {beforeEach, afterEach, describe, it, expect, vi} from 'vitest';
import {createHash, webcrypto} from 'node:crypto';
import source from '../../../../contracts/live/xchess-browser-house-v2.clar?raw';
import {inspectXChessSource, XCHESS_HELPER_SHA256} from '../xchess';
const wallet = vi.hoisted(()=>({connect:vi.fn(),deploy:vi.fn(),call:vi.fn()}));
vi.mock('../../wallet/connect',()=>({connectWallet:wallet.connect,disconnectWallet:vi.fn(),showContractDeploy:wallet.deploy,showContractCall:wallet.call}));
const deployer='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
let state:'missing'|'live'|'mismatch'|'unavailable';
const card=()=>document.querySelector('#xchess-deployment') as HTMLElement;
function button(text:string, scope:ParentNode=document){return [...scope.querySelectorAll('button')].find(b=>b.textContent?.includes(text)) as HTMLButtonElement;}
async function preflight(){button('preflight',card()).click();await vi.waitFor(()=>expect(card().textContent).toMatch(/OK —|FAILED/));}
async function connect(address=deployer){wallet.connect.mockResolvedValue({isConnected:true,address,network:'mainnet'});button('Connect wallet').click();await vi.waitFor(()=>expect(document.body.textContent).toContain('Disconnect'));}
beforeEach(async()=>{
 vi.resetModules();vi.clearAllMocks();localStorage.clear();state='missing';
 vi.stubGlobal('crypto',webcrypto);
 vi.stubGlobal('fetch',vi.fn(async(url:any)=>{
  if(String(url).includes('/interface/')&&String(url).endsWith('/xchess-browser-house-v2'))return new Response('{}',{status:state==='unavailable'?503:state==='missing'?404:200});
  if(String(url).includes('/source/')&&String(url).includes('/xchess-browser-house-v2'))return new Response(JSON.stringify({source:state==='mismatch'?source+'\n':source}));
  throw Error('Unexpected request: '+url);
 }));
 document.body.innerHTML='<main id="app"></main>';await import('../../../deploy-console');
});
afterEach(()=>vi.unstubAllGlobals());
describe('X-Chess manual deployment console',()=>{
 it('pins exact tested source and rejects even whitespace edits',()=>{
  expect(createHash('sha256').update(source).digest('hex')).toBe(XCHESS_HELPER_SHA256);
  expect(inspectXChessSource(source,XCHESS_HELPER_SHA256)).toEqual([]);
  expect(inspectXChessSource(source+'\n',createHash('sha256').update(source+'\n').digest('hex'))).toHaveLength(1);
  expect(inspectXChessSource(source,'00'.repeat(32))).toHaveLength(1);
 });
 it('starts without wallet requests and allows read-only preflight without connecting',async()=>{
  expect(card().textContent).toContain('engine #3049');expect(wallet.connect).not.toHaveBeenCalled();expect(wallet.deploy).not.toHaveBeenCalled();
  await preflight();expect(card().textContent).toContain('16171 / '+XCHESS_HELPER_SHA256);expect(button('Deploy (sign',card()).disabled).toBe(true);
 });
 it('keeps the wrong signer locked',async()=>{
  await preflight();await connect('SP000000000000000000002Q6VF78');expect(button('Deploy (sign',card()).disabled).toBe(true);expect(wallet.deploy).not.toHaveBeenCalled();
 });
 it('requests exact Clarity 4 source once only after a manual click; cancellation sends no admin call',async()=>{
  await preflight();await connect();expect(wallet.deploy).not.toHaveBeenCalled();const deploy=button('Deploy (sign',card());deploy.click();deploy.click();
  await vi.waitFor(()=>expect(wallet.deploy).toHaveBeenCalledTimes(1));const args=wallet.deploy.mock.calls[0][0];
  expect(args.contractName).toBe('xchess-browser-house-v2');expect(args.codeBody).toBe(source);expect(args.clarityVersion).toBe(4);expect(args.fee).toBe(490000n);expect(args.stxAddress).toBe(deployer);
  args.onCancel();expect(card().textContent).toContain('deploy cancelled in wallet');expect(wallet.call).not.toHaveBeenCalled();
 });
 it('rechecks availability at click time and avoids a second deployment',async()=>{
  await preflight();await connect();state='live';button('Deploy (sign',card()).click();
  await vi.waitFor(()=>expect(card().textContent).toContain('already deployed; its source has been verified'));
  expect(wallet.deploy).not.toHaveBeenCalled();expect(card().textContent).toContain('Deployed source verified byte-for-byte');
 });
 it('fails closed on an unavailable name check',async()=>{
  state='unavailable';await preflight();expect(card().textContent).toContain('HTTP 503');expect(button('Deploy (sign',card())).toBeUndefined();expect(wallet.deploy).not.toHaveBeenCalled();
 });
 it('rejects an already deployed contract with different source',async()=>{
  state='mismatch';await preflight();expect(card().textContent).toContain('source differs');expect(card().textContent).not.toContain('Deployed source verified byte-for-byte');expect(wallet.deploy).not.toHaveBeenCalled();
 });
 it('verifies deployed source and supplies the board handoff without admin transactions',async()=>{
  state='live';await preflight();expect(card().textContent).toContain('Deployed source verified byte-for-byte');expect(card().textContent).toContain(deployer+'.xchess-browser-house-v2');expect(button('Deploy (sign',card())).toBeUndefined();expect(wallet.call).not.toHaveBeenCalled();
 });
});
