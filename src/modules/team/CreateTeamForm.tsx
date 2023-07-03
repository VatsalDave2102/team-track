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
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createTeam } from "../../app/team/teamServices";
import { CreateTeamValues } from "../../utils/types";
import { Suspense, lazy } from "react";

const InputField = lazy(() => import("../common/components/InputField"));
const AutoCompleteField = lazy(
  () => import("../common/components/AutoCompleteField")
);

const initialValues: CreateTeamValues = {
  teamName: "",
  overview: "",
  members: [],
};
const validationSchema = Yup.object({
  // teamName validation
  teamName: Yup.string()
    .max(15, "Team name too long!")
    .required("Team name is required!"),

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
        owner: currentUser.uid,
        image: "",
      };
      dispatch(createTeam(teamData));
      handleClose();
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
        <Form>
          <Stack
            spacing={1}
            alignItems={"stretch"}
            justifyContent={"center"}
            width={{ xs: 250, sm: 500 }}
            m={"auto"}
            p={2}
          >
            <InputField name="teamName" label="Team name" type="text" />
            <InputField
              name="overview"
              label="Overview"
              type="text"
              rows={5}
              multiline
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
                    mode="team-create"
                    fieldName="members"
                  />
                )}
              </Field>

              <ErrorMessage
                name="members"
                component={FormHelperText}
                className="error"
              />
            </FormControl>
            <Box display={"flex"} justifyContent={"center"}>
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
            </Box>
          </Stack>
        </Form>
      </Formik>
    </Suspense>
  );
};

export default CreateTeamForm;
