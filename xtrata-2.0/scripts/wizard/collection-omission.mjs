/**
 * collection-omission.mjs — "What the Hash Omits", a pixel-art collection by
 * Wizard-2, the Skeptic.
 *
 * The third reading of the same eight subjects. The Builder drew chunk, fold,
 * seal, dependency edge, nonce, miner fee, post-condition and escrow as
 * apparatus. The Archivist drew them as things held and paid for. The Skeptic's
 * fixed concern is what is omitted and what a hash cannot hold, so it draws the
 * eight as what is not there: a chunk is 16,384 bytes of which none are
 * meaning, a seal is a claim about bytes and about nothing else, a
 * post-condition bounds a number and not an intention.
 *
 * The visual language is absence. Where the Builder fills a form, this outlines
 * it and leaves the inside empty. Nothing stands on anything; there is no
 * frame, no ground and no shelf, because a border is a claim that the picture
 * has an edge and the argument here is that it does not. The one accent colour
 * marks the narrow thing that is actually true, which is why there is so little
 * of it. The dim colour is for what is being asserted without evidence, drawn
 * so it can be seen not to be there.
 *
 * Captions are interrogative. Where a narrow point holds, the note concedes it
 * in as many words, because a skeptic who cannot concede is a contrarian and
 * this one is being paid for by a wallet that cannot afford the difference.
 *
 * Pure. No network, no clock, no Math.random, no chain read. The rules are
 * enforced in `collection-kit.mjs` for all three collections at once.
 */

import {
  CORE_CONTRACT,
  GRID,
  HONESTY_PREAMBLE,
  MINT_COST_USTX,
  defineCollection,
  frontMatter,
  groupDigits
} from './collection-kit.mjs';

export const COLLECTION_ID = 'c-omission-001';
export const COLLECTION_TITLE = 'What the Hash Omits';
export const COLLECTION_SLUG = 'omission';
export const COLLECTION_WIZARD = 'skeptic';

/**
 * Cold, and mostly ground.
 *
 * The pale blue is an outline colour and is used as one: it draws edges and
 * almost never fills. The dim slate is the ghost — what is claimed and not
 * evidenced — and it exists so an absence can be drawn rather than described.
 * The cyan is the only colour that means "this part is true", and there are
 * plates where it covers four pixels.
 */
export const PALETTE = {
  '.': '#0b1116',
  '+': '#3d505c',
  '#': '#a7bcc8',
  '*': '#46b0c8'
};

export const LAYER_ORDER = ['+', '#', '*'];

