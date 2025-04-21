import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type SubscriptionEvent = "INSERT" | "UPDATE" | "DELETE";

interface UseRealtimeOptions<T> {
  schema?: string;
  table: string;
  events?: SubscriptionEvent[];
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: T) => void;
}

export function useRealtime<T>({
  schema = "public",
  table,
  events = ["INSERT", "UPDATE", "DELETE"],
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create a unique channel name using the table name
    const channelName = `realtime:${schema}:${table}:${Math.random().toString(36).substring(2, 11)}`;
    
    // Create the channel
    const newChannel = supabase.channel(channelName);
    
    // Add subscription for each event type
    events.forEach((event) => {
      // TypeScript doesn't perfectly match Supabase's typing, so we need to cast
      (newChannel as any).on(
        'postgres_changes',
        {
          event,
          schema,
          table,
        },
        (payload: any) => {
          console.log(`Realtime ${event} payload received:`, payload);
          
          try {
            if (event === "INSERT" && onInsert && payload.new) {
              onInsert(payload.new as T);
            } else if (event === "UPDATE" && onUpdate && payload.new) {
              onUpdate(payload.new as T);
            } else if (event === "DELETE" && onDelete && payload.old) {
              onDelete(payload.old as T);
            }
          } catch (error) {
            console.error(`Error handling ${event} payload:`, error);
          }
        }
      );
    });

    // Subscribe to the channel
    newChannel.subscribe((status) => {
      console.log(`Realtime subscription status for ${table}: ${status}`);
    });
    
    setChannel(newChannel);

    // Cleanup on unmount
    return () => {
      console.log(`Unsubscribing from ${table} realtime channel`);
      supabase.removeChannel(newChannel);
    };
  }, [schema, table, events, onInsert, onUpdate, onDelete]);

  return channel;
}
