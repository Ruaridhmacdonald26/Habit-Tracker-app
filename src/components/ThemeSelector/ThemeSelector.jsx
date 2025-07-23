import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { themes, applyTheme } from '../../data/themes';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useLocalStorage('selectedTheme', 'mint');

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <motion.button
        className="theme-selector-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
      >
        <Palette size={20} />
        <span className="theme-btn-text">Themes</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="theme-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="theme-modal-header">
                <h3>Choose Your Theme</h3>
                <motion.button
                  className="theme-close-btn"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="theme-grid">
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    className={`theme-option ${currentTheme === key ? 'selected' : ''}`}
                    onClick={() => handleThemeChange(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: theme.colors.gradient
                    }}
                  >
                    <span className="theme-icon">{theme.icon}</span>
                    <span className="theme-name">{theme.name}</span>
                    {currentTheme === key && (
                      <motion.div
                        className="theme-selected-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeSelector;
