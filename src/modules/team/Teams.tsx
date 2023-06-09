import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../common/components/CustomModal";

const Teams = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
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
          <Card sx={{ maxWidth: 300, maxHeight: 200, borderRadius: 3 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="100"
              image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardActionArea onClick={handleModalOpen}>
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
                  Create your team
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <CustomModal
            isOpen={isOpen}
            handleClose={handleModalClose}
            title="Create team"
            subtitle="abcd"
            children={<div>Hi</div>}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Teams;
