import { GridRowModes, type GridRowId, type GridRowModesModel } from "@mui/x-data-grid";

export function createInitialState<T extends { id: number | string }>(): TableState<T> {
    return {
        rows: [],
        rowModesModel: {},
        confirmOpen: false,
        userToDelete: null,
    };
}
export type TableState<T extends { id: string | number }> = {
    rows: T[];
    rowModesModel: GridRowModesModel;
    confirmOpen: boolean;
    userToDelete: T | null;
};

export type TableAction<T extends { id: string | number }> =
    | { type: "SET_ROWS"; payload: T[] }
    | { type: "EDIT_ROW"; id: GridRowId }
    | { type: "SAVE_ROW"; id: GridRowId }
    | { type: "CANCEL_ROW"; id: GridRowId }
    | { type: "DELETE_ROW"; id: string | number }
    | { type: "SET_CONFIRM"; payload: { open: boolean; user: T | null } }
    | { type: "UPDATE_ROW"; payload: Partial<T> & { id: string | number } }
    | { type: "SET_ROW_MODES_MODEL"; payload: GridRowModesModel };

export function tableReducer<T extends { id: string | number }>(
    state: TableState<T>,
    action: TableAction<T>
): TableState<T> {
    switch (action.type) {
        case "SET_ROWS":
            return {
                ...state,
                rows: action.payload.map((row, index) => ({ ...row, no: index + 1 })),
            };
        case "EDIT_ROW":
            return {
                ...state,
                rowModesModel: {
                    ...state.rowModesModel,
                    [action.id]: { mode: GridRowModes.Edit },
                },
            };
        case "SAVE_ROW":
            return {
                ...state,
                rowModesModel: {
                    ...state.rowModesModel,
                    [action.id]: { mode: GridRowModes.View },
                },
            };
        case "CANCEL_ROW":
            return {
                ...state,
                rowModesModel: {
                    ...state.rowModesModel,
                    [action.id]: { mode: GridRowModes.View, ignoreModifications: true },
                },
            };
        case "DELETE_ROW":
            return {
                ...state,
                rows: state.rows.filter((r) => r.id !== action.id),
            };
        case "SET_CONFIRM":
            return {
                ...state,
                confirmOpen: action.payload.open,
                userToDelete: action.payload.user,
            };
        case "UPDATE_ROW":
            return {
                ...state,
                rows: state.rows.map((r) =>
                    r.id === action.payload.id ? { ...r, ...action.payload } : r
                ),
            };

        case "SET_ROW_MODES_MODEL":
            return { ...state, rowModesModel: action.payload };
        default:
            return state;
    }
}
