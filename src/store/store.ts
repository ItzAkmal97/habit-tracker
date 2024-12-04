import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/loginSignupSlice";
import AuthenticationStateSliceReducer from "../features/authenticationSlice";

export const store = configureStore({
  reducer: {
    loginSignup: loginSignupReducer,
    authentication: AuthenticationStateSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
