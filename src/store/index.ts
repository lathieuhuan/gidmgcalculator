import { configureStore } from '@reduxjs/toolkit';
import uiReducers from "./uiSlice";
import calculatorReducers from "./calculatorSlice";
import databaseReducers from "./databaseSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducers,
    calculator: calculatorReducers,
    database: databaseReducers
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
