import { Grid, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { typDateRange } from '../../../content/types';

interface Props {
    dateRange: typDateRange;
    onChange: (field: keyof typDateRange, value: string) => void;
}

export const TransactionPeriodSection: React.FC<Props> = ({ dateRange, onChange }) => (
    <Grid size={12} sx={{ md: 6 }}>
        <Typography variant="subtitle1" fontWeight="bold">Transactions Period</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
            Select the transactions date and time period.
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
            <DatePicker
                label="Start Date"
                value={dateRange.start ? new Date(dateRange.start) : null}
                onChange={(date) =>
                    onChange('start', date ? date.toISOString().split('T')[0] : '')
                }
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <Typography>-</Typography>
            <DatePicker
                label="End Date"
                value={dateRange.end ? new Date(dateRange.end) : null}
                onChange={(date) =>
                    onChange('end', date ? date.toISOString().split('T')[0] : '')
                }
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
        </Stack>
    </Grid>
);
