import { Badge, Box, IconButton, Stack, styled, Typography } from '@mui/material'
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../../provider/ThemeProvider';
import { drawerWidth } from '../DashboardLayout';
import type { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
export default function TopBar({ open, handleDrawerOpen }: {
    open: boolean;
    handleDrawerOpen: () => void
}) {
    const { user } = useSelector((state: RootState) => state.auth);
    const { toggleTheme, mode } = useThemeMode();
    const cartItems = useSelector((state: RootState) => state.cart.items); // adjust according to your slice
    const cartCount = cartItems.reduce((sum, item) => sum + item.count, 0);
    const navigate = useNavigate();

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(!open && {
            marginLeft: 0,
            width: '100%',
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        }),
    }));


    return (
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left side: Menu button */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                        {
                            marginRight: 5,
                        },
                        open && { display: 'none' },
                    ]}
                >
                    <MenuIcon />
                </IconButton>

                {/* Right side: Profile */}
                <Box flexGrow={1} />
                {/* Cart Icon */}
                <IconButton size="large" onClick={() => navigate('/', { replace: true })}>
                    <Badge badgeContent={cartCount} color="error">
                        <ShoppingCartIcon fontSize="inherit" />
                    </Badge>
                </IconButton>
                {/* Theme toggle button */}
                <IconButton size="large" onClick={toggleTheme}>
                    {mode === 'dark' ? <LightModeIcon fontSize="inherit" /> : <DarkModeIcon fontSize="inherit" />}
                </IconButton>
                <Stack direction={'row'} alignItems={'center'} paddingX={'12px'} >
                    <AccountCircleIcon fontSize='large' />
                    <Stack direction="column" alignItems={'flex-start'} marginLeft={1}>
                        <Typography
                            variant='subtitle1'
                            noWrap
                            sx={{
                                maxWidth: '100%',
                                fontWeight: 600,
                                lineHeight: 1,
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                        >
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography>{user?.role}</Typography>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );

}
