import { configureStore } from "@reduxjs/toolkit";
import { PinSlices } from './slices';

const reducer = {
  pin: PinSlices.reducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
