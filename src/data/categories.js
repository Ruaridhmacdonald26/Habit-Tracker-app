// Categories for habit organization
export const habitCategories = {
  Health: {
    name: 'Health',
    icon: '🏥',
    color: '#27AE60',
    description: 'Physical and mental wellbeing habits'
  },
  Productivity: {
    name: 'Productivity',
    icon: '⚡',
    color: '#3498DB',
    description: 'Work and efficiency habits'
  },
  Learning: {
    name: 'Learning',
    icon: '📚',
    color: '#9B59B6',
    description: 'Education and skill development'
  },
  Social: {
    name: 'Social',
    icon: '👥',
    color: '#E67E22',
    description: 'Relationships and community'
  },
  Mindfulness: {
    name: 'Mindfulness',
    icon: '🧘',
    color: '#1ABC9C',
    description: 'Mental clarity and awareness'
  },
  Finance: {
    name: 'Finance',
    icon: '💰',
    color: '#F39C12',
    description: 'Money management and saving'
  },
  Creative: {
    name: 'Creative',
    icon: '🎨',
    color: '#E91E63',
    description: 'Art, music, and creative expression'
  },
  Habits: {
    name: 'Habits',
    icon: '🔄',
    color: '#34495E',
    description: 'Meta-habits and routine building'
  }
};

// Pre-made habit templates inspired by Atomic Habits principles
export const habitTemplates = [
  // Health Templates
  {
    id: 'drink-water',
    name: 'Drink 8 glasses of water',
    emoji: '💧',
    category: 'Health',
    difficulty: 'Easy',
    atomicPrinciple: 'Start small - just one glass at a time',
    cue: 'After I wake up',
    routine: 'I will drink one glass of water',
    reward: 'I will feel energized and hydrated',
    stackingTip: 'Stack with: After I brush my teeth → drink water'
  },
  {
    id: 'exercise-daily',
    name: 'Exercise for 30 minutes',
    emoji: '🏃',
    category: 'Health',
    difficulty: 'Medium',
    atomicPrinciple: 'Make it obvious - lay out workout clothes',
    cue: 'After I have my morning coffee',
    routine: 'I will exercise for 30 minutes',
    reward: 'I will feel accomplished and energized',
    stackingTip: 'Start with 5 minutes, then gradually increase'
  },
  {
    id: 'meditation',
    name: 'Meditate for 10 minutes',
    emoji: '🧘',
    category: 'Mindfulness',
    difficulty: 'Easy',
    atomicPrinciple: 'Start with just 2 minutes',
    cue: 'After I sit on my meditation cushion',
    routine: 'I will meditate for 10 minutes',
    reward: 'I will feel calm and centered',
    stackingTip: 'After I drink my morning water → meditate'
  },
  
  // Productivity Templates
  {
    id: 'read-daily',
    name: 'Read for 20 minutes',
    emoji: '📚',
    category: 'Learning',
    difficulty: 'Easy',
    atomicPrinciple: 'Make it attractive - choose books you enjoy',
    cue: 'After I eat lunch',
    routine: 'I will read for 20 minutes',
    reward: 'I will learn something new',
    stackingTip: 'Keep book visible on your desk'
  },
  {
    id: 'journal',
    name: 'Write in journal',
    emoji: '✍️',
    category: 'Mindfulness',
    difficulty: 'Easy',
    atomicPrinciple: 'Start with just 3 sentences',
    cue: 'Before I go to bed',
    routine: 'I will write in my journal',
    reward: 'I will reflect on my day',
    stackingTip: 'Keep journal by your bedside'
  },
  {
    id: 'learn-skill',
    name: 'Practice new skill for 30 minutes',
    emoji: '🎯',
    category: 'Learning',
    difficulty: 'Medium',
    atomicPrinciple: 'Break skill into smaller components',
    cue: 'After I finish dinner',
    routine: 'I will practice my skill for 30 minutes',
    reward: 'I will see improvement in my abilities',
    stackingTip: 'Set up practice materials in advance'
  },
  
  // Social Templates
  {
    id: 'call-family',
    name: 'Call a family member',
    emoji: '📞',
    category: 'Social',
    difficulty: 'Easy',
    atomicPrinciple: 'Make it satisfying - focus on connection',
    cue: 'After I finish work',
    routine: 'I will call a family member',
    reward: 'I will strengthen my relationships',
    stackingTip: 'Set specific days for specific people'
  },
  {
    id: 'gratitude',
    name: 'Write 3 things I\'m grateful for',
    emoji: '🙏',
    category: 'Mindfulness',
    difficulty: 'Easy',
    atomicPrinciple: 'Make it obvious - use a gratitude app',
    cue: 'After I wake up',
    routine: 'I will write 3 things I\'m grateful for',
    reward: 'I will start my day with positivity',
    stackingTip: 'After I drink water → write gratitude'
  },
  
  // Finance Templates
  {
    id: 'track-expenses',
    name: 'Track daily expenses',
    emoji: '💰',
    category: 'Finance',
    difficulty: 'Easy',
    atomicPrinciple: 'Make it easy - use a simple app',
    cue: 'After I make any purchase',
    routine: 'I will record the expense',
    reward: 'I will be aware of my spending',
    stackingTip: 'Use receipt as cue to log expense'
  },
  
  // Creative Templates
  {
    id: 'creative-time',
    name: 'Spend 30 minutes being creative',
    emoji: '🎨',
    category: 'Creative',
    difficulty: 'Medium',
    atomicPrinciple: 'Focus on the process, not the outcome',
    cue: 'After I clean up dinner',
    routine: 'I will spend 30 minutes being creative',
    reward: 'I will express myself and relax',
    stackingTip: 'Keep creative supplies easily accessible'
  },
  
  // Habit Stacking Templates
  {
    id: 'morning-routine',
    name: 'Complete morning routine',
    emoji: '🌅',
    category: 'Habits',
    difficulty: 'Medium',
    atomicPrinciple: 'Chain small habits together',
    cue: 'After I wake up',
    routine: 'Water → Gratitude → Exercise → Shower',
    reward: 'I will have an energized, productive day',
    stackingTip: 'The key is linking habits in a logical sequence'
  }
];

