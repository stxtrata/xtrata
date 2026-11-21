import {readFileSync} from 'node:fs';
import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {createStacksPrivateKey,getAddressFromPrivateKey,makeRandomPrivKey,privateKeyToString,signStructuredData,TransactionVersion} from '@stacks/transactions';
import {memoryDb} from './storage/fixtures';
import {creatorProofData} from '../creator-proof';
import {clearProMembershipCache,authorizePro,checkProMembership} from '../audionaut-pro-auth';
import {onRequest as api} from '../../api/audionaut-beta-pro/session';
import {onRequest as middleware} from '../../audionaut-beta-pro/_middleware';
let env:any,holds=true,unavailable=false;
function wallet(){const raw=privateKeyToString(makeRandomPrivKey()),key=raw.length===64?raw+'01':raw;return {key,address:getAddressFromPrivateKey(key,TransactionVersion.Mainnet)};}
const url='https://xtrata.xyz/api/audionaut-beta-pro/session';
async function call(body?:any,cookie?:string){return api({env,request:new Request(url,{method:body?'POST':'GET',headers:{Origin:'https://xtrata.xyz','content-type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})})} as any);}
async function signIn(owner=wallet()){
 const challenge=(await(await call({action:'challenge',address:owner.address})).json() as any).challenge;
 const signature=signStructuredData({...creatorProofData(challenge),privateKey:createStacksPrivateKey(owner.key)}).data;
 const response=await call({action:'verify',id:challenge.id,signature});
 return {owner,challenge,signature,response,cookie:(response.headers.get('set-cookie')||'').split(';')[0]};
}
beforeEach(()=>{clearProMembershipCache();holds=true;unavailable=false;const DB=memoryDb();DB.sqlite.exec(readFileSync(new URL('../../migrations/018_creator_sessions.sql',import.meta.url),'utf8'));env={DB,CREATOR_AUTH_MODE:'off'};
 vi.stubGlobal('fetch',vi.fn(async(input:any)=>{if(unavailable)throw new Error('Gateway unavailable');const address=String(input);if(address.includes('/holdings'))return Response.json({total:holds?1:0,results:holds?[{value:{repr:'u3061'}}]:[]});if(address.includes('/get-token-mint-context'))return Response.json({okay:true,result:'0x0a01'});throw new Error('Unexpected network request: '+address); }));
});
afterEach(()=>{vi.unstubAllGlobals();clearProMembershipCache();env.DB.sqlite.close();});
describe('AudioNaut Pro server gate',()=>{
 it('requires actual proof, never a client claimed address or disabled creator enforcement',async()=>{
  const owner=wallet();const response=await api({env,request:new Request(url+'?address='+owner.address)} as any);expect((await response.json() as any).allowed).toBe(false);
  const missing=await middleware({env,request:new Request('https://xtrata.xyz/audionaut-beta-pro/daw/js/main.js'),next:()=>new Response('secret')} as any);expect(missing.status).toBe(401);
  const challenge=(await(await call({action:'challenge',address:owner.address})).json() as any).challenge;
  const bad=await call({action:'verify',id:challenge.id,signature:'00'.repeat(65)});expect(bad.status).toBe(400);expect(bad.headers.get('set-cookie')).toBe(null);
 });
 it('accepts a disposable valid signer who owns an Audionaut, then refuses replay',async()=>{
  const signed=await signIn();expect(signed.response.status).toBe(200);expect(signed.cookie).toMatch(/^xtrata_creator=/);expect(signed.response.headers.get('set-cookie')).toContain('HttpOnly');
  const opened=await middleware({env,request:new Request('https://xtrata.xyz/audionaut-beta-pro/daw.html',{headers:{cookie:signed.cookie}}),next:()=>new Response('protected workstation')} as any);expect(opened.status).toBe(200);expect(await opened.text()).toBe('protected workstation');expect(opened.headers.get('cache-control')).toContain('no-store');
  expect((await call({action:'verify',id:signed.challenge.id,signature:signed.signature})).status).toBe(400);
 });
 it('allows beta and beta-pro to recheck the same session independently', async () => {
  const signed = await signIn();
  clearProMembershipCache();
  vi.mocked(fetch).mockClear();
  const { onRequest: beta } = await import('../../api/audionaut-beta/session');
  const sessionRequest = (edition: string) => new Request(
    'https://xtrata.xyz/api/' + edition + '/session', { headers: { cookie: signed.cookie } }
  );
  let failFirst!: (error: Error) => void;
  vi.mocked(fetch).mockImplementationOnce(() => new Promise((_resolve, reject) => { failFirst = reject; }));
  const first = beta({ env, request: sessionRequest('audionaut-beta') } as any);
  await vi.waitFor(() => expect(failFirst).toBeTypeOf('function'));
  const second = api({ env, request: sessionRequest('audionaut-beta-pro') } as any);
  try {
    await vi.waitFor(() => expect(vi.mocked(fetch).mock.calls.some(
      ([input]) => String(input).includes('/get-token-mint-context')
    )).toBe(true));
    expect(await (await second).json()).toMatchObject({ signedIn: true, allowed: true });
  } finally {
    failFirst(new Error('Ownership service interrupted'));
    expect((await first).status).toBe(503);
  }
  const requests = vi.mocked(fetch).mock.calls.length;
  expect(await (await beta({ env, request: sessionRequest('audionaut-beta') } as any)).json())
    .toMatchObject({ signedIn: true, allowed: true });
  expect(fetch).toHaveBeenCalledTimes(requests);
 });
 it('retains a newer ownership decision when an older lookup finishes late', async () => {
  const { address } = wallet();
  let finishFirst!: (response: Response) => void;
  vi.mocked(fetch).mockImplementationOnce(() => new Promise(resolve => { finishFirst = resolve; }));
  const earlier = checkProMembership(env, address);
  holds = false;
  expect((await checkProMembership(env, address, { refresh: true })).holds).toBe(false);
  finishFirst(Response.json({ total: 1, results: [{ value: { repr: 'u3061' } }] }));
  expect((await earlier).holds).toBe(false);
  expect((await checkProMembership(env, address)).holds).toBe(false);
 });
 it('fails closed on non-holders, revoked ownership and gateway failure',async()=>{
  holds=false;const denied=await signIn();expect(denied.response.status).toBe(403);expect(denied.response.headers.get('set-cookie')).toBe(null);
  holds=true;const signed=await signIn();holds=false;await checkProMembership(env,signed.owner.address,{refresh:true});
  expect((await authorizePro(new Request(url,{headers:{cookie:signed.cookie}}),env)).status).toBe(403);
  clearProMembershipCache();unavailable=true;expect((await authorizePro(new Request(url,{headers:{cookie:signed.cookie}}),env)).status).toBe(503);
 });
 it('pairs one device to the dedicated tester wallet and keeps its scope and lifetime tied to that Mac', async()=>{
  const {onRequest:pair}=await import('../../audionaut-beta-pro/pair');
  const {onRequest:earlierBeta}=await import('../../audionaut-beta/_middleware');
  env.DB.sqlite.exec(readFileSync(new URL('../../migrations/034_audionaut_device_pairing.sql',import.meta.url),'utf8'));
  const signed=await signIn(), other=await signIn();
  const origin='https://xtrata.xyz', path=origin+'/audionaut-beta-pro/pair';
  const post=(action:string,cookie='',code='',caller=origin)=>pair({env,request:new Request(path,{
    method:'POST',headers:{Origin:caller,'content-type':'application/json',Cookie:cookie},body:JSON.stringify({action,code})})} as any);
  const takeCookie=(r:Response)=>r.headers.get('set-cookie')?.split(';')[0]||'';
  const body=(r:Response)=>r.json() as Promise<any>;
  const asset=(cookie:string)=>middleware({env,request:new Request(origin+'/audionaut-beta-pro/daw.html',{headers:{Cookie:cookie}}),next:()=>new Response('studio')} as any);
  expect((await post('start')).status).toBe(404);
  env.AUDIONAUT_PAIRING_WALLET=signed.owner.address;
  const ipad=await post('start'), pending=takeCookie(ipad), {code}=await body(ipad);
  expect(code).toHaveLength(16);
  expect(await body(await post('claim',pending))).toEqual({waiting:true});
  expect((await post('approve',other.cookie,code)).status).toBe(403);
  expect((await post('approve',signed.cookie,code,'https://another.example')).status).toBe(403);
  expect((await post('approve',signed.cookie,code)).status).toBe(200);
  const second=await post('start');
  expect(await body(await post('claim',takeCookie(second)))).toEqual({waiting:true});
  const claim=await post('claim',pending),device=takeCookie(claim);
  expect(await body(claim)).toEqual({ready:true});
  expect(claim.headers.get('set-cookie')).toContain('Path=/audionaut-beta-pro/');
  expect(claim.headers.get('set-cookie')).toContain('HttpOnly; Secure; SameSite=Strict');
  expect(await body(await post('claim',pending))).toEqual({waiting:true});
  expect(await (await asset(device)).text()).toBe('studio');
  expect((await post('approve',device,code)).status).toBe(403);
  expect((await earlierBeta({env,request:new Request(origin+'/audionaut-beta/daw.html',{headers:{Cookie:device}}),next:()=>new Response('studio')} as any)).status).toBe(303);
  expect((await authorizePro(new Request(url,{headers:{Cookie:device}}),env)).allowed).toBe(false);
  holds=false;clearProMembershipCache();expect((await asset(device)).status).toBe(303);
  holds=true;clearProMembershipCache();
  const issue=async()=>{const start=await post('start');const {code}=await body(start);
    await post('approve',signed.cookie,code);return takeCookie(await post('claim',takeCookie(start)));};
  const next=await issue();expect((await asset(device)).status).toBe(303);expect((await asset(next)).status).toBe(200);
  expect((await post('revoke',signed.cookie)).status).toBe(200);expect((await asset(next)).status).toBe(303);
  const final=await issue();env.DB.sqlite.exec('UPDATE creator_sessions SET revoked_at=1');
  expect((await asset(final)).status).toBe(303);
 });
 it('protects encoded direct assets while leaving only Pro gate assets public',async()=>{
  for(const path of ['/audionaut-beta-pro/%64aw.html','/audionaut-beta-pro/%2564aw.html','/audionaut-beta-pro/daw/js/main.js','/audionaut-beta-pro/tools/pro-export-test.mjs']){
   const response=await middleware({env,request:new Request('https://xtrata.xyz'+path),next:()=>new Response('secret')} as any);expect([401,303]).toContain(response.status);
  }
  for(const path of ['/audionaut-beta-pro','/audionaut-beta-pro/','/audionaut-beta-pro/audionaut-pro-gate.js'])expect((await middleware({env,request:new Request('https://xtrata.xyz'+path),next:()=>new Response('public')} as any)).status).toBe(200);
  for(const path of ['/audionaut-beta-pro/sell/%252e%252e/daw.html','/audionaut-beta-pro/sell/%252e/daw.html','/audionaut-beta-pro/sell/%255c..%255cdaw.html','/audionaut-beta-pro/sell/%2525252e%2525252e/daw.html']){
   const response=await middleware({env,request:new Request('https://xtrata.xyz'+path),next:()=>new Response('secret')} as any);expect(response.status).toBe(400);
  }
 });
 it('rejects cross-origin sign-in mutations and expired sessions',async()=>{
  const bad=await api({env,request:new Request(url,{method:'POST',headers:{Origin:'https://attacker.test','content-type':'application/json'},body:'{}'})} as any);expect(bad.status).toBe(403);
  const signed=await signIn();env.DB.sqlite.exec('UPDATE creator_sessions SET expires_at=1');expect((await authorizePro(new Request(url,{headers:{cookie:signed.cookie}}),env)).status).toBe(401);
 });
});
