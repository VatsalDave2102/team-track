import { ElementType, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ Component }: { Component: ElementType }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return (
      <Suspense fallback={<Loader />}>
        <Component />
      </Suspense>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default ProtectedRoute;
