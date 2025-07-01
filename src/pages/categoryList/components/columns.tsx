import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { getActions } from "../../../components/smartDataGrid/components/Actions";


export const getColumns = (rowModesModel: GridRowModesModel, actions: { onEdit: (id: GridRowId) => () => void; onSave: (id: GridRowId) => () => void; onDelete: (id: GridRowId) => () => void; onCancel: (id: GridRowId) => () => void; }) =>
    [
        {
            field: "id", headerName: "ID", flex: 1, editable: true, sortable: true, align: "center",
            headerAlign: "center",
        },
        {
            field: "title", headerName: "Name", flex: 1, editable: true, sortable: true, align: "center",
            headerAlign: "center",
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
