'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: "submit" | "button" | "reset" | undefined 
  onClick?: () => void;
  className?: string;
  variant?: 'stroke' | 'filled' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  href,
  onClick,
  type,
  className,
  variant = 'stroke',
  size = 'md',
  disabled = false
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [flairPosition, setFlairPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  console.log('variant', variant)

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const getRelativePosition = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return { x: 50, y: 50 };

    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled) return;
    const position = getRelativePosition(e);
    setFlairPosition(position);
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (disabled) return;
    const position = getRelativePosition(e);
    
    // Adjust exit position for edge cases
    const adjustedPosition = {
      x: position.x > 90 ? position.x + 20 : position.x < 10 ? position.x - 20 : position.x,
      y: position.y > 90 ? position.y + 20 : position.y < 10 ? position.y - 20 : position.y
    };
    
    setFlairPosition(adjustedPosition);
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const position = getRelativePosition(e);
    setFlairPosition(position);
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center',
    'rounded-full font-semibold letter-spacing-tight leading-tight',
    'overflow-hidden cursor-pointer transition-colors duration-75 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'select-none break-words',
    sizeClasses[size],
    {
      // Stroke variant: White bg, black text/border in light mode
      'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white/10': variant === 'stroke',
      // Filled variant: Black bg in light mode, white bg in dark mode
      'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:ring-gray-400/20 dark:focus:ring-white/20': variant === 'filled',
      // Primary variant: Brand colors that work in both modes
      'bg-blue-600 text-white border-2 border-blue-600 hover:text-blue-600 dark:bg-blue-500 dark:border-blue-500 dark:hover:text-blue-500 focus:ring-blue-400/20': variant === 'primary',
      'opacity-50 cursor-not-allowed': disabled
    },
    className
  );

  const flairClasses = cn(
    'absolute inset-0 pointer-events-none',
    'transition-transform duration-300 ease-out origin-top-left',
    {
      'scale-100': isHovered && !disabled,
      'scale-0': !isHovered || disabled
    }
  );

  const Component = href ? 'a' : 'button';

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={buttonRef as any}
      href={href}
      type={type}
      onClick={onClick}
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      disabled={disabled}
      style={{
        textDecoration: 'none'
      }}
    >
      {/* Flair background effect */}
      <span 
        className={flairClasses}
        style={{
          transform: `translate(${flairPosition.x}%, ${flairPosition.y}%) scale(${isHovered && !disabled ? 1 : 0})`
        }}
      >
        <span 
          className={cn(
            "absolute w-[170%] aspect-square rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-400 ease-out",
            {
              'bg-gray-900 dark:bg-white': variant === 'stroke' && !disabled,
              'bg-gray-100 dark:bg-gray-800': variant === 'filled',
              'bg-white dark:bg-blue-400': variant === 'primary'
            }
          )}
          style={{
            left: '0%',
            top: '0%'
          }}
        />
      </span>
      
      {/* Button content */}
      <span className={cn("relative z-10 text-center transition-colors duration-150 ease-in-out",
        isHovered && "text-black"
      )}>
        {children}
      </span>
    </Component>
  );
};

export default AnimatedButton;