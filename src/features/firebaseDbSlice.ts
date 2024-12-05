import { createSlice } from "@reduxjs/toolkit";

interface FirebaseDbStateSlice {
  username: string;
  email: string;
}

const initialState: FirebaseDbStateSlice = { username: "", email: "" };

export const firebaseDbStateSlice = createSlice({
  name: "firebaseDb",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },

    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});

export const {setEmail, setUsername} = firebaseDbStateSlice.actions;
export default firebaseDbStateSlice.reducer;
