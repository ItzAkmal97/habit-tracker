import { Progress } from "@/components/ui/progress";

const ProfileHeader: React.FC = () => {
  const googlePhoto = localStorage.getItem("photoURL");
  const username = localStorage.getItem("username");
  const xp = 12;
  const level = 12;

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
        <div className="mt-2 space-y-2 md:w-1/2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">XP</span>
            <span className="text-sm font-medium">
              {xp.toLocaleString()}/100
            </span>
          </div>
          <Progress value={xp} max={100} className=""/>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">level</span>
            <span className="text-sm font-medium">
              {level.toLocaleString()}
            </span>
          </div>
          <Progress value={level} max={100} />
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