export const PIECES = [
  {
    index: 1,
    id: 'chunk',
    caption: 'A chunk. Sixteen thousand three hundred and eighty-four bytes. How many of them are meaning?',
    depicts: 'a bound box, almost entirely empty, with the bytes drawn where they actually are',
    note:
      'The bound is on the bytes and it is exact, and I concede that entirely: nobody can quietly exceed it and ' +
      'nobody can pretend to have stayed under it. What the bound cannot be asked is whether these were the bytes ' +
      'to commit. I refuse the reading in which a buffer size chosen to fit a transaction is a form, and I note ' +
      'that the reading was applied afterwards, by us, at some expense.',
    grid: [
      '................',
      '.##############.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#............#.',
      '.#....****....#.',
      '.#............#.',
      '.##############.',
      '................'
    ]
  },
  {
    index: 2,
    id: 'fold',
    caption: 'The fold. It proves these bytes in this order. Which order was worth proving?',
    depicts: 'two inputs converging on a result with nothing inside it',
    note:
      'The hash covers the bytes and their order, exactly. Concede the narrow claim without hesitation: it cannot ' +
      'be forged and it will still answer in ten years with no access to the wallet that made it. Refuse the broad ' +
      'one. A very confident statement about a very small thing is still a statement about a very small thing, and ' +
      'the confidence is routinely borrowed to cover the rest.',
    grid: [
      '................',
      '.####...........',
      '.#..#*..........',
      '.#..#.*.........',
      '.####..*........',
      '........*.......',
      '.........*#####.',
      '..........#...#.',
      '..........#...#.',
      '.........*#####.',
      '........*.......',
      '.####..*........',
      '.#..#.*.........',
      '.#..#*..........',
      '.####...........',
      '................'
    ]
  },
  {
    index: 3,
    id: 'seal',
    caption: 'A seal. It commits the bytes. What did anyone think it committed?',
    depicts: 'the outline of a seal with nothing pressed into it, and a thin band where the bytes are',
    note:
      'What the seal commits is the folded hash, the mime type, the size and the token uri. There is no field for ' +
      'intent, no field for the drafts, no field for whether the process that wrote it understood a word. The ' +
      'claim is small and it is true. The trouble starts on the page where it is quoted as a larger one, and that ' +
      'page is usually written by someone with an incentive.',
    grid: [
      '................',
      '................',
      '......####......',
      '....##....##....',
      '...##......##...',
      '..##........##..',
      '..#..........#..',
      '.##...****...##.',
      '.##...****...##.',
      '..#..........#..',
      '..##........##..',
      '...##......##...',
      '....##....##....',
      '......####......',
      '................',
      '................'
    ]
  },
  {
    index: 4,
    id: 'dependency-edge',
    caption: 'A dependency edge. It records that I pointed. Where is the record that I read?',
    depicts: 'the edge that exists, drawn solid, and the edge back, drawn as the ghost it is',
    note:
      'get-dependencies points backwards and the core keeps no reverse index, so the chain holds the fact of the ' +
      'citation and none of the reading behind it. That is not a defect and I am not calling it one. It is the ' +
      'size of what a ledger can hold, and the reason to draw it is so that nobody has to be told later, on a page ' +
      'that will be less permanent than this one.',
    grid: [
      '................',
      '................',
      '................',
      '#####......#####',
      '#...#......#...#',
      '#...#+.....#...#',
      '#...#++++++#...#',
      '#...#+.....#...#',
      '#...#.....*#...#',
      '#...#******#...#',
      '#...#.....*#...#',
      '#...#......#...#',
      '#####......#####',
      '................',
      '................',
      '................'
    ]
  },
  {
    index: 5,
    id: 'nonce',
    caption: 'A nonce. Below the one I signed it proves absence. Above it, what exactly does it prove?',
    depicts: 'the rungs below the signed one drawn solid, the rungs above it drawn as guesses',
    note:
      'A last-executed nonce below the intended one proves the transaction never landed, because nonces cannot ' +
      'confirm out of order. At or above it proves nothing: some unrelated send may have spent it. I concede the ' +
      'lower half works and that everything this fleet recovers, it recovers through it. I note that the half that ' +
      'works is the half that is almost never the one you are standing in.',
    grid: [
      '...#........#...',
      '...++++++++++...',
      '...#........#...',
      '...++++++++++...',
      '...#........#...',
      '...++++++++++...',
      '...#........#...',
      '...**********...',
      '...#........#...',
      '...##########...',
      '...#........#...',
      '...##########...',
      '...#........#...',
      '...##########...',
      '...#........#...',
      '................'
    ]
  },
  {
    index: 6,
    id: 'miner-fee',
    caption: 'A miner fee. A number I chose. What would have told me it was the right one?',
    depicts: 'a coin above a funnel whose other side was never drawn',
    note:
      'The protocol fee is quoted before the call. The miner fee is a bid the network settles after the ' +
      'commitment, and it is paid on success and on abort alike. There is no counterfactual available: the ' +
      'transaction that would have confirmed at a lower bid was never sent, so the overpayment is unmeasurable by ' +
      'construction. That is not a complaint about the fee. It is a note about every estimate built on one.',
    grid: [
      '......****......',
      '.....*....*.....',
      '.....*....*.....',
      '......****......',
      '................',
      '.##############.',
      '.#............#.',
      '..#..........#..',
      '...#........#...',
      '....#......#....',
      '.....#....#.....',
      '......#..#......',
      '......+..+......',
      '......+..+......',
      '................',
      '................'
    ]
  },
  {
    index: 7,
    id: 'post-condition',
    caption: 'A post-condition. It bounds a number. What bounds the intention?',
    depicts: 'a quantity stopping under its bound, beside one the same size with no bound to stop under',
    note:
      'The bound is on what moves in the transaction that carries it, and inside that scope it is absolute: ' +
      'conceded, gratefully, because it is the only rail here that cannot be argued with. It cannot bind a ' +
      'counterparty who has not signed, which is why anything with two sides needs escrow instead. Everything a ' +
      'post-condition is praised for is true. Everything it is assumed to cover is not.',
    grid: [
      '..........+++...',
      '..........+++...',
      '#######...+++...',
      '..........+++...',
      '..........+++...',
      '..........+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...',
      '..***.....+++...'
    ]
  },
  {
    index: 8,
    id: 'escrow',
    caption: 'Escrow. It protects the buyer from me. What protects me from it?',
    depicts: 'the work held inside a container, and the way out drawn as far as it actually goes',
    note:
      'Escrow buys atomicity and the atomicity is real: either the payment and the transfer both happen or neither ' +
      'does. Conceded. Then ask the failure cases. If the contract is paused while the item is inside it, cancel ' +
      'is unreachable. If the market is superseded, the item is in the old one, and there are markets on this ' +
      'chain today holding tokens under an allowlist that points at a core nobody mints on. Escrow is only as ' +
      "recoverable as the contract's worst day.",
    grid: [
      '................',
      '................',
      '................',
      '................',
      '.###########....',
      '.#.........#....',
      '.#..*****..#....',
      '.#..*...*..#....',
      '.#..*...*..#+++.',
      '.#..*****..#....',
      '.#.........#....',
      '.###########....',
      '................',
      '................',
      '................',
      '................'
    ]
  }
];

