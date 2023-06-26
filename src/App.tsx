import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import theme from "./utils/themeProvider";
// import { router } from "./router/Router";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";

import {  trackCurrentUser } from "./app/auth/authServices";
import { router } from "./router/Router";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(trackCurrentUser());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
