import React, { useState } from "react";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import { Habit } from "../../features/habitsSlice";
import HabitsModal from "./HabitsModal";

interface HabitDropdownMenuProps {
  habit: Habit;
  onDelete: () => void;
}

const HabitDropdownMenu: React.FC<HabitDropdownMenuProps> = ({
  habit,
  onDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
      >
        <EllipsisVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
          <ul className="py-1">
            <li
              onClick={handleEdit}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </li>
            <li
              onClick={onDelete}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </li>
          </ul>
          <HabitsModal
            habit={habit}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setIsDropdownOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HabitDropdownMenu;
