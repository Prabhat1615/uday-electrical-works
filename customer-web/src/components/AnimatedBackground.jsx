import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* Floating orb that parallaxes against mouse position. Outer layer handles
   parallax (transform only, GPU), inner layer handles idle float loop. */
const ParallaxOrb = ({ sx, sy, depth, className = '', children, animate, transition }) => {
  const x = useTransform(sx, (v) => v * depth * 36);
  const y = useTransform(sy, (v) => v * depth * 36);

  return (
    <motion.div style={{ x, y }} className={`pointer-events-none absolute ${className}`}>
      <motion.div animate={animate} transition={transition} className="w-full h-full">
        {children}
      </motion.div>
    </motion.div>
  );
};

const ORBS = [
  {
    depth: 1.0,
    className: 'top-[8%] left-[6%] w-24 h-24 hidden lg:block',
    style: 'bg-gradient-to-br from-[#F97316]/25 to-amber-400/10 rounded-3xl blur-[2px] shadow-[0_0_60px_-10px_rgba(255,107,0,0.5)]',
    animate: { y: [0, -24, 0], rotate: [0, 12, 0] },
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
  },
  {
    depth: 0.6,
    className: 'top-[18%] right-[8%] w-32 h-32 hidden md:block',
    style: 'bg-gradient-to-tr from-[#0066FF]/20 to-sky-400/10 rounded-full blur-[2px] shadow-[0_0_70px_-10px_rgba(0,102,255,0.5)]',
    animate: { y: [0, 28, 0], scale: [1, 1.08, 1] },
    transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }
  },
  {
    depth: 0.8,
    className: 'top-[60%] left-[12%] w-16 h-16 hidden md:block',
    style: 'bg-[#00C853]/15 border border-[#00C853]/30 rounded-2xl shadow-[0_0_50px_-8px_rgba(0,200,83,0.5)]',
    animate: { y: [0, -16, 0], rotate: [0, -10, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }
  },
  {
    depth: 0.4,
    className: 'bottom-[12%] right-[14%] w-20 h-20 hidden lg:block',
    style: 'bg-gradient-to-bl from-purple-500/15 to-fuchsia-400/5 rounded-full blur-[2px]',
    animate: { y: [0, 18, 0], scale: [1, 1.12, 1] },
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
  },
  {
    depth: 0.9,
    className: 'top-[38%] left-[38%] w-12 h-12 hidden xl:block',
    style: 'bg-gradient-to-tr from-[#F97316]/20 to-transparent rounded-xl rotate-45 border border-[#F97316]/20',
    animate: { y: [0, -20, 0], rotate: [45, 65, 45] },
    transition: { duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
  },
  {
    depth: 0.5,
    className: 'top-[70%] right-[40%] w-14 h-14 hidden xl:block',
    style: 'rounded-full border-2 border-dashed border-[#0066FF]/25',
    animate: { rotate: [0, 360] },
    transition: { duration: 22, repeat: Infinity, ease: 'linear' }
  }
];

export const AnimatedBackground = ({ variant = 'light', density = 'normal', className = '' }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 0.6 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const orbSet = density === 'full' ? ORBS : ORBS.slice(0, 4);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Base animated mesh gradient */}
      <div className={`absolute inset-0 ${variant === 'dark' ? 'bg-mesh-dark opacity-70' : 'bg-mesh-light'} will-change-transform`} />

      {/* Fine grid texture */}
      <div className="absolute inset-0 section-pattern opacity-60" />

      {/* Floating parallax orbs & shapes */}
      {orbSet.map((orb, i) => (
        <ParallaxOrb key={i} sx={sx} sy={sy} depth={orb.depth} className={orb.className} animate={orb.animate} transition={orb.transition}>
          <div className={`w-full h-full ${orb.style}`} />
        </ParallaxOrb>
      ))}
    </div>
  );
};
