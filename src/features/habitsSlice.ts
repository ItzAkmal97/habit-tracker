import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type ResetFrequency = "Daily" | "Weekly" | "Monthly";
import { addWeeks, addMonths, startOfDay } from "date-fns";

export interface Habit {
  id: string;
  title: string;
  description: string;
  positive: boolean;
  negative: boolean;
  positiveCount?: number;
  negativeCount?: number;
  resetFrequency?: ResetFrequency;
  order?: number;
  lastResetDate?: string;
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
        state.habits.unshift({
          ...action.payload,
          positiveCount: 0,
          negativeCount: 0,
          order: 0,
          lastResetDate: new Date().toISOString(),
        });
      }

      for (let i = 0; i < state.habits.length; i++) {
        if (i > 0) {
          state.habits[i].order = 1;
        }
      }
    },

    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
    },

    editHabit: (state, action: PayloadAction<Habit>) => {
      const {
        id,
        title,
        description,
        positive,
        negative,
        lastResetDate,
        resetFrequency,
      } = action.payload;
      const habit = state.habits.find((habit) => habit.id === id);
      if (habit) {
        habit.title = title;
        habit.description = description;
        habit.positive = positive;
        habit.negative = negative;
        habit.resetFrequency = resetFrequency;
        habit.lastResetDate = lastResetDate;
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

    setResetFrequency: (
      state,
      action: PayloadAction<{ habitId: string; resetFrequency: ResetFrequency }>
    ) => {
      const habit = state.habits.find((h) => h.id === action.payload.habitId);
      if (habit) {
        habit.resetFrequency = action.payload.resetFrequency;
        habit.lastResetDate = new Date().toISOString();
      }
    },
  },
});

export const checkAndResetHabits = (habits: Habit[]) => {
  const now = new Date();

  return habits.map((habit) => {
    if (!habit.resetFrequency || !habit.lastResetDate) return habit;

    const lastResetDate = new Date(habit.lastResetDate);
    let shouldReset = false;

    switch (habit.resetFrequency) {
      case "Daily":
        shouldReset = startOfDay(now) > startOfDay(lastResetDate);
        break;
      case "Weekly":
        shouldReset = now >= addWeeks(lastResetDate, 1);
        break;
      case "Monthly":
        shouldReset = now >= addMonths(lastResetDate, 1);
        break;
    }

    if (shouldReset) {
      return {
        ...habit,
        positiveCount: 0,
        negativeCount: 0,
        lastResetDate: now.toISOString(),
      };
    }

    return habit;
  });
};

export const {
  setHabits,
  addHabit,
  editHabit,
  deleteHabit,
  incrementCounter,
  decrementCounter,
  setResetFrequency,
} = habitsSlice.actions;

export default habitsSlice.reducer;
