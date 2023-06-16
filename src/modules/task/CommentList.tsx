import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Comment } from "../../utils/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useTeam from "../../custom-hook/useTeam";
import { useAppSelector } from "../../app/hooks";

dayjs.extend(relativeTime);

const CommentList = ({ taskId }: { taskId: string }) => {
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);
  let comments: Comment[] = [];
  if (activeTeam?.tasks) {
    const taskIndex = activeTeam?.tasks?.findIndex(
      (task) => task.id === taskId
    );
    comments = activeTeam?.tasks[taskIndex as number].comments;
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {comments.map((comment) => {
        const { commentedOn, postedBy, id, text }: Comment = comment;

        return (
          <ListItem alignItems="flex-start" disablePadding key={id}>
            <ListItemAvatar>
              <Avatar alt={postedBy.name} src="sdf" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                  <Typography variant="body1">{postedBy.name}</Typography>
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
  );
};

export default CommentList;
