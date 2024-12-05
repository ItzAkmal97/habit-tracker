import DashboardHeader from "./DashboardHeader";
function DashboardPage() {
  return (
    <div className="h-screen flex flex-col bg-blue">
      <DashboardHeader />
      <h1 className="text-3xl text-center text-white">Welcome to Dashboard</h1>
    </div>
  );
}

export default DashboardPage;
