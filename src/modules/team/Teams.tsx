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

  // function to set active team
  const handleTeamClick = (teamId: string) => {
    dispatch(setActiveTeam(teamId));
  };
  return (
    <>
      {/* Header */}
      <Typography
        variant="h5"
        paddingBottom={1}
        marginBottom={2}
        borderBottom={"1px #ddd solid"}
      >
        Your teams
      </Typography>
      <Grid
        container
        p={2}
        spacing={2}
        sx={{ overflowY: "auto" }}
        maxHeight={"80vh"}
      >
        {/* Create team card */}
        <Grid item xs={12} sm={6} md={4}>
          <CreateTeamCard />
        </Grid>

        {/* Mapping throung all teams of user */}
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
                    borderTop: "1px solid #eee",
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
