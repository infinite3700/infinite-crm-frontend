import React, { useState, useEffect } from 'react';
import { Megaphone, Loader2 } from 'lucide-react';
import { GlobalModal } from '../ui';
import { FormField } from '../ui/form-field';

const CampaignFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  campaign = null,
  loading = false,
  mode = 'add', // 'add' or 'edit'
}) => {
  const isEditMode = mode === 'edit' || !!campaign;

  const [formData, setFormData] = useState({
    campaignName: '',
    campaignDescription: '',
    campaignStartDate: '',
    campaignEndDate: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Populate form when campaign changes or modal opens (edit mode)
  useEffect(() => {
    if (campaign && isOpen && isEditMode) {
      setFormData({
        campaignName: campaign.campaignName || '',
        campaignDescription: campaign.campaignDescription || '',
        campaignStartDate: campaign.campaignStartDate || '',
        campaignEndDate: campaign.campaignEndDate || '',
        status: campaign.status || 'active',
      });
      setErrors({});
    } else if (isOpen && !isEditMode) {
      // Reset form for add mode
      setFormData({
        campaignName: '',
        campaignDescription: '',
        campaignStartDate: '',
        campaignEndDate: '',
        status: 'active',
      });
    }
  }, [campaign, isOpen, isEditMode]);

  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;
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

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    } else if (formData.campaignName.trim().length < 3) {
      newErrors.campaignName = 'Campaign name must be at least 3 characters';
    }

    if (!formData.campaignDescription.trim()) {
      newErrors.campaignDescription = 'Campaign description is required';
    } else if (formData.campaignDescription.trim().length < 10) {
      newErrors.campaignDescription = 'Campaign description must be at least 10 characters';
    }

    if (!formData.campaignStartDate) {
      newErrors.campaignStartDate = 'Start date is required';
    }

    if (!formData.campaignEndDate) {
      newErrors.campaignEndDate = 'End date is required';
    }

    // Validate that end date is after start date
    if (formData.campaignStartDate && formData.campaignEndDate) {
      const startDate = new Date(formData.campaignStartDate);
      const endDate = new Date(formData.campaignEndDate);
      if (endDate < startDate) {
        newErrors.campaignEndDate = 'End date must be after start date';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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
      await onSubmit(formData);
      setSubmitSuccess(`Campaign ${isEditMode ? 'updated' : 'created'} successfully!`);

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} campaign:`, error);
      setSubmitError(
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} campaign. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      campaignName: '',
      campaignDescription: '',
      campaignStartDate: '',
      campaignEndDate: '',
      status: 'active',
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
          ? 'Update Campaign'
          : 'Create Campaign',
      variant: 'gradient',
      onClick: handleSubmit,
      disabled: isSubmitting || loading,
      icon: isSubmitting || loading ? <Loader2 /> : <Megaphone />,
      loading: isSubmitting || loading,
      flex: true,
    },
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Campaign' : 'Add New Campaign'}
      headerIcon={<Megaphone />}
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
        {/* Campaign Name */}
        <FormField
          id="campaignName"
          type="text"
          label="Campaign Name"
          placeholder="e.g., Summer Sale 2025"
          value={formData.campaignName}
          onChange={handleInputChange('campaignName')}
          icon={Megaphone}
          error={errors.campaignName}
          required
          size="default"
        />

        {/* Campaign Description */}
        <FormField
          id="campaignDescription"
          type="textarea"
          label="Campaign Description"
          placeholder="Enter campaign description"
          value={formData.campaignDescription}
          onChange={handleInputChange('campaignDescription')}
          error={errors.campaignDescription}
          required
          size="default"
          rows={3}
        />

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            id="campaignStartDate"
            type="date"
            label="Start Date"
            value={formData.campaignStartDate}
            onChange={handleInputChange('campaignStartDate')}
            error={errors.campaignStartDate}
            required
            size="default"
          />

          <FormField
            id="campaignEndDate"
            type="date"
            label="End Date"
            value={formData.campaignEndDate}
            onChange={handleInputChange('campaignEndDate')}
            error={errors.campaignEndDate}
            required
            size="default"
          />
        </div>

        {/* Status */}
        <FormField
          id="status"
          type="select"
          label="Status"
          value={formData.status}
          onChange={handleInputChange('status')}
          error={errors.status}
          required
          placeholder="Select status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'completed', label: 'Completed' },
            { value: 'scheduled', label: 'Scheduled' },
          ]}
          size="default"
        />
      </form>
    </GlobalModal>
  );
};

export default CampaignFormModal;

