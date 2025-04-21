
import React, { useState } from 'react';
import { useEmergencyServices } from '@/hooks/useEmergencyServices';
import EmergencyServiceCard from '@/components/support/EmergencyServiceCard';
import { AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SafetyButton from '@/components/ui/SafetyButton';

const EmergencySupport = () => {
  const { emergencyServices, isLoading, requestSupport, isRequesting } = useEmergencyServices();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleRequestSupport = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowDialog(true);
  };

  const confirmRequest = () => {
    if (selectedServiceId) {
      requestSupport({
        serviceId: selectedServiceId,
        anonymousContactInfo: contactInfo.trim() || undefined
      });
      setShowDialog(false);
      setContactInfo('');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
          <AlertTriangle size={28} className="text-destructive" />
        </div>
        <h1 className="text-3xl font-medium mb-2">Emergency Support</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get immediate assistance from verified support organizations.
          All communications are anonymous and encrypted.
        </p>
      </div>

      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-destructive/10 rounded-full p-2 mt-1">
            <AlertTriangle size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Important Safety Notice</h3>
            <p className="text-sm text-muted-foreground">
              If you are in immediate danger, please contact local emergency services directly.
              This platform provides anonymous support but may not be able to provide immediate physical assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          <p>Loading emergency services...</p>
        ) : (
          emergencyServices.map(service => (
            <EmergencyServiceCard
              key={service.id}
              service={service}
              onRequestSupport={handleRequestSupport}
              isRequesting={isRequesting && selectedServiceId === service.id}
            />
          ))
        )}
      </div>

      <div className="text-center mt-12">
        <SafetyButton
          label="Contact All Emergency Services"
          onClick={() => handleRequestSupport(emergencyServices[0]?.id || '')}
          className="px-8"
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Emergency Support</DialogTitle>
            <DialogDescription>
              Your request will be sent anonymously to the support service.
              You may provide optional contact information if you wish to be reached.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Anonymous Contact Method (Optional)
            </label>
            <Textarea
              placeholder="How would you like to be contacted? (e.g., anonymous email, specific times)"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This information is encrypted and will only be shared with the support service.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <SafetyButton label="Confirm Request" onClick={confirmRequest} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencySupport;
