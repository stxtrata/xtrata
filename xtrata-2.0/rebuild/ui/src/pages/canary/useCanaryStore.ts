import { createContext, useContext, useSyncExternalStore } from 'react';
import type { CanaryState, CanaryStore } from './store';

/** React binding for the framework-free `CanaryStore` (same shape as the Studio's). */

export const CanaryStoreContext = createContext<CanaryStore | null>(null);

export const useCanary = (): CanaryStore => {
  const store = useContext(CanaryStoreContext);
  if (!store) throw new Error('useCanary must be used inside <CanaryStoreContext.Provider>');
  return store;
};

export const useCanaryState = (): CanaryState => {
  const store = useCanary();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
};
