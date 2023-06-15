import { Button, CircularProgress, FormControl, Stack } from "@mui/material";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import InputField from "../common/components/InputField";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import * as Yup from "yup";
import { getCurrentUserTeams, updateTeam } from "../../app/team/teamServices";
import { TeamMemberData } from "../../utils/types";

const validationSchema = Yup.object({
  // overview validation
  overview: Yup.string()
    .min(20, "Overview must be atleast 20 characters long")
    .required("Overview is required!"),

  //   // members validation
  //   members: Yup.array()
  //     .min(1, "Must add atleast one member!")
  //      ,
});
interface UpdateTeamValues {
  overview: string;
  members: TeamMemberData[];
}
const EditTeamForm = ({ handleClose }: { handleClose: () => void }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeam = useTeam(activeTeamId as string);
  const initialValues: UpdateTeamValues = {
    overview: activeTeam?.overview as string,
    members: [],
  };
  const handleSubmit = (values: typeof initialValues) => {
    if (currentUser)
      dispatch(
        updateTeam({
          teamId: activeTeamId as string,
          newOverview: values.overview,
          newMembers: values.members,
        })
      ).then(() => {
        dispatch(
          getCurrentUserTeams({
            name: currentUser.name,
            email: currentUser.email,
          })
        );
      });
    handleClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
    >
      <Form>
        <Stack
          spacing={1}
          alignItems={"center"}
          justifyContent={"center"}
          width={300}
          m={"auto"}
          p={2}
        >
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
                  mode="team-edit"
                  fieldName="members"
                />
              )}
            </Field>
          </FormControl>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Edit team
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

export default EditTeamForm;
