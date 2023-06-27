import { useContext } from "react";
import { ColorModeContext } from "./ColorModeContext";

const useColorMode = () => useContext(ColorModeContext);

export default useColorMode;
