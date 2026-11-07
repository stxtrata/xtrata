// /article/ is an alias of /a/.
export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  return Response.redirect(new URL(`/a/${url.search}`, url).toString(), 301);
};
