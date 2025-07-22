import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { RoleCell } from "./RoleCell";
import { getActions } from "../../../components/smartDataGrid/components/Actions";
import { Typography } from "@mui/material";
import { enmRole } from "../../../content/enums";
import EditableArrayCell from "../../../components/smartDataGrid/components/EditableArrayCell";
import SelectableArrayCell from "../../../components/smartDataGrid/components/SelectableArrayCell";
import { ActiveCell } from "./ActiveCell";
import type { typPermission } from "../../../content/permissions";

export const getColumns = (
  rowModesModel: GridRowModesModel,
  actions: {
    onEdit: (id: GridRowId) => () => void;
    onSave: (id: GridRowId) => () => void;
    onDelete: (id: GridRowId) => () => void;
    onCancel: (id: GridRowId) => () => void;
    onView?: (id: GridRowId) => () => void;
  },
  permissions: typPermission
): {
  columns: GridColDef[];
  getRowOptions: (id: GridRowId) => {
    showDetails?: boolean;
    showEditDelete?: boolean;
  };
} => {
  const showActionsColumn = permissions.canAdd || permissions.canEdit || permissions.canDelete;
  const columns: GridColDef[] = [
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
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      editable: true,
      sortable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      editable: true,
      sortable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <EditableArrayCell
          items={params.value || []}
          onChange={(updatedItems) => {
            params.api.setEditCellValue({
              id: params.id,
              field: "phoneNumber",
              value: updatedItems,
            });
          }}
        />
      ),
      renderCell: (params) => <SelectableArrayCell items={params.value || []} />,
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
        <Typography sx={{ color: "gray", fontStyle: "italic", alignSelf: "center" }}>
          Cannot edit
        </Typography>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <EditableArrayCell
          items={params.value || []}
          onChange={(updatedItems) => {
            params.api.setEditCellValue({
              id: params.id,
              field: "address",
              value: updatedItems,
            });
          }}
        />
      ),
      renderCell: (params) => <SelectableArrayCell items={params.value || []} />,
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
      field: "isActive",
      headerName: "Active Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      editable: true,
      disableColumnMenu: true,
      type: "singleSelect",
      valueOptions: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ], renderCell: ({ row: { isActive } }) => <ActiveCell isActive={isActive} />,
    },
  ];
  if (showActionsColumn) {
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Action",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      getActions: ({ id }) =>
        getActions(id, rowModesModel, {
          ...actions,
          showDetails: false,
          showDelete: false
        }),
    });
  }
  const getRowOptions = () => ({
    showDetails: false,
    showDelete: false,
  });

  return { columns, getRowOptions };
};
