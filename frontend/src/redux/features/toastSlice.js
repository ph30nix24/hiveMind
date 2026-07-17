import { createSlice } from "@reduxjs/toolkit";
let nextId = 0;

const toastSlice = createSlice({
    name: "toast",
    initialState: {
        toasts: []
    },
    reducers: {
        addToast: {
            reducer: (state, action) => {
                state.toasts.push(action.payload)
            },
            prepare: (message, type = "success") => ({
                payload: { id: ++nextId, message, type },
            })
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    }
})

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
