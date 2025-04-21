import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "./useRealtime";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

// Define the structure of our chat messages
export interface ChatMessage {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string | null;
}

// Type for database query results
type DatabaseMessage = {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
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
        const formattedMessages = (data as DatabaseMessage[]).map((message) => ({
          id: message.id,
          circle_id: message.circle_id,
          user_id: message.user_id,
          content: message.content,
          created_at: message.created_at,
          username: message.profiles?.username || undefined,
          avatar_url: message.profiles?.avatar_url || undefined,
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

  // Set up realtime subscription for new messages and deletions
  useRealtime<DatabaseMessage>({
    table: "circle_messages",
    events: ["INSERT", "DELETE"], // Subscribe to both insert and delete events
    onInsert: async (newMessage) => {
      // Only add messages for the current circle
      if (newMessage.circle_id !== circleId) {
        return;
      }
      
      console.log("Received new message in realtime:", newMessage);
      
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
          id: newMessage.id,
          circle_id: newMessage.circle_id,
          user_id: newMessage.user_id,
          content: newMessage.content,
          created_at: newMessage.created_at,
          username: profileData?.username || "Unknown",
          avatar_url: profileData?.avatar_url,
        },
      ]);
    },
    onDelete: (deletedMessage) => {
      // Only process deletions for the current circle
      if (deletedMessage.circle_id !== circleId) {
        return;
      }

      console.log("Received message deletion in realtime:", deletedMessage);
      
      // Remove the deleted message from state
      setMessages((prevMessages) => 
        prevMessages.filter(msg => msg.id !== deletedMessage.id)
      );
    }
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
      const newMessage: ChatMessage = {
        id: messageId,
        circle_id: circleId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
        username: user.email?.split('@')[0] || "You",
        avatar_url: null,
      };

      // Add the message optimistically to the UI
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
      ]);

      const { error } = await supabase
        .from('circle_messages')
        .insert({
          id: messageId,
          circle_id: circleId,
          user_id: user.id,
          content,
          created_at: new Date().toISOString(),
        });

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

  // Function to delete a message
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
      // First check if the message belongs to the current user
      const messageToDelete = messages.find(msg => msg.id === messageId);
      
      if (!messageToDelete) {
        toast({
          title: "Error",
          description: "Message not found",
          variant: "destructive",
        });
        return;
      }
      
      if (messageToDelete.user_id !== user.id) {
        toast({
          title: "Permission Denied",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      console.log("Deleting message with ID:", messageId);
      
      // Optimistically remove the message from the UI first
      setMessages((prevMessages) => 
        prevMessages.filter(msg => msg.id !== messageId)
      );

      // Then delete from the database
      const { error } = await supabase
        .from('circle_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error("Error deleting message:", error);
        
        // If deletion failed, restore the message
        setMessages(prev => [...prev, messageToDelete]);
        
        toast({
          title: "Error",
          description: "Failed to delete message. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Message successfully deleted");
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error in delete message function:", error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
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
