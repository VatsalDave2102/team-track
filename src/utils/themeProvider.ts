import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
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
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
        input: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});

export default theme = responsiveFontSizes(theme);
