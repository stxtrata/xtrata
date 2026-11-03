import { handleArtistCollection } from '../../../../../lib/music-artist';
export const onRequest: PagesFunction = ({ request, env, params }) =>
  handleArtistCollection(request, env, String(params.collectionId ?? ''));
