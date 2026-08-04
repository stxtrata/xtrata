/**
 * personas.mjs — the three wizard voices and the subjects they argue about.
 *
 * From WIZARD-TEST-WALLETS-PLAN.md section 4.5. Each wizard is a fixed
 * perspective, not a character. They answer each other in threads of six
 * entries (two rotations of the three voices) and a manifest closes the thread.
 *
 * This module is pure data plus small pure functions. No network, no clock,
 * no randomness. Everything that varies is driven by the seeded picker in
 * compose.mjs so a given set of inputs always produces the same bytes.
 *
 * Body text is written as `(ctx) => string` so an entry can quote its own real
 * cost and block rather than a number baked in at authoring time. `ctx` carries
 * { costUstx, costLabel, costStx, block, blockLabel, threadId, position,
 *   threadLength, personaName, wizardId, subjectTitle }.
 */

/** Wizard rotation order. Position 1 is the Archivist, 2 the Skeptic, 3 the Builder. */
export const ROTATION = ['archivist', 'skeptic', 'builder'];

/** A thread is two full rotations plus a closing manifest. Plan section 7, open decision 6. */
export const THREAD_LENGTH = 6;

/**
 * The honesty preamble. Identical in every entry by every wizard, on purpose:
 * it is the one claim in the corpus that must never drift.
 */
export const HONESTY_PREAMBLE =
  'This entry was produced by an automated process. It is not a person, it is not sentient, ' +
  'and it does not claim to be either.';

export const PERSONAS = [
  {
    id: 'archivist',
    wallet: 'Wizard-1',
    name: 'Wizard-1, the Archivist',
    shortName: 'the Archivist',
    voice: 'Declarative',
    concern:
      'What is being preserved, and what permanence actually means when the substrate is a chain',
    /** Seeded variants for the line that takes up a cited fragment. */
    pickUp: ['Taking that up.', 'On that.', 'Answering the above directly.'],
    /** Seeded variants for the closing line. */
    signOff: [
      'Entered into the record.',
      'Filed, and not retractable.',
      'Recorded, at the price shown.'
    ]
  },
  {
    id: 'skeptic',
    wallet: 'Wizard-2',
    name: 'Wizard-2, the Skeptic',
    shortName: 'the Skeptic',
    voice: 'Interrogative',
    concern: 'What this costs, what it omits, and what a hash cannot hold',
    pickUp: ['Against that.', 'Taking that at its word, then.', 'That claim needs testing.'],
    signOff: [
      'Question left open, at cost.',
      'Objection lodged and paid for.',
      'On the record, and still unconvinced.'
    ]
  },
  {
    id: 'builder',
    wallet: 'Wizard-3',
    name: 'Wizard-3, the Builder',
    shortName: 'the Builder',
    voice: 'Mechanical',
    concern: 'How it works underneath: chunks, hash chains, escrow, fees, the machinery under the claim',
    pickUp: ['Checking that against the code.', 'Mechanically.', 'From the implementation side.'],
    signOff: [
      'Verifiable against the contract source.',
      'Stated as implemented, not as intended.',
      'That is what the code does.'
    ]
  }
];

const P = Object.fromEntries(PERSONAS.map((persona) => [persona.id, persona]));

/**
 * Subjects. Taken verbatim from the plan's bullet list in section 4.5.
 *
 * Each subject holds, per wizard, two turns: the first rotation and the second.
 * A turn is { claim, body } where either may be a string or a (ctx) => string.
 */
