import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Login from "./pages/Login";
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { RootState } from "./store/store";
import Loading from "./components/Loading";
import { useAuth } from "./util/useAuth";

function App() {
  const { isLoggedIn } = useSelector(
    (state: RootState) => state.authentication
  );

  const isLocalLoggedIn = localStorage.getItem("isLoggedIn");

  const {isLoading} = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: isLocalLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
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

  return (
    <>
      <Loading isLoading={isLoading} />
      {!isLoading && <RouterProvider router={router} />}
    </>
  );
}

export default App;
