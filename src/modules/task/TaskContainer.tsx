import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { lazy, Suspense, useState } from "react";
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
import CustomModal from "../common/components/CustomModal";
import CreateTaskForm from "./CreateTaskForm";

const TaskList = lazy(() => import("./TaskList"));

const TaskContainer = () => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isOwner = currentUser?.uid == activeTeam?.owner;
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  // function to open assign task modal
  const handleModalOpen = () => {
    setIsOpen(true);
  };

  // function to close assign task modal
  const handleModalClose = () => {
    setIsOpen(false);
  };

  // function to handle dragging to tasks
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
      // creating an updated array by removing the dragged task from it's initial position and placing in new position
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
    // if user drops in another column
    if (destination.droppableId !== source.droppableId) {
      // creating new task objects by removing task from source column and adding it in destination column
      const sourceCol = source.droppableId.toLowerCase() as keyof Tasks;
      const destinationCol =
        destination.droppableId.toLowerCase() as keyof Tasks;

      // cloning task object
      const updatedTasksObject = structuredClone(activeTeam?.tasks) as Tasks;

      // removing moved task
      const [movedTask] = updatedTasksObject[sourceCol].splice(source.index, 1);

      // adding it in new columnd
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
    <Suspense fallback={null}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container borderRadius={3} p={1} spacing={1}>
          {isLoading ? (
            <Skeleton
              width={"90%"}
              height={200}
              sx={{ m: "auto", mt: 4 }}
              variant="rounded"
            />
          ) : activeTeam?.tasks ? (
            <>
              {/* todo column */}
              <Grid item xs={12} sm={6} md={3} key={"TODO"}>
                <TaskList column={"TODO"} tasks={activeTeam.tasks.todo} />
              </Grid>
              {/* ongoing column */}
              <Grid item xs={12} sm={6} md={3} key={"ONGOING"}>
                <TaskList column={"ONGOING"} tasks={activeTeam.tasks.ongoing} />
              </Grid>
              {/* review column */}
              <Grid item xs={12} sm={6} md={3} key={"REVIEW"}>
                <TaskList column={"REVIEW"} tasks={activeTeam.tasks.review} />
              </Grid>
              {/* completed column */}
              <Grid item xs={12} sm={6} md={3} key={"COMPLETED"}>
                <TaskList
                  column={"COMPLETED"}
                  tasks={activeTeam.tasks.completed}
                />
              </Grid>
            </>
          ) : (
            // if there are no tasks
            <Grid item xs={12}>
              <Box display={"flex"} flexDirection={"column"}>
                {/* if user is owner */}
                {isOwner ? (
                  <>
                    <Typography
                      variant="h5"
                      mb={2}
                      textAlign={"center"}
                      color={"gray"}
                    >
                      Ready to conquer your goals? Let's get started by
                      assigning some tasks!
                    </Typography>
                    <Button size="large" onClick={handleModalOpen}>
                      Assign tasks
                    </Button>
                  </>
                ) : (
                  // if user is team member
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
    </Suspense>
  );
};

export default TaskContainer;
