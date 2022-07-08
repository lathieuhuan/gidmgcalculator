import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import calculatorReducers from "./calculatorSlice";
import databaseReducers from "./databaseSlice";
import uiReducers from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducers,
    calculator: calculatorReducers,
    database: databaseReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
