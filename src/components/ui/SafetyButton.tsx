
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SafetyButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'subtle';
}

const SafetyButton = ({ 
  label, 
  onClick, 
  className,
  variant = 'default'
}: SafetyButtonProps) => {
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = () => {
    setIsRippling(true);
    onClick();
    setTimeout(() => setIsRippling(false), 600);
  };

  return (
    <Button
      className={cn(
        "relative overflow-hidden",
        variant === 'default' 
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
          : "bg-destructive/10 text-destructive hover:bg-destructive/20",
        "font-medium px-6 rounded-full transition-all duration-300",
        className
      )}
      onClick={handleClick}
    >
      <span className="flex items-center space-x-2">
        <AlertCircle size={16} />
        <span>{label}</span>
      </span>
      {isRippling && (
        <span className="absolute inset-0 block bg-white/20 animate-ripple rounded-full" />
      )}
    </Button>
  );
};

export default SafetyButton;
