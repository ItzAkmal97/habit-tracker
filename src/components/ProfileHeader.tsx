import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { fetchXPLevelData, setXpLevel} from "../features/xpLevelSlice";
import Quotes from "./Quotes Management/Quotes";

const ProfileHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { xp, level, totalXpForNextLevel } = useSelector((state: RootState) => state.xpLevel);
  const googlePhoto = localStorage.getItem("photoURL");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchXPLevelData();
        dispatch(setXpLevel(data));
      } catch (error) {
        console.error("Error fetching XP data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="w-full p-4 md:p-8 bg-gray-300 dark:bg-slate-600">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={googlePhoto ?? ""}
            alt="Profile"
            className="w-16 h-16 rounded-sm object-cover"
          />
        </div>

        {/* User Info & Progress */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          <h2 className="text-xl font-bold">{username ?? ""}</h2>
          <span className="text-sm dark:text-gray-300">Level: {level?.toLocaleString()}</span>
          
          <div className="mt-4 space-y-2 max-w-sm mx-auto md:mx-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">XP</span>
              <span className="text-sm font-medium">
                {xp?.toLocaleString()}/{totalXpForNextLevel?.toLocaleString()}
              </span>
            </div>
            <Progress 
              currentValue={xp} 
              maxValue={totalXpForNextLevel}
              className="w-full"
            />
          </div>
        </div>

        {/* Quote Section */}
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