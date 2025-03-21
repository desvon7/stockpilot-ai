
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/utils/animations';

type AnimatedCardProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'blur-in';
  className?: string;
  hoverEffect?: boolean;
};

const AnimatedCard = ({
  children,
  delay = 0,
  animation = 'fade-in',
  className,
  hoverEffect = true,
  ...props
}: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  
  const getAnimationClass = () => {
    if (!isInView) return 'opacity-0';
    
    switch (animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'scale-in':
        return 'animate-scale-in';
      case 'blur-in':
        return 'animate-blur-in';
      case 'fade-in':
      default:
        return 'animate-fade-in';
    }
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'glass-card rounded-lg p-6 transition-all duration-500',
        getAnimationClass(),
        hoverEffect && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
