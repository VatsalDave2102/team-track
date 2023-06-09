import { Container, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: "1rem" }}>
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
