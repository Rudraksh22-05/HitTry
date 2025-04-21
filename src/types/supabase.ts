
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      support_circles: {
        Row: {
          id: string
          name: string
          description: string
          member_count: number
          type: 'domestic-violence' | 'workplace-harassment' | 'legal-guidance' | 'mental-health' | 'financial-independence'
          last_active: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          member_count?: number
          type: 'domestic-violence' | 'workplace-harassment' | 'legal-guidance' | 'mental-health' | 'financial-independence'
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          member_count?: number
          type?: 'domestic-violence' | 'workplace-harassment' | 'legal-guidance' | 'mental-health' | 'financial-independence'
          last_active?: string
          created_at?: string
        }
      }
      emergency_services: {
        Row: {
          id: string
          name: string
          description: string
          contact_method: 'call' | 'chat' | 'both'
          available_24_hours: boolean
          response_time: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          contact_method: 'call' | 'chat' | 'both'
          available_24_hours: boolean
          response_time: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          contact_method?: 'call' | 'chat' | 'both'
          available_24_hours?: boolean
          response_time?: string
          created_at?: string
        }
      }
      support_requests: {
        Row: {
          id: string
          user_id: string
          service_id: string
          anonymous_contact_info: string | null
          status: 'pending' | 'in_progress' | 'completed'
          reference_number: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          anonymous_contact_info?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          reference_number?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          anonymous_contact_info?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          reference_number?: string
          created_at?: string
        }
      }
      circle_memberships: {
        Row: {
          id: string
          user_id: string
          circle_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          circle_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          circle_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
