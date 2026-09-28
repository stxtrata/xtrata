// Host side of the arcade score hand-off (public viewer). The embedded game
// sends a finished run; the host shows its own review dialog and, on the
// player's click (a real user gesture, so popup blockers allow it), opens the
// top-level /arcade/submit page. No inscription HTML reaches this dialog.

const NAME_RE = /^[A-Za-z0-9 _.-]{3,12}$/;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function arcadeSubmitUrl(origin: string, payload: Record<string, unknown>, id: string): string {
  return `${origin}/arcade/submit#p=${toBase64Url(JSON.stringify(payload))}&id=${encodeURIComponent(id)}`;
}

export function describeArcadePayload(payload: Record<string, unknown>) {
  if (payload.game !== 'astro-blaster-3') throw new Error('Unsupported arcade game.');
  const name = typeof payload.name === 'string' && NAME_RE.test(payload.name) ? payload.name : null;
  const score = typeof payload.score === 'number' && Number.isSafeInteger(payload.score) && payload.score > 0 ? payload.score : null;
  const board = payload.board === 'astro3' ? 'Campaign' : payload.board === 'astro3-daily' ? `Daily run · day ${Number(payload.period)}` : null;
  if (!name || score == null || !board || typeof payload.replay !== 'string') throw new Error('This score could not be read.');
  return { name, score, board };
}

export function openArcadeSubmit(host: Window, payload: Record<string, unknown>, label: string, id: string): Promise<Window | null> {
  const info = describeArcadePayload(payload);
  const url = arcadeSubmitUrl(host.location.origin, payload, id);
  const doc = host.document;
  return new Promise((resolve) => {
    const dialog = doc.createElement('dialog');
    dialog.setAttribute('aria-label', 'Submit arcade score');
    dialog.style.cssText =
      'max-width:480px;width:calc(100% - 32px);box-sizing:border-box;padding:24px;border:1px solid #3a4a7a;border-radius:16px;background:#0c1432;color:#eaf6ff;font:16px/1.5 system-ui;overflow-wrap:anywhere';
    const title = doc.createElement('h2');
    title.textContent = 'Submit this score on-chain?';
    title.style.margin = '0 0 8px';
    const text = doc.createElement('p');
    text.style.whiteSpace = 'pre-line';
    text.textContent = `${label}\nBoard: ${info.board}\nName: ${info.name}\nScore: ${info.score.toLocaleString('en-US')}\n\nThe Xtrata submit page opens in a new tab. It replays your run to confirm the score, then asks your wallet to sign. Nothing is sent until you approve it there.`;
    const cancel = doc.createElement('button');
    cancel.textContent = 'Not now';
    const approve = doc.createElement('button');
    approve.textContent = 'Open submit page';
    for (const b of [cancel, approve]) b.style.cssText = 'font:inherit;padding:10px 16px;margin:8px 8px 0 0;border-radius:8px;cursor:pointer';
    let settled = false;
    const finish = (tab: Window | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      dialog.close();
      dialog.remove();
      resolve(tab);
    };
    const timer = setTimeout(() => finish(null), 120_000);
    cancel.onclick = () => finish(null);
    approve.onclick = () => {
      // Opened without noopener so the submit page can report the result back to this host.
      const tab = host.open(url, '_blank');
      if (!tab) {
        text.textContent = 'Your browser blocked the new tab. Allow pop-ups for xtrata.xyz, or open this link:';
        const a = doc.createElement('a');
        a.href = url; a.target = '_blank'; a.textContent = 'Open the submit page';
        a.style.color = '#39e6ff';
        a.onclick = (event) => {
          event.preventDefault();
          finish(host.open(url, '_blank')); // a click is a user gesture; keeps the opener for the result
        };
        text.append(doc.createElement('br'), a);
        return;
      }
      finish(tab);
    };
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(null); });
    dialog.append(title, text, cancel, approve);
    doc.body.append(dialog);
    dialog.showModal();
    approve.focus();
  });
}
