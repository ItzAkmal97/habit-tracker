import { Outlet } from "react-router";


function RootLayout() {
  return (
    <main className="min-h-screen bg-white">
      <Outlet />
    </main>
  );
}

export default RootLayout;
