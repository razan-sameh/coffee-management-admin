import { useEffect, useState } from 'react';
import { imagePaths } from '../assets/imagePaths';
import { Box, useTheme } from '@mui/material';
import { useAppDispatch } from '../redux/store';
import { initializeAuth, logoutUser, setUser } from '../redux/slices/authSlice';
import type { typUser } from '../content/types';
import { listenToUser } from '../database/select';
import { enmRole, enmToastSeverity } from '../content/enums';
import { setToast } from '../redux/slices/toastSlice';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        dispatch(initializeAuth())
            .unwrap()
            .then((userData) => {
                if (userData) {
                    unsubscribe = listenToUser(userData.Uid, (updatedUser: typUser) => {
                        if (updatedUser.role === enmRole.customer || updatedUser.isActive == false) {
                            dispatch(setToast({
                                message: "Access denied.",
                                severity: enmToastSeverity.error,
                            }));
                            dispatch(logoutUser());
                            return;
                        }

                        dispatch(setUser(updatedUser));
                    });
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to initialize auth:', error);
                setLoading(false);
            });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [dispatch]);

    if (loading) {
        return (
            <Box
                height="100vh"
                width="100vw"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor={theme.palette.background.default}
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
