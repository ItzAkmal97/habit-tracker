import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editHabit, deleteHabit, Habit, ResetCounter } from "../../features/habitsSlice";
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
        negative: isNegative
      });

      dispatch(
        editHabit({
          id: habit.id,
          title,
          description: notes,
          positive: isPositive,
          negative: isNegative,
          resetCounter: habit.resetCounter as ResetCounter,
        })
      );

      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div
      className={`fixed -top-0 z-50 inset-0 overflow-y-auto backdrop-blur-sm flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Habit</h3>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="default"
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-[#ffc400] text-black rounded-md px-4 py-2 hover:bg-[#ffb700]"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium text-gray-700">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 block w-full border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block font-medium text-gray-700">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
            ></Textarea>
          </div>
          <div>
            <label htmlFor="habit-type" className="block font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select value={habitType} onValueChange={handleHabitTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select habit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="both">Both Positive and Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="reset-counter" className="block font-medium text-gray-700 mb-1">
              Reset Counter
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select reset frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => dispatch(deleteHabit(habit.id))}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete this Habit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsModal;