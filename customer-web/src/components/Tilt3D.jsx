import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* 3D tilt card that reacts to the mouse, GPU transform only. */
export const Tilt3D = ({ children, className = '', max = 8, scale = 1.02, glare = true }) => {
  const ref = useRef(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 120, damping: 16, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16, mass: 0.4 });
  const sgx = useSpring(gx, { stiffness: 120, damping: 16 });
  const sgy = useSpring(gy, { stiffness: 120, damping: 16 });

  const gxPct = useTransform(sgx, (v) => `${v}%`);
  const gyPct = useTransform(sgy, (v) => `${v}%`);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1200,
        '--gx': gxPct,
        '--gy': gyPct
      }}
      className={`will-change-transform relative ${className}`}
    >
      {children}
      {glare && (
        <div
          style={{ background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.16), transparent 55%)' }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none mix-blend-overlay z-10"
        />
      )}
    </motion.div>
  );
};
