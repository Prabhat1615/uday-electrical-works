import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* Premium desktop-only cursor: a fast dot + trailing glow ring that reacts to
   interactive elements. Native cursor stays visible for accessibility. */
export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 22, mass: 0.5 });
  const glowX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  const glowY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const over = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, select, textarea, .card-premium, [data-cursor="hover"]');
      setHovering(!!target);
    };

    const out = () => setVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    document.addEventListener('mouseout', out);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="hidden md:block" aria-hidden="true">
      {/* Ambient glow trailing the cursor */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-tr from-[#FF6B00]/25 via-transparent to-[#0066FF]/25 blur-2xl" />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ${
            hovering ? 'w-12 h-12 border-[#FF6B00] bg-[#FF6B00]/10 scale-110' : 'w-8 h-8 border-slate-400/60'
          }`}
          style={{ opacity: visible ? 1 : 0 }}
        />
      </motion.div>

      {/* Instant dot */}
      <motion.div
        style={{ x, y }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B00] transition-all duration-150 ${
            hovering ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`}
          style={{ opacity: visible ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
};
