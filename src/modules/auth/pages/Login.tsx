import {
  Box,
  Container,
  Grid,
  Grow,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import TEAMTRACKGREEN from "../../../assets/TeamTrackGreen.svg";
import { Suspense, lazy, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Loader from "../../../router/Loader";

// dynamically importing login form
const LoginForm = lazy(() => import("../components/LoginForm"));

const Login = () => {
  const [showForm, setShowForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  //  effect to check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoader(false);
      navigate("/dashboard");
    } else {
      setLoader(false);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    setShowForm(true);
  }, []);

  if (loader) {
    return <Loader />;
  }

  return (
    <Suspense>
      <Grow in={showForm} timeout={800}>
        <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
          {/* Login header */}
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
            Access Your Tasks with Ease - Log In and Stay Organized!
          </Typography>
          {/* Login form and icon grid*/}
          <Grid
            container
            alignItems="center"
            p={3}
            borderTop={2}
            borderBottom={2}
            borderColor={"primary.main"}
            direction={"row-reverse"}
          >
            {/* Login form */}
            <Grid item xs={12} md={7}>
              <LoginForm />
            </Grid>
            {/* Icon */}
            <Grid item xs={5} sx={{ display: { xs: "none", md: "flex" } }}>
              <Box>
                <img
                  src={TEAMTRACKGREEN}
                  alt="signup logo"
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Typography variant="h6" mt={2} textAlign={"center"}>
            New user?{" "}
            <Link component={RouterLink} color="primary.main" to="/signup">
              Sign up here
            </Link>
          </Typography>
        </Container>
      </Grow>
    </Suspense>
  );
};

export default Login;
