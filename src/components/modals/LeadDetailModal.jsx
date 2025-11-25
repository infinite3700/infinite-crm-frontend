import React from 'react';
import { GlobalModal } from '../ui';
import { Badge } from '../ui/badge';
import {
  Building2,
  User,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Package,
  FileText,
  UserPlus,
  Users,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react';

const LeadDetailModal = ({ isOpen, onClose, lead, onEdit, onDelete }) => {
  if (!lead) return null;

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

  const stageName =
    typeof lead.stage === 'object' && lead.stage ? lead.stage.stage : lead.stage || 'N/A';
  const productName =
    typeof lead.productRequirement === 'object' && lead.productRequirement
      ? lead.productRequirement.name
      : lead.productRequirement || 'N/A';
  const assignedToName =
    typeof lead.assignTo === 'object' && lead.assignTo
      ? lead.assignTo.name || lead.assignTo.username || lead.assignTo.email
      : 'Not assigned';

  const actions = [
    {
      label: 'Close',
      variant: 'outline',
      onClick: onClose,
      flex: true,
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: () => {
        onDelete(lead);
        onClose();
      },
      icon: <Trash2 />,
      flex: true,
    },
    {
      label: 'Edit',
      variant: 'gradient',
      onClick: () => {
        onEdit(lead);
        onClose();
      },
      icon: <Edit />,
      flex: true,
    },
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      headerIcon={<Building2 />}
      size="md"
      actions={actions}
    >
      <div className="space-y-4">
        {/* Company & Stage */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{lead.companyName}</h2>
            <Badge variant={getStageVariant(lead.stage)} className="text-xs">
              {stageName}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Contact Name</p>
                <p className="text-sm font-medium text-gray-900">{lead.contactName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Mobile Number</p>
                <a
                  href={`tel:${lead.contactMobile}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {lead.contactMobile}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Location</h3>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-900">
                {lead.city && `${lead.city}, `}
                {lead.district}
              </p>
              <p className="text-sm text-gray-600">{lead.state}</p>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Lead Details
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {productName && productName !== 'N/A' && (
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Product Requirement</p>
                  <p className="text-sm font-medium text-gray-900">{productName}</p>
                  {typeof lead.productRequirement === 'object' &&
                    lead.productRequirement?.unitPrice && (
                      <p className="text-xs text-gray-500">
                        ₹{lead.productRequirement.unitPrice.toLocaleString()}
                      </p>
                    )}
                </div>
              </div>
            )}

            {lead.currentStatus && (
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Current Status</p>
                  <p className="text-sm font-medium text-gray-900">{lead.currentStatus}</p>
                </div>
              </div>
            )}

            {lead.nextCallDate && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Next Call Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(lead.nextCallDate)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment */}
        {lead.assignTo && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Assignment
            </h3>
            
            <div className="flex items-start space-x-3">
              <UserPlus className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="text-sm font-medium text-gray-900">{assignedToName}</p>
                {typeof lead.assignTo === 'object' && lead.assignTo?.email && (
                  <p className="text-xs text-gray-500">{lead.assignTo.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contributors */}
        {lead.contributor && Array.isArray(lead.contributor) && lead.contributor.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Contributors
            </h3>
            
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Team Members</p>
                <div className="space-y-1">
                  {lead.contributor.map((contributor, index) => {
                    const name =
                      typeof contributor === 'object'
                        ? contributor.name || contributor.username || contributor.email
                        : 'Unknown';
                    return (
                      <div key={index} className="text-sm text-gray-900">
                        • {name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Owner */}
        {lead.leadOwner && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Lead Owner
            </h3>
            
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm font-medium text-gray-900">
                  {typeof lead.leadOwner === 'object'
                    ? lead.leadOwner.name || lead.leadOwner.username || lead.leadOwner.email
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Timeline</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-xs font-medium text-gray-700">{formatDateTime(lead.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Updated</p>
                <p className="text-xs font-medium text-gray-700">{formatDateTime(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default LeadDetailModal;

