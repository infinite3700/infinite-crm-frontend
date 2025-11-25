import React, { useState } from 'react';
import { userService, authService } from '../api';

const ApiTestComponent = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testAuth = () => {
        const isAuth = authService.isAuthenticated();
        const user = authService.getCurrentUser();
        const token = localStorage.getItem('auth_token');
        
        setResult(`
Authentication Status: ${isAuth}
Current User: ${JSON.stringify(user, null, 2)}
Token exists: ${!!token}
Token preview: ${token ? token.substring(0, 20) + '...' : 'None'}
        `);
    };

    const testUsersAPI = async () => {
        setLoading(true);
        try {
            const users = await userService.getAllUsers();
            setResult(`
✅ Users API Success!
Users count: ${users.length}
Users data: ${JSON.stringify(users, null, 2)}
            `);
        } catch (error) {
            setResult(`
❌ Users API Error:
Error: ${error.message}
Stack: ${error.stack || 'No stack trace'}
            `);
        } finally {
            setLoading(false);
        }
    };

    const testLogin = async () => {
        setLoading(true);
        try {
            // Try a test login (you may need to adjust credentials)
            const response = await authService.login({
                login: 'test@example.com',
                password: 'password123'
            });
            setResult(`
✅ Login Success!
Response: ${JSON.stringify(response, null, 2)}
            `);
        } catch (error) {
            setResult(`
❌ Login Error:
Error: ${error.message}
Stack: ${error.stack || 'No stack trace'}
            `);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">API Test Component</h1>
            
            <div className="space-y-4 mb-6">
                <button 
                    onClick={testAuth}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Test Authentication Status
                </button>
                
                <button 
                    onClick={testLogin}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Testing Login...' : 'Test Login'}
                </button>
                
                <button 
                    onClick={testUsersAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                    {loading ? 'Testing Users API...' : 'Test Users API'}
                </button>
            </div>

            {result && (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Result:</h3>
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default ApiTestComponent;