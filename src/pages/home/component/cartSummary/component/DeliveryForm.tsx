import { Stack, TextField, useTheme } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { phoneRegExp } from '../../../../../utils/RegExp';

interface DeliveryFormInputs {
    name: string;
    phone: string;
    address: string;
}

interface Props {
    register: UseFormRegister<DeliveryFormInputs>;
    errors: FieldErrors<DeliveryFormInputs>;
}

export default function DeliveryForm({ register, errors }: Props) {
    const theme = useTheme();

    return (
        <>
            <Stack direction="column" sx={{ mt: 2 }}>
                <label htmlFor="name" className="label-text">Customer Name</label>
                <TextField
                    id="name"
                    variant="filled"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name ? 'Name is required.' : ''}
                    {...register('name', { required: true, minLength: 2 })}
                    sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottom: `2px solid ${theme.palette.secondary.main}` ,
                        },
                    }}
                />
            </Stack>

            <Stack direction="column" sx={{ mt: 2 }}>
                <label htmlFor="phone" className="label-text">Phone Number</label>
                <TextField
                    id="phone"
                    variant="filled"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone ? 'Enter a valid phone number.' : ''}
                    {...register('phone', { required: true, pattern: phoneRegExp })}
                    sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottom: `2px solid ${theme.palette.secondary.main}`,
                        },
                    }}
                />
            </Stack>

            <Stack direction="column" sx={{ mt: 2 }}>
                <label htmlFor="address" className="label-text">Delivery Address</label>
                <TextField
                    id="address"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address ? 'Address is required.' : ''}
                    {...register('address', { required: true, minLength: 5 })}
                    sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottom: `2px solid ${theme.palette.secondary.main}`,
                        },
                    }}
                />
            </Stack>
        </>
    );
}
