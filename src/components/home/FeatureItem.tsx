
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ 
  icon, 
  title, 
  description, 
  index, 
  isInView 
}) => {
  return (
    <div 
      className="flex gap-4"
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      }}
    >
      <div className="rounded-full bg-secondary p-3 h-fit">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;
