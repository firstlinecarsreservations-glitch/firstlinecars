import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ children, icon }: BadgeProps) {
  return (
    <span className="bg-marine-50 text-marine-700 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
      {icon}
      {children}
    </span>
  );
}
