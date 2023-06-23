import { Button, Collapse, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "../../common/components/InputField";

const initialValues = {
  bio: "",
  phone: "",
};
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
}: {
  handleClose: () => void;
  isEditFormOpen: boolean;
}) => {
  const handleGoBack = () => {
    handleClose();
  };
  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
  };
  return (
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
                alignItems={"center"}
                justifyContent={"center"}
                p={2}
              >
                <InputField
                  name="bio"
                  label="Bio"
                  type="text"
                  rows={10}
                  multiline
                  width={"100%"}
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
  );
};

export default UserEdit;
