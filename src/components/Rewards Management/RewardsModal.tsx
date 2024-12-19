import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
import { editRewards, Reward } from "@/features/rewardSlice";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteDoc } from "firebase/firestore";
import { deleteRewards } from "@/features/rewardSlice";

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward;
}

const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  reward,
}) => {
  const [title, setTitle] = useState(reward.title);
  const [notes, setNotes] = useState(reward.notes);
  const [cost, setCost] = useState(reward.cost);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const { user } = useAuth();

  const handleDeleteReward = async (rewardId: string) => {
    if (user) {
      try {
        const rewardRef = doc(db, "users", user.uid, "rewards", rewardId);
        await deleteDoc(rewardRef);
        dispatch(deleteRewards(rewardId));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error deleting rewards", error);
        }
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const rewardRef = doc(db, "users", user?.uid, "rewards", reward.id);
      await updateDoc(rewardRef, {
        title,
        notes,
        cost,
      });

      dispatch(
        editRewards({
          id: reward.id,
          title,
          notes,
          cost,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving reward: ", error.message);
      }
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center mt-4">
          <DialogTitle className="dark:text-gray-200">Edit Reward</DialogTitle>
          <div className="flex ml-auto gap-2">
            <Button variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={isSubmitting || title.trim() === "" || cost === 0}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right dark:text-gray-300">
              Title*
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right dark:text-gray-300">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3 dark:bg-black dark:text-gray-200"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right dark:text-gray-300">
              Cost
            </label>
            <Input
              id="notes"
              type="number"
              value={cost}
              min={0}
              max={200}
              onChange={(e) => setCost(Number(e.target.value))}
              className="col-span-3 dark:bg-black dark:text-gray-200"
            />
          </div>

          <div className="flex justify-center mt-4">
            <Button
              variant="destructive"
              onClick={() => handleDeleteReward(reward.id)}
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

export default RewardsModal;
