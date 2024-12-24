import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/loginSignupSlice";
import AuthenticationStateSliceReducer from "../features/authenticationSlice";
import firebaseDbStateSliceReducer from "../features/firebaseDbSlice";
import habitsSliceReducer from "../features/habitsSlice";
import rewardSliceReducer from '../features/rewardSlice'
import xpLevelSliceReducer from '../features/xpLevelSlice';
import darkModeSliceReducer from '../features/darkModeSlice';
import badgeSliceReducer from '../features/badgeSlice';

export const store = configureStore({
  reducer: {
    loginSignup: loginSignupReducer,
    authentication: AuthenticationStateSliceReducer,
    firebaseDb: firebaseDbStateSliceReducer,
    habits: habitsSliceReducer,
    reward: rewardSliceReducer,
    xpLevel: xpLevelSliceReducer,
    darkMod: darkModeSliceReducer,
    badge: badgeSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
