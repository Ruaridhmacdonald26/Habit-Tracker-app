import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Brain, TrendingUp, Target, Clock, Zap, Star, X, ChevronRight } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import './SmartSuggestions.css';

const SmartSuggestions = () => {
  const { habits, habitHistory, getHabitStreak, getHabitCompletionRate } = useHabits();
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    generateSmartSuggestions();
  }, [habits, habitHistory]);

  const generateSmartSuggestions = () => {
    const newSuggestions = [];
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    // Analyze habit patterns
    const habitAnalysis = habits.map(habit => {
      const streak = getHabitStreak(habit.id);
      const completionRate = getHabitCompletionRate(habit.id, 7);
      const isCompletedToday = habitHistory[today]?.[habit.id] || false;
      
      return {
        habit,
        streak,
        completionRate,
        isCompletedToday,
        category: habit.category || 'General'
      };
    });

    // 1. Time-based suggestions
    if (currentHour >= 6 && currentHour <= 10) {
      const morningHabits = habitAnalysis.filter(h => 
        h.habit.name.toLowerCase().includes('morning') ||
        h.habit.name.toLowerCase().includes('exercise') ||
        h.habit.name.toLowerCase().includes('meditation')
      );
      
      if (morningHabits.length > 0 && !morningHabits.every(h => h.isCompletedToday)) {
        newSuggestions.push({
          id: 'morning_routine',
          type: 'timing',
          priority: 'high',
          title: 'Perfect Morning Time!',
          message: 'Research shows morning habits have 3x higher success rates',
          action: 'Complete your morning habits now',
          icon: Clock,
          color: '#f59e0b',
          relevantHabits: morningHabits.filter(h => !h.isCompletedToday).map(h => h.habit)
        });
      }
    }

    if (currentHour >= 18 && currentHour <= 22) {
      const eveningHabits = habitAnalysis.filter(h => 
        h.habit.name.toLowerCase().includes('evening') ||
        h.habit.name.toLowerCase().includes('read') ||
        h.habit.name.toLowerCase().includes('journal')
      );
      
      if (eveningHabits.length > 0 && !eveningHabits.every(h => h.isCompletedToday)) {
        newSuggestions.push({
          id: 'evening_routine',
          type: 'timing',
          priority: 'medium',
          title: 'Wind Down Time',
          message: 'Evening habits help create better sleep quality',
          action: 'Set up your evening routine',
          icon: Clock,
          color: '#6366f1',
          relevantHabits: eveningHabits.filter(h => !h.isCompletedToday).map(h => h.habit)
        });
      }
    }

    // 2. Streak-based suggestions
    const strugglingHabits = habitAnalysis.filter(h => 
      h.completionRate < 50 && h.streak === 0
    );
    
    if (strugglingHabits.length > 0) {
      const worstHabit = strugglingHabits.sort((a, b) => a.completionRate - b.completionRate)[0];
      newSuggestions.push({
        id: 'struggling_habit',
        type: 'improvement',
        priority: 'high',
        title: 'Break It Down Further',
        message: `${worstHabit.habit.name} needs a smaller first step`,
        action: 'Try the 2-minute rule: make it ridiculously easy',
        icon: Target,
        color: '#ef4444',
        relevantHabits: [worstHabit.habit],
        suggestion: 'Start with just 2 minutes of this habit daily'
      });
    }

    // 3. Success momentum suggestions
    const strongHabits = habitAnalysis.filter(h => 
      h.completionRate > 80 && h.streak > 3
    );
    
    if (strongHabits.length >= 2) {
      newSuggestions.push({
        id: 'habit_stacking',
        type: 'optimization',
        priority: 'medium',
        title: 'Stack Your Success',
        message: 'Link your strong habits together for compound results',
        action: 'Create a habit stack',
        icon: Zap,
        color: '#10b981',
        relevantHabits: strongHabits.slice(0, 2).map(h => h.habit)
      });
    }

    // 4. Category balance suggestions
    const categoryCount = {};
    habitAnalysis.forEach(h => {
      categoryCount[h.category] = (categoryCount[h.category] || 0) + 1;
    });

    const missingCategories = ['Health', 'Productivity', 'Learning', 'Social']
      .filter(cat => !categoryCount[cat]);

    if (missingCategories.length > 0 && habits.length < 5) {
      newSuggestions.push({
        id: 'category_balance',
        type: 'growth',
        priority: 'low',
        title: 'Expand Your Growth',
        message: `Consider adding a ${missingCategories[0].toLowerCase()} habit`,
        action: 'Browse habit templates',
        icon: TrendingUp,
        color: '#8b5cf6',
        categories: missingCategories
      });
    }

    // 5. Completion motivation
    const completedToday = habitAnalysis.filter(h => h.isCompletedToday).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? completedToday / totalHabits : 0;

    if (completionRate >= 0.7 && completionRate < 1) {
      newSuggestions.push({
        id: 'finish_strong',
        type: 'motivation',
        priority: 'high',
        title: 'Finish Strong!',
        message: `You're ${totalHabits - completedToday} habit${totalHabits - completedToday > 1 ? 's' : ''} away from a perfect day`,
        action: 'Complete remaining habits',
        icon: Star,
        color: '#f59e0b',
        remainingHabits: habitAnalysis.filter(h => !h.isCompletedToday).map(h => h.habit)
      });
    }

    // 6. Weekend preparation
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 5) { // Friday
      newSuggestions.push({
        id: 'weekend_prep',
        type: 'planning',
        priority: 'medium',
        title: 'Weekend Game Plan',
        message: 'Weekend habits are 40% harder to maintain',
        action: 'Set weekend habit reminders',
        icon: Brain,
        color: '#06b6d4'
      });
    }

    // 7. Comeback encouragement
    const yesterdayCompleted = habitAnalysis.filter(h => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      return habitHistory[yesterdayStr]?.[h.habit.id];
    }).length;

    if (yesterdayCompleted === 0 && completedToday > 0) {
      newSuggestions.push({
        id: 'comeback',
        type: 'encouragement',
        priority: 'medium',
        title: 'Welcome Back!',
        message: 'Every comeback starts with a single step',
        action: 'Keep the momentum going',
        icon: TrendingUp,
        color: '#10b981'
      });
    }

    // Filter out dismissed suggestions
    const filteredSuggestions = newSuggestions.filter(s => 
      !dismissed.includes(s.id)
    );

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    filteredSuggestions.sort((a, b) => 
      priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    setSuggestions(filteredSuggestions.slice(0, 3)); // Show top 3
  };

  const dismissSuggestion = (suggestionId) => {
    setDismissed(prev => [...prev, suggestionId]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const expandSuggestion = (suggestion) => {
    setActiveSuggestion(activeSuggestion?.id === suggestion.id ? null : suggestion);
  };

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      className="smart-suggestions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="suggestions-header">
        <h3>
          <Brain size={20} />
          Smart Suggestions
        </h3>
        <p className="suggestions-subtitle">
          AI-powered insights to optimize your habit journey
        </p>
      </div>

      <div className="suggestions-list">
        <AnimatePresence mode="popLayout">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              className={`suggestion-card priority-${suggestion.priority}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <div className="suggestion-header">
                <div className="suggestion-icon" style={{ color: suggestion.color }}>
                  <suggestion.icon size={20} />
                </div>
                
                <div className="suggestion-content">
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-message">{suggestion.message}</div>
                </div>

                <div className="suggestion-actions">
                  <button
                    className="expand-btn"
                    onClick={() => expandSuggestion(suggestion)}
                  >
                    <ChevronRight 
                      size={16} 
                      style={{ 
                        transform: activeSuggestion?.id === suggestion.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                  <button
                    className="dismiss-btn"
                    onClick={() => dismissSuggestion(suggestion.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {activeSuggestion?.id === suggestion.id && (
                  <motion.div
                    className="suggestion-expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="expanded-content">
                      <div className="suggestion-action">
                        <Lightbulb size={16} />
                        <span>{suggestion.action}</span>
                      </div>

                      {suggestion.relevantHabits && (
                        <div className="relevant-habits">
                          <div className="habits-label">Related habits:</div>
                          <div className="habits-list">
                            {suggestion.relevantHabits.map(habit => (
                              <div key={habit.id} className="habit-chip">
                                <span className="habit-emoji">{habit.emoji}</span>
                                <span className="habit-name">{habit.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {suggestion.suggestion && (
                        <div className="specific-suggestion">
                          <strong>Suggestion:</strong> {suggestion.suggestion}
                        </div>
                      )}

                      {suggestion.categories && (
                        <div className="category-suggestions">
                          <div className="categories-label">Consider adding:</div>
                          <div className="categories-list">
                            {suggestion.categories.map(category => (
                              <span key={category} className="category-chip">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;
