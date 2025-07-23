// Advanced analytics and insights
export const analyticsMetrics = [
  {
    id: 'completion_rate',
    name: 'Completion Rate',
    description: 'Overall percentage of habits completed',
    format: 'percentage',
    timeframes: ['daily', 'weekly', 'monthly', 'yearly']
  },
  {
    id: 'streak_analysis',
    name: 'Streak Analysis',
    description: 'Current and best streaks for each habit',
    format: 'days',
    breakdown: 'per_habit'
  },
  {
    id: 'productivity_score',
    name: 'Productivity Score',
    description: 'Weighted score based on habit difficulty and completion',
    format: 'score',
    calculation: 'weighted'
  },
  {
    id: 'consistency_index',
    name: 'Consistency Index',
    description: 'How consistent you are across different days of the week',
    format: 'score',
    breakdown: 'by_weekday'
  },
  {
    id: 'habit_momentum',
    name: 'Habit Momentum',
    description: 'Trending direction of your habit performance',
    format: 'trend',
    timeframe: 'last_30_days'
  }
];

export const insightGenerators = [
  {
    type: 'best_day',
    template: "Your best day of the week is {day} with {percentage}% completion rate!"
  },
  {
    type: 'improvement_opportunity',
    template: "You could improve {habit_name} - you've completed it {percentage}% of the time."
  },
  {
    type: 'streak_celebration',
    template: "Amazing! You're on a {days}-day streak with {habit_name}! 🔥"
  },
  {
    type: 'comeback_motivation',
    template: "Welcome back! Ready to restart your {habit_name} journey?"
  },
  {
    type: 'category_strength',
    template: "You're strongest in {category} habits with {percentage}% completion!"
  }
];
