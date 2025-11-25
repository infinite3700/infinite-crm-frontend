import React, { useState, useEffect } from 'react';
import { userService, authService, taskService } from '../api';

/**
 * Example component demonstrating the new API service usage
 * This component shows how to use the common API services efficiently
 */
const ApiServiceExample = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication status
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Fetch data when component mounts
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch users and tasks in parallel
                const [usersData, tasksData] = await Promise.all([
                    userService.getAllUsers(),
                    taskService.getAllTasks()
                ]);

                setUsers(usersData);
                setTasks(tasksData);
            } catch (err) {
                setError(err.message);
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Handle user creation
    const handleCreateUser = async (userData) => {
        try {
            const newUser = await userService.createUser(userData);
            setUsers(prev => [...prev, newUser]);
            alert('User created successfully!');
        } catch (err) {
            alert(`Failed to create user: ${err.message}`);
        }
    };

    // Handle user update
    const handleUpdateUser = async (userId, userData) => {
        try {
            const updatedUser = await userService.updateUser(userId, userData);
            setUsers(prev => 
                prev.map(user => user.id === userId ? updatedUser : user)
            );
            alert('User updated successfully!');
        } catch (err) {
            alert(`Failed to update user: ${err.message}`);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await userService.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
            alert('User deleted successfully!');
        } catch (err) {
            alert(`Failed to delete user: ${err.message}`);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
                <p>Please log in to view this content.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">API Service Example</h1>
                <p className="text-gray-600">
                    Demonstrating the new common API service architecture
                </p>
                {currentUser && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold">Current User:</h3>
                        <p>{currentUser.name} ({currentUser.email})</p>
                        <button 
                            onClick={handleLogout}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Users Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
                            <button 
                                onClick={() => handleCreateUser({
                                    fullName: 'New User',
                                    email: `user${Date.now()}@example.com`,
                                    role: 'employee',
                                    tempPassword: 'password123'
                                })}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Add User
                            </button>
                        </div>
                        <div className="space-y-3">
                            {users.slice(0, 5).map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                                    <div>
                                        <div className="font-medium">{user.name || user.fullName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                        <div className="text-xs text-gray-400">{user.role}</div>
                                    </div>
                                    <div className="space-x-2">
                                        <button 
                                            onClick={() => handleUpdateUser(user.id, {
                                                fullName: user.name + ' (Updated)',
                                                email: user.email,
                                                role: user.role
                                            })}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Tasks ({tasks.length})</h2>
                        <div className="space-y-3">
                            {tasks.slice(0, 5).map((task, index) => (
                                <div key={task.id || index} className="p-3 border rounded">
                                    <div className="font-medium">{task.title || `Task ${index + 1}`}</div>
                                    <div className="text-sm text-gray-500">{task.description || 'No description'}</div>
                                    <div className="text-xs text-gray-400">{task.status || 'pending'}</div>
                                </div>
                            ))}
                            {tasks.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No tasks found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* API Usage Examples */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">API Usage Examples</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <strong>Authentication:</strong>
                        <code className="block mt-1 p-2 bg-white rounded">
                            {`const isAuth = authService.isAuthenticated();
const user = authService.getCurrentUser();
await authService.logout();`}
                        </code>
                    </div>
                    <div>
                        <strong>User Management:</strong>
                        <code className="block mt-1 p-2 bg-white rounded">
                            {`const users = await userService.getAllUsers();
const user = await userService.getUserById(id);
await userService.createUser(userData);`}
                        </code>
                    </div>
                    <div>
                        <strong>Task Management:</strong>
                        <code className="block mt-1 p-2 bg-white rounded">
                            {`const tasks = await taskService.getAllTasks();
await taskService.createTask(taskData);
await taskService.updateTaskStatus(id, 'completed');`}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiServiceExample;