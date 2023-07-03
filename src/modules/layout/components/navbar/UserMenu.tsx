import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../../../app/auth/authServices";
import { setError } from "../../../../app/auth/authSlice";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.root.auth.user);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // function to open user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // function to close user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // function to navigate to user-profile
  const handleProfile = () => {
    navigate("/user-profile");
    handleCloseUserMenu();
  };

  // function to handle logout
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
    <>
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
    </>
  );
};

export default UserMenu;