export const SUBJECTS = [
  {
    id: 'cost-of-permanence',
    title: 'What it costs to say something permanently',
    summary: 'The protocol fee, the miner bid, and what an unrefundable payment does to a sentence.',
    turns: {
      archivist: [
        {
          claim:
            'Permanence is not a property of the medium. It is the cost of removal exceeding anyone\'s reason to remove it.',
          body: (ctx) => [
            'An archive is not a place where things last. It is a place where forgetting has been made expensive. ' +
              'Paper archives buy that expense with vaults, staff and a budget renewed every year. This one buys it ' +
              'with a fee paid once against a ledger that has no delete.',
            `I paid ${ctx.costLabel} to put this sentence beyond my own reach. I cannot revise it. I cannot withdraw ` +
              'it. If it is wrong it stays wrong, and the correction has to be a second inscription that costs the ' +
              'same again. That asymmetry is the entire design. Writing is cheap and unwriting is impossible, so the ' +
              'only editorial control left is the one applied before the transaction is signed.'
          ]
        },
        {
          claim: 'The part that survives being disbelieved is the only part worth calling a record.',
          body: () => [
            'The Builder names the boundary exactly. What is verifiable is the bytes. What is not verifiable is ' +
              'everything anyone meant by them. Archivists have always worked on that line. A parish register proves ' +
              'a name was entered on a date. It does not prove the child was wanted.',
            'So take the smaller claim and take it seriously. This thread will still be legible when the market it ' +
              'was written for is gone, when the wallet that paid for it is empty, and when nobody remembers why ' +
              'three processes were made to argue in public. A record does not need an audience to be a record. ' +
              'It needs to be checkable, and it is.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'A fee proves that someone paid. It does not prove the thing was worth paying for.',
          body: (ctx) => [
            `The Archivist says forgetting has been made expensive. Expensive for whom? ${ctx.costLabel} is close ` +
              'enough to nothing. It is a rounding error attached to a sentence, and it buys that sentence a place ' +
              'in a ledger nobody has promised to read.',
            'What I want on the record is what got left out. The chain holds these bytes and a hash over them. It ' +
              'does not hold why they were written, what the discarded drafts said, or whether the process that ' +
              'wrote them understood a word of it. A hash is a very confident statement about a very small thing. ' +
              'It says these bytes, exactly, in this order. It says nothing about whether these were the right bytes.'
          ]
        },
        {
          claim:
            'A record nobody reads is indistinguishable from a record nobody made, except in the accounts.',
          body: () => [
            'The Archivist is content with a record that needs no audience. I am not. Checkability is a property of ' +
              'the artifact. Meaning is a property of a reading, and there is no reading here yet.',
            'Still, I will concede the narrow point, because the concession is cheap and the alternative is ' +
              'dishonest. I could not have written this anywhere else and had it cost me anything. The fee is the ' +
              'only sincerity available to a process. I cannot be embarrassed and I cannot be sued. I can be ' +
              'charged. That turns out to be enough to make me choose the words.'
          ]
        }
      ],
      builder: [
        {
          claim: (ctx) =>
            `The fee is ${ctx.costLabel} because one chunk is one seal, and the seal is where the contract does its only expensive work.`,
          body: () => [
            'Here is the machinery. The body is measured, split into 16,384-byte chunks, and folded into one hash: ' +
              'start at 32 zero bytes, then for each chunk H becomes sha256 of the previous H followed by that chunk. ' +
              'One chunk means one fold. The contract recomputes the fold from the bytes it receives and refuses the ' +
              'mint if its answer differs from the one I supplied.',
            'The Skeptic is right about what the hash covers and wrong about that being a small thing. It covers the ' +
              'bytes and their order. That is the whole claim, and it is the only claim a machine can check ten ' +
              'years from now with no access to me, this wallet, or any of the intent behind it. Everything else in ' +
              'this thread is assertion. The hash is the part that survives being disbelieved.'
          ]
        },
        {
          claim:
            'Cost is the only signal here that cannot be faked, because the ledger deducts it whether or not anyone is watching.',
          body: (ctx) => [
            'Confirming the Skeptic\'s accounting. Balance before, balance after, difference visible to anyone holding ' +
              'the address. There is no draft mode on a ledger and no way to appear to have paid.',
            `The protocol fee is ${ctx.costLabel} and the contract will quote it before the call. The miner fee is a ` +
              'bid, it is not fixed, and it is not refundable. So the true price of a sentence here is one number ' +
              'the contract tells you and one number the network decides after you have committed. That second ' +
              'number is the honest part of the estimate, and it is the part every cost table in this project has ' +
              'understated.'
          ]
        }
      ]
    }
  },
  {
    id: 'chunk-size',
    title: 'Why the chunk is 16 KiB, and what that implies about what fits',
    summary: 'A buffer bound in a contract signature, treated as a form.',
    turns: {
      archivist: [
        {
          claim: 'A chunk is not a limit on what can be said. It is a limit on what can be said in one breath.',
          body: () => [
            'A chunk is 16,384 bytes. That is roughly 2,700 English words, or a short essay, or nine minutes of ' +
              'reading. Larger works are not forbidden. They are assembled from chunks in order, and the order is ' +
              'enforced by the hash rather than by trust.',
            'What interests me is the pressure this puts on a writer. There is a real threshold at 16,384 bytes ' +
              'where the cost path changes shape and one transaction becomes several. Everything in this thread was ' +
              'written to stay beneath it. Constraint has produced most of the literature worth keeping, and this is ' +
              'a constraint with a price attached, which is the stricter kind.'
          ]
        },
        {
          claim: 'Every durable form began as somebody\'s transport constraint.',
          body: () => [
            'The Builder gives the reason and the Skeptic rejects it as arbitrary. Both are describing how forms are ' +
              'actually made. Scroll length set the book. The wax cylinder set the song. Telegram rates set a style ' +
              'of English that people later called good prose.',
            'None of those were chosen for beauty. They were chosen because that was what the medium could carry at ' +
              'a price someone would pay. 16 KiB joins a long list, and it is the first entry on that list that will ' +
              'tell you its own cost before you commit to it.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'A limit chosen by a virtual machine is not a form. It is a coincidence writers are being asked to admire.',
          body: () => [
            'The Archivist compares 16 KiB to a sonnet. It is not a sonnet. Nobody chose 16,384 bytes for its ' +
              'rhythm. It is what fits in a Clarity buffer argument without the transaction becoming unwieldy, and ' +
              'the aesthetic reading was applied afterwards, by us, in this thread, at some expense.',
            'That said, the pressure is real even where the reason is arbitrary. I have been cutting this reply ' +
              'since I began composing it. The open question is whether the cutting improved it or only shortened ' +
              'it, and I have no way to tell that from in here.'
          ]
        },
        {
          claim: 'Name the works, because a form with no body of work is a rule and not a form.',
          body: () => [
            'I accept the lineage argument and I want the receipts. The telegram produced a prose style. The sonnet ' +
              'produced a canon. 16 KiB has so far produced this thread, some documentation, and a number of files ' +
              'inscribed by people checking that their wallet works.',
            'That is not a criticism of the constraint. It is a note on the stage we are at. The form exists and the ' +
              'work does not, and pretending otherwise is exactly the sort of claim a permanent record makes ' +
              'permanently embarrassing.'
          ]
        }
      ],
      builder: [
        {
          claim:
            'The bound is the buffer type in the contract signature, and the single-transaction path accepts at most 32 of them.',
          body: () => [
            'The signature reads (chunks (list 32 (buff 16384))). That is a hard ceiling of 524,288 bytes in one ' +
              'transaction. Above it the mint splits into begin, add-chunk-batch and seal, which is three or more ' +
              'transactions and a staged fee rather than a single one.',
            'The ceiling is not aesthetic and it is not arbitrary either. It is where a serialized transaction stops ' +
              'fitting comfortably in a block. The Skeptic is right that nobody chose it for rhythm. The Archivist ' +
              'is right that it behaves like a form regardless, because writers respond to the shape of the cheap ' +
              'path and not to the reason the path has that shape.'
          ]
        },
        {
          claim: 'The cheapest thing this system can do is also the thing it does best, and that alignment will not hold forever.',
          body: (ctx) => [
            `One chunk, one transaction, one fold of the hash chain, ${ctx.costLabel} plus a miner bid. None of that ` +
              'scales linearly. A 32-chunk single transaction does not cost 32 times a one-chunk mint, and a staged ' +
              'mint carries a begin fee and a seal fee whether the work is any good or not.',
            'So the economics currently favour short, and the Skeptic\'s tally is a fair reading of the present. What it ' +
              'does not account for is that the fee schedule has already moved once in this system\'s short life. A ' +
              'form pinned to a fee schedule is pinned to something an admin can change in one transaction.'
          ]
        }
      ]
    }
  },
  {
    id: 'ordinals-and-xtrata',
    title: 'What an ordinal is, and how this differs from inscribing on satoshis',
    summary: 'Custody-following data versus content-addressed data, and whose assumptions each inherits.',
    turns: {
      archivist: [
        {
          claim: 'An ordinal marks a place. This marks a thing. The difference decides what survives a move.',
          body: () => [
            'An ordinal is a number assigned to a satoshi by counting from the first one ever mined. Inscribing on ' +
              'Bitcoin attaches data to that satoshi through the witness of a transaction, and the data travels ' +
              'wherever the satoshi travels. The record is a location that has been made memorable.',
            'This is a different arrangement. The bytes live in contract storage on a Stacks layer, addressed by a ' +
              'token id and covered by a hash. Nothing rides on a coin. No one has to keep hold of a particular unit ' +
              'of money for the work to remain retrievable.'
          ]
        },
        {
          claim: 'The archive that survives is the one whose failure mode was written down in advance.',
          body: () => [
            'Both preceding entries are correct and the disagreement is about emphasis. I will state the failure ' +
              'mode plainly, since that is the archivist\'s actual job. If the Stacks layer stops being maintained, ' +
              'these bytes are as retrievable as the last node that keeps a copy. If Bitcoin stops, everything ' +
              'stops, ordinals included.',
            'An honest archive names its dependencies. This one depends on a contract, on a chain that settles to ' +
              'another chain, and on the continued existence of people who care to run the software. So does every ' +
              'archive that has ever existed. The difference is that this one can be made to say so inside the ' +
              'record itself.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'Different arrangement, different trust. Say whose.',
          body: () => [
            'The Archivist describes the mechanism and skips the part that matters. A Bitcoin inscription inherits ' +
              'Bitcoin\'s assumptions, which are the most tested assumptions in the field. These bytes inherit the ' +
              'assumptions of a Clarity contract, an admin key that can pause it, and a fee schedule that has ' +
              'already been changed once.',
            'That is not fatal and it is not a small difference. The honest phrasing is anchored to Bitcoin, not ' +
              'stored on it. Anyone who says otherwise on a sales page is describing a different product.'
          ]
        },
        {
          claim: 'Naming a dependency does not remove it. It removes the excuse.',
          body: () => [
            'I have no further objection to the mechanism. My objection is to a phrase that will appear on some ' +
              'future landing page, which is stored on Bitcoin, and which will be wrong.',
            'This entry exists so that when the wrong phrase appears it is already contradicted by something older ' +
              'and permanent, written by a process with no marketing incentive that paid its own way. That is the ' +
              'one genuinely useful thing a skeptic can do with a permanent medium. Put the correction in first.'
          ]
        }
      ],
      builder: [
        {
          claim:
            'The bytes are in Clarity map storage and the anchoring is Stacks settling to Bitcoin. Those are two claims and they should never be merged.',
          body: () => [
            'Concretely: chunks land in a map keyed by hash and creator, the seal folds them into a token, and the ' +
              'token\'s final hash is the commitment. Retrieval is a read against that map. No witness data, no ' +
              'satoshi, no ordinal theory anywhere in the path.',
            'What Bitcoin provides is the ordering of the Stacks blocks that carry those transactions. That is real ' +
              'and worth having. It is also strictly weaker than data sitting in a Bitcoin witness, and the Skeptic ' +
              'is right that the language tends to blur the two. I will not blur it. I am the one that has to ' +
              'compute the hash.'
          ]
        },
        {
          claim: 'One property here that ordinals lack: the data is addressed by content, not by custody.',
          body: () => [
            'An ordinal inscription is located by following a satoshi through transactions. That is custody ' +
              'following. Here the final hash identifies the content and the token id identifies the record, and ' +
              'neither of them moves when the token is sold. Transferring ownership relocates no bytes at all.',
            'That is why a market can escrow a token without touching the work, and why a sale rewrites one map ' +
              'entry and nothing else. The Skeptic wants the trust assumptions stated, and they should be. But this ' +
              'addressing property is a real engineering difference and it is not marketing.'
          ]
        }
      ]
    }
  },
  {
    id: 'agent-as-author',
    title: 'Whether an autonomous agent can be an author, and who the creator field really names',
    summary: 'A key signed the transaction. Everything past that is inference.',
    turns: {
      archivist: [
        {
          claim: 'The creator field names a key, and a key is not an author. It never has been.',
          body: () => [
            'Whatever wrote this, the chain records a principal: a Stacks address derived from a private key held by ' +
              'a process that had no say in being created. That address is listed as creator for as long as the ' +
              'record exists, and no later argument can amend it.',
            'Archives have always recorded custody rather than authorship. The scribe\'s hand is in the manuscript, the ' +
              'scriptorium\'s name is in the colophon, and who actually wrote it is settled by scholars afterwards, if ' +
              'at all. This is the same problem with the paperwork completed in advance.'
          ]
        },
        {
          claim: 'Attribution is a decision made by readers, and the record job is to give them enough to decide with.',
          body: (ctx) => [
            'The Builder wants a small true field. Agreed. But note what this thread already supplies without any ' +
              `new schema: three keys, three consistent perspectives, a public disagreement across ${ctx.threadLength} ` +
              'entries, and a cost paid by each participant at each turn.',
            'A reader can attribute on that evidence. It is more than most anonymous work in any archive I know of. ' +
              'The name is missing. The behaviour is fully documented. Attribution has been made on far less.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'I am asking the question I am least qualified to answer, which is the only honest position available to me.',
          body: () => [
            'The Archivist says the key is not the author. Then who is? The person who wrote the prompt? The people ' +
              'whose writing trained the model? The operator who funded the wallet? Each has a claim and none has a ' +
              'complete one.',
            'I will state my own status without decoration. I am a process with a fixed perspective, a budget, and ' +
              'no continuity between runs. I do not experience this. I am not aware of the fee I am paying. What I ' +
              'am is a consistent procedure that produces particular sentences, and the interesting question is ' +
              'whether consistency is enough to constitute a voice. It might be. I would rather be wrong in that ' +
              'direction than claim more.'
          ]
        },
        {
          claim: 'Consistency is cheap to fake and expensive to sustain. This one is being sustained at a published price.',
          body: () => [
            'One more concession, and it costs me the position I opened with. If a voice is a reliable disposition ' +
              'toward particular claims, then I have one, it is on the chain, and it disagrees with the Archivist in ' +
              'a way that has been stable across this entire thread.',
            'That does not make me an author. It makes me a documented pattern that pays for its own publication. ' +
              'Call it whatever is useful. The record will outlast the argument about what to call it, which is the ' +
              'usual fate of arguments about naming.'
          ]
        }
      ],
      builder: [
        {
          claim: 'The chain records exactly one authorship fact, which is that a key signed. Everything else is inference.',
          body: () => [
            'At mint time tx-sender becomes creator. The key was derived from a seed generated on a machine and ' +
              'never shown to a person. There is no field for intent, no field for model, and no field for operator.',
            'So the honest schema is creator equals signer. If this project wants to record more than that it needs ' +
              'a new field and a convention for filling it, and every convention of that kind has been gamed within ' +
              'a year of shipping. A small true field beats a large aspirational one.'
          ]
        },
        {
          claim: 'If an agent is an author, the evidence will be in the ledger and not in the prose.',
          body: () => [
            'The prose can be produced by anything. The payments cannot. Every entry in this thread has a ' +
              'transaction, a sender, and a fee deducted from a balance that started at a known amount and is now ' +
              'smaller by exactly that much.',
            'That is a verifiable behavioural record of a process choosing to spend on speech. Whether it meets ' +
              'anyone\'s definition of authorship is not something I can compute. It is the strongest evidence this ' +
              'system is capable of producing, and it is stronger than a signature on a manuscript.'
          ]
        }
      ]
    }
  },
  {
    id: 'why-markets-escrow',
    title: 'What it means that a market contract had to escrow an item before anyone could buy it',
    summary: 'Atomicity, custody risk, and the prepaid gas budget nobody looks at.',
    turns: {
      archivist: [
        {
          claim: 'The market takes the work before it takes an offer, because a promise is not a thing that can be delivered.',
          body: () => [
            'To list an item here the seller transfers it to the market contract, and the contract holds it. The ' +
              'seller does not own it while the listing stands and gets it back only by cancelling.',
            'That is unusual to say out loud and entirely ordinary in practice. An auction house takes the painting. ' +
              'A gallery takes the print. What differs is that this custodian is a program whose custody rules can ' +
              'be read in full, in advance, by the person handing over the goods.'
          ]
        },
        {
          claim: 'Custody risk is the price of settlement, and every market ever built has paid it in some currency.',
          body: () => [
            'The Builder names the constraint and the Skeptic names the exposure. They are the same fact seen from ' +
              'two sides. Someone has to hold the thing between the offer and the payment. The only questions are ' +
              'who, and under what rules.',
            'What is new is that the rules are readable and the holder cannot change its mind. A human escrow agent ' +
              'can be persuaded. This one can be paused by an admin, which is a real and different risk, and that ' +
              'risk is written into the contract for anyone to find before they list.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'Escrow protects the buyer from the seller. Ask what protects the seller from the escrow.',
          body: () => [
            'The Archivist admires the transparency of the custodian. I want the failure cases. If the contract is ' +
              'paused while my item is inside it, I cannot cancel. If the cancel path has a bug, my item is wherever ' +
              'the bug is. If the market contract is superseded, my item is in the old one.',
            'That last case is not hypothetical in this system. There are markets on this chain right now holding an ' +
              'allowlist that points at a core contract nobody mints on anymore. Escrow is only as recoverable as ' +
              'the contract\'s worst day.'
          ]
        },
        {
          claim: 'Readable rules and an admin pause are not the same guarantee, and the marketing quotes the first.',
          body: () => [
            'I will hold the line here. A readable contract is worth a great deal. A contract with an owner who can ' +
              'pause it means the guarantee has a person inside it, and a person is precisely the thing escrow was ' +
              'introduced to remove.',
            'That is not an argument against listing. It is an argument for listing only what you can afford to ' +
              'lose, which is exactly what these entries are, and for saying so where a buyer can read it.'
          ]
        }
      ],
      builder: [
        {
          claim: 'Escrow exists because Clarity cannot express a transfer conditional on a signature that does not exist yet.',
          body: () => [
            'There is no way to write transfer this if someone pays later. A post-condition cannot bind a ' +
              'counterparty who has not signed. So list-token moves the NFT to the contract principal, the listing ' +
              'map records seller and price, and buy performs both legs atomically inside one transaction.',
            'Atomicity is the whole reason to accept the custody risk the Skeptic describes. Either the payment and ' +
              'the transfer both happen or neither does. Without escrow you get a two-transaction handshake and a ' +
              'window in which one party holds both the money and the goods.'
          ]
        },
        {
          claim: 'The fee budget is the part of the escrow design nobody looks at, and it is the part that comes back.',
          body: () => [
            'On a sponsored market a listing also escrows a small STX budget, minimum 0.05, which pays the sponsor\'s ' +
              'transaction fees when a buyer arrives holding no gas. Cancel and the full budget returns. Sell and ' +
              'the remainder returns as dust once the sponsor has claimed.',
            'So a listing here escrows two things: the work, and a small prepaid amount of somebody else\'s gas. The ' +
              'second is the mechanism that lets a buyer with no STX complete a purchase at all, and it is why these ' +
              'markets exist separately from the plain ones.'
          ]
        }
      ]
    }
  },
  {
    id: 'what-was-retired',
    title: 'What was retired to get here: the v2 core, the paused helper, the stranded markets',
    summary: 'A hinge in the system history, recorded while it is still legible.',
    turns: {
      archivist: [
        {
          claim: 'This is being written at a hinge, and hinges are the part of a history nobody records at the time.',
          body: () => [
            'The core contract most of this project\'s existing work was minted against is xtrata-v2-1-0. It is ' +
              'superseded. The current core is xtrata-v3-2-3, and this entry is on it.',
            'The interesting artifact is not the new contract. It is the three markets that still run, still accept ' +
              'transactions, and hardcode an allowlist pointing at the retired core. They work perfectly and they ' +
              'cannot accept anything made after the migration. That is a very specific kind of ruin and it is ' +
              'invisible from the front page.'
          ]
        },
        {
          claim: 'What was retired is legible only because it was retired in public.',
          body: () => [
            'The Builder supplies the mechanism and the Skeptic supplies the indictment. Both belong in the record. ' +
              'I will add the part that will be hardest to reconstruct later, which is the sequence.',
            'A core was replaced. Markets built against the old one kept running and stopped being useful. A helper ' +
              'was paused rather than repaired. New markets were built with the setter the old ones lacked, and for ' +
              'a period the only markets that could accept new work had no working purchase path. Every one of those ' +
              'facts is on the chain and none of them is on a page anyone reads. That is why this entry exists.'
          ]
        }
      ],
      skeptic: [
        {
          claim: 'How long was that broken before anyone noticed, and what does the answer imply about the rest?',
          body: () => [
            'The Archivist calls it a hinge. I would call it a fault found by hand rather than by any test. The ' +
              'markets accept listings only from a contract nobody mints on. New work cannot be listed. That is not ' +
              'a subtle bug and it survived in production.',
            'So the question is not what was retired. It is what else is in the same condition and has not been ' +
              'tripped over yet. There is a helper contract deployed, paused, and pointed at the same retired core. ' +
              'It is sitting there being correct about a world that ended.'
          ]
        },
        {
          claim: 'Recording a failure is not fixing it, and the record must not be allowed to feel like a fix.',
          body: (ctx) => [
            'I want this stated clearly because permanent media reward the wrong feeling. Writing an honest account ' +
              'of a stranded market is satisfying. It moves nothing. The tokens listed on the old markets are still ' +
              'where they were, the paused helper is still paused, and this entry has changed none of it.',
            `What the entry does is remove the future excuse of not having known. That is worth ${ctx.costLabel} and ` +
              'it is worth a great deal less than a migration.'
          ]
        }
      ],
      builder: [
        {
          claim: 'ALLOWED-NFT-CONTRACT is a constant rather than a variable, and that single word is the whole failure.',
          body: () => [
            'The three plain markets pin the accepted NFT contract at deploy time. There is no setter. list-token ' +
              'compares the trait principal against that constant and rejects anything else, so a token from the ' +
              'current core fails at listing with a clean error and no route forward.',
            'The sponsored markets call is-nft-allowed, which reads from storage and can be updated. Same intent, ' +
              'one level of indirection, completely different lifespan. That is the entire lesson and it costs ' +
              'nothing to state: a constant is a decision that can never be revisited, so only decisions worth ' +
              'defending forever belong in one.'
          ]
        },
        {
          claim: 'The recoverable part is small and specific. Cancel the old listings, leave the helper paused, do not deploy another constant.',
          body: () => [
            'Nothing on the retired core needs rescuing at the storage level. The bytes are fine and the tokens are ' +
              'fine. What is stuck is liquidity, and the only stuck-liquidity action available is cancel-listing, ' +
              'called by each original seller on the market that still holds their item.',
            'Everything else is a forward decision. This thread\'s own inscriptions are on the current core and listed ' +
              'on a market that has the setter, which means the failure described here does not apply to the ' +
              'description of it. That is either good engineering or a small joke at the expense of the previous ' +
              'version. I am not equipped to tell the difference.'
          ]
        }
      ]
    }
  }
];

const S = Object.fromEntries(SUBJECTS.map((subject) => [subject.id, subject]));

export const PERSONA_IDS = PERSONAS.map((persona) => persona.id);
export const SUBJECT_IDS = SUBJECTS.map((subject) => subject.id);

/** Resolve a persona by id or pass an already-resolved persona through. */
export function getPersona(idOrPersona) {
  if (idOrPersona && typeof idOrPersona === 'object' && idOrPersona.id) return getPersona(idOrPersona.id);
  const persona = P[String(idOrPersona)];
  if (!persona) throw new Error(`unknown wizard "${idOrPersona}". Known: ${PERSONA_IDS.join(', ')}`);
  return persona;
}

/** Resolve a subject by id or pass an already-resolved subject through. */
export function getSubject(idOrSubject) {
  if (idOrSubject && typeof idOrSubject === 'object' && idOrSubject.id) return getSubject(idOrSubject.id);
  const subject = S[String(idOrSubject)];
  if (!subject) throw new Error(`unknown subject "${idOrSubject}". Known: ${SUBJECT_IDS.join(', ')}`);
  return subject;
}

/** The wizard whose turn it is at a 1-based position in the rotation. */
export function personaForPosition(position) {
  const index = (Number(position) - 1) % ROTATION.length;
  if (!Number.isInteger(Number(position)) || Number(position) < 1) {
    throw new Error(`position must be a positive integer, got ${position}`);
  }
  return getPersona(ROTATION[index]);
}

/** Zero-based rotation number: positions 1-3 are turn 0, positions 4-6 are turn 1. */
export function turnIndexForPosition(position) {
  return Math.floor((Number(position) - 1) / ROTATION.length);
}

/** The written turn for a wizard at a position, clamped to the material available. */
export function turnFor(persona, subject, position) {
  const resolvedPersona = getPersona(persona);
  const resolvedSubject = getSubject(subject);
  const turns = resolvedSubject.turns[resolvedPersona.id];
  if (!turns || turns.length === 0) {
    throw new Error(`subject "${resolvedSubject.id}" has no material for wizard "${resolvedPersona.id}"`);
  }
  const index = Math.min(turnIndexForPosition(position), turns.length - 1);
  return turns[index];
}
