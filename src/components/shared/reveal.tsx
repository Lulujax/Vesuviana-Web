import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export function Reveal({ children, className, delay = 0, distance = 24 }: RevealProps) {
  const reduced_motion = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduced_motion ? false : { opacity: 0, y: distance }}
      whileInView={reduced_motion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
