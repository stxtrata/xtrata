import { assertPrincipalOnNetwork, XtrataClientError } from '@xtrata/collections-client';
import { loadConfig } from '../config';
import { useWallet } from './WalletContext';

/**
 * Wrong-network guard.
 *
 * Two independent checks, both driven by the client's principal-prefix guard
 * (`assertPrincipalOnNetwork`) rather than anything the wallet self-reports:
 *
 * 1. Configuration: the pinned core / drops contracts must be encoded for the
 *    network this build targets. A misconfigured build is fatal — no signing
 *    surface should be reachable at all.
 * 2. Session: the connected account must be on the same network. Recoverable —
 *    switch the account in the wallet.
 */

const guardMessage = (principal: string, network: 'mainnet' | 'testnet'): string | null => {
  try {
    assertPrincipalOnNetwork(principal, network);
    return null;
  } catch (error) {
    return error instanceof XtrataClientError ? error.message : String(error);
  }
};

export const NetworkGuardBanner = (): JSX.Element | null => {
  const { appNetwork, walletNetwork, wrongNetwork, isConnected } = useWallet();
  const config = loadConfig();

  const configProblems = [
    guardMessage(config.coreContractId, appNetwork),
    guardMessage(config.dropsContractId, appNetwork)
  ].filter((message): message is string => message !== null);

  if (configProblems.length > 0) {
    return (
      <div className="banner banner--danger" role="alert">
        <div>
          <strong>Configuration is on the wrong network.</strong>
          <p>
            This build targets <code>{appNetwork}</code> but a pinned contract is not. Nothing can be
            signed until the build configuration is fixed.
          </p>
          <ul>
            {configProblems.map((problem) => (
              <li key={problem} className="mono">
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (!isConnected || !wrongNetwork) return null;

  return (
    <div className="banner banner--warn" role="alert">
      <div>
        <strong>Wrong network.</strong>
        <p>
          This app targets <code>{appNetwork}</code>, but the connected account is a{' '}
          <code>{walletNetwork ?? 'unknown'}</code> address. Switch networks in your wallet and
          reconnect — transactions are blocked until you do.
        </p>
      </div>
    </div>
  );
};

/** Convenience for pages: may this session sign? */
export const useCanSign = (): boolean => {
  const { isConnected, wrongNetwork } = useWallet();
  const config = loadConfig();
  const configOk =
    guardMessage(config.coreContractId, config.network) === null &&
    guardMessage(config.dropsContractId, config.network) === null;
  return isConnected && !wrongNetwork && configOk;
};
