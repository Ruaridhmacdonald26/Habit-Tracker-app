// Theme configurations for the habit tracker app
export const themes = {
  mint: {
    name: 'Mint Green',
    icon: '🌿',
    colors: {
      primary: '#4ECDC4',
      primaryLight: '#7EDDD6',
      primaryDark: '#2FB5AC',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1A252F',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #4ECDC4, #44A08D)'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    icon: '🌊',
    colors: {
      primary: '#3498DB',
      primaryLight: '#5DADE2',
      primaryDark: '#2980B9',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1B2631',
      gradient: 'linear-gradient(135deg, #3498DB 0%, #2980B9 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #3498DB, #2980B9)'
    }
  },
  sunset: {
    name: 'Sunset Orange',
    icon: '🌅',
    colors: {
      primary: '#E67E22',
      primaryLight: '#F39C12',
      primaryDark: '#D35400',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1B2631',
      gradient: 'linear-gradient(135deg, #E67E22 0%, #D35400 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #E67E22, #D35400)'
    }
  },
  purple: {
    name: 'Purple Dream',
    icon: '💜',
    colors: {
      primary: '#8E44AD',
      primaryLight: '#A569BD',
      primaryDark: '#7D3C98',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1B2631',
      gradient: 'linear-gradient(135deg, #8E44AD 0%, #7D3C98 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #8E44AD, #7D3C98)'
    }
  },
  forest: {
    name: 'Forest Green',
    icon: '🌲',
    colors: {
      primary: '#27AE60',
      primaryLight: '#58D68D',
      primaryDark: '#229954',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1B2631',
      gradient: 'linear-gradient(135deg, #27AE60 0%, #229954 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #27AE60, #229954)'
    }
  },
  rose: {
    name: 'Rose Pink',
    icon: '🌹',
    colors: {
      primary: '#E91E63',
      primaryLight: '#F06292',
      primaryDark: '#C2185B',
      secondary: '#2C3E50',
      secondaryLight: '#34495E',
      secondaryDark: '#1B2631',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 50%, #2C3E50 100%)',
      cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      buttonGradient: 'linear-gradient(145deg, #E91E63, #C2185B)'
    }
  }
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
  root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-secondary-light', theme.colors.secondaryLight);
  root.style.setProperty('--color-secondary-dark', theme.colors.secondaryDark);
  root.style.setProperty('--gradient-main', theme.colors.gradient);
  root.style.setProperty('--gradient-card', theme.colors.cardGradient);
  root.style.setProperty('--gradient-button', theme.colors.buttonGradient);
  
  // Update shadow colors to match primary color
  const primaryColor = theme.colors.primary;
  const primaryRgb = hexToRgb(primaryColor);
  if (primaryRgb) {
    root.style.setProperty('--shadow-sm', `0 2px 4px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
    root.style.setProperty('--shadow-md', `0 4px 12px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`);
    root.style.setProperty('--shadow-lg', `0 8px 25px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`);
    root.style.setProperty('--color-border', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`);
  }
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
