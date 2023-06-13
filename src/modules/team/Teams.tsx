import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CreateTeamCard from "./CreateTeamCard";
import { useAppSelector } from "../../app/hooks";
import DEFAULTTEAM from "../../assets/team-creation.svg";
const Teams = () => {
  const currentUserTeams = useAppSelector((state) => state.root.team.teamList);
  return (
    <>
      <Typography
        variant="h5"
        paddingBottom={2}
        borderBottom={"1px #ddd solid"}
      >
        Your teams
      </Typography>
      <Grid container p={2} spacing={2}>
        {currentUserTeams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card sx={{ maxWidth: 300, borderRadius: 3, maxHeight: 200 }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="100"
                image={team.image ? team.image : DEFAULTTEAM}
              />
              <CardActionArea component={Link} to={`teams/${team.teamName.split(' ').join('')}`}>
                <CardContent
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {team.teamName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={4}>
          <CreateTeamCard />
        </Grid>
      </Grid>
    </>
  );
};

export default Teams;
