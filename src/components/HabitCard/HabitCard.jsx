import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import './HabitCard.css';

const HabitCard = ({
  habit,
  isCompleted,
  streak,
  completionRate,
  onToggle,
  onEdit,
  onDelete,
  index
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const checkboxVariants = {
    unchecked: { 
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    checked: { 
      scale: 1.1,
      backgroundColor: 'var(--color-success)',
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      className={`habit-card ${isCompleted ? 'completed' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -4,
        boxShadow: 'var(--shadow-lg)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="habit-card-header">
        <div className="habit-info">
          <span className="habit-emoji">{habit.emoji}</span>
          <div className="habit-details">
            <h3 className="habit-name">{habit.name}</h3>
            <div className="habit-stats">
              <span className="streak">🔥 {streak} day{streak !== 1 ? 's' : ''}</span>
              <span className="completion-rate">{completionRate}% this week</span>
            </div>
          </div>
        </div>
        
        <div className="habit-actions">
          <motion.button
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(habit);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 size={16} />
          </motion.button>
          
          <motion.button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      <div className="habit-progress">
        <ProgressBar 
          progress={completionRate} 
          color={habit.color || 'var(--color-primary)'}
          height="6px"
        />
      </div>

      <motion.div
        className="habit-checkbox-container"
        onClick={() => onToggle(habit.id)}
      >
        <motion.div
          className="habit-checkbox"
          variants={checkboxVariants}
          animate={isCompleted ? "checked" : "unchecked"}
        >
          {isCompleted && (
            <motion.div
              className="checkmark"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.1
              }}
            >
              ✓
            </motion.div>
          )}
        </motion.div>
        <span className="checkbox-label">
          {isCompleted ? 'Completed!' : 'Mark as done'}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HabitCard;
