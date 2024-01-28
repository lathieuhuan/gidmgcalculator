import { createContext, useContext, useRef } from "react";
import { AppStore, RootState } from "./store";

export const DeclarativeStoreContext = createContext<AppStore | null>(null);

const useStore = () => {
  const store = useContext(DeclarativeStoreContext);
  if (!store) {
    throw new Error("No store found");
  }
  return store;
};

export function useStoreSnapshot<T>(selector: (state: RootState) => T): T {
  const store = useStore();
  return useRef(selector(store.getState())).current;
}

interface DeclarativeStoreProviderProps {
  store: AppStore;
  children: React.ReactNode;
}
export const StoreSnapshotProvider = ({ store, children }: DeclarativeStoreProviderProps) => {
  return <DeclarativeStoreContext.Provider value={store}>{children}</DeclarativeStoreContext.Provider>;
};
