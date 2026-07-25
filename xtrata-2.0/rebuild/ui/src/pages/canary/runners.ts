import {
  bytesToHex,
  buildPlan,
  chainHashOfBytes,
  chunkBytes,
  CollectionExecutor,
  CollectionReads,
  CollectionTxBuilder,
  DropsReads,
  DropsTxBuilder,
  ingestFiles,
  planEscrowTxs,
  planInventoryTxs,
  selectAllUnassigned,
  selectionCount,
  XtrataClientError,
  type ChainObserver,
  type ChainTxResult,
  type DropsTxDescriptor,
  type IngestFile,
  type ManifestItem,
  type NetworkName,
  type ReadOnlyTransport,
  type TxDescriptor
} from '@xtrata/collections-client';
import type { NetworkType } from '../../wallet/network';
import type { DeployParams } from '../../services/deploy';
import { microToStx, loadFeeSchedule } from '../../services/fees';
import { buildConfigTxs, createDefaultConfigDraft } from '../studio/config-txs';
import { sourceHash } from '../studio/template';
import { validateDeployConfig } from './config';
import { buildDeployables, orderDeployables, type Deployable } from './sources';
import {
  assertStageNetwork,
  detectNameConflict,
  probeInterface,
  verifyDependencies,
  verifyDeployedSource
} from './verify';
import {
  estimateDeployCostMicroStx,
  fetchAccountBalance,
  fetchContractInterface,
  fetchContractSource,
  probeRelayer
} from './chain';
import type { StageId } from './stages';
import type {
  CanaryState,
  DeployRecord,
  StageRunApi,
  StageRunner,
  VerificationRecord
} from './store';

/**
 * The stage implementations.
 *
 * Deliberately thin over the REAL client: every canary that touches the chain
 * goes through `CollectionTxBuilder` / `DropsTxBuilder` / `CollectionExecutor`,
 * the same objects the Studio and the Drop Builder use. A canary that exercised
 * a bespoke code path would prove nothing about the app.
 *
 * The two attested stages (2 and 4) have no runner — they are settled through
 * `store.attest()`, which records the operator's claim as an attestation.
 */

export interface CanaryServices {
  apiBaseUrl: string;
  /** Network this build targets. */
  appNetwork: NetworkType;
  networkName: NetworkName;
  /** Network implied by the connected address, or null. */
  walletNetwork: NetworkType | null;
  address?: string;
  canSign: boolean;
  transport: ReadOnlyTransport;
  getBlockHeight: () => Promise<number>;
  submit?: (tx: TxDescriptor) => Promise<{ txid: string }>;
  deploy?: (params: DeployParams) => Promise<{ txid: string }>;
  waitConfirm: (txid: string) => Promise<ChainTxResult>;
  fetchImpl?: typeof fetch;
}

/**
 * `DropsTxDescriptor` differs from `TxDescriptor` only in permitting NFT
 * post-conditions alongside STX ones. The wallet bridge serializes both with
 * the same `postConditionToHex`, so the difference is purely static typing;
 * this is the single, named place that widening happens.
 */
const asTxDescriptor = (tx: DropsTxDescriptor): TxDescriptor =>
  ({ ...tx, postConditions: tx.postConditions } as unknown as TxDescriptor);

const requireSigner = (services: CanaryServices): { address: string; submit: NonNullable<CanaryServices['submit']> } => {
  if (!services.address || !services.canSign || !services.submit) {
    throw new XtrataClientError(
      'plan-invalid',
      'connect a wallet on the target network before running this stage'
    );
  }
  return { address: services.address, submit: services.submit };
};

const settle = async (
  services: CanaryServices,
  api: StageRunApi,
  label: string,
  tx: TxDescriptor
): Promise<string> => {
  const { submit } = requireSigner(services);
  const { txid } = await submit(tx);
  api.evidence({ label, value: `submitted ${txid}`, tone: 'muted' });
  const result = await services.waitConfirm(txid);
  if (result.status !== 'success') {
    throw new XtrataClientError(
      result.status === 'pending' ? 'timeout-unconfirmed' : 'chain-rejected',
      `${label} did not confirm: ${result.status}${
        result.chainErrorCode !== undefined ? ` (u${result.chainErrorCode})` : ''
      }`
    );
  }
  api.evidence({ label, value: `confirmed ${txid}`, tone: 'ok' });
  return txid;
};

// --- stage 1: sources and configuration ------------------------------------

