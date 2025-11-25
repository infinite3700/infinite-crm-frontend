import React, { useState, useEffect } from 'react';
import { GlobalModal } from '../ui';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Loader2 } from 'lucide-react';

const GeographyDialog = ({
  isOpen,
  onClose,
  onSave,
  item = null,
  type = 'state', // 'state' or 'district'
  states = [], // Available states for district creation
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    status: true
  });

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        // Editing existing item
        setFormData({
          state: item.state || '',
          district: item.district || '',
          status: item.status !== undefined ? item.status : true
        });
      } else {
        // Creating new item
        setFormData({
          state: '',
          district: '',
          status: true
        });
      }
    }
  }, [isOpen, item]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (type === 'state' && formData.state.trim()) {
      onSave({ state: formData.state, status: formData.status });
    } else if (type === 'district' && formData.state && formData.district.trim()) {
      onSave({ state: formData.state, district: formData.district, status: formData.status });
    }
  };

  const handleCancel = () => {
    setFormData({ state: '', district: '', status: true });
    onClose();
  };

  const isFormValid = type === 'state' 
    ? formData.state.trim().length > 0
    : formData.state && formData.district.trim().length > 0;

  const getTitle = () => {
    if (type === 'state') {
      return item ? 'Edit' : 'Add';
    }
    return item ? 'Edit' : 'Add';
  };

  const getDescription = () => {
    if (type === 'state') {
      return 'Create or edit a state for your geographic organization.';
    }
    return 'Create or edit a district within a state.';
  };

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
      title={getTitle()}
      description={getDescription()}
      size="md"
      actions={actions}
    >
      <div className="space-y-4">
        {type === 'district' && (
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              State *
            </Label>
            {item ? (
              // If editing, show state as read-only
              <Input
                id="state"
                value={formData.state}
                disabled
                className="bg-gray-50"
              />
            ) : (
              // If creating, show state dropdown
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={type} className="text-sm font-medium text-gray-700">
            {type === 'state' ? 'State Name *' : 'District Name *'}
          </Label>
          <Input
            id={type}
            name={type}
            type="text"
            placeholder={type === 'state' ? 'Enter state name' : 'Enter district name'}
            value={type === 'state' ? formData.state : formData.district}
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

export default GeographyDialog;