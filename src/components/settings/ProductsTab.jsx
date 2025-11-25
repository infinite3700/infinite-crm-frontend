import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Package, Plus, Search, Edit, Trash2, Save, X, Tag, Loader2, AlertCircle } from 'lucide-react';
import GenericDeleteModal from '../modals/GenericDeleteModal';
import { productService } from '../../api/productService';

const ProductsTab = () => {
  console.log('ProductsTab component is rendering');
  
  const [activeSection, setActiveSection] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');

  // Loading and error states
  const [loading, setLoading] = useState({ categories: false, products: false, action: false });
  const [error, setError] = useState('');

  // Categories management
  const [categories, setCategories] = useState([]);

  // Products management
  const [products, setProducts] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // API functions
  const loadCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      setError('');
      
      const transformedCategories = await productService.getAllCategories();
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError(error.message || 'Failed to load categories. Please try again.');
      // Fallback to sample data if API fails
      setCategories([
        { _id: '1', id: 1, name: 'Software', status: true },
        { _id: '2', id: 2, name: 'Service', status: true },
        { _id: '3', id: 3, name: 'Hardware', status: false },
        { _id: '4', id: 4, name: 'Consulting', status: true },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError('');
      
      const transformedProducts = await productService.getAllProducts();
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError(error.message || 'Failed to load products. Please try again.');
      // Fallback to sample data if API fails
      setProducts([
        { _id: '1', id: 1, name: 'CRM Pro License', sku: 'CRM-PRO-001', categoryId: '1', categoryName: 'Software', unitPrice: 99.99 },
        { _id: '2', id: 2, name: 'Advanced Analytics', sku: 'ANA-ADV-002', categoryId: '1', categoryName: 'Software', unitPrice: 149.99 },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Form states
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: '', // 'add-category', 'edit-category', 'add-product', 'edit-product'
    editingItem: null,
    isSubmitting: false
  });

  // Form data
  const [categoryForm, setCategoryForm] = useState({ name: '', status: true });
  const [productForm, setProductForm] = useState({ name: '', sku: '', categoryId: '', unitPrice: '' });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', // 'category' or 'product'
    item: null,
    isLoading: false
  });

  // Filtered data
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category handler functions
  const handleAddCategory = async (formData) => {
    if (!formData.name.trim()) return;
    
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      await productService.createCategory(formData);
      
      // Reload categories to get the updated list
      await loadCategories();
      setCategoryForm({ name: '', status: true });
      setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
    } catch (error) {
      console.error('Failed to create category:', error);
      setError(error.message || 'Failed to create category. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleEditCategory = (category) => {
    setDialogState({
      isOpen: true,
      type: 'edit-category',
      editingItem: category,
      isSubmitting: false
    });
    setCategoryForm({ name: category.name, status: category.status });
  };

  const handleUpdateCategory = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      await productService.updateCategory(dialogState.editingItem._id, formData);
      
      // Reload categories and products to get updated data
      await loadCategories();
      await loadProducts();
      setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
      setCategoryForm({ name: '', status: true });
    } catch (error) {
      console.error('Failed to update category:', error);
      setError(error.message || 'Failed to update category. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteCategory = (category) => {
    setDeleteModal({
      isOpen: true,
      type: 'category',
      item: category,
      isLoading: false
    });
  };

  // Product handler functions
  const handleAddProduct = async (formData) => {
    if (!formData.name.trim() || !formData.categoryId || !formData.unitPrice) return;
    
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      await productService.createProduct(formData);
      
      // Reload products to get the updated list
      await loadProducts();
      setProductForm({ name: '', sku: '', categoryId: '', unitPrice: '' });
      setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
    } catch (error) {
      console.error('Failed to create product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleEditProduct = (product) => {
    setDialogState({
      isOpen: true,
      type: 'edit-product',
      editingItem: product,
      isSubmitting: false
    });
    setProductForm({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      unitPrice: product.unitPrice.toString()
    });
  };

  const handleUpdateProduct = async (formData) => {
    try {
      setDialogState(prev => ({ ...prev, isSubmitting: true }));
      setError('');
      
      await productService.updateProduct(dialogState.editingItem._id, formData);
      
      // Reload products to get the updated list
      await loadProducts();
      setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false });
      setProductForm({ name: '', sku: '', categoryId: '', unitPrice: '' });
    } catch (error) {
      console.error('Failed to update product:', error);
      setError(error.message || 'Failed to update product. Please try again.');
    } finally {
      setDialogState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteProduct = (product) => {
    setDeleteModal({
      isOpen: true,
      type: 'product',
      item: product,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (deleteModal.type === 'category') {
        // Note: Backend doesn't have delete endpoint for categories
        throw new Error('Category deletion not supported by backend API');
      } else {
        await productService.deleteProduct(deleteModal.item._id);
        await loadProducts();
      }
      
      setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false });
    } catch (error) {
      console.error('Failed to delete:', error);
      setError(`Failed to delete ${deleteModal.type}. ${error.message}`);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h3 className="section-title">Products & Categories Management</h3>
        <p className="section-subtitle">
          Manage your product categories and products catalog
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-3">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          <div className="body-text text-red-800">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading.categories || loading.products) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-center space-x-3">
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-spin flex-shrink-0" />
          <div className="body-text text-blue-800">
            Loading {loading.categories ? 'categories' : 'products'}...
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('categories')}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'categories'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tag className="h-4 w-4 inline mr-2" />
          Categories
        </button>
        <button
          onClick={() => setActiveSection('products')}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'products'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Products
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

      {/* Categories Section */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          {/* Categories Management Card */}
          <Card className="card-enhanced">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="card-title">Categories Management</CardTitle>
                  <CardDescription className="text-sm">
                    Manage product categories for your inventory
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setDialogState({ isOpen: true, type: 'add-category', editingItem: null, isSubmitting: false })}
                  className="w-full sm:w-auto btn-gradient"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant={category.status ? 'success' : 'secondary'} className="text-xs">
                            {category.status ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              disabled={loading.action}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={loading.action}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No categories found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className="space-y-6">
          {/* Products Management Card */}
          <Card className="card-enhanced">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="card-title">Products Management</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your products catalog and inventory
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setDialogState({ isOpen: true, type: 'add-product', editingItem: null, isSubmitting: false })}
                  className="w-full sm:w-auto btn-gradient"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-mono">{product.sku}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.categoryName}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">₹{product.unitPrice}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              disabled={loading.action}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={loading.action}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', item: null, isLoading: false })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.type === 'category' ? 'Category' : 'Product'}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? ${deleteModal.type === 'category' ? 'This will also delete all related products.' : 'This action cannot be undone.'}`}
        itemName={deleteModal.item?.name}
        itemType={deleteModal.type}
        isLoading={deleteModal.isLoading}
      />

      {/* Add/Edit Category Modal */}
      {dialogState.isOpen && (dialogState.type === 'add-category' || dialogState.type === 'edit-category') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
          ></div>
          
          {/* Modal */}
          <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="modal-title">
                    {dialogState.type === 'add-category' ? 'Add New Category' : 'Edit Category'}
                  </CardTitle>
                  <CardDescription className="modal-description mt-1">
                    {dialogState.type === 'add-category' ? 'Create a new product category' : 'Update category information'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                if (dialogState.type === 'add-category') {
                  handleAddCategory(categoryForm);
                } else {
                  handleUpdateCategory(categoryForm);
                }
              }} className="space-y-4">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="modal-categoryName" className="text-sm font-semibold text-gray-700">
                    Category Name *
                  </Label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                      id="modal-categoryName"
                      type="text"
                      placeholder="Enter category name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="pl-10 transition-all duration-300 focus:shadow-colored"
                      required
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="modal-categoryStatus"
                    checked={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor="modal-categoryStatus" className="text-sm font-medium text-gray-700">
                    Active Status
                  </Label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                    className="flex-1"
                    disabled={dialogState.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold"
                    disabled={dialogState.isSubmitting || !categoryForm.name.trim()}
                  >
                    {dialogState.isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {dialogState.type === 'add-category' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {dialogState.type === 'add-category' ? 'Create' : 'Update'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {dialogState.isOpen && (dialogState.type === 'add-product' || dialogState.type === 'edit-product') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
          ></div>
          
          {/* Modal */}
          <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-4 px-6 pt-6 bg-gradient-to-r from-green-50 to-blue-50 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="modal-title">
                    {dialogState.type === 'add-product' ? 'Add New Product' : 'Edit Product'}
                  </CardTitle>
                  <CardDescription className="modal-description mt-1">
                    {dialogState.type === 'add-product' ? 'Create a new product entry' : 'Update product information'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                if (dialogState.type === 'add-product') {
                  handleAddProduct(productForm);
                } else {
                  handleUpdateProduct(productForm);
                }
              }} className="space-y-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="modal-productName" className="text-sm font-semibold text-gray-700">
                    Product Name *
                  </Label>
                  <div className="relative group">
                    <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                      id="modal-productName"
                      type="text"
                      placeholder="Enter product name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="pl-10 transition-all duration-300 focus:shadow-colored"
                      required
                    />
                  </div>
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="modal-productSku" className="text-sm font-semibold text-gray-700">
                    SKU (Number)
                  </Label>
                  <Input
                    id="modal-productSku"
                    type="number"
                    placeholder="Enter SKU number"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="transition-all duration-300 focus:shadow-colored"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="modal-productCategory" className="text-sm font-semibold text-gray-700">
                    Category *
                  </Label>
                  <select
                    id="modal-productCategory"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c.status).map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Unit Price */}
                <div className="space-y-2">
                  <Label htmlFor="modal-productPrice" className="text-sm font-semibold text-gray-700">
                    Unit Price *
                  </Label>
                  <Input
                    id="modal-productPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={productForm.unitPrice}
                    onChange={(e) => setProductForm({ ...productForm, unitPrice: e.target.value })}
                    className="transition-all duration-300 focus:shadow-colored"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogState({ isOpen: false, type: '', editingItem: null, isSubmitting: false })}
                    className="flex-1"
                    disabled={dialogState.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 hover:from-green-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold"
                    disabled={dialogState.isSubmitting || !productForm.name.trim() || !productForm.categoryId || !productForm.unitPrice}
                  >
                    {dialogState.isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {dialogState.type === 'add-product' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {dialogState.type === 'add-product' ? 'Create Product' : 'Update Product'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;