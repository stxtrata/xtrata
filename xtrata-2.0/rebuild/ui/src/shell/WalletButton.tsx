import { shortenAddress, useWallet } from './WalletContext';

export const WalletButton = (): JSX.Element => {
  const { isConnected, address, connecting, connect, disconnect, providerId } = useWallet();

  if (isConnected && address) {
    return (
      <div className="row">
        <span className="mono muted" title={`${address}${providerId ? ` · ${providerId}` : ''}`}>
          {shortenAddress(address)}
        </span>
        <button type="button" className="btn btn--sm" onClick={() => void disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() => void connect()}
      disabled={connecting}
      aria-busy={connecting}
    >
      {connecting ? 'Connecting…' : 'Connect wallet'}
    </button>
  );
};
