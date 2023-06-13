import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import CustomModal from "../common/components/CustomModal";
import { useState } from "react";
import CreateTeamForm from "./CreateTeamForm";
import DEFAULTTEAM from  '../../assets/team-creation.svg'
const CreateTeamCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Card sx={{ maxWidth: 300, maxHeight: 200, borderRadius: 3 }}>
        <CardMedia
          component="img"
          alt="create team logo"
          height="100"
          image={DEFAULTTEAM}
        />
        <CardActionArea
          onClick={handleModalOpen}
          sx={{
            "&:hover": { backgroundColor: "primary.light", color: "white" },
          }}
        >
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
        children={<CreateTeamForm handleClose={handleModalClose} />}
      />
    </>
  );
};

export default CreateTeamCard;
