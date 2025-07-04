import { Box, Typography } from "@mui/material";
import { imagePaths } from "../../../assets/imagePaths";
import type { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
export default function HeroBanner() {
        const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Box
            sx={{
                backgroundImage: `url(${imagePaths.homeBG2})`, // Replace with your actual image
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                borderRadius: 3,
                p: 4,
                mb: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                height: 300
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                    Hello,{' '} {user?.firstName} {' '} {user?.lastName}
                </Typography>
            </Box>

            {/* Optional translucent overlay
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: 3,
                }}
            /> */}
        </Box>
        )
}
