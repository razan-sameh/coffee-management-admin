// SmartDataGrid.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from "react";
import {
    DataGrid,
    GridRowEditStopReasons,
    type GridRowId,
    type GridRowModel,
    type GridRowModesModel,
    type GridEventListener,
    type GridColDef,
    useGridApiRef,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import ConfirmDialog from "../ConfirmDialog";
import { setToast } from "../../redux/slices/toastSlice";
import { useDispatch } from "react-redux";
import { enmToastSeverity } from "../../content/enums";
import CustomColumnMenu from "./components/CustomColumnMenu";
import CustomToolbar from "./components/CustomToolbar";
import { createInitialState, tableReducer } from "../../reducers/tableReducer";


export type SmartDataGridProps<T extends { id: string | number }> = {
    getColumns: (
        rowModesModel: GridRowModesModel,
        actions: {
            onEdit: (id: GridRowId) => () => void;
            onSave: (id: GridRowId) => () => void;
            onDelete: (id: GridRowId) => () => void;
            onCancel: (id: GridRowId) => () => void;
        }
    ) => GridColDef[];
    getData: (callback: (data: Record<string, any>) => void) => () => void;
    updateData: (id: string | number, payload: Partial<T>) => Promise<void>;
    deleteData: (id: string | number) => Promise<void>;
    mapRow: (id: string, item: any, index: number) => T;
    imageBackground?: string;
    slotProps?: {
        toolbar?: Record<string, any>;
        columnMenu?: Record<string, any>;
    };
    createRow?: (newId: number) => T;
};

export default function SmartDataGrid<T extends { id: number | string }>({
    getColumns,
    getData,
    updateData,
    deleteData,
    mapRow,
    imageBackground,
    slotProps,
    createRow
}: SmartDataGridProps<T>) {
    const dispatch = useDispatch();
    const [state, dispatchReducer] = useReducer(tableReducer<T>, createInitialState<T>());
    const apiRef = useGridApiRef();

    useEffect(() => {
        const unsubscribe = getData((data) => {
            const formatted = Object.entries(data).map(([uid, item], i) => mapRow(uid, item, i));
            dispatchReducer({ type: "SET_ROWS", payload: formatted });
        });
        return () => unsubscribe();
    }, [getData, mapRow]);

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleAddClick = () => {
        if (!createRow) return;

        const maxId = state.rows.reduce((max, row) => {
            const idNum = typeof row.id === "number" ? row.id : parseInt(row.id as string, 10);
            return !isNaN(idNum) && idNum > max ? idNum : max;
        }, 0);

        const newId = maxId + 1;
        const newRow = { ...createRow(newId), id: newId, isNew: true } as T & { isNew: boolean };

        dispatchReducer({ type: "SET_ROWS", payload: [...state.rows, newRow] });
        dispatchReducer({ type: "EDIT_ROW", id: newId });

        // Scroll to the new row using apiRef
        setTimeout(() => {
            if (apiRef.current) {
                apiRef.current.scrollToIndexes({ rowIndex: state.rows.length });
            }
        }, 100);
    };



    const handleEditClick = (id: GridRowId) => () => dispatchReducer({ type: "EDIT_ROW", id });
    const handleSaveClick = (id: GridRowId) => () => dispatchReducer({ type: "SAVE_ROW", id });
    const handleCancelClick = (id: GridRowId) => () => {
        const row = state.rows.find((r) => r.id === id);
        if (!row) return;

        const isNew = (row as any).isNew;

        if (isNew) {
            dispatchReducer({ type: "DELETE_ROW", id });
        } else {
            dispatchReducer({ type: "CANCEL_ROW", id });
        }
    };
    const handleDeleteClick = (id: GridRowId) => () => {
        const row = state.rows.find((r) => r.id === id);
        if (!row) return;
        dispatchReducer({ type: "SET_CONFIRM", payload: { open: true, user: row } });
    };

    const confirmDelete = async () => {
        if (!state.userToDelete) return;
        try {
            await deleteData(state.userToDelete.id);
            dispatchReducer({ type: "DELETE_ROW", id: state.userToDelete.id });
            dispatch(setToast({ message: "Deleted Successfully", severity: enmToastSeverity.success }));
        } catch (err: any) {
            dispatch(setToast({ message: `Delete failed: ${err.message}`, severity: enmToastSeverity.error }));
        } finally {
            dispatchReducer({ type: "SET_CONFIRM", payload: { open: false, user: null } });
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow };
        delete (updatedRow as any).isNew; // ✅ remove the flag

        dispatchReducer({ type: "UPDATE_ROW", payload: updatedRow as Partial<T> & { id: string | number } });
        try {
            const { id, ...fieldsToUpdate } = updatedRow;
            await updateData(id, fieldsToUpdate as Partial<T>);
            dispatch(setToast({ message: "Updated Successfully", severity: enmToastSeverity.success }));
        } catch (error: any) {
            throw new Error(`Update Failed: ${error.message}`);
        }
        return updatedRow as T;
    };


    const handleRowModesModelChange = (newModel: GridRowModesModel) => {
        dispatchReducer({ type: "SET_ROW_MODES_MODEL", payload: newModel });
    };

    const columns = getColumns(state.rowModesModel, {
        onEdit: handleEditClick,
        onSave: handleSaveClick,
        onCancel: handleCancelClick,
        onDelete: handleDeleteClick,
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 120px)',
                backgroundImage: imageBackground ? `url(${imageBackground})` : undefined,
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Box
                sx={{
                    flex: 1, // This makes the scrollable container fill remaining height
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <DataGrid
                    // getRowClassName={(params) =>
                    //     (params.row as any).isNew ? 'new-row' : ''
                    // }
                    apiRef={apiRef}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #ccc",
                        backgroundColor: "transparent",
                        backdropFilter: "blur(10px)",
                        "& .MuiDataGrid-columnHeader": { backgroundColor: "transparent" },
                        "& .MuiDataGrid-row": { backgroundColor: "transparent" },
                        "& .MuiDataGrid-footerContainer": { backgroundColor: "transparent" },
                        "& .MuiDataGrid-columnHeader--sortable .MuiDataGrid-sortIcon": {
                            display: "none",
                        },
                        "& .MuiInputBase-root input": {
                            textAlign: "center",
                        },
                    }}
                    rows={state.rows}
                    columns={columns}
                    slots={{ columnMenu: CustomColumnMenu, toolbar: CustomToolbar }}
                    slotProps={{
                        toolbar: {
                            ...(slotProps?.toolbar as any),
                            onAddClick: createRow ? handleAddClick : undefined,
                        },
                        columnMenu: slotProps?.columnMenu,
                    }}
                    disableRowSelectionOnClick
                    showToolbar
                    editMode="row"
                    rowModesModel={state.rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={(error) =>
                        dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }))
                    }
                />
            </Box>

            <ConfirmDialog
                open={state.confirmOpen}
                content={`Are you sure you want to delete ${state.userToDelete?.title || state.userToDelete?.name}?`}
                onClose={() =>
                    dispatchReducer({ type: "SET_CONFIRM", payload: { open: false, user: null } })
                }
                onConfirm={confirmDelete}
            />
        </Box>

    );
}
