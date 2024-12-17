import { createSlice, PayloadAction } from "@reduxjs/toolkit";


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
    setRewards: (state, action: PayloadAction<Reward[]>) => {
      state.rewards = action.payload;
    },

    addRewards: (state, action: PayloadAction<Reward>) => {
      if (!state.rewards.some((reward) => reward.id === action.payload.id)) {
        state.rewards.unshift({
          ...action.payload,
          cost: 0,
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
      } else {
        console.warn("not enough gold");
      }
    },
  },
});

export const { setRewards, addRewards, deleteRewards, editRewards, decrementTotalGold } =
  RewardSlice.actions;
export default RewardSlice.reducer;
