import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PAGENOTFOUND from "../../assets/404.svg";
import { useAppSelector } from "../../../app/hooks";
const ErrorPage = () => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  return (
    <Container maxWidth="lg">
      <Stack spacing={3} mt={3}>
        <Box display={"flex"} justifyContent={"center"}>
          <img src={PAGENOTFOUND} alt="page not found" width="70%" />
        </Box>
        <Typography variant="h5" textAlign={"center"}>
          Oops! The page you're looking for does not exists
        </Typography>
        {currentUser ? (
          <Button component={Link} to="/dashboard">
            Back to Dashboard
          </Button>
        ) : (
          <Button component={Link} to="/login">
            Back to Login
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default ErrorPage;
