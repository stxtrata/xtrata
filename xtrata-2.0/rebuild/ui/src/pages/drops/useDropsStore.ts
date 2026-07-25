import { createContext, useContext, useSyncExternalStore } from 'react';
import type { DropsBuilderState, DropsBuilderStore } from './store';

/** React binding for the framework-free `DropsBuilderStore`. */

export const DropsStoreContext = createContext<DropsBuilderStore | null>(null);

export const useDrops = (): DropsBuilderStore => {
  const store = useContext(DropsStoreContext);
  if (!store) throw new Error('useDrops must be used inside <DropsStoreContext.Provider>');
  return store;
};

export const useDropsState = (): DropsBuilderState => {
  const store = useDrops();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
};

/** Subscribe to a store held directly, before the context provider exists. */
export const useDropsStateOf = (store: DropsBuilderStore): DropsBuilderState =>
  useSyncExternalStore(store.subscribe, store.getState, store.getState);
