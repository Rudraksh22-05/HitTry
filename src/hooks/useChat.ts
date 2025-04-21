import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "./useRealtime";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export function useChat(circleId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!circleId) return;
        
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('circle_messages')
          .select(`
            *,
            profiles:user_id(username, avatar_url)
          `)
          .eq("circle_id", circleId)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        // Transform the data to include username and avatar
        const formattedMessages = data.map((message: any) => ({
          ...message,
          username: message.profiles?.username,
          avatar_url: message.profiles?.avatar_url,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (circleId) {
      fetchMessages();
    }
  }, [circleId, toast]);

  // Set up realtime subscription for new messages
  useRealtime<ChatMessage>({
    table: "circle_messages",
    events: ["INSERT"],
    onInsert: async (newMessage) => {
      // Fetch user profile for the new message
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", newMessage.user_id)
        .single();
        
      if (error) {
        console.error("Error fetching profile for new message:", error);
      }

      // Add the new message to our state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          username: profileData?.username || "Unknown",
          avatar_url: profileData?.avatar_url,
        },
      ]);
    },
  });

  // Function to send a new message
  const sendMessage = async (content: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      return;
    }

    try {
      const messageId = uuidv4();
      const newMessage = {
        id: messageId,
        circle_id: circleId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
      };

      // Add the message optimistically to the UI
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          username: user.email?.split('@')[0] || "You",
          avatar_url: null,
        },
      ]);

      const { error } = await supabase
        .from('circle_messages')
        .insert(newMessage);

      if (error) {
        // Remove the optimistically added message on error
        setMessages((prevMessages) => 
          prevMessages.filter(msg => msg.id !== messageId)
        );
        throw error;
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete messages",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if the message exists and belongs to the user
      const { data: message, error: fetchError } = await supabase
        .from('circle_messages')
        .select('user_id')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (message.user_id !== user.id) {
        toast({
          title: "Error",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      // Delete the message
      const { error: deleteError } = await supabase
        .from('circle_messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) {
        throw deleteError;
      }

      // Remove the message from the UI
      setMessages((prevMessages) => 
        prevMessages.filter(msg => msg.id !== messageId)
      );

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
  };
}
