import { Edit, People } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { useState } from "react";
import CustomModal from "../common/components/CustomModal";
import EditTeamForm from "./EditTeamForm";

const TeamHeader = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Typography variant="h4" mb={2}>
        {activeTeam?.teamName}
      </Typography>
      <Stack
        spacing={2}
        mb={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "start", sm: "center" }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <People color="primary" />
          <Typography variant="subtitle2" px={1}>
            Members
          </Typography>
          <AvatarGroup max={4}>
            {activeTeam?.members.map((member) => (
              <Avatar alt={member.name} src={member.email} key={member.email} />
            ))}
          </AvatarGroup>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Edit />}
          sx={{ borderRadius: "20px" }}
          disableElevation
          onClick={handleModalOpen}
        >
          Edit team
        </Button>
      </Stack>
      <CustomModal
        isOpen={isOpen}
        handleClose={handleModalClose}
        title="Edit team"
        children={<EditTeamForm handleClose={handleModalClose} />}
      />
    </>
  );
};

export default TeamHeader;
