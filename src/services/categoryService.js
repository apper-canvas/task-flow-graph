/**
 * Service for handling category-related operations with Apper backend
 */

/**
 * Fetch all categories
 * @returns {Promise<Array>} Array of category objects
 */
export const fetchCategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await client.fetchRecords('category', {
      fields: ['Id', 'Name', 'color']
    });
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Create a new category
 * @param {Object} category - Category object to create
 * @returns {Promise<Object>} Created category object
 */
export const createCategory = async (category) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include updateable fields
    const categoryData = {
      Name: category.name,
      color: category.color
    };
    
    const response = await client.createRecord('category', {
      records: [categoryData]
    });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to create category");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Update an existing category
 * @param {Object} category - Category object to update
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (category) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include updateable fields plus Id
    const categoryData = {
      Id: category.Id,
      Name: category.name,
      color: category.color
    };
    
    const response = await client.updateRecord('category', {
      records: [categoryData]
    });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to update category");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Delete a category
 * @param {string} categoryId - ID of the category to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteCategory = async (categoryId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    await client.deleteRecord('category', { RecordIds: [categoryId] });
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};