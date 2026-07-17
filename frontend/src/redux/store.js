import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './features/toastSlice.js'
export const store = configureStore({
    reducer: {
        toast: toastReducer,
    }
})