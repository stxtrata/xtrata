// The community Beta workstation and its own assets are public. This policy
// is scoped to this edition; the separate Pro and original access policies remain.
export const onRequest: PagesFunction = async (context) => {
  let path = new URL(context.request.url).pathname;
  const invalid = () => new Response('Invalid path', {status:400, headers:{'Cache-Control':'no-store'}});
  try {
    for (let i = 0; i < 3; i++) {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    }
  } catch { return invalid(); }
  if (/[\\\u0000%]/.test(path) || path.split('/').some(segment => segment === '.' || segment === '..')) return invalid();
  if (path !== '/audionaut-beta' && !path.startsWith('/audionaut-beta/')) {
    return new Response('Not found', {status:404, headers:{'Cache-Control':'no-store'}});
  }
  return context.next();
};
