/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, Typography, TextField, Select, MenuItem } from "@mui/material";
import {
    type GridRowId,
    type GridRenderEditCellParams,
} from "@mui/x-data-grid";
import type { ExtendedGridColDef } from "../../SmartDataGrid";

type MobileGridFieldProps<T> = {
    column: ExtendedGridColDef;
    row: T;
    editedRow: Partial<T>;
    isEditing: boolean;
    onFieldChange: (id: GridRowId, field: string, value: any) => void;
    rowId: GridRowId;
    allRows: T[];
};

export function MobileGridField<T extends { id: GridRowId }>({
    column,
    row,
    editedRow,
    isEditing,
    onFieldChange,
    rowId,
    allRows,
}: MobileGridFieldProps<T>) {
    const value = isEditing
        ? (editedRow as any)[column.field] ?? (row as any)[column.field]
        : (row as any)[column.field];
    const label = column.headerName || column.field;
    const isReadOnlyField = column.field === "no";

    const renderParams = {
        field: column.field,
        row: { ...row, ...editedRow },
        value,
        id: rowId,
        colDef: column,
        formattedValue: value,
        isEditable: !!column.editable,
        hasFocus: false,
        tabIndex: -1,
        api: {
            setEditCellValue: ({ id, field, value }: { id: GridRowId; field: string; value: any }) => {
                onFieldChange(id, field, value);
                return Promise.resolve();
            },
            getAllRowIds: () => allRows.map((r) => r.id),
        },
    };

    let content: React.ReactNode;

    if (isEditing && !isReadOnlyField) {
        if (column.renderEditCell) {
            content = column.renderEditCell(renderParams as unknown as GridRenderEditCellParams);
        } else if (
            column.type === "singleSelect" &&
            "valueOptions" in column &&
            Array.isArray(column.valueOptions)
        ) {
            content = (
                <Select
                    size="small"
                    fullWidth
                    value={value ?? ""}
                    onChange={(e) => onFieldChange(rowId, column.field, e.target.value)}
                >
                    {column.valueOptions.map((option: any) => {
                        const val = typeof option === "object" ? option.value : option;
                        const label = typeof option === "object" ? option.label : option;
                        return (
                            <MenuItem key={val} value={val}>
                                {label}
                            </MenuItem>
                        );
                    })}
                </Select>
            );
        } else {
            content = (
                <TextField
                    size="small"
                    fullWidth
                    value={value ?? ""}
                    onChange={(e) => onFieldChange(rowId, column.field, e.target.value)}
                />
            );
        }
    } else {
        content = column.renderCell
            ? column.renderCell(renderParams as unknown as GridRenderEditCellParams)
            : <Typography variant="body2">{String(value)}</Typography>;
    }

    return (
        <Box mt={1}>
            <Typography component="span" fontWeight="bold">
                {label}:
            </Typography>{" "}
            <Box component="span" display="inline-block" ml={1}>
                {content}
            </Box>
        </Box>
    );
}