import {
    GridActionsCellItem,
    GridRowModes,
    type GridRowId,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";

export const getActions = (
    id: GridRowId,
    rowModesModel: GridRowModesModel,
    {
        onEdit,
        onSave,
        onDelete,
        onCancel,
        onView,
        showDetails = false,
        showEditDelete = true, // 👈 new prop
    }: {
        onEdit: (id: GridRowId) => () => void;
        onSave: (id: GridRowId) => () => void;
        onDelete: (id: GridRowId) => () => void;
        onCancel: (id: GridRowId) => () => void;
        onView?: (id: GridRowId) => () => void;
        showDetails?: boolean;
        showEditDelete?: boolean; // 👈 add to type
    }
) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    if (isInEditMode) {
        return [
            <GridActionsCellItem key="save" icon={<SaveIcon />} label="Save" onClick={onSave(id)} />,
            <GridActionsCellItem key="cancel" icon={<CancelIcon />} label="Cancel" onClick={onCancel(id)} />,
        ];
    }

    const actions = [];

    if (showDetails && onView) {
        actions.push(
            <GridActionsCellItem key="details" icon={<VisibilityIcon />} label="Details" onClick={onView(id)} />
        );
    }

    if (showEditDelete) {
        actions.push(
            <GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit" onClick={onEdit(id)} />,
            <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="Delete" onClick={onDelete(id)} />
        );
    }

    return actions;
};
