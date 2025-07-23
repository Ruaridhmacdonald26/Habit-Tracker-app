// Hook for managing app settings and preferences
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { defaultSettings, applySettings } from '../data/settings';
import { applyTheme } from '../data/themes';

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage('habitTracker_settings', defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Apply settings to DOM on load and changes
  useEffect(() => {
    if (settings.theme) {
      applyTheme(settings.theme);
    }
    applySettings(settings);
    setIsLoading(false);
  }, [settings]);

  // Update a specific setting
  const updateSetting = (category, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: value
      }
    }));
  };

  // Update top-level setting (theme, mode)
  const updateTopLevelSetting = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
    
    // Apply theme immediately when changed
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  // Toggle dark/light mode
  const toggleMode = () => {
    const newMode = settings.mode === 'light' ? 'dark' : 'light';
    updateTopLevelSetting('mode', newMode);
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Export settings for backup
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'habit-tracker-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import settings from file
  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          // Validate structure
          if (importedSettings && typeof importedSettings === 'object') {
            setSettings({ ...defaultSettings, ...importedSettings });
            resolve(true);
          } else {
            reject(new Error('Invalid settings file format'));
          }
        } catch (error) {
          reject(new Error('Error parsing settings file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  // Get accessibility status
  const getAccessibilityInfo = () => {
    const { accessibility } = settings;
    const activeFeatures = Object.entries(accessibility)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    
    return {
      hasAccessibilityFeatures: activeFeatures.length > 0,
      activeFeatures,
      recommendations: getAccessibilityRecommendations(accessibility)
    };
  };

  // Get accessibility recommendations
  const getAccessibilityRecommendations = (accessibility) => {
    const recommendations = [];
    
    if (!accessibility.highContrast) {
      recommendations.push({
        feature: 'highContrast',
        title: 'High Contrast Mode',
        description: 'Improves visibility with stronger color contrasts'
      });
    }
    
    if (!accessibility.largeText) {
      recommendations.push({
        feature: 'largeText',
        title: 'Large Text',
        description: 'Increases text size for better readability'
      });
    }
    
    if (!accessibility.reducedMotion) {
      recommendations.push({
        feature: 'reducedMotion',
        title: 'Reduced Motion',
        description: 'Minimizes animations that may cause discomfort'
      });
    }
    
    return recommendations;
  };

  return {
    settings,
    isLoading,
    updateSetting,
    updateTopLevelSetting,
    toggleMode,
    resetSettings,
    exportSettings,
    importSettings,
    getAccessibilityInfo,
    // Quick access to common settings
    isDarkMode: settings.mode === 'dark',
    currentTheme: settings.theme,
    hasHighContrast: settings.accessibility.highContrast,
    hasLargeText: settings.accessibility.largeText,
    hasReducedMotion: settings.accessibility.reducedMotion
  };
};
