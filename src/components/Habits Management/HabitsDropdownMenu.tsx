import React, { useState } from "react";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import { Habit } from "../../features/habitsSlice";
import HabitsModal from "./HabitsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "../ui/alert-dialog";

interface HabitDropdownMenuProps {
  habit: Habit;
  onDelete: () => void;
}

const HabitsDropdownMenu: React.FC<HabitDropdownMenuProps> = ({
  habit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={handleEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> <span>Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={handleDelete} 
            className="cursor-pointer text-destructive focus:text-destructive dark:text-red-500 dark:focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="w-[400px] bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this habit?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setIsAlertOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HabitsModal
        habit={habit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HabitsDropdownMenu;