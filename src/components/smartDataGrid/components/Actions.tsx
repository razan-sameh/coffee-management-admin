import {
    GridActionsCellItem,
    GridRowModes,
    type GridRowId,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import {
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";

type ActionOptions = {
    onEdit: (id: GridRowId) => () => void;
    onSave: (id: GridRowId) => () => void;
    onDelete: (id: GridRowId) => () => void;
    onCancel: (id: GridRowId) => () => void;
    onView?: (id: GridRowId) => () => void;
    showDetails?: boolean;
    showEditDelete?: boolean;
    renderAsPlainButtons?: boolean; // 👈 New flag for mobile
};

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
        showEditDelete = true,
        renderAsPlainButtons = false, // 👈 Default false (desktop)
    }: ActionOptions
) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    // === DESKTOP ===
    if (!renderAsPlainButtons) {
        if (isInEditMode) {
            return [
                <GridActionsCellItem key="save" icon={<SaveIcon />} label="Save" onClick={onSave(id)} />,
                <GridActionsCellItem key="cancel" icon={<CancelIcon />} label="Cancel" onClick={onCancel(id)} />,
            ];
        }

        const actions = [];
        if (showDetails && onView) {
            actions.push(
                <GridActionsCellItem key="view" icon={<VisibilityIcon />} label="View" onClick={onView(id)} />
            );
        }
        if (showEditDelete) {
            actions.push(
                <GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit" onClick={onEdit(id)} />,
                <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="Delete" onClick={onDelete(id)} />
            );
        }
        return actions;
    }

    // === MOBILE ===
    const mobileActions = [];

    if (isInEditMode) {
        mobileActions.push(
            <Tooltip title="Save" key="save">
                <IconButton onClick={onSave(id)}><SaveIcon /></IconButton>
            </Tooltip>,
            <Tooltip title="Cancel" key="cancel">
                <IconButton onClick={onCancel(id)}><CancelIcon /></IconButton>
            </Tooltip>
        );
    } else {
        if (showDetails && onView) {
            mobileActions.push(
                <Tooltip title="View" key="view">
                    <IconButton onClick={onView(id)}><VisibilityIcon /></IconButton>
                </Tooltip>
            );
        }

        if (showEditDelete) {
            mobileActions.push(
                <Tooltip title="Edit" key="edit">
                    <IconButton onClick={onEdit(id)}><EditIcon /></IconButton>
                </Tooltip>,
                <Tooltip title="Delete" key="delete">
                    <IconButton onClick={onDelete(id)}><DeleteIcon /></IconButton>
                </Tooltip>
            );
        }
    }

    return mobileActions;
};
