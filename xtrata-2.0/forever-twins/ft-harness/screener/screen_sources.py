#!/usr/bin/env python3
"""Forever Twins custody screener (mechanical flagging, NOT an approval).

For each Clarity source, inventories every public function that can move or
burn the contract's own NFT asset, and flags patterns that previously broke
helper custody (approvals, sale/auction state, admin movers, external calls
in transfer, bounded owner lists). Output feeds the compatibility profile's
"requires human review" gate; a clean result never auto-admits a contract.

usage: screen_sources.py <dir-of-.clar> > screen.json
"""
import json, re, sys, pathlib

def forms(src):
    """Yield top-level (define-* ...) forms as (head, name, text)."""
    i, n = 0, len(src)
    while i < n:
        if src[i] == ';':
            i = src.find('\n', i); i = n if i < 0 else i; continue
        if src[i] == '"':
            j = i + 1
            while j < n and src[j] != '"': j += 2 if src[j] == '\\' else 1
            i = j + 1; continue
        if src[i] == '(':
            d, j = 0, i
            while j < n:
                c = src[j]
                if c == ';': j = src.find('\n', j); j = n if j < 0 else j; continue
                if c == '"':
                    j += 1
                    while j < n and src[j] != '"': j += 2 if src[j] == '\\' else 1
                elif c == '(': d += 1
                elif c == ')':
                    d -= 1
                    if d == 0: break
                j += 1
            text = src[i:j + 1]
            m = re.match(r'\(\s*(define-[a-z-]+)\s*\(?\s*([^\s()]+)', text)
            if m: yield m.group(1), m.group(2), text
            i = j + 1; continue
        i += 1

def strip_comments(t):
    return re.sub(r';[^\n]*', '', t)

def screen(path):
    src = path.read_text(errors='replace')
    fs = list(forms(src))
    assets = [nm for hd, nm, _ in fs if hd == 'define-non-fungible-token']
    privs = {nm: strip_comments(t) for hd, nm, t in fs if hd == 'define-private'}
    pubs = {nm: strip_comments(t) for hd, nm, t in fs if hd == 'define-public'}
    ros = {nm for hd, nm, _ in fs if hd == 'define-read-only'}

    def expand(body, seen=None, depth=0):
        """Inline private helpers (one level of transitive closure is enough here)."""
        seen = seen or set(); out = body
        if depth > 3: return out
        for p, pb in privs.items():
            if p not in seen and re.search(r'\(\s*' + re.escape(p) + r'[\s)]', body):
                seen.add(p); out += '\n' + expand(pb, seen, depth + 1)
        return out

    movers = []
    for nm, body in pubs.items():
        full = expand(body)
        for a in assets:
            moves = re.search(r'nft-transfer\?\s+' + re.escape(a) + r'\b', full)
            burns = re.search(r'nft-burn\?\s+' + re.escape(a) + r'\b', full)
            if not (moves or burns): continue
            guard_sender = bool(re.search(r'is-eq\s+tx-sender\s+(sender|owner)\b|is-eq\s+(sender|owner)\s+tx-sender\b', full))
            guard_owner_lookup = bool(re.search(r'is-eq\s+(\(some\s+)?(tx-sender|contract-caller)\)?\s+\(?\s*(unwrap!\s*)?\(?\s*nft-get-owner\?|is-owner\b|is-sender-owner\b', full))
            listing_gated = bool(re.search(r'unwrap!\s*\(\s*map-get\?\s+market\b', full)) and bool(re.search(r'is-none\s*\(\s*map-get\?\s+market\b', expand(pubs.get('transfer', ''))))
            movers.append({
                'listing_gated': listing_gated,
                'function': nm, 'asset': a,
                'moves': bool(moves), 'burns': bool(burns),
                'sender_guard': guard_sender, 'owner_lookup_guard': guard_owner_lookup,
                'approval_path': bool(re.search(r'approv|operator', full, re.I)),
                'admin_path': bool(re.search(r'administrator|CONTRACT-OWNER|contract-owner|DEPLOYER|is-admin', full)),
                'external_calls': sorted(set(re.findall(r"contract-call\?\s+('?[A-Z0-9]+\.[a-z0-9-]+|\.[a-z0-9-]+)", full))),
            })
    xfer = pubs.get('transfer', '')
    flags = {
        'asset_names': assets,
        'transfer_signature_sip009': bool(re.search(r'define-public\s*\(\s*transfer\s*\(\s*[\w-]+\s+uint\s*\)\s*\(\s*[\w-]+\s+principal\s*\)\s*\(\s*[\w-]+\s+principal\s*\)', src)),
        'get_owner_kind': 'read-only' if 'get-owner' in ros else ('public' if 'get-owner' in pubs else 'missing'),
        'transfer_checks_listing': bool(re.search(r'market|listing', expand(xfer), re.I)),
        'transfer_external_calls': sorted(set(re.findall(r"contract-call\?\s+('?[A-Z0-9]+\.[a-z0-9-]+|\.[a-z0-9-]+)", expand(xfer)))),
        'bounded_owner_lists': sorted(set(re.findall(r'\(list\s+(\d+)\s+uint\)', src))),
        'approval_storage': bool(re.search(r'define-map\s+[^\s]*approv', src, re.I)),
        'sale_or_auction_state': sorted(n for n in pubs if re.search(r'buy|bid|auction|offer|sale', n)),
        'burn_functions': sorted(m['function'] for m in movers if m['burns']),
    }
    non_transfer_movers = [m for m in movers if m['moves'] and m['function'] != 'transfer']
    # A mover other than `transfer` with neither guard is the pattern that drained custody in simnet.
    flags['unguarded_non_transfer_movers'] = sorted(m['function'] for m in non_transfer_movers if not (m['sender_guard'] or m['owner_lookup_guard'] or m['listing_gated']))
    # Listing-gated movers: need an owner-created listing, and transfer refuses listed tokens, so no listing can
    # survive into custody. Cleared only by the exact-template simnet test (scenario G), never by this regex.
    flags['listing_gated_movers'] = sorted(m['function'] for m in non_transfer_movers if m['listing_gated'])
    flags['guarded_non_transfer_movers'] = sorted(m['function'] for m in non_transfer_movers if (m['sender_guard'] or m['owner_lookup_guard']))
    if flags['unguarded_non_transfer_movers'] or flags['approval_storage']:
        verdict = 'CUSTOM REVIEW: token can leave custody without the custodian signing'
    elif flags['transfer_external_calls'] or not flags['transfer_signature_sip009'] or flags['get_owner_kind'] != 'read-only':
        verdict = 'ADAPTER/REVIEW: transfer or owner interface deviates from the standard shape'
    elif flags['guarded_non_transfer_movers'] or flags['burn_functions'] or flags['listing_gated_movers']:
        verdict = 'STANDARD CANDIDATE after human review of listed movers/burns/listing gates'
    else:
        verdict = 'STANDARD CANDIDATE after human review'
    flags['screen_verdict'] = verdict
    return {'contract': path.stem, 'movers': movers, **flags}

if __name__ == '__main__':
    d = pathlib.Path(sys.argv[1])
    print(json.dumps([screen(p) for p in sorted(d.glob('*.clar'))], indent=1))
