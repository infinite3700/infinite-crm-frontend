import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit,
  FileText,
  MapPin,
  Megaphone,
  Package,
  Phone,
  Trash2,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../api/leadService';
import CanAccess from '../components/CanAccess';
import GenericDeleteModal from '../components/modals/GenericDeleteModal';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { PERMISSIONS } from '../utils/permissions';

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false,
  });

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadService.getLeadById(id);
      setLead(response);
    } catch (err) {
      setError(err.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/leads/${id}/edit`);
  };

  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));
      await leadService.deleteLead(id);
      navigate('/leads');
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
      console.error('Error deleting lead:', err);
    } finally {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-4 animate-fade-in px-2 sm:px-0">
        <Button variant="outline" onClick={() => navigate('/leads')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Lead not found'}</p>
              <Button onClick={() => navigate('/leads')}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stageName =
    typeof lead.stage === 'object' && lead.stage ? lead.stage.stage : lead.stage || 'N/A';
  const productName =
    typeof lead.productRequirement === 'object' && lead.productRequirement
      ? lead.productRequirement.name
      : lead.productRequirement || 'N/A';
  const campaignName =
    typeof lead.campaignId === 'object' && lead.campaignId
      ? lead.campaignId.campaignName
      : lead.campaignId || null;
  const assignedToName =
    typeof lead.assignTo === 'object' && lead.assignTo
      ? lead.assignTo.name || lead.assignTo.username || lead.assignTo.email
      : 'Not assigned';

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in px-2 sm:px-0 max-w-4xl mx-auto pb-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/leads')} className="h-8">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Back</span>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Lead Details</h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <CanAccess permission={PERMISSIONS.LEADS_DELETE}>
            <Button
              variant="outline"
              onClick={handleDelete}
              size="sm"
              className="text-red-600 hover:bg-red-50 h-8 px-3"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Delete</span>
            </Button>
          </CanAccess>
          <CanAccess permission={PERMISSIONS.LEADS_UPDATE}>
            <Button onClick={handleEdit} size="sm" className="h-8 px-3">
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Edit</span>
            </Button>
          </CanAccess>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Company & Stage Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-1.5 leading-tight">
                {lead.companyName}
              </h2>
              <Badge variant={getStageVariant(lead.stage)} className="text-xs">
                {stageName}
              </Badge>
            </div>
          </div>

          {lead.currentStatus && (
            <div className="mt-3 p-2.5 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Current Status</p>
              <textarea
                value={lead.currentStatus}
                readOnly
                className="w-full text-sm bg-white border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact & Location Combined */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <User className="h-4 w-4 mr-1.5 text-gray-500" />
            Contact & Location
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Contact Name</p>
                <p className="text-sm font-medium text-gray-900">{lead.contactName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Mobile Number</p>
                <a
                  href={`tel:${lead.contactMobile}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {lead.contactMobile}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {lead.city && `${lead.city}, `}
                  {lead.district}, {lead.state}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details */}
      {(productName !== 'N/A' || lead.nextCallDate || campaignName) && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
              Lead Details
            </h3>
            <div className="space-y-3">
              {productName && productName !== 'N/A' && (
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Product Requirement</p>
                    <p className="text-sm font-medium text-gray-900">{productName}</p>
                    {typeof lead.productRequirement === 'object' &&
                      lead.productRequirement?.unitPrice && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          ₹{lead.productRequirement.unitPrice.toLocaleString()}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {campaignName && (
                <div className="flex items-start gap-2">
                  <Megaphone className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Campaign</p>
                    <p className="text-sm font-medium text-gray-900">{campaignName}</p>
                    {typeof lead.campaignId === 'object' &&
                      lead.campaignId?.campaignDescription && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {lead.campaignId.campaignDescription}
                        </p>
                      )}
                    {typeof lead.campaignId === 'object' && lead.campaignId?.status && (
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {lead.campaignId.status}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {lead.nextCallDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Next Call Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(lead.nextCallDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment & Team */}
      {(lead.assignTo || (lead.contributor && lead.contributor.length > 0) || lead.leadOwner) && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-gray-500" />
              Team
            </h3>
            <div className="space-y-3">
              {lead.assignTo && (
                <div className="flex items-start gap-2">
                  <UserPlus className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Assigned To</p>
                    <p className="text-sm font-medium text-gray-900">{assignedToName}</p>
                    {typeof lead.assignTo === 'object' && lead.assignTo?.email && (
                      <p className="text-xs text-gray-600">{lead.assignTo.email}</p>
                    )}
                  </div>
                </div>
              )}

              {lead.contributor &&
                Array.isArray(lead.contributor) &&
                lead.contributor.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Contributors</p>
                      <div className="space-y-1">
                        {lead.contributor.map((contributor, index) => {
                          const name =
                            typeof contributor === 'object'
                              ? contributor.name || contributor.username || contributor.email
                              : 'Unknown';
                          return (
                            <p key={index} className="text-sm text-gray-900">
                              • {name}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              {lead.leadOwner && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Lead Owner</p>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof lead.leadOwner === 'object'
                        ? lead.leadOwner.name || lead.leadOwner.username || lead.leadOwner.email
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
            Timeline
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-xs font-medium text-gray-900">
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Updated</p>
                <p className="text-xs font-medium text-gray-900">
                  {formatDateTime(lead.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        itemName={lead?.companyName || lead?.contactName}
        itemType="lead"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default LeadDetailPage;
