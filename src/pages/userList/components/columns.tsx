import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { RoleCell } from "./RoleCell";
import { getActions } from "../../../components/smartDataGrid/components/Actions";
import { Typography } from "@mui/material";
import { enmRole } from "../../../content/enums";
import EditableArrayCell from "../../../components/smartDataGrid/components/EditableArrayCell";
import SelectableArrayCell from "../../../components/smartDataGrid/components/SelectableArrayCell";

export const getColumns = (rowModesModel: GridRowModesModel, actions: { onEdit: (id: GridRowId) => () => void; onSave: (id: GridRowId) => () => void; onDelete: (id: GridRowId) => () => void; onCancel: (id: GridRowId) => () => void; }) =>
  [
    {
      field: "no",
      headerName: ".NO",
      flex: 1,
      editable: true,
      sortable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name", headerName: "Full Name", flex: 1, editable: true, sortable: true, align: "center",
      headerAlign: "center",
    },
    {
      field: "phone", headerName: "Phone Number", flex: 1, editable: true, sortable: false, disableColumnMenu: true, align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <EditableArrayCell
          items={params.value || []}
          onChange={(updatedItems) => {
            params.api.setEditCellValue({ id: params.id, field: "phone", value: updatedItems });
          }}
        />
      ),
      renderCell: (params) => (
        <SelectableArrayCell items={params.value || []} />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      align: "center",
      headerAlign: "center",
      flex: 1,
      sortable: false,
      editable: true,
      disableColumnMenu: true,
      renderEditCell: () => (
        <Typography sx={{ color: "gray", fontStyle: "italic", alignSelf: "center" }}>Cannot edit</Typography>
      ),
    },
    {
      field: "address", headerName: "Address", flex: 1, editable: true, disableColumnMenu: true, sortable: false, align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <EditableArrayCell
          items={params.value || []}
          onChange={(updatedItems) => {
            params.api.setEditCellValue({ id: params.id, field: "address", value: updatedItems });
          }}
        />
      ),
      renderCell: (params) => (
        <SelectableArrayCell items={params.value || []} />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      editable: true,
      disableColumnMenu: true,
      type: "singleSelect",
      valueOptions: [enmRole.manager, enmRole.admin, enmRole.user, enmRole.customer],
      renderCell: ({ row: { role } }) => <RoleCell role={role} />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      getActions: ({ id }) => getActions(id, rowModesModel, actions),
    },
  ] satisfies GridColDef[];
