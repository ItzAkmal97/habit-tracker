import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import HabitDropdownMenu from "./HabitsDropdownMenu";
import { db } from "../../util/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import { deleteHabit } from "../../features/habitsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center dark:text-gray-200">
          My Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        {habits.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            Add Habits To Get Started Tracking
          </div>
        )}
        {habits.length > 0 && (
          <ScrollArea className="h-[400px] w-full">
            <ul className="space-y-2">
              {habits.map((habit) => (
                <li 
                  key={habit.id} 
                  className={cn(
                    "bg-secondary/50 hover:bg-secondary rounded-lg",
                    "dark:bg-secondary/30 dark:hover:bg-secondary/50",
                    "transition-colors duration-200"
                  )}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {habit.title}
                      </span>
                      {habit.description && (
                        <span className="text-muted-foreground text-sm">
                          {habit.description}
                        </span>
                      )}
                    </div>
                    <HabitDropdownMenu
                      habit={habit}
                      onDelete={() => handleDeleteHabit(habit.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsList;