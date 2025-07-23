import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '../../data/quotes';
import './DailyQuote.css';

const DailyQuote = () => {
  const quote = getDailyQuote();

  const quoteVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="daily-quote"
      variants={quoteVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      <div className="quote-icon">
        <Quote size={24} />
      </div>
      
      <div className="quote-content">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      
      <div className="quote-decoration">
        <span>✨</span>
      </div>
    </motion.div>
  );
};

export default DailyQuote;
