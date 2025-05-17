import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ 
  tasks,
  categories,
  onAddTask,
  onDeleteTask,
  onToggleTaskCompletion,
  onUpdateTask,
  onAddCategory
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    categoryId: categories.length > 0 ? categories[0].id : '',
    isCompleted: false
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#818cf8'
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const formRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Focus title input when form is shown
    if (showForm && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showForm]);

  useEffect(() => {
    // Close form when clicking outside
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (showForm && !editingTask) {
          handleCancelForm();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForm, editingTask]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowForm = () => {
    setShowForm(true);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: categories.length > 0 ? categories[0].id : '',
      isCompleted: false
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setShowForm(true);
    setEditingTask(task);
    setFormData({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!');
      return;
    }
    
    const taskToSave = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    
    if (editingTask) {
      onUpdateTask({ ...taskToSave, id: editingTask.id, createdAt: editingTask.createdAt });
    } else {
      onAddTask(taskToSave);
    }
    
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: categories.length > 0 ? categories[0].id : '',
      isCompleted: false
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error('Category name is required!');
      return;
    }
    
    onAddCategory({
      name: newCategory.name.trim(),
      color: newCategory.color
    });
    
    setShowAddCategory(false);
    setNewCategory({
      name: '',
      color: '#818cf8'
    });
  };
  
  // Format due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate || task.isCompleted) return false;
    return isPast(parseISO(task.dueDate)) && parseISO(task.dueDate).setHours(23, 59, 59, 999) < new Date();
  };

  // Get category by id
  const getCategoryById = (id) => {
    return categories.find(category => category.id === id) || null;
  };

  // Get Icon components
  const PlusIcon = getIcon('Plus');
  const CheckIcon = getIcon('Check');
  const TrashIcon = getIcon('Trash2');
  const EditIcon = getIcon('Edit');
  const CalendarIcon = getIcon('Calendar');
  const FlagIcon = getIcon('Flag');
  const XIcon = getIcon('X');
  const AlertCircleIcon = getIcon('AlertCircle');
  const CircleOffIcon = getIcon('CircleOff');

  return (
    <div>
      {/* Task Form */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card mb-6"
            ref={formRef}
          >
            <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={handleCancelForm}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  ref={titleInputRef}
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What needs to be done?"
                  className="input"
                  maxLength={100}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add details about this task..."
                  className="input min-h-[5rem] resize-y"
                  maxLength={500}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="categoryId" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Category
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="text-xs text-primary hover:text-primary-dark"
                  >
                    + Add new
                  </button>
                </div>
                
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="input"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {editingTask && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    name="isCompleted"
                    checked={formData.isCompleted}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label 
                    htmlFor="isCompleted" 
                    className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    Mark as completed
                  </label>
                </div>
              )}
              
              <div className="flex justify-end pt-2 gap-3">
                {!isMobile && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md"
            >
              <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="font-bold">Add New Category</h3>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="p-4 space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryChange}
                    placeholder="e.g., Work, Personal, Errands"
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryColor" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="categoryColor"
                      name="color"
                      value={newCategory.color}
                      onChange={handleCategoryChange}
                      className="w-10 h-10 rounded border border-surface-200 dark:border-surface-700 cursor-pointer"
                    />
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      Select a color for this category
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add Task Button */}
      {!showForm && (
        <motion.button
          onClick={handleShowForm}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="card w-full flex items-center justify-center gap-2 py-3 mb-6 bg-primary/5 hover:bg-primary/10 text-primary border-2 border-dashed border-primary/20 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">Add New Task</span>
        </motion.button>
      )}
      
      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
                <CircleOffIcon className="w-8 h-8 text-surface-400 dark:text-surface-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-md mb-6">
                {showForm 
                  ? "Create your first task using the form above."
                  : "Click the 'Add New Task' button to create your first task."}
              </p>
              
              {!showForm && (
                <motion.button
                  onClick={handleShowForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  <span className="flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Create Task
                  </span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`card overflow-hidden transition-all ${
                  task.isCompleted 
                    ? 'bg-surface-50/50 dark:bg-surface-800/50' 
                    : ''
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 flex items-start pt-1">
                    <button
                      onClick={() => onToggleTaskCompletion(task.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                        task.isCompleted
                          ? 'bg-primary border-primary text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                      aria-label={task.isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                    >
                      {task.isCompleted && <CheckIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h3 className={`text-lg font-medium break-words ${
                        task.isCompleted 
                          ? 'text-surface-500 dark:text-surface-400 line-through' 
                          : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mt-1 sm:mt-0 sm:ml-auto">
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'high' 
                            ? 'task-priority-high' 
                            : task.priority === 'medium'
                              ? 'task-priority-medium'
                              : 'task-priority-low'
                        }`}>
                          <FlagIcon className="w-3 h-3" />
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        
                        {/* Category Badge */}
                        {task.categoryId && getCategoryById(task.categoryId) && (
                          <span 
                            className="category-pill inline-flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${getCategoryById(task.categoryId).color}20`,
                              color: getCategoryById(task.categoryId).color
                            }}
                          >
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: getCategoryById(task.categoryId).color }}
                            />
                            {getCategoryById(task.categoryId).name}
                          </span>
                        )}
                        
                        {/* Due Date Badge */}
                        {task.dueDate && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            isOverdue(task)
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                          }`}>
                            {isOverdue(task) ? (
                              <AlertCircleIcon className="w-3 h-3" />
                            ) : (
                              <CalendarIcon className="w-3 h-3" />
                            )}
                            {formatDueDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Task Description */}
                    {task.description && (
                      <div className={`mb-4 text-sm break-words ${
                        task.isCompleted 
                          ? 'text-surface-500 dark:text-surface-400' 
                          : 'text-surface-600 dark:text-surface-300'
                      }`}>
                        {task.description}
                      </div>
                    )}
                    
                    {/* Task Actions */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-3">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="btn-outline !py-1 !px-3 text-sm flex items-center gap-1"
                      >
                        <EditIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="btn-outline !py-1 !px-3 text-sm flex items-center gap-1 text-red-500 hover:text-red-600 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;