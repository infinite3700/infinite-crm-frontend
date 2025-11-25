import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { MapPin, Plus, Search, Edit, Trash2, Globe, Building2, Save, X } from 'lucide-react';
import GenericDeleteModal from '../modals/GenericDeleteModal';
import { settingsService } from '../../api/settingsService';

const GeographyTab = () => {
  const [activeSection, setActiveSection] = useState('states'); // 'states' or 'districts'
  const [searchTerm, setSearchTerm] = useState('');
  
  // States management
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isAddingState, setIsAddingState] = useState(false);
  const [isAddingDistrict, setIsAddingDistrict] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data - adapted for backend structure (removed city)
  const [stateForm, setStateForm] = useState({ state: '', status: true });
  const [districtForm, setDistrictForm] = useState({ state: '', district: '', status: true });

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

  const loadStatesAndDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load states (grouped by state name)
      const statesResponse = await settingsService.states.getAll();
      setStates(statesResponse || []);
      
      // Load districts (all state-district-city combinations)
      const districtsResponse = await settingsService.states.getDistricts();
      setDistricts(districtsResponse || []);
    } catch (err) {
      setError(err.message || 'Failed to load geography data');
      console.error('Error loading geography data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredStates = states.filter(state =>
    state.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions for states
  const handleAddState = async () => {
    if (!stateForm.state.trim()) return;
    
    try {
      setIsSubmitting(true);
      await settingsService.states.create({
        state: stateForm.state,
        district: 'Default', // Required by backend but not used in state management
        city: 'Default', // Required by backend but not used in state management
        status: stateForm.status
      });
      
      setStateForm({ state: '', status: true });
      setIsAddingState(false);
      await loadStatesAndDistricts(); // Reload data
    } catch (err) {
      setError(err.message || 'Failed to create state entry');
      console.error('Error creating state:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStateStatus = async (stateName, newStatus) => {
    try {
      setIsSubmitting(true);
      await settingsService.states.updateStatus(stateName, newStatus);
      await loadStatesAndDistricts(); // Reload data
    } catch (err) {
      setError(err.message || 'Failed to update state status');
      console.error('Error updating state status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteState = (state) => {
    setDeleteModal({
      isOpen: true,
      type: 'state',
      item: state,
      isLoading: false
    });
  };

  // Handler functions for districts
  const handleAddDistrict = async () => {
    if (!districtForm.state.trim() || !districtForm.district.trim()) return;
    
    try {
      setIsSubmitting(true);
      await settingsService.states.create({
        state: districtForm.state,
        district: districtForm.district,
        city: 'Default', // Required by backend but not used in district management
        status: districtForm.status
      });
      
      setDistrictForm({ state: '', district: '', status: true });
      setIsAddingDistrict(false);
      await loadStatesAndDistricts(); // Reload data
    } catch (err) {
      setError(err.message || 'Failed to create district entry');
      console.error('Error creating district:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDistrict = (district) => {
    setEditingDistrict(district._id);
    setDistrictForm({ 
      state: district.state, 
      district: district.district, 
      status: district.status 
    });
  };

  const handleUpdateDistrict = async () => {
    try {
      setIsSubmitting(true);
      // For now, we'll create a new entry since the backend doesn't have update by ID
      await settingsService.states.create({
        state: districtForm.state,
        district: districtForm.district,
        city: 'Default', // Required by backend but not used in district management
        status: districtForm.status
      });
      
      setEditingDistrict(null);
      setDistrictForm({ state: '', district: '', status: true });
      await loadStatesAndDistricts(); // Reload data
    } catch (err) {
      setError(err.message || 'Failed to update district');
      console.error('Error updating district:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDistrict = (district) => {
    setDeleteModal({
      isOpen: true,
      type: 'district',
      item: district,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      if (deleteModal.type === 'state') {
        // Update state status to inactive
        await handleUpdateStateStatus(deleteModal.item.state, false);
      } else {
        // For districts, we would need a delete endpoint which doesn't exist yet
        // For now, we'll just show a message
        setError('District deletion not yet implemented in backend');
      }
      
      setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false });
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      console.error('Error deleting item:', err);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Geography Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage states and districts for your CRM
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading geography data...</p>
        </div>
      ) : (
        <>
          {/* Section Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('states')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'states'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="h-4 w-4 inline mr-2" />
              States
            </button>
            <button
              onClick={() => setActiveSection('districts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'districts'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Districts
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeSection}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* States Section */}
          {activeSection === 'states' && (
            <div className="space-y-6">
              {/* Add State Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    {isAddingState ? 'Add New State Entry' : 'States Management'}
                  </h4>
                  {!isAddingState && (
                    <button
                      onClick={() => setIsAddingState(true)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add State Entry</span>
                    </button>
                  )}
                </div>

                {isAddingState && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stateName">State Name</Label>
                        <input
                          id="stateName"
                          type="text"
                          value={stateForm.state}
                          onChange={(e) => setStateForm({ ...stateForm, state: e.target.value })}
                          placeholder="Enter state name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="stateStatus"
                          checked={stateForm.status}
                          onChange={(e) => setStateForm({ ...stateForm, status: e.target.checked })}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="stateStatus">Active</Label>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddState}
                        disabled={isSubmitting || !stateForm.state.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        <span>{isSubmitting ? 'Saving...' : 'Save State'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingState(false);
                          setStateForm({ state: '', status: true });
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* States Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          State Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStates.map((state, index) => (
                        <tr key={`${state.state}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{state.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={state.status ? 'success' : 'secondary'}>
                              {state.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleUpdateStateStatus(state.state, !state.status)}
                                disabled={isSubmitting}
                                className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                                title={state.status ? 'Deactivate' : 'Activate'}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteState(state)}
                                disabled={isSubmitting}
                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
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
                    <p className="text-gray-500">No states found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Districts Section */}
          {activeSection === 'districts' && (
            <div className="space-y-6">
              {/* Add District Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    {isAddingDistrict ? 'Add New District Entry' : 'Districts Management'}
                  </h4>
                  {!isAddingDistrict && (
                    <button
                      onClick={() => setIsAddingDistrict(true)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add District Entry</span>
                    </button>
                  )}
                </div>

                {isAddingDistrict && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="districtState">State</Label>
                        <select
                          id="districtState"
                          value={districtForm.state}
                          onChange={(e) => setDistrictForm({ ...districtForm, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        >
                          <option value="">Select State</option>
                          {filteredStates.filter(s => s.status).map((state, index) => (
                            <option key={`${state.state}-${index}`} value={state.state}>{state.state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="districtName">District Name</Label>
                        <input
                          id="districtName"
                          type="text"
                          value={districtForm.district}
                          onChange={(e) => setDistrictForm({ ...districtForm, district: e.target.value })}
                          placeholder="Enter district name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="districtStatus"
                          checked={districtForm.status}
                          onChange={(e) => setDistrictForm({ ...districtForm, status: e.target.checked })}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="districtStatus">Active</Label>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddDistrict}
                        disabled={isSubmitting || !districtForm.state.trim() || !districtForm.district.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        <span>{isSubmitting ? 'Saving...' : 'Save District'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingDistrict(false);
                          setDistrictForm({ state: '', district: '', status: true });
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Districts Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          State
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDistricts.map((district, index) => (
                        <tr key={`${district._id || index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingDistrict === district._id ? (
                              <input
                                type="text"
                                value={districtForm.district}
                                onChange={(e) => setDistrictForm({ ...districtForm, district: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isSubmitting}
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900">{district.district}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingDistrict === district._id ? (
                              <select
                                value={districtForm.state}
                                onChange={(e) => setDistrictForm({ ...districtForm, state: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isSubmitting}
                              >
                                <option value="">Select State</option>
                                {filteredStates.filter(s => s.status).map((state, index) => (
                                  <option key={`${state.state}-${index}`} value={state.state}>{state.state}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="text-sm text-gray-900">{district.state}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingDistrict === district._id ? (
                              <input
                                type="checkbox"
                                checked={districtForm.status}
                                onChange={(e) => setDistrictForm({ ...districtForm, status: e.target.checked })}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                disabled={isSubmitting}
                              />
                            ) : (
                              <Badge variant={district.status ? 'success' : 'secondary'}>
                                {district.status ? 'Active' : 'Inactive'}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              {editingDistrict === district._id ? (
                                <>
                                  <button
                                    onClick={handleUpdateDistrict}
                                    disabled={isSubmitting}
                                    className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingDistrict(null);
                                      setDistrictForm({ state: '', district: '', status: true });
                                    }}
                                    disabled={isSubmitting}
                                    className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditDistrict(district)}
                                    disabled={isSubmitting}
                                    className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDistrict(district)}
                                    disabled={isSubmitting}
                                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredDistricts.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No districts found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <GenericDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false })}
            onConfirm={confirmDelete}
            title={`Delete ${deleteModal.type === 'state' ? 'State' : 'District'}`}
            message={`Are you sure you want to delete this ${deleteModal.type}? ${deleteModal.type === 'state' ? 'This will deactivate all entries for this state.' : 'This action cannot be undone.'}`}
            itemName={deleteModal.item?.state || deleteModal.item?.district}
            itemType={deleteModal.type}
            isLoading={deleteModal.isLoading}
          />
        </>
      )}
    </div>
  );
};

export default GeographyTab;