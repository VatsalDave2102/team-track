import { Comment as CommentIcon, Send } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTask from "../../custom-hook/useTask";
import { Comment, Tasks, TeamData, User } from "../../utils/types";
import { genreateId } from "../../utils/utils";
import { postComment } from "../../app/team/teamServices";
import dayjs from "dayjs";
import useTeam from "../../custom-hook/useTeam";

const AddCommentField = () => {
  const [comment, setComment] = useState("");
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTaskId = useAppSelector((state) => state.root.team.activeTask);
  const activeTeam = useTeam(activeTeamId as string);
  const dispatch = useAppDispatch();
  const [activeTask, taskColumn] = useTask(
    activeTaskId as string,
    activeTeam as TeamData
  );
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };
  const handlePostComment = (comment: string) => {
    const commentData: Comment = {
      id: genreateId(6),
      postedBy: currentUser as User,
      text: comment,
      commentedOn: dayjs().toString(),
    };

    if (currentUser && activeTask) {
      dispatch(
        postComment({
          teamId: activeTeamId as string,
          taskId: activeTask.id,
          newComment: commentData,
          column: taskColumn as keyof Tasks,
        })
      );
    }
  };
  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={1} mt={5}>
        <CommentIcon sx={{ color: "GrayText" }} />
        <Typography variant="h6">Comments</Typography>
      </Stack>
      <Stack direction={"row"} spacing={1} alignItems={"flex-start"} my={2}>
        <Avatar alt={currentUser?.name} src="sfds" sx={{ mt: 1 }} />
        <TextField
          name="comment"
          label="Comment"
          type="text"
          fullWidth
          onChange={handleCommentChange}
          value={comment}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  disabled={comment.trim() === ""}
                  onClick={() => handlePostComment(comment)}
                >
                  <Send color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </>
  );
};

export default AddCommentField;
