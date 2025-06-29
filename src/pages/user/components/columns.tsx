import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { RoleCell } from "./RoleCell";
import { getUserActions } from "./UserActions";
import { Box, Typography } from "@mui/material";
import { enmRole } from "../../../content/enums";

export const getColumns = (rowModesModel: GridRowModesModel, actions: { onEdit: (id: GridRowId) => () => void; onSave: (id: GridRowId) => () => void; onDelete: (id: GridRowId) => () => void; onCancel: (id: GridRowId) => () => void; }) =>
  [
    { field: "name", headerName: "Full Name", flex: 1, editable: true, sortable: true },
    {
      field: "phone", headerName: "Phone Number", flex: 1, editable: true, sortable: false, disableColumnMenu: true,
      renderCell: ({ value }) => {
        if (Array.isArray(value)) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",     // 👈 vertical centering
                height: "100%",           // 👈 ensure it takes full cell height
              }}
            >
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                {value.map((phone: string, index: number) => (
                  <li key={index}>
                    <Typography variant="body2">{phone}</Typography>
                  </li>
                ))}
              </Box>
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography variant="body2">{value}</Typography>
          </Box>
        );
      }
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
      editable: true,
      disableColumnMenu: true,
      renderEditCell: () => (
        <Typography sx={{ color: "gray", fontStyle: "italic", alignSelf: "center" }}>Cannot edit</Typography>
      ),
    },
    { field: "address", headerName: "Address", flex: 1, editable: true, disableColumnMenu: true, sortable: false },
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
      getActions: ({ id }) => getUserActions(id, rowModesModel, actions),
    },
  ] satisfies GridColDef[];
