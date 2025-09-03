/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// SmartDataGrid.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer, useMemo } from "react";
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
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { setToast } from "../../redux/slices/toastSlice";
import { useDispatch } from "react-redux";
import { enmToastSeverity } from "../../content/enums";
import CustomColumnMenu from "./components/CustomColumnMenu";
import CustomToolbar from "./components/CustomToolbar";
import { createInitialState, tableReducer } from "../../reducers/tableReducer";
import { Outlet } from "react-router";
import { v4 } from "uuid";
import { useConfirmDialog } from "../../provider/ConfirmDialogProvider";
import { getActions } from "./components/Actions";
import { MobileGridList } from "./components/MobileGridList/MobileGridList";
import { useRolePermissions } from "../../hook/useRolePermissions";
// 👇 Extend the column type to include `hideInForm`
export type ExtendedGridColDef = GridColDef & {
    hideInForm?: boolean;
};
export type SmartDataGridProps<T extends { id: string | number }> = {
    getColumns: (
        rowModesModel: GridRowModesModel,
        actions: {
            onEdit: (id: GridRowId) => () => void;
            onSave: (id: GridRowId) => () => void;
            onDelete: (id: GridRowId) => () => void;
            onCancel: (id: GridRowId) => () => void;
            onView: (id: GridRowId) => () => void;
        }
    ) => {
        columns: GridColDef[];
        getRowOptions: (id: GridRowId) => {
            showDetails?: boolean;
            showDelete?: boolean;
            showEdit?: boolean;
        };
    };
    getData: (callback: (data: Record<string, any>) => void) => () => void;
    updateData?: (id: string | number, payload: Partial<T>) => Promise<void>;
    deleteData?: (id: string | number) => Promise<void>;
    mapRow: (id: string, item: any, index: number) => T;
    imageBackground?: string;
    slotProps?: {
        toolbar?: Record<string, any>;
        columnMenu?: Record<string, any>;
    };
    createRow?: (newId: string) => T;
    onEdit?: (id: GridRowId) => void;
    onView?: (id: GridRowId) => void;
    onAdd?: () => void;
};

