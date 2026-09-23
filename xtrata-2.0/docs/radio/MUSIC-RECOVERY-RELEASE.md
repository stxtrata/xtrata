# Shared recovery release checkpoint

Targets: standard/legacy universal Mac 1.0.2; Windows 11 x64 1.0.5.
One shared source revision; platform versions live in desktop/music/release-versions.json.
Mac scripts set installer metadata to 1.0.2; prepare.mjs copies the matching in-app version.

Recovery: passive reads/startup cannot submit. Once support is explicitly enabled,
heartbeat reconciliation may resend the exact signed bytes of one missing payment.
Checks: signed transaction identity, mainnet, unchanged fee/song/receipt, wallet
signer, available account nonce, no indexed pending nonce/gap, sufficient funds,
absent contract receipt, repeated transaction lookup, session consent and kill
switch immediately before committing and before submitting. Three durable retries
maximum with 60-second backoff. No signing, automatic fee increases, journal deletion,
new catch-up payments or wallet migration. Visible pending/receipt delay keeps
support enabled and listening free. Higher-fee replacement remains manual tooling.
Reports after ten failed recovery checks contain public event fields only.

Automated evidence so far: 93 shared tests (three old message expectations initially
failed; the specific “not visible” diagnosis was retained and affected tests passed).
Isolated Mac Electron playback/consent smoke passed with mocked payments. New tests
cover exact-byte retries, durable retry limit, nonce/receipt refusal, consent
revocation after journal save, ambiguous transport backoff and visibility races.
No actual wallet modified or payments broadcast. Physical Windows, Intel Mac,
Monterey and supervised live checks remain NOT RUN.

Next: final targeted verification; commit build source; native Windows CI and native
Mac universal/legacy packaging; inspect archives and hashes; publish releases;
verify published bytes; update all lounge cards and manifest together.
