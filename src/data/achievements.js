// Gamification and achievement system
export const achievements = [
  {
    id: 'first_habit',
    name: 'First Step',
    description: 'Create your first habit',
    emoji: '👶',
    type: 'milestone',
    requirement: { habits_created: 1 },
    points: 10
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Complete all habits for 7 days straight',
    emoji: '⚔️',
    type: 'streak',
    requirement: { perfect_days: 7 },
    points: 50
  },
  {
    id: 'habit_master',
    name: 'Habit Master',
    description: 'Maintain 5 active habits',
    emoji: '🎯',
    type: 'collection',
    requirement: { active_habits: 5 },
    points: 25
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Achieve 80% completion rate for a month',
    emoji: '👑',
    type: 'performance',
    requirement: { monthly_completion: 80 },
    points: 100
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete all habits before 9 AM for 3 days',
    emoji: '🐦',
    type: 'timing',
    requirement: { early_completions: 3 },
    points: 30
  },
  {
    id: 'comeback_hero',
    name: 'Comeback Hero',
    description: 'Return after missing 3+ days',
    emoji: '💪',
    type: 'resilience',
    requirement: { comeback_after: 3 },
    points: 40
  }
];

export const levels = [
  { level: 1, name: 'Beginner', minPoints: 0, color: '#95a5a6' },
  { level: 2, name: 'Starter', minPoints: 50, color: '#3498db' },
  { level: 3, name: 'Committed', minPoints: 150, color: '#2ecc71' },
  { level: 4, name: 'Dedicated', minPoints: 300, color: '#f39c12' },
  { level: 5, name: 'Expert', minPoints: 500, color: '#e74c3c' },
  { level: 6, name: 'Master', minPoints: 750, color: '#9b59b6' },
  { level: 7, name: 'Legend', minPoints: 1000, color: '#1abc9c' }
];

export const streakMilestones = [
  { days: 3, name: 'Getting Started', emoji: '🌱' },
  { days: 7, name: 'One Week', emoji: '📅' },
  { days: 14, name: 'Two Weeks', emoji: '🔥' },
  { days: 21, name: 'Habit Forming', emoji: '⚡' },
  { days: 30, name: 'One Month', emoji: '🏆' },
  { days: 66, name: 'Habit Scientist', emoji: '🧬' },
  { days: 100, name: 'Century Club', emoji: '💯' },
  { days: 365, name: 'Year Master', emoji: '👑' }
];
