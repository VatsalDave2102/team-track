import {
  Avatar,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Comment, TeamData } from "../../utils/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useTeam from "../../custom-hook/useTeam";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useTask from "../../custom-hook/useTask";

dayjs.extend(relativeTime);

const CommentList = ({ taskId }: { taskId: string }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const [activeTask] = useTask(taskId as string, activeTeam as TeamData);
  const taskComments = activeTask?.comments;
  const handleCommentOpen = () => {
    setCommentOpen(!commentOpen);
  };
  return (
    <>
      <Button onClick={handleCommentOpen} sx={{ px: { xs: 1, sm: 2 } }}>
        {commentOpen ? (
          <>
            <Typography variant="body1">Hide comments</Typography>{" "}
            <ExpandLess />
          </>
        ) : (
          <>
            <Typography variant="body1">Show all comments</Typography>{" "}
            <ExpandMore />
          </>
        )}
      </Button>

      <Collapse in={commentOpen}>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            p: { xs: 1, sm: 2 },
          }}
        >
          {taskComments?.map((comment) => {
            const { commentedOn, postedBy, id, text }: Comment = comment;
            const user = teamMembers?.find((member) => member.uid === postedBy);
            return (
              <ListItem alignItems="flex-start" disablePadding key={id}>
                <ListItemAvatar>
                  <Avatar alt={user?.name} src={user?.profileImage} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack
                      direction={"row"}
                      spacing={1}
                      alignItems={"baseline"}
                    >
                      <Typography variant="body1">{user?.name}</Typography>
                      <Typography variant="body2" fontWeight={"300"}>
                        {dayjs(commentedOn).fromNow()}
                      </Typography>
                    </Stack>
                  }
                  secondary={text}
                />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default CommentList;
