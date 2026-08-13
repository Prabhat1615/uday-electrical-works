import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedRotatingWord = ({ words = [] }) => {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === words.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, words.length]);

  const spacer = words.reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <span className="relative inline-flex align-bottom justify-center overflow-hidden md:pb-4 md:pt-1">
      {/* Invisible spacer reserves width/height for the longest rotating word */}
      <span className="opacity-0">{spacer}</span>
      {words.map((word, index) => (
        <motion.span
          key={word}
          className="absolute inset-x-0 text-center font-black"
          initial={{ opacity: 0, y: '-100%' }}
          transition={{ type: 'spring', stiffness: 50 }}
          animate={
            titleNumber === index
              ? { y: 0, opacity: 1 }
              : { y: titleNumber > index ? -150 : 150, opacity: 0 }
          }
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};