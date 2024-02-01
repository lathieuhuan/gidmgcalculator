import { createContext, useState, useCallback } from "react";

import { setupStore } from "@Src/store";
import { $AppSettings } from "@Src/services";

type ChangeConfigFn = (args: Partial<{ persistingUserData: boolean }>) => void;

export const PersistControlContext = createContext<ChangeConfigFn>(() => {});

interface PersistControlProviderProps {
  children: (config: ReturnType<typeof setupStore>) => React.ReactElement;
}
export const PersistControlProvider = (props: PersistControlProviderProps) => {
  const [config, setConfig] = useState(setupStore({ persistingUserData: $AppSettings.get().persistingUserData }));

  const changeConfig: ChangeConfigFn = useCallback(({ persistingUserData }) => {
    if (persistingUserData !== $AppSettings.get().persistingUserData) {
      $AppSettings.set({ persistingUserData });

      setConfig(setupStore({ persistingUserData }));
    }
  }, []);

  return <PersistControlContext.Provider value={changeConfig}>{props.children(config)}</PersistControlContext.Provider>;
};
