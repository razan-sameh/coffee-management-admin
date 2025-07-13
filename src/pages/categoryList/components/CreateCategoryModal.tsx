import React, { useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CreateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (categoryName: string) => void;
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '90%',
        sm: 400,
    },
    maxWidth: '95vw',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: {
        xs: 2,
        sm: 4,
    },
};


const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = () => {
        if (categoryName.trim()) {
            onSubmit(categoryName);
            setCategoryName('');
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add New Category</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    label="Category Name"
                    placeholder="e.g. Coffee"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateCategoryModal;
