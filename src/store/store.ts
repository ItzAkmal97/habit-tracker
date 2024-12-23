import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/loginSignupSlice";
import AuthenticationStateSliceReducer from "../features/authenticationSlice";
import firebaseDbStateSliceReducer from "../features/firebaseDbSlice";
import habitsSliceReducer from "../features/habitsSlice";
import rewardSliceReducer from '../features/rewardSlice'
import xpLevelSliceReducer from '../features/xpLevelSlice';
import darkModeSliceReducer from '../features/darkModeSlice';

export const store = configureStore({
  reducer: {
    loginSignup: loginSignupReducer,
    authentication: AuthenticationStateSliceReducer,
    firebaseDb: firebaseDbStateSliceReducer,
    habits: habitsSliceReducer,
    reward: rewardSliceReducer,
    xpLevel: xpLevelSliceReducer,
    darkMod: darkModeSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
