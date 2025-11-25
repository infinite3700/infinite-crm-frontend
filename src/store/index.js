import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export default store;