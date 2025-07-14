import { Button, Typography } from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";

export const ActiveCell = ({ isActive }: { isActive: boolean }) => {
    const icon = isActive ? (
        <CheckCircleIcon fontSize="inherit" />
    ) : (
        <CancelIcon fontSize="inherit" />
    );

    const color = isActive ? "success" : "error";
    const label = isActive ? "Active" : "Inactive";

    return (
        <Button
            variant="contained"
            size="small"
            color={color}
            disableRipple
            disableElevation
            sx={{ pointerEvents: "none", cursor: "default" }}
        >
            {icon}
            <Typography variant="body2" sx={{ ml: 1 }}>
                {label}
            </Typography>
        </Button>
    );
};
