import { DarkMode, LightMode } from "@mui/icons-material";
import { Switch, Tooltip } from "@mui/material";
import useColorMode from "../../../theme/useColorMode";

const DarkModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    // Dark/light mode switch
    <Tooltip title="Toggle mode">
      <Switch
        checked={colorMode === "dark"}
        onChange={toggleColorMode}
        icon={<LightMode sx={{ fontSize: "22px" }} />}
        checkedIcon={<DarkMode sx={{ fontSize: "22px" }} />}
      />
    </Tooltip>
  );
};

export default DarkModeSwitch;
