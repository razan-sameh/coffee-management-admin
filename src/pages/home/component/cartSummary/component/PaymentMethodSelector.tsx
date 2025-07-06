import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { enmPaymentMethod } from '../../../../../content/enums';

interface Props {
    value: string;
    onChange: (val: enmPaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: Props) {
    return (
        <FormControl sx={{ mt: 2 }}>
            <FormLabel
                sx={{
                    fontWeight: 'bold',
                    '&.MuiFormLabel-root': {
                        color: theme => theme.palette.text.primary,
                    },
                }}
            >Payment Method</FormLabel>
            <RadioGroup
                row
                value={value}
                onChange={(e) => onChange(e.target.value as enmPaymentMethod)}
            >
                <FormControlLabel value={enmPaymentMethod.cash} control={<Radio />} label="Cash" />
                <FormControlLabel value={enmPaymentMethod.CreditCard} control={<Radio />} label="Credit Card" />
            </RadioGroup>
        </FormControl>
    );
}
