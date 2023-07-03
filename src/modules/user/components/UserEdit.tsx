import { Button, Collapse, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../app/hooks";
import { updateUserDetails } from "../../../app/auth/authServices";
import { User } from "../../../utils/types";
import { Suspense, lazy } from "react";

const InputField = lazy(() => import("../../common/components/InputField"));

const validationSchema = Yup.object({
  // bio validation
  bio: Yup.string()
    .min(20, "Bio must be atleast 20 characters long")
    .max(400, "Bio must be lower than 400 characters")
    .required("Bio is required!"),

  // phone number validation
  phone: Yup.string()
    .matches(
      /^\+\d{1,3} \d{10}$/,
      "Invalid mobile number, format is +91 9XXXXXXXXX0"
    )
    .required("Mobile number is required!"),
});
const UserEdit = ({
  handleClose,
  isEditFormOpen,
  currentUser,
}: {
  handleClose: () => void;
  isEditFormOpen: boolean;
  currentUser: User;
}) => {
  const dispatch = useAppDispatch();
  const initialValues = {
    bio: currentUser?.bio as string,
    phone: currentUser?.phone as string,
  };
  const handleGoBack = () => {
    handleClose();
  };
  const handleSubmit = (values: typeof initialValues) => {
    dispatch(
      updateUserDetails({ userData: values, uid: currentUser?.uid as string })
    ).then(() => {
      handleClose();
    });
  };

  return (
    <Suspense>
      <Collapse in={isEditFormOpen}>
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
                  spacing={1}
                  alignItems={"stretch"}
                  justifyContent={"center"}
                  maxWidth={"100%"}
                  m={"auto"}
                  p={2}
                >
                  <InputField
                    name="bio"
                    label="Bio"
                    type="text"
                    rows={10}
                    multiline
                    sx={{ width: "100%" }}
                  />
                  <InputField name="phone" label="Phone" type="text" />
                  <Stack
                    direction={"row"}
                    justifyContent={"space-around"}
                    width={"100%"}
                  >
                    <Button
                      onClick={() => {
                        handleGoBack();
                        formikProps.resetForm();
                      }}
                      color="secondary"
                      variant="contained"
                    >
                      Back
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                      Save
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Collapse>
    </Suspense>
  );
};

export default UserEdit;
