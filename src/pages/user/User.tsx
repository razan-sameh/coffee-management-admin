import React, { useEffect, useState } from "react";
import { DataGrid, GridRowModes, GridRowEditStopReasons, type GridRowId, type GridRowModesModel, type GridEventListener, type GridRowModel } from "@mui/x-data-grid";
import { phoneRegExp } from "../../utils/RegExp";
import { setToast } from "../../redux/slices/toastSlice";
import { enmRole, enmToastSeverity } from "../../content/enums";
import { useDispatch } from "react-redux";
import CustomColumnMenu from "./components/CustomColumnMenu";
import { Box } from "@mui/material";
import { getColumns } from "./components/columns";
import { CustomToolbar } from "./components/CustomToolbar";
import { imagePaths } from "../../assets/imagePaths";
import { getAllUsers } from "../../database/select";

type RowType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: enmRole;
  address: string;
};
export default function UserTable() {
  const dispatch = useDispatch();
  const [rows, setRows] = React.useState<RowType[]>();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

useEffect(() => {
  const unsubscribe = getAllUsers((data) => {
    // Convert Firebase user records to RowType[]
    const formattedRows: RowType[] = Object.entries(data).map(([uid, user], index) => ({
      id: index + 1, // or use uid if preferred: id: uid
      name: user.firstName + " " + user.lastName || "",
      phone: user.phoneNumber || "",
      email: user.email || "",
      role: user.role || enmRole.user, // default role if missing
      address: user.address || "",
    }));    
    setRows(formattedRows);
  });

  return () => unsubscribe();
}, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  const handleSaveClick = (id: GridRowId) => () => {
    dispatch(setToast({ message: "Updated Successfully", severity: enmToastSeverity.success }));
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleDeleteClick = (id: GridRowId) => () => {
    dispatch(setToast({ message: "Deleted Successfully", severity: enmToastSeverity.success }));
    setRows(rows?.filter((row) => row.id !== id));
  };
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    if (!phoneRegExp.test(newRow.phone)) throw new Error("Enter a valid phone number with or without country code");
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows?.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newModel: GridRowModesModel) => setRowModesModel(newModel);

  const columns = getColumns(rowModesModel, {
    onEdit: handleEditClick,
    onSave: handleSaveClick,
    onDelete: handleDeleteClick,
    onCancel: handleCancelClick,
  });

  return (
    <Box sx={{
      backgroundImage: `url(${imagePaths.beans})`,
      backgroundPosition: 'right bottom',
      backgroundRepeat: 'no-repeat',
      height: 'calc(100vh - 120px)'
    }}>
      <Box mx="auto">
        <DataGrid
          sx={{
            borderRadius: 3,
            border: '1px solid #ccc',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(10px)',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'transparent',
            },
            "& .MuiDataGrid-columnHeader--sortable .MuiDataGrid-sortIcon": { display: "none" }
          }}
          rows={rows}
          columns={columns}
          slots={{ columnMenu: CustomColumnMenu, toolbar: CustomToolbar }}
          disableRowSelectionOnClick
          showToolbar
          // disableColumnSelector
          // disableDensitySelector
          // slotProps={{
          //   toolbar: {
          //     csvOptions: { disableToolbarButton: true },
          //     printOptions: { disableToolbarButton: true },
          //   },
          // }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) =>
            dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }))
          }
        />
      </Box>
    </Box>
  );
}
