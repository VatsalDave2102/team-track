import { createBrowserRouter } from "react-router-dom";
import Login from "../modules/auth/pages/Login";
import Root from "../modules/root/Root";
import ErrorPage from "../modules/error/ErrorPage";
import LandingPage from "../modules/landing-page/LandingPage";
import Signup from "../modules/auth/pages/Signup";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import TeamContent from "../modules/team/TeamContent";
import Teams from "../modules/team/Teams";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute Component={Dashboard} />,
        children: [
          {
            index: true,
            element: <ProtectedRoute Component={Teams} />,
          },
          { path: "teams/:teamId", element: <TeamContent /> },
          {path: 'create-team' }
        ],
      },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { index: true, element: <LandingPage /> },
]);
