import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';
import { 
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess 
} from '../store/tasksSlice';
import { 
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategorySuccess 
} from '../store/categoriesSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../services/taskService';
import {
  fetchCategories,
  createCategory
} from '../services/categoryService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isAscending, setIsAscending] = useState(true);

  // Load tasks and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories first
        dispatch(fetchCategoriesStart());
        const categoriesData = await fetchCategories();
        dispatch(fetchCategoriesSuccess(categoriesData));

        // Then fetch tasks
        dispatch(fetchTasksStart());
        const tasksData = await fetchTasks();
        dispatch(fetchTasksSuccess(tasksData));
      } catch (error) {
        toast.error('Failed to load data. Please try again.');
        if (!categories.length) {
          dispatch(fetchCategoriesFailure(error.message));
        }
        dispatch(fetchTasksFailure(error.message));
      }
    };

    loadData();
  }, [dispatch]);

  // Add new task
  const handleAddTask = async (task) => {
    try {
      const newTask = await createTask(task);
      dispatch(addTaskSuccess(newTask));
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task. Please try again.');
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      dispatch(deleteTaskSuccess(id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
    }
  };
  
  // Toggle task completion
  const handleToggleTaskCompletion = async (id) => {
    try {
      const taskToToggle = tasks.find(task => task.Id === id);
      if (!taskToToggle) return;
      
      const updatedTask = { 
        ...taskToToggle, 
        isCompleted: !taskToToggle.isCompleted,
      };
      
      const result = await updateTask(updatedTask);
      dispatch(updateTaskSuccess(result));
    } catch (error) {
      toast.error('Failed to update task status. Please try again.');
    }
  };

  // Update task
  const handleUpdateTask = async (updatedTask) => {
    try {
      const result = await updateTask(updatedTask);
      dispatch(updateTaskSuccess(result));
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task. Please try again.');
    }
  };

  // Add new category
  const handleAddCategory = async (category) => {
    try {
      const newCategory = await createCategory(category);
      dispatch(addCategorySuccess(newCategory));
      toast.success('Category added successfully!');
    } catch (error) {
      toast.error('Failed to add category. Please try again.');
    }
  };

  // Filter tasks
  const getFilteredTasks = () => {
    if (tasksLoading) return [];
    
    let filteredTasks = [...tasks];
    
    // Apply category filter
    if (activeFilter !== 'all' && activeFilter !== 'completed') {
      filteredTasks = filteredTasks.filter(task => task.category === activeFilter);
    } else if (activeFilter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.isCompleted);
    }
    
    // Apply sorting
    filteredTasks.sort((a, b) => {
      if (sortBy === 'title') {
        return isAscending 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return isAscending 
          ? priorityOrder[a.priority] - priorityOrder[b.priority] 
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'dueDate') {
        // Handle null due dates
        if (!a.dueDate) return isAscending ? 1 : -1;
        if (!b.dueDate) return isAscending ? -1 : 1;
        
        return isAscending 
          ? new Date(a.dueDate) - new Date(b.dueDate) 
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });
    
    return filteredTasks;
  };

  // Get Icon components
  const ListIcon = getIcon('ListTodo');
  const CheckCircleIcon = getIcon('CheckCircle2');
  const ArrowUpDown = getIcon('ArrowUpDown');
  const LoaderIcon = getIcon('Loader2');

  // If both categories and tasks are loading, show loading state
  if (tasksLoading && categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-lg text-surface-600 dark:text-surface-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // If there's an error, show error message
  if (tasksError || categoriesError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong</h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {tasksError || categoriesError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Category Filter Navigation */}
            <motion.nav 
              className="card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ListIcon className="w-5 h-5 text-primary" /> 
                <span>Filters</span>
              </h2>
              
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    All Tasks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveFilter('completed')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeFilter === 'completed'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Completed
                    </span>
                  </button>
                </li>
                
                <li className="mt-4">
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 px-3 mb-2">
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    {categories.map(category => (
                      <li key={category.Id}>
                        <button
                          onClick={() => setActiveFilter(category.Id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            activeFilter === category.Id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                          }`}
                        >
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.Name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </motion.nav>
            
            {/* Statistics */}
            <motion.div 
              className="card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Completed</span>
                  <span className="font-medium">
                    {tasks.filter(task => task.isCompleted).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Pending</span>
                  <span className="font-medium">
                    {tasks.filter(task => !task.isCompleted).length}
                  </span>
                </div>
                
                {tasks.length > 0 && (
                  <div className="mt-4">
                    <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${Math.round((tasks.filter(task => task.isCompleted).length / tasks.length) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400 mt-1 text-right">
                      {Math.round((tasks.filter(task => task.isCompleted).length / tasks.length) * 100)}% complete
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-bold">
              {activeFilter === 'all' && 'All Tasks'}
              {activeFilter === 'completed' && 'Completed Tasks'}
              {activeFilter !== 'all' && activeFilter !== 'completed' && 
                categories.find(c => c.Id === activeFilter)?.Name + ' Tasks'}
            </h1>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-surface-600 dark:text-surface-400">Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input !py-1 !px-3 text-sm min-w-[120px]"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              
              <button
                onClick={() => setIsAscending(prev => !prev)}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700"
                title={isAscending ? "Sort descending" : "Sort ascending"}
              >
                <ArrowUpDown className={`w-4 h-4 transition-transform ${!isAscending ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Main Task Management Feature */}
          <MainFeature 
            tasks={getFilteredTasks()}
            categories={categories}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            onUpdateTask={handleUpdateTask}
            onAddCategory={handleAddCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;