export const runSourceValidation = (): StageRunner => async (api) => {
  const problems = validateDeployConfig(api.config);
  if (problems.length > 0) {
    for (const problem of problems) {
      api.evidence({ label: `Config: ${problem.field}`, value: problem.message, tone: 'bad' });
    }
    throw new XtrataClientError(
      'plan-invalid',
      `deploy configuration has ${problems.length} problem(s); see the evidence above`
    );
  }
  api.evidence({ label: 'Network', value: api.config.network, tone: 'ok' });
  api.evidence({ label: 'Deployer', value: api.config.deployerAddress, tone: 'ok' });
  api.evidence({ label: 'Core dependency', value: api.config.coreContractId, tone: 'ok' });

  const { deployables, errors, warnings } = buildDeployables(api.config);
  for (const warning of warnings) api.evidence({ label: 'Warning', value: warning, tone: 'warn' });
  if (errors.length > 0) {
    for (const error of errors) api.evidence({ label: 'Template', value: error, tone: 'bad' });
    throw new XtrataClientError('plan-invalid', `template substitution failed: ${errors[0]}`);
  }

  const ordered = orderDeployables(deployables);
  for (const deployable of ordered) {
    api.evidence({
      label: `${deployable.contractId}`,
      value:
        `Clarity ${deployable.clarityVersion}, ${deployable.source.length} chars, ` +
        `markers substituted: ${deployable.substitutions
          .map((entry) => `${entry.marker}×${entry.count}`)
          .join(', ')}`,
      tone: 'ok'
    });
    api.evidence({
      label: `${deployable.id} dependencies`,
      value: deployable.dependencies.join(', '),
      tone: 'muted'
    });
  }
  api.patch({ deployables: ordered });
};

// --- stage 3: source parity snapshot ---------------------------------------

export const runSourceParity = (): StageRunner => async (api) => {
  const { deployables } = api.state();
  if (deployables.length === 0) {
    throw new XtrataClientError('plan-invalid', 'stage 1 produced no sources to hash');
  }
  for (const deployable of deployables) {
    // Recompute rather than trusting the recorded value: this stage exists to
    // pin the bytes, so it must derive the hash from the bytes it pins.
    const hash = sourceHash(deployable.source);
    if (hash !== deployable.sourceHash) {
      throw new XtrataClientError(
        'checksum-mismatch',
        `${deployable.contractId}: source hash is not stable (${deployable.sourceHash} vs ${hash})`
      );
    }
    api.evidence({
      label: `sha256 ${deployable.contractId}`,
      value: hash,
      tone: 'ok'
    });
    api.evidence({
      label: `bytes ${deployable.contractId}`,
      value: `${new TextEncoder().encode(deployable.source).length} bytes, Clarity ${deployable.clarityVersion}`,
      tone: 'muted'
    });
  }
};

// --- stages 5 and 13: deployment -------------------------------------------

/**
 * Name-conflict preflight (threat 16 / test-plan "deployment failure
 * injection"). Runs BEFORE any wallet opens, in both the deploy stage and the
 * verification stage, because a contract name that is already taken cannot be
 * deployed over — Clarity contracts are immutable.
 */
const preflightNames = async (
  services: CanaryServices,
  api: StageRunApi,
  deployables: Deployable[]
): Promise<Map<string, boolean>> => {
  const alreadyDeployed = new Map<string, boolean>();
  const conflicts = [];
  for (const deployable of deployables) {
    const existing = await fetchContractSource({
      apiBaseUrl: services.apiBaseUrl,
      contractId: deployable.contractId,
      ...(services.fetchImpl ? { fetchImpl: services.fetchImpl } : {})
    });
    const conflict = detectNameConflict({
      contractId: deployable.contractId,
      existingSource: existing,
      intendedSource: deployable.source
    });
    conflicts.push(conflict);
    api.evidence({
      label: `Name check ${deployable.contractId}`,
      value: conflict.detail,
      tone: conflict.status === 'available' ? 'ok' : conflict.identical ? 'warn' : 'bad'
    });
    if (conflict.status === 'occupied' && !conflict.identical) {
      api.patch({ nameConflicts: conflicts });
      throw new XtrataClientError('plan-invalid', conflict.detail);
    }
    alreadyDeployed.set(deployable.contractId, conflict.status === 'occupied');
  }
  api.patch({ nameConflicts: conflicts });
  return alreadyDeployed;
};

