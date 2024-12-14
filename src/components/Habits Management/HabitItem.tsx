import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Habit } from "../../features/habitsSlice";
import { CheckCircle, XCircle } from "lucide-react";
import HabitsDropdownMenu from "./HabitsDropdownMenu";
import { useDispatch } from "react-redux";
import { incrementCounter, decrementCounter } from "../../features/habitsSlice";

interface HabitItemProps {
  habit: Habit;
  index: number;
  moveHabit: (dragIndex: number, hoverIndex: number) => void;
  onDelete: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  index,
  moveHabit,
  onDelete,
}) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag({
    type: "HABIT",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "HABIT",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveHabit(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handlePositive = () => {
    dispatch(incrementCounter({ habitId: habit.id }));
  };

  const handleNegative = () => {
    dispatch(decrementCounter({ habitId: habit.id }));
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        flex items-center justify-between 
        p-3 bg-white rounded-md mb-2 
        transition-all duration-200 
        cursor-grab
        active:cursor-grabbing
    ${isDragging ? "opacity-50 scale-105 shadow-lg" : "opacity-100"}
  `}
    >
      <div className="flex-grow mr-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{habit.title}</h3>
          <HabitsDropdownMenu habit={habit} onDelete={onDelete} />
        </div>

        {habit.description && (
          <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
        )}

        <div className="flex items-center mt-2 space-x-4">
          {habit.positive && (
            <button
              onClick={handlePositive}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <CheckCircle className="mr-2" size={20} />
              <span>{habit.positiveCount || 0}</span>
            </button>
          )}

          {habit.negative && (
            <button
              onClick={handleNegative}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <XCircle className="mr-2" size={20} />
              <span>{habit.negativeCount || 0}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
