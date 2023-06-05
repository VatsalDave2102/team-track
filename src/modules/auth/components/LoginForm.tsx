import { Box, Button, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "../../common/components/InputField";
import { LoginInitialValues } from "../../../utils/types";

const initialValues: LoginInitialValues = {
  email: "",
  password: "",
};
const validationSchema = Yup.object({
  // email validation
  email: Yup.string()
    .required("Email is required!")
    .email("Invalid email format!"),

  // password validation
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters long")
    .required("Password is required!"),
});
const LoginForm = () => {
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values: typeof initialValues) => {
          console.log(values);
        }}
        validateOnChange
      >
        {(formikProps) => {
          return (
            <Form>
              <Stack spacing={1} sx={{ alignItems: { xs: "center" } }}>
                <InputField name="email" label="Email" type="email" />
                <InputField name="password" label="Password" type="password" />

                <Stack direction={"row"} spacing={3}>
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    color="warning"
                    onClick={() => formikProps.resetForm()}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default LoginForm;
