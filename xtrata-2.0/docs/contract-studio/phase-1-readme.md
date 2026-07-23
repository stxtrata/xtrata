# Contract Studio Phase 1

Open `/contract-studio`.

## Local verification

```bash
npm run test:app -- src/lib/contract-studio/__tests__/contract-studio.test.ts
npm run build
```

The browser lab is an explanatory deterministic model. The generated ZIP is
the deployable project boundary: add the selected Xtrata core contract (or a
faithful mock with the same principal/name) to its `Clarinet.toml`, expand the
included test with the verification scenarios described in the file, then run
the Clarinet suite before checking the deployment confirmation in the UI.

## Testnet deployment

The Studio deliberately has no default testnet core: none is confirmed in this
repository. Use a real deployed testnet Xtrata core and a sealed inscription on
that same core. Connect a testnet wallet, verify the inscription, generate,
export and test the exact source, then deploy through the wallet prompt.

The deploy action never asks for a private key or seed phrase. A mainnet wallet
cannot deploy a testnet project, and a testnet wallet cannot deploy a mainnet
asset reference.

## Known boundary

Phase 1 records and displays the deployment transaction locally. It does not
claim the contract is an official inscription connection. The repository has no
confirmed owner-approval registry for connected contracts; that must be added
before an inscription page can publish an “official” association.

