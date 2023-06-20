import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from "formik";
import InputField from "../common/components/InputField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Comment, Task, Tasks, User } from "../../utils/types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  Comment as CommentIcon,
  FormatListBulleted,
  Send,
} from "@mui/icons-material";
import CommentList from "./CommentList";
import { genreateId } from "../../utils/utils";
import { useState } from "react";
import {
  getCurrentUserTeams,
  postComment,
  updateTask,
} from "../../app/team/teamServices";
import { addComment } from "../../app/team/teamSlice";

enum PriorityOption {
  Low,
  Medium,
  High,
  Urgent,
}

const validationSchema = Yup.object({
  // description validation
  description: Yup.string()
    .min(10, "Overview must be atleast 10 characters long")
    .required("Provide a description for task!"),
  // priority validation
  priority: Yup.string().required("Set priority"),
  // deadline validation
  deadline: Yup.date().nullable(),
  // assigned to validation
  assignedTo: Yup.array()
    .min(1, "Must add atleast one member!")
    .required("Must add atleast one member!"),
});

const EditTaskForm = ({ task, column }: { task: Task; column: string }) => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const uploadComment = useAppSelector(
    (state) => state.root.team.uploadComment
  );
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState("");
  const initialValues = {
    id: task.id,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
    assignedTo: task.assignedTo,
  };
  const handleSubmit = (values: typeof initialValues) => {
    if (currentUser) {
      dispatch(
        updateTask({ teamId: activeTeamId as string, taskData: values })
      ).then(() => {
        dispatch(
          getCurrentUserTeams({
            name: currentUser.name,
            email: currentUser.email,
          })
        );
      });
    }
  };

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
    console.log("method called");

    if (currentUser) {
      dispatch(
        addComment({
          taskId: task.id,
          commentData,
          column: column.toLowerCase() as keyof Tasks,
        })
      );
      dispatch(
        postComment({
          teamId: activeTeamId as string,
          taskId: task.id,
          newComment: commentData,
          column: column.toLowerCase() as keyof Tasks,
        })
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
    >
      {(formikProps) => {
        return (
          <Form>
            <Stack
              spacing={2}
              alignItems={"stretch"}
              justifyContent={"center"}
              width={500}
              m={"auto"}
              p={1}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <FormatListBulleted sx={{ color: "GrayText" }} />
                <Typography variant="h6">Task details</Typography>
              </Stack>
              <InputField
                name="description"
                label="Description"
                type="text"
                rows={5}
                multiline
                sx={{ width: "100%" }}
              />
              <FormControl>
                <FormLabel id="priority-radio-buttons">Priority</FormLabel>
                <RadioGroup
                  row
                  name={"priority"}
                  aria-labelledby="priority-radio-buttons"
                  value={formikProps.values.priority.toString()}
                  onChange={(event) => {
                    formikProps.setFieldValue(
                      "priority",
                      event.currentTarget.value
                    );
                  }}
                >
                  <FormControlLabel
                    value={PriorityOption.Low.toString()}
                    control={<Radio />}
                    label="Low"
                  />
                  <FormControlLabel
                    value={PriorityOption.Medium.toString()}
                    control={<Radio />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value={PriorityOption.High.toString()}
                    control={<Radio />}
                    label="High"
                  />
                  <FormControlLabel
                    value={PriorityOption.Urgent.toString()}
                    control={<Radio />}
                    label="Urgent"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl error fullWidth>
                <Field name="assignedTo">
                  {({
                    field,
                    form,
                  }: {
                    field: FieldProps["field"];
                    form: FormikProps<FormData>;
                  }) => (
                    <AutoCompleteField
                      {...field}
                      setFieldValue={form.setFieldValue}
                      mode="task-assign"
                      fieldName="assignedTo"
                      value={formikProps.values.assignedTo}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="assignedTo"
                  component={FormHelperText}
                  className="error"
                />
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    disablePast
                    label="Deadline"
                    value={dayjs(formikProps.values.deadline)}
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      formikProps.setFieldValue(
                        "deadline",
                        dayjs(value).toString()
                      );
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button type="submit" variant="contained" disabled={isLoading}>
                Save changes
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Button>
              <Stack direction={"row"} alignItems={"center"} spacing={1} mt={5}>
                <CommentIcon sx={{ color: "GrayText" }} />
                <Typography variant="h6">Comments</Typography>
              </Stack>
              <Stack direction={"row"} spacing={1} alignItems={"flex-start"}>
                <Avatar alt={currentUser?.name} src="sfds" sx={{ mt: 1 }} />
                <InputField
                  name="comment"
                  label="Comment"
                  onChange={handleCommentChange}
                  value={comment}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {uploadComment ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                        ) : (
                          <IconButton
                            edge="end"
                            disabled={comment.trim() === ""}
                            onClick={() => handlePostComment(comment)}
                          >
                            <Send color="primary" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              {task.comments.length > 0 ? (
                <CommentList
                  taskId={task.id}
                  column={column.toLowerCase() as keyof Tasks}
                />
              ) : (
                <Typography
                  variant="body1"
                  mb={2}
                  textAlign={"center"}
                  color={"gray"}
                >
                  No comments yet!
                </Typography>
              )}
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditTaskForm;
