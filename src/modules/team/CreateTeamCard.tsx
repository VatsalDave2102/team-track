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
import ADDTEAM from "../../assets/addteam.svg";

const CreateTeamCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  // function to open create team modal
  const handleModalOpen = () => {
    setIsOpen(true);
  };

  // function to close create team modal
  const handleModalClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Card sx={{ maxWidth: 300, maxHeight: 200, borderRadius: 3 }}>
        {/* Add team image */}
        <CardMedia
          component="img"
          alt="create team logo"
          height="100"
          image={ADDTEAM}
          sx={{ objectFit: "contain" }}
        />

        {/* Action area to open modal */}
        <CardActionArea
          onClick={handleModalOpen}
          sx={{
            "&:hover": {
              backgroundColor: "primary.light",
              color: "white",
              borderRadius: 0,
            },
          }}
        >
          {/* Card title */}
          <CardContent sx={{ borderTop: "1px solid #eee" }}>
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

      {/* Create team modal */}
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
