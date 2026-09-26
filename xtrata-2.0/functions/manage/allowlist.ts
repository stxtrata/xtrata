import { creatorAuthMode, isCreatorAllowlisted, readCreatorSession } from '../lib/creator-auth';
const asTrimmedString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const runtimeEnv = env as Record<string, unknown>;
  const candidates: Array<{ key: string; value: string }> = [
    {
      key: 'ARTIST_ALLOWLIST',
      value: asTrimmedString(runtimeEnv.ARTIST_ALLOWLIST)
    },
    {
      key: 'VITE_ARTIST_ALLOWLIST',
      value: asTrimmedString(runtimeEnv.VITE_ARTIST_ALLOWLIST)
    },
    {
      key: 'MANAGE_ALLOWLIST',
      value: asTrimmedString(runtimeEnv.MANAGE_ALLOWLIST)
    }
  ];

  const active = candidates.find((candidate) => candidate.value.length > 0) ?? null;

  // The full list is only shown to admins once sign-in is enforced; everyone
  // else learns whether their own signed-in wallet is allowed.
  const { session } = await readCreatorSession(request, env as never);
  const self = session ? await isCreatorAllowlisted(env as never, session.address) : null;
  const revealList = creatorAuthMode(env as never) !== 'enforce' || session?.admin === true;
  return new Response(
    JSON.stringify({
      source: revealList ? active?.key ?? null : null,
      raw: revealList ? active?.value ?? '' : '',
      hasValue: !!active,
      signedInAddress: session?.address ?? null,
      allowed: self ? self.allowed : null,
      allowlistChecked: self ? self.checked : null
    }),
    {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }
    }
  );
};
