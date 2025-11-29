import {
  Calendar,
  Edit,
  Eye,
  Megaphone,
  Package,
  Phone,
  Plus,
  Search,
  Trash2,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { leadService } from '../api/leadService';
import CanAccess from '../components/CanAccess';
import LeadCard from '../components/leads/LeadCard';
import GenericDeleteModal from '../components/modals/GenericDeleteModal';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { PERMISSIONS } from '../utils/permissions';

const Leads = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check if we're in follow-up mode
  const isFollowUpMode = location.pathname === '/leads/follow-up';

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    lead: null,
    isLoading: false,
  });

  // Load leads on component mount and when mode changes
  useEffect(() => {
    loadLeads();
  }, [isFollowUpMode]);
  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use different API based on mode
      const response = isFollowUpMode
        ? await leadService.getFollowUpLeads()
        : await leadService.getAllLeads();
      setLeads(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.companyName?.toLowerCase().includes(searchLower) ||
      lead.contactName?.toLowerCase().includes(searchLower) ||
      lead.contactMobile?.includes(searchTerm) ||
      lead.state?.toLowerCase().includes(searchLower) ||
      lead.district?.toLowerCase().includes(searchLower) ||
      lead.city?.toLowerCase().includes(searchLower) ||
      (typeof lead.stage === 'object' && lead.stage?.stage?.toLowerCase().includes(searchLower)) ||
      (typeof lead.campaignId === 'object' &&
        lead.campaignId?.campaignName?.toLowerCase().includes(searchLower))
    );
  });

  // Pagination calculations
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Delete modal handlers
  const handleOpenDeleteModal = (lead) => {
    setDeleteModal({
      isOpen: true,
      lead,
      isLoading: false,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      lead: null,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));
      await leadService.deleteLead(deleteModal.lead._id);
      await loadLeads();
      handleCloseDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
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
  const getStageVariant = (stage) => {
    if (!stage) return 'default';
    const stageName =
      typeof stage === 'object' && stage ? stage.stage?.toLowerCase() : (stage || '').toLowerCase();

    if (!stageName) return 'default';

    if (stageName.includes('new') || stageName.includes('fresh')) return 'default';
    if (stageName.includes('contacted') || stageName.includes('follow')) return 'warning';
    if (stageName.includes('qualified') || stageName.includes('hot')) return 'success';
    if (stageName.includes('proposal') || stageName.includes('negotiation')) return 'info';
    if (stageName.includes('won') || stageName.includes('closed')) return 'success';
    if (stageName.includes('lost') || stageName.includes('rejected')) return 'danger';

    return 'default';
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="page-title">{isFollowUpMode ? 'Follow Up Leads' : 'Leads Management'}</h1>
          <p className="page-subtitle">
            {isFollowUpMode
              ? 'Leads requiring follow-up actions'
              : 'Manage your sales leads and track their progress'}
          </p>
        </div>
        <CanAccess permission={PERMISSIONS.LEADS_CREATE}>
          <Button onClick={() => navigate('/leads/new')} className="h-9 sm:h-10">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="button-text">Add Lead</span>
          </Button>
        </CanAccess>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by company, contact, phone, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
        />
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="block lg:hidden space-y-3">
        {currentLeads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} onDelete={handleOpenDeleteModal} />
        ))}

        {filteredLeads.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'No leads found matching your search.'
                    : 'No leads yet. Add your first lead to get started.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate('/leads/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View (visible on large screens) */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* <th className="px-6 py-3 text-left table-header">Company</th> */}
                    <th className="px-6 py-3 text-left table-header">Contact Info</th>
                    {/* <th className="px-6 py-3 text-left table-header">Location</th> */}
                    <th className="px-6 py-3 text-left table-header">Stage</th>
                    <th className="px-6 py-3 text-left table-header">Product</th>
                    <th className="px-6 py-3 text-left table-header">Campaign</th>
                    <th className="px-6 py-3 text-left table-header">Next Call</th>
                    <th className="px-6 py-3 text-left table-header">Assigned To</th>
                    <th className="px-6 py-3 text-right table-header w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLeads.map((lead) => {
                    const stageName =
                      typeof lead.stage === 'object' && lead.stage
                        ? lead.stage.stage
                        : lead.stage || 'N/A';
                    const productName =
                      typeof lead.productRequirement === 'object' && lead.productRequirement
                        ? lead.productRequirement.name
                        : lead.productRequirement || 'N/A';
                    const campaignName =
                      typeof lead.campaignId === 'object' && lead.campaignId
                        ? lead.campaignId.campaignName
                        : lead.campaignId || 'N/A';
                    const assignedToName =
                      typeof lead.assignTo === 'object' && lead.assignTo
                        ? lead.assignTo.name || lead.assignTo.username || lead.assignTo.email
                        : 'Not assigned';

                    return (
                      <tr
                        key={lead._id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        {/* <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <div>
                              <div className="table-cell font-medium">{lead.companyName}</div>
                            </div>
                          </div>
                        </td> */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="table-cell">{lead.contactName}</div>
                            <div className="flex items-center table-cell-secondary">
                              <Phone className="h-3 w-3 mr-1" />
                              <a href={`tel:${lead.contactMobile}`} className="hover:text-blue-600">
                                {formatPhone(lead.contactMobile)}
                              </a>
                            </div>
                          </div>
                        </td>
                        {/* <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <div>
                              <div>
                                {lead.city ? `${lead.city}, ` : ''}
                                {lead.district}
                              </div>
                              <div className="text-xs text-gray-500">{lead.state}</div>
                            </div>
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStageVariant(lead.stage)} className="text-xs">
                            {stageName}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <Package className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-[150px]">{productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <Megaphone className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-[150px]">{campaignName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.nextCallDate && (
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {formatDate(lead.nextCallDate)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {lead.assignTo ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900 truncate max-w-[120px]">
                                  {assignedToName}
                                </div>
                                {typeof lead.assignTo === 'object' && lead.assignTo.email && (
                                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                    {lead.assignTo.email}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="table-actions justify-end">
                            <CanAccess permission={PERMISSIONS.LEADS_READ}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/leads/${lead._id}`);
                                }}
                                className="action-btn action-btn-info"
                                title="View details"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </CanAccess>
                            <CanAccess permission={PERMISSIONS.LEADS_UPDATE}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/leads/${lead._id}/edit`);
                                }}
                                className="action-btn action-btn-primary"
                                title="Edit lead"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </CanAccess>
                            <CanAccess permission={PERMISSIONS.LEADS_DELETE}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDeleteModal(lead);
                                }}
                                className="action-btn action-btn-danger"
                                title="Delete lead"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </CanAccess>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'No leads found matching your search.'
                    : 'No leads yet. Add your first lead to get started.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate('/leads/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 2) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex">
                        {showEllipsis && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => goToPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        itemName={deleteModal.lead?.companyName || deleteModal.lead?.contactName}
        itemType="lead"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default Leads;
