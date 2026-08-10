import React from 'react';
import { motion } from 'framer-motion';

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export const StaggerGroup = ({ children, className = '', amount = 0.15, as: Tag = motion.div }) => (
  <Tag
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount }}
    className={className}
  >
    {children}
  </Tag>
);

export const StaggerItem = ({ children, className = '', as: Tag = motion.div }) => (
  <Tag variants={staggerItem} className={className}>
    {children}
  </Tag>
);
