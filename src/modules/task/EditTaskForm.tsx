import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Stack,
} from "@mui/material";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from "formik";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Yup from "yup";
import { Task, Tasks, TeamMemberData } from "../../utils/types";
import { deleteTask, updateTask } from "../../app/team/teamServices";
import useTeam from "../../custom-hook/useTeam";
import { radioFieldOptions } from "../../utils/utils";
import { isEqual } from "lodash";
import { Suspense, lazy, useState } from "react";

const InputField = lazy(() => import("../common/components/InputField"));
const AutoCompleteField = lazy(
  () => import("../common/components/AutoCompleteField")
);
const DatePickerField = lazy(() => import("./DatePickerField"));
const RadioGroupField = lazy(() => import("./RadioGroupField"));

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

const EditTaskForm = ({
  task,
  column,
  handleModalClose,
  handleFormClose,
}: {
  task: Task;
  column: string;
  handleModalClose: () => void;
  handleFormClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const isTaskDelete = useAppSelector((state) => state.root.team.isTaskDelete);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const activeTeam = useTeam(activeTeamId as string);
  const dispatch = useAppDispatch();

  // initial values for task edit form
  const initialValues: Omit<Task, "title" | "comments"> = {
    id: task.id,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
    assignedTo: task.assignedTo,
  };

  // function to handle submit
  const handleSubmit = (values: typeof initialValues) => {
    if (currentUser) {
      dispatch(
        updateTask({ teamId: activeTeamId as string, taskData: values })
      );
    }
  };

  // function to open delete dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // function to close delete dialog
  const handleClose = () => {
    setOpen(false);
  };

  // function to handle task deletion
  const handleTaskDelete = (taskId: string, column: keyof Tasks) => {
    if (activeTeam?.tasks) {
      // creating a copy of that column in which task was present
      const updatedTasksArray = Array.from(activeTeam.tasks[column]);

      // finding the task index and removing it from array
      const taskIndex = updatedTasksArray.findIndex(
        (task) => task.id === taskId
      );
      updatedTasksArray.splice(taskIndex, 1);

      // dispatching to update firestore and redux store
      dispatch(
        deleteTask({
          teamId: activeTeamId as string,
          taskId,
          updatedTasksArray,
          column,
        })
      ).then(() => {
        handleModalClose();
      });
    }
  };

  return (
    <Suspense fallback={null}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
      >
        {(formikProps) => {
          // getting data of assigned users from teamMembers in redux using their uid
          const assignedTo: TeamMemberData[] = task.assignedTo.map((uid) => {
            const user = teamMembers?.find((member) => member.uid === uid);
            return user ? { uid, name: user.name, email: user.email } : null;
          }) as TeamMemberData[];
          return (
            <Form>
              <Stack
                spacing={2}
                alignItems={"stretch"}
                justifyContent={"center"}
                width={{ xs: "100%", sm: 500 }}
                m={"auto"}
                p={2}
              >
                {/* Description field */}
                <InputField
                  name="description"
                  label="Description"
                  type="text"
                  rows={5}
                  multiline
                  sx={{ width: "100%" }}
                />

                {/* Priority field */}
                <RadioGroupField
                  name="priority"
                  label="Priority"
                  options={radioFieldOptions}
                  value={formikProps.values.priority.toString()}
                  onChange={(value) =>
                    formikProps.setFieldValue("priority", value)
                  }
                />

                {/* Autocomplete field  */}
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
                        existingValue={assignedTo}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="assignedTo"
                    component={FormHelperText}
                    className="error"
                  />
                </FormControl>

                {/* Deadline field */}
                <DatePickerField
                  label="Deadline"
                  value={formikProps.values.deadline}
                  onChange={(value) => {
                    formikProps.setFieldValue("deadline", value);
                  }}
                />

                {/* Back, delete, save buttons */}
                <Stack
                  direction={"row"}
                  justifyContent={"space-evenly"}
                  alignItems={"center"}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleFormClose()}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    disabled={isTaskDelete}
                    onClick={handleClickOpen}
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={
                      isLoading || isEqual(formikProps.values, initialValues)
                    }
                  >
                    Save
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
                </Stack>
              </Stack>
            </Form>
          );
        }}
      </Formik>

      {/* Delete dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete task</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Delete the task permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() =>
              handleTaskDelete(task.id, column.toLowerCase() as keyof Tasks)
            }
            autoFocus
            color="error"
          >
            Delete
            {isTaskDelete && (
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
        </DialogActions>
      </Dialog>
    </Suspense>
  );
};

export default EditTaskForm;
