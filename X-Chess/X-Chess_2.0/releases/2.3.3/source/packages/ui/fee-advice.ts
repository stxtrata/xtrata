import type { PendingRow } from '../chain/client.js';
/** Historical measurement, never a live estimate or a wallet fee parameter. */
export const MOVE_FEE_STX = '0.0004';
export function renderFeeAdvice(node: HTMLElement, doc: Document, stuck: PendingRow | null, now: number): void {
    node.replaceChildren();
    node.classList.toggle('notice--warn', stuck !== null);
    node.classList.toggle('notice--info', stuck === null);

    const line = (className = 'how'): HTMLElement => {
      const span = doc.createElement('span');
      span.className = className;
      node.appendChild(span);
      return span;
    };
    const loud = (text: string, into: HTMLElement = node): void => {
      const b = doc.createElement('b');
      b.textContent = text;
      into.appendChild(b);
    };
    const key_ = (text: string, into: HTMLElement): void => {
      const em = doc.createElement('em');
      em.textContent = text;
      into.appendChild(em);
    };

    if (!stuck) {
      loud(`Observed move network fees were ${MOVE_FEE_STX} STX (August 2026).`);
      node.appendChild(
        doc.createTextNode(
          ' Moves have no X Chess contract fee. Your wallet estimates the current network fee; ' +
            'the historical amount is not a confirmation guarantee. Lower fees can wait longer.'
        )
      );
      const how = line();
      how.appendChild(doc.createTextNode('Xverse: '));
      key_('Edit', how);
      how.appendChild(doc.createTextNode(' then '));
      key_('Custom', how);
      how.appendChild(doc.createTextNode(' · Leather: the '));
      key_('Custom', how);
      how.appendChild(doc.createTextNode(' tab'));
      return;
    }

    // A MOVE OF YOURS IS IN THE MEMPOOL, so the useful thing is no longer the
    // price — it is the nonce.
    //
    // Replacing a stuck transaction means signing the SAME nonce at a higher
    // fee. Signing a new one takes the next nonce, which queues BEHIND the
    // stuck move rather than replacing it: two fees, and the second cannot
    // confirm until the first does. Both wallets can do the replacement and
    // neither can say which pending transaction is the chess move, because
    // neither knows what this contract is. The board does, so it says the
    // number rather than sending somebody to an explorer to find it.
    const waited = stuck.receivedAt ? Math.round((now - stuck.receivedAt) / 60_000) : null;
    node.appendChild(doc.createTextNode(`Your move ${stuck.value} is broadcast and not yet in a block`));
    node.appendChild(doc.createTextNode(waited !== null && waited > 0 ? `, ${waited} minute${waited === 1 ? '' : 's'} ago. ` : '. '));
    node.appendChild(doc.createTextNode('To replace it, sign again at the '));
    loud(stuck.nonce === null ? 'same nonce' : `same nonce, ${stuck.nonce}`);
    node.appendChild(
      doc.createTextNode(
        (stuck.fee === null ? ', with a higher network fee (the current fee is unavailable). ' : `, with a fee above ${(stuck.fee / 1_000_000).toFixed(4)} STX. `) +
          'A new nonce queues behind this one instead of replacing it, and you would pay for both.'
      )
    );

    const how = line();
    how.appendChild(doc.createTextNode('Xverse: '));
    key_('Speed Up', how);
    how.appendChild(doc.createTextNode(' on the Stacks dashboard, or '));
    key_('Edit nonce', how);
    how.appendChild(doc.createTextNode(' when signing · Leather extension: '));
    key_('Activity', how);
    how.appendChild(doc.createTextNode(', then increase the fee (Leather desktop cannot)'));
}
