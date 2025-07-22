/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, Divider } from "@mui/material";
import {
    type GridRowId,
    type GridRowModesModel,
    GridRowModes,
} from "@mui/x-data-grid";
import type { ExtendedGridColDef } from "../../SmartDataGrid";
import { MobileGridField } from "./MobileGridField";
import { MobileGridRowActions } from "./MobileGridRowActions";

type MobileGridRowProps<T> = {
    row: T;
    columns: ExtendedGridColDef[];
    rowModesModel: GridRowModesModel;
    editedRows: Record<GridRowId, Partial<T>>;
    onFieldChange: (id: GridRowId, field: string, value: any) => void;
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
    allRows: T[];
    isLast: boolean;
};

export function MobileGridRow<T extends { id: GridRowId }>({
    row,
    columns,
    rowModesModel,
    editedRows,
    onFieldChange,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onView,
    getActions,
    allRows,
    isLast,
}: MobileGridRowProps<T>) {
    const isEditing = rowModesModel[row.id]?.mode === GridRowModes.Edit;
    const currentEditRow = editedRows[row.id] ?? {};

    return (
        <Box>
            {columns
                .filter((col) => col.field !== "actions")
                .map((col) => (
                    <MobileGridField
                        key={col.field}
                        column={col}
                        row={row}
                        editedRow={currentEditRow}
                        isEditing={isEditing}
                        onFieldChange={onFieldChange}
                        rowId={row.id}
                        allRows={allRows}
                    />
                ))}

            <MobileGridRowActions
                rowId={row.id}
                rowModesModel={rowModesModel}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
                onView={onView}
                getActions={getActions}
            />

            {!isLast && <Divider sx={{ my: 2 }} />}
        </Box>
    );
}
