import { Add, Comment, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

const TaskList = ({ type }: { type: string }) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px #ddd solid"}
      >
        <Typography variant="h6" fontSize={"1.2rem"}>
          {type}
        </Typography>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </Box>
      <Stack spacing={2} mb={1}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Task title</Typography>
              <Box>
                <Chip
                  size="small"
                  label="Medium"
                  color="warning"
                  sx={{ m: 1 }}
                />
                <Chip size="small" label="Design" color="info" sx={{ m: 1 }} />
                <Chip
                  size="small"
                  label="Tomorrow"
                  color="error"
                  sx={{ m: 1 }}
                />
              </Box>
            </Stack>
            <Button startIcon={<Comment />}>
              <Typography
                variant="subtitle2"
                display={{ xs: "none", sm: "block" }}
              >
                Comment
              </Typography>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2} mb={1}>
              <Typography variant="h6">Task title</Typography>
              <Box>
                <Chip
                  size="small"
                  label="Medium"
                  color="warning"
                  sx={{ m: 1 }}
                />
                <Chip size="small" label="Design" color="info" sx={{ m: 1 }} />
                <Chip
                  size="small"
                  label="Tomorrow"
                  color="error"
                  sx={{ m: 1 }}
                />
              </Box>
            </Stack>
            <Button startIcon={<Comment />}>
              <Typography
                variant="subtitle2"
                display={{ xs: "none", sm: "block" }}
              >
                Comment
              </Typography>
            </Button>
          </CardContent>
        </Card>
        {type == "TO DO" && (
          <Button variant="outlined" endIcon={<Add />}>
            Add Task
          </Button>
        )}
      </Stack>
    </>
  );
};

export default TaskList;
