import {
  Box,
  Card,
  CardContent,
  Typography,
  type SvgIconProps,
} from "@mui/material";
import type { ElementType } from "react";
interface StatCardProps {
  icon: ElementType<SvgIconProps>;
  title: string;
  value: string | number;
  change: string;
  bgcolor?: string;
  iconColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "action"
    | "disabled"
    | "error"
    | "info"
    | "success"
    | "warning";
}
const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  bgcolor,
  iconColor,
}: StatCardProps) => {
  return (
    <Card sx={{ bgcolor, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display={"flex"} alignItems={'center'} marginBottom={2}>
          <Icon color={iconColor}/>
          <Typography variant="h6" marginLeft={1}>{title}</Typography>
        </Box>
        <Typography variant="h4" marginBottom={2}>{value}</Typography>
        <Typography color="success.main">{change}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
