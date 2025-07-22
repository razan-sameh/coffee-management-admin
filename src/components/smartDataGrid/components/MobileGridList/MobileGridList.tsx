/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import {
  type GridRowId,
  type GridRowModesModel,
} from "@mui/x-data-grid";
import type { ExtendedGridColDef } from "../../SmartDataGrid";
import { MobileGridSearch } from "./MobileGridSearch";
import { MobileGridAddButton } from "./MobileGridAddButton";
import { MobileGridRow } from "./MobileGridRow";

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
  const [searchText, setSearchText] = useState("");

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
    onSave(id, edited);
    setEditedRows((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        const value = (row as any)[col.field];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(searchText.toLowerCase())
        );
      })
    );
  }, [rows, searchText, columns]);

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
      <MobileGridSearch
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {showAdd && onAdd && <MobileGridAddButton onAdd={onAdd} />}

      {filteredRows.map((row, index) => (
        <MobileGridRow
          key={row.id}
          row={row}
          columns={columns}
          rowModesModel={rowModesModel}
          editedRows={editedRows}
          onFieldChange={handleFieldChange}
          onEdit={onEdit}
          onSave={handleSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onView={onView}
          getActions={getActions}
          allRows={rows}
          isLast={index === filteredRows.length - 1}
        />
      ))}
    </Box>
  );
}