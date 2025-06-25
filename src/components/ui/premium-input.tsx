"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, type, label, icon, multiline, rows, ...props }, ref) => {
    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
          >
            <Component
              type={type}
              className={cn(
                "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                icon && "pl-10",
                multiline && "min-h-[80px] resize-none",
                className
              )}
              ref={ref}
              rows={multiline ? rows : undefined}
              {...props}
            />
          </motion.div>
        </div>
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };