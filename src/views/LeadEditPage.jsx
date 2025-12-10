import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Loader2,
  MapPin,
  Megaphone,
  Package,
  Phone,
  Save,
  Tag,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../api/leadService';
import { productService } from '../api/productService';
import { settingsService } from '../api/settingsService';
import { userService } from '../api/userService';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { FormField } from '../components/ui/form-field';
import { MultiSelect } from '../components/ui/multi-select';
import { selectCurrentUser } from '../store/authSlice';

const LeadEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    state: '',
    city: '',
    district: '',
    contactName: '',
    contactMobile: '',
    stage: '',
    productCategory: '',
    productRequirement: '',
    nextCallDate: '',
    currentStatus: '',
    assignTo: '',
    contributor: [],
    campaignId: '',
  });

  const [errors, setErrors] = useState({});

  // Dropdown options
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [leadStages, setLeadStages] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    states: false,
    districts: false,
    stages: false,
    productCategories: false,
    products: false,
    users: false,
    campaigns: false,
  });

  useEffect(() => {
    fetchDropdownData();
    if (isEditMode) {
      loadLead();
    }
  }, [id, isEditMode]);

  // Separate useEffect to handle auto-assignment of current user
  useEffect(() => {
    if (!isEditMode && currentUser) {
      // Try different possible ID fields
      const userId = currentUser._id || currentUser.id;

      if (userId) {
        setFormData((prev) => ({
          ...prev,
          assignTo: userId,
        }));
      }
    }
  }, [currentUser, isEditMode]);
  // dummy

  useEffect(() => {
    if (formData.state) {
      fetchDistricts(formData.state);
    }
  }, [formData.state]);

  // Filter products when product category changes
  useEffect(() => {
    if (formData.productCategory) {
      const filtered = allProducts.filter(
        (product) => product.categoryId === formData.productCategory,
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
  }, [formData.productCategory, allProducts]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id);

      const productReqId =
        typeof response.productRequirement === 'object' && response.productRequirement
          ? response.productRequirement._id
          : response.productRequirement || '';

      // Find the category of the selected product
      let productCategoryId = '';
      if (productReqId) {
        const selectedProduct = allProducts.find((p) => p._id === productReqId);
        if (selectedProduct) {
          productCategoryId = selectedProduct.categoryId;
        }
      }

      setFormData({
        companyName: response.companyName || '',
        state: response.state || '',
        city: response.city || '',
        district: response.district || '',
        contactName: response.contactName || '',
        contactMobile: response.contactMobile || '',
        stage:
          typeof response.stage === 'object' && response.stage
            ? response.stage._id
            : response.stage || '',
        productCategory: productCategoryId,
        productRequirement: productReqId,
        nextCallDate: response.nextCallDate ? response.nextCallDate.split('T')[0] : '',
        currentStatus: response.currentStatus || '',
        assignTo:
          typeof response.assignTo === 'object' && response.assignTo
            ? response.assignTo._id
            : response.assignTo || '',
        contributor: Array.isArray(response.contributor) 
          ? response.contributor.map(c => 
              typeof c === 'object' && c ? c._id : c
            ).filter(id => id)
          : [],
        campaignId:
          typeof response.campaignId === 'object' && response.campaignId
            ? response.campaignId._id
            : response.campaignId || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    // Fetch states
    try {
      setLoadingStates((prev) => ({ ...prev, states: true }));
      const statesData = await settingsService.states.getEnums();
      setStates(Array.isArray(statesData.state) ? statesData.state : []);
    } catch {
      // Error fetching states
    } finally {
      setLoadingStates((prev) => ({ ...prev, states: false }));
    }

    // Fetch lead stages
    try {
      setLoadingStates((prev) => ({ ...prev, stages: true }));
      const stagesData = await settingsService.leadStages.getAll();
      setLeadStages(Array.isArray(stagesData) ? stagesData : []);
    } catch {
      // Error fetching lead stages
    } finally {
      setLoadingStates((prev) => ({ ...prev, stages: false }));
    }

    // Fetch product categories
    try {
      setLoadingStates((prev) => ({ ...prev, productCategories: true }));
      const categoriesData = await productService.getAllCategories();
      setProductCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch {
      // Error fetching product categories
    } finally {
      setLoadingStates((prev) => ({ ...prev, productCategories: false }));
    }

    // Fetch products
    try {
      setLoadingStates((prev) => ({ ...prev, products: true }));
      const productsData = await productService.getAllProducts();
      const productsList = Array.isArray(productsData) ? productsData : [];
      setAllProducts(productsList);
      setProducts(productsList);
    } catch {
      // Error fetching products
    } finally {
      setLoadingStates((prev) => ({ ...prev, products: false }));
    }

    // Fetch users
    try {
      setLoadingStates((prev) => ({ ...prev, users: true }));
      const usersData = await userService.getAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, users: false }));
    }

    // Fetch campaigns
    try {
      setLoadingStates((prev) => ({ ...prev, campaigns: true }));
      const campaignsData = await settingsService.campaigns.getAll();
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
    } catch {
      // Error fetching campaigns
    } finally {
      setLoadingStates((prev) => ({ ...prev, campaigns: false }));
    }
  };

  const fetchDistricts = async (state) => {
    try {
      setLoadingStates((prev) => ({ ...prev, districts: true }));
      const districtsData = await settingsService.states.getDistrictEnums(state);
      setDistricts(Array.isArray(districtsData) ? districtsData : []);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setDistricts([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, districts: false }));
    }
  };

  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;

    if (field === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: newValue,
        district: '',
        city: '',
      }));
    } else if (field === 'productCategory') {
      setFormData((prev) => ({
        ...prev,
        productCategory: newValue,
        productRequirement: null, // Reset product selection when category changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleContributorChange = (selectedValues) => {
    setFormData((prev) => ({
      ...prev,
      contributor: selectedValues,
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

    // Required fields
    if (!formData.contactMobile.trim()) {
      newErrors.contactMobile = 'Contact mobile is required';
    } else if (!/^[+]?[1-9][\d]{9,14}$/.test(formData.contactMobile.replace(/\s+/g, ''))) {
      newErrors.contactMobile = 'Please enter a valid mobile number';
    }

    if (!formData.assignTo) {
      newErrors.assignTo = 'Assign To is required';
    }

    if (!formData.campaignId) {
      newErrors.campaignId = 'Campaign is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      formData.productRequirement = formData.productRequirement || null;
      const submitData = {
        ...formData,
        contributor: formData.contributor.filter((c) => c),
      };

      if (isEditMode) {
        await leadService.updateLead(id, submitData);
        setSuccessMessage('Lead updated successfully!');
        setTimeout(() => {
          navigate(`/leads/${id}`);
        }, 1500);
      } else {
        const response = await leadService.createLead(submitData);
        setSuccessMessage('Lead created successfully!');
        setTimeout(() => {
          navigate(`/leads/${response._id || response.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save lead');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in px-2 sm:px-0 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(isEditMode ? `/leads/${id}` : '/leads')}
          className="h-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          <span className="text-xs">Back</span>
        </Button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Lead' : 'New Lead'}
          </h1>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message comment */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <User className="h-4 w-4 mr-1.5 text-gray-500" />
              Contact
            </h2>
            <div className="space-y-3">
              <FormField
                id="contactName"
                type="text"
                label="Contact Name"
                placeholder="Enter contact name"
                value={formData.contactName}
                onChange={handleInputChange('contactName')}
                icon={User}
                error={errors.contactName}
                size="default"
              />

              <FormField
                id="contactMobile"
                type="tel"
                label="Mobile Number"
                placeholder="+919876543210"
                value={formData.contactMobile}
                onChange={handleInputChange('contactMobile')}
                icon={Phone}
                error={errors.contactMobile}
                required
                size="default"
              />

              <FormField
                id="companyName"
                type="text"
                label="Company Name"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
                icon={Building2}
                error={errors.companyName}
                size="default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
              Location
            </h2>
            <div className="space-y-3">
              <FormField
                id="state"
                type="select"
                label="State"
                value={formData.state}
                onChange={handleInputChange('state')}
                icon={MapPin}
                error={errors.state}
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
                placeholder="Select district"
                options={districts.map((dist) => ({
                  value: dist.district,
                  label: dist.district,
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
                size="default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lead Details */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
              Lead Details
            </h2>
            <div className="space-y-3">
              <FormField
                id="stage"
                type="select"
                label="Lead Stage"
                value={formData.stage}
                onChange={handleInputChange('stage')}
                icon={Tag}
                error={errors.stage}
                placeholder="Select lead stage"
                options={leadStages.map((stage) => ({
                  value: stage._id,
                  label: stage.stage,
                }))}
                disabled={loadingStates.stages}
                size="default"
              />

              <FormField
                id="productCategory"
                type="select"
                label="Product Category"
                value={formData.productCategory}
                onChange={handleInputChange('productCategory')}
                icon={Tag}
                error={errors.productCategory}
                placeholder="Select category (optional)"
                options={productCategories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                disabled={loadingStates.productCategories}
                size="default"
              />

              <FormField
                id="productRequirement"
                type="select"
                label="Product Requirement"
                value={formData.productRequirement}
                onChange={handleInputChange('productRequirement')}
                icon={Package}
                error={errors.productRequirement}
                placeholder={
                  formData.productCategory ? 'Select product (optional)' : 'Select category first'
                }
                options={products.map((product) => ({
                  value: product._id,
                  label: product.name,
                }))}
                disabled={loadingStates.products || !formData.productCategory}
                size="default"
              />

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

              <div className="space-y-2">
                <label htmlFor="currentStatus" className="text-sm font-semibold text-gray-700">
                  Current Status
                </label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <textarea
                    id="currentStatus"
                    rows={3}
                    placeholder="e.g., Follow up pending"
                    value={formData.currentStatus}
                    onChange={handleInputChange('currentStatus')}
                    className={`pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-vertical ${
                      errors.currentStatus ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                </div>
                {errors.currentStatus && (
                  <p className="text-xs text-red-600 mt-1">{errors.currentStatus}</p>
                )}
              </div>

              <FormField
                id="campaignId"
                type="select"
                label="Campaign"
                value={formData.campaignId}
                onChange={handleInputChange('campaignId')}
                icon={Megaphone}
                error={errors.campaignId}
                required
                placeholder="Select campaign"
                options={campaigns.map((campaign) => ({
                  value: campaign._id,
                  label: campaign.campaignName,
                }))}
                disabled={loadingStates.campaigns}
                size="default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-gray-500" />
              Assignment
            </h2>
            <div className="space-y-3">
              <FormField
                id="assignTo"
                type="select"
                label="Assign To"
                value={formData.assignTo}
                onChange={handleInputChange('assignTo')}
                icon={Users}
                error={errors.assignTo}
                required
                placeholder="Select user"
                options={users.map((user) => ({
                  value: user._id,
                  label: user.fullName || user.name || user.email,
                }))}
                disabled={loadingStates.users}
                size="default"
              />

              <MultiSelect
                label="Contributors (Optional)"
                placeholder="Select contributors..."
                icon={Users}
                value={formData.contributor}
                onChange={handleContributorChange}
                options={users.map((user) => ({
                  value: user._id,
                  label: user.fullName || user.name || user.email,
                }))}
                disabled={loadingStates.users}
                error={errors.contributor}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 sticky bottom-0 bg-white pb-4 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isEditMode ? `/leads/${id}` : '/leads')}
            disabled={saving}
            className="flex-1 h-10"
          >
            <span className="text-sm">Cancel</span>
          </Button>
          {saving ? (
            <div className="flex-1 flex justify-center items-center h-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <Button type="submit" className="flex-1 h-10">
              <Save className="h-4 w-4 mr-1.5" />
              <span className="text-sm">{isEditMode ? 'Update' : 'Create'}</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeadEditPage;
