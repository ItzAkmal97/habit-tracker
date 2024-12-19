import DashboardHeader from "./DashboardHeader";
import Habits from "./Habits Management/Habits";
import ProfileHeader from "./ProfileHeader";
import Rewards from "./Rewards Management/Rewards";
function DashboardPage() {
  return (
    <section className="min-h-screen flex flex-col dark:bg-gray-900">
      <DashboardHeader />
      <ProfileHeader />
      <div className="grid sm:grid-cols-2 max-w-7xl mt-4">
        <Habits />
        <Rewards />
      </div>
    </section>
  );
}

export default DashboardPage;
