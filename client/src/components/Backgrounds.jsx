import React, { useMemo } from 'react';

/* 1. MeshGradient — soft multi-color radial gradient base. */
export const MeshGradient = ({ variant = 'light', className = '', opacity = 1 }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${variant === 'dark' ? 'bg-mesh-dark' : 'bg-mesh-light'} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

/* 2. AuroraBackground — large blurred gradient blobs drifting slowly. */
export const AuroraBackground = ({ className = '', opacity = 0.55 }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#FF6B00]/30 via-amber-400/20 to-transparent blur-[120px] animate-aurora-a" />
      <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-gradient-to-bl from-[#0066FF]/30 via-sky-400/20 to-transparent blur-[120px] animate-aurora-b" />
      <div className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-[#00C853]/25 via-emerald-400/15 to-transparent blur-[120px] animate-aurora-c" />
      <div className="absolute inset-0" style={{ opacity }} />
    </div>
  );
};

/* 3. GlowBlobs — small soft glowing orbs that float. */
export const GlowBlobs = ({ className = '', count = 6 }) => {
  const blobs = useMemo(() => {
    const colors = [
      'rgba(255,107,0,0.5)', 'rgba(0,102,255,0.5)', 'rgba(0,200,83,0.45)',
      'rgba(168,85,247,0.45)', 'rgba(56,189,248,0.45)', 'rgba(255,138,61,0.5)'
    ];
    return Array.from({ length: count }).map((_, i) => ({
      left: `${(i * 17 + 6) % 92}%`,
      top: `${(i * 29 + 9) % 88}%`,
      size: 40 + ((i * 13) % 70),
      delay: `${(i * 0.9) % 4}s`,
      duration: `${6 + (i % 4) * 2}s`,
      color: colors[i % colors.length]
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            animationDelay: b.delay,
            animationDuration: b.duration,
            filter: 'blur(6px)'
          }}
        />
      ))}
    </div>
  );
};

/* 4. FloatingParticles — small glowing dots drifting upward (GPU transform only). */
export const FloatingParticles = ({ className = '', count = 18 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: `${(i * 5.3 + 3) % 100}%`,
      top: `${(i * 7.7 + 12) % 100}%`,
      size: 2 + ((i * 3) % 5),
      delay: `${(i * 0.7) % 9}s`,
      duration: `${6 + (i % 5) * 2}s`,
      drift: `${((i % 7) - 3) * 8}px`,
      opacity: 0.25 + ((i % 4) * 0.12)
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[#FF6B00] to-[#0066FF] animate-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--px']: p.drift,
            ['--po']: p.opacity,
            boxShadow: '0 0 8px rgba(255,107,0,0.6)'
          }}
        />
      ))}
    </div>
  );
};

/* 5. AnimatedGrid — subtle drifting grid texture with perspective floor. */
export const AnimatedGrid = ({ className = '', variant = 'light' }) => {
  const lineColor = variant === 'dark' ? 'rgba(148,163,184,0.07)' : 'rgba(15,23,42,0.05)';
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div
        className="absolute -inset-y-20 inset-x-0 animate-grid-drift"
        style={{
          backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)'
        }}
      />
    </div>
  );
};
