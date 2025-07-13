/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  type GridRowId,
  type GridRowModesModel,
  type GridRenderCellParams,
  type GridRenderEditCellParams,
  GridRowModes,
} from "@mui/x-data-grid";

// 👇 Extend the column type to include `hideInForm`
export type ExtendedGridColDef = {
  field: string;
  headerName?: string;
  editable?: boolean;
  type?: string;
  valueOptions?: any[];
  renderCell?: (params: GridRenderCellParams) => React.ReactNode;
  renderEditCell?: (params: GridRenderEditCellParams) => React.ReactNode;
  hideInForm?: boolean; // ✅ Custom flag
};

type Props<T> = {
  rows: T[];
  columns: ExtendedGridColDef[];
  rowModesModel: GridRowModesModel;
  onEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId, updatedRow?: Partial<T>) => void;
  onCancel: (id: GridRowId) => void;
  onDelete: (id: GridRowId) => void;
  onView?: (id: GridRowId) => void;
  showAdd?: boolean;
  onAdd?: () => void;
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

export function MobileGridList<T extends { id: GridRowId }>({
  rows,
  columns,
  rowModesModel,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onView,
  getActions,
  showAdd,
  onAdd,
}: Props<T>) {
  const [editedRows, setEditedRows] = useState<Record<GridRowId, Partial<T>>>({});

  const handleFieldChange = (id: GridRowId, field: string, value: any) => {
    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id: GridRowId) => {
    const edited = editedRows[id];
    onSave(id, edited); // calls SmartDataGrid with updatedRow
    setEditedRows((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };


  const handleAddClick = () => {
    if (onAdd) {
      onAdd(); // ✅ calls SmartDataGrid's handleAddClick
    }
  };




  return (
    <Box
      px={1}
      py={2}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
      }}
    >
      {showAdd && (
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <Button variant="contained" size="small" onClick={handleAddClick}>
            Add
          </Button>
        </Box>
      )}

      {rows.map((row, index) => {
        const isEditing = rowModesModel[row.id]?.mode === GridRowModes.Edit;
        const currentEditRow = editedRows[row.id] ?? {};
        return (
          <Box key={row.id}>
            {columns
              .filter((col) => col.field !== "actions")
              .map((col) => {
                const value = isEditing
                  ? (currentEditRow as any)[col.field] ?? (row as any)[col.field]
                  : (row as any)[col.field];
                const label = col.headerName || col.field;

                const renderParams = {
                  field: col.field,
                  row: { ...row, ...currentEditRow },
                  value,
                  id: row.id,
                  colDef: col,
                  formattedValue: value,
                  isEditable: !!col.editable,
                  hasFocus: false,
                  tabIndex: -1,
                  api: {
                    setEditCellValue: ({ id, field, value }: { id: GridRowId; field: string; value: any }) => {
                      handleFieldChange(id, field, value);
                      return Promise.resolve();
                    },
                    getAllRowIds: () => rows.map((r) => r.id),
                  },
                };

                let content: React.ReactNode;

                const isReadOnlyField = col.field === "no";

                if (isEditing && !isReadOnlyField) {
                  if (col.renderEditCell) {
                    content = col.renderEditCell(renderParams as unknown as GridRenderEditCellParams);
                  } else if (
                    col.type === "singleSelect" &&
                    "valueOptions" in col &&
                    Array.isArray(col.valueOptions)
                  ) {
                    content = (
                      <Select
                        size="small"
                        fullWidth
                        value={value ?? ""}
                        onChange={(e) =>
                          handleFieldChange(row.id, col.field, e.target.value)
                        }
                      >
                        {col.valueOptions.map((option: any) => {
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
                        onChange={(e) =>
                          handleFieldChange(row.id, col.field, e.target.value)
                        }
                      />
                    );
                  }
                } else {
                  content = col.renderCell
                    ? col.renderCell(renderParams as unknown as GridRenderCellParams)
                    : <Typography variant="body2">{String(value)}</Typography>;
                }


                return (
                  <Box key={col.field} mt={1}>
                    <Typography component="span" fontWeight="bold">
                      {label}:
                    </Typography>{" "}
                    <Box component="span" display="inline-block" ml={1}>
                      {content}
                    </Box>
                  </Box>
                );
              })}

            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              {getActions(row.id, rowModesModel, {
                onEdit,
                onSave: () => handleSave(row.id),
                onCancel,
                onDelete,
                onView,
              }).map((actionNode, idx) => (
                <span key={idx}>{actionNode}</span>
              ))}
            </Box>

            {index !== rows.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        );
      })}
    </Box>
  );
}