export const runDeployment =
  (
    services: CanaryServices,
    params: { stage: Extract<StageId, 'testnet-deploy' | 'production-deploy'>; requiredNetwork: NetworkType }
  ): StageRunner =>
  async (api) => {
    assertStageNetwork({
      requiredNetwork: params.requiredNetwork,
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });
    const { address } = requireSigner(services);
    if (!services.deploy) {
      throw new XtrataClientError('plan-invalid', 'no deploy service is available');
    }
    if (address !== api.config.deployerAddress) {
      throw new XtrataClientError(
        'plan-invalid',
        `connected account ${address} is not the configured deployer ${api.config.deployerAddress}`
      );
    }

    const deployables = orderDeployables(api.state().deployables);
    if (deployables.length === 0) {
      throw new XtrataClientError('plan-invalid', 'stage 1 produced no sources to deploy');
    }

    const balance = await fetchAccountBalance({
      apiBaseUrl: services.apiBaseUrl,
      address,
      ...(services.fetchImpl ? { fetchImpl: services.fetchImpl } : {})
    });
    const estimate = deployables.reduce(
      (total, deployable) => total + estimateDeployCostMicroStx(deployable.source),
      0n
    );
    api.evidence({ label: 'Network', value: params.requiredNetwork, tone: 'ok' });
    api.evidence({ label: 'Spendable balance', value: microToStx(balance.microStx), tone: 'ok' });
    api.evidence({
      label: 'Estimated deploy cost',
      value: `${microToStx(estimate)} across ${deployables.length} contract(s)`,
      tone: balance.microStx >= estimate ? 'ok' : 'bad'
    });
    if (balance.microStx < estimate) {
      throw new XtrataClientError(
        'plan-invalid',
        `deployer balance ${microToStx(balance.microStx)} is below the estimated ${microToStx(estimate)}`
      );
    }

    const alreadyDeployed = await preflightNames(services, api, deployables);

    const records: DeployRecord[] = [];
    const commit = (): void => {
      api.patch({ deploys: { ...api.state().deploys, [params.stage]: [...records] } });
    };

    for (const deployable of deployables) {
      const record: DeployRecord = {
        id: deployable.id,
        contractId: deployable.contractId,
        clarityVersion: deployable.clarityVersion,
        sourceHash: deployable.sourceHash,
        status: 'pending'
      };
      records.push(record);
      commit();

      if (alreadyDeployed.get(deployable.contractId)) {
        record.status = 'confirmed';
        commit();
        api.evidence({
          label: deployable.contractId,
          value: 'already on chain with identical source — no deploy submitted',
          tone: 'warn'
        });
        continue;
      }

      // Explicit, typed confirmation showing EXACTLY what is about to deploy.
      await api.requestConfirmation({
        title: `Deploy ${deployable.contractId}`,
        phrase: deployable.contractName,
        irreversible: true,
        details: [
          { label: 'Contract id', value: deployable.contractId },
          { label: 'Network', value: params.requiredNetwork, tone: 'warn' },
          { label: 'Clarity version', value: String(deployable.clarityVersion) },
          { label: 'Source sha256', value: deployable.sourceHash },
          {
            label: 'Size',
            value: `${new TextEncoder().encode(deployable.source).length} bytes`
          },
          { label: 'Dependencies', value: deployable.dependencies.join(', ') },
          {
            label: 'Irreversible',
            value:
              'A deployed Clarity contract cannot be overwritten. Recovery requires a new versioned name.',
            tone: 'bad'
          }
        ]
      });

      try {
        const { txid } = await services.deploy({
          contractName: deployable.contractName,
          codeBody: deployable.source,
          clarityVersion: deployable.clarityVersion,
          network: params.requiredNetwork,
          stxAddress: address
        });
        record.txid = txid;
        record.status = 'submitted';
        commit();
        api.evidence({ label: `Deploy ${deployable.contractId}`, value: txid, tone: 'muted' });

        const result = await services.waitConfirm(txid);
        if (result.status !== 'success') {
          record.status = 'failed';
          record.error = `deploy ${result.status}`;
          commit();
          throw new XtrataClientError(
            result.status === 'pending' ? 'timeout-unconfirmed' : 'chain-rejected',
            `${deployable.contractId} deploy did not confirm: ${result.status}`
          );
        }
        record.status = 'confirmed';
        commit();
        api.evidence({
          label: deployable.contractId,
          value: `deployed and confirmed in ${txid}`,
          tone: 'ok'
        });
      } catch (error) {
        if (record.status !== 'failed') {
          record.status = 'failed';
          record.error = error instanceof Error ? error.message : String(error);
          commit();
        }
        throw error;
      }
    }
  };

// --- stages 6 and 14: on-chain verification --------------------------------

