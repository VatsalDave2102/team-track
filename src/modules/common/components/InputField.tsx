import { Box, TextField, TextFieldProps } from "@mui/material";
import { FieldHookConfig, useField } from "formik";
import React from "react";

type InputFieldProps = FieldHookConfig<string> & TextFieldProps;

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const showError = meta.touched && meta.error;

  return (
    <Box>
    <TextField
      {...field}
      {...props}
      label={label}
      error={!!showError}
      helperText={showError ? meta.error : " "}
    />
    </Box>
  );
};
``;

export default InputField;
