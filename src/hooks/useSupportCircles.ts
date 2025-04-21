
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SupportCircle } from '@/types';

export function useSupportCircles() {
  const { 
    data: supportCircles = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['supportCircles'],
    queryFn: api.getSupportCircles
  });

  const joinCircleMutation = useMutation({
    mutationFn: (circleId: string) => api.joinSupportCircle(circleId),
    onSuccess: () => {
      // Optionally refetch the circles after joining
      refetch();
    }
  });

  return {
    supportCircles,
    isLoading,
    error,
    joinCircle: joinCircleMutation.mutate,
    isJoining: joinCircleMutation.isPending
  };
}
