import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import calculatorReducers from "./calculatorSlice";
import databaseReducers from "./userDatabaseSlice";
import uiReducers from "./uiSlice";

// const databasePersistReducers = persistReducer(
//   {
//     key: "database",
//     version: 0,
//     storage,
//   },
//   databaseReducers
// );

const rootReducer = combineReducers({
  ui: uiReducers,
  calculator: calculatorReducers,
  database: databaseReducers,
});

const persistConfig = {
  key: "root",
  version: 0,
  storage,
  blacklist: ["calculator", "ui", "database"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
