import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerHeader from './components/DrawerHeaderStyle';
import { Outlet } from 'react-router';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
export const drawerWidth = 240;
export default function DashboardLayout() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
    <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
            <SideBar open={open} handleDrawerClose={handleDrawerClose} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}
