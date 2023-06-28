/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TEAMTRACK from "../../../../assets/TeamTrack.svg";
import { Drawer, Stack, Switch } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { logout } from "../../../../app/auth/authServices";
import { setError } from "../../../../app/auth/authSlice";
import useColorMode from "../../../theme/useColorMode";
import { DarkMode, LightMode } from "@mui/icons-material";
import NavList from "../../../common/components/NavList";

function NavbarComponent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.root.auth.user);
  const [anchorElNav, setAnchorElNav] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { toggleColorMode, colorMode } = useColorMode();
  const handleOpenNavMenu = () => {
    setAnchorElNav(true);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleProfile = () => {
    navigate("/user-profile");
    handleCloseUserMenu();
  };
  const handleLogout = async () => {
    const logoutStatus = await dispatch(logout());
    if (logoutStatus.meta.requestStatus === "rejected") {
      dispatch(setError("Cannot logout"));

      setTimeout(() => {
        dispatch(setError(null));
      }, 5000);
    } else {
      navigate("/login");
    }
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
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
            <Drawer
              anchor="left"
              open={anchorElNav}
              onClose={handleCloseNavMenu}
            >
              <Box width="200px" textAlign="center">
                <NavList />
              </Box>
            </Drawer>
          </Box>

          <Stack direction="row" alignItems="center">
            <Box display={{ xs: "none", sm: "block" }}>
              <img src={TEAMTRACK} width={60} />
            </Box>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to={"/dashboard"}
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TeamTrack
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 0 }}>
            <Switch
              checked={colorMode === "dark"}
              onChange={toggleColorMode}
              icon={<LightMode sx={{ fontSize: "22px" }} />}
              checkedIcon={<DarkMode sx={{ fontSize: "22px" }} />}
            />
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, mx: { xs: 1, sm: 3 } }}
              >
                <Avatar alt={user?.name} src={user?.profileImage} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="profile" onClick={handleProfile}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem key="logout" onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavbarComponent;
