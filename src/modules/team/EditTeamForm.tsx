import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Stack,
} from "@mui/material";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useTeam from "../../custom-hook/useTeam";
import * as Yup from "yup";
import {
  deleteTeam,
  updateTeam,
  uploadTeamImage,
} from "../../app/team/teamServices";
import { CreateTeamValues, TeamMemberData } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";
import { Suspense, lazy, useState } from "react";

const InputField = lazy(() => import("../common/components/InputField"));
const AutoCompleteField = lazy(
  () => import("../common/components/AutoCompleteField")
);

// validation schema
const validationSchema = Yup.object({
  // overview validation
  overview: Yup.string()
    .min(20, "Overview must be atleast 20 characters long")
    .required("Overview is required!"),

  // members validation
  members: Yup.array().min(1, "Must add atleast one member!"),
});

const EditTeamForm = ({ handleFormClose }: { handleFormClose: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isLoading = useAppSelector((state) => state.root.team.isLoading);
  const isTeamDelete = useAppSelector((state) => state.root.team.isTeamDelete);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const teamMembers = useAppSelector(
    (state) => state.root.team.activeTeamMembers
  );
  const activeTeam = useTeam(activeTeamId as string);

  // initial values
  const initialValues: Pick<CreateTeamValues, "overview" | "members"> = {
    overview: activeTeam?.overview as string,
    members: activeTeam?.members as string[],
  };

  // function to open delete dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // function to close delete dialog
  const handleClose = () => {
    setOpen(false);
  };

  // function to handle submit
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

  // function handle deletion of team
  const handleDeleteTeam = (teamId: string) => {
    dispatch(deleteTeam(teamId)).then(() => {
      navigate("/dashboard");
    });
  };

  // function to handle image changing of team
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (currentUser) {
        dispatch(uploadTeamImage({ file, teamId: activeTeam?.id as string }));
      }
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
                {/* Image field */}
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

                  {/* hidden input field */}
                  <input
                    type="file"
                    id="image"
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                  />
                </Stack>

                {/* Overview field */}
                <InputField
                  name="overview"
                  label="Overview"
                  type="text"
                  rows={5}
                  multiline
                  sx={{ width: "100%" }}
                />

                {/* Members autocomplete field */}
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

                {/* Back, delete, save buttons */}
                <Stack
                  direction={"row"}
                  justifyContent={"space-evenly"}
                  alignItems={"center"}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleFormClose}
                    size="small"
                  >
                    Back
                  </Button>

                  <Button
                    color="error"
                    variant="contained"
                    disabled={isTeamDelete}
                    onClick={handleClickOpen}
                    size="small"
                  >
                    Delete
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

      {/* Delete team dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete team</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Delete the team permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleDeleteTeam(activeTeamId as string)}
            autoFocus
            color="error"
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
        </DialogActions>
      </Dialog>
    </Suspense>
  );
};

export default EditTeamForm;
