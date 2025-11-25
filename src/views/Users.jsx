import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  createUser,
  updateUser,
  deleteUser,
  selectUsers, 
  selectUsersLoading, 
  selectUsersCreating,
  selectUsersUpdating,
  selectUsersDeleting,
  selectUsersError 
} from '../store/userSlice';
import { selectIsAuthenticated } from '../store/authSlice';
import AddUserModal from '../components/modals/AddUserModal';
import EditUserModal from '../components/modals/EditUserModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  Search, 
  Plus, 
  Mail, 
  Loader2,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const creating = useSelector(selectUsersCreating);
  const updating = useSelector(selectUsersUpdating);
  const deleting = useSelector(selectUsersDeleting);
  const error = useSelector(selectUsersError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddUser = async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsAddUserModalOpen(false);
      // Refresh user list to get updated data with populated roles
      dispatch(fetchUsers());
      console.log('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      // Let the modal handle the error display
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await dispatch(updateUser({ userId: selectedUser._id, userData })).unwrap();
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
      // Refresh user list to get updated data with populated roles
      dispatch(fetchUsers());
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      // Refresh user list to get updated data
      dispatch(fetchUsers());
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.fullName || user.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role?.name || user.role)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-6 w-6" />
          <span>
            {error.includes('Authentication') 
              ? 'Please log in to view users' 
              : `Error: ${error}`
            }
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="page-title">
            Users
          </h1>
          <p className="page-subtitle hidden sm:block">
            Manage and view all users in your system
          </p>
        </div>
        <Button 
          className="w-full sm:w-auto btn-gradient shadow-medium hover:shadow-large h-10 sm:h-auto"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="button-text">Add User</span>
        </Button>
      </div>

      {/* Search and Filters - Mobile Optimized */}
      <Card className="card-enhanced">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-6">
          <CardTitle className="card-title hidden sm:block">User Directory</CardTitle>
          <CardDescription className="card-description hidden sm:block">
            Search and manage all users ({filteredUsers.length} total)
          </CardDescription>
          <div className="mt-0 sm:mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-colored text-sm h-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table - Mobile Optimized */}
      <Card className="card-enhanced">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-cyan-50 p-3 sm:p-6">
          <CardTitle className="card-title">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="hidden sm:block">
            A list of all users including their contact information and company details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b">
                  <TableHead className="w-[250px] sm:w-[300px] table-header px-2 sm:px-6 py-2 sm:py-3">Name</TableHead>
                  <TableHead className="hidden md:table-cell table-header px-3 sm:px-6 py-2 sm:py-3">Email</TableHead>
                  <TableHead className="hidden lg:table-cell table-header px-3 sm:px-6 py-2 sm:py-3">Role</TableHead>
                  <TableHead className="w-[80px] sm:w-[100px] table-header px-2 sm:px-6 py-2 sm:py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                    <TableCell className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Avatar className="h-6 w-6 sm:h-12 sm:w-12 shadow-soft group-hover:shadow-medium transition-shadow">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-[8px] sm:text-sm">
                            {(user.fullName || user.name)?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="table-cell truncate">{user.fullName || user.name}</div>
                          <div className="md:hidden text-[10px] text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center table-cell-secondary">
                        <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span className="truncate max-w-xs">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          (user.role?.name || user.role) === 'Admin' ? 'bg-red-100 text-red-800' :
                          (user.role?.name || user.role) === 'Manager' ? 'bg-yellow-100 text-yellow-800' :
                          (user.role?.name || user.role) === 'Employee' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role?.name || user.role || 'User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="table-actions">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="action-btn action-btn-primary"
                          title="Edit user"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="action-btn action-btn-danger"
                          title="Delete user"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && searchTerm && (
            <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              <h3 className="section-title mb-1 sm:mb-2">No users found</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                No users found matching <span className="font-medium">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile User Cards (for better mobile experience) */}
      {/* <div className="md:hidden space-y-3">
        {filteredUsers.map((user) => (
          <Card key={`mobile-${user._id}`} className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 shadow-soft">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {(user.fullName || user.name)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{user.fullName || user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    {(user.role?.name || user.role) && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                        (user.role?.name || user.role) === 'Admin' ? 'bg-red-100 text-red-800' :
                        (user.role?.name || user.role) === 'Manager' ? 'bg-yellow-100 text-yellow-800' :
                        (user.role?.name || user.role) === 'Employee' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role?.name || user.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-blue-50 hover:text-blue-600 transition-colors h-9 w-9 p-0 touch-manipulation"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit user</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-50 hover:text-red-600 transition-colors h-9 w-9 p-0 touch-manipulation"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                </div>
              </div>
              {user.company && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <div className="font-medium">{user.company?.name}</div>
                    <div className="text-muted-foreground">{user.company?.catchPhrase}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
        isLoading={creating}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSubmit={handleUpdateUser}
        user={selectedUser}
        isLoading={updating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={deleting}
      />
    </div>
  );
};

export default Users;