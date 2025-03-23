
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton';
  text?: string;
  className?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  text = 'Loading...',
  className,
  count = 3,
  size = 'md',
  fullPage = false,
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  if (variant === 'skeleton') {
    return (
      <div className={cn("w-full animate-pulse space-y-4", className)}>
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center",
        fullPage ? "min-h-[60vh]" : "py-8",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary mb-2", sizeMap[size])} />
      {text && <p className="text-muted-foreground font-medium">{text}</p>}
    </div>
  );
};

export default LoadingState;
