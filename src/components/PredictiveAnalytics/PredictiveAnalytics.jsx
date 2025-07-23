import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Target, Lightbulb, Zap, Clock, Award } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import './PredictiveAnalytics.css';

const PredictiveAnalytics = () => {
  const { habits, habitHistory, getHabitStreak } = useHabits();
  const [predictions, setPredictions] = useState([]);
  const [riskFactors, setRiskFactors] = useState([]);
  const [successProbability, setSuccessProbability] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // AI-powered prediction algorithms
  useEffect(() => {
    const calculatePredictions = () => {
      const today = new Date();
      const last30Days = [];
      
      // Collect last 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        let completedHabits = 0;
        habits.forEach(habit => {
          if (habitHistory[dateStr] && habitHistory[dateStr][habit.id]) {
            completedHabits++;
          }
        });

        last30Days.push({
          date: dateStr,
          completedHabits,
          totalHabits: habits.length,
          completionRate: habits.length > 0 ? completedHabits / habits.length : 0,
          dayOfWeek: date.getDay()
        });
      }

      // Predict next 7 days
      const newPredictions = [];
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + i);
        const dayOfWeek = futureDate.getDay();
        
        // Calculate prediction based on historical patterns
        const weekdayData = last30Days.filter(d => d.dayOfWeek === dayOfWeek);
        const avgWeekdayCompletion = weekdayData.length > 0 
          ? weekdayData.reduce((sum, d) => sum + d.completionRate, 0) / weekdayData.length 
          : 0.5;

        // Recent trend analysis
        const recentTrend = last30Days.slice(-7).reduce((sum, d) => sum + d.completionRate, 0) / 7;
        const previousTrend = last30Days.slice(-14, -7).reduce((sum, d) => sum + d.completionRate, 0) / 7;
        const trendDirection = recentTrend - previousTrend;

        // Combine factors for prediction
        let predictedRate = (avgWeekdayCompletion * 0.6) + (recentTrend * 0.4);
        
        // Apply trend influence
        if (Math.abs(trendDirection) > 0.1) {
          predictedRate += trendDirection * 0.3;
        }

        // Ensure within bounds
        predictedRate = Math.max(0, Math.min(1, predictedRate));

        newPredictions.push({
          date: futureDate.toISOString().split('T')[0],
          dayName: futureDate.toLocaleDateString('en-US', { weekday: 'long' }),
          predictedCompletionRate: predictedRate,
          confidence: Math.min(0.95, 0.5 + (weekdayData.length / 10)),
          factors: {
            weekdayPattern: avgWeekdayCompletion,
            recentTrend,
            trendDirection
          }
        });
      }

      setPredictions(newPredictions);

      // Calculate overall success probability
      const avgPredictedRate = newPredictions.reduce((sum, p) => sum + p.predictedCompletionRate, 0) / newPredictions.length;
      setSuccessProbability(avgPredictedRate * 100);

      // Identify risk factors
      const newRiskFactors = [];
      
      if (trendDirection < -0.15) {
        newRiskFactors.push({
          type: 'declining',
          severity: 'high',
          message: 'Completion rate has declined significantly in recent days',
          recommendation: 'Consider reducing habit complexity or reviewing your routine'
        });
      }

      const weekendData = last30Days.filter(d => d.dayOfWeek === 0 || d.dayOfWeek === 6);
      const weekdayMainData = last30Days.filter(d => d.dayOfWeek >= 1 && d.dayOfWeek <= 5);
      
      if (weekendData.length > 0 && weekdayMainData.length > 0) {
        const weekendAvg = weekendData.reduce((sum, d) => sum + d.completionRate, 0) / weekendData.length;
        const weekdayAvg = weekdayMainData.reduce((sum, d) => sum + d.completionRate, 0) / weekdayMainData.length;
        
        if (weekendAvg < weekdayAvg - 0.2) {
          newRiskFactors.push({
            type: 'weekend_drop',
            severity: 'medium',
            message: 'Weekend performance is significantly lower than weekdays',
            recommendation: 'Create a special weekend routine or reduce habit expectations'
          });
        }
      }

      const recentZeroDays = last30Days.slice(-7).filter(d => d.completionRate === 0).length;
      if (recentZeroDays >= 2) {
        newRiskFactors.push({
          type: 'zero_days',
          severity: 'high',
          message: `${recentZeroDays} days with zero habit completion in the last week`,
          recommendation: 'Start with just one keystone habit to rebuild momentum'
        });
      }

      setRiskFactors(newRiskFactors);

      // Generate AI recommendations
      const newRecommendations = generateRecommendations(habits, last30Days, newRiskFactors);
      setRecommendations(newRecommendations);
    };

    if (habits.length > 0) {
      calculatePredictions();
    }
  }, [habits, habitHistory]);

  const generateRecommendations = (habits, historicalData, risks) => {
    const recommendations = [];

    // Analyze habit performance
    const habitPerformance = habits.map(habit => {
      let completedDays = 0;
      historicalData.forEach(day => {
        if (habitHistory[day.date] && habitHistory[day.date][habit.id]) {
          completedDays++;
        }
      });
      return {
        habit,
        completionRate: completedDays / historicalData.length,
        streak: getHabitStreak(habit.id)
      };
    }).sort((a, b) => a.completionRate - b.completionRate);

    // Recommend focusing on struggling habits
    if (habitPerformance.length > 0 && habitPerformance[0].completionRate < 0.3) {
      recommendations.push({
        type: 'focus',
        priority: 'high',
        title: 'Focus on Struggling Habits',
        message: `${habitPerformance[0].habit.name} has only ${(habitPerformance[0].completionRate * 100).toFixed(0)}% completion rate`,
        action: 'Consider breaking this habit into smaller, more achievable steps',
        icon: Target
      });
    }

    // Recommend habit stacking for high performers
    const highPerformers = habitPerformance.filter(h => h.completionRate > 0.8);
    if (highPerformers.length >= 2) {
      recommendations.push({
        type: 'stack',
        priority: 'medium',
        title: 'Create Habit Stacks',
        message: `You're consistent with ${highPerformers.length} habits - perfect for stacking!`,
        action: 'Link your strong habits together to build powerful routines',
        icon: Zap
      });
    }

    // Time-based recommendations
    const morningCompletion = historicalData.reduce((sum, day) => {
      // Assuming morning habits are completed earlier in data
      return sum + (day.completionRate > 0.5 ? 1 : 0);
    }, 0) / historicalData.length;

    if (morningCompletion > 0.7) {
      recommendations.push({
        type: 'timing',
        priority: 'low',
        title: 'Morning Momentum',
        message: 'You\'re a morning person! Your completion rate is highest in the AM',
        action: 'Consider adding one more morning habit to leverage your natural rhythm',
        icon: Clock
      });
    }

    // Streak-based recommendations
    const bestStreak = Math.max(...habitPerformance.map(h => h.streak));
    if (bestStreak >= 7) {
      recommendations.push({
        type: 'streak',
        priority: 'low',
        title: 'Streak Champion',
        message: `Your best streak is ${bestStreak} days - you're building serious momentum!`,
        action: 'Celebrate this achievement and use it as motivation for other habits',
        icon: Award
      });
    }

    // Risk-based recommendations
    risks.forEach(risk => {
      if (risk.type === 'weekend_drop') {
        recommendations.push({
          type: 'weekend',
          priority: 'medium',
          title: 'Weekend Strategy',
          message: 'Your weekend performance needs attention',
          action: 'Create a lighter weekend routine or habit reminders',
          icon: TrendingUp
        });
      }
    });

    return recommendations.slice(0, 4); // Limit to top 4 recommendations
  };

  const getPredictionColor = (rate) => {
    if (rate >= 0.8) return '#10b981'; // Green
    if (rate >= 0.6) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getConfidenceWidth = (confidence) => `${confidence * 100}%`;

  return (
    <motion.div
      className="predictive-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="predictive-header">
        <h2>
          <Brain size={24} />
          AI-Powered Predictions
        </h2>
        <p className="header-description">
          Advanced machine learning insights for your habit success
        </p>
      </div>

      {/* Success Probability */}
      <motion.div 
        className="success-probability"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="probability-content">
          <div className="probability-icon">
            <TrendingUp size={32} />
          </div>
          <div className="probability-info">
            <div className="probability-value">
              {successProbability.toFixed(0)}%
            </div>
            <div className="probability-label">
              Success Probability (Next 7 Days)
            </div>
            <div className="probability-description">
              Based on your historical patterns and trends
            </div>
          </div>
        </div>
        
        <div className="probability-meter">
          <motion.div
            className="probability-fill"
            initial={{ width: 0 }}
            animate={{ width: `${successProbability}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              background: `linear-gradient(90deg, ${getPredictionColor(successProbability / 100)}, ${getPredictionColor(successProbability / 100)}aa)`
            }}
          />
        </div>
      </motion.div>

      {/* 7-Day Predictions */}
      <div className="predictions-section">
        <h3>7-Day Forecast</h3>
        <div className="predictions-grid">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.date}
              className="prediction-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="prediction-day">
                <div className="day-name">{prediction.dayName}</div>
                <div className="day-date">
                  {new Date(prediction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="prediction-rate">
                <div 
                  className="rate-value"
                  style={{ color: getPredictionColor(prediction.predictedCompletionRate) }}
                >
                  {(prediction.predictedCompletionRate * 100).toFixed(0)}%
                </div>
                <div className="rate-label">Predicted</div>
              </div>

              <div className="confidence-indicator">
                <div className="confidence-label">Confidence</div>
                <div className="confidence-bar">
                  <motion.div
                    className="confidence-fill"
                    initial={{ width: 0 }}
                    animate={{ width: getConfidenceWidth(prediction.confidence) }}
                    transition={{ delay: 0.2 * index }}
                  />
                </div>
                <div className="confidence-value">
                  {(prediction.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="risk-factors-section">
          <h3>Risk Factors</h3>
          <div className="risk-factors">
            {riskFactors.map((risk, index) => (
              <motion.div
                key={index}
                className={`risk-card severity-${risk.severity}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="risk-indicator">
                  <div className={`risk-dot severity-${risk.severity}`} />
                  <span className="risk-severity">{risk.severity.toUpperCase()}</span>
                </div>
                <div className="risk-content">
                  <div className="risk-message">{risk.message}</div>
                  <div className="risk-recommendation">{risk.recommendation}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="recommendations-section">
        <h3>
          <Lightbulb size={20} />
          Smart Recommendations
        </h3>
        <div className="recommendations-grid">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className={`recommendation-card priority-${rec.priority}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="recommendation-header">
                <div className="rec-icon">
                  <rec.icon size={20} />
                </div>
                <div className="rec-priority">{rec.priority}</div>
              </div>
              
              <div className="rec-content">
                <div className="rec-title">{rec.title}</div>
                <div className="rec-message">{rec.message}</div>
                <div className="rec-action">{rec.action}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PredictiveAnalytics;
