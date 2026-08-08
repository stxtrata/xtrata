// A game that carries its own log.
//
// The live board reads the contract over the network. A sealed game does not:
// the log is embedded in the page, so the inscription renders standalone
// forever, with no node, no API, and no dependency on the contract that hosted
// it still being the one people read.
//
// Same read methods as MockChain and LiveChain, so the board does not know or
// care which one it was handed. Writes are refused, because a sealed game is
// finished.

export class SealedChain {
  /**
   * @param {{game: number, contract?: string, network?: string,
   *          openedBy?: string, moves: Array<{mv: string, sender?: string, height?: number}>}} sealed
   */
  constructor(sealed) {
    this.sealed = sealed;
    this.game = sealed.game ?? 1;
    this.contractId = sealed.contract || 'sealed';
    this.moves = (sealed.moves || []).map((entry, index) => ({
      mv: entry.mv,
      sender: entry.sender ?? null,
      height: entry.height ?? null,
      seq: entry.seq ?? index
    }));
  }

  getFormatVersion() {
    return this.sealed.formatVersion ?? 1;
  }

  getGameCount() {
    return this.game;
  }

  getGame() {
    return {
      openedBy: this.sealed.openedBy ?? null,
      openedAt: this.sealed.openedAt ?? null,
      nextSeq: this.moves.length
    };
  }

  getMove(game, seq) {
    return this.moves[seq] ?? null;
  }

  getPage(game, start) {
    const out = new Array(50).fill(null);
    for (let i = 0; i < 50; i++) out[i] = this.moves[start + i] ?? null;
    return out;
  }

  async getAllMoves() {
    return this.moves.slice();
  }

  openGame() {
    throw new Error('this game is sealed');
  }

  submitMove() {
    throw new Error('this game is sealed');
  }
}
