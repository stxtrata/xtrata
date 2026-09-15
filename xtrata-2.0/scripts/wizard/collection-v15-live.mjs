#!/usr/bin/env node
/** Dedicated mainnet wizard: explicit setup/authorization, encrypted key, fail-closed journal. */
import { createRequire } from 'node:module';
import { randomBytes, createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, open, unlink } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encryptWizard, decryptWizard, assertBudget } from './collection-v15-vault.mjs';
import { killSwitchEngaged } from './inscribe.mjs';
import { prepareNumberedJpegs } from './prepare-numbered-jpegs.mjs';
const project = resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const require = createRequire(join(project,'contracts/clarinet/package.json'));
const T = require('@stacks/transactions');
const { Cl } = T;
const directory = process.env.COLLECTION_WIZARD_STATE_DIR ? resolve(process.env.COLLECTION_WIZARD_STATE_DIR) : join(project,'scripts/wizard/.collection-v15');
const configPath = join(directory,'config.json'), journalPath = join(directory,'journal.json');
const coreAddress = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', coreName = 'xtrata-v3-2-3';
const sha = b => createHash('sha256').update(b).digest('hex');
const json = async p => JSON.parse(await readFile(p,'utf8'));
const save = async (p,v) => { await writeFile(p+'.tmp',JSON.stringify(v,null,2)+'\n',{mode:0o600}); await rename(p+'.tmp',p); };
const password = () => { const p = process.env.COLLECTION_WIZARD_PASSPHRASE; if (!p) throw new Error('Provide COLLECTION_WIZARD_PASSPHRASE through a secret manager or hidden terminal input.'); return p; };
const args = process.argv.slice(2), command = args[0] || 'status';
if (!['setup','status','authorize','run','prepare','register','replace','launch','retire'].includes(command)) throw new Error('Use setup, status, authorize <cap-microSTX>, or prepare/register/replace/launch/run --broadcast.');
await mkdir(directory,{recursive:true,mode:0o700});
const lock = await open(join(directory,'lock'),'wx',0o600).catch(()=>{ throw new Error('Runner already active or stale lock present. Verify no runner is active before removing its lock.'); });
try {
  if (command === 'setup') {
    if (args.length !== 1) throw new Error('Setup accepts no arguments.');
    try { await readFile(configPath); throw new Error('Configuration exists; refusing to replace this wizard.'); } catch(e) { if(e.code !== 'ENOENT') throw e; }
    if (killSwitchEngaged()) throw new Error('Wizard kill switch engaged.');
    const key = randomBytes(32).toString('hex')+'01';
    const address = T.getAddressFromPrivateKey(key,'mainnet');
    const config = { version:1,address,contractName:'collection-v15-wizard-test',capUstx:'0',maxTxFeeUstx:'1000000',balanceFloorUstx:'100000',confirmations:6,vault:encryptWizard(key,password()) };
    await writeFile(configPath,JSON.stringify(config,null,2)+'\n',{flag:'wx',mode:0o600});
    console.log(JSON.stringify({address,contract:address+'.'+config.contractName,spending:'disabled; authorize a total cap before run'},null,2));
  } else {
    const config = await json(configPath);
    if(config.version!==1 || !Number.isInteger(config.confirmations) || config.confirmations<6 || !/^[0-9]+$/.test(config.capUstx) || !/^[1-9][0-9]*$/.test(config.maxTxFeeUstx) || !/^[0-9]+$/.test(config.balanceFloorUstx))throw new Error('Invalid dedicated wizard configuration.');
    if (command === 'authorize') {
      if (args.length !== 2 || !/^[1-9][0-9]*$/.test(args[1])) throw new Error('Provide the authorized lifetime cap in micro-STX.');
      config.capUstx = args[1]; await save(configPath,config);
      console.log('Lifetime spending cap saved. Funding does not start the runner.');
    } else if(command === 'status') {
      const journal=await json(journalPath).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
      console.log(JSON.stringify({address:config.address,contract:config.address+'.'+config.contractName,capUstx:config.capUstx,spentUpperBoundUstx:journal?.spent,complete:journal?.complete,steps:journal?Object.fromEntries(Object.entries(journal.steps).map(([name,{serialized,...entry}])=>[name,entry])):{}},null,2));
    }
    else {
      if(args.length!==2 || args[1]!=='--broadcast') throw new Error('Live execution requires run --broadcast. Use collection-v15-run.mjs --dry for simulation.');
      if(BigInt(config.capUstx)<=0n)throw new Error('Live spending disabled. Authorize a total cap first.');
      const key = decryptWizard(config.vault,password());
      if(T.getAddressFromPrivateKey(key,'mainnet')!==config.address || config.address===coreAddress) throw new Error('Dedicated wallet identity mismatch.');
      if(config.contractName!=='collection-v15-wizard-test') throw new Error('Unexpected test helper target.');
      const api = (process.env.COLLECTION_WIZARD_API_URL || 'https://api.hiro.so').replace(/\/$/,'');
      const request = async (path,options={}) => {
        const response = await fetch(api+path,{...options,signal:AbortSignal.timeout(30000),headers:{...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{}),...options.headers}});
        if(!response.ok) { const error = new Error(`API HTTP ${response.status} at ${path}`); error.status=response.status;try{error.reason=(await response.json()).reason;}catch{}throw error; }
        return response.json();
      };
      const guard = () => { if(killSwitchEngaged()) throw new Error('Wizard kill switch engaged.'); };
      guard();
      const chainInfo=await request('/v2/info');
      if(chainInfo.network_id!==1)throw new Error('API is not mainnet.');
      const read = async (contract,name,functionArgs=[]) => {
        const result = await request(`/v2/contracts/call-read/${contract}/${name}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:config.address,arguments:functionArgs.map(T.cvToHex)})});
        if(!result.okay) throw new Error('Read-only call failed: '+name);
        return T.hexToCV(result.result);
      };
      const core = coreAddress+'/'+coreName, helper = config.address+'/'+config.contractName;
      const expect = (actual,expected,label) => { if(T.cvToHex(actual)!==T.cvToHex(expected)) throw new Error('Verification failed: '+label); };
      expect(await read(core,'is-paused'),Cl.ok(Cl.bool(false)),'core active');
      const source = await readFile(join(project,'contracts/live/xtrata-collection-mint-v1.5.clar'),'utf8');
      if(sha(source)!=='0f2dcba375a863a8c3c4ef8516d81fbd305a3c208961a85612f3ee9eb38ede57') throw new Error('Helper source pin mismatch.');
      const output=resolve(project,'../media/wizard-numbered-jpegs');
      const manifest=await prepareNumberedJpegs(output);
      const identity=sha(JSON.stringify({address:config.address,source:sha(source),hashes:manifest.items.map(i=>i.rollingHash)}));
      const journal=await json(journalPath).catch(e=>{if(e.code==='ENOENT')return {identity,spent:'0',steps:{}};throw e;});
      if(journal.replacementComplete&&['run','register'].includes(command))throw new Error('Original inventory has been replaced; refusing the legacy inventory path.');
      if(journal.identity!==identity) throw new Error('Run identity or JPEG bytes changed; refusing resume.');
      const persist=()=>save(journalPath,journal);
      const wait = async txid => {
        for(let attempt=0;attempt<240;attempt++) {
          guard();
          let tx; try { tx=await request('/extended/v1/tx/'+txid); } catch(e) { if(e.status!==404)throw e; }
          if(tx && tx.tx_status!=='pending') {
            if(tx.tx_status!=='success') throw new Error('Transaction failed: '+txid+' '+tx.tx_status);
            const info=await request('/v2/info');
            if(tx.canonical===true && info.stacks_tip_height-tx.block_height+1>=config.confirmations) return;
          }
          await new Promise(r=>setTimeout(r,15000));
        }
        throw new Error('Confirmation timeout; resume the same run later.');
      };
      const step=async (id,fn,args=[],protocol=0n,deploy=false)=>{
        guard();
        if(journal.steps[id]) {
          const previous=journal.steps[id];
          // A process can stop between journaling and sending. Replay exactly the same signed bytes.
          try { await request('/extended/v1/tx/'+previous.txid); }
          catch(error) {
            if(error.status!==404)throw error;
            if(!previous.serialized)throw new Error('Missing journaled transaction bytes.');
            if(BigInt(journal.spent)>BigInt(config.capUstx))throw new Error('Journal exceeds authorized cap.');
            guard();
            await request('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(previous.serialized,'hex')});
          }
          await wait(previous.txid); return;
        }
        const account=await request(`/v2/accounts/${config.address}?proof=0`);
        const nonces=await request(`/extended/v1/address/${config.address}/nonces`);
        if(nonces.possible_next_nonce!==account.nonce) throw new Error('Pending or conflicting wallet nonce; wait before resuming.');
        const options={senderKey:key,network:'mainnet',nonce:BigInt(account.nonce),fee:0n,postConditionMode:T.PostConditionMode.Deny,postConditions:protocol ? [T.Pc.principal(config.address).willSendLte(protocol).ustx()] : []};
        const build=fee=>deploy ? T.makeContractDeploy({...options,fee,contractName:config.contractName,codeBody:source,clarityVersion:T.ClarityVersion.Clarity4}) : T.makeContractCall({...options,fee,contractAddress:config.address,contractName:config.contractName,functionName:fn,functionArgs:args});
        const draft=await build(0n);
        const payload=T.serializePayload(draft.payload);
        let quote;
        try { quote=await request('/v2/fees/transaction',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({transaction_payload:typeof payload==='string'?payload:Buffer.from(payload).toString('hex'),estimated_len:typeof draft.serialize()==='string'?draft.serialize().length/2:draft.serialize().length})});
        } catch(error) {
          if(!['prepare','register','replace','launch','retire'].includes(command)||error.reason!=='NoEstimateAvailable')throw error;
          const rate=await request('/v2/fees/transfer');
          const size=typeof draft.serialize()==='string'?draft.serialize().length/2:draft.serialize().length;
          if(!Number.isFinite(rate)||rate<=0)throw new Error('Invalid minimum fee rate.');
          const fallback=Math.max(10000,Math.ceil(rate*size));
          if(fallback>Number(config.maxTxFeeUstx))throw new Error('Minimum byte fee exceeds transaction ceiling.');
          quote={estimations:[null,{fee:fallback}]};
          console.log(id+': no historical cost estimate; using current minimum byte rate with 10000 micro-STX floor.');
        }
        const feeNumber=quote.estimations?.[1]?.fee;
        if(!Number.isSafeInteger(feeNumber)||feeNumber<=0)throw new Error('Invalid live miner quote.');
        let fee=BigInt(feeNumber);
        if(fee>BigInt(config.maxTxFeeUstx)) {
          if(!['prepare','register','replace','launch','retire'].includes(command))throw new Error('Live miner quote exceeds per-transaction ceiling.');
          fee=BigInt(config.maxTxFeeUstx);
          console.log(id+': quote exceeds ceiling; bidding the existing capped fee '+fee+' micro-STX. No automatic fee increase.');
        }
        assertBudget(BigInt(journal.spent),fee+protocol,BigInt(config.capUstx),BigInt(account.balance),BigInt(config.balanceFloorUstx));
        guard(); const tx=await build(fee); const txid='0x'+tx.txid().replace(/^0x/,'');
        // Charge conservatively and persist before broadcast. Unknown outcomes are never re-signed.
        const raw=tx.serialize();
        journal.steps[id]={txid,status:'prepared',serialized:typeof raw==='string'?raw:Buffer.from(raw).toString('hex'),maxCostUstx:String(fee+protocol)}; journal.spent=String(BigInt(journal.spent)+fee+protocol); await persist();
        const serialized=tx.serialize();
        await request('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:typeof serialized==='string'?Buffer.from(serialized,'hex'):serialized});
        journal.steps[id].status='submitted';await persist();await wait(txid);
        journal.steps[id].status='confirmed';await persist();console.log(id+': confirmed '+txid);
      };
      if(command==='retire') {
        const deployed=await request(`/v2/contracts/source/${helper}?proof=0`);
        if(sha(deployed.source)!==sha(source))throw new Error('Deployed source mismatch.');
        expect(await read(helper,'get-owner'),Cl.ok(Cl.principal(config.address)),'helper owner');
        await step('retire-v15-pause','set-paused',[Cl.bool(true)]);
        expect(await read(helper,'is-paused'),Cl.ok(Cl.bool(true)),'retired helper paused');
        journal.retired=true;await persist();console.log('v1.5 wizard helper paused; ownership, assets and recovery preserved.');
      } else if(command==='launch') {
        if(!journal.replacementComplete)throw new Error('Optimized replacement must be complete before launch.');
        const deployed=await request(`/v2/contracts/source/${helper}?proof=0`);
        if(sha(deployed.source)!==sha(source))throw new Error('Deployed source mismatch.');
        expect(await read(helper,'get-owner'),Cl.ok(Cl.principal(config.address)),'helper owner');
        expect(await read(helper,'get-locked-core-contract'),Cl.ok(Cl.contractPrincipal(coreAddress,coreName)),'core binding');
        expect(await read(helper,'get-max-supply'),Cl.ok(Cl.uint(10)),'ten item supply');
        expect(await read(helper,'get-active-phase'),Cl.ok(Cl.uint(0)),'base pricing active');
        expect(await read(helper,'get-allowlist-enabled'),Cl.ok(Cl.bool(false)),'public mint access');
        const replacement=await json(join(directory,'replacement.json'));
        if(!replacement.staged || Object.keys(replacement.assets ?? {}).length!==10)throw new Error('Exactly ten verified replacement assets required.');
        for(const asset of Object.values(replacement.assets)) {
          if(!asset.verified)throw new Error('Unverified optimized asset.');
          expect(await read(helper,'get-registered-token-uri',[Cl.bufferFromHex(asset.rollingHash)]),Cl.some(Cl.tuple({'token-uri':Cl.stringAscii(asset.tokenUri)})),'optimized URI registered');
        }
        if(!journal.steps['launch-price-1-stx'])expect(await read(helper,'is-paused'),Cl.ok(Cl.bool(true)),'paused before pricing');
        await step('launch-price-1-stx','set-mint-price',[Cl.uint(1000000)]);
        expect(await read(helper,'get-mint-price'),Cl.ok(Cl.uint(1000000)),'one STX collection price');
        await step('launch-unpause-1-stx','set-paused',[Cl.bool(false)]);
        expect(await read(helper,'is-paused'),Cl.ok(Cl.bool(false)),'mint unpaused');
        journal.launchOneStxComplete=true;await persist();
        console.log('Collection price is 1 STX and minting is unpaused. No artwork inscribed by wizard.');
      } else {
      await step('deploy',null,[],0n,true);
      const deployed=await request(`/v2/contracts/source/${helper}?proof=0`);
      if(sha(deployed.source)!==sha(source))throw new Error('Deployed source mismatch.');
      expect(await read(helper,'get-owner'),Cl.ok(Cl.principal(config.address)),'helper owner');
      expect(await read(helper,'get-locked-core-contract'),Cl.ok(Cl.contractPrincipal(coreAddress,coreName)),'core binding');
      await step('supply','set-max-supply',[Cl.uint(10)]);
      if(['prepare','register','replace'].includes(command)) {
        await step('metadata','set-collection-metadata',[Cl.stringAscii('Numbers 1-10'),Cl.stringAscii('NUM10'),Cl.stringAscii(''),Cl.stringAscii('Ten numbered JPEGs. Collection setup test.'),Cl.uint(0)]);
        await step('price','set-mint-price',[Cl.uint(0)]);
        expect(await read(helper,'is-paused'),Cl.ok(Cl.bool(true)),'helper remains paused');
        if(command==='replace') {
          const replacement=await json(join(directory,'replacement.json'));
          const optimized=await json(resolve(project,'../media/wizard-numbered-jpegs-optimized/manifest.json'));
          if(!replacement.staged||optimized.items.length!==10)throw new Error('Verified replacements required.');
          const entries=optimized.items.map(item=>{const asset=replacement.assets[item.filename];if(!asset?.verified||asset.rollingHash!==item.rollingHash||asset.tokenUri.length>256)throw new Error('Replacement manifest mismatch.');return {hash:Cl.bufferFromHex(item.rollingHash),'token-uri':Cl.stringAscii(asset.tokenUri)};});
          const revision=sha(JSON.stringify(entries.map(e=>T.cvToHex(e.hash))));
          if(journal.replacementRevision&&journal.replacementRevision!==revision)throw new Error('Replacement content changed during run.');
          journal.replacementRevision=revision;await persist();
          const replacementGuard=async()=>{expect(await read(helper,'is-paused'),Cl.ok(Cl.bool(true)),'paused during replacement');expect(await read(helper,'get-minted-count'),Cl.ok(Cl.uint(0)),'no mints during replacement');expect(await read(helper,'get-reserved-count'),Cl.ok(Cl.uint(0)),'no reservations during replacement');};
          await replacementGuard();
          await step('optimized-inventory','set-registered-token-uri-batch',[Cl.list(entries.map(Cl.tuple))]);
          for(const entry of entries)expect(await read(helper,'get-registered-token-uri',[entry.hash]),Cl.some(Cl.tuple({'token-uri':entry['token-uri']})),'new inventory');
          for(const item of manifest.items){await replacementGuard();await step('clear-original-'+item.number,'clear-registered-token-uri',[Cl.bufferFromHex(item.rollingHash)]);expect(await read(helper,'get-registered-token-uri',[Cl.bufferFromHex(item.rollingHash)]),Cl.none(),'old inventory removed');}
          journal.replacementComplete=true;await persist();console.log('On-chain replacement confirmed; no artwork inscribed.');
        }
        if(command==='register') {
          const staged=await json(join(directory,'staging.json'));
          if(!staged.complete||Object.keys(staged.assets).length!==10)throw new Error('Ten verified staged assets required.');
          const entries=manifest.items.map(item=>{
            const asset=staged.assets[item.filename];
            if(!asset?.verified||asset.rollingHash!==item.rollingHash||typeof asset.tokenUri!=='string'||asset.tokenUri.length>256)throw new Error('Staged inventory mismatch.');
            return {hash:Cl.bufferFromHex(item.rollingHash),'token-uri':Cl.stringAscii(asset.tokenUri)};
          });
          await step('inventory','set-registered-token-uri-batch',[Cl.list(entries.map(Cl.tuple))]);
          for(const entry of entries)expect(await read(helper,'get-registered-token-uri',[entry.hash]),Cl.some(Cl.tuple({'token-uri':entry['token-uri']})),'registered inventory URI');
          expect(await read(helper,'get-minted-count'),Cl.ok(Cl.uint(0)),'no inscriptions');
          journal.inventoryRegistered=true;
        }
        journal.configurationPrepared=true;await persist();
        console.log(command==='replace'?'Optimized inventory registered; helper paused and no inscriptions sent.':command==='register'?'Ten staged files registered; helper paused and no inscriptions sent.':'Helper metadata and supply prepared; paused, no inventory registered and no inscriptions sent.');
      } else {
      for(const item of manifest.items) await step('register-'+item.number,'set-registered-token-uri',[Cl.bufferFromHex(item.rollingHash),Cl.stringAscii(`urn:xtrata:wizard:number:${item.number}`)]);
      await step('unpause','set-paused',[Cl.bool(false)]);
      expect(await read(helper,'get-mint-price'),Cl.ok(Cl.uint(0)),'zero test collection price');
      for(const item of manifest.items) {
        const bytes=await readFile(join(output,item.filename));
        if(item.chunks!==1)throw new Error('Fixture no longer fits one chunk.');
        const quote=await read(core,'quote-inscription-fee',[Cl.uint(bytes.length),Cl.uint(1),Cl.uint(2)]);
        const q=T.cvToJSON(quote).value?.value;
        if(!q || q['single-tx-eligible']?.value!==true)throw new Error('Atomic mint unavailable.');
        const protocol=BigInt(q['total-fee'].value);
        if(!journal.steps['mint-'+item.number]) expect(await read(core,'get-id-by-hash',[Cl.bufferFromHex(item.rollingHash)]),Cl.none(),'new inventory hash');
        await step('mint-'+item.number,'mint-small-single-tx',[Cl.contractPrincipal(coreAddress,coreName),Cl.bufferFromHex(item.rollingHash),Cl.stringAscii('image/jpeg'),Cl.uint(bytes.length),Cl.list([Cl.buffer(bytes)]),Cl.stringAscii(`urn:xtrata:wizard:number:${item.number}`)],protocol);
        const mapping=await read(core,'get-id-by-hash',[Cl.bufferFromHex(item.rollingHash)]);
        if(mapping.type!==Cl.some(Cl.uint(0)).type)throw new Error('Mint hash unresolved.');
        const id=mapping.value;
        expect(await read(core,'get-owner',[id]),Cl.ok(Cl.some(Cl.principal(config.address))),'NFT owner');
        expect(await read(core,'get-chunk',[id,Cl.uint(0)]),Cl.some(Cl.buffer(bytes)),'stored JPEG bytes');
        expect(await read(helper,'get-hash-reservation',[Cl.bufferFromHex(item.rollingHash)]),Cl.none(),'cleared reservation');
        const context=await read(helper,'get-token-mint-context',[id]);
        if(context.type!==Cl.some(Cl.uint(0)).type)throw new Error('Receipt missing.');
        expect(context.value.value.owner,Cl.principal(config.address),'receipt owner');
        expect(context.value.value['phase-id'],Cl.uint(0),'receipt phase');
        expect(await read(helper,'get-minted-id',[Cl.uint(item.number-1)]),Cl.some(Cl.tuple({'token-id':id})),'mint index');
        journal.steps['mint-'+item.number].tokenId=T.cvToString(id);await persist();
      }
      expect(await read(helper,'get-minted-count'),Cl.ok(Cl.uint(10)),'minted count');
      expect(await read(helper,'get-reserved-count'),Cl.ok(Cl.uint(0)),'reserved count');
      await step('pause-completed','set-paused',[Cl.bool(true)]);
      journal.complete=true;await persist();console.log('Ten JPEGs verified; dedicated helper paused.');
      }
      }
    }
  }
} finally { await lock.close(); await unlink(join(directory,'lock')); }
