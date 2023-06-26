import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { Edit, Groups } from "@mui/icons-material";
import { useState } from "react";
import EditTeamForm from "./EditTeamForm";

const InfoModal = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const activeTeam = useTeam(activeTeamId as string);
  const isOwner = currentUser?.uid == activeTeam?.owner;
  const owner = teamMembers?.find((member) => member.uid === activeTeam?.owner);
  const handleEditFormOpen = () => {
    setIsEditFormOpen(true);
  };
  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };
  return (
    <>
      <Stack
        direction={"row"}
        width={500}
        alignItems={"center"}
        spacing={1}
        m={"auto"}
      >
        <Groups sx={{ color: "GrayText" }} />
        <Typography variant="h5">Team details</Typography>
      </Stack>
      <Collapse in={!isEditFormOpen}>
        <Stack
          spacing={1}
          alignItems={"stretch"}
          justifyContent={"center"}
          width={500}
          m={"auto"}
          p={2}
        >
          <Box>
            <Typography variant="h6" mb={1}>
              Overview
            </Typography>
            <Typography variant="body1">{activeTeam?.overview}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" mb={1}>
              Owner
            </Typography>
            <Chip
              avatar={<Avatar alt={owner?.name} src={owner?.profileImage} />}
              label={owner?.name}
              variant="outlined"
            />
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" mb={1}>
              Members
            </Typography>
            {teamMembers?.map((member) => (
              <Chip
                key={member.email}
                avatar={<Avatar alt={member.name} src={member.profileImage} />}
                label={member.name}
                variant="outlined"
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
          {isOwner && (
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button
                sx={{ mt: "15px" }}
                startIcon={<Edit />}
                variant="contained"
                onClick={handleEditFormOpen}
              >
                Edit
              </Button>
            </Box>
          )}
        </Stack>
      </Collapse>
      <Collapse in={isEditFormOpen}>
        <EditTeamForm handleClose={handleEditFormClose} />
      </Collapse>
    </>
  );
};

export default InfoModal;
