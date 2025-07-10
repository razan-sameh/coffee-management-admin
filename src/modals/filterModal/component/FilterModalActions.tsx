import { Button, DialogActions } from '@mui/material';

interface Props {
    onCancel: () => void;
    onReset: () => void;
    onApply: () => void;
}

export const FilterModalActions: React.FC<Props> = ({ onCancel, onReset, onApply }) => (
    <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ mr: 1 }}>
            Cancel
        </Button>
        <Button onClick={onReset} variant="outlined" sx={{ mr: 1 }}>
            Reset Filter
        </Button>
        <Button onClick={onApply} variant="contained" color="primary">
            Apply Filter
        </Button>
    </DialogActions>
);
