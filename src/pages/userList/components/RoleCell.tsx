// RoleCell.tsx
import { Button, Typography } from "@mui/material";
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Security as SecurityIcon,
    Lock as LockIcon,
    PersonPin as PersonPinIcon,
} from "@mui/icons-material";
import type { ButtonProps } from "@mui/material";
import { enmRole } from "../../../content/enums";
import type { JSX } from "react";

// Optional: define the RoleType based on your enum
type RoleType = keyof typeof enmRole | string;

const getRoleIconAndColor = (
    role: string
): { icon: JSX.Element; color: ButtonProps["color"] } => {
    switch (role) {
        case enmRole.admin:
            return { icon: <AdminPanelSettingsIcon fontSize="inherit" />, color: "error" };
        case enmRole.manager:
            return { icon: <SecurityIcon fontSize="inherit" />, color: "secondary" };
        case enmRole.user:
            return { icon: <LockIcon fontSize="inherit" />, color: "primary" };
        case enmRole.customer:
            return { icon: <PersonPinIcon fontSize="inherit" />, color: "info" };
        default:
            return { icon: <PersonPinIcon fontSize="inherit" />, color: "primary" };
    }
};

export const RoleCell = ({ role }: { role: RoleType }) => {
    const { icon, color } = getRoleIconAndColor(role);

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
                {role}
            </Typography>
        </Button>
    );
};
