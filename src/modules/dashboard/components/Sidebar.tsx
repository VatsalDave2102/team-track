import { Dashboard, Timeline } from "@mui/icons-material";
import CustomList from "../../common/components/CustomList";
import { Box } from "@mui/material";

const listItems = [
  { label: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
  { label: "Timeline", link: "/dashboard", icon: <Timeline /> },
];
const Sidebar = () => {
  return (
    <Box border={"1px #ddd solid"} borderRadius={3}>
      <CustomList items={listItems} />
    </Box>
  );
};

export default Sidebar;
