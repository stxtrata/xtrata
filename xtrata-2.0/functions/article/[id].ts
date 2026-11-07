// /article/<id> is an alias: one canonical address, /a/<id>, so shares and previews agree.
export const onRequestGet: PagesFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const id = String(Array.isArray(params.id) ? params.id[0] : params.id ?? '');
  return Response.redirect(new URL(`/a/${encodeURIComponent(id)}${url.search}`, url).toString(), 301);
};
