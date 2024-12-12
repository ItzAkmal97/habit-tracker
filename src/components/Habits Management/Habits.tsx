import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addHabit } from "../../features/habitsSlice";
import HabitsList from "./HabitsList";
import { db } from "../../util/firebaseConfig";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";

const Habits: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const dispatch = useDispatch();

  const { user } = useAuth();
  const saveHabit = async (habitId: string, habitData: any) => {
    try {
      if (!user) return;

      const habitRef = doc(
        collection(db, "users", user.uid, "habits"),
        habitId
      );
      await setDoc(habitRef, habitData);
    } catch (error: Error) {
      alert(error.message);
    }
  };

  const fetchHabits = async () => {
    try {
      if (!user) return;

      const habitCollection = collection(db, "users", user.uid, "habits");

      const snapshot = await getDocs(habitCollection);
      const habitsData = snapshot.docs.map((doc) => doc.data());
      return habitsData;
    } catch (error: Error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchAndSetHabits = async () => {
      const fetchedHabits = await fetchHabits();
      if (fetchedHabits) {
        fetchedHabits.forEach((habit) => dispatch(addHabit(habit))); // Sync with Redux
      }
    };
  
    fetchAndSetHabits();
  }, []);
  

  const handleAddHabit = async () => {
    if (input.trim()) {
      const newHabit = {
        id: uuidv4(),
        title: input,
        description: "",
        positive: false,
        negative: false,
        positiveCount: 0,
        negativeCount: 0,
      };
      dispatch(addHabit(newHabit));
      setInput("");
      await saveHabit(newHabit.id, newHabit); // Save habit to Firebase
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
        <HabitsList />
      </div>
    </div>
  );
};

export default Habits;
