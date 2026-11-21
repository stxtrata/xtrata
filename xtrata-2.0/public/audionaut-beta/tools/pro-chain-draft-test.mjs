import assert from 'node:assert/strict';
import {serve,browser,page} from './serve.mjs';
const DUMMY_DB='audionaut-beta-chain-drafts';
const {srv,url}=await serve(),b=await browser(),logs=[];
try{
  const p=await page(b,url,{logs});
  await p.route(url+'/draft-test',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><p id="status-text"></p><main id="panel"></main>'}));
  await p.goto(url+'/draft-test');
  const setup=await p.evaluate(async()=>{
    const base='/audionaut-beta/daw/js/';
    const S=await import(base+'state.js'),A=await import(base+'assets.js'),D=await import(base+'chain-draft-storage.js'),C=await import(base+'chain-publishing.js'),P=await import(base+'persistence.js');
    const {encodeWav}=await import(base+'audio-utils.js');
    const ctx=new OfflineAudioContext(1,4800,48000),buffer=ctx.createBuffer(1,4800,48000);buffer.getChannelData(0).fill(.1);
    const project=S.makeProject();project.projectName='Publishing recovery fixture';project.channels.length=1;project.instruments.length=1;project.sequences=[S.makeSequence(1,1),S.makeSequence(1,1)];project.currentSequence=1;
    project.channels[0].source=A.registerBlob(encodeWav(buffer,{bitDepth:'float32'}),{name:'Original recording.wav'});project.instruments[0].synthId='concertpiano';
    S.store.loadProject(project);
    const original=await D.canonicalPublishingProject(S.store.project),hash=await D.projectFingerprint(S.store.project);
    const draft=await C.prepareDependencyPackage(S.store.project,{network:'mainnet',contractId:'SP000000000000000000002Q6VF78.draft'});
    Object.assign(draft,{sourceProjectId:project.projectId,sourceProjectHash:hash,sourceHashVersion:D.SOURCE_HASH_VERSION});draft.manifest.runtime.tokenId='100';draft.manifest.assets[0].tokenId='101';
    await D.savePublishingDraft(draft);
    const text=await P.exportProjectAsync();P.importProject(text);
    const portable=await D.canonicalPublishingProject(S.store.project),portableHash=await D.projectFingerprint(S.store.project);
    await P.autosave({force:true});
    return {projectId:project.projectId,hash,portableHash,original,portable,draft:JSON.parse(C.serializeChainDraft(draft)),db:D.CHAIN_DRAFT_DB};
  });
  if(setup.hash!==setup.portableHash){
    const differences=[];const walk=(a,z,path='')=>{if(JSON.stringify(a)===JSON.stringify(z))return;if(a&&z&&typeof a==='object'&&typeof z==='object')for(const k of new Set([...Object.keys(a),...Object.keys(z)]))walk(a[k],z[k],path+'/'+k);else differences.push({path,a,z});};walk(setup.original,setup.portable);console.log('Fingerprint differences',JSON.stringify(differences));
  }
  assert.equal(setup.hash,setup.portableHash,'local Blob → portable JSON import retains musical fingerprint');
  assert.equal(setup.db,'audionaut-beta-chain-drafts');
  async function restore(){
    await p.reload();return p.evaluate(async id=>{
      const base='/audionaut-beta/daw/js/';globalThis.S=await import(base+'state.js');globalThis.D=await import(base+'chain-draft-storage.js');globalThis.P=await import(base+'persistence.js');globalThis.UI=await import(base+'pro-chain-ui.js');
      await P.restoreAutosave();globalThis.unmountDraft=UI.mount(document.querySelector('#panel'));return {hash:await D.projectFingerprint(S.store.project),saved:await D.loadPublishingDraft(id)};
    },setup.projectId);
  }
  const restored=await restore();assert.equal(restored.hash,setup.hash,'IndexedDB recovery preserves content-based source identity');
  assert.equal(restored.saved.manifest.runtime.tokenId,'100');assert.equal('files'in restored.saved,false);assert.equal(JSON.stringify(restored.saved).includes('data:audio/'),false);
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft restored.'));
  await p.getByLabel('Inscription ID',{exact:true}).first().fill('123');
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft saved in this browser.'));
  assert.equal(await p.evaluate(async id=>(await D.loadPublishingDraft(id)).manifest.runtime.tokenId,setup.projectId),'123','debounced edit must commit');
  await restore();await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft restored.'));
  assert.equal(await p.getByLabel('Inscription ID',{exact:true}).first().inputValue(),'123','edited confirmed ID survives reload without manual download');
  const imported=structuredClone(setup.draft);imported.manifest.runtime.tokenId='321';
  await p.locator('input[type=file]').setInputFiles({name:'saved-draft.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft opened.'));
  assert.equal(await p.evaluate(async id=>(await D.loadPublishingDraft(id)).manifest.runtime.tokenId,setup.projectId),'321','file draft import persists');
  const malformed=structuredClone(imported);malformed.bindings['/__proto__/source']=malformed.manifest.assets[0].id;
  await p.locator('input[type=file]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(malformed))});
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('invalid dependency binding'));
  assert.equal(await p.evaluate(async id=>(await D.loadPublishingDraft(id)).manifest.runtime.tokenId,setup.projectId),'321','bad import leaves saved draft unchanged');
  const edits=await p.evaluate(async()=>{
    const before=await D.projectFingerprint(S.store.project);S.store.setProjectProp('bpm',137);const after=await D.projectFingerprint(S.store.project);await P.autosave({force:true});return {before,after};
  });assert.notEqual(edits.before,edits.after,'musical edit changes fingerprint');
  await restore();await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft restored, but the project changed.'));
  await p.evaluate(()=>{globalThis.verificationFetches=0;const old=fetch;globalThis.fetch=(...args)=>{if(String(args[0]).includes('chain-runtime'))verificationFetches++;return old(...args);};});
  await p.getByRole('button',{name:'Verify and prepare song',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Prepare dependencies again'));
  assert.equal(await p.evaluate(()=>verificationFetches),0,'stale restored draft cannot start verification');
  // Other projects do not restore or overwrite this project's publication.
  const isolated=await p.evaluate(async oldId=>{unmountDraft();document.querySelector('#panel').replaceChildren();const other=S.makeProject();S.store.loadProject(other);globalThis.unmountDraft=UI.mount(document.querySelector('#panel'));return {other:await D.loadPublishingDraft(other.projectId),old:(await D.loadPublishingDraft(oldId)).manifest.runtime.tokenId};},setup.projectId);
  assert.equal(isolated.other,null);assert.equal(isolated.old,'321');assert.equal(await p.getByRole('button',{name:'Verify and prepare song',exact:true}).count(),0);
  // Saving before navigation is mandatory: a storage failure must retain this
  // screen and explain the manual backup, without opening the inscription flow.
  await p.getByRole('button',{name:'Prepare dependencies',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Prepared 0 unique sounds'));
  const publishingId=await p.evaluate(()=>S.store.project.projectId);
  await p.route(url+'/wizard/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><p>Local inscription review fixture</p>'}));
  await p.route(url+'/inscribe**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><p>Local inscription review fixture</p>'}));
  await p.getByLabel('Inscription ID',{exact:true}).first().fill('777');
  await p.getByRole('button',{name:'Review dependency inscriptions',exact:true}).click();
  await p.waitForFunction(()=>location.pathname.startsWith('/wizard')||location.pathname.startsWith('/inscribe')||document.querySelector('#panel')?.textContent.includes('Open review for manual upload'));
  const manual=await p.getByRole('button',{name:'Open review for manual upload',exact:true}).count();
  if(manual){
    assert.equal(process.env.AUDIONAUT_TEST_BROWSER,'webkit','Chrome/Firefox retain automatic handoff');
    assert.match(await p.locator('#panel').textContent(),/draft is saved.*Download the dependency package/s);
    assert.equal(await p.evaluate(async id=>(await D.loadPublishingDraft(id)).manifest.runtime.tokenId,publishingId),'777','WebKit fallback retains durable draft');
    await p.getByRole('button',{name:'Open review for manual upload',exact:true}).click();
  }
  await p.waitForURL(target=>target.pathname.startsWith('/wizard')||target.pathname.startsWith('/inscribe'));
  if(manual)assert.equal(new URL(p.url()).search,'','manual review does not claim a stored binary handoff');
  console.log(manual?'WebKit: explicit manual upload fallback; publishing metadata recovered':'Automatic dependency review handoff passed');
  assert.equal(await p.evaluate(async id=>{const D=await import('/audionaut-beta/daw/js/chain-draft-storage.js');return(await D.loadPublishingDraft(id)).manifest.runtime.tokenId;},publishingId),'777','navigation waits for the latest reference edit to commit');
  await p.goto(url+'/draft-test');
  await p.evaluate(async id=>{const base='/audionaut-beta/daw/js/';globalThis.D=await import(base+'chain-draft-storage.js');globalThis.S=await import(base+'state.js');const UI=await import(base+'pro-chain-ui.js');const draft=await D.loadPublishingDraft(id);S.store.loadProject(draft.project);globalThis.unmountDraft=UI.mount(document.querySelector('#panel'));},publishingId);
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Publishing draft restored.'));
  await p.getByRole('button',{name:'Prepare dependencies',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('Prepared 0 unique sounds'));
  assert.equal(await p.getByLabel('Inscription ID',{exact:true}).first().inputValue(),'777','repreparing missing files retains confirmed references by exact content');
  const failure=await p.evaluate(()=>{globalThis.originalIDB=indexedDB;globalThis.openedDatabases=[];Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:{open(name){openedDatabases.push(name);throw Error('Synthetic storage denial');}}});return location.href;});
  await p.getByLabel('Inscription ID',{exact:true}).first().fill('999');
  await p.waitForFunction(()=>document.querySelector('#panel').textContent.includes('could not be saved in this browser'));
  await p.getByRole('button',{name:'Review dependency inscriptions',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#panel [role=status]').textContent.includes('could not be saved in this browser'));
  assert.equal(p.url(),failure,'failed durable save prevents navigation');
  assert.ok((await p.evaluate(()=>openedDatabases)).every(name=>name===DUMMY_DB),'no create/wizard handoff is attempted after draft storage fails');
  await p.evaluate(()=>{Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:originalIDB});unmountDraft();});
  assert.deepEqual(logs,[]);console.log('PASS publishing drafts: local Blob/export/recovery fingerprints, reload and file import, reference autosave, stale-project guard, project isolation, invalid imports and storage failure before navigation');
}finally{await b.close();await new Promise(resolve=>srv.close(resolve));}
