import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/loginSignupSlice";

export const store = configureStore({
  reducer: {
    loginSignup: loginSignupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
