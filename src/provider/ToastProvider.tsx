import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../redux/slices/toastSlice';
import type { RootState } from '../redux/store';

export default function ToastProvider() {
    const dispatch = useDispatch();
    const toast = useSelector((state: RootState) => state.toast);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (toast.message) {
            setOpen(true);
        }
    }, [toast]);

    const handleClose = () => {
        setOpen(false);
        dispatch(clearToast());
    };

    if (!toast.message) return null;

    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <Alert onClose={handleClose} severity={toast.severity}>
                {toast.message}
            </Alert>
        </Snackbar>
    );
}
