import { ElementType } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ Component }: { Component: ElementType }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return (
      <>
        <Component />
      </>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default ProtectedRoute;
