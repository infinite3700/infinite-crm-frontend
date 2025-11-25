import { apiMethods, crudService, authHelpers } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Task service using the common API client
export const taskService = {
    // Get all tasks with optional filters
    getAllTasks: async (params = {}) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.TASKS.GET_ALL, { params });

            // Normalize response structure
            return response.tasks || response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch tasks');
        }
    },

    // Get task by ID
    getTaskById: async (taskId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await crudService.getById(API_ENDPOINTS.TASKS.BASE, taskId);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch task');
        }
    },

    // Create new task
    createTask: async (taskData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await crudService.create(API_ENDPOINTS.TASKS.BASE, taskData);
        } catch (error) {
            throw new Error(error.message || 'Failed to create task');
        }
    },

    // Update task
    updateTask: async (taskId, taskData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await crudService.update(API_ENDPOINTS.TASKS.BASE, taskId, taskData);
        } catch (error) {
            throw new Error(error.message || 'Failed to update task');
        }
    },

    // Delete task
    deleteTask: async (taskId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await crudService.delete(API_ENDPOINTS.TASKS.BASE, taskId);
        } catch (error) {
            throw new Error(error.message || 'Failed to delete task');
        }
    },

    // Update task status
    updateTaskStatus: async (taskId, status) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await apiMethods.patch(API_ENDPOINTS.TASKS.UPDATE_STATUS(taskId), { status });
        } catch (error) {
            throw new Error(error.message || 'Failed to update task status');
        }
    },

    // Assign task to user
    assignTask: async (taskId, userId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            return await apiMethods.patch(API_ENDPOINTS.TASKS.ASSIGN(taskId), { assignedTo: userId });
        } catch (error) {
            throw new Error(error.message || 'Failed to assign task');
        }
    },

    // Get tasks by user
    getTasksByUser: async (userId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.TASKS.GET_BY_USER(userId));
            return response.tasks || response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user tasks');
        }
    },

    // Get current user's tasks
    getMyTasks: async () => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const currentUser = authHelpers.getCurrentUser();
            if (!currentUser) {
                throw new Error('User information not available');
            }

            return await taskService.getTasksByUser(currentUser.id);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch your tasks');
        }
    },
};