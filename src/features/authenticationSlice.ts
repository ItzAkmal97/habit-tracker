import { createSlice, createSelector } from "@reduxjs/toolkit";
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from "../store/store";

interface AuthenticationState {
    isLoggedIn: boolean;
}

const initialState: AuthenticationState = {
    isLoggedIn: false,
};

const AuthenticationStateSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },       
    },
});

export const { setIsLoggedIn } = AuthenticationStateSlice.actions;

export default AuthenticationStateSlice.reducer;

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setIsLoggedIn),
  effect: (action) => {
    console.log('Auth State Changed:', action);
  }
});

export const selectIsLoggedIn = createSelector(
    (state: RootState) => state.authentication.isLoggedIn,
    (isLoggedIn) => isLoggedIn
  );