/**
 * Motion System Presets & Variants for Framer Motion v12
 * Uday Electrical Works Design System
 */

// Spring physics presets
export const springs = {
  gentle: { type: 'spring', stiffness: 260, damping: 25 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18 },
  slow: { type: 'spring', stiffness: 150, damping: 20 },
};

// Easing functions
export const easings = {
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  springLike: [0.34, 1.56, 0.64, 1],
};

// Page transition variant
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: easings.easeOutQuart }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Stagger container variant
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
});

// Stagger item variant
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easings.easeOutQuart }
  }
};

// Card hover micro-animations
export const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)' },
  hover: { 
    y: -4, 
    scale: 1.008, 
    boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 0 15px -3px rgba(255, 107, 0, 0.12)',
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  tap: { scale: 0.98 }
};

// Interactive button micro-animations
export const buttonPress = {
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } }
};

// Modal & backdrop variants
export const modalBackdrop = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { 
    opacity: 1, 
    backdropFilter: 'blur(8px)',
    transition: { duration: 0.25 } 
  },
  exit: { 
    opacity: 0, 
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2 } 
  }
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: springs.snappy 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97, 
    y: 10,
    transition: { duration: 0.18 } 
  }
};

// Drawer side panel variants
export const drawerVariants = (direction = 'right') => {
  const xOffset = direction === 'right' ? '100%' : '-100%';
  return {
    hidden: { x: xOffset, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: springs.gentle 
    },
    exit: { 
      x: xOffset, 
      opacity: 0, 
      transition: { duration: 0.25, ease: 'easeIn' } 
    }
  };
};

// Glow pulse for electrical accents
export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(255,107,0,0.2)',
      '0 0 22px rgba(255,107,0,0.5)',
      '0 0 10px rgba(255,107,0,0.2)'
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
};
