import React from 'react';
import { motion } from 'framer-motion';

const offsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 }
};

export const AnimatedSection = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = null,
  className = '',
  once = true
}) => {
  const base = offsets[direction] || offsets.up;
  const offset = distance != null
    ? direction === 'left' ? { x: distance, y: 0 }
    : direction === 'right' ? { x: -distance, y: 0 }
    : direction === 'up' ? { x: 0, y: distance }
    : direction === 'down' ? { x: 0, y: -distance }
    : { x: 0, y: 0 }
    : base;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
