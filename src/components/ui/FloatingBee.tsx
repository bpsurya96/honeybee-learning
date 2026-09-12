'use client';

import { motion } from 'framer-motion';

export default function FloatingBee() {
  return (
    <motion.div
      className="fixed z-50 pointer-events-none select-none text-3xl drop-shadow-md"
      initial={{ x: -100, y: 100, opacity: 0 }}
      animate={{
        x: ['-5vw', '95vw'],
        y: [
          '50vh',
          '30vh',
          '60vh',
          '20vh',
          '70vh',
          '40vh'
        ],
        opacity: [0, 1, 1, 1, 1, 0],
      }}
      transition={{
        duration: 25,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 15
      }}
    >
      🐝
    </motion.div>
  );
}
