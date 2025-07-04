import { createTheme } from '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';
import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface TypographyVariants {
        title: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        title?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        title: true;
    }
}
const lightBaseColors = {
    primary: '#D2C3B8',
    primaryText: '#844511',
    secondary: '#D78325',
    background: '#E5DCD3',
    darkText: '#2E2C2A',
    divider: '#c7b5a8'
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: lightBaseColors.primary,           // Used as the main primary color for components like buttons, AppBar
            contrastText: lightBaseColors.primaryText   // Text/icon color that appears on top of primary color,
        },
        secondary: {
            main: lightBaseColors.secondary,         // Used for secondary elements like FloatingActionButton, Chips, etc.
        },
        background: {
            default: lightBaseColors.background,     // Default background for pages
            paper: lightBaseColors.primary,            // Background for surfaces like cards, modals, drawers
        },
        text: {
            primary: lightBaseColors.darkText,       // Main text color used across the UI
        },
        error: { main: '#f44336' },
        warning: { main: '#ff9800' },
        info: { main: '#2196f3' },
        success: { main: '#4caf50' },
        grey: {
            100: '#f5f5f5',
            900: '#212121',
        },
        divider: lightBaseColors.divider, // Color for dividers (e.g. lines between list items, card sections)
    },
    typography: {
        title: {
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: lightBaseColors.primaryText, // custom color for title text
        },
        fontFamily: '"Inter", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    color: lightBaseColors.secondary,
                    borderColor: lightBaseColors.secondary,
                    '&:hover': {
                        borderColor: lightBaseColors.secondary,
                        backgroundColor: 'rgba(215, 131, 37, 0.08)',
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                columnHeaderTitle: {
                    color: lightBaseColors.primaryText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: lightBaseColors.primaryText, // your desired default icon color
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: lightBaseColors.primaryText,
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: lightBaseColors.primaryText, // Set default icon color globally
                    text: lightBaseColors.primaryText
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: lightBaseColors.primaryText,
                },
                secondary: {
                    color: lightBaseColors.primaryText,
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin', // Firefox
                    scrollbarColor: `${lightBaseColors.primary} ${lightBaseColors.background}`, // Firefox
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: lightBaseColors.background,
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: lightBaseColors.primary,
                    borderRadius: '8px',
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: lightBaseColors.secondary,
                },
            },
        },
    }
});