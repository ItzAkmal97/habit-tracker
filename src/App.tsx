import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Login from "./pages/Login";
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import Loading from "./components/Loading";
import PaymentPage from "./pages/PaymentPage";
import { useAuth } from "./util/useAuth";
import { ThemeProvider } from "./components/themes/theme-provider";
import { selectIsLoggedIn } from "./features/authenticationSlice";

function App() {

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {isLoading} = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error isLoggedIn={isLoggedIn? true : false} />,
      children: [
        {
          path: "/",
          element: isLoggedIn ? (
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
            <ProtectedRoute isLoggedIn={isLoggedIn? true : false}>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payment",
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn? true : false}>
              <PaymentPage />
            </ProtectedRoute>
          )
        }
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
