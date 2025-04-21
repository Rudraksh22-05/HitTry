export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      circle_memberships: {
        Row: {
          circle_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          circle_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_memberships_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "support_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_messages: {
        Row: {
          circle_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          circle_id: string
          content: string
          created_at?: string
          id: string
          user_id: string
        }
        Update: {
          circle_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_messages_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "support_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_threads: {
        Row: {
          anonymous_id: string
          circle_id: string
          created_at: string
          expires_at: string | null
          id: string
          title: string
          view_count: number
        }
        Insert: {
          anonymous_id: string
          circle_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          title: string
          view_count?: number
        }
        Update: {
          anonymous_id?: string
          circle_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "discussion_threads_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "support_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_services: {
        Row: {
          available_24_hours: boolean
          contact_method: string
          created_at: string
          description: string
          id: string
          name: string
          response_time: string
        }
        Insert: {
          available_24_hours?: boolean
          contact_method: string
          created_at?: string
          description: string
          id?: string
          name: string
          response_time: string
        }
        Update: {
          available_24_hours?: boolean
          contact_method?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          response_time?: string
        }
        Relationships: []
      }
      message_votes: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_votes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "thread_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      support_circles: {
        Row: {
          created_at: string
          description: string
          id: string
          last_active: string
          member_count: number
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          last_active?: string
          member_count?: number
          name: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          last_active?: string
          member_count?: number
          name?: string
          type?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          anonymous_contact_info: string | null
          created_at: string
          id: string
          reference_number: string
          service_id: string
          status: string
          user_id: string
        }
        Insert: {
          anonymous_contact_info?: string | null
          created_at?: string
          id?: string
          reference_number: string
          service_id: string
          status: string
          user_id: string
        }
        Update: {
          anonymous_contact_info?: string | null
          created_at?: string
          id?: string
          reference_number?: string
          service_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "emergency_services"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_messages: {
        Row: {
          anonymous_id: string
          content: string
          created_at: string
          downvotes: number
          id: string
          thread_id: string
          upvotes: number
        }
        Insert: {
          anonymous_id: string
          content: string
          created_at?: string
          downvotes?: number
          id?: string
          thread_id: string
          upvotes?: number
        }
        Update: {
          anonymous_id?: string
          content?: string
          created_at?: string
          downvotes?: number
          id?: string
          thread_id?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "thread_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement_circle_members: {
        Args: {
          circle_id: string
        }
        Returns: undefined
      }
      increment_circle_members: {
        Args: {
          circle_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
