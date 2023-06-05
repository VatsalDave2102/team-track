import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#116466",
    },
    secondary: {
      main: "#d9b08c",
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    fontSize: 14,
  },
  components:{
    MuiInputBase:{
      styleOverrides:{
        root:{
          backgroundColor: '#fff',
        },
        input:{
          backgroundColor: '#fff'
        }
      }
    }
  }
});
