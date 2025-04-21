
export interface SupportCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'domestic-violence' | 'workplace-harassment' | 'legal-guidance' | 'mental-health' | 'financial-independence';
  lastActive: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  description: string;
  contactMethod: 'call' | 'chat' | 'both';
  available24Hours: boolean;
  responseTime: string;
}

export interface User {
  id: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  userId: string;
  serviceId: string;
  anonymousContactInfo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  referenceNumber: string;
  createdAt: string;
}
