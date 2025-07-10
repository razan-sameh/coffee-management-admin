// TransactionStatusSection.tsx

import { Box, Chip, Grid, Typography } from '@mui/material';
import { enmOrderStatus, enmPaymentMethod, enmPlatform, enmOrderType } from '../../../content/enums';
import type { typFilters } from '../../../content/types';

interface Props {
    tempFilters: typFilters;
    onChange: (field: keyof typFilters, value: string) => void;
}

export const TransactionStatusSection: React.FC<Props> = ({ tempFilters, onChange }) => {
    const renderChips = (label: string, options: string[], field: keyof typFilters) => (
        <>
            <Typography variant="body2" fontWeight="medium">{label}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {options.map((opt) => (
                    <Chip
                        key={opt}
                        label={opt}
                        clickable
                        color={tempFilters[field] === opt ? 'primary' : 'default'}
                        onClick={() => onChange(field, opt)}
                        size="small"
                    />
                ))}
            </Box>
        </>
    );

    return (
        <Grid size={12} sx={{ md: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" mt={2}>Transactions Status</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                You can choose several types from the options.
            </Typography>
            {renderChips('Order Status', Object.values(enmOrderStatus), 'status')}
            {renderChips('Order Payment', Object.values(enmPaymentMethod), 'paymentMethod')}
            {renderChips('Order Platform', Object.values(enmPlatform), 'platform')}
            {renderChips('Order Type', Object.values(enmOrderType), 'orderType')}
        </Grid>
    );
};
