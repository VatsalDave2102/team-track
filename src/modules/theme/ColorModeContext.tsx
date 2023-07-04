import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import { createContext, useEffect, useMemo, useState } from "react";

// color mode type
export type ColorMode = "light" | "dark";

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

// context for color mode, contains colormode and a method to change color mode
export const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: "light",
  toggleColorMode: () => {
    return;
  },
});

interface ColorModeProviderProps {
  children: React.ReactNode;
}

// colormode provider components
export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({
  children,
}) => {
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  // effect to set last color mode from localstorage
  useEffect(() => {
    const savedColorMode = localStorage.getItem("colorMode") as ColorMode;
    if (savedColorMode) {
      setColorMode(savedColorMode);
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(prefersDarkMode ? "dark" : "light");
    }
  }, []);

  // method to change color mode
  const toggleColorMode = () => {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newColorMode);
    localStorage.setItem("colorMode", newColorMode);
  };

  // custom material ui theme
  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: colorMode,
            primary: {
              main: "#116466",
            },
            secondary: {
              main: "#f0d4bb",
            },
            info: {
              main: "#fcba03",
            },
          },
          typography: {
            fontFamily: ["Poppins", "sans-serif"].join(","),
            fontSize: 14,
          },
        })
      ),
    [colorMode]
  );

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
