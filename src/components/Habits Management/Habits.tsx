import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  addHabit,
  setHabits,
  reorderHabits,
  deleteHabit,
  Habit,
} from "../../features/habitsSlice";
import HabitItem from "./HabitItem"; // Import the new component
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
import HabitsModal from "./HabitsModal";

const Habits: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHabitsModalOpen, setIsHabitsModalOpen] = useState<boolean>(false);
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
        order: habits.length,
      };


      setIsHabitsModalOpen(true);
      dispatch(addHabit(newHabit));
      setInput("");
      await saveHabit(newHabit.id, newHabit);
    }
  };

  const moveHabit = async (dragIndex: number, hoverIndex: number) => {
    dispatch(
      reorderHabits({ sourceIndex: dragIndex, destinationIndex: hoverIndex })
    );

    if (user) {
      try {
        const updatedHabits = [...habits];
        const [reorderedHabit] = updatedHabits.splice(dragIndex, 1);
        updatedHabits.splice(hoverIndex, 0, reorderedHabit);

        const batch = updatedHabits.map((habit, index) => {
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
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4 m-4 justify-center max-w-md mx-auto">
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
          {isHabitsModalOpen && (
            <HabitsModal
              onClose={() => setIsHabitsModalOpen(false)}
              isOpen={isHabitsModalOpen}
              habit={habits[habits.length - 1]}
            />
          )}
          {isLoading ? (
            <Loading
              isLoading={isLoading}
              cssClassName="w-full bg-white h-20"
            />
          ) : (
            <div className="w-full">
              {habits.map((habit, index) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  index={index}
                  moveHabit={moveHabit}
                  onDelete={() => handleDeleteHabit(habit.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Habits;
