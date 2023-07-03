import { Comment, Visibility } from "@mui/icons-material";
import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import { Task } from "../../utils/types";
import CustomModal from "../common/components/CustomModal";
import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskInfo from "./TaskInfo";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setActiveTask } from "../../app/team/teamSlice";
import useTeam from "../../custom-hook/useTeam";
import { taskColor } from "../../utils/utils";
import useColorMode from "../theme/useColorMode";

const TaskList = ({ column, tasks }: { column: string; tasks: Task[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTask = useAppSelector((state) => state.root.team.activeTask);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const isOwner = activeTeam?.owner === currentUser?.uid;
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();

  // function to open task info modal
  const handleTaskInfoModalOpen = (task: Task) => {
    dispatch(setActiveTask(task.id));
    setIsModalOpen(true);
  };

  // function to close task info modal
  const handleTaskInfoModalClose = () => {
    dispatch(setActiveTask(null));
    setIsModalOpen(false);
  };

  return (
    <>
      <Box borderBottom={"1px #ddd solid"}>
        <Typography variant="h6">{column}</Typography>
      </Box>

      {/* making the task list droppable */}
      <Droppable
        droppableId={column}
        isDropDisabled={column == "COMPLETED" && !isOwner}
      >
        {(droppableProvided) => (
          <Stack
            spacing={2}
            my={1}
            p={1}
            bgcolor={colorMode === "dark" ? "#222" : "#eee"}
            borderRadius={2}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}
                isDragDisabled={
                  !task.assignedTo.find(
                    (userId) => userId === currentUser?.uid
                  ) && !isOwner
                }
              >
                {(draggableProvided) => (
                  // Task card
                  <Card
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    onClick={() => handleTaskInfoModalOpen(task)}
                    sx={{
                      "&:hover": {
                        bgcolor: colorMode === "dark" ? "#333" : "#edf3f3",
                      },
                      borderRadius: 3,
                      cursor: "grab",
                    }}
                  >
                    {/* Task title */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        p: 1,
                      }}
                      component="div"
                    >
                      {task.title}
                    </Typography>
                    <Stack direction={"row"} spacing={1}>
                      {/* Icon to show if it is assigned to current user */}
                      {task.assignedTo.find(
                        (userId) => userId === currentUser?.uid
                      ) && (
                        <Tooltip title="Assigned to you">
                          <Box pl={"5px"}>
                            <Visibility
                              color={"disabled"}
                              sx={{ fontSize: "20px" }}
                            />
                          </Box>
                        </Tooltip>
                      )}

                      {/* Icon to show if there are comments on task */}
                      {task.comments.length > 0 && (
                        <Tooltip title="Comments">
                          <Box
                            pl={"5px"}
                            display={"flex"}
                            alignItems={"center"}
                          >
                            <Comment
                              color={"disabled"}
                              sx={{ fontSize: "20px" }}
                            />
                            <Typography
                              variant="body2"
                              pl={1}
                              color={"GrayText"}
                            >
                              {task.comments.length}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Stack>

                    {/* To highlight priority level */}
                    <Box
                      bgcolor={`${taskColor[Number(task.priority)]}.light`}
                      width={"100%"}
                      height={"4px"}
                      m={"auto"}
                      borderRadius={5}
                    />
                  </Card>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </Stack>
        )}
      </Droppable>

      {/* Task info modal */}
      {activeTask && (
        <CustomModal
          isOpen={isModalOpen}
          handleClose={handleTaskInfoModalClose}
          title={`In ${column}`}
          children={
            <TaskInfo handleTaskInfoModalClose={handleTaskInfoModalClose} />
          }
        />
      )}
    </>
  );
};

export default TaskList;
