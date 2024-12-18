import React, { useState } from "react";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import { Reward } from "../../features/rewardSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import RewardsModal from "./RewardsModal";

interface HabitDropdownMenuProps {
  reward: Reward;
  onDelete: () => void;
}

const RewardsDropdownMenu: React.FC<HabitDropdownMenuProps> = ({
  reward,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
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
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onDelete}
            className="cursor-pointer text-destructive focus:text-destructive dark:text-red-500 dark:focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RewardsModal
        reward={reward}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default RewardsDropdownMenu;