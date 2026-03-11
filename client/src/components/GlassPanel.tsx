import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassPanel({
  children,
  className = '',
  delay = 0,
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`glass ${className}`}
    >
      {children}
    </motion.div>
  );
}