// Difficulty levels for habits
export const difficultyLevels = {
  Easy: {
    name: 'Easy',
    color: '#27AE60',
    points: 1,
    description: 'Simple habits that take minimal effort'
  },
  Medium: {
    name: 'Medium',
    color: '#F39C12',
    points: 2,
    description: 'Moderate habits requiring some commitment'
  },
  Hard: {
    name: 'Hard',
    color: '#E74C3C',
    points: 3,
    description: 'Challenging habits requiring significant effort'
  }
};

// Atomic Habits principles for reference
export const atomicHabitsPrinciples = [
  {
    id: 'obvious',
    law: '1st Law',
    title: "Make It Obvious",
    description: "Design your environment to make good habits obvious",
    strategies: [
      "Use implementation intentions (I will [BEHAVIOR] at [TIME] in [LOCATION])",
      "Use habit stacking (After I [CURRENT HABIT], I will [NEW HABIT])",
      "Design your environment for success"
    ]
  },
  {
    id: 'attractive',
    law: '2nd Law',
    title: "Make It Attractive",
    description: "Bundle habits with activities you enjoy",
    strategies: [
      "Use temptation bundling",
      "Join a culture where your desired behavior is normal",
      "Create a motivation ritual before difficult habits"
    ]
  },
  {
    id: 'easy',
    law: '3rd Law',
    title: "Make It Easy",
    description: "Reduce friction for good habits",
    strategies: [
      "Follow the 2-minute rule",
      "Decrease the steps between you and good habits",
      "Use the principle of least effort"
    ]
  },
  {
    id: 'satisfying',
    law: '4th Law',
    title: "Make It Satisfying",
    description: "Give yourself immediate rewards",
    strategies: [
      "Use reinforcement - give yourself immediate rewards",
      "Make doing nothing enjoyable",
      "Use a habit tracker for visual progress"
    ]
  }
];
