import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Megaphone, Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import GenericDeleteModal from '../components/modals/GenericDeleteModal';
import CampaignFormModal from '../components/modals/CampaignFormModal';
import CanAccess from '../components/CanAccess';
import { PERMISSIONS } from '../utils/permissions';
import { settingsService } from '../api/settingsService';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form modal state
  const [formModal, setFormModal] = useState({
    isOpen: false,
    campaign: null,
    mode: 'add', // 'add' or 'edit'
    isSubmitting: false,
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    campaign: null,
    isLoading: false,
  });

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsService.campaigns.getAll();
      setCampaigns(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message || 'Failed to load campaigns');
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaignDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Form modal handlers
  const handleOpenFormModal = (campaign = null) => {
    setFormModal({
      isOpen: true,
      campaign,
      mode: campaign ? 'edit' : 'add',
      isSubmitting: false,
    });
  };

  const handleCloseFormModal = () => {
    setFormModal({
      isOpen: false,
      campaign: null,
      mode: 'add',
      isSubmitting: false,
    });
  };

  const handleSubmitCampaign = async (formData) => {
    try {
      setFormModal((prev) => ({ ...prev, isSubmitting: true }));

      if (formModal.mode === 'edit' && formModal.campaign) {
        // Update existing campaign
        await settingsService.campaigns.update(formModal.campaign._id, formData);
      } else {
        // Create new campaign
        await settingsService.campaigns.create(formData);
      }

      await loadCampaigns();
      handleCloseFormModal();
    } catch (err) {
      setError(err.message || 'Failed to save campaign');
      console.error('Error saving campaign:', err);
      throw err; // Re-throw to let modal handle it
    } finally {
      setFormModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Delete modal handlers
  const handleOpenDeleteModal = (campaign) => {
    setDeleteModal({
      isOpen: true,
      campaign,
      isLoading: false,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      campaign: null,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));
      await settingsService.campaigns.delete(deleteModal.campaign._id);
      await loadCampaigns();
      handleCloseDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete campaign');
      console.error('Error deleting campaign:', err);
    } finally {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'scheduled':
        return 'warning';
      case 'inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Manage your marketing campaigns</p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="page-title">Campaigns</h1>
        <p className="page-subtitle">Manage your marketing campaigns</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-text"
        />
      </div>

      {/* Campaigns Card */}
      <Card className="card-enhanced shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="card-title">Campaigns Management</span>
              </CardTitle>
            </div>
            <CanAccess permission={PERMISSIONS.CAMPAIGNS_CREATE}>
              <Button onClick={() => handleOpenFormModal()} className="h-9 sm:h-10">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="button-text">Add Campaign</span>
              </Button>
            </CanAccess>
          </div>
        </CardHeader>
        <CardContent className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-head-responsive text-left table-header">Campaign Name</th>
                  <th className="table-head-responsive text-left table-header">Description</th>
                  <th className="table-head-responsive text-left table-header">Duration</th>
                  <th className="table-head-responsive text-left table-header">Status</th>
                  <th className="table-head-responsive text-right table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="table-cell-responsive">
                      <div className="flex items-center space-x-2">
                        <Megaphone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="table-cell font-medium">{campaign.campaignName}</span>
                      </div>
                    </td>
                    <td className="table-cell-responsive">
                      <div
                        className="table-cell-secondary max-w-xs truncate"
                        title={campaign.campaignDescription}
                      >
                        {campaign.campaignDescription}
                      </div>
                    </td>
                    <td className="table-cell-responsive">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span className="whitespace-nowrap">
                          {formatDate(campaign.campaignStartDate)} -{' '}
                          {formatDate(campaign.campaignEndDate)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell-responsive">
                      <Badge
                        variant={getStatusVariant(campaign.status)}
                        className="responsive-badge"
                      >
                        {campaign.status || 'N/A'}
                      </Badge>
                    </td>
                    <td className="table-cell-responsive text-right">
                      <div className="table-actions justify-end">
                        <CanAccess permission={PERMISSIONS.CAMPAIGNS_UPDATE}>
                          <button
                            onClick={() => handleOpenFormModal(campaign)}
                            className="action-btn action-btn-primary"
                            title="Edit Campaign"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </CanAccess>
                        <CanAccess permission={PERMISSIONS.CAMPAIGNS_DELETE}>
                          <button
                            onClick={() => handleOpenDeleteModal(campaign)}
                            className="action-btn action-btn-danger"
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </CanAccess>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="body-text text-gray-500">
                {searchTerm ? 'No campaigns found matching your search' : 'No campaigns yet'}
              </p>
              {!searchTerm && (
                <Button onClick={() => handleOpenFormModal()} variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Form Modal */}
      <CampaignFormModal
        isOpen={formModal.isOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitCampaign}
        campaign={formModal.campaign}
        mode={formModal.mode}
        loading={formModal.isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
        itemName={deleteModal.campaign?.campaignName}
        itemType="campaign"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default Campaigns;
