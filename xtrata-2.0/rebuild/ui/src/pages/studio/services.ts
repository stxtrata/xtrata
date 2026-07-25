import { createContext, useContext } from 'react';
import type {
  ChainTxResult,
  CollectionReads,
  CollectionTxBuilder,
  ReadOnlyTransport,
  TxDescriptor
} from '@xtrata/collections-client';
import type { NetworkType } from '../../wallet/network';
import type { DeployParams } from '../../services/deploy';

/**
 * Chain/wallet services the Studio steps need. Everything optional here is
 * "requires a connected wallet on the right network"; the steps degrade to
 * read-only or disabled controls rather than throwing.
 */
export interface StudioServices {
  apiBaseUrl: string;
  network: NetworkType;
  coreContractId: string;
  dropsContractId: string;
  address?: string;
  canSign: boolean;
  transport?: ReadOnlyTransport;
  reads?: CollectionReads;
  builder?: CollectionTxBuilder;
  submit?: (tx: TxDescriptor) => Promise<{ txid: string }>;
  deploy?: (params: DeployParams) => Promise<{ txid: string }>;
  waitConfirm?: (txid: string) => Promise<ChainTxResult>;
}

export const StudioServicesContext = createContext<StudioServices | null>(null);

export const useStudioServices = (): StudioServices => {
  const value = useContext(StudioServicesContext);
  if (!value) throw new Error('useStudioServices must be used inside its provider');
  return value;
};
