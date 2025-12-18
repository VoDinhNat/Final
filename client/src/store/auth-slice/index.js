import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    // token: null,
    isLoading: false,
    // error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            
        },
    },
});

export const { setUser, setIsAuthenticated, setToken } = authSlice.actions;
export default authSlice.reducer;