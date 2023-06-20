import { Add, InfoOutlined, People } from "@mui/icons-material";
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
import CreateTaskForm from "../task/CreateTaskForm";
import InfoModal from "./InfoModal";

const TeamHeader = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isOwner = currentUser?.email == activeTeam?.owner.email;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const handleInfoModalOpen = () => {
    setIsOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsOpen(false);
  };
  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };
  return (
    <Box
      sx={{ bgcolor: "primary.light" }}
      p={2}
      borderRadius={3}
      color={"white"}
    >
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
          <People />
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
          color="secondary"
          endIcon={<InfoOutlined />}
          sx={{ borderRadius: "20px", color: "#333" }}
          disableElevation
          onClick={handleInfoModalOpen}
        >
          Team info
        </Button>
        {isOwner && (
          <Button
            variant="contained"
            color="secondary"
            endIcon={<Add />}
            sx={{ borderRadius: "20px", color: "#333" }}
            disableElevation
            onClick={handleCreateModalOpen}
          >
            Add Task
          </Button>
        )}
      </Stack>
      <CustomModal
        isOpen={isOpen}
        handleClose={handleInfoModalClose}
        title={activeTeam?.teamName as string}
        children={<InfoModal />}
      />
      <CustomModal
        isOpen={isCreateModalOpen}
        handleClose={handleCreateModalClose}
        title="Assign Task"
        children={<CreateTaskForm handleClose={handleCreateModalClose} />}
      />
    </Box>
  );
};

export default TeamHeader;
