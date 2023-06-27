import {
  Box,
  Button,
  CircularProgress,
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
import InputField from "../common/components/InputField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PriorityOption, Task } from "../../utils/types";
import * as Yup from "yup";
import dayjs from "dayjs";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { assignTasks, getCurrentUserTeams } from "../../app/team/teamServices";
import { genreateId, radioFieldOptions } from "../../utils/utils";
import RadioGroupField from "./RadioGroupField";
import DatePickerField from "./DatePickerField";

const initialValues: Task = {
  title: "",
  description: "",
  priority: PriorityOption.Medium.toString(),
  deadline: dayjs().toString(),
  assignedTo: [],
  id: "",
  comments: [],
};

const validationSchema = Yup.object({
  // title validation
  title: Yup.string()
    .max(15, "Task title too long!")
    .required("Provide a title for task!"),

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
    values.id = genreateId(6);

    if (activeTeamId && currentUser) {
      dispatch(assignTasks({ teamId: activeTeamId, taskData: values })).then(
        () => {
          dispatch(getCurrentUserTeams(currentUser.uid));
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
              width={{ xs: "100%", sm: 500 }}
              m={"auto"}
              direction={{ xs: "column", sm: "row" }}
              p={2}
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
              <Stack spacing={2}>
                <RadioGroupField
                  name="priority"
                  label="Priority"
                  options={radioFieldOptions}
                  value={formikProps.values.priority.toString()}
                  onChange={(value) =>
                    formikProps.setFieldValue("priority", value)
                  }
                />

                <FormControl error fullWidth>
                  <Field name="assignedTo">
                    {({
                      field,
                      form,
                    }: {
                      field: FieldProps["field"];
                      form: FormikProps<FormData>;
                    }) => {
                      return (
                        <AutoCompleteField
                          {...field}
                          setFieldValue={form.setFieldValue}
                          mode="task-assign"
                          fieldName="assignedTo"
                        />
                      );
                    }}
                  </Field>

                  <ErrorMessage
                    name="assignedTo"
                    component={FormHelperText}
                    className="error"
                  />
                </FormControl>

                <DatePickerField
                  label="Deadline"
                  value={formikProps.values.deadline}
                  onChange={(value) => {
                    formikProps.setFieldValue("deadline", value);
                  }}
                />
              </Stack>
            </Stack>
            <Box display={"flex"} justifyContent={"center"} my={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                size="small"
              >
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
