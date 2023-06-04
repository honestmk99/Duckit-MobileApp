import { Box, Card, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authApi } from "./authStore";
import { memberApi } from "../Members/memberStore";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const whoAmIResult = memberApi.useGetUserQuery(null);
  const [onSubmit, loginResult] = authApi.useLoginMutation();
  const navigate = useNavigate();

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (
      (loginResult.isSuccess && !loginResult.isUninitialized) ||
      (whoAmIResult.isSuccess && !whoAmIResult.isLoading)
    ) {
      navigate("/");
    }
  }, [
    whoAmIResult,
    loginResult.isSuccess,
    navigate,
    loginResult.isUninitialized,
  ]);

  return (
    <Box
      position="absolute"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="grey.100"
    >
      <Card variant="outlined">
        <form onSubmit={form.handleSubmit}>
          <Stack p="2rem" width="25rem" spacing={2}>
            <Typography variant="h4" textAlign="center">
              Log In
            </Typography>
            <TextField
              label="Email"
              id="email"
              name="email"
              fullWidth
              value={form.values.email}
              onChange={form.handleChange}
              error={form.touched.email && !!form.errors.email}
              helperText={form.touched.email && form.errors.email}
            />
            <TextField
              label="Password"
              type="password"
              id="password"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              error={form.touched.password && !!form.errors.password}
              helperText={form.touched.password && form.errors.password}
            />
            <LoadingButton
              fullWidth
              type="submit"
              loading={loginResult.isLoading}
            >
              Log In
            </LoadingButton>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
