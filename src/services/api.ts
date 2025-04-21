
import { supabase } from '@/integrations/supabase/client';
import { SupportCircle, EmergencyService, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// API services using Supabase
export const api = {
  // Auth
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return profile ? {
      id: user.id,
      email: user.email,
      avatarUrl: profile.avatar_url,
      createdAt: user.created_at
    } : null;
  },
  
  // Support circles
  getSupportCircles: async (): Promise<SupportCircle[]> => {
    const { data, error } = await supabase
      .from('support_circles')
      .select('*');
    
    if (error) {
      console.error('Error fetching support circles:', error);
      throw error;
    }
    
    // Transform from snake_case to camelCase and ensure correct type casting
    return data.map(circle => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      memberCount: circle.member_count,
      type: circle.type as "domestic-violence" | "workplace-harassment" | "legal-guidance" | "mental-health" | "financial-independence",
      lastActive: circle.last_active
    }));
  },
  
  getSupportCircleById: async (circleId: string): Promise<SupportCircle | null> => {
    const { data, error } = await supabase
      .from('support_circles')
      .select('*')
      .eq('id', circleId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, not an error in this case
        return null;
      }
      console.error('Error fetching support circle:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      memberCount: data.member_count,
      type: data.type as "domestic-violence" | "workplace-harassment" | "legal-guidance" | "mental-health" | "financial-independence",
      lastActive: data.last_active
    };
  },
  
  joinSupportCircle: async (circleId: string): Promise<{ success: boolean }> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to join a support circle');
    }
    
    const { error } = await supabase
      .from('circle_memberships')
      .insert([
        { user_id: user.id, circle_id: circleId }
      ]);
    
    if (error) {
      console.error('Error joining support circle:', error);
      throw error;
    }
    
    // Update member count using the function
    const { error: fnError } = await supabase.rpc('increment_circle_members', {
      circle_id: circleId
    });
    
    if (fnError) {
      console.error('Error updating member count:', fnError);
    }
    
    return { success: true };
  },
  
  // Emergency services
  getEmergencyServices: async (): Promise<EmergencyService[]> => {
    const { data, error } = await supabase
      .from('emergency_services')
      .select('*');
    
    if (error) {
      console.error('Error fetching emergency services:', error);
      throw error;
    }
    
    // Transform from snake_case to camelCase and ensure correct type casting
    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      contactMethod: service.contact_method as "call" | "chat" | "both",
      available24Hours: service.available_24_hours,
      responseTime: service.response_time
    }));
  },
  
  requestEmergencySupport: async (serviceId: string, anonymousContactInfo?: string): Promise<{ 
    success: boolean; 
    referenceNumber?: string;
    estimatedResponseTime?: string;
  }> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to request emergency support');
    }
    
    const referenceNumber = `EM-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const { error } = await supabase
      .from('support_requests')
      .insert([
        { 
          user_id: user.id, 
          service_id: serviceId,
          anonymous_contact_info: anonymousContactInfo || null,
          status: 'pending',
          reference_number: referenceNumber
        }
      ]);
    
    if (error) {
      console.error('Error requesting emergency support:', error);
      throw error;
    }
    
    // Get estimated response time from the service
    const { data, error: serviceError } = await supabase
      .from('emergency_services')
      .select('response_time')
      .eq('id', serviceId)
      .single();
    
    if (serviceError) {
      console.error('Error fetching service details:', serviceError);
    }
    
    return { 
      success: true,
      referenceNumber,
      estimatedResponseTime: data?.response_time || '< 15 minutes'
    };
  },
  
  // Profile
  updateProfile: async (updates: { username?: string; avatarUrl?: string }): Promise<{ success: boolean }> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to update your profile');
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: updates.username,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return { success: true };
  }
};
