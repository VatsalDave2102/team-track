import {
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
import * as Yup from "yup";
import InputField from "../common/components/InputField";
import AutoCompleteField from "./AutoCompleteField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createTeam } from "../../app/team/teamServices";
import { CreateTeamValues } from "../../utils/types";

const initialValues: CreateTeamValues = {
  teamName: "",
  overview: "",
  members: [],
};
const validationSchema = Yup.object({
  // teamName validation
  teamName: Yup.string().required("Team name is required!"),

  // overview validation
  overview: Yup.string()
    .min(20, "Overview must be atleast 20 characters long")
    .required("Overview is required!"),

  // members validation
  members: Yup.array()
    .min(1, "Must add atleast one member!")
    .required("Must add atleast one member!"),
});

const CreateTeamForm = ({ handleClose }: { handleClose: () => void }) => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);

  const dispatch = useAppDispatch();
  const handleSubmit = (values: typeof initialValues) => {
    if (currentUser) {
      const teamData = {
        teamName: values.teamName,
        overview: values.overview,
        members: values.members,
        owner: { name: currentUser.name, email: currentUser.email },
      };
      dispatch(createTeam(teamData));
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
      <Form>
        <Stack spacing={1} sx={{ alignItems: { xs: "center" } }}>
          <InputField name="teamName" label="Team name" type="text" />
          <InputField
            name="overview"
            label="Overview"
            type="text"
            rows={5}
            multiline
            sx={{ p: 0 }}
          />
          <FormControl error fullWidth>
            <Field name="members">
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
                />
              )}
            </Field>

            <ErrorMessage
              name="members"
              component={FormHelperText}
              className="error"
            />
          </FormControl>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Create team
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
      </Form>
    </Formik>
  );
};

export default CreateTeamForm;
