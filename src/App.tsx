import { createBrowserRouter, RouterProvider } from "react-router";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Login from "./pages/Login";
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { RootState } from "./store/store";

function App() {
  const { isLoggedIn } = useSelector(
    (state: RootState) => state.authentication
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        { path: "/", element: <Signup /> },
        { path: "/login", element: <Login /> },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
