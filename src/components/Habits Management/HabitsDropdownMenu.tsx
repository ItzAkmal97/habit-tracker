import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import { editHabit, deleteHabit } from "../../features/habitsSlice";
import { db } from "../../util/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../util/useAuth";
// import Modal from "../Modal";

interface HabitProps {
  id: string;
  title: string;
  description: string;
  positive?: boolean;
  negative?: boolean;
}

const HabitDropdownMenu: React.FC<{ habit: HabitProps }> = ({ habit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const {user} = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = async (updatedHabit: HabitProps) => {
    // Placeholder for edit logic - you might want to open a modal or navigate to an edit form
    // setIsModalOpen(true);
    const habitRef = doc(db, "users", user.uid, "habits", updatedHabit.id);
    await updateDoc(habitRef, { title: updatedHabit.title });
    dispatch(editHabit(updatedHabit));
    setIsOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteHabit(habit.id));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
      >
        <EllipsisVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* <Modal onClose={() => setIsModalOpen(false)}></Modal> */}

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
          <ul className="py-1">
            <li
              onClick={() => handleEdit(habit)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </li>
            <li
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HabitDropdownMenu;
