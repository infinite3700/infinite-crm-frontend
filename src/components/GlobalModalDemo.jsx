import React, { useState } from 'react';
import { GlobalModal } from '../ui';
import { User, AlertTriangle, Trash2, UserCheck, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

/**
 * Demo component showing different uses of the GlobalModal
 */
const GlobalModalDemo = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setFormModal(false);
    alert('Form submitted successfully!');
  };

  const handleDelete = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setDeleteModal(false);
    alert('Item deleted successfully!');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">GlobalModal Examples</h1>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setBasicModal(true)}>
          Basic Modal
        </Button>
        <Button onClick={() => setFormModal(true)}>
          Form Modal
        </Button>
        <Button onClick={() => setDeleteModal(true)} variant="destructive">
          Delete Modal
        </Button>
        <Button onClick={() => setLargeModal(true)}>
          Large Modal
        </Button>
      </div>

      {/* Basic Modal */}
      <GlobalModal
        isOpen={basicModal}
        onClose={() => setBasicModal(false)}
        title="Basic Modal"
        description="This is a simple modal with basic content"
        size="md"
        actions={[
          { label: 'Cancel', variant: 'outline', onClick: () => setBasicModal(false) },
          { label: 'OK', variant: 'default', onClick: () => setBasicModal(false) }
        ]}
      >
        <p className="text-gray-600">
          This is the content of a basic modal. You can put any content here, 
          including forms, text, images, or other components.
        </p>
      </GlobalModal>

      {/* Form Modal */}
      <GlobalModal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title="Add User"
        description="Create a new user account"
        headerIcon={<User />}
        size="lg"
        actions={[
          { 
            label: 'Cancel', 
            variant: 'outline', 
            onClick: () => setFormModal(false),
            flex: true
          },
          { 
            label: loading ? 'Creating...' : 'Create User', 
            variant: 'default', 
            onClick: handleFormSubmit, 
            disabled: loading || !formData.name || !formData.email,
            loading: loading,
            icon: <UserCheck />,
            flex: true
          }
        ]}
      >
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">
              The user will receive a welcome email with login instructions.
            </p>
          </div>
        </form>
      </GlobalModal>

      {/* Delete Confirmation Modal */}
      <GlobalModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirm Delete"
        headerIcon={<AlertTriangle />}
        headerBg="danger"
        size="md"
        actions={[
          { 
            label: 'Cancel', 
            variant: 'outline', 
            onClick: () => setDeleteModal(false),
            disabled: loading,
            flex: true
          },
          { 
            label: loading ? 'Deleting...' : 'Delete Item', 
            variant: 'destructive', 
            onClick: handleDelete,
            disabled: loading,
            icon: <Trash2 />,
            loading: loading,
            flex: true
          }
        ]}
      >
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>

          <h4 className="text-lg font-semibold mb-2">Delete this item?</h4>
          <p className="text-gray-600 mb-4">
            This action cannot be undone. The item and all associated data will be permanently removed.
          </p>

          {/* Item preview */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="font-medium text-gray-900">Sample Item #12345</p>
            <p className="text-sm text-gray-600">Created on Oct 5, 2025</p>
          </div>
        </div>
      </GlobalModal>

      {/* Large Modal with Scrollable Content */}
      <GlobalModal
        isOpen={largeModal}
        onClose={() => setLargeModal(false)}
        title="Large Modal with Scrollable Content"
        description="This modal demonstrates scrollable content"
        size="2xl"
        actions={[
          { label: 'Close', variant: 'outline', onClick: () => setLargeModal(false) }
        ]}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Section 1</h3>
            <p className="text-gray-600 mb-4">
              This is a large modal that demonstrates how content scrolls when it exceeds the modal height.
              The header and footer remain fixed while the content area becomes scrollable.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700">This is an info box within the scrollable content.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Section 2</h3>
            <p className="text-gray-600 mb-4">
              You can include forms, lists, tables, or any other content. The modal will automatically
              handle the scrolling behavior.
            </p>
            <div className="space-y-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <h4 className="font-medium">Item {i + 1}</h4>
                  <p className="text-sm text-gray-600">
                    This is a sample item to demonstrate scrollable content. 
                    Content flows naturally and the scroll behavior is smooth.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Section 3</h3>
            <p className="text-gray-600">
              The footer with action buttons remains visible and accessible even when 
              scrolling through long content.
            </p>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default GlobalModalDemo;