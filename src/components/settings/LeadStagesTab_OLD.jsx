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
      setDeleteModal({ isOpen: false, item: null, isLoading: false });
      await loadLeadStages(); // Reload data
    } catch (err) {
      setError(err.message || 'Failed to delete lead stage');
      console.error('Error deleting lead stage:', err);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Lead Stages Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage lead stages for your sales pipeline
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading lead stages...</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search stages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Stages Management
              </h4>
              <button
                onClick={() => handleOpenDialog()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Stages Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStages.map((stage) => (
                    <tr key={stage._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStage === stage._id ? (
                          <input
                            type="text"
                            value={stageForm.stage}
                            onChange={(e) => setStageForm({ ...stageForm, stage: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isSubmitting}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{stage.stage}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStage === stage._id ? (
                          <input
                            type="checkbox"
                            checked={stageForm.status}
                            onChange={(e) => setStageForm({ ...stageForm, status: e.target.checked })}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            disabled={isSubmitting}
                          />
                        ) : (
                          <Badge variant={stage.status ? 'success' : 'secondary'}>
                            {stage.status ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          {editingStage === stage._id ? (
                            <>
                              <button
                                onClick={handleUpdateStage}
                                disabled={isSubmitting}
                                className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStage(null);
                                  setStageForm({ stage: '', status: true });
                                }}
                                disabled={isSubmitting}
                                className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStage(stage)}
                                disabled={isSubmitting}
                                className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStage(stage)}
                                disabled={isSubmitting}
                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
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