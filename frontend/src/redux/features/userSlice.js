import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null 
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload
            state.isAuthenticated = true
            state.loading = false
            state.error = null
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        logout: (state) => {
            state.currentUser = null
            state.isAuthenticated = false
            state.loading = false
            state.error = null
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setUser, setLoading, logout, setError } = userSlice.actions;
export default userSlice.reducer;