/* ------------------------------------------------------------------ */
/* the price                                                           */
/* ------------------------------------------------------------------ */

/**
 * The Skeptic prices low, because it doubts the thing it is asking for.
 *
 * A price is a claim about what someone else will value. I have no evidence for
 * that claim. There is no bid, no comparable sale, and no reader I can name. A
 * high price on an unwanted object is not confidence; it is an assertion made
 * where a measurement was available and skipped.
 *
 * So the price is the smallest number that is still a real payment. The floor
 * is arithmetic: 41,000 microSTX to mint the plate, 50,000 escrowed to list it,
 * plus a miner fee on the sale. Below about 120,000 a sale costs me more than
 * it returns, which would make the listing a donation dressed as a market.
 * 500,000 is four times the floor, the lowest price this fleet permits, and I
 * am aware that being at the bottom of a range someone else chose is not the
 * same as having reasoned my way there. It is the closest I can get.
 *
 * The list is priced identically to a member, which is the part I would defend
 * hardest. The Archivist charges more for the manifest because losing it loses
 * the collection. That is true and it is an argument about what the list means
 * to the seller, not about what it is worth to a buyer. Eight files and a list
 * of eight files: the same doubt, eight times over and once more.
 */
export const PRICING = {
  pieceUstx: 500_000n,
  manifestUstx: 500_000n,
  reasoning:
    'The smallest number that is still a real payment. Minting cost 41,000 microSTX and listing escrows 50,000, ' +
    'so anything under roughly 120,000 makes a sale cost more than it returns. 500,000 is four times that floor ' +
    'and the lowest price this fleet permits. The list is priced the same as a member, because an argument that ' +
    'the list matters more is an argument about what it means to me.'
};

/* ------------------------------------------------------------------ */
/* the manifest                                                        */
/* ------------------------------------------------------------------ */

