import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all active:scale-95";
  
  const variants = {
    primary: "bg-honey-yellow text-white shadow-md hover:bg-honey-amber hover:shadow-lg",
    secondary: "bg-text-dark-brown text-white shadow-md hover:bg-text-charcoal hover:shadow-lg",
    outline: "bg-white text-text-dark-brown border-2 border-honey-light shadow-sm hover:bg-honey-light/20",
    ghost: "bg-transparent text-text-dark-brown hover:bg-honey-light/20",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
