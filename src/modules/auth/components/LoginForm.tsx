import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { LoginUserValues } from "../../../utils/types";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { login } from "../../../app/auth/authServices";
import { Suspense, lazy, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// dynamically importing input field
const InputField = lazy(() => import("../../common/components/InputField"));

// initial values for login form
const initialValues: LoginUserValues = {
  email: "",
  password: "",
};

// validation schema
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
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  // form submit handler
  const handleSubmit = async (values: typeof initialValues) => {
    const { email, password } = values;

    const userExists = await dispatch(login({ email, password }));
    if (userExists.meta.requestStatus !== "rejected") {
      navigate("/dashboard");
    }
  };

  return (
    <Suspense fallback={null}>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange
        >
          {(formikProps) => {
            return (
              <Form style={{ display: "flex", justifyContent: "center" }}>
                <Stack spacing={1} sx={{ alignItems: { xs: "center" } }}  width={344}>
                  {/* Email field */}
                  <InputField name="email" label="Email" type="email" />
                  {/* Password field */}
                  <InputField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          aria-label="toggle-password-visibilty"
                          position="end"
                        >
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Login and reset button */}
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
    </Suspense>
  );
};

export default LoginForm;
