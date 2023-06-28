import { Box } from "@mui/material";
import NavList from "../../common/components/NavList";

const Sidebar = () => {
  return (
    <Box
      border={"1px #ddd solid"}
      borderRadius={3}
      height={"85vh"}
      sx={{ overflowY: "auto" }}
    >
      <NavList />
    </Box>
  );
};

export default Sidebar;
