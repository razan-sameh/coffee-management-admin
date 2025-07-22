import React from "react";
import { Box } from "@mui/material";
import {
    type GridRowId,
    type GridRowModesModel,
} from "@mui/x-data-grid";

type MobileGridRowActionsProps = {
    rowId: GridRowId;
    rowModesModel: GridRowModesModel;
    onEdit: (id: GridRowId) => void;
    onSave: (id: GridRowId) => void;
    onCancel: (id: GridRowId) => void;
    onDelete: (id: GridRowId) => void;
    onView?: (id: GridRowId) => void;
    getActions: (
        id: GridRowId,
        model: GridRowModesModel,
        handlers: {
            onEdit: (id: GridRowId) => void;
            onSave: (id: GridRowId) => void;
            onCancel: (id: GridRowId) => void;
            onDelete: (id: GridRowId) => void;
            onView?: (id: GridRowId) => void;
        }
    ) => React.ReactNode[];
};

export function MobileGridRowActions({
    rowId,
    rowModesModel,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onView,
    getActions,
}: MobileGridRowActionsProps) {
    return (
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            {getActions(rowId, rowModesModel, {
                onEdit,
                onSave,
                onCancel,
                onDelete,
                onView,
            }).map((actionNode, idx) => (
                <span key={idx}>{actionNode}</span>
            ))}
        </Box>
    );
}
