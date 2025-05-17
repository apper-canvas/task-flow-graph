import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const CheckIcon = getIcon('Check');
  const ListIcon = getIcon('List');
  const BellIcon = getIcon('Bell');
  const CalendarIcon = getIcon('Calendar');
  const ArrowRightIcon = getIcon('ArrowRight');

  // Features for the landing page
  const features = [
    {
      icon: ListIcon,
      title: 'Organize Tasks',
      description: 'Easily create, categorize, and prioritize your tasks to stay organized.'
    },
    {
      icon: CheckIcon,
      title: 'Track Progress',
      description: 'Mark tasks as complete and track your productivity over time.'
    },
    {
      icon: BellIcon,
      title: 'Due Dates & Reminders',
      description: 'Set due dates for your tasks and never miss a deadline.'
    },
    {
      icon: CalendarIcon,
      title: 'Calendar Integration',
      description: 'See your tasks in a calendar view to plan your week efficiently.'
    }
  ];
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-surface-800 dark:text-surface-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Manage Your Tasks <span className="text-primary">Efficiently</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            TaskFlow helps you organize your tasks, track your progress, and boost your productivity.
            Simple, intuitive, and designed for your workflow.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn-primary flex items-center justify-center gap-2">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} 
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            
            {!isAuthenticated && (
              <Link to="/signup" className="btn-outline">
                Create Free Account
              </Link>
            )}
          </motion.div>
        </div>
        
        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-surface-800 dark:text-surface-100">
            Why Use TaskFlow?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="card p-8 md:p-12 text-center mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TaskFlow. 
            Start managing your tasks more effectively today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn-primary">
              {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn-outline">
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="mt-20 py-6 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-primary font-bold mb-4 md:mb-0">
              TaskFlow
            </div>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;