export default function SmartDataGrid<T extends {
    firstName?: string,
    lastName?: string,
    name?: string;
    title?: string;
    id: number | string
}>({
    getColumns,
    getData,
    updateData,
    deleteData,
    mapRow,
    imageBackground,
    slotProps,
    createRow,
    onEdit,
    onAdd,
    onView,
}: SmartDataGridProps<T>) {
    const dispatch = useDispatch();
    const [state, dispatchReducer] = useReducer(tableReducer<T>, createInitialState<T>());
    const apiRef = useGridApiRef();
    const { confirm } = useConfirmDialog();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {permissions , currentRole} = useRolePermissions();

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
        if (createRow) {

            const newId = v4();
            const newRow = { ...createRow(newId), id: newId, isNew: true };

            dispatchReducer({ type: "SET_ROWS", payload: [...state.rows, newRow] });
            dispatchReducer({ type: "EDIT_ROW", id: newId });

            // Scroll to the new row using apiRef
            setTimeout(() => {
                if (apiRef.current) {
                    apiRef.current.scrollToIndexes({ rowIndex: state.rows.length });
                }
            }, 100);
        }
        else if (onAdd) onAdd()
        else return
    };



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
    const handleDeleteClick = (id: GridRowId) => async () => {
        const row = state.rows.find((r) => r.id === id);
        if (!row) return;

        const confirmed = await confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to delete ${row.title || row.name || row.firstName + " "  + row.lastName}?`
        });

        if (!confirmed) return;

        try {
            if(deleteData) await deleteData(id);
            dispatchReducer({ type: "DELETE_ROW", id });
            dispatch(setToast({ message: "Deleted Successfully", severity: enmToastSeverity.success }));
        } catch (err: any) {
            dispatch(setToast({ message: `Delete failed: ${err.message}`, severity: enmToastSeverity.error }));
        }
    };
    const handleEditClick = (id: GridRowId) => () => {
        if (onEdit) {
            onEdit(id);
        } else {
            dispatchReducer({ type: "EDIT_ROW", id });
        }
    };
    const handleDetailsClick = (id: GridRowId) => () => {
        if (!onView) return
        onView(id)
    };




    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow };
        delete (updatedRow as any).isNew;

        const { id, no, ...fieldsToUpdate } = updatedRow;

        dispatchReducer({ type: "UPDATE_ROW", payload: updatedRow as Partial<T> & { id: string | number } });

        if (updateData) {
            try {
                await updateData(id, fieldsToUpdate as Partial<T>);
                dispatch(setToast({ message: "Updated Successfully", severity: enmToastSeverity.success }));
            } catch (error: any) {
                throw new Error(`Update Failed: ${error.message}`);
            }
        }
        return updatedRow as T;
    };

    const handleRowModesModelChange = (newModel: GridRowModesModel) => {
        dispatchReducer({ type: "SET_ROW_MODES_MODEL", payload: newModel });
    };

    const handleMobileSave = async (id: GridRowId, updatedRow?: Partial<T>) => {
        if (!updatedRow) return;

        const fullRow = { id, ...updatedRow };
        delete (fullRow as any).isNew;

        const fieldsToUpdate = { ...fullRow };
        delete (fieldsToUpdate as any).isNew;

        dispatchReducer({
            type: "UPDATE_ROW",
            payload: fullRow as Partial<T> & { id: string | number },
        });

        if (updateData) {
            try {
                await updateData(id, fieldsToUpdate as Partial<T>);
                dispatch(setToast({ message: "Updated Successfully", severity: enmToastSeverity.success }));

                // ✅ Exit editing mode
                dispatchReducer({ type: "SAVE_ROW", id });

            } catch (error: any) {
                dispatch(setToast({ message: `Update failed: ${error.message}`, severity: enmToastSeverity.error }));
            }
        }
    };

    const { columns, getRowOptions } = useMemo(
        () =>
            getColumns(
                state.rowModesModel,
                {
                    onEdit: handleEditClick,
                    onSave: handleSaveClick,
                    onCancel: handleCancelClick,
                    onDelete: handleDeleteClick,
                    onView: handleDetailsClick,
                }
            ),
        [state.rowModesModel, isMobile, currentRole]
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 120px)",
                backgroundImage: imageBackground ? `url(${imageBackground})` : undefined,
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {isMobile ? (
                    <MobileGridList
                        rows={state.rows}
                        columns={columns as ExtendedGridColDef[]}
                        rowModesModel={state.rowModesModel}
                        onEdit={(id) => handleEditClick(id)()}
                        onSave={(id, updatedRow) => handleMobileSave(id, updatedRow)} // updated 👈
                        onCancel={(id) => handleCancelClick(id)()}
                        onDelete={(id) => handleDeleteClick(id)()}
                        onView={(id) => handleDetailsClick(id)()}
                        showAdd={slotProps?.toolbar?.showAdd}
                        onAdd={permissions.canAdd ? onAdd : undefined}
                        getActions={(id, model, handlers) => {
                            const rowOptions = getRowOptions(id);
                            return getActions(id, model, {
                                onEdit: (id) => () => handlers.onEdit(id),
                                onSave: (id) => () => handlers.onSave(id),
                                onCancel: (id) => () => handlers.onCancel(id),
                                onDelete: (id) => () => handlers.onDelete(id),
                                onView: handlers.onView ? (id) => () => handlers.onView!(id) : undefined,
                                showDetails: rowOptions.showDetails,
                                showEdit: rowOptions.showEdit,
                                showDelete: rowOptions.showDelete,
                                renderAsPlainButtons: true,
                            });
                        }}
                    />
                ) : (
                    <DataGrid
                        apiRef={apiRef}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #ccc",
                            backgroundColor: "transparent",
                            backdropFilter: "blur(10px)",
                            "& .MuiDataGrid-columnHeader": { backgroundColor: "transparent" },
                            "& .MuiDataGrid-row": { backgroundColor: "transparent" },
                            "& .MuiDataGrid-footerContainer": { backgroundColor: "transparent" },
                            "& .MuiDataGrid-columnHeader--sortable .MuiDataGrid-sortIcon": { display: "none" },
                            "& .MuiInputBase-root input": { textAlign: "center" },
                        }}
                        rows={state.rows}
                        columns={columns}
                        slots={{ columnMenu: CustomColumnMenu, toolbar: CustomToolbar }}
                        slotProps={{
                            toolbar: {
                                ...(slotProps?.toolbar as any),
                                onAddClick: handleAddClick,
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
                        onCellDoubleClick={(_params, event) => event.stopPropagation()}
                    />
                )}
            </Box>
            <Outlet />
        </Box>
    );
}
