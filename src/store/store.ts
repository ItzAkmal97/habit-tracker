import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/loginSignupSlice";
import AuthenticationStateSliceReducer from "../features/authenticationSlice";
import firebaseDbStateSliceReducer from "../features/firebaseDbSlice";
import habitsSliceReducer from "../features/habitsSlice";

export const store = configureStore({
  reducer: {
    loginSignup: loginSignupReducer,
    authentication: AuthenticationStateSliceReducer,
    firebaseDb: firebaseDbStateSliceReducer,
    habits: habitsSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
