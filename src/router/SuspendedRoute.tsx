import { ElementType, Suspense } from "react";
import Loader from "./Loader";

const SuspendedRoute = ({ Component }: { Component: ElementType }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export default SuspendedRoute;
