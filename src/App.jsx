import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Settings as SettingsIcon, Filter, BarChart3, Brain, Link2, Lightbulb } from 'lucide-react';
import { useHabits } from './hooks/useHabits';
import { useSettings } from './hooks/useSettings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { habitCategories } from './data/categories';
import HabitCard from './components/HabitCard/HabitCard';
import HabitForm from './components/HabitForm/HabitForm';
import DailyQuote from './components/DailyQuote/DailyQuote';
import ConfettiCelebration from './components/ConfettiCelebration/ConfettiCelebration';
import ProgressBar from './components/ProgressBar/ProgressBar';
import ThemeSelector from './components/ThemeSelector/ThemeSelector';
import Settings from './components/Settings/Settings';
import CalendarView from './components/CalendarView/CalendarView';
import HabitStacking from './components/HabitStacking/HabitStacking';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import PredictiveAnalytics from './components/PredictiveAnalytics/PredictiveAnalytics';
import SmartSuggestions from './components/SmartSuggestions/SmartSuggestions';
import './App.css';

function App() {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    isHabitCompleted,
    getHabitStreak,
    getHabitCompletionRate,
    areAllHabitsCompletedToday,
    getTodayCompletedCount
  } = useHabits();

  const {
    settings,
    isDarkMode,
    currentTheme,
    hasReducedMotion
  } = useSettings();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfettiToday, setHasShownConfettiToday] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeView, setActiveView] = useState('habits'); // 'habits', 'calendar', 'analytics', 'stacking', 'predictions'

  // Apply saved theme on app load - removed as it's now handled by useSettings
  // useEffect(() => {
  //   applyTheme(currentTheme);
  // }, [currentTheme]);

  // Check for confetti trigger
  useEffect(() => {
    const allCompleted = areAllHabitsCompletedToday();
    const today = new Date().toDateString();
    const confettiShownToday = localStorage.getItem('confettiShown') === today;

    if (allCompleted && habits.length > 0 && !confettiShownToday && !hasShownConfettiToday) {
      setShowConfetti(true);
      setHasShownConfettiToday(true);
      localStorage.setItem('confettiShown', today);
    }
  }, [areAllHabitsCompletedToday, habits.length, hasShownConfettiToday]);

  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };

  const handleDeleteHabit = (habitId) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
    }
  };

  // Filter habits by category
  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory);

  const completedToday = getTodayCompletedCount();
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="app"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="app-container">
        {/* Header */}
        <motion.header className="app-header" variants={itemVariants}>
          <div className="header-content">
            <div className="header-text">
              <h1 className="app-title">
                <Target className="title-icon" />
                HabitForge
              </h1>
              <p className="current-date">{currentDate}</p>
            </div>
            
            <div className="header-actions">
              <ThemeSelector />
              
              {/* View Toggle */}
              <div className="view-toggle">
                <motion.button
                  className={`view-button ${activeView === 'habits' ? 'active' : ''}`}
                  onClick={() => setActiveView('habits')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target size={18} />
                  Habits
                </motion.button>
                <motion.button
                  className={`view-button ${activeView === 'calendar' ? 'active' : ''}`}
                  onClick={() => setActiveView('calendar')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar size={18} />
                  Calendar
                </motion.button>
                <motion.button
                  className={`view-button ${activeView === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveView('analytics')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart3 size={18} />
                  Analytics
                </motion.button>
                <motion.button
                  className={`view-button ${activeView === 'stacking' ? 'active' : ''}`}
                  onClick={() => setActiveView('stacking')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link2 size={18} />
                  Stacking
                </motion.button>
                <motion.button
                  className={`view-button ${activeView === 'predictions' ? 'active' : ''}`}
                  onClick={() => setActiveView('predictions')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brain size={18} />
                  AI Insights
                </motion.button>
              </div>
              
              <motion.button
                className="settings-button"
                onClick={() => setShowSettings(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Settings"
              >
                <SettingsIcon size={20} />
              </motion.button>
              
              <motion.button
                className="add-habit-btn"
                onClick={handleAddHabit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Add Habit
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Daily Quote - Only show in habits view and if enabled */}
        {activeView === 'habits' && settings?.display?.showQuotes && (
          <motion.div variants={itemVariants}>
            <DailyQuote />
          </motion.div>
        )}

        {/* Category Filter - Only show in habits view */}
        {activeView === 'habits' && habits.length > 0 && (
          <motion.div className="category-filter" variants={itemVariants}>
            <div className="filter-header">
              <Filter size={18} />
              <span>Filter by Category</span>
            </div>
            <div className="category-buttons">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All ({habits.length})
              </button>
              {Object.entries(habitCategories).map(([key, category]) => {
                const count = habits.filter(h => h.category === key).length;
                return count > 0 ? (
                  <button
                    key={key}
                    className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {category.emoji} {category.name} ({count})
                  </button>
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        {/* Smart Suggestions - Only show in habits view */}
        {activeView === 'habits' && habits.length > 0 && (
          <motion.div variants={itemVariants}>
            <SmartSuggestions />
          </motion.div>
        )}

        {/* Progress Overview - Only show in habits view and if enabled */}
        {activeView === 'habits' && totalHabits > 0 && settings?.display?.showProgress && (
          <motion.div className="progress-overview" variants={itemVariants}>
            <div className="progress-header">
              <h2>Today's Progress</h2>
              <div className="progress-stats">
                <span className="progress-fraction">
                  {completedToday}/{totalHabits}
                </span>
                <span className="progress-label">habits completed</span>
              </div>
            </div>
            
            <ProgressBar 
              progress={completionPercentage}
              height="12px"
              showPercentage={true}
              animated={!hasReducedMotion}
            />
            
            <div className="progress-insights">
              <div className="insight-item">
                <TrendingUp size={16} />
                <span>
                  {completionPercentage >= 80 
                    ? "Excellent progress!" 
                    : completionPercentage >= 50 
                    ? "Good momentum!" 
                    : "Keep going!"}
                </span>
              </div>
              <div className="insight-item">
                <Calendar size={16} />
                <span>
                  {totalHabits} active habit{totalHabits !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        {activeView === 'habits' ? (
          /* Habits List */
          <motion.div className="habits-section" variants={itemVariants}>
            {habits.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="empty-icon">🎯</div>
                <h3>No habits yet!</h3>
                <p>Start building better habits today. Click the "Add Habit" button to get started.</p>
                <motion.button
                  className="empty-state-btn"
                  onClick={handleAddHabit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  Create Your First Habit
                </motion.button>
              </motion.div>
            ) : (
              <div className="habits-grid">
                <AnimatePresence>
                  {filteredHabits.map((habit, index) => (
                    <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={isHabitCompleted(habit.id)}
                    streak={getHabitStreak(habit.id)}
                    completionRate={getHabitCompletionRate(habit.id)}
                    onToggle={toggleHabit}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        ) : activeView === 'calendar' ? (
          /* Calendar View */
          <motion.div variants={itemVariants}>
            <CalendarView />
          </motion.div>
        ) : activeView === 'analytics' ? (
          /* Analytics Dashboard */
          <motion.div variants={itemVariants}>
            <AnalyticsDashboard />
          </motion.div>
        ) : activeView === 'stacking' ? (
          /* Habit Stacking */
          <motion.div variants={itemVariants}>
            <HabitStacking />
          </motion.div>
        ) : activeView === 'predictions' ? (
          /* Predictive Analytics */
          <motion.div variants={itemVariants}>
            <PredictiveAnalytics />
          </motion.div>
        ) : null}

        {/* Floating Action Button for Mobile - Only show in habits view */}
        {activeView === 'habits' && (
          <motion.button
            className="fab"
            onClick={handleAddHabit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 500 }}
          >
            <Plus size={24} />
          </motion.button>
        )}
      </div>

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Confetti Celebration */}
      <ConfettiCelebration
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </motion.div>
  );
}

export default App;
