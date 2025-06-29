import { imagePaths } from '../../assets/imagePaths'
import './Login.css'
import { Checkbox, FormControlLabel, Stack, Button, Box, TextField, IconButton } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Link, useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { regEmail, regPassword } from '../../utils/RegExp';
import { useAppDispatch } from '../../redux/store';
import { loginUser, loginUserWithFacebook, loginUserWithGoogle } from '../../redux/slices/authSlice';

interface IFormInput {
  email: string
  password: string
}
export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(loginUser(data)).unwrap().then(() => {
      navigate('/')
    })
  };
  function loginWithGoogle() {
    dispatch(loginUserWithGoogle()).unwrap().then(() => {
      navigate('/')
    })
  }
  function loginWithFacebook() {
    dispatch(loginUserWithFacebook()).unwrap().then(() => {
      navigate('/')
    })
  }
  return (
    <div className='body'>
      <div className='main'>
        <img src={imagePaths.logo} alt="Logo" className='logo' />
        <h2 style={{ fontSize: 'xx-large' }}>Sign In</h2>
        <p style={{ margin: 0 }}>Sign in to stay connected</p>
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
          <Stack direction={'column'}>
            <label htmlFor="email" className='label-text'>Email</label>
            <TextField
              error={Boolean(errors.email)}
              helperText={errors.email ? "Enter a valid email address (e.g. name@example.com)." : null}
              {...register("email", { required: true, pattern: regEmail })}
              id="email"
              variant="filled"
              sx={{
                '& .MuiFilledInput-root:after': {
                  borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                }
              }}
            />

          </Stack>
          <Stack direction={'column'}>
            <label htmlFor="password" className='label-text'>Password</label>
            <TextField
              error={Boolean(errors.password)}
              helperText={errors.password ? "Password must be 8+ chars, include uppercase, lowercase, number, and special (!@#$%^&*)." : null}
              {...register("password", { required: true, pattern: regPassword })}
              id="password"
              variant="filled"
              sx={{
                '& .MuiFilledInput-root:after': {
                  borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                }
              }}
            />
          </Stack>
          <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: 'var(--secondColor)',
                    '&.Mui-checked': {
                      color: 'var(--secondColor)',
                    }
                  }}
                />
              }
              label="Remember me"
            />
            <Link to="/signup" className='link-text'>Forget Password?</Link>
          </Stack>
          <Button
            variant="contained"
            type="submit"
            className="custom-button sign-button"
          >  Sign In
          </Button>
        </Box>
        <p>or sign in with other accounts?</p>
        <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <IconButton onClick={loginWithGoogle} aria-label="Login with Google">
            <GoogleIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={loginWithFacebook} aria-label="Login with Facebook">
            <FacebookRoundedIcon fontSize="large" />
          </IconButton>
        </Stack>
        <p>
          Don’t have an account?{' '}
          <Link to="/signup" className="link-text">
            Click here to sign up.
          </Link>
        </p>
      </div>
    </div>
  )
}
