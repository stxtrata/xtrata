export type DropsCollectionLock = {
  id: string;
  label: string;
  contractId: string;
  creator: string;
  dropIds: bigint[];
  groupIds: bigint[];
};

const DROPS_CONTRACT_ID = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-0';
const JIM_BTC_ADDRESS = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

export const DROPS_COLLECTION_LOCKS: DropsCollectionLock[] = [
  {
    id: 'dropped-2026-07',
    label: 'Dropped collection',
    contractId: DROPS_CONTRACT_ID,
    creator: JIM_BTC_ADDRESS,
    // Current "dropped" giveaway batch. Keep already-claimed/settled drops in
    // this list so their GroupClaims entries still count against the remaining
    // live drops in the same collection.
    dropIds: [
      4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n,
      14n, 15n, 16n, 17n, 18n, 19n, 20n, 21n, 22n, 23n,
      24n, 25n, 26n, 27n, 28n, 29n, 30n, 31n, 32n
    ],
    groupIds: [
      1784056447508172n,
      1784056473390268n,
      1784056493623505n,
      1784056551390466n,
      1784056570690306n,
      1784056583756546n,
      1784056597306426n,
      1784056623355347n,
      1784056633205672n,
      1784056642105162n,
      1784123216387703n,
      1784123290088498n,
      1784123323905770n,
      1784123346404049n,
      1784123381721938n,
      1784123394755473n,
      1784123404089065n,
      1784123413772775n,
      1784123422189892n,
      1784123430122290n,
      1784123438922575n,
      1784123488006065n,
      1784123542456973n,
      1784123551223848n,
      1784126162617974n,
      1784126190083310n,
      1784126199783604n,
      1784126220768537n,
      1784126230500069n
    ]
  }
];

const samePrincipal = (left?: string | null, right?: string | null) =>
  !!left && !!right && left.toLowerCase() === right.toLowerCase();

const toBigIntValue = (value?: bigint | string | number | null) => {
  if (value === null || value === undefined || value === '') return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
};

export const getDropsCollectionLockForDrop = (params: {
  contractId: string;
  creator?: string | null;
  dropId?: bigint | string | number | null;
  groupId?: bigint | string | number | null;
}) => {
  const dropId = toBigIntValue(params.dropId);
  const groupId = toBigIntValue(params.groupId);
  return DROPS_COLLECTION_LOCKS.find((lock) => {
    if (!samePrincipal(lock.contractId, params.contractId)) return false;
    if (!samePrincipal(lock.creator, params.creator)) return false;
    return (
      (dropId !== null && lock.dropIds.includes(dropId)) ||
      (groupId !== null && lock.groupIds.includes(groupId))
    );
  }) ?? null;
};
