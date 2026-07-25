import { useWallet } from './WalletContext';

export const NetworkBadge = (): JSX.Element => {
  const { appNetwork } = useWallet();
  return (
    <span className={`badge badge--${appNetwork}`} title={`This app is targeting ${appNetwork}`}>
      {appNetwork}
    </span>
  );
};
