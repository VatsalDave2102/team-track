import { lazy } from "react";

const LandingPage = lazy(
  () => import("../../modules/landing-page/LandingPage")
);
export default LandingPage;
