import { Comment, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Task } from "../../utils/types";
import CustomModal from "../common/components/CustomModal";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
import { Draggable, Droppable } from "@hello-pangea/dnd";

const TaskList = ({ column, tasks }: { column: string; tasks: Task[] }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);

  const handleEditModalOpen = (task: Task) => {
    setFocusedTask(task);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setFocusedTask(null);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px #ddd solid"}
      >
        <Typography variant="h6">{column}</Typography>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </Box>

      {/* making the task list droppable */}
      <Droppable droppableId={column}>
        {(droppableProvided) => (
          <Stack
            spacing={2}
            my={1}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(draggableProvided) => (
                  <Card
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    onClick={() => handleEditModalOpen(task)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#edf3f3",
                      },
                      borderRadius: 3,
                    }}
                  >
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
                    {task.comments.length > 0 && (
                      <CardContent sx={{ pb: "1px" }}>
                        <Comment color={"disabled"} />
                      </CardContent>
                    )}
                  </Card>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </Stack>
        )}
      </Droppable>
      {focusedTask && (
        <CustomModal
          isOpen={isEditModalOpen}
          handleClose={handleEditModalClose}
          title={focusedTask.title}
          children={
            <EditTaskForm
              task={focusedTask}
              column={column}
              handleClose={handleEditModalClose}
            />
          }
        />
      )}
    </>
  );
};

export default TaskList;
