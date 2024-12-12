import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Habit {
  title: string;
  description: string;
  id: string;
  positive?: boolean;
  negative?: boolean;
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
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
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
        description: string 
      }>
    ) => {
      const { id, title, description } = action.payload;
      const habit = state.habits.find((habit) => habit.id === id);
      if (habit) {
        habit.title = title;
        habit.description = description;
      }
    },
  },
});

export const { addHabit, editHabit, deleteHabit } = habitsSlice.actions;

export default habitsSlice.reducer;