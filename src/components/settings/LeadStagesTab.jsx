import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { GitBranch, Plus, Search, Edit, Trash2 } from 'lucide-react';
import GenericDeleteModal from '../modals/GenericDeleteModal';
import SimpleSettingsDialog from '../modals/SimpleSettingsDialog';
import { settingsService } from '../../api/settingsService';

const LeadStagesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lead stages management
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    editingItem: null,
    isSubmitting: false
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  // Load lead stages on component mount
  useEffect(() => {
    loadLeadStages();
  }, []);

  const loadLeadStages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsService.leadStages.getAll();
      setStages(response || []);
    } catch (err) {
      setError(err.message || 'Failed to load lead stages');
      console.error('Error loading lead stages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredStages = stages.filter(stage =>
    stage.stage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dialog handlers
  const handleOpenDialog = (item = null) => {
    setDialogState({
      isOpen: true,
      editingItem: item,
      isSubmitting: false
    });
  };

  const handleCloseDialog = () => {
    setDialogState({
      isOpen: false,
      editingItem: null,
      isSubmitting: false
    });
  };

  const handleSaveStage = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));

      if (dialogState.editingItem) {
        // Update existing stage
        await settingsService.leadStages.update(dialogState.editingItem._id, {
          stage: formData.stage,
          status: formData.status
        });
      } else {
        // Create new stage
        await settingsService.leadStages.create({
          stage: formData.stage,
          status: formData.status
        });
      }

      await loadLeadStages();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save lead stage');
      console.error('Error saving lead stage:', err);
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteStage = (stage) => {
    setDeleteModal({
      isOpen: true,
      item: stage,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await settingsService.leadStages.delete(deleteModal.item._id);
      await loadLeadStages();
      setDeleteModal({ isOpen: false, item: null, isLoading: false });
    } catch (err) {
      setError(err.message || 'Failed to delete lead stage');
      console.error('Error deleting lead stage:', err);
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg body-text">
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
            />
          </div>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="section-title">
                Stages Management
              </h4>
              <button
                onClick={() => handleOpenDialog()}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm h-10"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Stages Table */}
            <div className="table-container">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="table-head-responsive text-left table-header">
                        Stage Label
                      </th>
                      <th className="table-head-responsive text-left table-header">
                        Status
                      </th>
                      <th className="table-head-responsive text-right table-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStages.map((stage) => (
                      <tr key={stage._id} className="hover:bg-gray-50">
                        <td className="table-cell-responsive whitespace-nowrap">
                          <div className="table-cell">{stage.stage}</div>
                        </td>
                        <td className="table-cell-responsive whitespace-nowrap">
                          <Badge variant={stage.status ? 'success' : 'secondary'}>
                            {stage.status ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="table-cell-responsive whitespace-nowrap">
                          <div className="table-actions">
                            <button
                              onClick={() => handleOpenDialog(stage)}
                              className="action-btn action-btn-primary"
                              title="Edit Stage"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStage(stage)}
                              className="action-btn action-btn-danger"
                              title="Delete Stage"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStages.length === 0 && (
                <div className="text-center py-8">
                  <GitBranch className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No lead stages found</p>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <GenericDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, item: null, isLoading: false })}
            onConfirm={confirmDelete}
            title="Delete Lead Stage"
            message="Are you sure you want to delete this lead stage? This action cannot be undone."
            itemName={deleteModal.item?.stage}
            itemType="stage"
            isLoading={deleteModal.isLoading}
          />

          {/* Settings Dialog */}
          <SimpleSettingsDialog
            isOpen={dialogState.isOpen}
            onClose={handleCloseDialog}
            onSave={handleSaveStage}
            item={dialogState.editingItem}
            title="Lead Stage"
            description="Create or edit a lead stage for your CRM system."
            fieldLabel="Stage Name"
            fieldName="stage"
            placeholder="Enter stage name (e.g., Lead, Qualified, Proposal)"
            isLoading={dialogState.isSubmitting}
          />
        </>
      )}
    </div>
  );
};

export default LeadStagesTab;