import 'fake-indexeddb/auto';
import {afterEach,expect,it,vi} from 'vitest';
import {JSDOM} from 'jsdom';
import {PeerApp} from '../../packages/peer/ui.js';
import {Journal} from '../../packages/peer/store.js';
import {descriptor,archive} from '../../packages/peer/protocol.js';
import type {Opening} from '../../packages/peer/protocol.js';
import {hash,canonical} from '../../packages/peer/crypto.js';
import {PeerRegistry} from '../../packages/peer/registry.js';
const apps:PeerApp[]=[],windows:JSDOM[]=[];
afterEach(()=>{for(const app of apps.splice(0))app.destroy();for(const dom of windows.splice(0))dom.window.close();vi.restoreAllMocks();});
function ui(journal:Journal){
  const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test'});windows.push(dom);Object.assign(globalThis,{document:dom.window.document});
  const app=new PeerApp(dom.window.document);apps.push(app);const inner=app as any;inner.journal=journal;
  app.dialog.setAttribute('open','');const q=(name:string)=>app.dialog.querySelector<HTMLElement>(`[data-p="${name}"]`)!;
  return {app,inner,q};
}
async function setup(){
  const white=new Journal('white-ui-'+crypto.randomUUID()),black=new Journal('black-ui-'+crypto.randomUUID());const w=await white.createKey(),b=await black.createKey();
  const opening:Opening={kind:'chain',network:'mainnet',registry:'SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1',game:2,descriptor:descriptor(180000,2000),white:{address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',key:w.public},black:{address:'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',key:b.public}};
  await white.start(opening);await black.start(opening);const a=ui(white),z=ui(black);await a.inner.useGame(await white.get(hash(opening)),true,false);await z.inner.useGame(await black.get(hash(opening)),true,false);return {a,z,white,black,opening,id:hash(opening)};
}
it('registered players cannot move before choosing transport; clocks remain paused',async()=>{
  const {a,z}=await setup();expect(a.q('readiness').textContent).toContain('Registration alone does not send moves');expect(a.q('board').querySelector('[data-square=e2]')!.hasAttribute('disabled')).toBe(true);
  await expect(a.app.act('move','e2e4')).rejects.toThrow('Use manual exchange');
  a.inner.clock.seen-=60000;a.inner.drawClock();expect(a.inner.clock.white).toBe(180000);expect(a.q('clocks').textContent).toContain('Paused');expect(z.q('identity').textContent).toContain('You: black');
  expect(a.q('readiness').compareDocumentPosition(a.q('board'))&4).toBe(4);
});
it('manual e4 transfer enables Black only after verified import, then transfers e5 back',async()=>{
  const {a,z,id,white,black}=await setup();a.q('manual').click();await vi.waitFor(()=>expect(a.inner.manual).toBe(true));
  await a.app.act('move','e2e4');expect(a.q('status').textContent).toContain('this device only');expect(z.q('history').textContent).toBe('');
  const text=canonical(await archive((await white.get(id))!));await z.app.importMessage(text);
  expect(z.q('history').textContent).toContain('e4');expect(z.q('board').querySelector('[data-square=e7]')!.hasAttribute('disabled')).toBe(false);
  await z.app.act('move','e7e5');await a.app.importMessage(canonical(await archive((await black.get(id))!)));expect(a.q('history').textContent).toContain('e5');expect(hash(await white.get(id))).toBe(hash(await black.get(id)));
  expect(z.q('clocks').textContent).toContain('Paused');expect(z.inner.clock.running).toBe(false);
});
it('empty and truncated inputs give actionable errors without changing saved moves',async()=>{
  const {a,white,id}=await setup();a.inner.manual=true;await a.app.act('move','e2e4');const before=await white.get(id);
  await expect(a.app.importMessage('')).rejects.toThrow('Paste the complete signed message');await expect(a.app.importMessage('{"line":')).rejects.toThrow('incomplete or invalid JSON');expect(await white.get(id)).toEqual(before);
  for(const button of ['answer','accept-answer']){a.q(button).click();await vi.waitFor(()=>expect(a.inner.busy).toBe(false));expect(a.q('status').textContent).toContain('Paste the complete connection');}
});
it('direct readiness requires matching history, and disconnect pauses clocks without hiding manual fallback',async()=>{
  const {a}=await setup();const close=vi.fn();a.inner.transport={connected:true,close};a.inner.render();expect(a.inner.playable()).toBe(false);expect(a.q('readiness').textContent).toContain('waiting for matching');
  a.inner.peerSeen=hash(a.inner.game);a.inner.render();expect(a.inner.playable()).toBe(true);expect(a.inner.clock.running).toBe(true);
  a.inner.transport.connected=false;a.inner.render();expect(a.inner.clock.running).toBe(false);expect(a.inner.playable()).toBe(false);
  a.q('manual').click();await vi.waitFor(()=>expect(a.inner.busy).toBe(false));await a.app.act('move','e2e4');expect(close).toHaveBeenCalled();expect(a.inner.game.line.moves).toHaveLength(1);
});
it('a restored pre-fix local e4 is preserved and can be sent to the waiting phone',async()=>{
  const {a,z,white,id}=await setup();await white.act(id,'white','move','e2e4');await a.app.refresh();expect(a.q('history').textContent).toContain('e4');expect(a.q('status').textContent).toContain('This device');
  await a.app.exportMessage();await z.app.importMessage((a.q('output') as HTMLTextAreaElement).value);expect(z.q('position').textContent).toContain('black to move');
});
it('loading the joined registry preserves a pre-existing local move and explains the connection step',async()=>{
  const {a,white,id,opening}=await setup();await white.act(id,'white','move','e2e4');vi.spyOn(PeerRegistry.prototype,'resolve').mockResolvedValue(2);vi.spyOn(PeerRegistry.prototype,'game').mockResolvedValue({creatorKey:opening.white.key,opponentKey:opening.black.key,creator:opening.white.address,opponent:opening.black.address,creatorWhite:true,descriptor:opening.descriptor,descriptorHash:hash(opening.descriptor)} as any);vi.spyOn(PeerRegistry.prototype,'confirmed').mockResolvedValue(opening);
  await a.app.loadRegistered();expect(a.q('history').textContent).toContain('e4');expect(a.q('status').textContent).toContain('Registration does not deliver moves');expect(a.inner.clock.running).toBe(false);
});
it('manual fallback permits the winning last move after loser disconnects, without a receipt',async()=>{
  const {a,z,white,black,id}=await setup();a.inner.manual=true;z.inner.manual=true;
  for(const [sender,receiver,move]of [[a,z,'f2f3'],[z,a,'e7e5'],[a,z,'g2g4']] as const){await sender.app.act('move',move);await receiver.app.importMessage((sender.q('output') as HTMLTextAreaElement).value);}
  a.app.destroy();await z.app.act('move','d8h4');const result=await archive((await black.get(id))!);expect(result.final.termination).toBe('checkmate');expect((z.q('review') as HTMLButtonElement).disabled).toBe(false);expect((await white.get(id))!.line.moves).toHaveLength(3);
});
it('refresh and incoming moves preserve the player’s chosen board orientation',async()=>{
  const {z,a}=await setup();z.inner.flipped=false;await z.app.refresh();expect(z.inner.flipped).toBe(false);a.inner.manual=true;await a.app.act('move','e2e4');await z.app.importMessage((a.q('output') as HTMLTextAreaElement).value);expect(z.inner.flipped).toBe(false);
});
it('public archive review stays available without a connection or local key',async()=>{
  const {a}=await setup();a.inner.manual=true;await a.app.act('resignation');const viewer=ui(new Journal('viewer-'+crypto.randomUUID()));await viewer.app.openArchive((a.q('output') as HTMLTextAreaElement).value);expect(viewer.q('readiness').textContent).toContain('Archive viewer');expect((viewer.q('review') as HTMLButtonElement).disabled).toBe(false);
});
