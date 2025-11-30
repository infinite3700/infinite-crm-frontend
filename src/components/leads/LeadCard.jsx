import {
    Building2,
    Calendar,
    Edit,
    Eye,
    MapPin,
    Megaphone,
    Phone,
    Trash2,
    User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PERMISSIONS } from '../../utils/permissions';
import CanAccess from '../CanAccess';
import { Badge } from '../ui/badge';

const LeadCard = ({ lead, onDelete }) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Get status badge variant based on stage
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

  // Get stage color for border
  const getStageColor = (stage) => {
    const variant = getStageVariant(stage);
    switch (variant) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'danger':
        return 'border-l-red-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const stageName =
    typeof lead.stage === 'object' && lead.stage ? lead.stage.stage : lead.stage || 'N/A';

  const campaignName =
    typeof lead.campaignId === 'object' && lead.campaignId ? lead.campaignId.campaignName : null;

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/leads/${lead._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/leads/${lead._id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(lead);
  };

  const nextCallDate = formatDate(lead.nextCallDate);

  return (
    <div
      className={`bg-white rounded-lg border-l-4 ${getStageColor(
        lead.stage,
      )} border-r border-t border-b border-gray-200 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="p-3">
        {/* Header Row - Company, Stage, and Quick View */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div onClick={handleViewDetails} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
                {lead.companyName}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-600 truncate leading-tight">{lead.contactName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge
              variant={getStageVariant(lead.stage)}
              className="text-[10px] px-1.5 py-0 h-5 flex-shrink-0"
            >
              {stageName}
            </Badge>
            <CanAccess permission={PERMISSIONS.LEADS_READ}>
              <button
                onClick={handleViewDetails}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View Details"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            </CanAccess>
          </div>
        </div>

        {/* Contact Row - Phone and Location side by side */}
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <a
              href={`tel:${lead.contactMobile}`}
              onClick={(e) => e.stopPropagation()}
              className="text-gray-700 hover:text-blue-600 truncate font-medium"
            >
              {lead.contactMobile?.slice(-10) || lead.contactMobile}
            </a>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate">{lead.district}</span>
          </div>
        </div>

        {/* Campaign Row - Show if campaign exists */}
        {campaignName && (
          <div className="flex items-center gap-1.5 mb-2 text-xs">
            <Megaphone className="h-3 w-3 text-purple-500 flex-shrink-0" />
            <span className="text-purple-700 truncate font-medium">{campaignName}</span>
          </div>
        )}

        {/* Footer Row - Next Call and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center min-w-0 flex-1">
            {nextCallDate ? (
              <div
                className={`flex items-center text-[11px] font-semibold ${
                  nextCallDate === 'Today'
                    ? 'text-red-600 bg-red-50'
                    : nextCallDate === 'Tomorrow'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 bg-gray-50'
                } px-2 py-0.5 rounded`}
              >
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{nextCallDate}</span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400">No call scheduled</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <CanAccess permission={PERMISSIONS.LEADS_UPDATE}>
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                title="Edit"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            </CanAccess>
            <CanAccess permission={PERMISSIONS.LEADS_DELETE}>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </CanAccess>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
