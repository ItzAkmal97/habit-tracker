import React from "react";
import { Reorder } from "framer-motion";
import { Habit } from "../../features/habitsSlice";
import { CheckCircle, XCircle } from "lucide-react";
import HabitsDropdownMenu from "./HabitsDropdownMenu";
import { useDispatch } from "react-redux";
import { incrementCounter, decrementCounter } from "../../features/habitsSlice";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";

interface HabitItemProps {
  habit: Habit;
  onDelete: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handlePositive = async () => {
    dispatch(incrementCounter({ habitId: habit.id }));
    try {
      if (!user) return;

      const habitRef = doc(db, "users", user.uid, "habits", habit.id);
      await updateDoc(habitRef, {
        positiveCount: (habit.positiveCount || 0) + 1,
      });
    } catch (error) {
      if (error instanceof Error) console.error(error);
    }
  };

  const handleNegative = async () => {
    dispatch(decrementCounter({ habitId: habit.id }));
    try {
      if (!user) return;

      const habitRef = doc(db, "users", user.uid, "habits", habit.id);
      await updateDoc(habitRef, {
        negativeCount: (habit.negativeCount || 0) - 1,
      });
    } catch (error) {
      if (error instanceof Error) console.error(error);
    }
  };

  return (
    <Reorder.Item value={habit} id={habit.id} className="list-none">
      <div
        className="
        flex items-center justify-between 
        p-3 bg-white dark:bg-gray-700 rounded-md mb-2 
        transition-all duration-200 
        cursor-grab
        active:cursor-grabbing
      "
      >
        <div className="flex-grow mr-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">{habit.title}</h3>
            <HabitsDropdownMenu habit={habit} onDelete={onDelete} />
          </div>

          {habit.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{habit.description}</p>
          )}

          <div className="flex items-center mt-2 space-x-4">
            {habit.positive && (
              <button
                onClick={handlePositive}
                className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              >
                <CheckCircle className="mr-2" size={20} />
                <span>{habit.positiveCount || 0}</span>
              </button>
            )}

            {habit.negative && (
              <button
                onClick={handleNegative}
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <XCircle className="mr-2" size={20} />
                <span>{habit.negativeCount || 0}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default HabitItem;