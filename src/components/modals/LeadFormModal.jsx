import React, { useState, useEffect } from 'react';
import { Users, Loader2, Building2, Phone, MapPin, Tag, Calendar, FileText } from 'lucide-react';
import { GlobalModal } from '../ui';
import { FormField } from '../ui/form-field';
import { settingsService } from '../../api/settingsService';
import { productService } from '../../api/productService';
import { userService } from '../../api/userService';

const LeadFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  lead = null,
  loading = false,
  mode = 'add', // 'add' or 'edit'
}) => {
  const isEditMode = mode === 'edit' || !!lead;

  const [formData, setFormData] = useState({
    companyName: '',
    state: '',
    city: '',
    district: '',
    contactName: '',
    contactMobile: '',
    stage: '',
    productRequirement: '',
    nextCallDate: '',
    currentStatus: '',
    assignTo: '',
    contributor: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Dropdown options
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [leadStages, setLeadStages] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loadingStates, setLoadingStates] = useState({
    states: false,
    districts: false,
    stages: false,
    products: false,
    users: false,
  });

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  // Populate form when lead changes or modal opens (edit mode)
  useEffect(() => {
    if (lead && isOpen && isEditMode) {
      setFormData({
        companyName: lead.companyName || '',
        state: lead.state || '',
        city: lead.city || '',
        district: lead.district || '',
        contactName: lead.contactName || '',
        contactMobile: lead.contactMobile || '',
        stage: typeof lead.stage === 'object' && lead.stage ? lead.stage._id : lead.stage || '',
        productRequirement: typeof lead.productRequirement === 'object' && lead.productRequirement ? lead.productRequirement._id : lead.productRequirement || '',
        nextCallDate: lead.nextCallDate ? lead.nextCallDate.split('T')[0] : '',
        currentStatus: lead.currentStatus || '',
        assignTo: typeof lead.assignTo === 'object' && lead.assignTo ? lead.assignTo._id : lead.assignTo || '',
        contributor: Array.isArray(lead.contributor) 
          ? lead.contributor.map(c => typeof c === 'object' && c ? c._id : c).filter(Boolean)
          : [],
      });
      setErrors({});
      
      // Fetch districts for the selected state
      if (lead.state) {
        fetchDistricts(lead.state);
      }
    } else if (isOpen && !isEditMode) {
      // Reset form for add mode
      resetFormData();
    }
  }, [lead, isOpen, isEditMode]);

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state && isOpen) {
      fetchDistricts(formData.state);
    }
  }, [formData.state, isOpen]);

  const fetchDropdownData = async () => {
    // Fetch states
    try {
      setLoadingStates(prev => ({ ...prev, states: true }));
      const statesData = await settingsService.states.getEnums();
      setStates(Array.isArray(statesData.state) ? statesData.state : []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, states: false }));
    }

    // Fetch lead stages
    try {
      setLoadingStates(prev => ({ ...prev, stages: true }));
      const stagesData = await settingsService.leadStages.getAll();
      setLeadStages(Array.isArray(stagesData) ? stagesData : []);
    } catch (error) {
      console.error('Failed to fetch lead stages:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, stages: false }));
    }

    // Fetch products
    try {
      setLoadingStates(prev => ({ ...prev, products: true }));
      const productsData = await productService.getAllProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, products: false }));
    }

    // Fetch users
    try {
      setLoadingStates(prev => ({ ...prev, users: true }));
      const usersData = await userService.getAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, users: false }));
    }
  };

  const fetchDistricts = async (state) => {
    try {
      setLoadingStates(prev => ({ ...prev, districts: true }));
      const districtsData = await settingsService.states.getDistrictEnums(state);
      setDistricts(Array.isArray(districtsData) ? districtsData : []);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setDistricts([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, districts: false }));
    }
  };

  const resetFormData = () => {
    setFormData({
      companyName: '',
      state: '',
      city: '',
      district: '',
      contactName: '',
      contactMobile: '',
      stage: leadStages.length > 0 ? leadStages[0]._id : '',
      productRequirement: '',
      nextCallDate: '',
      currentStatus: '',
      assignTo: '',
      contributor: [],
    });
  };

  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;
    
    // Special handling for state change - reset district and city
    if (field === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: newValue,
        district: '',
        city: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleContributorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({
      ...prev,
      contributor: selectedOptions,
    }));
    if (errors.contributor) {
      setErrors((prev) => ({
        ...prev,
        contributor: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.contactMobile.trim()) {
      newErrors.contactMobile = 'Contact mobile is required';
    } else if (!/^[+]?[1-9][\d]{9,14}$/.test(formData.contactMobile.replace(/\s+/g, ''))) {
      newErrors.contactMobile = 'Please enter a valid mobile number';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.district) {
      newErrors.district = 'District is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.stage) {
      newErrors.stage = 'Lead stage is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        // Ensure contributor is an array, filter out empty values
        contributor: formData.contributor.filter(c => c),
      };

      await onSubmit(submitData);
      setSubmitSuccess(`Lead ${isEditMode ? 'updated' : 'created'} successfully!`);

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} lead:`, error);
      setSubmitError(
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} lead. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    resetFormData();
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const actions = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: handleClose,
      disabled: isSubmitting || loading,
      flex: true,
    },
    {
      label:
        isSubmitting || loading
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isEditMode
          ? 'Update Lead'
          : 'Create Lead',
      variant: 'gradient',
      onClick: handleSubmit,
      disabled: isSubmitting || loading,
      icon: isSubmitting || loading ? <Loader2 /> : <Users />,
      loading: isSubmitting || loading,
      flex: true,
    },
  ];

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Lead' : 'Add New Lead'}
      headerIcon={<Users />}
      size="lg"
      actions={actions}
    >
      {/* Error Display */}
      {submitError && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{submitError}</p>
        </div>
      )}

      {/* Success Display */}
      {submitSuccess && (
        <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-600">{submitSuccess}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Company & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            id="companyName"
            type="text"
            label="Company Name"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleInputChange('companyName')}
            icon={Building2}
            error={errors.companyName}
            required
            size="default"
          />

          <FormField
            id="contactName"
            type="text"
            label="Contact Name"
            placeholder="Enter contact name"
            value={formData.contactName}
            onChange={handleInputChange('contactName')}
            icon={Users}
            error={errors.contactName}
            required
            size="default"
          />
        </div>

        {/* Contact Mobile */}
        <FormField
          id="contactMobile"
          type="tel"
          label="Contact Mobile"
          placeholder="+919876543210"
          value={formData.contactMobile}
          onChange={handleInputChange('contactMobile')}
          icon={Phone}
          error={errors.contactMobile}
          required
          size="default"
        />

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField
            id="state"
            type="select"
            label="State"
            value={formData.state}
            onChange={handleInputChange('state')}
            icon={MapPin}
            error={errors.state}
            required
            placeholder="Select state"
            options={states.map((state) => ({ value: state, label: state }))}
            disabled={loadingStates.states}
            size="default"
          />

          <FormField
            id="district"
            type="select"
            label="District"
            value={formData.district}
            onChange={handleInputChange('district')}
            error={errors.district}
            required
            placeholder="Select district"
            options={districts.map((dist) => ({ 
              value: dist.district, 
              label: dist.district 
            }))}
            disabled={!formData.state || loadingStates.districts}
            size="default"
          />

          <FormField
            id="city"
            type="text"
            label="City"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleInputChange('city')}
            error={errors.city}
            required
            size="default"
          />
        </div>

        {/* Stage & Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            id="stage"
            type="select"
            label="Lead Stage"
            value={formData.stage}
            onChange={handleInputChange('stage')}
            icon={Tag}
            error={errors.stage}
            required
            placeholder="Select lead stage"
            options={leadStages.map((stage) => ({ 
              value: stage._id, 
              label: stage.stage 
            }))}
            disabled={loadingStates.stages}
            size="default"
          />

          <FormField
            id="productRequirement"
            type="select"
            label="Product Requirement"
            value={formData.productRequirement}
            onChange={handleInputChange('productRequirement')}
            icon={Tag}
            error={errors.productRequirement}
            placeholder="Select product (optional)"
            options={products.map((product) => ({ 
              value: product._id, 
              label: product.name 
            }))}
            disabled={loadingStates.products}
            size="default"
          />
        </div>

        {/* Next Call Date & Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            id="nextCallDate"
            type="date"
            label="Next Call Date"
            value={formData.nextCallDate}
            onChange={handleInputChange('nextCallDate')}
            icon={Calendar}
            error={errors.nextCallDate}
            size="default"
          />

          <FormField
            id="currentStatus"
            type="text"
            label="Current Status"
            placeholder="e.g., Follow up pending"
            value={formData.currentStatus}
            onChange={handleInputChange('currentStatus')}
            icon={FileText}
            error={errors.currentStatus}
            size="default"
          />
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            id="assignTo"
            type="select"
            label="Assign To"
            value={formData.assignTo}
            onChange={handleInputChange('assignTo')}
            icon={Users}
            error={errors.assignTo}
            placeholder="Select user (optional)"
            options={users.map((user) => ({ 
              value: user._id, 
              label: user.fullName || user.name || user.email 
            }))}
            disabled={loadingStates.users}
            size="default"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contributors (Optional)
            </label>
            <select
              id="contributor"
              multiple
              value={formData.contributor}
              onChange={handleContributorChange}
              disabled={loadingStates.users}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              size="4"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName || user.name || user.email}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </form>
    </GlobalModal>
  );
};

export default LeadFormModal;

