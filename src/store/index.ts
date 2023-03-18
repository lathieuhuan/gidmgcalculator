import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import calculatorReducers from "./calculatorSlice";
import databaseReducers, { initialState } from "./userDatabaseSlice";
import uiReducers from "./uiSlice";

export const setupStore = (args?: { persistingUserData?: boolean }) => {
  const databasePersistReducers = persistReducer(
    {
      key: "database",
      version: 0,
      storage,
      blacklist: args?.persistingUserData ? [] : Object.keys(initialState),
    },
    databaseReducers
  );

  const rootReducer = combineReducers({
    ui: uiReducers,
    calculator: calculatorReducers,
    database: databasePersistReducers,
  });

  const persistConfig = {
    key: "root",
    version: 0,
    storage,
    blacklist: ["calculator", "ui", "database"],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

export type AppStore = ReturnType<typeof setupStore>["store"];

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
