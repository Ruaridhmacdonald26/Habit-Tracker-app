// App settings and preferences
export const defaultSettings = {
  theme: 'mint', // Theme color
  mode: 'light', // light or dark
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  },
  notifications: {
    enabled: false,
    reminderTime: '09:00',
    weeklyProgress: true,
    achievements: true
  },
  display: {
    showStreaks: true,
    showProgress: true,
    showQuotes: true,
    compactView: false
  },
  data: {
    autoBackup: false,
    syncCloud: false
  }
};

// Accessibility themes
export const accessibilityThemes = {
  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000',
      background: '#000000',
      text: '#FFFFFF',
      success: '#00FF00',
      warning: '#FFFF00',
      error: '#FF0000'
    }
  },
  largeText: {
    baseFontSize: '18px',
    scaleFactors: {
      h1: 1.8,
      h2: 1.6,
      h3: 1.4,
      body: 1.2,
      small: 1.1
    }
  }
};

// Dark mode color scheme
export const darkModeColors = {
  primary: '#4ECDC4',
  primaryLight: '#7EDDD6',
  primaryDark: '#2FB5AC',
  secondary: '#1A1A1A',
  secondaryLight: '#2D2D2D',
  secondaryDark: '#0D0D0D',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: 'rgba(76, 205, 196, 0.3)',
  gradient: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #0D0D0D 100%)',
  cardGradient: 'linear-gradient(145deg, rgba(30,30,30,0.8), rgba(20,20,20,0.8))',
  buttonGradient: 'linear-gradient(145deg, #4ECDC4, #2FB5AC)'
};

// Apply settings to the app
export const applySettings = (settings) => {
  const root = document.documentElement;
  
  // Apply theme first (this includes light/dark mode handling)
  if (settings.theme) {
    // Import and apply the theme using the existing theme system
    import('./themes.js').then(({ applyTheme }) => {
      applyTheme(settings.theme);
    });
  }
  
  // Override with dark mode if specified
  if (settings.mode === 'dark') {
    applyDarkMode();
  } else if (settings.mode === 'light') {
    applyLightMode();
  }
  
  // Apply accessibility settings
  if (settings.accessibility?.highContrast) {
    applyHighContrast();
  }
  
  if (settings.accessibility?.largeText) {
    applyLargeText();
  }
  
  if (settings.accessibility?.reducedMotion) {
    root.style.setProperty('--transition-fast', '0s');
    root.style.setProperty('--transition-normal', '0s');
    root.style.setProperty('--transition-slow', '0s');
  } else {
    // Reset transitions if not reduced motion
    root.style.setProperty('--transition-fast', '0.15s');
    root.style.setProperty('--transition-normal', '0.3s');
    root.style.setProperty('--transition-slow', '0.5s');
  }
};

const applyDarkMode = () => {
  const root = document.documentElement;
  Object.entries(darkModeColors).forEach(([key, value]) => {
    if (key === 'gradient' || key === 'cardGradient' || key === 'buttonGradient') {
      root.style.setProperty(`--gradient-${key.replace('Gradient', '')}`, value);
    } else {
      root.style.setProperty(`--color-${key}`, value);
    }
  });
  
  // Update body background
  document.body.style.background = darkModeColors.gradient;
};

const applyLightMode = () => {
  const root = document.documentElement;
  // Reset to original light mode colors
  root.style.removeProperty('--color-background');
  root.style.removeProperty('--color-surface');
  root.style.removeProperty('--color-text');
  // ... reset other properties
  document.body.style.background = 'var(--gradient-main)';
};

const applyHighContrast = () => {
  const root = document.documentElement;
  const colors = accessibilityThemes.highContrast.colors;
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

const applyLargeText = () => {
  const root = document.documentElement;
  const textTheme = accessibilityThemes.largeText;
  
  root.style.setProperty('--base-font-size', textTheme.baseFontSize);
  
  Object.entries(textTheme.scaleFactors).forEach(([element, scale]) => {
    root.style.setProperty(`--font-scale-${element}`, scale);
  });
};
