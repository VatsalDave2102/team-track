import { Box, Drawer, IconButton } from "@mui/material";
import NavList from "../../../common/components/NavList";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const NavMenu = () => {
  const [anchorElNav, setAnchorElNav] = useState<boolean>(false);

  // function to open nav menu
  const handleOpenNavMenu = () => {
    setAnchorElNav(true);
  };
  // function to close nav menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(false);
  };

  return (
    // Nav menu for mobile screens
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={anchorElNav} onClose={handleCloseNavMenu}>
        <Box width="200px" textAlign="center">
          <NavList />
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavMenu;
