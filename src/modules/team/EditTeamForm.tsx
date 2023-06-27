import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  Stack,
} from "@mui/material";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import InputField from "../common/components/InputField";
import AutoCompleteField from "../common/components/AutoCompleteField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import * as Yup from "yup";
import {
  deleteTeam,
  updateTeam,
  uploadTeamImage,
} from "../../app/team/teamServices";
import { TeamMemberData } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

const validationSchema = Yup.object({
  // overview validation
  overview: Yup.string()
    .min(20, "Overview must be atleast 20 characters long")
    .required("Overview is required!"),

  // members validation
  members: Yup.array().min(1, "Must add atleast one member!"),
});
interface UpdateTeamValues {
  overview: string;
  members: string[];
}
const EditTeamForm = ({ handleClose }: { handleClose: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const isTeamDelete = useAppSelector((state) => state.root.team.isTeamDelete);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const activeTeam = useTeam(activeTeamId as string);
  const initialValues: UpdateTeamValues = {
    overview: activeTeam?.overview as string,
    members: activeTeam?.members as string[],
  };
  const handleSubmit = (values: typeof initialValues) => {
    if (currentUser)
      dispatch(
        updateTeam({
          teamId: activeTeamId as string,
          newOverview: values.overview,
          newMembers: values.members,
        })
      );
  };
  const handleDeleteTeam = (teamId: string) => {
    dispatch(deleteTeam(teamId)).then(() => {
      handleClose();
      navigate("/dashboard");
    });
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (currentUser) {
        dispatch(uploadTeamImage({ file, teamId: activeTeam?.id as string }));
      }
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
        const members: TeamMemberData[] = teamMembers?.filter(
          (member) => member.uid !== activeTeam?.owner
        ) as TeamMemberData[];
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
              <Stack spacing={1} alignItems={"center"}>
                <label
                  htmlFor="image"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 60, sm: 90, md: 150 },
                      height: { xs: 60, sm: 90, md: 150 },
                    }}
                    alt={activeTeam?.teamName}
                    src={activeTeam?.image}
                  />
                </label>
                <input
                  type="file"
                  id="image"
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
              </Stack>
              <InputField
                name="overview"
                label="Overview"
                type="text"
                rows={5}
                multiline
                sx={{ width: "100%" }}
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
                      existingValue={members}
                    />
                  )}
                </Field>
              </FormControl>
              <Stack
                direction={"row"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleClose()}
                  size="small"
                >
                  Back
                </Button>

                <Button
                  color="error"
                  variant="contained"
                  disabled={isTeamDelete}
                  onClick={() => handleDeleteTeam(activeTeamId as string)}
                  size="small"
                >
                  Delete
                  {isTeamDelete && (
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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    isLoading || isEqual(formikProps.values, initialValues)
                  }
                  size="small"
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
  );
};

export default EditTeamForm;
