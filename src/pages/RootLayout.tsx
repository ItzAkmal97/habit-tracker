import { Outlet } from "react-router";

function RootLayout() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Outlet />
    </main>
  );
}

export default RootLayout;
