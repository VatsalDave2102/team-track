import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { theme } from "./utils/themeProvider";
// import { router } from "./router/Router";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";

import { checkToken, trackCurrentUser } from "./app/auth/authServices";
import { router } from "./router/Router";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkToken());
    dispatch(trackCurrentUser());
  }, [dispatch]);
  console.log("app");

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
