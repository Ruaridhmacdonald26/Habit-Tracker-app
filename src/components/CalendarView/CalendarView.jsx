import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import './CalendarView.css';

const CalendarView = () => {
  const { habits, habitHistory } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Simple calendar data generation
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = currentDay.toDateString() === new Date().toDateString();
      
      // Simple completion calculation
      let completedHabits = 0;
      if (habitHistory[dateStr]) {
        habits.forEach(habit => {
          if (habitHistory[dateStr][habit.id]) {
            completedHabits++;
          }
        });
      }
      
      const totalHabits = habits.length;
      const completionRate = totalHabits > 0 ? completedHabits / totalHabits : 0;
      
      days.push({
        date: new Date(currentDay),
        dateStr,
        day: currentDay.getDate(),
        isCurrentMonth,
        isToday,
        totalHabits,
        completedHabits,
        completionRate,
        intensity: Math.floor(completionRate * 5)
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate, habits, habitHistory]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      className="calendar-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Calendar Header */}
      <div className="calendar-header">
        <h2 className="calendar-title">
          <Calendar size={24} />
          Habit Calendar
        </h2>
        
        <div className="calendar-navigation">
          <button
            className="nav-button"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          
          <button
            className="nav-button"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="heatmap-legend">
        <span className="legend-text">
          Habit completion intensity
        </span>
        <div className="legend-scale">
          <span className="legend-label">Less</span>
          <div className="legend-dots">
            {[0, 1, 2, 3, 4, 5].map(level => (
              <div
                key={level}
                className="legend-dot"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: level === 0 ? '#e0e0e0' :
                    `rgba(76, 205, 196, ${level * 0.2})`
                }}
              />
            ))}
          </div>
          <span className="legend-label">More</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarData.map((day, index) => (
          <motion.div
            key={index}
            className={`calendar-day level-${day.intensity} ${
              !day.isCurrentMonth ? 'other-month' : ''
            } ${
              day.isToday ? 'today' : ''
            }`}
            onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
            whileHover={{ scale: day.isCurrentMonth ? 1.05 : 1 }}
            whileTap={{ scale: day.isCurrentMonth ? 0.95 : 1 }}
            style={{
              background: day.intensity === 0 ? '#f0f0f0' :
                `rgba(76, 205, 196, ${day.intensity * 0.2})`
            }}
          >
            {day.day}
          </motion.div>
        ))}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          className="day-detail-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="day-detail-header">
            <div className="day-detail-date">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <div className="habits-list">
            {habits.map(habit => {
              const dateStr = selectedDate.toISOString().split('T')[0];
              const completed = habitHistory[dateStr] && habitHistory[dateStr][habit.id];
              return (
                <div key={habit.id} className="habit-item">
                  <span className="habit-emoji">{habit.emoji}</span>
                  <span className="habit-name">{habit.name}</span>
                  <span className={`habit-status ${completed ? 'completed' : 'missed'}`}>
                    {completed ? 'Completed' : 'Missed'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Monthly Statistics */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-value">{habits.length}</span>
          <span className="stat-label">Active Habits</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {Math.round((calendarData.filter(d => d.isCurrentMonth && d.completionRate === 1).length / calendarData.filter(d => d.isCurrentMonth).length) * 100) || 0}%
          </span>
          <span className="stat-label">Perfect Days</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
