import { Add, InfoOutlined, People } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { useState } from "react";
import CustomModal from "../common/components/CustomModal";
import CreateTaskForm from "../task/CreateTaskForm";
import TeamInfo from "./TeamInfo";

const TeamHeader = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const activeTeam = useTeam(activeTeamId as string);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isOwner = currentUser?.uid == activeTeam?.owner;
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
        {isLoading ? <Skeleton width={"40%"} /> : activeTeam?.teamName}
      </Typography>
      <Stack
        spacing={2}
        mb={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "start", sm: "center" }}
      >
        <Box display={"flex"} alignItems={"center"}>
          {isLoading ? (
            <>
              <Skeleton width={"257px"} height={"44px"} />
            </>
          ) : (
            <>
              <People />
              <Typography variant="subtitle2" px={1}>
                Members
              </Typography>

              <AvatarGroup max={3}>
                {teamMembers?.map((member) => (
                  <Avatar
                    alt={member.name}
                    src={member.profileImage}
                    key={member.uid}
                  />
                ))}
              </AvatarGroup>
            </>
          )}
        </Box>
        {isLoading ? (
          <Skeleton width={127} height={44} />
        ) : (
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
        )}

        {isOwner && isLoading ? (
          <Skeleton width={143} height={44} />
        ) : (
          <Button
            variant="contained"
            color="secondary"
            endIcon={<Add />}
            sx={{ borderRadius: "20px", color: "#333" }}
            disableElevation
            onClick={handleCreateModalOpen}
          >
            Assign Task
          </Button>
        )}
      </Stack>
      <CustomModal
        isOpen={isOpen}
        handleClose={handleInfoModalClose}
        title={activeTeam?.teamName as string}
        children={<TeamInfo />}
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
