import { Outlet } from "react-router-dom";
import NavbarComponent from "../layout/components/navbar/NavbarComponent";
import { useAppSelector } from "../../app/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

const Root = () => {
  const currentUser = useAppSelector((state) => state.root.auth.user);

  return (
    <>
      <NavbarComponent />
      <Outlet />
      {currentUser ? null : (
        <Backdrop open={true}>
          <CircularProgress />
        </Backdrop>
      )}
    </>
  );
};

export default Root;
