import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing habits
 * @returns {object} - All habit management functions and state
 */
export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [habitHistory, setHabitHistory] = useLocalStorage('habitHistory', {});
  const [habitStacks, setHabitStacks] = useLocalStorage('habitStacks', []);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Add a new habit
  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      emoji: habitData.emoji || '⭐',
      color: habitData.color || '#4ECDC4',
      createdAt: new Date().toISOString(),
      ...habitData
    };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  // Update an existing habit
  const updateHabit = useCallback((habitId, updates) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    );
  }, [setHabits]);

  // Delete a habit
  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    // Also clean up habit history
    setHabitHistory(prev => {
      const newHistory = { ...prev };
      Object.keys(newHistory).forEach(date => {
        if (newHistory[date][habitId]) {
          delete newHistory[date][habitId];
        }
      });
      return newHistory;
    });
  }, [setHabits, setHabitHistory]);

  // Mark habit as completed for a specific date
  const markHabitComplete = useCallback((habitId, date = getTodayString()) => {
    setHabitHistory(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [habitId]: true
      }
    }));
  }, [setHabitHistory]);

  // Mark habit as incomplete for a specific date
  const markHabitIncomplete = useCallback((habitId, date = getTodayString()) => {
    setHabitHistory(prev => {
      const newHistory = { ...prev };
      if (newHistory[date]) {
        delete newHistory[date][habitId];
        // Clean up empty date entries
        if (Object.keys(newHistory[date]).length === 0) {
          delete newHistory[date];
        }
      }
      return newHistory;
    });
  }, [setHabitHistory]);

  // Toggle habit completion for a specific date
  const toggleHabit = useCallback((habitId, date = getTodayString()) => {
    const isCompleted = habitHistory[date]?.[habitId] || false;
    if (isCompleted) {
      markHabitIncomplete(habitId, date);
    } else {
      markHabitComplete(habitId, date);
    }
  }, [habitHistory, markHabitComplete, markHabitIncomplete]);

  // Check if habit is completed for a specific date
  const isHabitCompleted = useCallback((habitId, date = getTodayString()) => {
    return habitHistory[date]?.[habitId] || false;
  }, [habitHistory]);

  // Get current streak for a habit
  const getHabitStreak = useCallback((habitId) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check backwards from today
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (habitHistory[dateString]?.[habitId]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [habitHistory]);

  // Get completion percentage for a habit over the last N days
  const getHabitCompletionRate = useCallback((habitId, days = 7) => {
    const today = new Date();
    let completed = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (habitHistory[dateString]?.[habitId]) {
        completed++;
      }
    }
    
    return Math.round((completed / days) * 100);
  }, [habitHistory]);

  // Check if all habits are completed for today
  const areAllHabitsCompletedToday = useCallback(() => {
    const today = getTodayString();
    return habits.length > 0 && habits.every(habit => 
      habitHistory[today]?.[habit.id] || false
    );
  }, [habits, habitHistory]);

  // Get total habits completed today
  const getTodayCompletedCount = useCallback(() => {
    const today = getTodayString();
    return habits.filter(habit => 
      habitHistory[today]?.[habit.id] || false
    ).length;
  }, [habits, habitHistory]);

  // Habit Stacking Functions
  const addHabitStack = useCallback((stackData) => {
    const newStack = {
      ...stackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalCompletions: 0,
      currentStreak: 0,
      bestStreak: 0
    };
    setHabitStacks(prev => [...prev, newStack]);
  }, [setHabitStacks]);

  const removeHabitStack = useCallback((stackId) => {
    setHabitStacks(prev => prev.filter(stack => stack.id !== stackId));
  }, [setHabitStacks]);

  const toggleStackHabit = useCallback((stackId, habitId, date = getTodayString()) => {
    // Find the stack
    const stack = habitStacks.find(s => s.id === stackId);
    if (!stack) return;

    // Update habit completion in stack
    setHabitStacks(prev => prev.map(stack => {
      if (stack.id !== stackId) return stack;

      const updatedHabits = stack.habits.map(habit => {
        if (habit.id === habitId) {
          const completedInStack = habit.completedInStack || {};
          const isCurrentlyCompleted = completedInStack[date];
          
          return {
            ...habit,
            completedInStack: {
              ...completedInStack,
              [date]: !isCurrentlyCompleted
            }
          };
        }
        return habit;
      });

      // Calculate new stack stats
      const todayCompleted = updatedHabits.filter(h => 
        h.completedInStack && h.completedInStack[date]
      ).length;
      
      const isStackCompleted = todayCompleted === updatedHabits.length;
      
      let newTotalCompletions = stack.totalCompletions;
      let newCurrentStreak = stack.currentStreak;
      let newBestStreak = stack.bestStreak;

      if (isStackCompleted) {
        newTotalCompletions++;
        newCurrentStreak++;
        newBestStreak = Math.max(newBestStreak, newCurrentStreak);
      } else {
        newCurrentStreak = 0;
      }

      return {
        ...stack,
        habits: updatedHabits,
        totalCompletions: newTotalCompletions,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak
      };
    }));
  }, [habitStacks, setHabitStacks]);

  return {
    habits,
    habitHistory,
    habitStacks,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    isHabitCompleted,
    getHabitStreak,
    getHabitCompletionRate,
    areAllHabitsCompletedToday,
    getTodayCompletedCount,
    getTodayString,
    addHabitStack,
    removeHabitStack,
    toggleStackHabit
  };
};
