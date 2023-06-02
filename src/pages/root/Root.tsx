import { Outlet } from "react-router-dom";
import NavbarComponent from "../../components/navbar/NavbarComponent";

const Root = () => {
  return (
    <>
      <NavbarComponent />
      <Outlet />
    </>
  )
};

export default Root;
