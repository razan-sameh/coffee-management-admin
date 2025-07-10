import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';

type SummaryCardProps = {
    label: string;
    value: number;
    info: string;
    color: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, info, color }) => {
    const theme = useTheme();

    return (
        <Card sx={{ backgroundColor: color, height: '100%' }}>
            <CardContent>
                <Typography variant="subtitle1" color={theme.palette.text.primary}>{label}</Typography>
                <Typography variant="h6" color={theme.palette.text.primary}>{value}</Typography>
                <Typography variant="caption" color={theme.palette.text.primary}>{info}</Typography>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
