import { Box, Button, Grid, Typography } from "@mui/material";
import TaskList from "./TaskList";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { useState } from "react";
import CustomModal from "../common/components/CustomModal";
import CreateTaskForm from "./CreateTaskForm";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Tasks } from "../../utils/types";
import {
  updateTaskOrderDifferentColumn,
  updateTaskOrderSameColumn,
} from "../../app/team/teamServices";
import {
  updateTaskOrderDifferent,
  updateTaskOrderSame,
} from "../../app/team/teamSlice";

const TaskContainer = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isOwner = currentUser?.uid == activeTeam?.owner;
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const handleModalOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // if user drop in an unknown destination
    if (!destination) return;
    // if user drags and drops in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    // if user drops in same column but different position
    if (
      destination.droppableId === source.droppableId &&
      destination.index !== source.index
    ) {
      const column = destination.droppableId.toLowerCase() as keyof Tasks;
      if (activeTeam?.tasks) {
        const tasks = activeTeam?.tasks[column];
        const updatedTasks = Array.from(tasks);
        const [movedTask] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, movedTask);

        if (activeTeamId) {
          dispatch(
            updateTaskOrderSameColumn({
              teamId: activeTeamId,
              updatedTasks,
              column,
            })
          );
          dispatch(updateTaskOrderSame({ updatedTasks, column }));
        }
      }
    }
    // if user drop in another column
    if (destination.droppableId !== source.droppableId) {
      const sourceCol = source.droppableId.toLowerCase() as keyof Tasks;
      const destinationCol =
        destination.droppableId.toLowerCase() as keyof Tasks;
      const updatedTasksObject = structuredClone(activeTeam?.tasks) as Tasks;
      const [movedTask] = updatedTasksObject[sourceCol].splice(source.index, 1);
      updatedTasksObject[destinationCol].splice(
        destination.index,
        0,
        movedTask
      );
      if (activeTeam) {
        dispatch(
          updateTaskOrderDifferentColumn({
            teamId: activeTeamId as string,
            updatedTasksObject,
          })
        );
        dispatch(updateTaskOrderDifferent(updatedTasksObject));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container borderRadius={3} p={1} spacing={1}>
        {/* if tasks are availabe then render task lists/columns */}
        {activeTeam?.tasks ? (
          <>
            <Grid item xs={12} sm={6} md={3} key={"TODO"}>
              <TaskList column={"TODO"} tasks={activeTeam.tasks.todo} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} key={"ONGOING"}>
              <TaskList column={"ONGOING"} tasks={activeTeam.tasks.ongoing} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} key={"REVIEW"}>
              <TaskList column={"REVIEW"} tasks={activeTeam.tasks.review} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} key={"COMPLETED"}>
              <TaskList
                column={"COMPLETED"}
                tasks={activeTeam.tasks.completed}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Box display={"flex"} flexDirection={"column"}>
              {isOwner ? (
                <>
                  <Typography
                    variant="h5"
                    mb={2}
                    textAlign={"center"}
                    color={"gray"}
                  >
                    Ready to conquer your goals? Let's get started by assigning
                    some tasks!
                  </Typography>
                  <Button size="large" onClick={handleModalOpen}>
                    Assign tasks
                  </Button>
                </>
              ) : (
                <Typography
                  variant="h5"
                  mb={2}
                  textAlign={"center"}
                  color={"gray"}
                >
                  Ready and waiting for your next task assignment. Stay tuned!
                </Typography>
              )}
            </Box>
          </Grid>
        )}
        <CustomModal
          isOpen={isOpen}
          handleClose={handleModalClose}
          title="Assign tasks"
          children={<CreateTaskForm handleClose={handleModalClose} />}
        />
      </Grid>
    </DragDropContext>
  );
};

export default TaskContainer;
