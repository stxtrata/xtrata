# Read-only development transport

This is an unfinished Chrome extension transport prototype. It does not connect
an actual music wallet to the radio. No payment method, key access, funding,
or automatic playback integration exists here. The host always returns
`unavailable`; do not install it expecting a wallet balance.

The popup grants/revokes browser permission for availability checks only. This
is not native pairing or permission to spend. The worker validates the browser's
sender extension ID, top-level frame, document and exact HTTPS origin. Page
messages cannot supply trusted sender context. Requests are bounded to eight
concurrent operations and two seconds; responses expose only fixed error values.

`tools/music-wallet/native-host.mjs` exercises native length-prefixed JSON over
stdin/stdout. Its configured extension ID and Chrome origin argument must match.
The argument check alone does not authenticate an arbitrary local process.
Installation must eventually use Chrome's native host manifest with an exact
`allowed_origins` entry, followed by native approval and protected installation
credentials. No installer is provided yet.

Tests run from the app root:

```sh
npx vitest run scripts/radio-support/__tests__/bridge.test.ts
node scripts/radio-support/harness.mjs --report
```

Coverage includes sender rejection, read-only method validation, native frame
fragmentation, bounds and a real child-process exchange. These tests do not prove
an installed Chrome-to-native connection. That integration, revocation of active
connections, OS credential storage and real wallet status remain gates before
production activation.

Protocol reference: https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging
