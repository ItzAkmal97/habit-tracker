import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { fetchXPLevelData, setXpLevel } from "../features/xpLevelSlice";
import Quotes from "./Quotes Management/Quotes";
import { motion } from "framer-motion";
import avatarImg from "../assets/avatar.png";
import { Skeleton } from "./ui/skeleton";

const ProfileHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { xp, level, totalXpForNextLevel } = useSelector(
    (state: RootState) => state.xpLevel
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const googlePhoto = localStorage.getItem("photoURL");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchXPLevelData();
        dispatch(setXpLevel(data));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching XP data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const totalProgressPercentage = Math.floor((xp / totalXpForNextLevel) * 100);
  const cssClass = totalProgressPercentage > 49 
    ? "text-white dark:text-black" 
    : "text-black dark:text-white";

  return (
    <div className="w-full p-4 md:p-8 bg-gray-300 dark:bg-slate-600">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          {isLoading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <img
              src={googlePhoto ?? avatarImg}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 mx-auto lg:mx-0" />
              <Skeleton className="h-5 w-24 mx-auto lg:mx-0" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{username ?? ""}</h2>
              <span className="text-sm dark:text-gray-300">
                Level: {level?.toLocaleString()}
              </span>
            </>
          )}

          <div className="mt-4 space-y-2 max-w-sm mx-auto lg:mx-0">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">XP</span>
                  <span className="text-sm font-medium">
                    {xp?.toLocaleString()}/{totalXpForNextLevel?.toLocaleString()}
                  </span>
                </div>
                <div className="relative w-full h-4 dark:bg-gray-800 bg-white rounded-full">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(xp / totalXpForNextLevel) * 100}%`,
                      height: "100%",
                    }}
                    transition={{ duration: 0.5 }}
                    className="h-4 dark:bg-gray-200 rounded-full bg-slate-700"
                  >
                    <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-center ${cssClass}`}>
                      {totalProgressPercentage}%
                    </span>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <blockquote className="text-gray-400 italic flex items-center justify-center gap-2">
            <Quotes />
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;