import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
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
import InputField from "../common/components/InputField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Yup from "yup";
import dayjs from "dayjs";
import { PriorityOption, Task, Tasks, TeamMemberData } from "../../utils/types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  deleteTask,
  getCurrentUserTeams,
  updateTask,
} from "../../app/team/teamServices";
import useTeam from "../../custom-hook/useTeam";

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
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const isTaskDelete = useAppSelector((state) => state.root.team.isTaskDelete);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const activeTeam = useTeam(activeTeamId as string);
  const dispatch = useAppDispatch();
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
        dispatch(getCurrentUserTeams(currentUser.uid));
      });
    }
  };
  const handleTaskDelete = (taskId: string, column: keyof Tasks) => {
    if (activeTeam?.tasks) {
      const updatedTasksArray = Array.from(activeTeam.tasks[column]);
      const taskIndex = updatedTasksArray.findIndex(
        (task) => task.id === taskId
      );
      updatedTasksArray.splice(taskIndex, 1);
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
              width={500}
              m={"auto"}
              p={2}
            >
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
              <Stack direction={"row"} justifyContent={"space-evenly"}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleFormClose()}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disabled={isTaskDelete}
                  onClick={() =>
                    handleTaskDelete(
                      task.id,
                      column.toLowerCase() as keyof Tasks
                    )
                  }
                  color="error"
                >
                  Delete task
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
              </Stack>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditTaskForm;
