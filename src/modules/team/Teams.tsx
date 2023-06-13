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

const Teams = () => {
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
          <Card sx={{ maxWidth: 300, borderRadius: 3, maxHeight: 200 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="100"
              image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardActionArea component={Link} to={"teams/id"}>
              <CardContent>
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
                  Team title
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 300, borderRadius: 3, maxHeight: 200 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="100"
              image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardActionArea component={Link} to={"teams/id"}>
              <CardContent>
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
                  Team title
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 300, borderRadius: 3, maxHeight: 200 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="100"
              image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardActionArea component={Link} to={"teams/id"}>
              <CardContent>
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
                  Team title
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CreateTeamCard/>
        </Grid>
      </Grid>
    </>
  );
};

export default Teams;
