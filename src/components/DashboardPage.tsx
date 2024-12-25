import DashboardHeader from "./DashboardHeader";
import Habits from "./Habits Management/Habits";
import ProfileHeader from "./ProfileHeader";
import Rewards from "./Rewards Management/Rewards";
import Badges from "./Badges Management/Badges";
function DashboardPage() {
  return (
    <section className="min-h-screen flex flex-col dark:bg-gray-900">
      <DashboardHeader />
      <ProfileHeader />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Habits />
        <Rewards />
        <Badges />
      </div>
    </section>
  );
}

export default DashboardPage;
