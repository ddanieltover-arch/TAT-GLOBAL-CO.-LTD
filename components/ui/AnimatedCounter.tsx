'use client';

import {useInView} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';

type AnimatedCounterProps = {
  target: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

export default function AnimatedCounter({
  target,
  suffix = '',
  durationMs = 1200,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {once: true, margin: '-50px'});
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
