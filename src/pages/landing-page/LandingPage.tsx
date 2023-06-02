import { Box, Button, Container, Grid, Typography } from "@mui/material";
import GOODTEAM from "../../assets/goodTeam.svg";
import TEAMSELECT from "../../assets/teamSelection.svg";
import ENGINEERTEAM from "../../assets/engineeringTeam.svg";
const LandingPage = () => {
  return (
    <Container maxWidth="lg" disableGutters sx={{ paddingTop: "2rem" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        pt={2}
        mb={5}
      >
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              TeamTrack
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
              minus maxime facere accusantium odio ducimus? Debitis iste
              assumenda provident ratione dolor impedit, modi culpa nobis beatae
              ex consequuntur enim omnis?
            </Typography>
            <Button variant="contained">Get started</Button>
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
      >
        <Grid item xs={7} sx={{ display: { xs: "none", sm: "block" } }}>
          <Box p={3}>
            <img src={TEAMSELECT} style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              Create your team
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
              minus maxime facere accusantium odio ducimus? Debitis iste
              assumenda provident ratione dolor impedit, modi culpa nobis beatae
              ex consequuntur enim omnis?
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        alignItems="center"
        pt={2}
        mb={5}
      >
        <Grid item xs={12} sm={5}>
          <Box p={3}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              Work together
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
              minus maxime facere accusantium odio ducimus? Debitis iste
              assumenda provident ratione dolor impedit, modi culpa nobis beatae
              ex consequuntur enim omnis?
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
