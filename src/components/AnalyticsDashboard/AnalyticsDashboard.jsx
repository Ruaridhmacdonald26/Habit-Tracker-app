import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Target, Award, Clock, Zap, Brain } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const { habits, habitHistory, getHabitStreak, areAllHabitsCompletedToday } = useHabits();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [selectedMetric, setSelectedMetric] = useState('completion');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const today = new Date();
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    const data = {
      totalHabits: habits.length,
      activeStreaks: 0,
      longestStreak: 0,
      perfectDays: 0,
      completionRate: 0,
      weeklyTrend: 0,
      mostConsistent: null,
      leastConsistent: null,
      dailyData: [],
      habitPerformance: [],
      weekdayAnalysis: {},
      monthlyTrends: [],
      achievements: []
    };

    // Calculate daily data for the time range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let completed = 0;
      habits.forEach(habit => {
        if (habitHistory[dateStr] && habitHistory[dateStr][habit.id]) {
          completed++;
        }
      });

      const completionRate = habits.length > 0 ? (completed / habits.length) * 100 : 0;
      
      data.dailyData.push({
        date: dateStr,
        completedHabits: completed,
        totalHabits: habits.length,
        completionRate,
        isPerfectDay: completionRate === 100
      });

      if (completionRate === 100) {
        data.perfectDays++;
      }
    }

    // Calculate habit performance
    data.habitPerformance = habits.map(habit => {
      const streak = getHabitStreak(habit.id);
      let completedDays = 0;
      
      data.dailyData.forEach(day => {
        if (habitHistory[day.date] && habitHistory[day.date][habit.id]) {
          completedDays++;
        }
      });

      const performance = {
        habit,
        streak,
        completedDays,
        completionRate: (completedDays / data.dailyData.length) * 100,
        category: habit.category || 'General'
      };

      if (streak > 0) data.activeStreaks++;
      if (streak > data.longestStreak) data.longestStreak = streak;

      return performance;
    });

    // Find most and least consistent habits
    if (data.habitPerformance.length > 0) {
      data.mostConsistent = data.habitPerformance.reduce((prev, current) => 
        prev.completionRate > current.completionRate ? prev : current
      );
      data.leastConsistent = data.habitPerformance.reduce((prev, current) => 
        prev.completionRate < current.completionRate ? prev : current
      );
    }

    // Calculate overall completion rate
    const totalPossible = data.dailyData.length * habits.length;
    const totalCompleted = data.dailyData.reduce((sum, day) => sum + day.completedHabits, 0);
    data.completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    // Calculate weekly trend (last 7 days vs previous 7 days)
    if (data.dailyData.length >= 14) {
      const recentWeek = data.dailyData.slice(-7);
      const previousWeek = data.dailyData.slice(-14, -7);
      
      const recentAvg = recentWeek.reduce((sum, day) => sum + day.completionRate, 0) / 7;
      const previousAvg = previousWeek.reduce((sum, day) => sum + day.completionRate, 0) / 7;
      
      data.weeklyTrend = recentAvg - previousAvg;
    }

    // Weekday analysis
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekdays.forEach((day, index) => {
      const weekdayData = data.dailyData.filter(d => new Date(d.date).getDay() === index);
      data.weekdayAnalysis[day] = {
        averageCompletion: weekdayData.length > 0 
          ? weekdayData.reduce((sum, d) => sum + d.completionRate, 0) / weekdayData.length 
          : 0,
        totalDays: weekdayData.length
      };
    });

    return data;
  }, [habits, habitHistory, timeRange, getHabitStreak]);

  const getInsights = () => {
    try {
      const insights = [];

      // Ensure analyticsData exists before accessing properties
      if (!analyticsData) {
        return [{
          type: 'info',
          title: 'Getting Started',
          message: 'Track your habits for a few days to unlock personalized AI insights!',
          icon: Brain
        }];
      }

      // Add default insights for new users
      if (habits.length === 0) {
        return [{
          type: 'info',
          title: 'Welcome to HabitForge!',
          message: 'Add your first habit to start building better routines and unlock AI insights.',
          icon: Target
        }];
      }

      if (analyticsData.weeklyTrend && analyticsData.weeklyTrend > 5) {
        insights.push({
          type: 'positive',
          title: 'Great Progress!',
          message: `Your completion rate improved by ${analyticsData.weeklyTrend.toFixed(1)}% this week`,
          icon: TrendingUp
        });
      } else if (analyticsData.weeklyTrend && analyticsData.weeklyTrend < -5) {
        insights.push({
          type: 'warning',
          title: 'Dip in Performance',
          message: `Your completion rate dropped by ${Math.abs(analyticsData.weeklyTrend).toFixed(1)}% this week`,
          icon: TrendingUp
        });
      }

      if (analyticsData.longestStreak && analyticsData.longestStreak >= 7) {
        insights.push({
          type: 'positive',
          title: 'Streak Master!',
          message: `Your longest streak is ${analyticsData.longestStreak} days`,
          icon: Award
        });
      }

      if (analyticsData.weekdayAnalysis && Object.keys(analyticsData.weekdayAnalysis).length > 0) {
        const bestWeekday = Object.entries(analyticsData.weekdayAnalysis)
          .reduce((best, [day, data]) => data && data.averageCompletion > best.completion 
            ? { day, completion: data.averageCompletion } 
            : best, { day: '', completion: 0 });

        if (bestWeekday.completion > 80) {
          insights.push({
            type: 'info',
            title: 'Best Day Pattern',
            message: `${bestWeekday.day}s are your strongest days (${bestWeekday.completion.toFixed(1)}% completion)`,
            icon: Calendar
          });
        }
      }

      // Add encouraging insights for active users
      if (insights.length === 0 && habits.length > 0) {
        insights.push({
          type: 'info',
          title: 'Building Momentum',
          message: 'Keep tracking your habits consistently to unlock detailed performance insights!',
          icon: Zap
        });
      }

      // Add habit count insight
      if (habits.length >= 3) {
        insights.push({
          type: 'positive',
          title: 'Habit Champion',
          message: `You're tracking ${habits.length} habits! Consistency across multiple areas builds lasting change.`,
          icon: Target
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [{
        type: 'warning',
        title: 'Insights Temporarily Unavailable',
        message: 'AI insights are being updated. Please refresh the page to try again.',
        icon: Brain
      }];
    }
  };

  const insights = getInsights();

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <div className="header-content">
          <h2>
            <BarChart3 size={24} />
            Analytics Dashboard
          </h2>
          <p className="header-description">
            Advanced insights and trends for your habit journey
          </p>
        </div>

        <div className="time-range-selector">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <motion.div 
          className="metric-card primary"
          whileHover={{ y: -2 }}
        >
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {analyticsData.completionRate.toFixed(1)}%
            </div>
            <div className="metric-label">Overall Completion</div>
            <div className={`metric-trend ${analyticsData.weeklyTrend >= 0 ? 'positive' : 'negative'}`}>
              {analyticsData.weeklyTrend >= 0 ? '+' : ''}{analyticsData.weeklyTrend.toFixed(1)}% this week
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card"
          whileHover={{ y: -2 }}
        >
          <div className="metric-icon">
            <Zap size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.activeStreaks}</div>
            <div className="metric-label">Active Streaks</div>
            <div className="metric-sublabel">
              Longest: {analyticsData.longestStreak} days
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card"
          whileHover={{ y: -2 }}
        >
          <div className="metric-icon">
            <Award size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.perfectDays}</div>
            <div className="metric-label">Perfect Days</div>
            <div className="metric-sublabel">
              {((analyticsData.perfectDays / analyticsData.dailyData.length) * 100).toFixed(1)}% of days
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card"
          whileHover={{ y: -2 }}
        >
          <div className="metric-icon">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.totalHabits}</div>
            <div className="metric-label">Active Habits</div>
            <div className="metric-sublabel">
              Tracking consistently
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>
          <Brain size={20} />
          AI Insights
        </h3>
        <div className="insights-grid">
          {insights && insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={`insight-${index}`}
                className={`insight-card ${insight.type}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="insight-icon">
                  {insight.icon && <insight.icon size={18} />}
                </div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="insight-card info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="insight-icon">
                <Brain size={18} />
              </div>
              <div className="insight-content">
                <h4>AI Insights Loading</h4>
                <p>Keep using HabitForge to unlock personalized insights and recommendations!</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Habit Performance */}
      <div className="performance-section">
        <h3>Habit Performance</h3>
        <div className="habits-performance">
          {analyticsData.habitPerformance
            .sort((a, b) => b.completionRate - a.completionRate)
            .map((performance, index) => (
              <motion.div
                key={performance.habit.id}
                className="habit-performance-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="habit-info">
                  <span className="habit-emoji">{performance.habit.emoji}</span>
                  <div className="habit-details">
                    <div className="habit-name">{performance.habit.name}</div>
                    <div className="habit-category">{performance.category}</div>
                  </div>
                </div>

                <div className="performance-metrics">
                  <div className="performance-rate">
                    <div className="rate-value">
                      {performance.completionRate.toFixed(1)}%
                    </div>
                    <div className="rate-label">Completion</div>
                  </div>

                  <div className="performance-streak">
                    <div className="streak-value">{performance.streak}</div>
                    <div className="streak-label">Current Streak</div>
                  </div>

                  <div className="performance-days">
                    <div className="days-value">
                      {performance.completedDays}/{analyticsData.dailyData.length}
                    </div>
                    <div className="days-label">Days</div>
                  </div>
                </div>

                <div className="performance-bar">
                  <motion.div
                    className="performance-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${performance.completionRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Weekday Analysis */}
      <div className="weekday-section">
        <h3>Weekday Analysis</h3>
        <div className="weekday-chart">
          {Object.entries(analyticsData.weekdayAnalysis).map(([day, data]) => (
            <div key={day} className="weekday-bar">
              <div className="weekday-label">{day.slice(0, 3)}</div>
              <div className="weekday-bar-container">
                <motion.div
                  className="weekday-bar-fill"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.averageCompletion}%` }}
                  transition={{ duration: 0.8, delay: Object.keys(analyticsData.weekdayAnalysis).indexOf(day) * 0.1 }}
                />
              </div>
              <div className="weekday-percentage">
                {data.averageCompletion.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="trend-section">
        <h3>Completion Trend</h3>
        <div className="trend-chart">
          <svg viewBox="0 0 400 200" className="trend-svg">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.8"/>
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#grid)" />
            
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map(percent => {
              const y = 190 - (percent / 100) * 170;
              return (
                <g key={percent}>
                  <text x="5" y={y + 4} fontSize="10" fill="var(--text-secondary)" textAnchor="start">
                    {percent}%
                  </text>
                  <line x1="15" y1={y} x2="390" y2={y} stroke="#e2e8f0" strokeWidth="1" opacity="0.8" />
                </g>
              );
            })}

            {/* Area under curve */}
            <motion.path
              d={`M 20 190 ${analyticsData.dailyData.map((day, index) => {
                const x = (index / (analyticsData.dailyData.length - 1)) * 360 + 20;
                const y = 190 - (day.completionRate / 100) * 170;
                return `L ${x} ${y}`;
              }).join(' ')} L 380 190 Z`}
              fill="url(#gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.1"/>
              </linearGradient>
            </defs>

            {/* Data points */}
            {analyticsData.dailyData.map((day, index) => {
              const x = (index / (analyticsData.dailyData.length - 1)) * 360 + 20;
              const y = 190 - (day.completionRate / 100) * 170;
              
              return (
                <motion.g key={day.date}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--primary-color)"
                    stroke="white"
                    strokeWidth="2"
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 1, r: 4 }}
                    transition={{ delay: index * 0.02 }}
                    className="data-point"
                  >
                    <title>{`${day.date}: ${day.completionRate.toFixed(1)}%`}</title>
                  </motion.circle>
                  
                  {/* Hover effect */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="hover-circle"
                    whileHover={{ r: 12, opacity: 0.2, fill: "var(--primary-color)" }}
                  />
                </motion.g>
              );
            })}
            
            {/* Trend line */}
            <motion.polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={analyticsData.dailyData.map((day, index) => {
                const x = (index / (analyticsData.dailyData.length - 1)) * 360 + 20;
                const y = 190 - (day.completionRate / 100) * 170;
                return `${x},${y}`;
              }).join(' ')}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            />

            {/* X-axis labels */}
            {analyticsData.dailyData.filter((_, index) => index % Math.ceil(analyticsData.dailyData.length / 6) === 0).map((day, index, filtered) => {
              const originalIndex = analyticsData.dailyData.findIndex(d => d.date === day.date);
              const x = (originalIndex / (analyticsData.dailyData.length - 1)) * 360 + 20;
              return (
                <text 
                  key={day.date} 
                  x={x} 
                  y="205" 
                  fontSize="10" 
                  fill="var(--text-secondary)" 
                  textAnchor="middle"
                >
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Habit Performance Chart */}
      <div className="habit-chart-section">
        <h3>Habit Performance Comparison</h3>
        <div className="habit-performance-chart">
          <div className="chart-container">
            {analyticsData.habitPerformance.map((performance, index) => (
              <motion.div
                key={performance.habit.id}
                className="habit-bar-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="habit-bar-label">
                  <span className="habit-emoji">{performance.habit.emoji}</span>
                  <span className="habit-name-short">
                    {performance.habit.name.length > 8 
                      ? performance.habit.name.substring(0, 8) + '...' 
                      : performance.habit.name}
                  </span>
                </div>
                <div className="habit-bar-wrapper">
                  <motion.div
                    className="habit-bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${performance.completionRate}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{
                      backgroundColor: performance.completionRate >= 70 ? '#22c55e' : 
                                     performance.completionRate >= 40 ? '#f59e0b' : '#ef4444',
                      boxShadow: `0 2px 8px ${performance.completionRate >= 70 ? 'rgba(34, 197, 94, 0.3)' : 
                                                performance.completionRate >= 40 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    <div className="bar-value">{performance.completionRate.toFixed(0)}%</div>
                  </motion.div>
                </div>
                <div className="habit-streak">
                  🔥 {performance.streak}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress Heatmap */}
      <div className="heatmap-section">
        <h3>Weekly Progress Heatmap</h3>
        <div className="weekly-heatmap">
          {(() => {
            const weeks = [];
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
            
            for (let week = 0; week < 4; week++) {
              const weekData = [];
              for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + (week * 7) + day);
                const dateStr = date.toISOString().split('T')[0];
                
                const dayData = analyticsData.dailyData.find(d => d.date === dateStr);
                const intensity = dayData ? Math.floor((dayData.completionRate / 100) * 4) : 0;
                
                weekData.push({
                  date: dateStr,
                  intensity,
                  completionRate: dayData?.completionRate || 0,
                  dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
                });
              }
              weeks.push(weekData);
            }
            
            return (
              <div className="heatmap-grid">
                <div className="heatmap-days">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-label">{day}</div>
                  ))}
                </div>
                <div className="heatmap-weeks">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="heatmap-week">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={day.date}
                          className={`heatmap-cell intensity-${day.intensity}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (weekIndex * 7 + dayIndex) * 0.05 }}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          title={`${day.date}: ${day.completionRate.toFixed(1)}%`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          
          <div className="heatmap-legend">
            <span className="legend-label">Less</span>
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`legend-cell intensity-${level}`} />
            ))}
            <span className="legend-label">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
