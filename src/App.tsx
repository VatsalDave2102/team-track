import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { trackCurrentUser } from "./app/auth/authServices";
import { router } from "./router/Router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ColorModeProvider } from "./modules/theme/ColorModeContext";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(trackCurrentUser());
  }, [dispatch]);

  return (
    <ColorModeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ColorModeProvider>
  );
}

export default App;
