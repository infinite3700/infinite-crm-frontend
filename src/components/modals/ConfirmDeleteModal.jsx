import React from 'react';
import { AlertTriangle, Trash2, User } from 'lucide-react';
import { GlobalModal } from '../ui';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, user, isLoading = false }) => {
  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirm(user._id);
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
      label: isLoading ? 'Deleting...' : 'Delete User',
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
      title="Confirm Delete"
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
          Delete User Account
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        {/* User Info Card */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">
                {user.fullName || user.name}
              </p>
              <p className="text-sm text-gray-600">
                {user.email}
              </p>
              {(user.role?.name || user.role) && (
                <p className="text-xs text-gray-500 capitalize">
                  Role: {user.role?.name || user.role}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default ConfirmDeleteModal;