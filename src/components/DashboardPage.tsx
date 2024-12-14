import DashboardHeader from "./DashboardHeader";
import Habits from "./Habits Management/Habits";
function DashboardPage() {
  return (
    <div className="h-full w-full flex flex-col bg-blue">
      <DashboardHeader />
      <Habits />
    </div>
  );
}

export default DashboardPage;
