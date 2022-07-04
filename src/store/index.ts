import { configureStore } from '@reduxjs/toolkit';
import uiSlice from "./uiSlice";
import calculatorSlice from "./calculatorSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    calculator: calculatorSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
