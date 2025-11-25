import { apiMethods, authHelpers } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Product service methods using the common API client
export const productService = {
    // ===== CATEGORIES =====

    // Get all categories
    getAllCategories: async () => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.SETTINGS.PRODUCTS.CATEGORIES.GET_ALL);

            // Transform backend data to frontend format
            const transformedCategories = (response || []).map(cat => ({
                _id: cat._id,
                id: cat._id, // Keep for backward compatibility
                name: cat.category,
                status: cat.status !== false // Default to true if not specified
            }));

            return transformedCategories;
        } catch (error) {
            console.error('Failed to load categories:', error);

            // Handle specific error types
            if (error.status === 401 || error.message.includes('401')) {
                throw new Error('Authentication required');
            }
            if (error.status === 403) {
                throw new Error('Access forbidden');
            }
            if (error.status === 404) {
                throw new Error('Categories endpoint not found');
            }
            if (error.status === 500) {
                throw new Error('Server error occurred');
            }

            // Network or other errors
            if (!error.status) {
                throw new Error('Network error - please check your connection');
            }

            throw new Error(error.message || 'Failed to load categories');
        }
    },

    // Create category
    createCategory: async (categoryData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const payload = {
                category: categoryData.name,
                status: categoryData.status
            };

            const response = await apiMethods.post(API_ENDPOINTS.SETTINGS.PRODUCTS.CATEGORIES.CREATE, payload);

            return {
                _id: response._id,
                id: response._id,
                name: response.category,
                status: response.status !== false
            };
        } catch (error) {
            console.error('Failed to create category:', error);

            if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                throw new Error('Category name already exists');
            }
            if (error.status === 400) {
                throw new Error('Invalid category data provided');
            }
            if (error.status === 401) {
                throw new Error('Authentication required');
            }
            if (error.status === 403) {
                throw new Error('You do not have permission to create categories');
            }

            throw new Error(error.message || 'Failed to create category');
        }
    },

    // Update category
    updateCategory: async (categoryId, categoryData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const payload = {
                _id: categoryId,
                category: categoryData.name,
                status: categoryData.status
            };

            // Backend uses POST for both create and update
            const response = await apiMethods.post(API_ENDPOINTS.SETTINGS.PRODUCTS.CATEGORIES.UPDATE, payload);

            return {
                _id: response._id,
                id: response._id,
                name: response.category,
                status: response.status !== false
            };
        } catch (error) {
            console.error('Failed to update category:', error);

            if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                throw new Error('Category name already exists');
            }
            if (error.status === 400) {
                throw new Error('Invalid category data provided');
            }
            if (error.status === 404) {
                throw new Error('Category not found');
            }

            throw new Error(error.message || 'Failed to update category');
        }
    },

    // ===== PRODUCTS =====

    // Get all products
    getAllProducts: async () => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.SETTINGS.PRODUCTS.GET_ALL);

            // Transform backend data to frontend format
            const transformedProducts = (response || []).map(product => ({
                _id: product._id,
                id: product._id, // Keep for backward compatibility
                name: product.name,
                sku: product.sku || '',
                categoryId: product.category?._id || '',
                categoryName: product.category?.category || 'Unknown',
                unitPrice: product.unitPrice || 0,
                status: product.status !== false
            }));

            return transformedProducts;
        } catch (error) {
            console.error('Failed to load products:', error);

            // Handle specific error types
            if (error.status === 401 || error.message.includes('401')) {
                throw new Error('Authentication required');
            }
            if (error.status === 403) {
                throw new Error('Access forbidden');
            }
            if (error.status === 404) {
                throw new Error('Products endpoint not found');
            }
            if (error.status === 500) {
                throw new Error('Server error occurred');
            }

            // Network or other errors
            if (!error.status) {
                throw new Error('Network error - please check your connection');
            }

            throw new Error(error.message || 'Failed to load products');
        }
    },

    // Get product by ID
    getProductById: async (productId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.SETTINGS.PRODUCTS.GET_BY_ID(productId));

            return {
                _id: response._id,
                id: response._id,
                name: response.name,
                sku: response.sku || '',
                categoryId: response.category?._id || '',
                categoryName: response.category?.category || 'Unknown',
                unitPrice: response.unitPrice || 0,
                status: response.status !== false
            };
        } catch (error) {
            console.error('Failed to get product:', error);

            if (error.status === 404) {
                throw new Error('Product not found');
            }

            throw new Error(error.message || 'Failed to get product');
        }
    },

    // Create product
    createProduct: async (productData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const payload = {
                name: productData.name,
                sku: productData.sku ? parseInt(productData.sku) || 0 : 0,
                unitPrice: parseFloat(productData.unitPrice),
                category: productData.categoryId,
                status: true
            };

            const response = await apiMethods.post(API_ENDPOINTS.SETTINGS.PRODUCTS.CREATE, payload);

            return {
                _id: response._id,
                id: response._id,
                name: response.name,
                sku: response.sku || '',
                categoryId: response.category?._id || productData.categoryId,
                categoryName: response.category?.category || 'Unknown',
                unitPrice: response.unitPrice || 0,
                status: response.status !== false
            };
        } catch (error) {
            console.error('Failed to create product:', error);

            if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                throw new Error('Product name or SKU already exists');
            }
            if (error.message.includes('validation')) {
                throw new Error('Please check your input data');
            }
            if (error.status === 400) {
                throw new Error('Invalid product data provided');
            }
            if (error.status === 401) {
                throw new Error('Authentication required');
            }
            if (error.status === 403) {
                throw new Error('You do not have permission to create products');
            }

            throw new Error(error.message || 'Failed to create product');
        }
    },

    // Update product
    updateProduct: async (productId, productData) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const payload = {
                name: productData.name,
                sku: productData.sku ? parseInt(productData.sku) || 0 : 0,
                unitPrice: parseFloat(productData.unitPrice),
                category: productData.categoryId,
                status: true
            };

            const response = await apiMethods.put(API_ENDPOINTS.SETTINGS.PRODUCTS.UPDATE(productId), payload);

            return {
                _id: response._id,
                id: response._id,
                name: response.name,
                sku: response.sku || '',
                categoryId: response.category?._id || productData.categoryId,
                categoryName: response.category?.category || 'Unknown',
                unitPrice: response.unitPrice || 0,
                status: response.status !== false
            };
        } catch (error) {
            console.error('Failed to update product:', error);

            if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                throw new Error('Product name or SKU already exists');
            }
            if (error.message.includes('validation')) {
                throw new Error('Please check your input data');
            }
            if (error.status === 400) {
                throw new Error('Invalid product data provided');
            }
            if (error.status === 404) {
                throw new Error('Product not found');
            }

            throw new Error(error.message || 'Failed to update product');
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            await apiMethods.delete(API_ENDPOINTS.SETTINGS.PRODUCTS.DELETE(productId));

            return { success: true, id: productId };
        } catch (error) {
            console.error('Failed to delete product:', error);

            if (error.status === 404) {
                throw new Error('Product not found');
            }
            if (error.status === 403) {
                throw new Error('You do not have permission to delete products');
            }

            throw new Error(error.message || 'Failed to delete product');
        }
    },
};