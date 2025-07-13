import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { getActions } from "../../../components/smartDataGrid/components/Actions";
export type ExtendedGridColDef = GridColDef & {
    hideInForm?: boolean;
};
export const getColumns = (
    rowModesModel: GridRowModesModel,
    actions: {
        onEdit: (id: GridRowId) => () => void;
        onSave: (id: GridRowId) => () => void;
        onDelete: (id: GridRowId) => () => void;
        onCancel: (id: GridRowId) => () => void;
        onView?: (id: GridRowId) => () => void;
    }
): {
    columns: GridColDef[];
    getRowOptions: (id: GridRowId) => {
        showDetails?: boolean;
        showEditDelete?: boolean;
    };
} => {
    const columns: ExtendedGridColDef[] = [
        {
            field: "no",
            headerName: ".NO",
            flex: 1,
            editable: true,
            sortable: true,
            align: "center",
            headerAlign: "center",
            hideInForm: true, // 👈 Custom flag you define
        },
        {
            field: "title",
            headerName: "Name",
            flex: 1,
            editable: true,
            sortable: true,
            align: "center",
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
    ];

    const getRowOptions = () => ({
        showDetails: false,
        showEditDelete: true,
    });

    return { columns, getRowOptions };
};
