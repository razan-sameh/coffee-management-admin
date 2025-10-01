import {
    Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    List, useTheme, styled, Drawer as MuiDrawer, type Theme, type CSSObject
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../redux/store';
import { logoutUser } from '../../../redux/slices/authSlice';
import { imagePaths } from '../../../assets/imagePaths';
import { drawerWidth } from '../DashboardLayout';
import { useThemeMode } from '../../../provider/ThemeProvider';
import DrawerHeader from './DrawerHeaderStyle';
import { useRolePermissions } from '../../../hook/useRolePermissions';
import { BsBoxSeamFill } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    width: 65,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

interface SideBarProps {
    open: boolean;
    handleDrawerClose: () => void;
    isMobile: boolean;
}

export default function SideBar({ open, handleDrawerClose, isMobile }: SideBarProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { mode } = useThemeMode();
    const { permissions } = useRolePermissions();
    const routelist = [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "User", icon: <GroupIcon />, path: "user" },
        { text: "Category", icon: <BiSolidCategory size={24} />, path: "category" },
        { text: "Product", icon: <BsBoxSeamFill size={20} />, path: "product" },
        { text: "Order", icon: <FaShoppingCart size={20} />, path: "order" },
        ...(permissions.canViewReports ? [{ text: "Dashboard", icon: <BarChartIcon />, path: "Dashboard" }] : []),
        ...(permissions.canViewReports ? [{ text: "Reports", icon: <TbReportAnalytics size={24} />, path: "reports" }] : [])
    ];

    const logout = () => {
        dispatch(logoutUser());
    };

    const drawerContent = (
        <>
            <DrawerHeader>
                <img
                    src={mode === 'dark' ? imagePaths.darkThemeLogo : imagePaths.lightThemeLogo}
                    alt="Logo"
                    width={50}
                    height={50}
                />
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {routelist.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) handleDrawerClose();
                            }}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                justifyContent: open ? 'initial' : 'center',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem key="logout" disablePadding sx={{ display: 'block', mt: 'auto' }}>
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            minHeight: 48,
                            px: 2.5,
                            justifyContent: open ? 'initial' : 'center',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    if (isMobile) {
        return (
            <MuiDrawer
                variant="temporary"
                open={open}
                onClose={handleDrawerClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': { width: drawerWidth },
                }}
            >
                {drawerContent}
            </MuiDrawer>
        );
    }

    return <Drawer variant="permanent" open={open}>{drawerContent}</Drawer>;
}
