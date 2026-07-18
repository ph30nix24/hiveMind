import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './features/toastSlice.js'
import userReducer from './features/userSlice.js'
export const store = configureStore({
    reducer: {
        toast: toastReducer,
        user: userReducer
    }
})
