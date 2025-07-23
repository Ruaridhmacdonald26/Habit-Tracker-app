import { motion } from 'framer-motion';
import './ProgressBar.css';

const ProgressBar = ({ 
  progress, 
  color = 'var(--color-primary)', 
  height = '8px',
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`progress-bar-container ${className}`}>
      <div 
        className="progress-bar-track"
        style={{ height }}
      >
        <motion.div
          className="progress-bar-fill"
          style={{ 
            backgroundColor: color,
            height: '100%'
          }}
          initial={animated ? { width: 0 } : { width: `${progressValue}%` }}
          animate={{ width: `${progressValue}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: "easeOut",
            delay: animated ? 0.2 : 0
          }}
        />
      </div>
      {showPercentage && (
        <span className="progress-percentage">
          {Math.round(progressValue)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
