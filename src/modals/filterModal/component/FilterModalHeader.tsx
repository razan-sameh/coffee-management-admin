import { DialogTitle, Typography, IconButton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Props {
    onClose: () => void;
}

export const FilterModalHeader: React.FC<Props> = ({ onClose }) => (
    <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filter Data</Typography>
            <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary">
            Please complete the following form to filter data!
        </Typography>
    </DialogTitle>
);
