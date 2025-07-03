import { Box, IconButton, Tooltip, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router';
import { deleteProductById } from '../../../database/delete';
import { useConfirmDialog } from '../../../provider/ConfirmDialogProvider';
import { enmToastSeverity } from '../../../content/enums';
import { setToast } from '../../../redux/slices/toastSlice';
import { useDispatch } from 'react-redux';

export default function ProductActions() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { confirm } = useConfirmDialog();
    const dispatch = useDispatch();

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button variant="outlined" onClick={() => navigate('/product/add')}>Add Product</Button>
            <Box>
                <Tooltip title="Edit">
                    <IconButton onClick={() => navigate(`/product/edit/${id}`)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        onClick={async () => {
                            const confirmed = await confirm({
                                title: "Delete Product",
                                content: "Are you sure you want to delete this product?",
                            });

                            if (!confirmed || !id) return;

                            deleteProductById(id).then(() => {
                                dispatch(setToast({ message: `Deleted Successfully`, severity: enmToastSeverity.success }));
                                navigate('/product');
                            }).catch((error) => {
                                dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }))
                            })
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
