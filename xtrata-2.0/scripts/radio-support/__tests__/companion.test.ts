import { describe,it,expect } from 'vitest';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { SimulatedCompanion } from '../../../tools/music-wallet/simulation.mjs';
import { parseStatus } from '../../../src/lib/radio/support/protocol';
const address='SP26RN0PCG00CWN9HXKAGGPD4VMWJQEE2TYW3KH8H';
const extensionId='a'.repeat(32);
const context={extensionId,origin:'https://xtrata.xyz',topLevel:true,documentId:'01'.repeat(16)};
function fixture(fn:(w:SimulatedCompanion,path:string,options:any)=>void) {
  const dir=mkdtempSync(join(tmpdir(),'music-sim-'));const path=join(dir,'journal.sqlite');
  const options={address,extensionId}; const w=new SimulatedCompanion(path,options);
  try {fn(w,path,options);} finally {try{w.close();}catch{} rmSync(dir,{recursive:true,force:true});}
}
const request=(leaseId:string,playbackId='02'.repeat(16))=>({leaseId,playbackId,core:3,masterId:2910});
describe('durable companion simulation',()=>{
  it('recovers a committed unknown outcome after abrupt process exit',()=>fixture((w,path,options)=>{
    w.approvePairing();w.setEnabled(true);w.credit('2000');
    const moduleUrl=pathToFileURL(join(process.cwd(),'tools/music-wallet/simulation.mjs')).href;
    const script=`import {SimulatedCompanion} from ${JSON.stringify(moduleUrl)};
      const w=new SimulatedCompanion(process.argv[1],JSON.parse(process.argv[2]));
      const c=JSON.parse(process.argv[3]);
      w.reserve(c,{leaseId:w.acquire(c),playbackId:'06'.repeat(16),core:3,masterId:2910});
      w.markUnknown('06'.repeat(16)); process.exit(9);`;
    const child=spawnSync(process.execPath,['--input-type=module','-e',script,path,JSON.stringify(options),JSON.stringify(context)],{encoding:'utf8'});
    expect(child.status).toBe(9);
    expect(w.status(context).reserved).toBe('350');
    expect(w.history(context).rows[0].state).toBe('unknown');
    expect(w.reserve(context,request(w.acquire(context),'07'.repeat(16)))).toBe('free');
  }));
  it('rolls back balance and receipt together on a reconciliation write failure',()=>fixture(w=>{
    w.approvePairing();w.setEnabled(true);w.credit('2000');const req=request(w.acquire(context));
    w.reserve(context,req);w.markUnknown(req.playbackId);
    w.db.exec("CREATE TRIGGER fail_receipt BEFORE UPDATE ON starts BEGIN SELECT RAISE(ABORT,'injected write failure'); END;");
    expect(()=>w.reconcile(req.playbackId,'confirmed')).toThrow();
    expect(w.status(context).confirmed).toBe('2000');
    expect(w.history(context).rows[0].state).toBe('unknown');
    w.db.exec('DROP TRIGGER fail_receipt');w.reconcile(req.playbackId,'confirmed');
    expect(w.status(context).confirmed).toBe('1650');
  }));
  it('requires native pairing and exact trusted context',()=>fixture(w=>{
    expect(()=>w.status(context)).toThrow();w.approvePairing();
    expect(parseStatus(w.status(context)).confirmed).toBe('0');
    for(const patch of [{origin:'https://evil.test'},{origin:'https://preview.xtrata.xyz'},{extensionId:'b'.repeat(32)},{topLevel:false}]) expect(()=>w.status({...context,...patch})).toThrow();
    w.revoke();expect(()=>w.acquire(context)).toThrow();
  }));
  it('permits only one document lease and rejects expired owners',()=>fixture((w,path,options)=>{
    let now=1000; w.now=()=>now; w.approvePairing();
    const first=w.acquire(context); const other={...context,documentId:'03'.repeat(16)};
    const second=new SimulatedCompanion(path,{...options,now:()=>now});
    try{expect(second.acquire(other)).toBeNull();now+=15001;
      expect(second.acquire(other)).not.toBe(first);
      expect(()=>w.reserve(context,request(first))).toThrow('Lease expired');
    }finally{second.close();}
  }));
  it('persists uncertainty across reopening and never bills a duplicate',()=>fixture((w,path,options)=>{
    w.approvePairing();w.setEnabled(true);w.credit('2000');
    const req=request(w.acquire(context));expect(w.reserve(context,req)).toBe('reserved');w.markUnknown(req.playbackId);
    const restarted=new SimulatedCompanion(path,options);
    try{
      expect(restarted.reserve(context,req)).toBe('unknown');
      expect(restarted.reserve(context,request(req.leaseId,'04'.repeat(16)))).toBe('free');
      expect(parseStatus(restarted.status(context)).usable).toBe('650');
      restarted.reconcile(req.playbackId,'confirmed');restarted.reconcile(req.playbackId,'confirmed');
      expect(restarted.status(context).confirmed).toBe('1650');
      expect(restarted.history(context).rows.find(r=>r.playbackId===req.playbackId).debit).toBe('350');
    }finally{restarted.close();}
  }));
  it('preserves free starts after funding and pause cancels only unsigned work',()=>fixture(w=>{
    w.approvePairing();w.setEnabled(true);const req=request(w.acquire(context));
    expect(w.reserve(context,req)).toBe('free');w.credit('2000');
    expect(w.reserve(context,req)).toBe('free');
    const second=request(req.leaseId,'05'.repeat(16));expect(w.reserve(context,second)).toBe('reserved');
    w.setEnabled(false);expect(w.status(context).reserved).toBe('0');
    expect(w.history(context).rows[0].state).toBe('free');
  }));
  it('charges only simulated miner fee on abort and retains unknown on pause',()=>fixture(w=>{
    w.approvePairing();w.setEnabled(true);w.credit('2000');const req=request(w.acquire(context));
    w.reserve(context,req);w.markUnknown(req.playbackId);w.setEnabled(false);
    expect(w.status(context).reserved).toBe('350');w.reconcile(req.playbackId,'aborted');
    expect(w.status(context).confirmed).toBe('1700');
  }));
  it('rejects identity changes, extra fields, invalid paging and installation mismatch',()=>fixture((w,path,options)=>{
    w.approvePairing(); const req=request(w.acquire(context));w.reserve(context,req);
    expect(()=>w.reserve(context,{...req,masterId:2})).toThrow();
    expect(()=>w.reserve(context,{...req,recipient:address})).toThrow();
    expect(()=>w.history(context,null,51)).toThrow();
    expect(()=>new SimulatedCompanion(path,{...options,extensionId:'b'.repeat(32)})).toThrow('Installation mismatch');
  }));
});
