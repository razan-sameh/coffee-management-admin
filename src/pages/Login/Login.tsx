import { TextField, Stack, Button, Box, useTheme } from '@mui/material'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../../redux/store'
import { loginUser, loginUserWithGoogle } from '../../redux/slices/authSlice'
import { regEmail, regPassword } from '../../utils/RegExp'
import AuthLayout from '../../components/AuthLayout'
import { Link, useNavigate } from 'react-router'

interface IFormInput {
  email: string
  password: string
}

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(loginUser(data)).unwrap().then(() => navigate('/'))
  }

  const loginWithGoogle = () => {
    dispatch(loginUserWithGoogle()).unwrap().then(() => navigate('/'))
  }

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Sign in to stay connected"
      googleLoginHandler={loginWithGoogle}
      bottomText="Don’t have an account?"
      bottomLinkText="Click here to sign up."
      bottomLinkHref="/signup"
      width="40%"
    >
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        noValidate
        autoComplete="off"
      >
        <Stack direction="column">
          <TextField
            label="Email"
            error={Boolean(errors.email)}
            helperText={
              errors.email ? 'Enter a valid email address (e.g. name@example.com).' : null
            }
            {...register('email', { required: true, pattern: regEmail })}
            variant="filled"
            sx={{
              '& .MuiFilledInput-root:after': {
                borderBottom: `2px solid ${theme.palette.secondary.main}`
              }
            }}
          />
        </Stack>

        <Stack direction="column">
          <TextField
            label="Password"
            error={Boolean(errors.password)}
            helperText={
              errors.password
                ? 'Password must be 8+ chars, include uppercase, lowercase, number, and special (!@#$%^&*).'
                : null
            }
            {...register('password', { required: true, pattern: regPassword })}
            variant="filled"
            sx={{
              '& .MuiFilledInput-root:after': {
                borderBottom: `2px solid ${theme.palette.secondary.main}`
              }
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Link to="/forgetPassword" style={{ textDecoration: 'underline', color: theme.palette.secondary.main }}>
            Forget Password?
          </Link>
        </Stack>

        <Button
          variant="contained"
          type="submit"
          sx={{
            m: 2,
            width: 120,
            alignSelf: 'center',
            backgroundColor: 'secondary.main'
          }}
        >
          Sign In
        </Button>
      </Box>
    </AuthLayout>
  )
}
