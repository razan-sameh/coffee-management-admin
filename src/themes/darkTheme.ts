import { createTheme } from "@mui/material";
export const darkBaseColors = {
    primary: '#844511',
    background: '#4C280A',
    secondary: '#D78325',
    lightText: '#F5F5F5',
    divider: 'rgba(255, 255, 255, 0.12)'
};
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: darkBaseColors.primary,             // Used as the main primary color for components like buttons, AppBar
            contrastText: darkBaseColors.lightText,   // Text/icon color that appears on top of primary color
        },
        secondary: {
            main: darkBaseColors.secondary,           // Used for secondary elements like FloatingActionButton, Chips, etc.
        },
        background: {
            default: darkBaseColors.background,      // Default background for pages
            paper: darkBaseColors.primary,           // Background for surfaces like cards, modals, drawers
        },
        text: {
            primary: darkBaseColors.lightText,      // Main text color used across the UI
        },
        error: { main: '#f44336' },
        warning: { main: '#ff9800' },
        info: { main: '#2196f3' },
        success: { main: '#4caf50' },
        grey: {
            100: '#f5f5f5',
            900: '#212121',
        },
        divider: darkBaseColors.divider             // Color for dividers (e.g. lines between list items, card sections)
    },
    typography: {
        title: {
            fontWeight: 'bold',
            fontSize: '1.25rem',
        },
        fontFamily: '"Inter", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    color: darkBaseColors.secondary,
                    borderColor: darkBaseColors.secondary,
                    '&:hover': {
                        borderColor: darkBaseColors.secondary,
                        backgroundColor: 'rgba(215, 131, 37, 0.08)',
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                columnHeaderTitle: {
                    fontWeight: 'bold',
                    fontSize: '1rem',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin', // Firefox
                    scrollbarColor: `${darkBaseColors.primary} ${darkBaseColors.background}`, // Firefox
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: darkBaseColors.background,
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: darkBaseColors.primary,
                    borderRadius: '8px',
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: darkBaseColors.secondary,
                },
            },
        },
    }
});