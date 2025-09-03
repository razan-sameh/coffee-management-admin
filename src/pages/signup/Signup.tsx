import {
  Stack,
  TextField,
  Button,
  useTheme,
  MenuItem,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../redux/store";
import { signupUser, loginUserWithGoogle } from "../../redux/slices/authSlice";
import { enmRole } from "../../content/enums";
import { regEmail, regPassword } from "../../utils/RegExp";
import { matchIsValidTel, MuiTelInput } from "mui-tel-input";
import AuthLayout from "../../components/AuthLayout";
import { useNavigate } from "react-router";
import type { typPhone } from "../../content/types";
import { useEffect } from "react";

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: typPhone;
  role: { label: string; value: string };
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const phoneValue = watch("phone");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const roleOptions = [
    { value: enmRole.admin, label: enmRole.admin },
    { value: enmRole.manager, label: enmRole.manager },
    { value: enmRole.user, label: enmRole.user },
  ];

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(signupUser(data))
      .unwrap()
      .then(() => {
        navigate("/", { replace: true });
      });
  };

  const loginWithGoogle = () => {
    dispatch(loginUserWithGoogle())
      .unwrap()
      .then(() => navigate("/", { replace: true }));
  };

  useEffect(() => {
    register("phone", {
      required: "Phone number is required",
      validate: (val) => {
        if (!val) return "Phone number is required";
        const fullNumber = `${val.countryCode}${val.number}`;
        return matchIsValidTel(fullNumber) || "Invalid phone number";
      },
    });
  }, [register]);

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Create your account"
      googleLoginHandler={loginWithGoogle}
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
    >
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <TextField
                label="First Name"
                error={Boolean(errors.firstName)}
                helperText={
                  errors.firstName
                    ? "This field is required & min 3 characters."
                    : null
                }
                {...register("firstName", { required: true, minLength: 3 })}
                variant="filled"
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <TextField
                label="Last Name"
                error={Boolean(errors.lastName)}
                helperText={
                  errors.lastName
                    ? "This field is required & min 3 characters."
                    : null
                }
                {...register("lastName", { required: true, minLength: 3 })}
                variant="filled"
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <TextField
                label="Email"
                error={Boolean(errors.email)}
                helperText={
                  errors.email ? "Enter a valid email address." : null
                }
                {...register("email", { required: true, pattern: regEmail })}
                variant="filled"
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <MuiTelInput
                defaultCountry="EG"
                value={
                  phoneValue
                    ? `${phoneValue.countryCode}${phoneValue.number}`
                    : ""
                }
                onChange={(value, info) => {
                  const cleanedNumber = value.replace(/\s+/g, ""); // remove spaces
                  setValue(
                    "phone",
                    {
                      countryCode: `+${info.countryCallingCode ?? ""}`, // add + explicitly
                      countryISO: info.countryCode ?? "",
                      number: cleanedNumber.replace(
                        `+${info.countryCallingCode}`,
                        ""
                      ), // remove country code
                    },
                    { shouldValidate: true }
                  );
                }}
                error={Boolean(errors.phone)}
                helperText={errors.phone ? "Enter a valid phone number." : null}
                variant="filled"
                fullWidth
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <TextField
                label="Password"
                error={Boolean(errors.password)}
                helperText={
                  errors.password
                    ? "Password must be 8+ chars, include uppercase, lowercase, number, and special (!@#$%^&*)."
                    : null
                }
                {...register("password", {
                  required: true,
                  pattern: regPassword,
                })}
                variant="filled"
                type="password"
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="column">
              <TextField
                label="Role"
                select
                defaultValue={enmRole.user}
                error={Boolean(errors.role)}
                helperText={errors.role ? "Please select your role." : null}
                {...register("role", { required: true })}
                variant="filled"
                sx={{
                  "& .MuiFilledInput-root:after": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          sx={{
            m: 2,
            width: 120,
            alignSelf: "center",
            backgroundColor: "secondary.main",
          }}
        >
          Sign Up
        </Button>
      </Box>
    </AuthLayout>
  );
}
