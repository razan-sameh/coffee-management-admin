import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { ReactNode } from "react";

type SideModalProps = {
  open: boolean;
  onClose: () => void;
  width?: string | number; // default width = 70%
  children: ReactNode;
};

export default function SideModal({
  open,
  onClose,
  width = "70%",
  children,
}: SideModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          width,
          ml: "auto", // push it to the right
          borderRadius: 0,
        },
      }}
    >
      {/* Close button */}

      <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          left: 16,
          bottom: 16,
          border: 1,
          borderColor: theme.palette.primary.contrastText,
          borderRadius: 0,
        }}
      >
        <ArrowBackIcon />
        <Typography variant="body2">Back</Typography>
      </IconButton>
    </Dialog>
  );
}
