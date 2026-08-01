"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { motion as m } from "framer-motion";

/**
 * ParallaxLayer — wraps any children with a scroll-driven y transform.
 * `speed` is a multiplier: positive = slower than scroll (drifts up),
 *  negative = opposite direction (moves down while you scroll up).
 */
export function ParallaxLayer({
  children,
  speed = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // speed=0.3 → element moves 30% of its scroll range
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * -5}rem`, `${speed * 5}rem`],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * ParallaxFade — fades + slides in as element enters viewport, with
 * a subtle parallax y offset that adds perceived depth.
 */
export function ParallaxFade({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5rem" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}
