import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, Star, Zap, Target, Award, Crown, Flame, Medal, X } from 'lucide-react';
import './ConfettiCelebration.css';

const ConfettiCelebration = ({ isActive, onComplete, type = 'daily', streak = 0, achievement = null }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setShowMessage(false);
    onComplete();
  };

  useEffect(() => {
    if (isActive) {
      setShowMessage(true);
      
      // Hide confetti after 5 seconds (increased time)
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, onComplete]);

  const getCelebrationConfig = () => {
    switch (type) {
      case 'streak':
        return {
          icon: Flame,
          title: `${streak} Day Streak!`,
          message: "You're on fire! Keep the momentum going!",
          colors: ['#ff6b6b', '#ff8e53', '#ff6348'],
          emoji: '🔥',
          confettiConfig: { numberOfPieces: 200, gravity: 0.3 }
        };
      case 'milestone':
        return {
          icon: Crown,
          title: 'Milestone Reached!',
          message: achievement?.message || 'Amazing achievement unlocked!',
          colors: ['#ffd700', '#ffed4e', '#f9ca24'],
          emoji: '👑',
          confettiConfig: { numberOfPieces: 300, gravity: 0.2 }
        };
      case 'perfect_week':
        return {
          icon: Medal,
          title: 'Perfect Week!',
          message: 'Seven days of habit excellence!',
          colors: ['#00d2d3', '#01a3a4', '#2ed573'],
          emoji: '🏆',
          confettiConfig: { numberOfPieces: 250, gravity: 0.25 }
        };
      case 'comeback':
        return {
          icon: Target,
          title: 'Welcome Back!',
          message: 'Getting back on track feels amazing!',
          colors: ['#5f27cd', '#741fdc', '#a55eea'],
          emoji: '🎯',
          confettiConfig: { numberOfPieces: 150, gravity: 0.4 }
        };
      default:
        return {
          icon: Trophy,
          title: 'All Habits Complete!',
          message: 'Fantastic work today! You did it!',
          colors: ['#4ECDC4', '#44A08D', '#2ECC71'],
          emoji: '🎉',
          confettiConfig: { numberOfPieces: 200, gravity: 0.3 }
        };
    }
  };

  const config = getCelebrationConfig();
  const IconComponent = config.icon;

  const messageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -50,
      transition: {
        duration: 0.3
      }
    }
  };

  const celebrationMessages = [
    "🎉 Amazing! All habits completed! 🎉",
    "🌟 You're on fire! Great job! 🌟",
    "🚀 Fantastic! Keep up the momentum! 🚀",
    "💪 Incredible dedication! Well done! 💪",
    "🎯 Perfect day! You crushed it! 🎯"
  ];

  const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

  return (
    <>
      {isActive && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          colors={[
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE'
          ]}
        />
      )}
      
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="celebration-message"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="celebration-content">
              <motion.button
                className="celebration-close-btn"
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
              
              <div className="celebration-text">
                {randomMessage}
              </div>
              <div className="celebration-subtext">
                You've completed all your habits for today!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConfettiCelebration;
