import React, { useState, useEffect } from 'react';
import { GlobalModal } from '../ui';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

const SimpleSettingsDialog = ({
  isOpen,
  onClose,
  onSave,
  item = null,
  title,
  description,
  fieldLabel = 'Name',
  fieldName = 'name',
  placeholder = 'Enter name',
  isLoading = false
}) => {
  const [formData, setFormData] = useState({ [fieldName]: '', status: true });

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        // Editing existing item
        setFormData({
          [fieldName]: item[fieldName] || '',
          status: item.status !== undefined ? item.status : true
        });
      } else {
        // Creating new item
        setFormData({ [fieldName]: '', status: true });
      }
    }
  }, [isOpen, item, fieldName]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (formData[fieldName].trim()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setFormData({ [fieldName]: '', status: true });
    onClose();
  };

  const isFormValid = formData[fieldName].trim().length > 0;

  const actions = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: handleCancel,
      disabled: isLoading,
      className: 'w-full sm:w-auto'
    },
    {
      label: isLoading ? 'Saving...' : (item ? 'Update' : 'Create'),
      variant: 'default',
      onClick: handleSave,
      disabled: isLoading || !isFormValid,
      icon: isLoading ? <Loader2 /> : undefined,
      loading: isLoading,
      className: 'w-full sm:w-auto'
    }
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? `Edit ${title}` : `Add ${title}`}
      description={description}
      size="md"
      actions={actions}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
            {fieldLabel}
          </Label>
          <Input
            id={fieldName}
            name={fieldName}
            type="text"
            placeholder={placeholder}
            value={formData[fieldName]}
            onChange={handleInputChange}
            className="w-full"
            autoFocus
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id="status"
            name="status"
            type="checkbox"
            checked={formData.status}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Active
          </Label>
        </div>
      </div>
    </GlobalModal>
  );
};

export default SimpleSettingsDialog;