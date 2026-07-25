import { createContext, useContext, useSyncExternalStore } from 'react';
import type { StudioState, StudioStore } from './store';

/** React binding for the framework-free `StudioStore`. */

export const StudioStoreContext = createContext<StudioStore | null>(null);

export const useStudio = (): StudioStore => {
  const store = useContext(StudioStoreContext);
  if (!store) throw new Error('useStudio must be used inside <StudioStoreContext.Provider>');
  return store;
};

export const useStudioState = (): StudioState => {
  const store = useStudio();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
};
