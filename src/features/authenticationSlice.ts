import { createSlice } from "@reduxjs/toolkit";

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