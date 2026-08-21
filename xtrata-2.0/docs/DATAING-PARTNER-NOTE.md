# Draft note to Dataing — partner registration

Status: **draft, not sent.** Companion to `DATAING-COLLAB.md`, which has the
research this is built on.

Three technical questions and one commercial one. The technical questions are the
ones that actually block work: the answer to Q1 decides whether
`scripts/dataing-station.mjs` can run on OAuth at all, and the answer to Q2
decides whether the whole integration is architecturally acceptable on our side.

The commercial paragraph is deliberately last and deliberately short. Their
developer programme has no stated revenue model, so an offer to *bring* one is a
stronger opening than an ask for distribution — but it should not be the reason
the email exists, or it reads as a pitch wearing a support ticket's clothes.

---

**Subject:** Xtrata — app registered, three technical questions

Hi [name],

I've registered Xtrata in the partner workspace and put the first application in
for review. For your records, what I entered:

- **Application:** Xtrata Radio
- **Web origin:** `https://xtrata.xyz`
- **Redirect URI:** `https://xtrata.xyz/auth/dataing/callback`
- **Capabilities:** sign-in, wallet status, monetization preference

I left matchmaking preference unticked — Xtrata doesn't match people, so it
wasn't ours to ask for.

Three things I couldn't resolve from the console or the setup guide:

**1. Which scope carries listening signals?** The build reads `linkedSignals`
and `topTraits` — they're what a station gets ordered by. None of the four
capabilities obviously grants them, and sign-in appears to be `openid profile`
only. If taste data isn't reachable through OAuth in this preview, that's fine
to know now; it just means the station keeps running server-side against a
profile token rather than moving to the new flow.

**2. Is a confidential client available, or on the roadmap?** New clients are
public PKCE, which in the textbook flow puts the access token in the browser.
Given the token reads a dating profile, we don't do that — our callback
completes the exchange server-side and the browser only ever holds an opaque
session id. PKCE doesn't need a secret, so this works today. But your own
guidance is that the token stays out of browser bundles, and a public client
invites exactly the implementation that breaks it. A confidential client would
let the guidance be enforced rather than trusted.

**3. How is local development meant to work?** Origins must be HTTPS with no
wildcards, so `http://localhost` can't be registered and neither can our
preview deployments, which get a fresh subdomain per branch. Is there a dev
client, or a permitted localhost exception?

One last thing, unrelated to the review. Everything Xtrata inscribes is
permanent and public — that's the product, and it's also a liability if it ever
touches relational data. Our rule is that we'd mint a song and never a pairing:
nothing about who matched with whom goes on-chain, ever. Flagging it now rather
than having you find it later.

Separately, and whenever suits: Xtrata Radio is a station whose entire catalogue
is on-chain, and it's built to be embedded elsewhere. There's a sponsorship
model there that I think is more interesting to both of us than distribution
alone, and I couldn't find anything in the developer programme that covers how
partners earn. Happy to send a page on it if that's a conversation worth having.

Thanks,
Jim
