import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, Typography } from "@mui/material";
import InputField from "../../common/components/InputField";
import { SignUpUserValues } from "../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../app/auth/authServices";
import { useEffect } from "react";

const initialValues: SignUpUserValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  // name validation
  name: Yup.string().max(40, "Too Long!").required("Name is required!"),

  // email validation
  email: Yup.string()
    .required("Email is required!")
    .email("Invalid email format!"),

  // phone number validation
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid mobile number")
    .required("Mobile number is required!"),

  // password validation
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters long")
    .required("Password is required!"),

  // confirm password validation
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Enter password again to confirm!"),
});
const token = localStorage.getItem("token");
const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.root.auth.error);
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    } else {
      return;
    }
  });
  const handleSumbit = async (values: typeof initialValues) => {
    const { name, email, password } = values;
    const newUser = await dispatch(signup({name, email, password}));
    console.log(newUser.meta.requestStatus);
    
    if (newUser.meta.requestStatus !== 'rejected') {
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSumbit}
        validateOnChange
      >
        {(formikProps) => {
          return (
            <Form>
              <Stack spacing={1} sx={{ alignItems: { xs: "center" } }}>
                <InputField name="name" label="Name" type="text" />
                <InputField name="email" label="Email" type="email" />
                <InputField name="password" label="Password" type="password" />
                <InputField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                />
                <InputField name="phone" label="Phone number" type="text" />
                <Stack direction={"row"} spacing={3}>
                  <Button type="submit" variant="contained">
                    Sign Up
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    color="warning"
                    onClick={() => formikProps.resetForm()}
                  >
                    {" "}
                    Reset
                  </Button>
                </Stack>
                {error && <Typography variant="subtitle1" color={'red'}>User already exists!</Typography>}
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default SignUpForm;
