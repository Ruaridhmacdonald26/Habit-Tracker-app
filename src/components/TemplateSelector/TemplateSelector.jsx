import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  BookOpen,
  Target,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';
import { habitTemplates, atomicHabitsPrinciples, habitCategories } from '../../data/categories';
import './TemplateSelector.css';

const TemplateSelector = ({ onSelectTemplate, onClose }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPrinciples, setShowPrinciples] = useState(false);

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? habitTemplates 
    : habitTemplates.filter(template => template.category === selectedCategory);

  // Get unique categories from templates
  const categories = [...new Set(habitTemplates.map(t => t.category))];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose && onClose();
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '●';
      case 'Medium': return '●●';
      case 'Hard': return '●●●';
      default: return '●';
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return 'difficulty-easy';
    }
  };

  return (
    <motion.div
      className="template-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Template Header */}
      <div className="template-header">
        <h3 className="template-title">
          <Sparkles size={20} />
          Habit Templates
        </h3>
        <button
          className="toggle-templates"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          {showTemplates ? (
            <>
              <ChevronUp size={16} />
              Hide Templates
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Browse Templates
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Filter */}
            <div className="template-category-filter">
              <button
                className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Templates ({habitTemplates.length})
              </button>
              {categories.map(category => {
                const count = habitTemplates.filter(t => t.category === category).length;
                const categoryData = habitCategories[category];
                return (
                  <button
                    key={category}
                    className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {categoryData?.emoji} {categoryData?.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Templates Grid */}
            <div className="templates-grid">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="template-emoji">{template.emoji}</span>
                  <h4 className="template-name">{template.name}</h4>
                  <p className="template-description">{template.description}</p>
                  
                  <div className="template-meta">
                    <span className="template-category">
                      {habitCategories[template.category]?.name}
                    </span>
                    <span className={`template-difficulty ${getDifficultyClass(template.difficulty)}`}>
                      {getDifficultyIcon(template.difficulty)} {template.difficulty}
                    </span>
                  </div>

                  {template.tags && (
                    <div className="template-tags">
                      {template.tags.map(tag => (
                        <span key={tag} className="template-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Template Actions */}
            {selectedTemplate && (
              <motion.div
                className="template-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  className="template-action primary"
                  onClick={handleUseTemplate}
                >
                  <Play size={16} />
                  Use This Template
                </button>
                <button
                  className="template-action"
                  onClick={() => setShowPrinciples(!showPrinciples)}
                >
                  <BookOpen size={16} />
                  {showPrinciples ? 'Hide' : 'Show'} Atomic Habits Tips
                </button>
              </motion.div>
            )}

            {/* Atomic Habits Principles */}
            <AnimatePresence>
              {showPrinciples && (
                <motion.div
                  className="atomic-principles"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="principles-title">
                    <Target size={18} />
                    Atomic Habits Principles
                  </h4>
                  <div className="principles-list">
                    {atomicHabitsPrinciples && atomicHabitsPrinciples.length > 0 ? (
                      atomicHabitsPrinciples.map((principle, index) => (
                        <motion.div
                          key={principle.id}
                          className="principle-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="principle-icon">
                            {principle.law === '1st Law' ? <Zap size={16} /> :
                             principle.law === '2nd Law' ? <Award size={16} /> :
                             principle.law === '3rd Law' ? <Play size={16} /> :
                             <TrendingUp size={16} />}
                          </div>
                          <div className="principle-content">
                            <div className="principle-name">
                              {principle.law}: {principle.title}
                            </div>
                            <div className="principle-description">
                              {principle.description}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="no-principles">
                        <p>Loading atomic habits principles...</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateSelector;
