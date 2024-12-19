import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Reorder } from "framer-motion";
import {
  addHabit,
  setHabits,
  deleteHabit,
  Habit,
  checkAndResetHabits,
} from "../../features/habitsSlice";
import HabitItem from "./HabitItem";
import { db } from "../../util/firebaseConfig";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import Loading from "../Loading";
import { RootState } from "../../store/store";
import { Input } from "../ui/input";
import { addDays } from "date-fns";

const Habits: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const habits = useSelector((state: RootState) => state.habits.habits);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const habitCollection = collection(db, "users", user.uid, "habits");
        const snapshot = await getDocs(habitCollection);

        const fetchedHabits: Habit[] = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Habit)
          )
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // Check and reset habits based on their frequency
        const updatedHabits = checkAndResetHabits(fetchedHabits);
        dispatch(setHabits(updatedHabits));

        // Update Firestore with reset habits
        if (user) {
          const batch = updatedHabits.map((habit) => {
            const habitRef = doc(db, "users", user.uid, "habits", habit.id);
            return updateDoc(habitRef, {
              positiveCount: habit.positiveCount,
              negativeCount: habit.negativeCount,
              lastResetDate: habit.lastResetDate,
            });
          });
          await Promise.all(batch);
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
      setIsLoading(false);
    };

    fetchHabits();
  }, [user, dispatch]);

  const saveHabit = async (habitId: string, habitData: Habit) => {
    try {
      if (!user) return;

      const habitRef = doc(
        collection(db, "users", user.uid, "habits"),
        habitId
      );
      await setDoc(habitRef, habitData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving habit: ", error.message);
      }
    }
  };

  const handleAddHabit = async () => {
    if (input.trim()) {
      const newHabit: Habit = {
        id: uuidv4(),
        title: input,
        description: "",
        positive: true,
        negative: true,
        positiveCount: 0,
        negativeCount: 0,
        order: 0,
        resetFrequency: "Daily",
        lastResetDate: addDays(new Date(), -1).toISOString(),
      };

      dispatch(addHabit(newHabit));
      setInput("");
      await saveHabit(newHabit.id, newHabit);
    }
  };

  const handleReorder = async (newOrder: Habit[]) => {
    // Update local state
    dispatch(setHabits(newOrder));

    if (user) {
      try {
        // Update order in Firestore
        const batch = newOrder.map((habit, index) => {
          const habitRef = doc(db, "users", user.uid, "habits", habit.id);
          return updateDoc(habitRef, { order: index });
        });

        await Promise.all(batch);
      } catch (error) {
        console.error("Error updating habit order:", error);
      }
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (user) {
      try {
        // Delete from Firestore
        const habitRef = doc(db, "users", user.uid, "habits", habitId);
        await deleteDoc(habitRef);

        // Delete from Redux store
        dispatch(deleteHabit(habitId));
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  return (
    <div className="flex flex-col  mx-4 my-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Habits
        </h1>
      </div>

      <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-800/50 rounded-lg p-4 min-h-[calc(70vh-theme(space.16))]">
        <div className="flex gap-2 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          <Input
            placeholder="Add a Habit"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loading
              isLoading={isLoading}
              cssClassName="w-full bg-white dark:bg-gray-900 p-10 rounded-lg"
            />
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={habits}
            onReorder={handleReorder}
            className="w-full"
          >
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onDelete={() => handleDeleteHabit(habit.id)}
              />
            ))}
            {habits.length === 0 && (
              <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <p className="font-bold">These are your Habits</p>
                  <span className="text-sm text-center font-semibold">
                    Habits don't have a rigid schedule. You can check them off
                    multiple times per day.
                  </span>
                </div>
              </div>
            )}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};

export default Habits;