export const runOnChainVerification =
  (
    services: CanaryServices,
    params: {
      stage: Extract<StageId, 'testnet-verify' | 'production-verify'>;
      deployStage: Extract<StageId, 'testnet-deploy' | 'production-deploy'>;
      requiredNetwork: NetworkType;
    }
  ): StageRunner =>
  async (api) => {
    assertStageNetwork({
      requiredNetwork: params.requiredNetwork,
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });

    const state = api.state();
    const deployed = state.deploys[params.deployStage].filter(
      (record) => record.status === 'confirmed'
    );
    if (deployed.length === 0) {
      throw new XtrataClientError('plan-invalid', 'no confirmed deployments to verify');
    }
    const byId = new Map(state.deployables.map((deployable) => [deployable.contractId, deployable]));

    const records: VerificationRecord[] = [];
    let failures = 0;

    for (const record of deployed) {
      const deployable = byId.get(record.contractId);
      if (!deployable) {
        throw new XtrataClientError(
          'plan-invalid',
          `no local source for ${record.contractId} — cannot verify what was deployed`
        );
      }

      const onChainSource = await fetchContractSource({
        apiBaseUrl: services.apiBaseUrl,
        contractId: record.contractId,
        ...(services.fetchImpl ? { fetchImpl: services.fetchImpl } : {})
      });
      if (onChainSource === null) {
        throw new XtrataClientError(
          'broadcast-failed',
          `${record.contractId} is not indexed yet — wait and re-run this stage`
        );
      }

      const parity = verifyDeployedSource({ expected: deployable.source, actual: onChainSource });
      api.evidence({
        label: `Source parity ${record.contractId}`,
        value:
          parity.match === 'exact'
            ? `exact match, sha256 ${parity.actualHash}`
            : parity.match === 'normalized'
              ? `whitespace-normalized match (submitted ${parity.expectedHash}, on-chain ${parity.actualHash})`
              : `MISMATCH — expected ${parity.expectedHash}, on-chain ${parity.actualHash}`,
        tone: parity.match === 'exact' ? 'ok' : parity.match === 'normalized' ? 'warn' : 'bad'
      });
      if (parity.match === 'none') failures += 1;
      if (parity.expectedHash !== deployable.sourceHash) {
        api.evidence({
          label: `Stage 3 parity ${record.contractId}`,
          value: `local source no longer hashes to the value recorded in stage 3 (${deployable.sourceHash})`,
          tone: 'bad'
        });
        failures += 1;
      }

      const onChainInterface = await fetchContractInterface({
        apiBaseUrl: services.apiBaseUrl,
        contractId: record.contractId,
        ...(services.fetchImpl ? { fetchImpl: services.fetchImpl } : {})
      });
      let interfaceProbe;
      if (onChainInterface === null) {
        api.evidence({
          label: `Interface ${record.contractId}`,
          value: 'not indexed yet',
          tone: 'bad'
        });
        failures += 1;
      } else {
        interfaceProbe = probeInterface({
          localSource: deployable.source,
          onChain: onChainInterface
        });
        api.evidence({
          label: `Interface probe ${record.contractId}`,
          value: interfaceProbe.ok
            ? `${interfaceProbe.onChainCount} callable functions match the local source`
            : `MISMATCH — missing [${interfaceProbe.missing.map((fn) => fn.name).join(', ')}] ` +
              `unexpected [${interfaceProbe.unexpected.map((fn) => fn.name).join(', ')}] ` +
              `arity/access [${interfaceProbe.mismatched.map((entry) => entry.name).join(', ')}]`,
          tone: interfaceProbe.ok ? 'ok' : 'bad'
        });
        if (!interfaceProbe.ok) failures += 1;
      }

      const dependencies = verifyDependencies({
        source: onChainSource,
        expected: deployable.dependencies,
        deployerAddress: api.config.deployerAddress,
        selfContractId: record.contractId
      });
      api.evidence({
        label: `Dependencies ${record.contractId}`,
        value: dependencies.ok
          ? `exactly the intended principals: ${dependencies.found.join(', ')}`
          : `MISMATCH — missing [${dependencies.missing.join(', ')}] unexpected [${dependencies.unexpected.join(', ')}]`,
        tone: dependencies.ok ? 'ok' : 'bad'
      });
      if (!dependencies.ok) failures += 1;

      records.push({
        contractId: record.contractId,
        parity,
        ...(interfaceProbe ? { interfaceProbe } : {}),
        dependencies
      });
      api.patch({
        verifications: { ...api.state().verifications, [params.stage]: [...records] }
      });
    }

    if (failures > 0) {
      throw new XtrataClientError(
        'checksum-mismatch',
        `${failures} on-chain verification check(s) failed — do not proceed`
      );
    }
  };

// --- chain handles shared by stages 7-9 ------------------------------------

