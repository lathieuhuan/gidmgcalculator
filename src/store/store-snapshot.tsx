import { createContext, useContext, useRef } from "react";
import { AppStore, RootState } from "./store";

export const DeclarativeStoreContext = createContext<AppStore | null>(null);

const useStoreContext = (): AppStore => {
  const storeContext = useContext(DeclarativeStoreContext);
  if (!storeContext) {
    throw new Error("No store found");
  }
  return storeContext;
};

export const useStore = () => {
  const storeContext = useStoreContext();

  function select<T>(selector: (state: RootState) => T): T;
  function select(): AppStore;
  function select<T>(selector?: (state: RootState) => T): T | AppStore {
    return selector ? selector(storeContext.getState()) : storeContext;
  }
  return {
    select,
  };
};

export function useStoreSnapshot<T>(selector: (state: RootState) => T): T {
  const storeContext = useStoreContext();
  return useRef(selector(storeContext.getState())).current;
}

interface DeclarativeStoreProviderProps {
  store: AppStore;
  children: React.ReactNode;
}
export const StoreSnapshotProvider = ({ store, children }: DeclarativeStoreProviderProps) => {
  return <DeclarativeStoreContext.Provider value={store}>{children}</DeclarativeStoreContext.Provider>;
};
