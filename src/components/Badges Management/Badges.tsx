import React from "react";
import BadgesModal from "./BadgesModal";
import BADGESDATA from "./Data";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Progress } from "@/components/ui/progress";

const Badges: React.FC = () => {
  const { badges } = useSelector((state: RootState) => state.badge);

  const progressPercentage =
    (badges.length / BADGESDATA.progression.length) * 100;

  return (
    <div className="flex flex-col mx-4 my-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Badges
        </h1>
      </div>
      <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-800/50 rounded-lg p-4 min-h-[calc(40vh-theme(space.16))]">
        <BadgesModal totalBadges={BADGESDATA.progression} />
        <Progress
          value={progressPercentage}
          className="w-full h-2"
          currentValue={badges.length}
          maxValue={BADGESDATA.progression.length}
        />
      </div>
    </div>
  );
};

export default Badges;
