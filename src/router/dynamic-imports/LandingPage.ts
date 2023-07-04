import { lazy } from "react";

const LandingPage = lazy(
  () => import("../../modules/layout/pages/LandingPage")
);
export default LandingPage;
