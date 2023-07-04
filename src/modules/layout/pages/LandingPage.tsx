import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import GOODTEAM from "../../../assets/goodTeam.svg";
import TEAMSELECT from "../../../assets/teamSelection.svg";
import ENGINEERTEAM from "../../../assets/engineeringTeam.svg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../router/Loader";

const token = localStorage.getItem("token");
const LandingPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (token) {
      setLoader(false);
      navigate("/dashboard");
    } else {
      setLoader(false);
      return;
    }
  },[navigate]);

  if (loader) {
    return <Loader />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
      <Grid container spacing={2} alignItems="center" pt={2} mb={5}>
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              TeamTrack
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              A comprehensive project management tool designed to streamline
              collaboration and enhance productivity within teams. With
              TeamTrack, you can efficiently manage projects, assign tasks, and
              track progress, all in one centralized platform.
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <Button variant="contained" component={Link} to={"/signup"}>
                Get started
              </Button>
              <Button variant="contained" component={Link} to={"/login"}>
                Login here
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={7} sx={{ display: { xs: "none", sm: "block" } }}>
          <Box p={3}>
            <img src={GOODTEAM} style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        alignItems="center"
        pt={2}
        mb={5}
        flexDirection="row-reverse"
      >
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              Create your team
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Create projects, set deadlines, and assign tasks to team members.
              Monitor project progress and ensure timely completion of
              milestones.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={7} sx={{ display: { xs: "none", sm: "block" } }}>
          <Box p={3}>
            <img src={TEAMSELECT} style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" pt={2} mb={5}>
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              Assign tasks
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Adapt TeamTrack to your team's unique workflow by creating custom
              tasks, labels, and priorities. Tailor the tool to fit your
              specific project management needs.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={7} sx={{ display: { xs: "none", sm: "block" } }}>
          <Box p={3}>
            <img src={GOODTEAM} style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        alignItems="center"
        pt={2}
        mb={5}
        flexDirection={"row-reverse"}
      >
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              Work together
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Foster effective team communication through integrated comment
              feature, allowing team members to discuss project details,
              exchange ideas, and provide feedback.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={7} sx={{ display: { xs: "none", sm: "block" } }}>
          <Box p={3}>
            <img src={ENGINEERTEAM} style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
