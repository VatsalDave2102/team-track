import { Box, Button, Stack, Typography } from "@mui/material";
import TEAMNOTFOUND from "../../assets/team-not-found.svg";
import { Link } from "react-router-dom";
const NoTeamExist = () => {
  return (
    <Stack spacing={3}>
      <Box display={"flex"} justifyContent={"center"}>
        <img src={TEAMNOTFOUND} alt="team not found" width="70%" />
      </Box>
      <Typography variant="h5" textAlign={"center"}>
        Oops! The team you're looking for does not exists
      </Typography>
      <Button component={Link} to="/dashboard">
        Back to Dashboard
      </Button>
    </Stack>
  );
};

export default NoTeamExist;
