import {
  Box,
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
import { Task } from "../../utils/types";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { assignTasks, getCurrentUserTeams } from "../../app/team/teamServices";
import { genreateId } from "../../utils/utils";

enum PriorityOption {
  Low,
  Medium,
  High,
  Urgent,
}
const initialValues: Task = {
  title: "",
  description: "",
  priority: PriorityOption.Medium.toString(),
  deadline: dayjs().toString(),
  assignedTo: [],
  status: "todo",
  id: genreateId(6),
  comments: [],
};

const validationSchema = Yup.object({
  // title validation
  title: Yup.string().required("Provide a title for task!"),

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

const CreateTaskForm = ({ handleClose }: { handleClose: () => void }) => {
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const dispatch = useAppDispatch();
  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
    if (activeTeamId && currentUser) {
      dispatch(assignTasks({ teamId: activeTeamId, taskData: values })).then(
        () => {
          dispatch(
            getCurrentUserTeams({
              name: currentUser.name,
              email: currentUser.email,
            })
          );
        }
      );
      handleClose();
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
              spacing={3}
              alignItems={"center"}
              justifyContent={"center"}
              width={500}
              m={"auto"}
              direction={"row"}
              p={1}
            >
              <Stack spacing={1}>
                <InputField name="title" label="Title" type="text" />
                <InputField
                  name="description"
                  label="Description"
                  type="text"
                  rows={5}
                  multiline
                />
              </Stack>
              <Stack spacing={1}>
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
              </Stack>
            </Stack>
            <Box display={"flex"} justifyContent={"center"} mt={2}>
              <Button type="submit" variant="contained" disabled={isLoading}>
                Assign task
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
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateTaskForm;
