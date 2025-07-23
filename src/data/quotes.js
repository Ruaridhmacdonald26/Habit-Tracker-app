// Motivational quotes for the habit tracker app
export const motivationalQuotes = [
  {
    text: "The secret to getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "Your life does not get better by chance, it gets better by change.",
    author: "Jim Rohn"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    text: "Don't put off tomorrow what you can do today.",
    author: "Benjamin Franklin"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Unknown"
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "Today is the first day of the rest of your life.",
    author: "Charles Dederich"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown"
  },
  {
    text: "A goal without a plan is just a wish.",
    author: "Antoine de Saint-Exupéry"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  }
];

// Common habit emojis and their meanings
export const habitEmojis = [
  { emoji: "💧", label: "Water" },
  { emoji: "🧘", label: "Meditation" },
  { emoji: "🥦", label: "Healthy Eating" },
  { emoji: "📚", label: "Reading" },
  { emoji: "🏃", label: "Exercise" },
  { emoji: "💤", label: "Sleep" },
  { emoji: "🧠", label: "Learning" },
  { emoji: "✍️", label: "Writing" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🎨", label: "Creative" },
  { emoji: "🌱", label: "Growth" },
  { emoji: "💪", label: "Strength" },
  { emoji: "🌅", label: "Early Rise" },
  { emoji: "🧽", label: "Cleaning" },
  { emoji: "💰", label: "Finance" },
  { emoji: "👥", label: "Social" },
  { emoji: "🚫", label: "Avoid" },
  { emoji: "⭐", label: "Goal" },
  { emoji: "🎯", label: "Focus" },
  { emoji: "🌟", label: "Inspire" }
];

// Get a daily quote that changes once per day
export const getDailyQuote = () => {
  // Get current date in YYYY-MM-DD format to ensure it changes at midnight
  const today = new Date();
  const dateString = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');
  
  // Create a simple hash from the date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a valid array index
  const index = Math.abs(hash) % motivationalQuotes.length;
  return motivationalQuotes[index];
};
