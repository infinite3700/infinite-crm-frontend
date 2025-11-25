import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Shield, Users, Key, Plus, Search, Edit, Trash2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import GenericDeleteModal from '../modals/GenericDeleteModal';
import { settingsService } from '../../api/settingsService';

const RolesPermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('roles'); // 'roles' or 'permissions'
  
  // Loading and error states
  const [loading, setLoading] = useState({ roles: false, permissions: false, action: false });
  const [error, setError] = useState('');
  
  // Modal dialog states
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: '', // 'add-role', 'edit-role', 'add-permission', 'edit-permission'
    editingItem: null,
    isSubmitting: false
  });
  
  // Form data
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
  const [permissionForm, setPermissionForm] = useState({ key: '', description: '' });
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', // 'role' or 'permission'
    item: null,
    isLoading: false
  });

  // Data states
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  // API functions
  const loadRoles = async () => {
    try {
      setLoading(prev => ({ ...prev, roles: true }));
      setError('');
      const response = await settingsService.roles.getAll();
      
      // Transform the backend response to match frontend expectations
      const transformedRoles = (response.data || []).map(role => ({
        ...role,
        // Map permission objects to permission IDs for form handling
        permissions: (role.permission || []).map(p => p._id),
        // Keep the full permission objects for display
        permissionObjects: role.permission || [],
        userCount: 0 // Backend doesn't provide user count yet
      }));
      
      setRoles(transformedRoles);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setError('Failed to load roles. Please try again.');
      // Fallback to sample data if API fails
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const loadPermissions = async () => {
    try {
      setLoading(prev => ({ ...prev, permissions: true }));
      setError('');
      const response = await settingsService.permissions.getAll();
      setPermissions(response.data || []);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      setError('Failed to load permissions. Please try again.');
      // Fallback to sample data if API fails
    
    } finally {
      setLoading(prev => ({ ...prev, permissions: false }));
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter(permission =>
    permission.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions for roles
  const handleAddRole = async (formData) => {
    if (!formData.name.trim() || !formData.description.trim()) return;
    
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      const roleData = {
        name: formData.name,
        description: formData.description,
        permission: formData.permissions // Backend expects 'permission' field with permission IDs
      };
      
      const response = await settingsService.roles.create(roleData);
      
      if (response.data) {
        // Transform the response to match frontend format
        const newRole = {
          ...response.data,
          permissions: (response.data.permission || []).map(p => p._id),
          permissionObjects: response.data.permission || [],
          userCount: 0
        };
        
        setRoles(prev => [...prev, newRole]);
        setRoleForm({ name: '', description: '', permissions: [] });
        setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
      }
    } catch (error) {
      console.error('Failed to create role:', error);
      setError(error.message || 'Failed to create role. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleEditRole = (role) => {
    setDialogState({
      isOpen: true,
      type: 'edit-role',
      editingItem: role,
      isSubmitting: false
    });
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
  };

  const handleUpdateRole = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      const roleData = {
        name: formData.name,
        description: formData.description,
        permission: formData.permissions // Backend expects 'permission' field with permission IDs
      };
      
      const response = await settingsService.roles.update(dialogState.editingItem._id, roleData);
      
      if (response.data) {
        // Transform the response to match frontend format
        const updatedRole = {
          ...response.data,
          permissions: (response.data.permission || []).map(p => p._id),
          permissionObjects: response.data.permission || [],
          userCount: roles.find(r => r._id === dialogState.editingItem._id)?.userCount || 0
        };
        
        setRoles(prev => prev.map(role => 
          role._id === dialogState.editingItem._id ? updatedRole : role
        ));
        setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
        setRoleForm({ name: '', description: '', permissions: [] });
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      setError(error.message || 'Failed to update role. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteRole = (role) => {
    setDeleteModal({
      isOpen: true,
      type: 'role',
      item: role,
      isLoading: false
    });
  };

  // Handler functions for permissions
  const handleAddPermission = async (formData) => {
    if (!formData.key.trim() || !formData.description.trim()) return;
    
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      const permissionData = {
        key: formData.key,
        description: formData.description
      };
      
      const response = await settingsService.permissions.create(permissionData);
      
      if (response.data) {
        setPermissions(prev => [...prev, response.data]);
        setPermissionForm({ key: '', description: '' });
        setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
      }
    } catch (error) {
      console.error('Failed to create permission:', error);
      setError(error.message || 'Failed to create permission. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleEditPermission = (permission) => {
    setDialogState({
      isOpen: true,
      type: 'edit-permission',
      editingItem: permission,
      isSubmitting: false
    });
    setPermissionForm({
      key: permission.key,
      description: permission.description
    });
  };

  const handleUpdatePermission = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      const permissionData = {
        key: formData.key,
        description: formData.description
      };
      
      const response = await settingsService.permissions.update(dialogState.editingItem._id, permissionData);
      
      if (response.data) {
        setPermissions(prev => prev.map(permission => 
          permission._id === dialogState.editingItem._id ? response.data : permission
        ));
        setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
        setPermissionForm({ key: '', description: '' });
      }
    } catch (error) {
      console.error('Failed to update permission:', error);
      setError(error.message || 'Failed to update permission. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeletePermission = (permission) => {
    setDeleteModal({
      isOpen: true,
      type: 'permission',
      item: permission,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (deleteModal.type === 'role') {
        await settingsService.roles.delete(deleteModal.item._id);
        setRoles(prev => prev.filter(r => r._id !== deleteModal.item._id));
      } else {
        await settingsService.permissions.delete(deleteModal.item._id);
        setPermissions(prev => prev.filter(p => p._id !== deleteModal.item._id));
        // Also remove this permission from all roles
        setRoles(prev => prev.map(role => ({
          ...role,
          permissions: role.permissions.filter(pId => pId !== deleteModal.item._id),
          permissionObjects: role.permissionObjects?.filter(p => p._id !== deleteModal.item._id) || []
        })));
      }
      
      setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false });
    } catch (error) {
      console.error('Failed to delete:', error);
      setError(`Failed to delete ${deleteModal.type}. Please try again.`);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const togglePermissionForRole = (permissionId) => {
    const updatedPermissions = roleForm.permissions.includes(permissionId)
      ? roleForm.permissions.filter(id => id !== permissionId)
      : [...roleForm.permissions, permissionId];
    
    setRoleForm({ ...roleForm, permissions: updatedPermissions });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h3 className="section-title">Roles & Permissions Management</h3>
        <p className="section-subtitle">
          Manage user roles and system permissions
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-3">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          <div className="body-text text-red-800">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading.roles || loading.permissions) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-center space-x-3">
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-spin flex-shrink-0" />
          <div className="body-text text-blue-800">
            Loading {loading.roles ? 'roles' : 'permissions'}...
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('roles')}
          className={`px-3 sm:px-4 py-2 rounded-md tab-text transition-colors ${
            activeSection === 'roles'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Roles
        </button>
        <button
          onClick={() => setActiveSection('permissions')}
          className={`px-3 sm:px-4 py-2 rounded-md tab-text transition-colors ${
            activeSection === 'permissions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="h-4 w-4 inline mr-2" />
          Permissions
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeSection}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Roles Section */}
      {activeSection === 'roles' && (
        <div className="space-y-6">
          {/* Roles Management Card */}
          <Card className="card-enhanced">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="card-title">Roles Management</CardTitle>
                  <CardDescription className="text-sm">
                    Manage user roles and their permissions
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setDialogState({ isOpen: true, type: 'add-role', editingItem: null, isSubmitting: false })}
                  className="w-full sm:w-auto btn-gradient"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRoles.map((role) => (
                      <tr key={role._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-blue-600 mr-2" />
                            <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{role.description}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(role.permissionObjects || []).slice(0, 2).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission.key}
                              </Badge>
                            ))}
                            {(role.permissionObjects || []).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissionObjects.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{role.userCount || 0}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRole(role)}
                              disabled={loading.action}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRole(role)}
                              disabled={loading.action}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRoles.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No roles found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Section */}
      {activeSection === 'permissions' && (
        <div className="space-y-6">
          {/* Permissions Management Card */}
          <Card className="card-enhanced">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="card-title">Permissions Management</CardTitle>
                  <CardDescription className="text-sm">
                    Manage system permissions and access controls
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setDialogState({ isOpen: true, type: 'add-permission', editingItem: null, isSubmitting: false })}
                  className="w-full sm:w-auto btn-gradient"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Permission
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permission Key
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPermissions.map((permission) => (
                      <tr key={permission._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Key className="h-4 w-4 text-orange-600 mr-2" />
                            <div className="text-sm font-medium text-gray-900 font-mono">{permission.key}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPermission(permission)}
                              disabled={loading.action}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePermission(permission)}
                              disabled={loading.action}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPermissions.length === 0 && (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No permissions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.type === 'role' ? 'Role' : 'Permission'}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? ${deleteModal.type === 'role' ? 'This will remove the role from all users.' : 'This will remove the permission from all roles.'}`}
        itemName={deleteModal.item?.name || deleteModal.item?.key}
        itemType={deleteModal.type}
        isLoading={deleteModal.isLoading}
      />

      {/* Add/Edit Role Modal */}
      {dialogState.isOpen && (dialogState.type === 'add-role' || dialogState.type === 'edit-role') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
          ></div>
          
          {/* Modal */}
          <Card className="relative w-full max-w-2xl mx-4 shadow-2xl border-0 overflow-hidden max-h-[90vh] overflow-y-auto">
            <CardHeader className="text-center pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="modal-title">
                    {dialogState.type === 'add-role' ? 'Add New Role' : 'Edit Role'}
                  </CardTitle>
                  <CardDescription className="modal-description mt-1">
                    {dialogState.type === 'add-role' ? 'Create a new user role with permissions' : 'Update role information and permissions'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                if (dialogState.type === 'add-role') {
                  handleAddRole(roleForm);
                } else {
                  handleUpdateRole(roleForm);
                }
              }} className="space-y-6">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-roleName" className="text-sm font-semibold text-gray-700">
                      Role Name *
                    </Label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                      <Input
                        id="modal-roleName"
                        type="text"
                        placeholder="Enter role name"
                        value={roleForm.name}
                        onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                        className="pl-10 transition-all duration-300 focus:shadow-colored"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-roleDescription" className="text-sm font-semibold text-gray-700">
                      Description *
                    </Label>
                    <Input
                      id="modal-roleDescription"
                      type="text"
                      placeholder="Describe the role"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                      className="transition-all duration-300 focus:shadow-colored"
                      required
                    />
                  </div>
                </div>

                {/* Permissions Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Permissions
                  </Label>
                  <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission._id} className="flex items-start space-x-3 p-2 hover:bg-gray-100 rounded">
                          <input
                            type="checkbox"
                            id={`modal-permission-${permission._id}`}
                            checked={roleForm.permissions.includes(permission._id)}
                            onChange={() => togglePermissionForRole(permission._id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={`modal-permission-${permission._id}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer block"
                            >
                              {permission.key}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {roleForm.permissions.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">No permissions selected</p>
                    )}
                    {roleForm.permissions.length > 0 && (
                      <p className="text-sm text-blue-600 mt-3 text-center font-medium">
                        {roleForm.permissions.length} permission{roleForm.permissions.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                    className="flex-1"
                    disabled={dialogState.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold"
                    disabled={dialogState.isSubmitting || !roleForm.name.trim() || !roleForm.description.trim()}
                  >
                    {dialogState.isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {dialogState.type === 'add-role' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {dialogState.type === 'add-role' ? 'Create Role' : 'Update Role'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Permission Modal */}
      {dialogState.isOpen && (dialogState.type === 'add-permission' || dialogState.type === 'edit-permission') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
          ></div>
          
          {/* Modal */}
          <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-4 px-6 pt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center mb-3 shadow-lg">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="modal-title">
                    {dialogState.type === 'add-permission' ? 'Add New Permission' : 'Edit Permission'}
                  </CardTitle>
                  <CardDescription className="modal-description mt-1">
                    {dialogState.type === 'add-permission' ? 'Create a new system permission' : 'Update permission information'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                if (dialogState.type === 'add-permission') {
                  handleAddPermission(permissionForm);
                } else {
                  handleUpdatePermission(permissionForm);
                }
              }} className="space-y-4">
                {/* Permission Key */}
                <div className="space-y-2">
                  <Label htmlFor="modal-permissionKey" className="text-sm font-semibold text-gray-700">
                    Permission Key *
                  </Label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10" />
                    <Input
                      id="modal-permissionKey"
                      type="text"
                      placeholder="e.g., create_reports"
                      value={permissionForm.key}
                      onChange={(e) => setPermissionForm({ ...permissionForm, key: e.target.value })}
                      className="pl-10 transition-all duration-300 focus:shadow-colored font-mono"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Use lowercase with underscores (e.g., manage_users)</p>
                </div>

                {/* Permission Description */}
                <div className="space-y-2">
                  <Label htmlFor="modal-permissionDescription" className="text-sm font-semibold text-gray-700">
                    Description *
                  </Label>
                  <Input
                    id="modal-permissionDescription"
                    type="text"
                    placeholder="Describe what this permission allows"
                    value={permissionForm.description}
                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                    className="transition-all duration-300 focus:shadow-colored"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                    className="flex-1"
                    disabled={dialogState.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 hover:from-orange-700 hover:via-yellow-700 hover:to-orange-700 text-white font-semibold"
                    disabled={dialogState.isSubmitting || !permissionForm.key.trim() || !permissionForm.description.trim()}
                  >
                    {dialogState.isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {dialogState.type === 'add-permission' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {dialogState.type === 'add-permission' ? 'Create Permission' : 'Update Permission'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsTab;