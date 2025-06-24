// AuthProvider.tsx
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/userSlice';
import { getUserInfo } from '../database/select';
import { imagePaths } from '../assets/imagePaths';
import { Box } from '@mui/material';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubAuth = onAuthStateChanged(auth, user => {
            if (user) {
                console.log({ user });
                const unsubUser = getUserInfo(user.uid, userData => {
                    console.log({ userData });
                    dispatch(setUser(userData));
                    setLoading(false);
                });
                return unsubUser;
            } else {
                dispatch(clearUser());
                setLoading(false);
            }
        });

        return () => unsubAuth();
    }, [dispatch]);

    if (loading) return <Box
        height="100vh"
        width='100vw'
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor='var(--backgroundColor)'
    >
        <Box
            component="img"
            src={imagePaths.logo} // replace with your image path
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
    return <>{children}</>;
};
export default AuthProvider;
