import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FirebaseDbStateSlice {
  username: string;
  email: string;
}

const initialState: FirebaseDbStateSlice = { username: "", email: "" };

const firebaseDbStateSlice = createSlice({
  name: "firebaseDb",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },

    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
  },
});

export const {setEmail, setUsername} = firebaseDbStateSlice.actions;
export default firebaseDbStateSlice.reducer;
