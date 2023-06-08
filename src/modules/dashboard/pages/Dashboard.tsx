import { Container, Grid } from "@mui/material";
import DashBoardContent from "../components/DashBoardContent";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: "2rem" }}>
        <Grid container spacing={2}>
          <Grid item sx={{ display: { xs: "none", md: "block" } }} md={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} md ={10}>
            <DashBoardContent />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
