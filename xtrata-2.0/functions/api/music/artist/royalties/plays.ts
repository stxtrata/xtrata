import { handleArtistSources } from '../../../../lib/music-artist';
export const onRequest: PagesFunction = ({ request, env }) => handleArtistSources(request, env, 'plays');
