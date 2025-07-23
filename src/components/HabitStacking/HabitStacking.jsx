import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Plus, Trash2, Target, Clock, CheckCircle } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import './HabitStacking.css';

const HabitStacking = () => {
  const { habits, habitStacks, addHabitStack, removeHabitStack, toggleStackHabit } = useHabits();
  const [isCreating, setIsCreating] = useState(false);
  const [newStack, setNewStack] = useState({
    name: '',
    description: '',
    habits: [],
    triggerHabit: null,
    order: 'sequential' // 'sequential' or 'parallel'
  });

  const availableHabits = habits.filter(habit => 
    !newStack.habits.some(stackHabit => stackHabit.id === habit.id)
  );

  const handleCreateStack = () => {
    if (newStack.name && newStack.habits.length >= 2) {
      addHabitStack({
        ...newStack,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        totalCompletions: 0,
        currentStreak: 0,
        bestStreak: 0
      });
      
      setNewStack({
        name: '',
        description: '',
        habits: [],
        triggerHabit: null,
        order: 'sequential'
      });
      setIsCreating(false);
    }
  };

  const addHabitToStack = (habit) => {
    setNewStack(prev => ({
      ...prev,
      habits: [...prev.habits, { ...habit, stackPosition: prev.habits.length }]
    }));
  };

  const removeHabitFromStack = (habitId) => {
    setNewStack(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId).map((h, index) => ({
        ...h,
        stackPosition: index
      }))
    }));
  };

  const getStackProgress = (stack) => {
    const today = new Date().toISOString().split('T')[0];
    const completedHabits = stack.habits.filter(habit => {
      // Check if this habit was completed today as part of this stack
      return habit.completedInStack && habit.completedInStack[today];
    });
    return (completedHabits.length / stack.habits.length) * 100;
  };

  const getNextHabitInStack = (stack) => {
    const today = new Date().toISOString().split('T')[0];
    return stack.habits.find(habit => 
      !habit.completedInStack || !habit.completedInStack[today]
    );
  };

  return (
    <motion.div
      className="habit-stacking"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stacking-header">
        <div className="header-content">
          <h2>
            <Link2 size={24} />
            Habit Stacking
          </h2>
          <p className="header-description">
            Link habits together for compound effects and momentum building
          </p>
        </div>
        
        {!isCreating && (
          <button
            className="create-stack-btn"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={20} />
            Create Stack
          </button>
        )}
      </div>

      {/* Create New Stack Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="create-stack-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="form-group">
              <label>Stack Name</label>
              <input
                type="text"
                value={newStack.name}
                onChange={(e) => setNewStack(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning Power Stack"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={newStack.description}
                onChange={(e) => setNewStack(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose of this habit stack"
              />
            </div>

            <div className="form-group">
              <label>Execution Order</label>
              <div className="order-selector">
                <button
                  className={`order-btn ${newStack.order === 'sequential' ? 'active' : ''}`}
                  onClick={() => setNewStack(prev => ({ ...prev, order: 'sequential' }))}
                >
                  <Clock size={16} />
                  Sequential
                </button>
                <button
                  className={`order-btn ${newStack.order === 'parallel' ? 'active' : ''}`}
                  onClick={() => setNewStack(prev => ({ ...prev, order: 'parallel' }))}
                >
                  <Target size={16} />
                  Parallel
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Add Habits to Stack</label>
              <div className="available-habits">
                {availableHabits.map(habit => (
                  <button
                    key={habit.id}
                    className="habit-option"
                    onClick={() => addHabitToStack(habit)}
                  >
                    <span className="habit-emoji">{habit.emoji}</span>
                    <span className="habit-name">{habit.name}</span>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            </div>

            {newStack.habits.length > 0 && (
              <div className="form-group">
                <label>Stack Preview ({newStack.habits.length} habits)</label>
                <div className="stack-preview">
                  {newStack.habits.map((habit, index) => (
                    <div key={habit.id} className="stack-habit-item">
                      <span className="stack-position">{index + 1}</span>
                      <span className="habit-emoji">{habit.emoji}</span>
                      <span className="habit-name">{habit.name}</span>
                      <button
                        className="remove-habit-btn"
                        onClick={() => removeHabitFromStack(habit.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateStack}
                disabled={!newStack.name || newStack.habits.length < 2}
              >
                Create Stack
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Habit Stacks */}
      <div className="habit-stacks-list">
        {habitStacks && habitStacks.length > 0 ? (
          habitStacks.map(stack => {
            const progress = getStackProgress(stack);
            const nextHabit = getNextHabitInStack(stack);
            
            return (
              <motion.div
                key={stack.id}
                className="habit-stack-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2 }}
              >
                <div className="stack-header">
                  <div className="stack-info">
                    <h3 className="stack-name">{stack.name}</h3>
                    <p className="stack-description">{stack.description}</p>
                  </div>
                  <button
                    className="delete-stack-btn"
                    onClick={() => removeHabitStack(stack.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="stack-progress">
                  <div className="progress-info">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span className="stack-type">{stack.order}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {nextHabit && (
                  <div className="next-habit">
                    <span className="next-label">Next:</span>
                    <span className="next-habit-info">
                      <span className="habit-emoji">{nextHabit.emoji}</span>
                      {nextHabit.name}
                    </span>
                  </div>
                )}

                <div className="stack-habits">
                  {stack.habits.map((habit, index) => {
                    const today = new Date().toISOString().split('T')[0];
                    const completed = habit.completedInStack && habit.completedInStack[today];
                    
                    return (
                      <div
                        key={habit.id}
                        className={`stack-habit ${completed ? 'completed' : ''}`}
                      >
                        <span className="habit-position">{index + 1}</span>
                        <span className="habit-emoji">{habit.emoji}</span>
                        <span className="habit-name">{habit.name}</span>
                        <button
                          className={`habit-toggle ${completed ? 'completed' : ''}`}
                          onClick={() => toggleStackHabit(stack.id, habit.id)}
                          disabled={stack.order === 'sequential' && index > 0 && 
                            !stack.habits[index - 1].completedInStack?.[today]}
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="stack-stats">
                  <div className="stat">
                    <span className="stat-value">{stack.currentStreak}</span>
                    <span className="stat-label">Current Streak</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stack.bestStreak}</span>
                    <span className="stat-label">Best Streak</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stack.totalCompletions}</span>
                    <span className="stat-label">Total Completions</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="empty-state">
            <Link2 size={48} />
            <h3>No Habit Stacks Yet</h3>
            <p>Create your first habit stack to link habits together for compound effects</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HabitStacking;
