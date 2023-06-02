import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import ErrorPage from "./pages/error/ErrorPage";
import LandingPage from "./pages/landing-page/LandingPage";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./utils/themeProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

function App() {
  return (
  <ThemeProvider theme={theme}>
  <RouterProvider router={router} />
  </ThemeProvider>
  )
}

export default App;
