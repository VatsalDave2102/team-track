import { Grid } from "@mui/material";
import TaskList from "./TaskList";

const TaskContainer = () => {
  return (
    <Grid container   borderRadius={3} p={1} spacing={1}>
      <Grid item xs={12} sm={6} md={3} >
        <TaskList type="TO DO" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TaskList type="ONGOING" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TaskList type="REVIEW" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TaskList type="COMPLETED" />
      </Grid>
    </Grid>
  );
};

export default TaskContainer;