const contractIdsFor = (
  api: StageRunApi,
  stage: Extract<StageId, 'testnet-deploy' | 'production-deploy'>
): { drops: string; collection: string } => {
  const deployed = api.state().deploys[stage].filter((record) => record.status === 'confirmed');
  const drops = deployed.find((record) => record.id === 'drops');
  const collection = deployed.find((record) => record.id === 'collection');
  if (!drops || !collection) {
    throw new XtrataClientError(
      'plan-invalid',
      'both the drops singleton and the canary collection must be deployed before this stage'
    );
  }
  return { drops: drops.contractId, collection: collection.contractId };
};

// --- stage 7: collection creation canary -----------------------------------

export const runCollectionCanary =
  (services: CanaryServices): StageRunner =>
  async (api) => {
    assertStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });
    const { address } = requireSigner(services);
    const { collection } = contractIdsFor(api, 'testnet-deploy');

    const reads = new CollectionReads({
      collectionContractId: collection,
      coreContractId: api.config.coreContractId,
      transport: services.transport,
      getBlockHeight: services.getBlockHeight
    });

    const info = await reads.getCollectionInfo();
    api.evidence({
      label: 'Collection read-back',
      value: `${info.name} (${info.symbol}), owner ${info.owner}, minted ${info.mintedCount}`,
      tone: 'ok'
    });
    if (info.coreContract !== api.config.coreContractId) {
      throw new XtrataClientError(
        'reconcile-mismatch',
        `collection reports core ${info.coreContract}, expected ${api.config.coreContractId}`
      );
    }
    api.evidence({ label: 'Pinned core (read-only round-trip)', value: info.coreContract, tone: 'ok' });
    api.evidence({
      label: 'Drops authority',
      value: info.dropsAuthority ?? 'none',
      tone: info.dropsAuthority ? 'ok' : 'bad'
    });
    if (info.dropsAuthority === null) {
      throw new XtrataClientError(
        'reconcile-mismatch',
        'the canary collection has no drops authority baked in — stage 9 could not run'
      );
    }

    const fees = await loadFeeSchedule({
      transport: services.transport,
      coreContractId: api.config.coreContractId
    });
    api.evidence({ label: 'Fee schedule', value: fees.source, tone: fees.fallback ? 'warn' : 'ok' });

    const builder = new CollectionTxBuilder({
      collectionContractId: collection,
      coreContractId: api.config.coreContractId,
      network: services.networkName,
      sender: address,
      fees: fees.schedule
    });

    const steps = buildConfigTxs(builder, createDefaultConfigDraft(address));
    api.evidence({
      label: 'Configuration plan',
      value: `${steps.length} transaction(s): ${steps.map((step) => step.label).join('; ')}`,
      tone: 'muted'
    });
    for (const step of steps) {
      await settle(services, api, step.label, step.tx);
    }

    const after = await reads.getCollectionInfo();
    api.evidence({
      label: 'Post-configuration state',
      value: `paused=${after.paused}, active phase ${after.activePhaseId}, supply mode ${after.supplyMode}`,
      tone: after.paused ? 'bad' : 'ok'
    });
    if (after.paused) {
      throw new XtrataClientError('reconcile-mismatch', 'the collection is still paused after configuration');
    }
  };

// --- stage 8: batch-inscription canary -------------------------------------

export const CANARY_ITEM_COUNT = 2;

const canaryFiles = (runId: string): IngestFile[] =>
  Array.from({ length: CANARY_ITEM_COUNT }, (_, i) => ({
    name: `canary-${String(i + 1).padStart(2, '0')}.txt`,
    // The run id makes each canary's content unique, so a second run against a
    // pre-existing collection is not rejected as duplicate content.
    bytes: new TextEncoder().encode(
      `xtrata deployment canary item ${i + 1}\nrun ${runId}\n${'-'.repeat(64)}\n`
    ),
    mimeType: 'text/plain'
  }));

