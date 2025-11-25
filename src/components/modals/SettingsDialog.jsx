import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const SettingsDialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false,
  saveDisabled = false,
  maxWidth = 'max-w-md'
}) => {
  const handleSave = (e) => {
    e.preventDefault();
    if (onSave && !isLoading && !saveDisabled) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (onCancel && !isLoading) {
      onCancel();
    } else if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} w-[95vw] sm:w-full`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-gray-600 mt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4 py-4">
          {children}
          
          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || saveDisabled}
              className="w-full sm:w-auto"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;