import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* Reusable 3D card with cursor spotlight, tilt and glow border.
   Animates transform + opacity only for smooth 60fps. */
export const SpotlightCard = ({
  children,
  className = '',
  tilt = 6,
  scale = 1.02,
  spotlight = 'rgba(255, 107, 0, 0.14)',
  spotlightSize = 360,
  borderOnHover = 'border-[#F97316]/50'
}) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sxp = useMotionValue(50);
  const syp = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 160, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18, mass: 0.4 });
  const sx = useTransform(sxp, (v) => `${v}%`);
  const sy = useTransform(syp, (v) => `${v}%`);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * tilt);
    rx.set(-(py - 0.5) * 2 * tilt);
    sxp.set(px * 100);
    syp.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    sxp.set(50);
    syp.set(50);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1200,
        '--sx': sx,
        '--sy': sy
      }}
      className={`relative rounded-3xl overflow-hidden will-change-transform ${className}`}
    >
      {/* Cursor spotlight overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(${spotlightSize}px circle at var(--sx, 50%) var(--sy, 50%), ${spotlight}, transparent 60%)`
        }}
      />

      {/* Soft top glow on hover */}
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-40 rounded-full blur-3xl transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: spotlight }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col">{children}</div>

      {/* Gradient border on hover */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] border-2 transition-opacity duration-300 ${borderOnHover} ${hovered ? 'opacity-100' : 'opacity-0'}`}
      />
    </motion.div>
  );
};
