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
import { Comment, Tasks, TeamData } from "../../utils/types";
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

  // function to handle comment input field
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  // handler to post comment
  const handlePostComment = (comment: string) => {
    if (currentUser && activeTask) {
      const commentData: Comment = {
        id: genreateId(6),
        postedBy: currentUser?.uid,
        text: comment,
        commentedOn: dayjs().toString(),
      };

      dispatch(
        postComment({
          teamId: activeTeamId as string,
          taskId: activeTask.id,
          newComment: commentData,
          column: taskColumn as keyof Tasks,
        })
      );

      // resetting field to empty string
      setComment("");
    }
  };
  return (
    <>
      {/* Field header */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        mt={5}
        px={{ xs: 1, sm: 2 }}
        width={{ xs: "100%", sm: 500 }}
      >
        <CommentIcon sx={{ color: "GrayText" }} />
        <Typography variant="h6">Comments</Typography>
      </Stack>

      {/* Comment field */}
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent={"center"}
        my={2}
        width={{ xs: "100%", sm: 500 }}
        p={{ xs: 1, sm: 2 }}
      >
        {/* Current user avatar */}
        <Avatar
          alt={currentUser?.name}
          src={currentUser?.profileImage}
          sx={{ mt: 1 }}
        />
        {/* Text field */}
        <TextField
          name="comment"
          label="Comment"
          type="text"
          fullWidth
          onChange={handleCommentChange}
          value={comment}
          // send button
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
