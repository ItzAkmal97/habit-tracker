import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addHabit, setHabits } from "../../features/habitsSlice";
import { Habit } from "../../features/habitsSlice";
import HabitsList from "./HabitsList";
import { db } from "../../util/firebaseConfig";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import Loading from "../Loading";

const Habits: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { user } = useAuth();

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

        const fetchedHabits: Habit[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Habit)
        );

        // Dispatch fetched habits to Redux store
        dispatch(setHabits(fetchedHabits));
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
        positive: false,
        negative: false,
        positiveCount: 0,
        negativeCount: 0,
      };

      // Dispatch to Redux and save to Firestore
      dispatch(addHabit(newHabit));
      setInput("");
      await saveHabit(newHabit.id, newHabit);
    }
  };

  return (
    <div className="flex flex-col gap-4 m-4 justify-center">
      <h1 className="text-start mt-4 text-2xl text-white">Habits</h1>
      <div className="flex flex-col gap-2 items-start bg-slate-600 p-2 rounded">
        <div className="w-full rounded flex gap-2">
          <input
            placeholder="Add a Habit"
            className="w-full h-12 rounded-md border-none px-2 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
          />
        </div>
        {isLoading ? <Loading isLoading={isLoading} cssClassName="w-full bg-white h-20"/> : <HabitsList />}
      </div>
    </div>
  );
};

export default Habits;
