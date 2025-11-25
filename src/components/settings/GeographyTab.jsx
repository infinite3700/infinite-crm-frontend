import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Plus, Search, Edit, Trash2, Globe, Building2, X } from 'lucide-react';
import GenericDeleteModal from '../modals/GenericDeleteModal';
import GeographyDialog from '../modals/GeographyDialog';
import { settingsService } from '../../api/settingsService';

const GeographyTab = () => {
  const [activeSection, setActiveSection] = useState('states'); // 'states' or 'districts'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('all'); // State filter for districts
  
  // States and districts management
  const [states, setStates] = useState([]);
  const [filteredDistrictsFromAPI, setFilteredDistrictsFromAPI] = useState([]); // Districts from API based on state filter
  const [stateEnums, setStateEnums] = useState([]); // Available states for filtering
  const [stateEnumsLoading, setStateEnumsLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false); // Loading state for districts API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'state', // 'state' or 'district'
    editingItem: null,
    isSubmitting: false
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', // 'state' or 'district'
    item: null,
    isLoading: false
  });

  // Load data on component mount
  useEffect(() => {
    loadStatesAndDistricts();
  }, []);

  // Debug state enums - Add a test to see current state
  useEffect(() => {
    console.log('🔍 Current stateEnums value:', stateEnums);
    console.log('🔍 stateEnumsLoading:', stateEnumsLoading);
  }, [stateEnums, stateEnumsLoading]);

  // Fetch districts when state filter changes
  useEffect(() => {
    if (activeSection === 'districts') {
      fetchDistrictsByState(selectedStateFilter);
    }
  }, [selectedStateFilter, activeSection]);

  // Function to fetch districts based on selected state
  const fetchDistrictsByState = async (state) => {
    try {
      setDistrictsLoading(true);
      console.log('🔄 Fetching districts for state:', state);
      
      const districtsResponse = await settingsService.states.getDistrictEnums(state);
      console.log('✅ Districts response received:', districtsResponse);
      
      // Set the filtered districts from API
      setFilteredDistrictsFromAPI(Array.isArray(districtsResponse) ? districtsResponse : []);
    } catch (error) {
      console.error('❌ Failed to fetch districts for state:', state, error);
      setError(`Failed to load districts for ${state === 'all' ? 'all states' : state}`);
    } finally {
      setDistrictsLoading(false);
    }
  };

  const loadStatesAndDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load states - new API returns array of objects with status and state
      const statesResponse = await settingsService.states.getAll();
      console.log('✅ States response received:', statesResponse);
      console.log('🔍 First state object structure:', statesResponse[0]);
      console.log('🔍 Does first state have _id?', statesResponse[0]?._id);
      setStates(Array.isArray(statesResponse) ? statesResponse : []);
      
      // Load state enums for filtering
      try {
        setStateEnumsLoading(true);
        console.log('🔄 Starting to fetch state enums...');
        const stateEnumsResponse = await settingsService.states.getEnums();
        console.log('✅ State enums response received:', stateEnumsResponse);
        
        // The getEnums now returns { state: [array of state names] }
        const processedEnums = Array.isArray(stateEnumsResponse.state) ? stateEnumsResponse.state : [];
        console.log('🔧 Processed state enums:', processedEnums);
        
        setStateEnums(processedEnums);
      } catch (enumError) {
        console.error('❌ Failed to fetch state enums:', enumError);
        // Fallback to unique states from current data
        const uniqueStates = [...new Set((statesResponse || []).map(s => s.state))].filter(Boolean);
        console.log('🔄 Fallback to unique states:', uniqueStates);
        setStateEnums(uniqueStates);
      } finally {
        setStateEnumsLoading(false);
        console.log('✅ State enums loading completed');
      }
    } catch (err) {
      setError(err.message || 'Failed to load geographic data');
      console.error('Error loading states and districts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters when switching sections
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSearchTerm('');
    setSelectedStateFilter('all');
    
    // If switching to districts, load all districts
    if (section === 'districts') {
      fetchDistrictsByState('all');
    }
  };

  // Handle state filter change
  const handleStateFilterChange = (state) => {
    setSelectedStateFilter(state);
    setSearchTerm(''); // Clear search when changing state filter
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStateFilter('all');
  };

  // Get unique state names for district creation
  const getUniqueStates = () => {
    const uniqueStates = [...new Set(states.map(s => s.state))];
    return uniqueStates.sort();
  };

  // Filtered data
  const filteredStates = states.filter(state =>
    state.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use API-filtered districts and apply search filter
  const filteredDistricts = filteredDistrictsFromAPI.filter(district => {
    const matchesSearch = district.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Dialog handlers
  const handleOpenDialog = (type, item = null) => {
    setDialogState({
      isOpen: true,
      type,
      editingItem: item,
      isSubmitting: false
    });
  };

  const handleCloseDialog = () => {
    setDialogState({
      isOpen: false,
      type: 'state',
      editingItem: null,
      isSubmitting: false
    });
  };

  const handleSaveGeography = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));

      if (dialogState.type === 'state') {
        if (dialogState.editingItem) {
          // Update existing state using query parameter approach
          console.log('🔍 Editing state item:', dialogState.editingItem);
          
          const updateData = {
            state: formData.state,
            status: formData.status,
            originalState: dialogState.editingItem.state // Pass original state name for query param
          };
          
          await settingsService.states.updateState(updateData);
        } else {
          // Create new state
          await settingsService.states.create({
            state: formData.state,
            status: formData.status
          });
        }
      } else {
        // Handle district operations
        if (dialogState.editingItem) {
          // Update existing district using MongoDB ID approach
          console.log('🔍 Editing district item:', dialogState.editingItem);
          
          if (!dialogState.editingItem._id) {
            throw new Error('Cannot update district: No ID found. Please refresh the page and try again.');
          }
          
          await settingsService.states.updateDistrict(dialogState.editingItem._id, {
            state: formData.state,
            district: formData.district,
            status: formData.status
          });
        } else {
          // Create new district
          await settingsService.states.createDistrict({
            state: formData.state,
            district: formData.district,
            status: formData.status
          });
        }
      }

      await loadStatesAndDistricts();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save geographic data');
      console.error('Error saving geographic data:', err);
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // const handleDeleteItem = (type, item) => {
  //   setDeleteModal({
  //     isOpen: true,
  //     type,
  //     item,
  //     isLoading: false
  //   });
  // };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      if (deleteModal.type === 'state') {
        await settingsService.states.delete(deleteModal.item._id);
      } else {
        await settingsService.states.deleteDistrict(deleteModal.item._id);
      }
      
      await loadStatesAndDistricts();
      setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false });
    } catch (err) {
      setError(err.message || `Failed to delete ${deleteModal.type}`);
      console.error(`Error deleting ${deleteModal.type}:`, err);
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleSectionChange('states')}
          className={`flex-1 py-2 px-4 rounded-md tab-text transition-colors ${
            activeSection === 'states'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe className="h-4 w-4 inline mr-2" />
          States
        </button>
        <button
          onClick={() => handleSectionChange('districts')}
          className={`flex-1 py-2 px-4 rounded-md tab-text transition-colors ${
            activeSection === 'districts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building2 className="h-4 w-4 inline mr-2" />
          Districts
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* State Filter for Districts */}
        {activeSection === 'districts' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by State
              </label>
              {/* Debug info */}
              {/* <div className="text-xs text-gray-500 mb-1">
                Loading: {stateEnumsLoading ? 'Yes' : 'No'} | 
                States Count: {Array.isArray(stateEnums) ? stateEnums.length : 'Not Array'} | 
                Type: {stateEnums[0]}
              </div> */}
              <select
                value={selectedStateFilter}
                onChange={(e) => handleStateFilterChange(e.target.value)}
                disabled={stateEnumsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="all">
                  {stateEnumsLoading ? 'Loading states...' : 'All States'}
                </option>
                {!stateEnumsLoading && Array.isArray(stateEnums) && stateEnums.length > 0 ? 
                  stateEnums.map((state) => {
                    console.log('Rendering state option:', state);
                    return (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    );
                  }) 
                  : 
                  !stateEnumsLoading && (
                    <option disabled>
                      {Array.isArray(stateEnums) ? 'No states available' : 'Invalid data format'}
                    </option>
                  )
                }
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Districts
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search districts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-text"
                  />
                </div>
                {(searchTerm || selectedStateFilter !== 'all') && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={clearFilters}
                    className="px-3 py-2 h-10"
                    title="Clear all filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search for States */}
        {activeSection === 'states' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-text"
            />
          </div>
        )}
      </div>

      {/* States Section */}
      {activeSection === 'states' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="card-title">States Management</span>
                </CardTitle>
                {/* <CardDescription className="card-description">
                  Manage states for geographic organization
                </CardDescription> */}
              </div>
              <Button onClick={() => handleOpenDialog('state')} className="h-9 sm:h-10">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="button-text">Add State</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="table-container">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="table-head-responsive text-left table-header">
                      State Name
                    </th>
                    <th className="table-head-responsive text-left table-header">
                      Status
                    </th>
                    <th className="table-head-responsive text-right table-header">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStates.map((state, index) => (
                    <tr key={state._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="table-cell-responsive">
                        <div className="table-cell">{state.state}</div>
                      </td>
                      <td className="table-cell-responsive">
                        <Badge variant={state.status ? 'success' : 'secondary'} className="responsive-badge">
                          {state.status ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="table-cell-responsive text-right">
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenDialog('state', state)}
                            className="action-btn action-btn-primary"
                            title="Edit State"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStates.length === 0 && (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="body-text text-gray-500">No states found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Districts Section */}
      {activeSection === 'districts' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="card-title">Districts Management</span>
                </CardTitle>
                <CardDescription className="card-description mt-1">
                  {selectedStateFilter === 'all' 
                    ? `Showing ${filteredDistricts.length} districts from all states`
                    : `Showing ${filteredDistricts.length} districts from ${selectedStateFilter}`
                  }
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog('district')} className="h-9 sm:h-10">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="button-text">Add District</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="table-container">
            {districtsLoading && (
              <div className="text-center py-4 text-blue-600">
                Loading districts...
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="table-head-responsive text-left table-header">
                      District Name
                    </th>
                    <th className="table-head-responsive text-left table-header">
                      State
                    </th>
                    <th className="table-head-responsive text-left table-header">
                      Status
                    </th>
                    <th className="table-head-responsive text-right table-header">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {districtsLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        Loading districts...
                      </td>
                    </tr>
                  ) : filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district, index) => (
                      <tr key={district._id || `${district.state}-${district.district}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="table-cell-responsive">
                          <div className="table-cell">{district.district}</div>
                        </td>
                        <td className="table-cell-responsive">
                          <div className="table-cell-secondary">{district.state}</div>
                        </td>
                        <td className="table-cell-responsive">
                          <Badge variant={district.status ? 'success' : 'secondary'} className="responsive-badge">
                            {district.status ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="table-cell-responsive text-right">
                          <div className="table-actions">
                            <button
                              onClick={() => handleOpenDialog('district', district)}
                              className="action-btn action-btn-primary"
                              title="Edit District"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        {selectedStateFilter === 'all' 
                          ? 'No districts available' 
                          : `No districts found for ${selectedStateFilter}`
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.type === 'state' ? 'State' : 'District'}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
        itemName={deleteModal.item?.state || deleteModal.item?.district}
        itemType={deleteModal.type}
        isLoading={deleteModal.isLoading}
      />

      {/* Geography Dialog */}
      <GeographyDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveGeography}
        item={dialogState.editingItem}
        type={dialogState.type}
        states={getUniqueStates()}
        isLoading={dialogState.isSubmitting}
      />
    </div>
  );
};

export default GeographyTab;