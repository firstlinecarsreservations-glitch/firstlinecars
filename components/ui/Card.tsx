import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`shadow-card hover:shadow-card-hover rounded-2xl bg-white transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
