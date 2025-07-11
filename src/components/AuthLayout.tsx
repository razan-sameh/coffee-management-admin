import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { imagePaths } from '../assets/imagePaths'
import { Link } from 'react-router'


interface AuthLayoutProps {
    title: string
    subtitle: string
    children: React.ReactNode
    googleLoginHandler: () => void
    bottomText: string
    bottomLinkText: string
    bottomLinkHref: string
    width?: string
}

export default function AuthLayout({
    title,
    subtitle,
    children,
    googleLoginHandler,
    bottomText,
    bottomLinkText,
    bottomLinkHref,
    width = '60%'
}: AuthLayoutProps) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                minHeight: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: {
                    xs: 'none',
                    md: `url(${imagePaths.CupCoffee})`
                },
                backgroundRepeat: 'no-repeat',
                backgroundPosition: {
                    md: 'right',
                    lg: 'bottom right'
                },
                backgroundSize: '30%',
                p: { xs: 2, md: 8 }
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', md: width },
                    p: { xs: 2, sm: 4 }
                }}
            >
                <Box
                    component="img"
                    src={imagePaths.logo}
                    alt="Logo"
                    sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2
                    }}
                />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0, textAlign: 'center', mb: 2 }}>
                    {subtitle}
                </Typography>

                {children}

                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    or sign in with other accounts?
                </Typography>

                <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
                    <IconButton onClick={googleLoginHandler}>
                        <GoogleIcon fontSize="large" />
                    </IconButton>
                </Stack>

                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                    {bottomText}{' '}
                    <Link
                        to={bottomLinkHref}
                        style={{
                            textDecoration: 'underline',
                            color: theme.palette.secondary.main
                        }}
                    >
                        {bottomLinkText}
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}
