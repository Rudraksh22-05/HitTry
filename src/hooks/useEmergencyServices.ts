
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { EmergencyService } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useEmergencyServices() {
  const { toast } = useToast();
  
  const { 
    data: emergencyServices = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['emergencyServices'],
    queryFn: api.getEmergencyServices
  });

  const requestSupportMutation = useMutation({
    mutationFn: ({ 
      serviceId, 
      anonymousContactInfo 
    }: { 
      serviceId: string; 
      anonymousContactInfo?: string;
    }) => api.requestEmergencySupport(serviceId, anonymousContactInfo),
    onSuccess: (data) => {
      toast({
        title: "Emergency Support Requested",
        description: `Reference: ${data.referenceNumber}. Estimated response: ${data.estimatedResponseTime}`,
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to request emergency support. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    emergencyServices,
    isLoading,
    error,
    requestSupport: requestSupportMutation.mutate,
    isRequesting: requestSupportMutation.isPending,
    requestResult: requestSupportMutation.data
  };
}
