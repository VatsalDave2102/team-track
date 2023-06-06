import { Box, Container, Grid, Grow, Link, Stack, Typography } from "@mui/material";
import SIGNUP from "../../../../assets/signup.svg";
import TEAMTRACKGREEN from "../../../../assets/TeamTrackGreen.svg";
import { useEffect, useState } from "react";
import SignUpForm from "../../components/SignUpForm";
import { Link as RouterLink } from "react-router-dom";
const Signup = () => {
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    setShowForm(true);
  }, []);
  return (
    <Grow in={showForm} timeout={800}>
      <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
        <Stack direction="row" justifyContent="center">
          <Box>
            <img
              src={TEAMTRACKGREEN}
              alt="teamtrack logo"
              style={{ maxWidth: "50px" }}
              className="green-logo"
            />
          </Box>
          <Typography variant="h3" fontWeight={700} color="primary.main">
            TeamTrack
          </Typography>
        </Stack>
        <Typography variant="h6" color="primary" mb={2} textAlign="center">
          Streamline Your Task Management Journey - Sign Up and Get Started
          Today!
        </Typography>
        <Grid
          container
          alignItems="center"
          p={3}
          borderTop={2}
          borderBottom={2}
          borderColor={"primary.main"}
         
        >
          <Grid item xs={12} md={7}>
            <SignUpForm />
          </Grid>
          <Grid item xs={5} sx={{ display: { xs: "none", md: "flex" } }}>
            <Box>
              <img
                src={SIGNUP}
                alt="signup logo"
                style={{ maxWidth: "100%" }}
              />
            </Box>
          </Grid>
        </Grid>
        <Typography variant="h6"mt={2} textAlign={'center'}>Already a user? <Link component={RouterLink} color="primary.main" to='/login'>Log in here</Link></Typography>
      </Container>
    </Grow>
  );
};

export default Signup;
