import { useEffect, useState } from 'react';
import { imagePaths } from '../assets/imagePaths';
import { Box } from '@mui/material';
import { useAppDispatch } from '../redux/store';
import { initializeAuth } from '../redux/slices/authSlice';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(initializeAuth())
            .unwrap()
            .then((userData) => {
                setLoading(false)
                console.log('User data from initializeAuth:', userData);
                // userData is of type: typUser | null
            })
            .catch((error) => {
                console.error('Failed to initialize auth:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box
                height="100vh"
                width="100vw"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="var(--backgroundColor)"
            >
                <Box
                    component="img"
                    src={imagePaths.logo}
                    alt="Loading..."
                    sx={{
                        width: 150,
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                            from: { transform: 'rotate(0deg)' },
                            to: { transform: 'rotate(360deg)' },
                        },
                    }}
                />
            </Box>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;
