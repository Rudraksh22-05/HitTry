
import React from 'react';
import { EmergencyService } from '@/types';
import { PhoneCall, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafetyButton from '@/components/ui/SafetyButton';

interface EmergencyServiceCardProps {
  service: EmergencyService;
  onRequestSupport: (id: string) => void;
  isRequesting?: boolean;
}

const EmergencyServiceCard: React.FC<EmergencyServiceCardProps> = ({
  service,
  onRequestSupport,
  isRequesting = false
}) => {
  return (
    <div className="glass-card p-5 rounded-xl border-l-4 border-destructive hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {service.contactMethod === 'call' && (
            <PhoneCall size={18} className="text-destructive" />
          )}
          {service.contactMethod === 'chat' && (
            <MessageSquare size={18} className="text-destructive" />
          )}
          {service.contactMethod === 'both' && (
            <div className="flex space-x-1">
              <PhoneCall size={16} className="text-destructive" />
              <MessageSquare size={16} className="text-destructive" />
            </div>
          )}
          <h3 className="text-lg font-medium">{service.name}</h3>
        </div>
        
        {service.available24Hours && (
          <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
            24/7
          </span>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {service.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs">
          <Clock size={14} className="mr-1 text-muted-foreground" />
          <span>Response: {service.responseTime}</span>
        </div>
        
        <SafetyButton 
          label="Request Support" 
          onClick={() => onRequestSupport(service.id)}
          variant="subtle"
          className="text-xs px-3 py-1 h-auto"
        />
      </div>
    </div>
  );
};

export default EmergencyServiceCard;
