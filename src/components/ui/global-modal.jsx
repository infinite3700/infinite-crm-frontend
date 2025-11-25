import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

/**
 * GlobalModal - A reusable modal component with common header, scrollable content, and action buttons
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when modal should close
 * @param {string} title - Modal title
 * @param {string} description - Optional modal description
 * @param {ReactNode} children - Modal content
 * @param {Array} actions - Array of action button configurations
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} closeOnBackdrop - Whether clicking backdrop closes modal (default: true)
 * @param {boolean} showCloseButton - Whether to show X close button (default: true)
 * @param {string} headerClassName - Additional CSS classes for header
 * @param {string} contentClassName - Additional CSS classes for content
 * @param {string} footerClassName - Additional CSS classes for footer
 * @param {ReactNode} headerIcon - Icon to display in header
 * @param {string} headerBg - Header background style: 'default', 'success', 'warning', 'danger'
 */
const GlobalModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions = [],
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  headerIcon,
  headerBg = 'default'
}) => {
  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };

  // Header background configurations
  const headerBgClasses = {
    default: 'bg-gradient-to-r from-blue-50 to-purple-50 border-b',
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-b',
    warning: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-b',
    danger: 'bg-gradient-to-r from-red-50 to-orange-50 border-b'
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 sm:pb-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizeClasses[size]} shadow-2xl border-0 overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-lg`}>
        
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`${headerBgClasses[headerBg]} px-4 pt-4 pb-3 flex-shrink-0 ${headerClassName}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {headerIcon && (
                  <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2 shadow-lg">
                    {React.cloneElement(headerIcon, { className: "h-5 w-5 text-white" })}
                  </div>
                )}
                {title && (
                  <h3 className="modal-title text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="modal-description mt-1 text-sm text-gray-600">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseClick}
                  className="hover:bg-gray-100 rounded-full h-8 w-8 ml-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Content - Scrollable */}
        <div className={`p-4 overflow-y-auto flex-1 scrollbar-hide ${contentClassName}`}>
          {children}
        </div>

        {/* Footer - Action Buttons */}
        {actions.length > 0 && (
          <div className={`p-4 border-t bg-gray-50/80 flex-shrink-0 ${footerClassName}`}>
            <div className="flex gap-3 justify-end">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type || 'button'}
                  variant={action.variant || 'default'}
                  size={action.size || 'default'}
                  onClick={action.onClick}
                  disabled={action.disabled || false}
                  className={`${action.flex ? 'flex-1' : ''} ${action.className || ''}`}
                >
                  {action.icon && React.cloneElement(action.icon, { 
                    className: `${action.loading ? 'animate-spin' : ''} mr-2 h-4 w-4` 
                  })}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalModal;

/**
 * Usage Examples:
 * 
 * // Basic modal
 * <GlobalModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Basic Modal"
 *   description="This is a basic modal"
 *   actions={[
 *     { label: 'Cancel', variant: 'outline', onClick: onClose },
 *     { label: 'Save', variant: 'default', onClick: onSave }
 *   ]}
 * >
 *   <p>Modal content goes here</p>
 * </GlobalModal>
 * 
 * // Form modal with loading state
 * <GlobalModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Add User"
 *   description="Create a new user account"
 *   headerIcon={<User />}
 *   size="lg"
 *   actions={[
 *     { label: 'Cancel', variant: 'outline', onClick: onClose, flex: true },
 *     { 
 *       label: isLoading ? 'Creating...' : 'Create User', 
 *       variant: 'default', 
 *       onClick: onSubmit, 
 *       disabled: isLoading,
 *       loading: isLoading,
 *       icon: <UserCheck />,
 *       flex: true
 *     }
 *   ]}
 * >
 *   <form>...</form>
 * </GlobalModal>
 * 
 * // Delete confirmation modal
 * <GlobalModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Confirm Delete"
 *   headerBg="danger"
 *   headerIcon={<AlertTriangle />}
 *   actions={[
 *     { label: 'Cancel', variant: 'outline', onClick: onClose, flex: true },
 *     { 
 *       label: 'Delete', 
 *       variant: 'destructive', 
 *       onClick: onDelete,
 *       icon: <Trash2 />,
 *       flex: true
 *     }
 *   ]}
 * >
 *   <div className="text-center">
 *     <p>Are you sure you want to delete this item?</p>
 *   </div>
 * </GlobalModal>
 */