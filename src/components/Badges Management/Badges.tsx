import React from "react";
import BadgesModal from "./BadgesModal";
import { motion } from "framer-motion";
import BADGESDATA from "./Data";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Badges: React.FC = () => {

  const {badges} = useSelector((state: RootState) => state.badge);

  return (
    <div className="flex flex-col mx-4 my-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Badges
        </h1>
      </div>
      <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-800/50 rounded-lg p-4 min-h-[calc(40vh-theme(space.16))]">
        <BadgesModal totalBadges={BADGESDATA.progression} />
        <div className="dark:bg-gray-900 bg-white">
          <motion.div
            initial={{ width: "0%" }}
            animate={{
              width: `${(badges.length / BADGESDATA.progression.length) * 100}%`,
              height: "12px",
            }}
            transition={{ duration: "0.5s", ease: "easeInOut" }}
            className=" dark:bg-gray-200 bg-slate-700 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Badges;
