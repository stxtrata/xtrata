import {expect,it} from 'vitest';
import {ratingGames} from '../../packages/ui/rating-state.js';
import type {RatedGame} from '../../packages/ratings/elo-v1.js';
const game:RatedGame={game:1,white:'a',black:'b',result:'1-0',terminalHeight:1};
it('deduplicates IDs and favours replayed evidence over an overlapping claim',()=>{
  const actual={...game,result:'0-1' as const,terminalHeight:10};
  expect(ratingGames([game],[actual,actual],false)).toEqual([actual]);
});
it('full verification ignores checkpoint games absent from the chain walk',()=>{
  expect(ratingGames([game],[],true)).toEqual([]);
});
