import { Add, Comment, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
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
import CreateTaskForm from "./CreateTaskForm";

const TaskList = ({ column, tasks }: { column: string; tasks: Task[] }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);

  const handleEditModalOpen = (task: Task) => {
    setFocusedTask(task);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setFocusedTask(null);
    setIsEditModalOpen(false);
  };
  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
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
            {column == "TODO" && (
              <Button
                variant="outlined"
                endIcon={<Add />}
                onClick={handleCreateModalOpen}
              >
                Add Task
              </Button>
            )}
          </Stack>
        )}
      </Droppable>
      {focusedTask && (
        <CustomModal
          isOpen={isEditModalOpen}
          handleClose={handleEditModalClose}
          title={focusedTask.title}
          children={<EditTaskForm task={focusedTask} column={column} />}
        />
      )}
      <CustomModal
        isOpen={isCreateModalOpen}
        handleClose={handleCreateModalClose}
        title="Assign Task"
        children={<CreateTaskForm handleClose={handleCreateModalClose} />}
      />
    </>
  );
};

export default TaskList;
