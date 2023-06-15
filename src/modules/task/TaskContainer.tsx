import { Box, Button, Grid, Typography } from "@mui/material";
import TaskList from "./TaskList";
import { useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import { useState } from "react";
import CustomModal from "../common/components/CustomModal";
import CreateTaskForm from "./CreateTaskForm";
import { Task } from "../../utils/types";

const taskStatus = ["TO DO", "ONGOING", "REVIEW", "COMPLETED"];
const TaskContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);

  return (
    <Grid container borderRadius={3} p={1} spacing={1}>
      {activeTeam?.tasks ? (
        taskStatus.map((status) => {
          const tasks = activeTeam.tasks?.filter((team)=> team.status === status.split(' ').join('').toLowerCase())
          return (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <TaskList status={status} tasks = {tasks as Task[]}/>
            </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h5" mb={2} textAlign={"center"} color={"gray"}>
              Ready to conquer your goals? Let's get started by assigning some
              tasks!
            </Typography>
            <Button size="large" onClick={handleModalOpen}>
              Assign tasks
            </Button>
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
  );
};

export default TaskContainer;
