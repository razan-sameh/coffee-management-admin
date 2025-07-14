import { type GridColDef, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";
import { getActions } from "../../../components/smartDataGrid/components/Actions";
import Rating from "@mui/material/Rating";

export const getColumns = (
    rowModesModel: GridRowModesModel,
    actions: {
        onEdit: (id: GridRowId) => () => void;
        onSave: (id: GridRowId) => () => void;
        onDelete: (id: GridRowId) => () => void;
        onCancel: (id: GridRowId) => () => void;
        onView: (id: GridRowId) => () => void;
    }
): {
    columns: GridColDef[];
    getRowOptions: (id: GridRowId) => {
        showDetails?: boolean;
        showEditDelete?: boolean;
    };
} => {
    const columns: GridColDef[] = [
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
            field: "title",
            headerName: "Name",
            flex: 1.5,
            editable: true,
            sortable: true,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                const { row } = params;
                const imageUrl = row.image?.[0];
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                                    display: "block",
                                }}
                            />
                        )}
                        <span>{row.title}</span>
                    </div>
                );
            },
        },
        {
            field: "categoryTitle",
            headerName: "Category",
            flex: 1,
            editable: false,
            sortable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "price",
            headerName: "Price",
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
            field: "rate",
            headerName: "Rate",
            flex: 1,
            editable: true,
            sortable: true,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                const value = Math.round(params.value) || 0;
                return <Rating name="half-rating-read" defaultValue={value} readOnly />;
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
                    showDetails: true,
                }),
        },
    ];

    const getRowOptions = () => ({
        showDetails: true,
    });

    return { columns, getRowOptions };
};
