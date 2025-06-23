import { imagePaths } from '../../assets/imagePaths'
import './Login.css'
import { Checkbox, FormControlLabel, Stack, Button, Box, TextField } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Link } from 'react-router';
export default function Login() {
  return (
    <div className='main'>
      <img src={imagePaths.logo} alt="Logo" className='logo' />
      <h2 style={{ fontSize: 'xx-large' }}>Sign In</h2>
      <p style={{ margin: 0 }}>Sign in to stay connected</p>
      <Box
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
      </Box>
      <Button
        variant="contained"
        type="submit"
        className="custom-button"
      >  Sign In
      </Button>
      <p>or sign in with other accounts?</p>
      <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <GoogleIcon />
        <FacebookRoundedIcon />
      </Stack>
      <p>
        Don’t have an account?{' '}
        <Link to="/signup" className="link-text">
          Click here to sign up.
        </Link>
      </p>
    </div>
  )
}
