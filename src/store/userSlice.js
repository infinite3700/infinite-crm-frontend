import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../api/userService';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const users = await userService.getAllUsers();
            return users;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching single user
export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const user = await userService.getUserById(userId);
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for creating a new user
export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const newUser = await userService.createUser(userData);
            return newUser;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for updating a user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const updatedUser = await userService.updateUser(userId, userData);
            return { userId, updatedUser };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await userService.deleteUser(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    users: [],
    selectedUser: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch single user
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
                state.error = null;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create user
            .addCase(createUser.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.creating = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updating = false;
                const { userId, updatedUser } = action.payload;
                const index = state.users.findIndex(user => user._id === userId);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deleting = false;
                state.users = state.users.filter(user => user._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSelectedUser, setSelectedUser } = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersCreating = (state) => state.users.creating;
export const selectUsersUpdating = (state) => state.users.updating;
export const selectUsersDeleting = (state) => state.users.deleting;
export const selectUsersError = (state) => state.users.error;

export default userSlice.reducer;