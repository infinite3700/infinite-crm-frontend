import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FormField } from '../components/ui/form-field';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
  Camera,
  AtSign,
} from 'lucide-react';
import { userService } from '../api/userService';

const ProfileEditPage = () => {
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

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();

      const userFormData = {
        name: userData.name || userData.fullName || '',
        username: userData.username || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        role: userData.role || { name: '', _id: '' },
      };

      setFormData(userFormData);
      setUserId(userData.id || userData._id);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      console.error('Error loading current user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.mobile && !/^[+]?[1-9][\d]{9,14}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
      };

      await userService.updateUser(userId, updateData);

      setSuccessMessage('Profile updated successfully!');

      setTimeout(() => {
        navigate('/settings');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in px-2 sm:px-0 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings')}
          className="h-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          <span className="text-xs">Back</span>
        </Button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        {/* Profile Picture */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title="Change photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click camera icon to change photo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <User className="h-4 w-4 mr-1.5 text-gray-500" />
              Basic Information
            </h2>
            <div className="space-y-3">
              <FormField
                id="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange('name')}
                icon={User}
                error={errors.name}
                required
                size="default"
              />

              <FormField
                id="username"
                type="text"
                label="Username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange('username')}
                icon={AtSign}
                error={errors.username}
                disabled
                size="default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-1.5 text-gray-500" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <FormField
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                icon={Mail}
                error={errors.email}
                required
                size="default"
              />

              <FormField
                id="mobile"
                type="tel"
                label="Mobile Number"
                placeholder="+919876543210"
                value={formData.mobile}
                onChange={handleInputChange('mobile')}
                icon={Phone}
                error={errors.mobile}
                size="default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Information (Read-only) */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-1.5 text-gray-500" />
              Role
            </h2>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Current Role</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {formData.role?.name || 'No role assigned'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Contact your administrator to change your role
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 sticky bottom-0 bg-white pb-4 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/settings')}
            disabled={saving}
            className="flex-1 h-10"
          >
            <span className="text-sm">Cancel</span>
          </Button>
          <Button type="submit" disabled={saving} className="flex-1 h-10">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                <span className="text-sm">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                <span className="text-sm">Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;

