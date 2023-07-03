import { createBrowserRouter } from "react-router-dom";
import Login from "./dynamic-imports/Login";
import Root from "./dynamic-imports/Root";
import ErrorPage from "./dynamic-imports/ErrorPage";
import LandingPage from "./dynamic-imports/LandingPage";
import Signup from "./dynamic-imports/Signup";
import Dashboard from "./dynamic-imports/Dashboard";
import ProtectedRoute from "./dynamic-imports/ProtectedRoute";
import TeamContent from "./dynamic-imports/TeamContent";
import Teams from "./dynamic-imports/Teams";
import UserProfile from "./dynamic-imports/UserProfile";
import SuspendedRoute from "./SuspendedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SuspendedRoute Component={Root} />,
    errorElement: <SuspendedRoute Component={ErrorPage} />,
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
        ],
      },
      {
        path: "user-profile",
        element: <ProtectedRoute Component={UserProfile} />,
      },
    ],
  },
  { path: "/signup", element: <SuspendedRoute Component={Signup} /> },
  { path: "/login", element: <SuspendedRoute Component={Login} /> },
  { index: true, element: <SuspendedRoute Component={LandingPage} /> },
]);
