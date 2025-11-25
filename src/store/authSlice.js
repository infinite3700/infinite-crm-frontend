import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../api/authService';

// Login function integrated with backend API
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // Call the backend login API using authService
            const response = await authService.login({
                login: email, // Backend expects 'login' field which can be email, username, or mobile
                password
            });

            return {
                user: {
                    id: response._id,
                    username: response.username,
                    email: response.email,
                    name: response.name,
                    mobile: response.mobile,
                    role: response.role,
                    joinDate: response.joinDate
                },
                token: response.token
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Register function integrated with backend API
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // Call the backend register API using authService
            const response = await authService.register(userData);

            return {
                user: {
                    id: response._id,
                    username: response.username,
                    email: response.email,
                    name: response.name,
                    mobile: response.mobile,
                    role: response.role,
                    joinDate: response.joinDate
                }
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Logout async thunk
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Use authService to handle logout
            await authService.logout();
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Check if user is already logged in (on app startup)
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            // Use authService to check authentication
            if (authService.isAuthenticated()) {
                const user = authService.getCurrentUser();
                const token = localStorage.getItem('auth_token');
                return { user, token };
            } else {
                throw new Error('No authentication found');
            }
        } catch {
            return rejectWithValue('No authentication found');
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register cases
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // User is not automatically logged in after registration
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout cases
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check auth cases
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;