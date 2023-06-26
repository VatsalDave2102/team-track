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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DEFAULTTEAM from "../../assets/team-creation.svg";
import { setActiveTeam } from "../../app/team/teamSlice";
const Teams = () => {
  const currentUserTeams = useAppSelector((state) => state.root.team.teamList);
  const dispatch = useAppDispatch();
  const handleTeamClick = (teamId: string) => {
    dispatch(setActiveTeam(teamId));
  };
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
        <Grid item xs={12} sm={6} md={4}>
          <CreateTeamCard />
        </Grid>
        {currentUserTeams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card sx={{ maxWidth: 300, borderRadius: 3, maxHeight: 200 }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="100"
                image={team.image ? team.image : DEFAULTTEAM}
                sx={{ objectFit: "contain" }}
              />
              <CardActionArea
                component={Link}
                to={`teams/${team.id}`}
                onClick={() => {
                  handleTeamClick(team.id);
                }}
              >
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
      </Grid>
    </>
  );
};

export default Teams;
