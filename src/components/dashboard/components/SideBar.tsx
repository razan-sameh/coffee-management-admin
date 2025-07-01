import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { styled, useTheme, type CSSObject, type Theme } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import WidgetsIcon from '@mui/icons-material/Widgets';import LocalMallIcon from '@mui/icons-material/LocalMall';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useThemeMode } from '../../../provider/ThemeProvider';
import { useAppDispatch } from '../../../redux/store';
import { logoutUser } from '../../../redux/slices/authSlice';
import { imagePaths } from '../../../assets/imagePaths';
import { drawerWidth } from '../DashboardLayout';
import DrawerHeader from './DrawerHeaderStyle';
export default function SideBar({ open, handleDrawerClose }: { open: boolean, handleDrawerClose: () => void }) {
    const theme = useTheme();
    const navigation = useNavigate()
    const dispatch = useAppDispatch();
    const { mode } = useThemeMode();

    function logout() {
        dispatch(logoutUser())
    }
    const routelist = [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "User", icon: <GroupIcon />, path: "user" },
        { text: "Category", icon: <WidgetsIcon />, path: "category" },
        { text: "Product", icon: <LocalMallIcon />, path: "product" },
        { text: "Order", icon: <ReceiptLongIcon />, path: "order" },
    ];
    const openedMixin = (theme: Theme): CSSObject => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    });

    const closedMixin = (theme: Theme): CSSObject => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    });

    const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme }) => ({
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            variants: [
                {
                    props: ({ open }) => open,
                    style: {
                        ...openedMixin(theme),
                        '& .MuiDrawer-paper': openedMixin(theme),
                    },
                },
                {
                    props: ({ open }) => !open,
                    style: {
                        ...closedMixin(theme),
                        '& .MuiDrawer-paper': closedMixin(theme),
                    },
                },
            ],
        }),
    );
    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                }}
            >
                <img src={mode === 'dark' ? imagePaths.logo : imagePaths.lightThemeLogo} alt="Logo" width={50} height={50} color='white'/>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {routelist.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => navigation(item.path)}
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                },
                                open
                                    ? {
                                        justifyContent: 'initial',
                                    }
                                    : {
                                        justifyContent: 'center',
                                    },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open
                                        ? {
                                            mr: 3,
                                        }
                                        : {
                                            mr: 'auto',
                                        },
                                ]}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item
                                    .text
                                }
                                sx={[
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem
                    key="logout"
                    disablePadding
                    sx={{
                        display: 'block',
                        mt: 'auto', // Pushes it to the bottom
                    }}
                >
                    <ListItemButton onClick={logout}
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
                        <ListItemText
                            primary="Logout"
                            sx={{ opacity: open ? 1 : 0 }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>)
}
