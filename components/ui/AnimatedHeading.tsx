"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

interface AnimatedHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
}

export function AnimatedHeading({
  text,
  as = "h1",
  className = "",
}: AnimatedHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.15 + i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mr-[0.28em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
