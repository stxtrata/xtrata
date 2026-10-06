// Posting an arcade run, inline or long. A long replay (over INLINE_MAX) is first stored as its own Xtrata
// inscription (re-used if these exact bytes are already on chain), then the score entry is posted with a pointer.
// Shared by the viewer's in-place dialog and the /arcade/submit page. Wallet work goes through `sign`.
import { buildReplayMintCall, buildSubmitCall, isLongReplay, makeReplayPointer, replayChainHash, type BoardInfo, type SubmitPayload } from './core';
import { quoteReplayFee, replayIdByHash, waitForTx } from './reads';

export type Signer = (call: any, onStatus: (text: string) => void) => Promise<string>;

export async function postRun(o: {
  p: SubmitPayload; score: number; address: string; board: BoardInfo; sign: Signer; onStatus: (text: string) => void;
  /** test hook: how long to wait for an inscription id after the mint confirms */
  idWaitMs?: number;
}): Promise<{ txId: string; replayId: number | null }> {
  const { p, score, address, board, sign, onStatus } = o;
  if (!isLongReplay(p)) return { txId: await sign(buildSubmitCall(p, score, address, board), onStatus), replayId: null };
  // Fail before anything is signed if the score entry cannot be built for this wallet / board.
  buildSubmitCall(p, score, address, board, makeReplayPointer(p.replay, 0, new Uint8Array(32)));
  const hash = replayChainHash(p.replay);
  let id = await replayIdByHash(hash).catch(() => null);
  let minted = false;
  if (id === null) {
    const fee = await quoteReplayFee(p.replay.length);
    onStatus(`Approve 1 of 2: store your ${Math.round(p.replay.length / 1024)} KB replay as an Xtrata inscription.`);
    const mintTx = await sign(buildReplayMintCall(p, address, fee), onStatus);
    minted = true;
    onStatus('Storing your replay on chain… (a block or two)');
    await waitForTx(mintTx, (s) => onStatus(`Storing your replay on chain… ${s} s`));
    const until = Date.now() + (o.idWaitMs ?? 60_000);
    while (id === null && Date.now() < until) {
      id = await replayIdByHash(hash).catch(() => null);
      if (id === null) await new Promise((res) => setTimeout(res, 3000));
    }
    if (id === null) throw new Error('The replay was stored but its inscription id is not visible yet. Post again in a minute: it will not be stored twice.');
  }
  onStatus(minted ? 'Approve 2 of 2: post your score.' : `Your replay is already stored as #${id}. Approve posting your score.`);
  const txId = await sign(buildSubmitCall(p, score, address, board, makeReplayPointer(p.replay, id, hash)), onStatus);
  return { txId, replayId: id };
}
