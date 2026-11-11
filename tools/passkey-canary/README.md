# Xtrata × DEorganized passkey canary

**Experimental. Use disposable test credentials only. Never fund the fixture or test addresses.**

This standalone browser page checks wallet derivation, offline signing and passkey address continuity against `stacks-passkey-wallet` v0.4.0. It has no broadcaster, admin-key backend or connection to the production Xtrata wallet. No smart-contract deployment is required.

## Run the prebuilt page

With Node.js 22.20 or newer, from this folder:

```sh
node serve.mjs
```

Open **http://127.0.0.1:4180/**. No package installation or wallet extension is needed for the prebuilt page. On macOS, you can also double-click `Start Passkey Checks.command`.

Start with **Run software checks**: four frozen derivation cases and seven signing classes use published synthetic inputs. Creating or accessing a real passkey requires a separate manual action. Only use a newly created disposable credential. Optional reports contain public addresses, results and the notes you enter; never enter recovery words or other secrets in those notes.

## Shared phone testing

The files in `canary/` can be hosted together at one agreed, stable HTTPS origin. No shared endpoint is published by this PR. Agree the domain/relying-party ID before creating credentials: changing the domain can make an existing credential unavailable. Localhost on a phone refers to the phone itself.

On the agreed origin, create a disposable credential, repeat sign-in, then compare its public address on a second device using the expected-address field. Record exact OS/browser/provider versions and verify offline signing. Cancellation or a blocked ceremony is inconclusive; it does not prove that PRF is unsupported. The creation-time backup-eligibility check is distinct from the sign-in path.

## Evidence and limitations

- 81 upstream tests pass, together with the independent vector verifier and five negative controls.
- 17 compatibility tests pass, including 12 address comparisons across Xtrata's actual seed module, DEorganized's library and `@stacks/wallet-sdk`, plus reviewed standard/sponsored signing and refusal cases.
- The 11 software checks passed in the desktop browser. Real phone/provider ceremonies, cross-device continuity and recovery UX remain untested.
- The adapter is a prototype. Production use still requires trusted wallet-origin review, message-source validation, one-use approvals, replay protection and application-specific spending policy. This page does not demonstrate iframe isolation.

See [the integration proposal](SIGNING-INTEGRATION-PROPOSAL.md), [public comparison results](compatibility-results.json) and the included test logs. Test counts overlap where they exercise the same fixtures.

Xtrata encrypts an independently generated seed; DEorganized derives a seed from the passkey. The comparison proves agreement from the same mnemonic/account path, not interchangeable wallet creation. Existing Xtrata wallet identities must be preserved.

## Reproduce and rebuild

```sh
npm run setup
npm test
npm run test:upstream
node upstream/test/vectors/verify.mjs
node upstream/test/vectors/negctl.mjs
npm run build
```

Setup installs the vendored upstream lockfile with lifecycle scripts disabled, builds that library explicitly, and links this folder's dependency resolution to it. The browser and adapter can then be rebuilt locally. The locked toolchain's known dev-dependency audit findings are included in `dependency-audit.json`; the page uses a small loopback-only static server rather than Vite's development server.

`upstream/` contains public source, tests and docs from [DEorganized commit 1e85e68](https://github.com/DeOrganized/stacks-passkey-wallet/tree/1e85e68ab95fcb6e0965b99a19b2f68271854540), with its MIT license and lockfile. Git metadata, screenshots, historical upstream run logs and installed dependencies are omitted. This is a pinned verification fixture; maintenance of that library remains upstream.

`generated/xtrata-seed.mjs` is the prebuilt, unchanged Xtrata seed module under test, using its original SDK dependencies. The source snapshot, original commit and SHA-256 hashes are recorded in `provenance.json`. Tests check the snapshot, bundle and frozen-vector hashes. `npm run build` preserves this historical comparison artifact; it only rebuilds the adapter and page. To regenerate the Xtrata artifact, use the recorded original checkout/dependencies and bundle its `src/lib/wallet/passkey/seed.ts` with esbuild for Node ESM, including a `createRequire` banner for its CommonJS dependencies. Review and update provenance explicitly when changing that baseline.

Bundled dependency notices are retained in the generated JavaScript. All private-key material in the published fixtures is synthetic and public; no personal, deployer or sponsor wallet was used.
