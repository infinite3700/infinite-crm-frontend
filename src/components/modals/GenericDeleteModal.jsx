import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { GlobalModal } from '../ui';

const GenericDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  itemType = "item",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const actions = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: onClose,
      disabled: isLoading,
      flex: true
    },
    {
      label: isLoading ? 'Deleting...' : 'Delete',
      variant: 'destructive',
      onClick: handleConfirm,
      disabled: isLoading,
      icon: <Trash2 />,
      loading: isLoading,
      flex: true,
      className: 'bg-red-600 hover:bg-red-700 text-white'
    }
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerIcon={<AlertTriangle />}
      headerBg="danger"
      size="md"
      actions={actions}
    >
      {/* Warning Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>

      {/* Message */}
      <div className="text-center mb-6">
        <h4 className="modal-title mb-2">
          Delete {itemType}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {message}
        </p>

        {/* Item Info */}
        {itemName && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="font-medium text-gray-900 text-center">
              {itemName}
            </p>
          </div>
        )}
      </div>
    </GlobalModal>
  );
};

export default GenericDeleteModal;