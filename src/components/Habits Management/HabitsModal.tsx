import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editHabit, deleteHabit, Habit} from "../../features/habitsSlice";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteDoc } from "firebase/firestore";

interface HabitsModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
}

const HabitsModal: React.FC<HabitsModalProps> = ({
  habit,
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(habit.title);
  const [notes, setNotes] = useState<string>(habit.description);
  const [habitType, setHabitType] = useState<string>(
    habit.positive && !habit.negative ? 'positive' : 
    !habit.positive && habit.negative ? 'negative' : 
    'both'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { user } = useAuth();


    



  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleHabitTypeChange = (value: string) => {
    setHabitType(value);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      // Delete from Firestore
      const habitRef = doc(db, "users", user.uid, "habits", habitId);
      await deleteDoc(habitRef);

      // Remove from Redux store
      dispatch(deleteHabit(habitId));
      onClose();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleSave = async () => {
    if (user) {
      setIsSubmitting(true);
      const habitRef = doc(db, "users", user.uid, "habits", habit.id);
      
      const isPositive = habitType === 'positive' || habitType === 'both';
      const isNegative = habitType === 'negative' || habitType === 'both';

      await updateDoc(habitRef, {
        title,
        description: notes,
        positive: isPositive,
        negative: isNegative,
      });

      dispatch(
        editHabit({
          id: habit.id,
          title,
          description: notes,
          positive: isPositive,
          negative: isNegative,
        })
      );

      setIsSubmitting(false);
      onClose();
      
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center mt-4">
          <DialogTitle className="dark:text-gray-200">Edit Habit</DialogTitle>
          <div className="flex ml-auto gap-2">
          <Button 
            variant='destructive'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant='default'
            onClick={handleSave} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label 
              htmlFor="title" 
              className="text-right dark:text-gray-300"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label 
              htmlFor="notes" 
              className="text-right dark:text-gray-300"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              className="col-span-3 dark:bg-black dark:text-gray-200"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label 
              htmlFor="habit-type" 
              className="text-right dark:text-gray-300"
            >
              Type
            </label>
            <Select value={habitType} onValueChange={handleHabitTypeChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select habit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="both">Both Positive and Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label 
              htmlFor="reset-counter" 
              className="text-right dark:text-gray-300"
            >
              Reset
            </label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select reset frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button
              variant="destructive"
              onClick={() => handleDeleteHabit(habit.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete this Habit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitsModal;