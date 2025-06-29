import {
    GridActionsCellItem,
    GridRowModes,
    type GridRowId,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CancelIcon } from "@mui/icons-material";

export const getUserActions = (
    id: GridRowId,
    rowModesModel: GridRowModesModel,
    {
        onEdit,
        onSave,
        onDelete,
        onCancel,
    }: {
        onEdit: (id: GridRowId) => () => void;
        onSave: (id: GridRowId) => () => void;
        onDelete: (id: GridRowId) => () => void;
        onCancel: (id: GridRowId) => () => void;
    }
) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    return isInEditMode
        ? [
            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={onSave(id)} />,
            <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={onCancel(id)} />,
        ]
        : [
            <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={onEdit(id)} />,
            <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={onDelete(id)} />,
        ];
};
