import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export const CountUp = ({
  to,
  from = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(() =>
    from.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
      }
    });
    return () => controls.stop();
  }, [inView, from, to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};
