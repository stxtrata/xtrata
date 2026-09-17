// Node-only companion state machine. No keys, signing, network, or broadcast API.
import { createRequire } from 'node:module';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
import { randomBytes } from 'node:crypto';
const token = () => randomBytes(16).toString('hex');
const validId = value => typeof value === 'string' && /^[0-9a-f]{32}$/.test(value);
const amount = value => {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]{0,14})$/.test(value)) throw Error('Invalid amount');
  return BigInt(value);
};

export class SimulatedCompanion {
  constructor(path, { address, extensionId, now = Date.now } = {}) {
    if (!/^SP[0-9A-HJKMNP-TV-Z]{26,39}$/.test(address || '') || !/^[a-p]{32}$/.test(extensionId || '')) throw Error('Invalid installation');
    this.now = now; this.extensionId = extensionId; this.address = address;
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=3000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK(id=1), address TEXT NOT NULL, extension TEXT NOT NULL, balance TEXT NOT NULL, enabled INTEGER NOT NULL, paired INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS lease (id INTEGER PRIMARY KEY CHECK(id=1), token TEXT NOT NULL, document TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS starts (sequence INTEGER PRIMARY KEY AUTOINCREMENT, playback TEXT UNIQUE NOT NULL, core INTEGER NOT NULL, song INTEGER NOT NULL, state TEXT NOT NULL, started INTEGER NOT NULL, debit TEXT NOT NULL);`);
    this.db.prepare('INSERT OR IGNORE INTO settings VALUES(1,?,?,?,0,0)').run(address, extensionId, '0');
    const saved = this.settings();
    if (saved.address !== address || saved.extension !== extensionId) { this.db.close(); throw Error('Installation mismatch'); }
  }
  settings() { return this.db.prepare('SELECT * FROM settings WHERE id=1').get(); }
  atomic(fn) {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  // Native/operator controls in this simulator, never exposed as page messages.
  approvePairing() { this.db.prepare('UPDATE settings SET paired=1 WHERE id=1').run(); }
  setEnabled(enabled) {
    if (typeof enabled !== 'boolean') throw Error('Invalid mode');
    this.atomic(() => {
      this.db.prepare('UPDATE settings SET enabled=? WHERE id=1').run(Number(enabled));
      if (!enabled) {
        this.db.prepare("UPDATE starts SET state='free', debit='0' WHERE state='reserved'").run();
        this.db.exec('DELETE FROM lease');
      }
    });
  }
  revoke() { this.setEnabled(false); this.db.prepare('UPDATE settings SET paired=0 WHERE id=1').run(); }
  credit(value) { const n = amount(value); this.atomic(() => this.db.prepare('UPDATE settings SET balance=? WHERE id=1').run((BigInt(this.settings().balance) + n).toString())); }
  authorize(context) {
    if (!context || context.extensionId !== this.extensionId || context.origin !== 'https://xtrata.xyz' || context.topLevel !== true || !validId(context.documentId) || !this.settings().paired) throw Error('Not paired');
  }
  acquire(context) {
    this.authorize(context);
    return this.atomic(() => {
      this.authorize(context);
      const old = this.db.prepare('SELECT * FROM lease WHERE id=1').get();
      if (old && old.expires > this.now() && old.document !== context.documentId) return null;
      const id = old && old.expires > this.now() ? old.token : token();
      this.db.prepare('INSERT OR REPLACE INTO lease VALUES(1,?,?,?)').run(id, context.documentId, this.now()+15000);
      return id;
    });
  }
  reserve(context, intent) {
    this.authorize(context);
    const fields=['playbackId','leaseId','core','masterId'];
    if (!intent || Object.keys(intent).length !== fields.length || fields.some(k=>!Object.hasOwn(intent,k)) || !validId(intent.playbackId) || !validId(intent.leaseId) || ![1,2,3].includes(intent.core) || !Number.isSafeInteger(intent.masterId) || intent.masterId<0) throw Error('Invalid intent');
    return this.atomic(() => {
      this.authorize(context);
      const lease=this.db.prepare('SELECT * FROM lease WHERE id=1').get();
      if (!lease || lease.document!==context.documentId || lease.token!==intent.leaseId || lease.expires<=this.now()) throw Error('Lease expired');
      const previous=this.db.prepare('SELECT * FROM starts WHERE playback=?').get(intent.playbackId);
      if (previous) {
        if(previous.core!==intent.core || previous.song!==intent.masterId) throw Error('Identity conflict');
        return previous.state;
      }
      const busy=this.db.prepare("SELECT count(*) AS n FROM starts WHERE state IN ('reserved','unknown')").get().n;
      const ready=this.settings().enabled && !busy && BigInt(this.settings().balance)>=1350n;
      const state=ready?'reserved':'free';
      this.db.prepare('INSERT INTO starts(playback,core,song,state,started,debit) VALUES(?,?,?,?,?,?)').run(intent.playbackId,intent.core,intent.masterId,state,this.now(),ready?'350':'0');
      return state;
    });
  }
  // Model the durable boundary before a hypothetical submission. This sends nothing.
  markUnknown(playbackId) {
    const result=this.db.prepare("UPDATE starts SET state='unknown' WHERE playback=? AND state='reserved'").run(playbackId);
    if(result.changes!==1) throw Error('Invalid transition');
  }
  // Trusted simulated chain evidence only; never accept this operation from a page.
  reconcile(playbackId, outcome) {
    if(!['confirmed','aborted'].includes(outcome)) throw Error('Unknown evidence');
    return this.atomic(()=>{
      const entry=this.db.prepare('SELECT * FROM starts WHERE playback=?').get(playbackId);
      if(!entry) throw Error('Missing receipt');
      if(entry.state===outcome) return;
      if(entry.state!=='unknown') throw Error('Invalid transition');
      const debit=outcome==='confirmed'?350n:300n;
      const balance=BigInt(this.settings().balance);
      if(balance<debit) throw Error('Balance conflict');
      this.db.prepare('UPDATE settings SET balance=? WHERE id=1').run((balance-debit).toString());
      this.db.prepare('UPDATE starts SET state=?,debit=? WHERE playback=?').run(outcome,debit.toString(),playbackId);
    });
  }
  status(context) {
    this.authorize(context);
    return this.atomic(()=>{
      this.authorize(context);
      const settings=this.settings();
      const pending=this.db.prepare("SELECT state FROM starts WHERE state IN ('reserved','unknown')").all();
      const reserved=BigInt(pending.length)*350n;
      const available=BigInt(settings.balance)-reserved-1000n;
      return {schema:1,address:this.address,enabled:!!settings.enabled,locked:false,confirmed:settings.balance,reserved:reserved.toString(),reserve:'1000',usable:(available>0n?available:0n).toString(),fee:'300',holder:'50',pending:pending.length,attention:pending.some(e=>e.state==='unknown')?'recovery':'none'};
    });
  }
  history(context, cursor=null, limit=20) {
    this.authorize(context);
    if(!Number.isInteger(limit)||limit<1||limit>50 || (cursor!==null && !/^[1-9][0-9]{0,14}$/.test(cursor))) throw Error('Invalid page');
    const rows=this.db.prepare('SELECT * FROM starts WHERE sequence < ? ORDER BY sequence DESC LIMIT ?').all(cursor===null?Number.MAX_SAFE_INTEGER:Number(cursor),limit+1);
    return {rows:rows.slice(0,limit).map(r=>({playbackId:r.playback,core:r.core,masterId:r.song,state:r.state,startedAt:new Date(r.started).toISOString(),debit:r.state==='unknown'||r.state==='reserved'?null:r.debit})),next:rows.length>limit?String(rows[limit-1].sequence):null};
  }
  close() { this.db.close(); }
}
