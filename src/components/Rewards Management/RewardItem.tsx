import React from "react";
import { Reorder } from "framer-motion";
import { Reward } from "../../features/rewardSlice";
import RewardsDropdownMenu from "./RewardsDropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { decrementTotalGold } from "../../features/rewardSlice";
import { RootState } from '../../store/store';
import { 
  Toast, 
  ToastProvider, 
  ToastViewport, 
  ToastTitle, 
  ToastClose 
} from "../ui/toast";

interface RewardItemProps {
  onDelete: () => void;
  reward: Reward;
}

const RewardItem: React.FC<RewardItemProps> = ({ onDelete, reward }) => {
  const dispatch = useDispatch();
  const { totalGold } = useSelector((state: RootState) => state.reward);
  const [showToast, setShowToast] = React.useState(false);

  const handleGoldCalc = () => {
    const rewardCost = reward.cost ?? 0;

    if (totalGold < rewardCost) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    dispatch(decrementTotalGold(rewardCost));
  };

  return (
    <>
    <ToastProvider>
      <Reorder.Item value={reward} id={reward.id} className="list-none">
        <div
          className="p-3 bg-white dark:bg-gray-700 mb-2 
          transition-all duration-200 
          cursor-grab
          active:cursor-grabbing
        "
        >
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {reward.title}
                </h3>
                {reward.notes && (
                  <span
                    className="
                  text-gray-600 dark:text-gray-300 text-sm mt-1 
                  break-all whitespace-normal block w-full
                "
                  >
                    {reward.notes}
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <RewardsDropdownMenu reward={reward} onDelete={onDelete} />
                <Button
                  onClick={handleGoldCalc}
                  variant="default"
                  className="dark:bg-gray-600 dark:hover:bg-slate-500 h-full bg-gray-200 hover:bg-gray-300"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                      width="40"
                      height="40"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="gold"
                        stroke="darkgoldenrod"
                        strokeWidth="10"
                      />

                      <polygon
                        points="100,30 120,80 175,80 130,115 150,170 100,140 50,170 70,115 25,80 80,80"
                        fill="orange"
                        stroke="darkorange"
                        strokeWidth="5"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300 font-medium break-all whitespace-normal block">
                      {reward.cost}
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reorder.Item>

      {showToast && (
        <Toast variant="destructive">
          <div className="grid gap-1">
            <ToastTitle>Not Enough Gold</ToastTitle>
          </div>
          <ToastClose onClick={() => setShowToast(false)} />
        </Toast>
      )}
      <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default RewardItem;