import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import HabitDropdownMenu from "./HabitsDropdownMenu";
import { db } from "../../util/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import {
  deleteHabit,
} from "../../features/habitsSlice";

const HabitsList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dispatch = useDispatch();
  const { user } = useAuth();


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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HabitsList;
