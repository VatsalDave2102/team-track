/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import TEAMTRACK from "../../../../assets/TeamTrack.svg";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";
import DarkModeSwitch from "./DarkModeSwitch";
import UserMenu from "./UserMenu";
import { Typography } from "@mui/material";

function NavbarComponent() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <NavMenu />

          {/* TeamTrack logo and home title */}
          <Stack direction="row" alignItems="center">
            {/* logo */}
            <Box display={{ xs: "none", sm: "block" }}>
              <img src={TEAMTRACK} width={60} />
            </Box>
            {/* title */}
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
            {/* Dark mode toggler */}
            <DarkModeSwitch />
            {/* User menu */}
            <UserMenu />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavbarComponent;
