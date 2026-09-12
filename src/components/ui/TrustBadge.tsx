import React from 'react';
import { cn } from './Button';

interface TrustBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
}

export function TrustBadge({ icon, label, className, ...props }: TrustBadgeProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/40 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="text-xl flex-shrink-0">
        {icon}
      </div>
      <span className="font-bold text-text-dark-brown text-sm whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
