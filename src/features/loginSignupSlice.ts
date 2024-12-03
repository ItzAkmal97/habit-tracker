import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginSignupState {
  showToast: boolean;
  toastMessage: string;
  toastColor: string;
  showPassword: boolean;
}

const initialState: LoginSignupState = {
  showToast: false,
  toastMessage: "",
  toastColor: "",
  showPassword: false,
};

const LoginSignupSlice = createSlice({
  name: "loginSignup",
  initialState,
  reducers: {
    setShowToast(state, action: PayloadAction<boolean>) {
      state.showToast = action.payload;
    },

    setToastMessage(state, action: PayloadAction<string>) {
      state.toastMessage = action.payload;
    },

    setToastColor(state, action: PayloadAction<string>) {
      state.toastColor = action.payload;
    },

    setShowPassword(state, action: PayloadAction<boolean>) {
      state.showPassword = action.payload;
    },
  },
});

export const { setShowPassword, setToastColor, setToastMessage, setShowToast } =
  LoginSignupSlice.actions;

export default LoginSignupSlice.reducer;
