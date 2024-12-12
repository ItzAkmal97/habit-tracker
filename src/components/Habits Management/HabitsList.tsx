import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import HabitDropdownMenu from "./HabitsDropdownMenu";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";

interface HabitsCounter {
  positive: number;
  negative: number;
}

const HabitsList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);

  const [habitsCounter, setHabitsCounter] = useState<
    Record<string, HabitsCounter>
  >({});

  const {user} = useAuth();

  

  const updateHabitCounter = async (habitId: string, updatedCounter: any) => {
    if (!user) return;

    const habitRef = doc(db, "users", user.uid, "habits", habitId);
    await updateDoc(habitRef, updatedCounter);
  };

  const handleIncreaseCounter = async (habitId: string) => {
    const updatedCounters = {
      ...habitsCounter[habitId],
      positive: (habitsCounter[habitId]?.positive || 0) + 1,
    };
    setHabitsCounter((prev) => ({ ...prev, [habitId]: updatedCounters }));
    await updateHabitCounter(habitId, { positiveCount: updatedCounters.positive });
  };
  
  const handleDecreaseCounter = async (habitId: string) => {
    const updatedCounters = {
      ...habitsCounter[habitId],
      negative: (habitsCounter[habitId]?.negative || 0) + 1,
    };
    setHabitsCounter((prev) => ({ ...prev, [habitId]: updatedCounters }));
    await updateHabitCounter(habitId, { negativeCount: updatedCounters.negative });
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
                    <button
                      onClick={() => handleIncreaseCounter(habit.id)}
                      className="rounded-full font-bold text-2xl text-white bg-gold w-8 h-8"
                    >
                      +
                    </button>

                    <span className="text-gray-800 text-lg">{habit.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HabitDropdownMenu habit={habit} />
                    <button
                      onClick={() => handleDecreaseCounter(habit.id)}
                      className="rounded-full font-bold text-2xl text-white bg-gold w-8 h-8"
                    >
                      -
                    </button>
                  </div>
                </div>
                <span className="flex justify-end pr-12 text-sm text-gray-700">
                  {habitsCounter[habit.id]?.positive > 0
                    ? `+${habitsCounter[habit.id]?.positive}`
                    : `${habitsCounter[habit.id]?.positive || 0}`}{" "}
                  | {habitsCounter[habit.id]?.negative || 0}
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
