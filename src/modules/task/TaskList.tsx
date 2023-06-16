import { Add, Comment, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Task } from "../../utils/types";
import CustomModal from "../common/components/CustomModal";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

const TaskList = ({ status, tasks }: { status: string; tasks: Task[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  const handleModalOpen = (task: Task) => {
    setFocusedTask(task);
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setFocusedTask(null);
    setIsOpen(false);
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px #ddd solid"}
      >
        <Typography variant="h6">{status}</Typography>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </Box>
      <Stack spacing={2} my={1}>
        {tasks.map((task) => (
          <>
            <Card key={task.id}>
              <CardActionArea onClick={() => handleModalOpen(task)}>
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
                {task.comments && (
                  <CardContent sx={{ p: 1 }}>
                    <Comment color={"disabled"} />
                  </CardContent>
                )}
              </CardActionArea>
            </Card>
          </>
        ))}

        {status == "TO DO" && (
          <Button variant="outlined" endIcon={<Add />}>
            Add Task
          </Button>
        )}
      </Stack>
      {focusedTask && (
        <CustomModal
          isOpen={isOpen}
          handleClose={handleModalClose}
          title={focusedTask.title}
          children={<EditTaskForm task={focusedTask} />}
        />
      )}
    </>
  );
};

export default TaskList;
