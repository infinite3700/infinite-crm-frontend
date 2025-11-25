import React from 'react';
import UserFormModal from './UserFormModal';

const EditUserModal = ({ isOpen, onClose, onSubmit, user, isLoading = false }) => {
  return (
    <UserFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      user={user}
      loading={isLoading}
      mode="edit"
    />
  );
};

export default EditUserModal;