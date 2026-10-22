import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduced_motion = useReducedMotion();
  return (
    <motion.div
      key={location.pathname}
      initial={reduced_motion ? false : { opacity: 0, y: 10 }}
      animate={reduced_motion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
