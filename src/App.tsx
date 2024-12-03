import { createBrowserRouter, RouterProvider } from "react-router";
import Signup from "./pages/Signup";
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Login from "./pages/Login";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        { path: "/home", element: <Signup /> },
        { path: "/login", element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