export const runInscriptionCanary =
  (services: CanaryServices): StageRunner =>
  async (api) => {
    assertStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });
    const { address, submit } = requireSigner(services);
    const { collection } = contractIdsFor(api, 'testnet-deploy');

    const files = canaryFiles(api.state().startedAt);
    const bytesByHash = new Map(
      files.map((file) => [bytesToHex(chainHashOfBytes(file.bytes)), file.bytes])
    );

    const { manifest } = ingestFiles(files, {
      collection: { name: 'Xtrata deployment canary', symbol: 'CANARY' },
      network: services.networkName,
      contracts: { core: api.config.coreContractId, collection },
      duplicatePolicy: 'reject'
    });
    api.evidence({
      label: 'Manifest',
      value: `${manifest.items.length} item(s), checksum ${manifest.checksum}`,
      tone: 'ok'
    });

    const fees = await loadFeeSchedule({
      transport: services.transport,
      coreContractId: api.config.coreContractId
    });
    const plan = buildPlan(manifest, fees.schedule);
    api.evidence({
      label: 'Plan',
      value: `${plan.totalTxs} transaction(s) across ${plan.items.length} item(s), estimated ${microToStx(
        plan.totalEstimatedFeeMicroStx
      )}`,
      tone: 'muted'
    });

    const builder = new CollectionTxBuilder({
      collectionContractId: collection,
      coreContractId: api.config.coreContractId,
      network: services.networkName,
      sender: address,
      fees: fees.schedule
    });
    const reads = new CollectionReads({
      collectionContractId: collection,
      coreContractId: api.config.coreContractId,
      transport: services.transport,
      getBlockHeight: services.getBlockHeight
    });
    const observer: ChainObserver = {
      observeItem: (owner, hash) => reads.observeItem(owner, hash),
      getTxStatus: (txid) => services.waitConfirm(txid),
      getBlockHeight: services.getBlockHeight
    };

    const executor = new CollectionExecutor(
      {
        observer,
        submit,
        waitConfirm: services.waitConfirm,
        chunksFor: async (item: ManifestItem) => {
          const bytes = bytesByHash.get(item.contentHashHex);
          if (!bytes) {
            throw new XtrataClientError('plan-invalid', `no bytes for canary item ${item.index}`);
          }
          return chunkBytes(bytes);
        }
      },
      {
        owner: address,
        builder,
        concurrency: 1,
        onEvent: (event) => {
          if (event.type === 'item-state') {
            api.evidence({
              label: `Item ${event.index}`,
              value: event.state,
              tone: event.state === 'failed' ? 'bad' : 'muted'
            });
          }
        }
      }
    );

    const result = await executor.run(manifest, plan);
    api.evidence({
      label: 'Executor result',
      value:
        `${result.report.totals.succeeded}/${result.report.totals.items} indexed, ` +
        `${result.report.totals.failed} failed, ${result.report.totals.txCount} transactions`,
      tone: result.report.totals.failed === 0 ? 'ok' : 'bad'
    });
    if (result.paused) {
      throw new XtrataClientError(
        'wallet-rejected',
        `inscription canary paused: ${result.pauseReason ?? 'unknown reason'}`
      );
    }
    if (result.report.totals.succeeded !== manifest.items.length) {
      throw new XtrataClientError(
        'reconcile-mismatch',
        `only ${result.report.totals.succeeded} of ${manifest.items.length} canary items reached indexed`
      );
    }

    const info = await reads.getCollectionInfo();
    api.evidence({
      label: 'Collection after inscription',
      value: `minted ${info.mintedCount}, next index ${info.nextIndex}`,
      tone: 'ok'
    });
  };

// --- stage 9: drop creation and claim --------------------------------------

