import React from 'react';
import { Box } from '@mui/material';

export function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
    const { children, value, index } = props;
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}
