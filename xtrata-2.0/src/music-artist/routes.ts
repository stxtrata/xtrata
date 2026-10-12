export const ARTIST_ROOT = '/music/artist/';
export const XTRATA_ROYALTY_ADMIN = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const ARTIST_SESSION_API = '/api/music/artist/session';
export const ROYALTIES_ROOT = ARTIST_ROOT + 'royalties/';
export const ROYALTIES_API = '/api/music/artist/royalties';
export const royaltyCollections = [{
  id: 'audionauts-1-0', title: 'Audionauts 1.0',
  path: ROYALTIES_ROOT + 'collections/audionauts-1-0/',
  api: ROYALTIES_API + '/collections/audionauts-1-0',
  receivingRule: 'Holder of each artist’s first song in the collection',
  royalty: '5 STX per minted Audionaut'
}] as const;
export const AUDIONAUT_ROYALTIES_API = royaltyCollections[0].api;
