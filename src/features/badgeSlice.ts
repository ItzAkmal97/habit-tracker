import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BADGESDATA } from "../components/Badges Management/Data";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  requirement: string;
  xpRequired?: number;
  levelRequired?: number;
  streak?: number;
  time?: string;
  daysRequired?: number;
}

const initialState = {
  badges: [] as Badge[],
};

const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    setBadges: (state, action) => {
      state.badges = action.payload;
    },

    addBadge: (state, action: PayloadAction<Badge>) => {
      if (state.badges.find((badge) => badge.id === action.payload.id)) return;
      state.badges.push(action.payload);
    },

    xpBadge: (state, action: PayloadAction<{ requiredXp: number }>) => {
      const { requiredXp } = action.payload;
      const badge = BADGESDATA.progression.find(
        (badge) => badge.xpRequired === requiredXp
      );
      if (!badge || state.badges.find((b) => b.id === badge.id)) return;
      state.badges.push(badge);
    },

    levelBadge: (state, action: PayloadAction<{ levelRequired: number }>) => {
      const { levelRequired } = action.payload;
      const badge = BADGESDATA.progression.find(
        (badge) => badge.levelRequired === levelRequired
      );
      if (!badge || state.badges.find((b) => b.id === badge.id)) return;
      state.badges.push(badge);
    },
  },
});

export const { setBadges, addBadge, xpBadge, levelBadge } =
  badgeSlice.actions;
export default badgeSlice.reducer;
