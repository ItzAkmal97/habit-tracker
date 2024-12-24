import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/util/firebaseConfig";

interface UserState {
  xp: number;
  level: number;
  totalXpForNextLevel: number;
  totalXp: number;
}

const initialState: UserState = {
  xp: 0,
  level: 0,
  totalXpForNextLevel: 100,
  totalXp: 0,
};

const xpLevelSlice = createSlice({
  name: "xplevel",
  initialState,
  reducers: {
    setXpLevel: (state, action: PayloadAction<UserState>) => {
      state.xp = action.payload.xp;
      state.level = action.payload.level;
      state.totalXpForNextLevel = action.payload.totalXpForNextLevel;
      state.totalXp = action.payload.totalXp;
    },

    updateXPAndLevel: (state, action: PayloadAction<{ xpGain: number }>) => {
      const { xpGain } = action.payload;

      if (typeof xpGain !== "number" || isNaN(xpGain)) {
        return;
      }

      state.xp += xpGain;
      state.totalXp = (state.totalXp || 0) + xpGain;
      if (state.totalXp < 0) state.totalXp = 0;
      if (state.xp < 0) state.xp = 0;

      if (state.xp >= state.totalXpForNextLevel) {
        state.level += 1;
        state.xp -= state.totalXpForNextLevel;
        state.totalXpForNextLevel = 100 * (state.level + 1);
      }

      saveXPLevelData(state);
    },
  },
});

export const fetchXPLevelData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        xp: data.xp || 0,
        level: data.level || 0,
        totalXpForNextLevel: data.totalXpForNextLevel || 100,
        totalXp: data.totalXp || 0,
      };
    }

    return initialState;
  } catch (error) {
    console.error("Error fetching XP data:", error);
    return initialState;
  }
};

export const saveXPLevelData = async (state: UserState) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        xp: state.xp,
        level: state.level,
        totalXpForNextLevel: state.totalXpForNextLevel,
        totalXp: state.totalXp,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving XP data:", error);
  }
};

export const { updateXPAndLevel, setXpLevel } = xpLevelSlice.actions;
export default xpLevelSlice.reducer;
