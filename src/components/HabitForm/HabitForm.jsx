import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { habitEmojis } from '../../data/quotes';
import { habitCategories } from '../../data/categories';
import TemplateSelector from '../TemplateSelector/TemplateSelector';
import './HabitForm.css';

const HabitForm = ({ isOpen, onClose, onSave, editingHabit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '⭐',
    color: '#4ECDC4',
    category: 'Health',
    difficulty: 'Medium',
    stackedAfter: null,
    isTemplate: false
  });

  const colors = [
    // Blues
    '#3498DB', '#2980B9', '#1ABC9C', '#16A085', '#5DADE2', '#2E86C1',
    '#85C1E9', '#5499C7', '#2874A6', '#1B4F72', '#AED6F1', '#7FB3D3',
    
    // Greens
    '#27AE60', '#229954', '#2ECC71', '#28B463', '#58D68D', '#52C41A',
    '#A9DFBF', '#82E0AA', '#52BE80', '#239B56', '#1E8449', '#148F77',
    
    // Reds/Pinks
    '#E74C3C', '#C0392B', '#E91E63', '#AD1457', '#F1948A', '#EC7063',
    '#FF6B6B', '#FF5722', '#F44336', '#D32F2F', '#E57373', '#F06292',
    
    // Yellows/Oranges
    '#F39C12', '#E67E22', '#D68910', '#FF9800', '#FFA726', '#FFB74D',
    '#F7DC6F', '#F8C471', '#F4D03F', '#F1C40F', '#FF8A65', '#FFAB40',
    
    // Purples
    '#9B59B6', '#8E44AD', '#AF7AC5', '#BB8FCE', '#D7BDE2', '#6A1B9A',
    '#AB47BC', '#8E24AA', '#7B1FA2', '#4A148C', '#CE93D8', '#BA68C8',
    
    // Grays/Neutrals
    '#95A5A6', '#7F8C8D', '#BDC3C7', '#ECF0F1', '#34495E', '#2C3E50',
    '#5D6D7E', '#85929E', '#AEB6BF', '#D5DBDB', '#E5E7E9', '#F8F9FA',
    
    // Teals/Cyans
    '#1ABC9C', '#16A085', '#48CAE4', '#00B4D8', '#0077B6', '#023E8A',
    '#4ECDC4', '#45B7D1', '#17A2B8', '#138496', '#20C997', '#6F42C1',
    
    // Browns/Earth tones
    '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#795548', '#6D4C41',
    '#5D4037', '#4E342E', '#3E2723', '#EFEBE9', '#D3C7B8', '#A0845C'
  ];

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name,
        emoji: editingHabit.emoji,
        color: editingHabit.color || '#4ECDC4',
        category: editingHabit.category || 'Health',
        difficulty: editingHabit.difficulty || 'Medium',
        stackedAfter: editingHabit.stackedAfter || null,
        isTemplate: editingHabit.isTemplate || false
      });
    } else {
      setFormData({
        name: '',
        emoji: '⭐',
        color: '#4ECDC4',
        category: 'Health',
        difficulty: 'Medium',
        stackedAfter: null,
        isTemplate: false
      });
    }
  }, [editingHabit, isOpen]);

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      name: template.name,
      emoji: template.emoji,
      category: template.category,
      difficulty: template.difficulty,
      isTemplate: false // Convert template to regular habit
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      onClose();
    }
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="habit-form-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingHabit ? 'Edit Habit' : 'Create New Habit'}</h2>
              <motion.button
                className="close-btn"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="habit-form">
              {/* Template Selector - Only show when creating new habit */}
              {!editingHabit && (
                <TemplateSelector 
                  onSelectTemplate={handleTemplateSelect}
                />
              )}

              <div className="form-group">
                <label htmlFor="habit-name">Habit Name</label>
                <input
                  id="habit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Drink 8 glasses of water"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Choose an Emoji</label>
                <div className="emoji-grid">
                  {habitEmojis.map((item, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      className={`emoji-btn ${formData.emoji === item.emoji ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, emoji: item.emoji }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={item.label}
                    >
                      {item.emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div className="form-group">
                <label htmlFor="habit-category">Category</label>
                <select
                  id="habit-category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  {Object.entries(habitCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.emoji} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selection */}
              <div className="form-group">
                <label htmlFor="habit-difficulty">Difficulty Level</label>
                <select
                  id="habit-difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="form-select"
                >
                  <option value="Easy">● Easy - Simple daily action</option>
                  <option value="Medium">●● Medium - Moderate effort required</option>
                  <option value="Hard">●●● Hard - Significant commitment</option>
                </select>
              </div>

              <div className="form-actions">
                <motion.button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="save-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.name.trim()}
                >
                  <Save size={16} />
                  {editingHabit ? 'Update' : 'Create'} Habit
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HabitForm;
