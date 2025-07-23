import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Moon, 
  Sun, 
  Eye, 
  Type, 
  Zap, 
  Bell, 
  Download, 
  Upload, 
  RotateCcw,
  Palette,
  Accessibility,
  Settings as SettingsIcon,
  Monitor
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { themes } from '../../data/themes';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSetting,
    updateTopLevelSetting,
    toggleMode,
    resetSettings,
    exportSettings,
    importSettings,
    getAccessibilityInfo,
    isDarkMode,
    currentTheme
  } = useSettings();

  const accessibilityInfo = getAccessibilityInfo();

  const handleToggleSetting = (category, key) => {
    updateSetting(category, key, !settings[category][key]);
  };

  const handleThemeChange = (themeKey) => {
    updateTopLevelSetting('theme', themeKey);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importSettings(file)
        .then(() => {
          alert('Settings imported successfully!');
        })
        .catch((error) => {
          alert(`Error importing settings: ${error.message}`);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="settings-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="settings-content"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="settings-header">
            <h2 className="settings-title">
              <SettingsIcon size={24} />
              Settings & Preferences
            </h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Appearance Section */}
          <div className="settings-section">
            <div className="section-title">
              <Palette size={20} />
              Appearance
            </div>
            <p className="section-description">
              Customize the look and feel of your habit tracker
            </p>

            {/* Dark/Light Mode */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Display Mode</div>
                <div className="setting-description">
                  Choose between light and dark themes
                </div>
              </div>
              <div className="setting-control">
                <div className="mode-toggle">
                  <button
                    className={`mode-option ${!isDarkMode ? 'active' : ''}`}
                    onClick={() => !isDarkMode || toggleMode()}
                  >
                    <Sun size={16} />
                    Light
                  </button>
                  <button
                    className={`mode-option ${isDarkMode ? 'active' : ''}`}
                    onClick={() => isDarkMode || toggleMode()}
                  >
                    <Moon size={16} />
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Color Theme</div>
                <div className="setting-description">
                  Select your preferred color scheme
                </div>
              </div>
            </div>
            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`theme-preview ${currentTheme === key ? 'active' : ''}`}
                  style={{ background: theme.gradient }}
                  onClick={() => handleThemeChange(key)}
                >
                  <div className="theme-name">{theme.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="settings-section">
            <div className="section-title">
              <Accessibility size={20} />
              Accessibility
            </div>
            <p className="section-description">
              Features to improve usability and comfort
            </p>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">High Contrast Mode</div>
                <div className="setting-description">
                  Increases contrast for better visibility
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.accessibility.highContrast ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('accessibility', 'highContrast')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Large Text</div>
                <div className="setting-description">
                  Increases text size for better readability
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.accessibility.largeText ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('accessibility', 'largeText')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Reduced Motion</div>
                <div className="setting-description">
                  Minimizes animations that may cause discomfort
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.accessibility.reducedMotion ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('accessibility', 'reducedMotion')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Screen Reader Support</div>
                <div className="setting-description">
                  Enhanced compatibility with screen readers
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.accessibility.screenReader ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('accessibility', 'screenReader')}
                >
                </div>
              </div>
            </div>

            {/* Accessibility Recommendations */}
            {accessibilityInfo.recommendations.length > 0 && (
              <div className="accessibility-recommendations">
                <h4>💡 Recommended Features</h4>
                {accessibilityInfo.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <Eye className="recommendation-icon" size={16} />
                    <div className="recommendation-text">
                      <div className="recommendation-title">{rec.title}</div>
                      <div className="recommendation-description">{rec.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display Options */}
          <div className="settings-section">
            <div className="section-title">
              <Monitor size={20} />
              Display Options
            </div>
            <p className="section-description">
              Control what information is shown in your habit tracker
            </p>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Show Streak Counters</div>
                <div className="setting-description">
                  Display current habit streaks
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.display.showStreaks ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('display', 'showStreaks')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Show Progress Bars</div>
                <div className="setting-description">
                  Display visual progress indicators
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.display.showProgress ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('display', 'showProgress')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Show Daily Quotes</div>
                <div className="setting-description">
                  Display motivational quotes
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.display.showQuotes ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('display', 'showQuotes')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Compact View</div>
                <div className="setting-description">
                  Use a more condensed layout
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.display.compactView ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('display', 'compactView')}
                >
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <div className="section-title">
              <Bell size={20} />
              Notifications
            </div>
            <p className="section-description">
              Manage reminders and alerts
            </p>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Enable Notifications</div>
                <div className="setting-description">
                  Allow the app to send notifications
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.notifications.enabled ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('notifications', 'enabled')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Daily Reminder Time</div>
                <div className="setting-description">
                  When to remind you about your habits
                </div>
              </div>
              <div className="setting-control">
                <input
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) => updateSetting('notifications', 'reminderTime', e.target.value)}
                  className="settings-select"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Weekly Progress Report</div>
                <div className="setting-description">
                  Get weekly summaries of your progress
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.notifications.weeklyProgress ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('notifications', 'weeklyProgress')}
                >
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Achievement Notifications</div>
                <div className="setting-description">
                  Celebrate when you reach milestones
                </div>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${settings.notifications.achievements ? 'active' : ''}`}
                  onClick={() => handleToggleSetting('notifications', 'achievements')}
                >
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="settings-section">
            <div className="section-title">
              <Download size={20} />
              Data Management
            </div>
            <p className="section-description">
              Export, import, and manage your settings
            </p>

            <div className="settings-actions">
              <button
                className="action-button"
                onClick={exportSettings}
              >
                <Download size={16} />
                Export Settings
              </button>
              
              <label className="action-button">
                <Upload size={16} />
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  style={{ display: 'none' }}
                />
              </label>
              
              <button
                className="action-button danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
                    resetSettings();
                  }
                }}
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Settings;
