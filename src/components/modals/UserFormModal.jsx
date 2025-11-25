import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, UserCheck, Phone, Loader2 } from 'lucide-react';
import { GlobalModal } from '../ui';
import { FormField } from '../ui/form-field';
import { rolesService } from '../../api/rolesService';

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user = null, // null for add mode, user object for edit mode
  loading = false,
  mode = 'add', // 'add' or 'edit'
}) => {
  const isEditMode = mode === 'edit' || !!user;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    tempPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Fetch roles when modal opens
  useEffect(() => {
    const fetchRoles = async () => {
      if (isOpen) {
        setRolesLoading(true);
        try {
          const fetchedRoles = await rolesService.getAllRoles();
          console.log('UserFormModal - Fetched roles:', fetchedRoles);
          setRoles(fetchedRoles);
        } catch (error) {
          console.error('Failed to fetch roles:', error);
          setSubmitError('Failed to load roles. Please refresh and try again.');
        } finally {
          setRolesLoading(false);
        }
      }
    };

    fetchRoles();
  }, [isOpen]);

  // Set default role for add mode when roles are loaded
  useEffect(() => {
    if (!isEditMode && roles.length > 0 && !formData.role) {
      setFormData((prev) => ({
        ...prev,
        role: roles[0]._id,
      }));
    }
  }, [roles, isEditMode, formData.role]);

  // Populate form when user changes or modal opens (edit mode)
  useEffect(() => {
    if (user && isOpen && isEditMode) {
      console.log('UserFormModal - User object received:', user);
      console.log('UserFormModal - User role:', user.role);
      console.log('UserFormModal - Role type:', typeof user.role);

      const extractedRole = typeof user.role === 'object' ? user.role._id : user.role || '';
      console.log('UserFormModal - Extracted role for form:', extractedRole);

      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        tempPassword: '', // Don't populate password for security
        // Handle both ObjectId and string role values
        role: extractedRole,
      });
      setErrors({});
    } else if (isOpen && !isEditMode) {
      // Reset form for add mode
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        tempPassword: '',
        role: roles.length > 0 ? roles[0]._id : '',
      });
    }
  }, [user, isOpen, isEditMode, roles]);

  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;
    console.log(`UserFormModal - Field '${field}' changed to:`, newValue);

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile is optional but if provided, should be valid
    if (
      formData.mobile &&
      formData.mobile.trim() &&
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.mobile.replace(/\s+/g, ''))
    ) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    // Password validation only for add mode or when password is provided in edit mode
    if (!isEditMode || formData.tempPassword.trim()) {
      if (!formData.tempPassword.trim()) {
        newErrors.tempPassword = 'Password is required';
      } else if (formData.tempPassword.length < 6) {
        newErrors.tempPassword = 'Password must be at least 6 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.tempPassword)) {
        newErrors.tempPassword =
          'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // For edit mode, only include password if it's provided
      const submitData = { ...formData };
      if (isEditMode && !formData.tempPassword.trim()) {
        delete submitData.tempPassword;
      }

      console.log('UserFormModal submitting data:', submitData);
      console.log('Role value type:', typeof submitData.role, 'Value:', submitData.role);

      await onSubmit(submitData);
      setSubmitSuccess(`User ${isEditMode ? 'updated' : 'created'} successfully!`);

      // Auto-close after success (optional)
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} user:`, error);
      setSubmitError(
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      tempPassword: '',
      role: roles.length > 0 ? roles[0]._id : '',
    });
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const actions = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: handleClose,
      disabled: isSubmitting || loading,
      flex: true,
    },
    {
      label:
        isSubmitting || loading
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isEditMode
          ? 'Update User'
          : 'Create User',
      variant: 'gradient',
      onClick: handleSubmit,
      disabled: isSubmitting || loading,
      icon: isSubmitting || loading ? <Loader2 /> : <UserCheck />,
      loading: isSubmitting || loading,
      flex: true,
    },
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit User' : 'Add New User'}
      // description={isEditMode ? 'Update user account details' : 'Create a new user account with required details'}
      headerIcon={<User />}
      size="md"
      actions={actions}
    >
      {/* Error Display */}
      {submitError && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{submitError}</p>
        </div>
      )}

      {/* Success Display */}
      {submitSuccess && (
        <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-600">{submitSuccess}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <FormField
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          icon={User}
          error={errors.fullName}
          required
          size="default"
        />

        {/* Email */}
        <FormField
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleInputChange('email')}
          icon={Mail}
          error={errors.email}
          required
          size="default"
        />

        {/* Mobile */}
        <FormField
          id="mobile"
          type="tel"
          label="Mobile Number"
          placeholder="Enter mobile number (optional)"
          value={formData.mobile}
          onChange={handleInputChange('mobile')}
          icon={Phone}
          error={errors.mobile}
          size="default"
        />

        {/* Password */}
        <FormField
          id="tempPassword"
          type="password"
          label={isEditMode ? 'New Password (optional)' : 'Temporary Password'}
          placeholder={
            isEditMode ? 'Leave blank to keep current password' : 'Enter temporary password'
          }
          value={formData.tempPassword}
          onChange={handleInputChange('tempPassword')}
          icon={Lock}
          error={errors.tempPassword}
          required={!isEditMode}
          size="default"
          helpText={
            isEditMode
              ? 'Leave blank to keep current password. If changing, password must be at least 6 characters with uppercase, lowercase, and number'
              : 'Password must be at least 6 characters with uppercase, lowercase, and number'
          }
        />

        {/* Role */}
        <FormField
          id="role"
          type="select"
          label="Role"
          value={formData.role}
          onChange={handleInputChange('role')}
          icon={UserCheck}
          rightIcon={rolesLoading ? Loader2 : undefined}
          error={errors.role}
          required
          disabled={rolesLoading}
          placeholder="Select a role"
          options={roles.map((role) => ({ value: role._id, label: role.name }))}
          size="default"
        />
      </form>
    </GlobalModal>
  );
};

export default UserFormModal;
