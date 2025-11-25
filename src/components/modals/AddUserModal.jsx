import React from 'react';
import UserFormModal from './UserFormModal';

const AddUserModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  return (
    <UserFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={loading}
      mode="add"
    />
  );
};

export default AddUserModal;