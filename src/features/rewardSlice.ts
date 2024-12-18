import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/util/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/util/firebaseConfig"; 

const setTotalDbGold = async (totalGold: number) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const userRef = doc(db, "users", user.uid); 
    await setDoc(userRef, { totalGold }, { merge: true });
    console.log("Total gold updated successfully!");
  } catch (error) {
    console.error("Error setting total gold:", error);
  }
};

export const getTotalGold = async (): Promise<number | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const userRef = doc(db, "users", user.uid);
    const docSnapshot = await getDoc(userRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data()?.totalGold || 0;
    } else {
      console.warn("No user document found");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching total gold:", error);
    return null;
  }
};

export interface Reward {
  id: string;
  title: string;
  notes: string;
  cost?: number;
  order?: number;
}

interface RewardState {
  rewards: Reward[];
  totalGold: number;
}

const initialState: RewardState = {
  rewards: [],
  totalGold: 100,
};


export const RewardSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {

    setTotalGold:(state, action) => {
      state.totalGold = action.payload;
    },

    setRewards: (state, action: PayloadAction<Reward[]>) => {
      state.rewards = action.payload;
    },

    addRewards: (state, action: PayloadAction<Reward>) => {
      if (!state.rewards.some((reward) => reward.id === action.payload.id)) {
        state.rewards.unshift({
          ...action.payload,
          cost: 10,
          order: 0,
        });
      }

      for (let i = 0; i < state.rewards.length; i++) {
        if (i > 0) {
          state.rewards[i].order = 1;
        }
      }
    },

    deleteRewards: (state, action: PayloadAction<string>) => {
      state.rewards = state.rewards.filter(
        (reward) => reward.id !== action.payload
      );
    },

    editRewards: (state, action: PayloadAction<Reward>) => {
      const { id, title, notes, cost } = action.payload;

      const rewards = state.rewards.find(
        (reward) => reward.id === id
      );

      if (rewards) {
        rewards.title = title;
        rewards.notes = notes;
        rewards.cost = cost;
      }
    },

    decrementTotalGold: (state, action: PayloadAction<number>) => {
      if(state.totalGold >= action.payload) {
        state.totalGold -= action.payload;
        setTotalDbGold(state.totalGold);
      } else {
        console.warn("not enough gold");
      }
      setTotalGold(state.totalGold);
    },

    incrementTotalGold:(state, action: PayloadAction<number>) => {
      state.totalGold += action.payload;
      setTotalDbGold(state.totalGold);
      setTotalGold(state.totalGold);
    }
  },
});

export const { incrementTotalGold, setRewards, addRewards, deleteRewards, editRewards, decrementTotalGold, setTotalGold } =
  RewardSlice.actions;
export default RewardSlice.reducer;