export const runDropCanary =
  (services: CanaryServices): StageRunner =>
  async (api) => {
    assertStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });
    const { address } = requireSigner(services);
    const { drops, collection } = contractIdsFor(api, 'testnet-deploy');

    const collectionReads = new CollectionReads({
      collectionContractId: collection,
      coreContractId: api.config.coreContractId,
      transport: services.transport,
      getBlockHeight: services.getBlockHeight
    });
    const dropsReads = new DropsReads({ dropsContractId: drops, transport: services.transport });

    const nftContract = await dropsReads.getNftContract();
    api.evidence({
      label: 'Drops pinned NFT contract',
      value: nftContract,
      tone: nftContract === api.config.coreContractId ? 'ok' : 'bad'
    });
    if (nftContract !== api.config.coreContractId) {
      throw new XtrataClientError(
        'reconcile-mismatch',
        `deployed drops singleton points at ${nftContract}, expected ${api.config.coreContractId}`
      );
    }

    const builder = new DropsTxBuilder({
      dropsContractId: drops,
      collectionContractId: collection,
      nftContractId: api.config.coreContractId,
      network: services.networkName,
      sender: address
    });

    const dropId = await dropsReads.getNextDropId();
    api.evidence({ label: 'Drop id', value: String(dropId), tone: 'muted' });

    await settle(
      services,
      api,
      `create-drop ${dropId}`,
      asTxDescriptor(
        builder.createDrop({
          mode: 'pre-inscribed',
          eligibility: 'public',
          startBlock: 0,
          endBlock: 0,
          totalLimit: 0,
          perWalletLimit: 0
        })
      )
    );

    const selection = await selectAllUnassigned(collectionReads);
    const count = selectionCount(selection);
    api.evidence({
      label: 'select-all-unassigned',
      value: `${count} item(s) in ${selection.ranges.length} range(s) + ${selection.explicit.length} explicit`,
      tone: count > 0 ? 'ok' : 'bad'
    });

    const inventoryTxs = planInventoryTxs(builder, dropId, selection);
    for (const [i, tx] of inventoryTxs.entries()) {
      await settle(services, api, `add-inventory ${i + 1}/${inventoryTxs.length}`, asTxDescriptor(tx));
    }

    const inventory = await dropsReads.resolveInventory(dropId);
    const items = await collectionReads.getItems(inventory);
    const tokenIds = items.map((item, i) => {
      if (!item) {
        throw new XtrataClientError('reconcile-mismatch', `inventory index ${inventory[i]} is not minted`);
      }
      return item.tokenId;
    });
    api.evidence({
      label: 'Inventory resolved',
      value: `indexes [${inventory.join(', ')}] → token ids [${tokenIds.join(', ')}]`,
      tone: 'muted'
    });

    const escrowTxs = planEscrowTxs(builder, dropId, inventory, tokenIds);
    for (const [i, tx] of escrowTxs.entries()) {
      await settle(services, api, `escrow-batch ${i + 1}/${escrowTxs.length}`, asTxDescriptor(tx));
    }

    await settle(services, api, 'activate-drop', asTxDescriptor(builder.activateDrop(dropId)));

    const before = await dropsReads.getDropSummary(dropId);
    api.evidence({
      label: 'Drop before claim',
      value:
        `status ${before.drop.statusName}, inventory ${before.drop.inventoryCount}, ` +
        `escrowed ${before.drop.escrowedCount}, remaining ${before.remaining}`,
      tone: before.drop.statusName === 'active' && before.fullyEscrowed ? 'ok' : 'bad'
    });
    if (before.drop.statusName !== 'active') {
      throw new XtrataClientError(
        'reconcile-mismatch',
        `drop ${dropId} is ${before.drop.statusName} after activation`
      );
    }

    await settle(services, api, 'claim', asTxDescriptor(builder.claim(dropId)));

    const after = await dropsReads.getDropSummary(dropId);
    api.evidence({
      label: 'Drop after claim',
      value: `claimed ${after.drop.claimedCount}, remaining ${after.remaining}`,
      tone: after.drop.claimedCount > before.drop.claimedCount ? 'ok' : 'bad'
    });
    if (after.drop.claimedCount <= before.drop.claimedCount) {
      throw new XtrataClientError('reconcile-mismatch', 'the claim did not increment the drop claim count');
    }
  };

// --- stage 10: sponsored-claim canary --------------------------------------

export const runSponsoredClaimCanary =
  (services: CanaryServices): StageRunner =>
  async (api) => {
    if (api.config.relayerBaseUrl === null) {
      api.skip('no relayer base URL is configured for this build (VITE_XTRATA_RELAYER_URL unset)');
      return;
    }
    assertStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: services.walletNetwork,
      appNetwork: services.appNetwork
    });

    const drops = api
      .state()
      .deploys['testnet-deploy'].find((record) => record.id === 'drops' && record.status === 'confirmed');
    if (!drops) {
      throw new XtrataClientError('plan-invalid', 'the drops singleton must be deployed before this stage');
    }

    const result = await probeRelayer({
      relayerBaseUrl: api.config.relayerBaseUrl,
      dropId: 0,
      ...(services.fetchImpl ? { fetchImpl: services.fetchImpl } : {})
    });
    for (const step of result.steps) {
      api.evidence({
        label: step.endpoint,
        value: `${String(step.status)} ${step.body ? JSON.stringify(step.body) : ''}`.trim(),
        tone: typeof step.status === 'string' || step.status === 500 ? 'bad' : 'ok'
      });
    }
    api.evidence({ label: 'Relayer', value: result.detail, tone: result.ok ? 'ok' : 'bad' });
    if (!result.ok) {
      throw new XtrataClientError('broadcast-failed', result.detail);
    }
  };

// --- stage 11: review ------------------------------------------------------

export const runReview = (): StageRunner => async (api) => {
  const state = api.state();
  const deployed = state.deploys['testnet-deploy'];
  api.evidence({
    label: 'Testnet deployments',
    value: deployed.map((record) => `${record.contractId} (${record.status})`).join('; ') || 'none',
    tone: deployed.every((record) => record.status === 'confirmed') ? 'ok' : 'bad'
  });
  for (const record of state.verifications['testnet-verify']) {
    api.evidence({
      label: `Verified ${record.contractId}`,
      value:
        `source ${record.parity?.match ?? 'n/a'}, interface ${
          record.interfaceProbe?.ok ? 'ok' : 'mismatch'
        }, dependencies ${record.dependencies?.ok ? 'ok' : 'mismatch'}`,
      tone: 'ok'
    });
  }
  const attested = Object.values(state.stages).filter((stage) => stage.attestation !== undefined);
  api.evidence({
    label: 'Operator-attested stages',
    value:
      attested
        .map((stage) => `${stage.id} by ${stage.attestation?.attestedBy ?? 'unknown'}`)
        .join('; ') || 'none',
    tone: 'warn'
  });
  const skipped = Object.values(state.stages).filter((stage) => stage.status === 'skipped');
  api.evidence({
    label: 'Skipped stages',
    value: skipped.map((stage) => `${stage.id}: ${stage.skipReason ?? ''}`).join('; ') || 'none',
    tone: skipped.length > 0 ? 'warn' : 'ok'
  });
  api.evidence({
    label: 'Review notes',
    value: state.reviewNotes.trim().length > 0 ? state.reviewNotes : '(none recorded)',
    tone: 'muted'
  });
};

