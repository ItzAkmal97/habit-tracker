import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
// import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Login from "./pages/Login";
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import Loading from "./components/Loading";
import { useAuth } from "./util/useAuth";
import { ThemeProvider } from "./components/themes/theme-provider";

function App() {


  const isLocalLoggedIn = localStorage.getItem("isLoggedIn");

  const {isLoading} = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error isLoggedIn={isLocalLoggedIn? true : false} />,
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
            <ProtectedRoute isLoggedIn={isLocalLoggedIn? true : false}>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Loading isLoading={isLoading} cssClassName="min-h-screen" />
      {!isLoading && <RouterProvider router={router} />}
      </ThemeProvider>
    </>
  );
}

export default App;
