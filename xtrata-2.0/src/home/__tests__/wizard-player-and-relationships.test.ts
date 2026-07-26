import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const wizard = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url),
  'utf8'
);
const suno = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/suno.html', import.meta.url),
  'utf8'
);

describe('wizard single-file player mode', () => {
  it('offers the player for one song, not only for a batch', () => {
    // Player mode used to live entirely on the batch side, so dropping ONE song
    // offered no player at all and the page pushed you to SUNO instead.
    expect(wizard).toContain('id="audioMode"');
    expect(wizard).toContain('name="sAudioMode"');
    expect(wizard).toContain('value="raw" checked');
    expect(wizard).toContain('buildSinglePlayer()');
    expect(wizard).toContain('FLOW.isAudio=isAudioFile(file)');
  });

  it('makes the built player the bytes and the mime that inscribe', () => {
    expect(wizard).toContain("FLOW.playerMode && FLOW.player.status==='ready'");
    expect(wizard).toContain('FLOW.activeMime = ()');
    expect(wizard).toContain('mime:FLOW.activeMime()');
    // A player is HTML in the song namespace, matching the batch path.
    expect(wizard).toContain("replace(/^xtrata:audio\\//,'xtrata:song/')");
    expect(wizard).toContain("replace(/^xtrata:song\\//,'xtrata:audio/')");
  });

  it('resets every player field between drops', () => {
    // A second drop must not inherit the previous song's artwork or overrides.
    expect(wizard).toContain('FLOW.probe=null; FLOW.meta={}; FLOW.art={file:null,tokenId:\'\'}');
  });

  it('surfaces what was found in the file, and lets it be corrected', () => {
    expect(wizard).toContain('function foundLine(info)');
    expect(wizard).toContain('async function probeSingle(file)');
    // The cheap probe reads tags + cover only — it must not claim "no lyrics".
    expect(wizard).toContain('if(!info.partial)');
    expect(wizard).toContain('id="metaOverlay"');
    expect(wizard).toContain('function openMetaEditor(item)');
    // Every editor field maps to an override XtrataSuno.build() already accepts.
    for (const id of ['mTitle', 'mArtist', 'mAlbum', 'mLyrics', 'mBpm', 'mNote', 'mLicense', 'mDescription', 'mCoverTokenId']) {
      expect(wizard).toContain(`id="${id}"`);
    }
    // ...and the overrides actually reach the build, for single and batch alike.
    expect(wizard).toContain('const overrides=Object.assign({},FLOW.meta)');
    expect(wizard).toContain('const overrides=Object.assign({},it.meta)');
    expect(wizard).toContain('window.batchEditMeta=(i)=>');
  });
});

describe('SUNO relationships', () => {
  it('offers one parent and free dependencies', () => {
    expect(suno).toContain('id="sParent"');
    expect(suno).toContain('id="sDeps"');
    // One parent only: SUNO players are always staged, and the staged seal path
    // supports a single parent — the agent throws on more.
    expect(suno).toContain('const parentList=()=>parentId()?[parentId()]:[]');
    expect(suno).toContain('One parent per song');
  });

  it('quotes and submits with the declared relationships', () => {
    // Each escrowed parent reserves a return-transfer fee, so the quote moves.
    expect(suno).not.toContain('parentCount:0');
    expect(suno).not.toContain('parents:[]');
    expect(suno).toContain('parentCount:parentList().length');
    expect(suno).toContain('const est=await A.estimateBatch({ itemsBytes:ready.map(it=>it.player.size), parentCount:parentList().length');
    expect(suno).toContain('mime:\'text/html\', deps, parents');
    expect(suno).toContain('const payload={ items, parents,');
  });

  it('holds the button rather than starting a job escrow will bounce', () => {
    expect(suno).toContain('function parentBlockingMessage()');
    expect(suno).toContain("if(PARENT_OK==='bad') return 'Parent is not in your connected wallet'");
    // An unavailable ownership check must NOT block — the agent re-checks the
    // parent before taking payment, and blocking here would strand the page.
    expect(suno).toContain("PARENT_OK='unverified'");
    expect(suno).not.toContain("if(PARENT_OK===null) return");
  });

  it('handles the two-send escrow flow a parent creates', () => {
    // Without these the job parks in AWAITING_PARENT showing a stale "waiting for
    // payment" line and auto-cancels 15 minutes later with no explanation.
    expect(suno).toContain('AWAITING_PARENT:{msg:');
    expect(suno).toContain('renderEscrow(job, status)');
    expect(suno).toContain('data-s="parent"');
    expect(suno).toContain('async function sendParentNow(pid)');
    // The recipient is hard-coded to this job's deposit wallet.
    expect(suno).toContain('recipient:JOB.depositAddress');
    expect(suno).toContain('SERVER.parentWindowMs');
    expect(suno).toContain('was not declared as a parent');
  });

  it('sends the parent to the right contract, and reattaches a stranded job', () => {
    // job.core is the contract NAME only; splitting it handed the name in as the
    // address and the wallet rejected it ("Invalid c32 address: must start with S").
    expect(suno).toContain('async function sendParentCoreId()');
    expect(suno).toContain('A.parentInfo(JOB.jobId)');
    expect(suno).not.toContain("const core=String(JOB.core||'').split('.')");
    expect(suno).toContain('could not resolve the Xtrata contract address');
    // A funded job still waiting for its parent is stranded with real STX on the
    // burner — the resume path has to pick it up, not just AWAITING_DEPOSIT.
    expect(suno).toContain("(jobs||[]).find(j=>j.status==='AWAITING_PARENT')");
  });
});