// --- stage 15: application configuration -----------------------------------

export interface ActivationConfig {
  networks: Record<string, { coreContractId: string; dropsContractId: string }>;
  relayer: { allowlist: string[]; baseUrl: string | null };
  generatedAt: string;
}

export const buildActivationConfig = (
  state: Pick<CanaryState, 'config' | 'deploys'>,
  now: () => Date = () => new Date()
): ActivationConfig => {
  const entryFor = (stage: 'testnet-deploy' | 'production-deploy'): string | null =>
    state.deploys[stage].find((record) => record.id === 'drops' && record.status === 'confirmed')
      ?.contractId ?? null;

  const networks: ActivationConfig['networks'] = {};
  const testnetDrops = entryFor('testnet-deploy');
  const mainnetDrops = entryFor('production-deploy');
  if (testnetDrops) {
    networks['testnet'] = {
      coreContractId: state.config.coreContractId,
      dropsContractId: testnetDrops
    };
  }
  if (mainnetDrops) {
    networks['mainnet'] = {
      coreContractId: state.config.coreContractId,
      dropsContractId: mainnetDrops
    };
  }
  return {
    networks,
    relayer: {
      allowlist: [mainnetDrops, testnetDrops].filter((id): id is string => id !== null),
      baseUrl: state.config.relayerBaseUrl
    },
    generatedAt: now().toISOString()
  };
};

export const runActivation = (): StageRunner => async (api) => {
  const state = api.state();
  const production = state.deploys['production-deploy'].filter(
    (record) => record.status === 'confirmed'
  );
  if (production.length === 0) {
    throw new XtrataClientError(
      'plan-invalid',
      'nothing was deployed to production — there is no configuration to activate'
    );
  }
  const verified = state.verifications['production-verify'];
  if (verified.length === 0) {
    throw new XtrataClientError(
      'plan-invalid',
      'production deployments have not been verified on chain — stage 14 must pass first'
    );
  }
  const config = buildActivationConfig(state);
  api.evidence({ label: 'App contract ids', value: JSON.stringify(config.networks, null, 2), tone: 'ok' });
  api.evidence({
    label: 'Relayer allowlist',
    value: config.relayer.allowlist.join(', ') || 'none',
    tone: config.relayer.allowlist.length > 0 ? 'ok' : 'warn'
  });
  api.evidence({
    label: 'Build environment',
    value: Object.entries(config.networks)
      .map(([network, entry]) => `${network}: VITE_XTRATA_DROPS_CONTRACT=${entry.dropsContractId}`)
      .join('\n'),
    tone: 'muted'
  });
};

// --- assembly --------------------------------------------------------------

/**
 * Every stage that has a runner. Stages 2, 4 and 12 are settled by operator
 * action (`attest` / an approval gate) rather than by running anything, so they
 * are deliberately absent.
 */
export const createRunners = (
  services: CanaryServices
): Partial<Record<StageId, StageRunner>> => ({
  sources: runSourceValidation(),
  'source-parity': runSourceParity(),
  'testnet-deploy': runDeployment(services, {
    stage: 'testnet-deploy',
    requiredNetwork: 'testnet'
  }),
  'testnet-verify': runOnChainVerification(services, {
    stage: 'testnet-verify',
    deployStage: 'testnet-deploy',
    requiredNetwork: 'testnet'
  }),
  'collection-canary': runCollectionCanary(services),
  'inscription-canary': runInscriptionCanary(services),
  'drop-canary': runDropCanary(services),
  'sponsored-claim-canary': runSponsoredClaimCanary(services),
  review: runReview(),
  'production-deploy': runDeployment(services, {
    stage: 'production-deploy',
    requiredNetwork: 'mainnet'
  }),
  'production-verify': runOnChainVerification(services, {
    stage: 'production-verify',
    deployStage: 'production-deploy',
    requiredNetwork: 'mainnet'
  }),
  activation: runActivation()
});