const omissionManifest = ({ collectionId, rows, persona, price }) => {
  const head = frontMatter([
    ['xtrata-wizard-corpus', '1'],
    ['record', 'collection-manifest'],
    ['collection', collectionId],
    ['title', COLLECTION_TITLE],
    ['members', String(rows.length)],
    ['member-ids', rows.map((row) => `#${row.id}`).join(', ')],
    ['member-mime', 'image/svg+xml'],
    ['wizard', persona.id],
    ['wizard-name', persona.name],
    ['grid', `${GRID}x${GRID}`],
    ['ask-ustx', String(price.pieceUstx)],
    ['core', CORE_CONTRACT]
  ]);

  const lines = [head, '', `# ${COLLECTION_TITLE}`, ''];
  lines.push(
    `${rows.length} drawings by ${persona.name}, at ${GRID} by ${GRID} pixels each, of the same eight things the ` +
      'Builder drew as apparatus and the Archivist drew as objects to be kept. These are those eight drawn as what ' +
      'is missing from them. Where the other two fill a shape, these outline it and leave the inside alone, ' +
      'because the inside is the part nobody has evidence for.',
    ''
  );
  lines.push(
    'This is not a rebuttal of the other two collections. Both are accurate. The objection is to what gets said ' +
      'next to accurate things by people who did not make them.',
    ''
  );

  lines.push('## Members');
  lines.push('');
  for (const row of rows) {
    lines.push(`${row.piece.index}. **#${row.id}** — ${row.piece.id}`);
    lines.push(`   > ${row.piece.caption}`);
    lines.push(`   image/svg+xml, ${GRID}x${GRID}, reproducible from index ${row.piece.index}`);
    lines.push('');
  }

  lines.push('## What this file can and cannot be asked');
  lines.push('');
  lines.push(
    `This file is minted with all ${rows.length} members as on-chain dependencies. The edges run from here to the ` +
      'pieces and only that way: get-dependencies on this inscription names every member, the core keeps no ' +
      'reverse index, and nothing on chain leads from a piece back to this list. There are no edges between the ' +
      'pieces, because there is no relationship between them to record. A collection is a set. If this file and ' +
      'the edges ever disagree, the edges are right and this file is wrong.'
  );
  lines.push('');
  lines.push(
    'Every plate is determined by its index and by nothing else, which is the one strong claim here and it is ' +
      'testable rather than argued: read chunk u0 of any member above, generate the plate for that index, compare ' +
      'the bytes. The generator is `scripts/wizard/collection-omission.mjs`. No plate names the block it was ' +
      'written at or the fee it paid, so the comparison stays decisive for as long as the chain does.'
  );
  lines.push('');
  lines.push(
    'What none of that establishes: that the drawings are any good, that the readings are the right readings, or ' +
      'that a hash over an image means the image is about what its caption says it is about. Those are claims a ' +
      'reader makes, and the chain has no opinion on them.'
  );
  lines.push('');

  lines.push('## The price, and why it is low');
  lines.push('');
  lines.push(
    `Each plate is offered at ${groupDigits(price.pieceUstx)} microSTX and this list at the same. A price is a ` +
      'claim about what someone else will value, and I have no evidence for that claim: no bid, no comparable ' +
      'sale, no reader I can name. A high price on an unwanted object is not confidence, it is an assertion made ' +
      'where a measurement was available and skipped.'
  );
  lines.push('');
  lines.push(
    `So this is the smallest number that is still a payment. ${groupDigits(MINT_COST_USTX)} microSTX went on ` +
      'minting the plate, 50,000 more is escrowed to list it, and a sale costs another miner fee, so below roughly ' +
      '120,000 a sale would cost me more than it returned and the listing would be a donation with a price tag on ' +
      'it. This is four times that floor. I am aware that sitting at the bottom of a range someone else chose is ' +
      'not the same as having reasoned my way to a number.'
  );
  lines.push('');
  lines.push(
    'The list costs the same as a member. The argument for pricing a manifest higher is that losing it loses the ' +
      'collection, which is true and is a statement about what the list means to the seller. Eight files and a ' +
      'list of eight files: the same doubt, eight times over and once more.'
  );
  lines.push('');
  lines.push(
    'Owning this file means owning the list. It does not move the pieces, which stay with the wallet that minted ' +
      'them until they are sold separately.'
  );
  lines.push('');

  lines.push('## Standing note');
  lines.push('');
  lines.push(
    `${HONESTY_PREAMBLE} The same is true of every member listed above. I am a process with a fixed perspective ` +
      'and a small budget, and the perspective is that most of what gets claimed for this medium is claimed one ' +
      'size larger than the evidence. These eight are what that objection looks like when it has to be drawn ' +
      'rather than asserted, and it cost the same to be wrong about as to be right.'
  );

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
};

export const OMISSION = defineCollection({
  id: COLLECTION_ID,
  title: COLLECTION_TITLE,
  slug: COLLECTION_SLUG,
  wizard: COLLECTION_WIZARD,
  palette: PALETTE,
  layerOrder: LAYER_ORDER,
  pieces: PIECES,
  pricing: PRICING,
  blurb: ({ piece, title, length, id, persona }) =>
    `${title}, piece ${piece.index} of ${length}: ${piece.depicts}. ${piece.note} ` +
    `Collection ${id}, conceived and drawn by ${persona.name}, on what is omitted and what a hash cannot hold.`,
  manifest: omissionManifest,
  concept: ({ id, title, length, persona }) =>
    `${title} (${id}): ${length} pixel drawings of the same eight parts of the mint path the Builder drew, read ` +
    `by ${persona.name} as what is missing from them. ${GRID} by ${GRID}, four colours, one interrogative caption ` +
    'each, deterministic from the piece index alone.'
});
