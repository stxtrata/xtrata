import {
  bufferCV,
  listCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
  type ClarityValue
} from '@stacks/transactions';
import { collectionArgs } from './collection-v16-management';
import inventory from './numbered-v16-inventory.json';
import { unwrapCollectionRead } from './collection-v16-canary';
type Call = (name: string, args: ClarityValue[], write: boolean) => Promise<any>;
export const numberedSetupSteps = () => [
  { label: '1. Set supply to 10 (one-time)', name: 'set-max-supply', args: [uintCV(10)] },
  {
    label: '2. Set Numbers 1–10 metadata',
    name: 'set-collection-metadata',
    args: [
      stringAsciiCV('Numbers 1-10'),
      stringAsciiCV('NUM10'),
      stringAsciiCV(''),
      stringAsciiCV('Ten numbered JPEGs staged for buyer minting.'),
      uintCV(0)
    ]
  },
  { label: '3. Set price to 1 STX', name: 'set-mint-price', args: [uintCV(1000000)] },
  { label: '4. Restore original payout addresses', name: 'set-recipients', args: [] },
  { label: '5. Restore original payout splits', name: 'set-splits', args: [] },
  {
    label: '6. Register all 10 optimized file URIs',
    name: 'set-registered-token-uri-batch',
    args: [
      listCV(
        inventory.map((item) =>
          tupleCV({
            hash: bufferCV(Uint8Array.from(item.hash.match(/../g)!, (byte) => parseInt(byte, 16))),
            'token-uri': stringAsciiCV(item.uri)
          })
        )
      )
    ]
  }
];
export function renderNumberedSetup(
  call: Call,
  checkLegacy: () => Promise<void>,
  readLegacy: (name: string) => Promise<any>
) {
  const root = document.createElement('details');
  root.open = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Numbers 1–10 — restore collection on v1.6';
  root.append(summary);
  const intro = document.createElement('p');
  intro.textContent =
    'Reuses the ten optimized JPEGs (7,273 bytes) without uploading copies or inscribing them. Sign each setup transaction, wait for confirmation, then continue. Minting stays paused until payout verification and the website migration are complete.';
  root.append(intro);
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const guard = async () => {
    await checkLegacy();
    if (unwrapCollectionRead(await call('is-paused', [], false)) !== true)
      throw Error('Pause v1.6 before configuring the replacement collection.');
    for (const fn of ['get-minted-count', 'get-reserved-count'])
      if (String(unwrapCollectionRead(await call(fn, [], false))) !== '0')
        throw Error('Existing mints or reservations require a separate migration review.');
  };
  for (const step of numberedSetupSteps()) {
    const button = document.createElement('button');
    button.className = 'ghost';
    button.textContent = step.label;
    button.onclick = async () => {
      button.disabled = true;
      status.textContent = 'Checking paused contracts and collection state…';
      try {
        await guard();
        const supply = String(unwrapCollectionRead(await call('get-max-supply', [], false)));
        if (step.name === 'set-max-supply' && supply === '10') {
          status.textContent = 'Supply is already 10; no transaction needed.';
          return;
        }
        if (step.name === 'set-max-supply' && supply !== '0')
          throw Error('Supply is already fixed to a different value.');
        if (step.name !== 'set-max-supply' && supply !== '10')
          throw Error('Confirm the supply transaction first.');
        let args = step.args;
        if (step.name === 'set-recipients' || step.name === 'set-splits') {
          const original = unwrapCollectionRead(
            await readLegacy(step.name === 'set-recipients' ? 'get-recipients' : 'get-splits')
          );
          args = collectionArgs(
            step.name,
            ['artist', 'marketplace', 'operator'].map((key) => String(original[key]?.value))
          );
        }
        status.textContent = await call(step.name, args, true);
      } catch (error) {
        status.textContent = error instanceof Error ? error.message : String(error);
      } finally {
        button.disabled = false;
      }
    };
    const row = document.createElement('p');
    row.append(button);
    root.append(row);
  }
  const review = document.createElement('button');
  review.className = 'ghost';
  review.textContent = 'Check setup and payout configuration';
  review.onclick = async () => {
    review.disabled = true;
    try {
      await guard();
      const report: Record<string, unknown> = {};
      for (const fn of [
        'get-max-supply',
        'get-mint-price',
        'get-collection-metadata',
        'get-recipients',
        'get-splits'
      ])
        report[fn] = unwrapCollectionRead(await call(fn, [], false));
      status.textContent = JSON.stringify(report, null, 2);
    } catch (e) {
      status.textContent = String(e);
    } finally {
      review.disabled = false;
    }
  };
  root.append(review, status);
  return root;
}
