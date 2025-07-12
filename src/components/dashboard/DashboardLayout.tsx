import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerHeader from './components/DrawerHeaderStyle';
import { Outlet } from 'react-router';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { useTheme, useMediaQuery } from '@mui/material';

export const drawerWidth = 240;

export default function DashboardLayout() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
            <SideBar open={open} handleDrawerClose={handleDrawerClose} isMobile={isMobile} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: isMobile ? '100%' : `calc(100% - ${open ? drawerWidth : 65}px)`,
                    transition: 'width 0.3s ease',
                }}
            >
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}
