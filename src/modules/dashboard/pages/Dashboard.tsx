import { Container, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentUserTeams } from "../../../app/team/teamServices";

const Dashboard = () => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const dispatch = useAppDispatch();

  // effect to get current user's team
  useEffect(() => {
    if (currentUser) dispatch(getCurrentUserTeams(currentUser.uid));
  }, [dispatch, currentUser]);

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: "1rem" }}>
        {/* Grid containing sidebar and outlet */}
        <Grid container spacing={2}>
          <Grid item sx={{ display: { xs: "none", md: "block" } }} md={3}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} md={9}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
