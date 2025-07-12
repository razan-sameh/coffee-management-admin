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
                <Typography
                    variant="subtitle1"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="h6"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}
                >
                    {value}
                </Typography>
                <Typography
                    variant="caption"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                >
                    {info}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
