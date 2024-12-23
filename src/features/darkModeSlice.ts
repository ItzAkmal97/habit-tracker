import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '@/util/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '@/util/firebaseConfig';

export const saveDarkModeAccess = async (darkModeAccess: string) => {
    try{
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
  
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { darkModeAccess }, { merge: true });
      console.log("Dark mode access updated successfully!");
    } catch (error) {
      if(error instanceof Error) {
        console.error("Error setting dark mode access:", error);
      }
    }
  }
  
  export const getDarkModeAccess = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
  
      const userRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userRef);
  
      if (docSnapshot.exists()) {
        return docSnapshot.data()?.darkModeAccess || "temporary";
      } else {
        console.warn("No user document found");
        return "temporary";
      }
    } catch (error) {
      if(error instanceof Error) {
        console.error("Error fetching dark mode access:", error);
        return null;
      }
    }
  }

interface DarkModeState {
    isEnabled: boolean;
}

const initialState: DarkModeState = {
    isEnabled: false,
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode(state) {
            state.isEnabled = !state.isEnabled;
        },
        setDarkMode(state, action: PayloadAction<boolean>) {
            state.isEnabled = action.payload;
        },
    },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;