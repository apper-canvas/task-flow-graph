/**
 * Service for handling task-related operations with Apper backend
 */

/**
 * Fetch all tasks
 * @returns {Promise<Array>} Array of task objects
 */
export const fetchTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await client.fetchRecords('task', {
      fields: ['Id', 'title', 'description', 'dueDate', 'priority', 'isCompleted', 'category'],
    });
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} task - Task object to create
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (task) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include updateable fields
    const taskData = {
      title: task.title,
      description: task.description, 
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.categoryId,
      isCompleted: task.isCompleted || false
    };
    
    const response = await client.createRecord('task', {
      records: [taskData]
    });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to create task");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {Object} task - Task object to update
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (task) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include updateable fields plus Id
    const taskData = {
      Id: task.Id,
      title: task.title,
      description: task.description, 
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.categoryId,
      isCompleted: task.isCompleted || false
    };
    
    const response = await client.updateRecord('task', {
      records: [taskData]
    });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to update task");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - ID of the task to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    await client.deleteRecord('task', { RecordIds: [taskId] });
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};