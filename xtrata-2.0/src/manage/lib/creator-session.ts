import { creatorProofData, type CreatorChallenge } from '../../../functions/lib/creator-proof';

export type CreatorSessionState =
  | { status: 'loading' }
  /** Sign-in is not set up on this server yet (migration not applied): legacy access applies. */
  | { status: 'unavailable' }
  | { status: 'signed-out'; mode: string }
  | { status: 'signed-in'; mode: string; address: string; admin: boolean; allowlisted: boolean;
      allowlistChecked: boolean; expiresAt: number };

const asJson = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { error?: string }).error || 'Sign-in failed. Try again.');
  return body as Record<string, unknown>;
};

export async function fetchCreatorSession(): Promise<CreatorSessionState> {
  try {
    const body = await asJson(await fetch('/manage/session', { cache: 'no-store', credentials: 'same-origin' }));
    if (body.available === false) return { status: 'unavailable' };
    if (!body.signedIn) return { status: 'signed-out', mode: String(body.mode ?? 'log') };
    return {
      status: 'signed-in', mode: String(body.mode ?? 'log'), address: String(body.address), admin: body.admin === true,
      allowlisted: body.allowlisted === true, allowlistChecked: body.allowlistChecked !== false, expiresAt: Number(body.expiresAt)
    };
  } catch {
    return { status: 'unavailable' };
  }
}

/** Challenge → wallet signature → session cookie. `sign` wraps the wallet call. */
export async function signInCreator(
  address: string,
  sign: (request: { domain: any; message: any; network: 'mainnet' | 'testnet'; stxAddress: string }) => Promise<string>
) {
  const post = (body: unknown) => fetch('/manage/session', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const { challenge } = (await asJson(await post({ action: 'challenge', address }))) as { challenge: CreatorChallenge };
  const signature = await sign({ ...creatorProofData(challenge), network: challenge.network, stxAddress: challenge.address });
  await asJson(await post({ action: 'verify', id: challenge.id, signature }));
  return fetchCreatorSession();
}

export async function signOutCreator() {
  await fetch('/manage/session', { method: 'DELETE', credentials: 'same-origin' }).catch(() => undefined);
}
