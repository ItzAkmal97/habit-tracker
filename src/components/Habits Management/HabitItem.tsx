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
import { updateXPAndLevel } from "../../features/xpLevelSlice";
import { incrementTotalGold } from "../../features/rewardSlice";
import ResetTimer from "./ResetTimer";

interface HabitItemProps {
  habit: Habit;
  onDelete: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handlePositive = async () => {
    dispatch(incrementCounter({ habitId: habit.id }));
    dispatch(updateXPAndLevel({ xpGain: 10 }));
    dispatch(incrementTotalGold(parseFloat((Math.random() * 6 + 1).toFixed(2))));

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
    dispatch(updateXPAndLevel({ xpGain: -10 }));

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
      <div className="flex flex-col p-4 bg-white dark:bg-gray-700 mb-2 rounded-lg shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md">
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {habit.title}
              </h3>
              {habit.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 break-words">
                  {habit.description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end ml-4 min-w-[128px]">
              <HabitsDropdownMenu habit={habit} onDelete={onDelete} />
              {habit.resetFrequency && (
                <ResetTimer
                  resetFrequency={habit.resetFrequency}
                  lastResetDate={habit.lastResetDate}
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {habit.positive && (
              <button
                onClick={handlePositive}
                className="flex items-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <CheckCircle className="mr-2" size={18} />
                <span className="font-medium">{habit.positiveCount || 0}</span>
              </button>
            )}

            {habit.negative && (
              <button
                onClick={handleNegative}
                className="flex items-center px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <XCircle className="mr-2" size={18} />
                <span className="font-medium">{habit.negativeCount || 0}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default HabitItem;