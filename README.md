# 🎯 HabitForge - Modern React Habit Tracking App

A responsive habit tracker built with React, Vite, and modern web technologies. Track your daily habits, celebrate your progress, and build lasting positive routines.

![Habit Tracker Preview](https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=HabitTracker+App)

## ✨ Features

### 🚀 Core Functionality
- **Add & Edit Habits**: Create custom habits with emojis and colors
- **Daily Tracking**: Mark habits complete with satisfying checkboxes
- **Progress Visualization**: Beautiful progress bars and completion rates
- **Streak Counters**: Track your consistency with streak indicators
- **LocalStorage Persistence**: Your data is saved automatically

### 🎨 Modern UI/UX
- **Mobile-First Design**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Gradient Theme**: Mint green to charcoal gray color scheme
- **Glass Morphism**: Modern backdrop blur effects
- **Touch-Friendly**: Optimized for mobile interactions

### 🎉 Motivational Elements
- **Daily Quotes**: Inspirational quotes that change each day
- **Confetti Celebration**: Animated celebration when all habits are complete
- **Visual Feedback**: Immediate feedback for completed actions
- **Progress Insights**: Encouraging messages based on completion rate

### 🛠 Technical Features
- **React 18**: Latest React with functional components and hooks
- **Vite**: Lightning-fast development and building
- **Framer Motion**: Smooth animations and transitions
- **Custom Hooks**: Reusable logic for habits and localStorage
- **CSS Variables**: Consistent theming system
- **Modern JavaScript**: ES6+ features and clean code

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📱 Usage

### Adding Your First Habit
1. Click the "Add Habit" button or the floating action button (mobile)
2. Enter a habit name (e.g., "Drink 8 glasses of water")
3. Choose an emoji that represents your habit
4. Select a color theme
5. Click "Create Habit"

### Tracking Daily Progress
- Click the checkbox next to any habit to mark it complete
- Watch your streak counter increase as you maintain consistency
- Monitor your weekly completion rate in the progress bar

### Celebrating Success
- Complete all habits in a day to trigger the confetti celebration
- Enjoy motivational quotes that change daily
- Track your overall progress with the daily overview

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ConfettiCelebration/
│   ├── DailyQuote/
│   ├── HabitCard/
│   ├── HabitForm/
│   └── ProgressBar/
├── data/                # Static data and utilities
│   └── quotes.js        # Motivational quotes and emojis
├── hooks/               # Custom React hooks
│   ├── useHabits.js     # Habit management logic
│   └── useLocalStorage.js # LocalStorage utilities
├── App.jsx              # Main application component
├── App.css              # Application styles
├── index.css            # Global styles and CSS variables
└── main.jsx             # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Mint Green (#4ECDC4)
- **Secondary**: Charcoal Gray (#2C3E50)
- **Accents**: Various complementary colors for habit customization

### Typography
- **Primary Font**: Poppins (headings, UI elements)
- **Secondary Font**: Quicksand (body text, quotes)

### Spacing System
- Uses CSS custom properties for consistent spacing
- 8px base unit scaling system

## 📦 Dependencies

### Core Dependencies
- **React** (^18.3.1): UI library
- **Framer Motion** (^11.11.17): Animation library
- **React Confetti** (^6.1.0): Celebration effects
- **Lucide React** (^0.456.0): Modern icon library

### Development Dependencies
- **Vite** (^6.0.1): Build tool
- **ESLint**: Code linting
- **@vitejs/plugin-react**: React plugin for Vite

## 🔧 Customization

### Adding New Quotes
Edit `src/data/quotes.js` to add more motivational quotes:

```javascript
export const motivationalQuotes = [
  // Add your quotes here
  {
    text: "Your custom quote here",
    author: "Author Name"
  }
];
```

### Modifying Colors
Update the CSS custom properties in `src/index.css`:

```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... other variables */
}
```

### Adding New Habit Emojis
Extend the `habitEmojis` array in `src/data/quotes.js`:

```javascript
export const habitEmojis = [
  // Add new emoji options
  { emoji: "🎯", label: "Goal" },
  // ... more emojis
];
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern habit tracking apps
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Animation library by [Framer Motion](https://www.framer.com/motion/)

---

**Built using React + Vite**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
