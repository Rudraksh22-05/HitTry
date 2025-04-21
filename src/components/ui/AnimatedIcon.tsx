
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  icon: React.ReactNode;
  label: string;
  delay?: number;
  className?: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  icon, 
  label, 
  delay = 0,
  className
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center opacity-0",
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`, 
        animationFillMode: 'forwards',
        animation: 'fadeIn 0.8s ease-out forwards, slideUp 0.8s ease-out forwards' 
      }}
    >
      <div className="bg-secondary/70 dark:bg-secondary/30 p-4 rounded-full mb-4 subtle-ring">
        <div className="text-primary">{icon}</div>
      </div>
      <p className="font-medium text-center">{label}</p>
    </div>
  );
};

export default AnimatedIcon;
