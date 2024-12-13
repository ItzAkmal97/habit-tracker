import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import HabitDropdownMenu from "./HabitsDropdownMenu";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import {
  incrementCounter,
  decrementCounter,
  deleteHabit,
} from "../../features/habitsSlice";

const HabitsList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const updateHabitCounter = async (
    habitId: string,
    updatedCounter: { [key: string]: number }
  ) => {
    if (!user) return;

    const habitRef = doc(db, "users", user.uid, "habits", habitId);
    await updateDoc(habitRef, updatedCounter);
  };

  const handleIncreaseCounter = async (habitId: string) => {
    dispatch(incrementCounter({ habitId }));

    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      await updateHabitCounter(habitId, {
        positiveCount: (habit.positiveCount || 0) + 1,
      });
    }
  };

  const handleDecreaseCounter = async (habitId: string) => {
    dispatch(decrementCounter({ habitId }));

    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      await updateHabitCounter(habitId, {
        negativeCount: (habit.negativeCount || 0) + 1,
      });
    }
  };

  // Add method to handle habit deletion
  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      // Delete from Firestore
      const habitRef = doc(db, "users", user.uid, "habits", habitId);
      await deleteDoc(habitRef);

      // Remove from Redux store
      dispatch(deleteHabit(habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const cssClass = " text-gray-600 border-black border-2 border-dotted";

  return (
    <div className="w-full bg-gray-100 p-2 rounded-lg shadow-md">
      {habits.length === 0 && (
        <p className="text-gray-500 text-center">
          Add Habits To Get Started Tracking
        </p>
      )}
      {habits.length > 0 && (
        <div className="w-full">
          <ul>
            {habits.map((habit) => (
              <li key={habit.id} className="p-2 rounded-lg mb-2 bg-gray-300">
                <div className="p-2 rounded-lg mb-2 flex items-center justify-between bg-gray-300">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleIncreaseCounter(habit.id)}
                      className={
                        !habit.positive
                          ? `rounded-full font-bold text-2xl w-8 h-8 ${cssClass}`
                          : `rounded-full font-bold text-2xl text-white bg-gold w-8 h-8`
                      }
                      disabled={!habit.positive}
                    >
                      +
                    </button>
                    <div className="flex flex-col gap-2 justify-center">
                      <span className="text-gray-800 text-lg">
                        {habit.title}
                      </span>
                      {habit.description && (
                        <span className="text-gray-600 text-sm">
                          {habit.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <HabitDropdownMenu
                      habit={habit}
                      onDelete={() => handleDeleteHabit(habit.id)}
                    />
                    <button
                      onClick={() => handleDecreaseCounter(habit.id)}
                      className={
                        habit.positive
                          ? `rounded-full font-bold text-2xl w-8 h-8 ${cssClass}`
                          : `rounded-full font-bold text-2xl text-white bg-gold w-8 h-8`
                      }
                      disabled={habit.positive}
                    >
                      -
                    </button>
                  </div>
                </div>
                <span className="flex justify-end pr-12 text-sm text-gray-700">
                  {habit.positiveCount ?? 0 > 0
                    ? `+${habit.positiveCount}`
                    : `${habit.positiveCount || 0}`}{" "}
                  | {habit.negativeCount || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HabitsList;
