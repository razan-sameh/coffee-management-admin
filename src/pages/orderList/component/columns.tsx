import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { getActions } from "../../../components/smartDataGrid/components/Actions";

export const getColumns = (
    rowModesModel: GridRowModesModel,
    actions: {
        onEdit: (id: GridRowId) => () => void;
        onSave: (id: GridRowId) => () => void;
        onDelete: (id: GridRowId) => () => void;
        onCancel: (id: GridRowId) => () => void;
        onView: (id: GridRowId) => () => void;
    }
): GridColDef[] => [
        {
            field: "no",
            headerName: ".NO",
            flex: 1,
            editable: true,
            sortable: true,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                const allIds = params.api.getAllRowIds();
                const index = allIds.indexOf(params.id);
                return index + 1;
            },
        },
        {
            field: "userName",
            headerName: "User Name",
            flex: 1.5,
            editable: true,
            sortable: true,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                const { row } = params;
                const imageUrl = row.image?.[0];
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={row.title}
                                width={32}
                                height={32}
                                loading="lazy"
                                style={{
                                    borderRadius: 50,
                                    objectFit: "cover",
                                    display: "block"
                                }}
                            />
                        )}
                        <span>{row.title}</span>
                    </div>
                );
            },
        },
        {
            field: "orderType",
            headerName: "Order Type",
            flex: 1,
            editable: false,
            sortable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "paymentMethod",
            headerName: "Payment Method",
            flex: 1,
            editable: false,
            sortable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "total",
            headerName: "Total",
            flex: 1,
            editable: true,
            sortable: true,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                const value = Number(params.value).toFixed(2);
                return `$${value}`;
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Action",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            getActions: ({ id }) =>
                getActions(id, rowModesModel, {
                    ...actions,
                    showDetails: true, // 👈 example condition
                }),
        },
    ];
