// Smart notification system
export const notificationTypes = [
  {
    id: 'daily_reminder',
    name: 'Daily Reminder',
    description: 'Remind me to complete my habits',
    defaultTime: '09:00',
    frequency: 'daily',
    icon: '⏰'
  },
  {
    id: 'streak_warning',
    name: 'Streak Warning',
    description: 'Alert when my streak is at risk',
    trigger: 'streak_danger',
    icon: '⚠️'
  },
  {
    id: 'achievement_unlock',
    name: 'Achievement Unlocked',
    description: 'Celebrate when I earn achievements',
    trigger: 'achievement',
    icon: '🏆'
  },
  {
    id: 'weekly_summary',
    name: 'Weekly Summary',
    description: 'Weekly progress report',
    frequency: 'weekly',
    day: 'sunday',
    time: '18:00',
    icon: '📊'
  },
  {
    id: 'motivation_boost',
    name: 'Motivation Boost',
    description: 'Encouraging messages during tough times',
    trigger: 'low_performance',
    icon: '💪'
  }
];

export const motivationalMessages = [
  "Small steps lead to big changes! 🌟",
  "Progress, not perfection! Keep going! 💪",
  "You're building something amazing, one day at a time! 🏗️",
  "Consistency is your superpower! ⚡",
  "Every habit completed is a victory! 🎉",
  "You're stronger than your excuses! 🦾",
  "The best time to start was yesterday. The second best time is now! ⏰",
  "Success is the sum of small efforts repeated day in and day out! 🔄",
  "You're not just building habits, you're building character! ⭐",
  "Don't break the chain! Your future self will thank you! 🔗"
];
