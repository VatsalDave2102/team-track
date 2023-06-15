import { Add, Comment, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Task } from "../../utils/types";

const TaskList = ({ status, tasks }: { status: string; tasks: Task[] }) => {
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
          <Card key={task.id}>
            <CardActionArea>
            <Typography
              variant="h6"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                p: 1,
              }}
              component="h6"
            >
              {task.title}
            </Typography>

            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                component="div"
                color={"GrayText"}
              >
                {task.description}
              </Typography>
            </CardContent>
            </CardActionArea>
          </Card>
        ))}

        {status == "TO DO" && (
          <Button variant="outlined" endIcon={<Add />}>
            Add Task
          </Button>
        )}
      </Stack>
    </>
  );
};

export default TaskList;
