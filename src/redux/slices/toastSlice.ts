import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { enmToastSeverity } from '../../content/enums';

interface Itoast {
    severity: enmToastSeverity;
    message: string;
}


const initialState: Itoast = {
    severity: enmToastSeverity.success,
    message: '',
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<Itoast>) => {
            state.severity = action.payload.severity;
            state.message = action.payload.message;
        },
        clearToast: (state) => {
            state.severity = enmToastSeverity.success;
            state.message = '';
        },
    },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;

