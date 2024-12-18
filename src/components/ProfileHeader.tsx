import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { fetchXPLevelData, updateXPAndLevel } from "../features/xpLevelSlice";

const ProfileHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { xp, level, totalXpForNextLevel } = useSelector((state: RootState) => state.xpLevel);
  const googlePhoto = localStorage.getItem("photoURL");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchXPLevelData();
        // Dispatch the loaded data to update the state
        dispatch(updateXPAndLevel({ xpGain: data.xp }));
      } catch (error) {
        console.error("Error fetching XP data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4 p-4 dark:bg-slate-600 bg-gray-300">
      <div className="flex-shrink-0">
        <img
          src={googlePhoto ?? ""}
          alt="Profile"
          className="w-16 h-16 rounded-sm"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold">{username ?? ""}</h2>
        <span className="text-sm dark:text-gray-300">Level: {level.toLocaleString()}</span>
        <div className="mt-2 space-y-2 md:w-1/2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">XP</span>
            <span className="text-sm font-medium">
              {xp.toLocaleString()}/{totalXpForNextLevel.toLocaleString()}
            </span>
          </div>
          <Progress 
            currentValue={xp} 
            maxValue={totalXpForNextLevel}
          />
        </div>
      </div>
      <div className="flex-1 text-center">
        <blockquote className="text-gray-400 italic">
          Motivational Quotes
        </blockquote>
      </div>
    </div>
  );
};

export default ProfileHeader;