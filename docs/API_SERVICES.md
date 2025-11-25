# API Services Documentation

This document outlines the common API service architecture implemented in the frontend application. The services provide a centralized, efficient way to handle API calls with JWT authentication, error handling, and consistent data structures.

## Architecture Overview

The API service architecture consists of:

1. **Common API Client** (`apiClient.js`) - Core HTTP client with interceptors
2. **Service Modules** - Feature-specific services (auth, users, tasks, settings)
3. **Configuration** - API endpoints and settings
4. **Utilities** - Helper functions for authentication and data management

## Core Components

### 1. API Client (`src/api/apiClient.js`)

The central HTTP client built on Axios with the following features:

- **Automatic JWT Token Handling**: Adds Authorization headers automatically
- **Request/Response Interceptors**: Logs requests and handles common errors
- **Token Management**: Utilities for storing/retrieving auth tokens
- **Error Handling**: Standardized error responses with proper status codes

```javascript
import { apiMethods, authHelpers } from "../api/apiClient";

// Make authenticated GET request
const data = await apiMethods.get("/users");

// Check authentication status
if (authHelpers.isAuthenticated()) {
  // User is logged in
}
```

### 2. Authentication Helpers

```javascript
import { authHelpers, tokenManager, userManager } from "../api/apiClient";

// Token management
tokenManager.setToken("jwt-token");
const token = tokenManager.getToken();
tokenManager.removeToken();

// User data management
userManager.setUser(userData);
const user = userManager.getUser();
userManager.removeUser();

// Combined auth helpers
authHelpers.setAuthData(token, user);
authHelpers.clearAuthData();
authHelpers.isAuthenticated();
authHelpers.getCurrentUser();
```

### 3. CRUD Service Utilities

Generic CRUD operations for any endpoint:

```javascript
import { crudService } from "../api/apiClient";

// Get all items with optional query parameters
const users = await crudService.getAll("/users", { page: 1, limit: 10 });

// Get single item
const user = await crudService.getById("/users", userId);

// Create new item
const newUser = await crudService.create("/users", userData);

// Update existing item
const updatedUser = await crudService.update("/users", userId, userData);

// Delete item
await crudService.delete("/users", userId);
```

## Service Modules

### 1. Authentication Service (`src/api/authService.js`)

Handles all authentication-related operations:

```javascript
import { authService } from "../api/authService";

// Login
const response = await authService.login({
  login: "user@example.com",
  password: "password",
});

// Register
const user = await authService.register(userData);

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();

// Get current user
const currentUser = authService.getCurrentUser();

// Password reset
await authService.forgotPassword("user@example.com");
await authService.resetPassword(token, newPassword);
```

### 2. User Service (`src/api/userService.js`)

Manages user-related operations:

```javascript
import { userService } from "../api/userService";

// Get all users
const users = await userService.getAllUsers({ page: 1, search: "john" });

// Get specific user
const user = await userService.getUserById(userId);

// Get current user profile
const profile = await userService.getCurrentUser();

// Create user
const newUser = await userService.createUser(userData);

// Update user
const updatedUser = await userService.updateUser(userId, userData);

// Delete user
await userService.deleteUser(userId);
```

### 3. Task Service (`src/api/taskService.js`)

Handles task management:

```javascript
import { taskService } from "../api/taskService";

// Get all tasks
const tasks = await taskService.getAllTasks({ status: "pending" });

// Create task
const task = await taskService.createTask(taskData);

// Update task status
await taskService.updateTaskStatus(taskId, "completed");

// Assign task
await taskService.assignTask(taskId, userId);

// Get user's tasks
const myTasks = await taskService.getMyTasks();
```

### 4. Settings Service (`src/api/settingsService.js`)

Manages application settings:

```javascript
import { settingsService } from "../api/settingsService";

// Role management
const roles = await settingsService.roles.getAll();
const role = await settingsService.roles.create(roleData);

// Permission management
const permissions = await settingsService.permissions.getAll();

// Product management
const products = await settingsService.products.getAll();

// Lead stage management
const leadStages = await settingsService.leadStages.getAll();
```

## Usage in Components

### 1. In React Components

```javascript
import { userService, authService } from "../api";

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authService.isAuthenticated()) {
        return;
      }

      setLoading(true);
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Component JSX...
};
```

### 2. In Redux Thunks

```javascript
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await userService.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Configuration

### API Endpoints (`src/config/api.js`)

All API endpoints are centrally defined:

```javascript
import { API_ENDPOINTS } from "../config/api";

// Usage
const url = API_ENDPOINTS.USERS.GET_BY_ID(userId); // '/users/123'
const endpoint = API_ENDPOINTS.AUTH.LOGIN; // '/auth/login'
```

### Environment Configuration

Set the API base URL in your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Error Handling

The API client provides consistent error handling:

1. **Network Errors**: Automatically detected and formatted
2. **HTTP Errors**: Status-specific handling (401, 403, 404, 500, etc.)
3. **Authentication Errors**: Automatic token cleanup and redirect
4. **Validation Errors**: Structured error responses

```javascript
try {
  const user = await userService.getUserById(userId);
} catch (error) {
  // Error object structure:
  // {
  //   status: 404,
  //   message: "User not found",
  //   data: {...},
  //   originalError: AxiosError
  // }
  console.error(`Error ${error.status}: ${error.message}`);
}
```

## Benefits

1. **Centralized Authentication**: Automatic JWT handling across all requests
2. **Consistent Error Handling**: Standardized error responses and logging
3. **Code Reusability**: Generic CRUD operations and common patterns
4. **Type Safety**: Consistent data structures and API contracts
5. **Maintainability**: Modular structure with clear separation of concerns
6. **Performance**: Request/response interceptors for optimization
7. **Developer Experience**: Clear API surface with helpful utilities

## Migration Guide

To migrate existing code to use the new API services:

1. Replace direct axios calls with service methods
2. Remove manual token handling (now automatic)
3. Update error handling to use new error structure
4. Use authHelpers for authentication checks
5. Leverage CRUD utilities for standard operations

### Before (Old Way)

```javascript
const token = localStorage.getItem("auth_token");
const response = await axios.get("/api/users", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### After (New Way)

```javascript
const users = await userService.getAllUsers();
```

## Best Practices

1. Always check authentication before making API calls
2. Use the provided error handling patterns
3. Leverage CRUD utilities for standard operations
4. Keep service methods focused and atomic
5. Use TypeScript for better type safety (future enhancement)
6. Handle loading states in components
7. Implement proper error boundaries for API errors
