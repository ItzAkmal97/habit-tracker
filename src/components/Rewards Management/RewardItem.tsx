import React from "react";
import { Reorder } from "framer-motion";
import { toast } from "sonner";
import { Reward } from "../../features/rewardSlice";
import RewardsDropdownMenu from "./RewardsDropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { decrementTotalGold } from "../../features/rewardSlice";
import { RootState } from "../../store/store";

const GoldCoinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="24"
    height="24"
    className="shrink-0"
  >
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="10"
    />
    <polygon
      points="100,30 120,80 175,80 130,115 150,170 100,140 50,170 70,115 25,80 80,80"
      fill="#FFA500"
      stroke="#FF8C00"
      strokeWidth="5"
    />
  </svg>
);

interface RewardItemProps {
  onDelete: () => void;
  reward: Reward;
}

const RewardItem: React.FC<RewardItemProps> = ({ onDelete, reward }) => {
  const dispatch = useDispatch();
  const { totalGold } = useSelector((state: RootState) => state.reward);

  const handleGoldCalc = () => {
    const rewardCost = reward.cost ?? 0;

    if (totalGold < rewardCost) {
      toast.error("Not enough gold", {
        duration: 3000,
        style: {
          backgroundColor: "#5BC0DE",
          color: "white",
          border: 0,
          width: "50%",
          position: "absolute",
          top: 10,
          right: 0,
        },
      });
    } else if (totalGold >= rewardCost) {
      toast.success(`You spent ${rewardCost} gold`, {
        duration: 3000,
        style: {
          backgroundColor: "red",
          color: "white",
          border: 0,
          width: "50%",
          position: "absolute",
          top: 10,
          right: 0,
        },
        icon: <GoldCoinIcon />,
      });
      dispatch(decrementTotalGold(rewardCost));
    }
  };

  return (
    <>
      <Reorder.Item value={reward} id={reward.id} className="list-none">
        <div className="flex flex-col p-4 bg-white dark:bg-gray-700 mb-2 rounded-lg shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md">
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {reward.title}
                </h3>
                {reward.notes && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 break-words">
                    {reward.notes}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 ml-4">
                <RewardsDropdownMenu reward={reward} onDelete={onDelete} />
                <Button
                  onClick={handleGoldCalc}
                  variant="default"
                  className="relative group px-3 py-2 h-auto bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-700"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                      width="32"
                      height="32"
                      className="transition-transform group-hover:scale-110"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="#FFD700"
                        stroke="#B8860B"
                        strokeWidth="10"
                      />
                      <polygon
                        points="100,30 120,80 175,80 130,115 150,170 100,140 50,170 70,115 25,80 80,80"
                        fill="#FFA500"
                        stroke="#FF8C00"
                        strokeWidth="5"
                      />
                    </svg>
                    <span className="text-amber-700 dark:text-amber-300 font-medium text-sm">
                      {reward.cost}
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reorder.Item>
    </>
  );
};

export default RewardItem;
