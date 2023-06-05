import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./modules/root/Root";
import ErrorPage from "./modules/error/ErrorPage";
import LandingPage from "./modules/landing-page/LandingPage";
import Signup from "./modules/auth/pages/signup/Signup";
import Login from "./modules/auth/pages/login/Login";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./utils/themeProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [{ path: "", element: <LandingPage /> }],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  { path: "login", element: <Login /> },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
