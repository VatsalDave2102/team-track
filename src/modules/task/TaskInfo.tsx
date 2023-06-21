import { Edit, FormatListBulleted } from "@mui/icons-material";
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
import EditTaskForm from "./EditTaskForm";
import { useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { useState } from "react";
import { PriorityOption, Task, Tasks, TeamData } from "../../utils/types";
import { taskColor } from "../../utils/utils";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import CommentList from "./CommentList";
import useTask from "../../custom-hook/useTask";
import AddCommentField from "./AddCommentField";

dayjs.extend(localizedFormat);

const TaskInfo = ({
  handleTaskInfoModalClose,
}: {
  handleTaskInfoModalClose: () => void;
}) => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTaskId = useAppSelector((state) => state.root.team.activeTask);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const activeTeam = useTeam(activeTeamId as string);
  const [activeTask, taskColumn] = useTask(
    activeTaskId as string,
    activeTeam as TeamData
  );
  const isOwner = currentUser?.email == activeTeam?.owner.email;
  const handleEditFormOpen = () => {
    setIsEditFormOpen(true);
  };
  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };

  return (
    <>
      {activeTask && (
        <>
          <Stack
            direction={"row"}
            width={500}
            alignItems={"center"}
            spacing={1}
            mt={"auto"}
          >
            <FormatListBulleted sx={{ color: "GrayText" }} />
            <Typography variant="h6">Task details</Typography>
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
                  Description
                </Typography>
                <Typography variant="body1">
                  {activeTask.description}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" mb={1}>
                  Priority
                </Typography>
                <Chip
                  label={PriorityOption[Number(activeTask.priority)]}
                  variant="outlined"
                  sx={{ mr: 1 }}
                  color={taskColor[Number(activeTask.priority)]}
                />
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" mb={1}>
                  Deadline
                </Typography>
                <Typography variant="body1">
                  {dayjs(activeTask.deadline).format("LLLL")}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" mb={1}>
                  Assigned to
                </Typography>
                {activeTask.assignedTo.map((member) => (
                  <Chip
                  key={member.email}
                    avatar={
                      <Avatar
                        alt={member.name}
                        src="/static/images/avatar/1.jpg"
                      />
                    }
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
            <EditTaskForm
              handleModalClose={handleTaskInfoModalClose}
              task={activeTask as Task}
              column={taskColumn as string}
              handleFormClose={handleEditFormClose}
            />
          </Collapse>
          <AddCommentField />

          {activeTask.comments.length > 0 ? (
            <CommentList
              taskId={activeTask.id}
              column={taskColumn as keyof Tasks}
            />
          ) : (
            <Typography
              variant="body1"
              mb={2}
              textAlign={"center"}
              color={"gray"}
            >
              No comments yet!
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default TaskInfo;
