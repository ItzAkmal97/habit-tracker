import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// export type ResetCounter = {
//   resetCounter: "Daily" | "Weekly" | "Monthly";
// };
export interface Habit {
  id: string;
  title: string;
  description: string;
  positive: boolean;
  negative: boolean;
  positiveCount?: number;
  negativeCount?: number;
  // resetCounter?: ResetCounter;
  order?: number;
}

interface HabitsState {
  habits: Habit[];
}

const initialState: HabitsState = {
  habits: [],
};

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },

    addHabit: (state, action: PayloadAction<Habit>) => {
      if (!state.habits.some((habit) => habit.id === action.payload.id)) {
        state.habits.push({
          ...action.payload,
          positiveCount: 0,
          negativeCount: 0,
        });
      }
    },

    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
    },

    editHabit: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        positive: boolean;
        negative: boolean;
        // resetCounter: ResetCounter;
      }>
    ) => {
      const { id, title, description, positive, negative,} =
        action.payload;
      const habit = state.habits.find((habit) => habit.id === id);
      if (habit) {
        habit.title = title;
        habit.description = description;
        habit.positive = positive;
        habit.negative = negative;
        // habit.resetCounter = resetCounter;
      }
    },

    incrementCounter: (state, action: PayloadAction<{ habitId: string }>) => {
      const habit = state.habits.find((h) => h.id === action.payload.habitId);
      if (habit) {
        habit.positiveCount = (habit.positiveCount || 0) + 1;
      }
    },

    decrementCounter: (state, action: PayloadAction<{ habitId: string }>) => {
      const habit = state.habits.find((h) => h.id === action.payload.habitId);
      if (habit) {
        habit.negativeCount = (habit.negativeCount || 0) - 1;
      }
    },

    // resetCounter:(state, action: PayloadAction<{ habitId: string }>) => {
    //   const habit = state.habits.find((h) => h.id === action.payload.habitId);
    //   if (habit) {
        
    //   }
    // },
  },
});

export const {
  setHabits,
  addHabit,
  editHabit,
  deleteHabit,
  incrementCounter,
  decrementCounter,
} = habitsSlice.actions;

export default habitsSlice.reducer;
