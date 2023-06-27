import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";

export type ColorMode = "light" | "dark";

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: "light",
  toggleColorMode: () => {
    return;
  },
});

interface ColorModeProviderProps {
  children: React.ReactNode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({
  children,
}) => {
  const [colorMode, setColorMode] = useState<ColorMode>("light");

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

  const toggleColorMode = () => {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newColorMode);
    localStorage.setItem("colorMode", newColorMode);
  };

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
