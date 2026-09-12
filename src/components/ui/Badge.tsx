import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'popular' | 'new' | 'festive' | 'default';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider";
  
  const variants = {
    popular: "bg-accent-peach text-text-dark-brown",
    new: "bg-accent-mint text-text-dark-brown",
    festive: "bg-accent-lavender text-text-dark-brown",
    default: "bg-honey-light text-text-dark-brown",
  };
  
  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
