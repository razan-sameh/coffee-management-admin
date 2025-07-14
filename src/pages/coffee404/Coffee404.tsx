// Coffee404.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee'; // Optional cute touch
import { useNavigate } from 'react-router';

const Coffee404: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
            textAlign="center"
            px={2}
        >
            <CoffeeIcon sx={{ fontSize: 80, color: 'primaryText', mb: 2 }} />

            <Typography variant="title" gutterBottom>
                Oops! Page Not Found
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
                Looks like you've taken a wrong sip. Let's get you back to the main brew.
            </Typography>

            <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default Coffee404;
