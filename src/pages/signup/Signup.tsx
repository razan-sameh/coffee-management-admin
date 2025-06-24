import { imagePaths } from '../../assets/imagePaths'
import './Signup.css'
import { Checkbox, FormControlLabel, Stack, Button, Box, TextField, Grid, MenuItem, Alert } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Link } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import app from '../../services/configuration'; // adjust the path
import { useState } from 'react';
import type { typUser } from '../../content/types';
import { insertUser } from '../../database/insert';
import { enmRole } from '../../content/enums';

interface IFormInput {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  role: { label: string; value: string }
}
export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
  const [reqError, setReqError] = useState<string | null>(null)
  const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
  const role = [
    {
      value: enmRole.admin,
      label: enmRole.admin,
    },
    {
      value: enmRole.manager,
      label: enmRole.manager,
    },
    {
      value: enmRole.user,
      label: enmRole.user,
    },
  ];
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
    console.log('data.role.value',data.role);
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        
        console.log(res)
        const user: typUser = {
          Uid: res.user.uid,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phone,
          password: data.password,
          role: data.role 
        }
        insertUser(user)
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        console.log(error.message); // helpful to log for debugging
        if (error.code === 'auth/email-already-in-use') {
          setReqError("That email address is already in use!");
        } else if (error.code === 'auth/invalid-email') {
          setReqError("That email address is invalid!");
        } else {
          setReqError("Authentication failed.");
        }
      });
  }

  return (
    <div className='main'>
      <img src={imagePaths.logo} alt="Logo" className='logo' />
      <h2 style={{ fontSize: 'xx-large' }}>Sign Up</h2>
      <p style={{ marginTop: 0 }}>Create your account</p>
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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={6}>
            <Stack direction={'column'}>
              <label htmlFor="firstName" className='label-text'>First Name</label>
              <TextField
                error={Boolean(errors.firstName)}
                helperText={errors.firstName ? "This field is required & min 3 character." : null}
                {...register("firstName", { required: true, minLength: 3 })}
                id="firstName"
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root:after': {
                    borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                  }
                }}
              />
            </Stack>

          </Grid>
          <Grid size={6}>
            <Stack direction={'column'}>
              <label htmlFor="lastName" className='label-text'>Last Name</label>
              <TextField
                error={Boolean(errors.lastName)}
                helperText={errors.lastName ? "This field is required & min 3 character." : null}
                {...register("lastName", { required: true, minLength: 3 })}
                id="lastName"
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root:after': {
                    borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid size={6}>
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
          </Grid>
          <Grid size={6}>
            <Stack direction={'column'}>
              <label htmlFor="phone" className='label-text'>phone Number</label>
              <TextField
                error={Boolean(errors.phone)}
                helperText={errors.phone ? "Enter a valid phone number with or without country code." : null}
                {...register("phone", { required: true, pattern: phoneRegExp })}
                id="phone"
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root:after': {
                    borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid size={6}>
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
          </Grid>
          <Grid size={6}>
            <Stack direction={'column'}>
              <label htmlFor="role" className='label-text'>Role</label>
              <TextField
                error={Boolean(errors.role)}
                helperText={errors.role ? "Please select your role." : null}
                {...register("role", { required: true })}
                id="role"
                select
                defaultValue="User"
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root:after': {
                    borderBottom: '2px solid var(--secondColor)', // active indicator after focus
                  },
                  textAlign: 'left'
                }}
              >
                {role.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Grid>
        </Grid>

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
        </Stack>
        <Button
          variant="contained"
          type="submit"
          className="custom-button sign-button"
        >  Sign Up
        </Button>
      </Box>
      <p>or sign in with other accounts?</p>
      <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <GoogleIcon />
        <FacebookRoundedIcon />
      </Stack>
      <p>
        Already have an Account{' '}
        <Link to="/login" className="link-text">
          sign in
        </Link>
      </p>
      {
        reqError &&
        <Alert variant="filled" severity="error">
          {reqError}
        </Alert>
      }
    </div>
  )
}
