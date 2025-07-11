import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../../redux/store';
import { sendResetPasswordEmail } from '../../redux/slices/authSlice';
import { regEmail } from '../../utils/RegExp';

interface IResetForm {
    email: string;
}

export default function ForgetPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<IResetForm>();
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<IResetForm> = ({ email }) => {
        dispatch(sendResetPasswordEmail(email));
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>Reset Password</Typography>
            <Typography variant="body2" gutterBottom>
                Enter your email address and we’ll send you a link to reset your password.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email && "Enter a valid email."}
                    {...register("email", { required: true, pattern: regEmail })}
                />
                <Button type="submit" variant="contained" fullWidth>
                    Send Reset Link
                </Button>
            </form>
        </Box>
    );
}
