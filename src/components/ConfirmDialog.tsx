import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography
} from "@mui/material";

type Props = {
    open: boolean;
    title?: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmDialog({
    open, title = "Confirm", content, onClose, onConfirm,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{content}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}
