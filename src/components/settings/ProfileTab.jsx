import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FormField } from '../ui/form-field';
import { User, Mail, Shield, Save, X, Phone, Edit, Camera } from 'lucide-react';
import { userService } from '../../api/userService';

const ProfileTab = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    role: {
      name: '',
      _id: '',
    },
  });

  const [originalData, setOriginalData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await userService.getCurrentUser();

        const userData = {
          name: user.name || user.fullName,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        };

        setFormData(userData);
        setOriginalData(userData);
        setUserId(user.id || user._id); // Store user ID for updates
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Load current user data on component mount
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();

      const userFormData = {
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        role: userData.role || { name: '', _id: '' },
      };

      setFormData(userFormData);
      setOriginalData(userFormData);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      console.error('Error loading current user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate that we have a userId
      if (!userId) {
        throw new Error('User ID not found. Please refresh the page.');
      }

      // Update user profile via PUT API
      const updatedUser = await userService.updateUser(userId, {
        fullName: formData.name, // Send as fullName for userService compatibility
        email: formData.email,
        mobile: formData.mobile,
        // Note: role is read-only, so we don't send it
      });

      // Update local state with the updated data
      const updatedFormData = {
        name: updatedUser.name || updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
      };

      setFormData(updatedFormData);
      setOriginalData(updatedFormData);
      setIsEditModalOpen(false);
      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // Handle specific backend validation errors
      let errorMessage = 'Failed to update profile';

      if (err.message.includes('Email already exists')) {
        errorMessage = 'This email address is already registered by another user.';
      } else if (err.message.includes('Mobile number already registered')) {
        errorMessage = 'This mobile number is already registered by another user.';
      } else if (err.message.includes('Username already taken')) {
        errorMessage = 'This username is already taken by another user.';
      } else if (err.message.includes('Authentication required')) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData(originalData);
    setIsEditModalOpen(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {!loading && (
        <>
          {/* Unified Profile Card */}
          <Card className="card-enhanced">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shadow-lg ring-4 ring-white">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg sm:text-xl font-semibold">
                      {(formData.name || '')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="card-title">{formData.name || 'User Profile'}</CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 mt-1 rounded-full card-title font-medium ${
                          (formData.role?.name || formData.role) === 'Admin'
                            ? 'bg-red-100 text-red-800'
                            : (formData.role?.name || formData.role) === 'Manager'
                            ? 'bg-yellow-100 text-yellow-800'
                            : (formData.role?.name || formData.role) === 'Employee'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <Shield className="mr-1.5 h-3 w-3" />
                        {formData.role?.name || formData.role || 'No Role'}
                      </span>
                      <CardDescription className="text-sm text-gray-600">
                        @{formData.username || 'username'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                {/* Desktop: Show Modal, Mobile: Navigate to Page */}
                <Button
                  onClick={() => {
                    const isMobile = window.innerWidth < 768;
                    if (isMobile) {
                      navigate('/settings/profile/edit');
                    } else {
                      setIsEditModalOpen(true);
                    }
                  }}
                  className="w-full sm:w-auto btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Email Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Email</h4>
                      <p className="text-sm text-gray-900 truncate">
                        {formData.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-green-700 mb-0.5">Mobile</h4>
                      <p className="text-sm text-gray-900 truncate">
                        {formData.mobile || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Username Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-purple-700 mb-0.5">Username</h4>
                      <p className="text-sm text-gray-900 truncate">
                        {formData.username || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formData.name ? formData.name.split(' ').length : 0}
                    </div>
                    <div className="text-sm text-gray-500">Name Parts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm text-gray-500">Profile Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formData.role?.name ? '1' : '0'}
                    </div>
                    <div className="text-sm text-gray-500">Roles Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(formData.email ? 1 : 0) + (formData.mobile ? 1 : 0)}
                    </div>
                    <div className="text-sm text-gray-500">Contact Methods</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleCancel}
              ></div>

              {/* Modal */}
              <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 overflow-hidden">
                <CardHeader className="text-center pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                        <Edit className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="modal-title">Edit Profile</CardTitle>
                      {/* <CardDescription className="modal-description mt-1">
                        Update your personal information and contact details
                      </CardDescription> */}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="space-y-4"
                  >
                    {/* Profile Picture Section */}
                    {/* <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                      <Avatar className="h-16 w-16 shadow-lg">
                        <AvatarImage src="" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {(formData.name || '').split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">Profile Photo</h3>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="text-xs px-3 py-1.5"
                          disabled
                        >
                          <Camera className="mr-1 h-3 w-3" />
                          Change Photo
                        </Button>
                      </div>
                    </div> */}

                    {/* Full Name */}
                    <FormField
                      id="edit-name"
                      name="name"
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      icon={User}
                      required
                    />

                    {/* Username and Role (Read-only) - Same Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Username (Read-only) */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            value={formData.username || 'Not specified'}
                            disabled
                            className="pl-10 bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Username cannot be changed</p>
                      </div>

                      {/* Role (Read-only) */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Current Role</Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <div className="pl-10 h-10 text-sm bg-gray-50 border border-gray-200 rounded-md flex items-center px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                (formData.role?.name || formData.role) === 'Admin'
                                  ? 'bg-red-100 text-red-800'
                                  : (formData.role?.name || formData.role) === 'Manager'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : (formData.role?.name || formData.role) === 'Employee'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {formData.role?.name || formData.role || 'Not specified'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Role is managed by administrators</p>
                      </div>
                    </div>

                    {/* Email */}
                    <FormField
                      id="edit-email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      icon={Mail}
                      required
                    />

                    {/* Mobile */}
                    <FormField
                      id="edit-mobile"
                      name="mobile"
                      type="tel"
                      label="Mobile Number"
                      placeholder="Enter your mobile number"
                      value={formData.mobile || ''}
                      onChange={handleInputChange}
                      icon={Phone}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="gradient"
                        size="default"
                        className="flex-1"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileTab;
