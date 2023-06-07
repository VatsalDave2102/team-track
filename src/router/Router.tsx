import { createBrowserRouter } from "react-router-dom";
import Login from "../modules/auth/pages/Login";
import Root from "../modules/root/Root";
import ErrorPage from "../modules/error/ErrorPage";
import LandingPage from "../modules/landing-page/LandingPage";
import Signup from "../modules/auth/pages/Signup";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
         path:'/dashboard',
        element: <ProtectedRoute Component={Dashboard} />,
      },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {  index: true, element: <LandingPage /> },
]);
