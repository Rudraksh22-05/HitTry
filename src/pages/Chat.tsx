import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatWindow from "@/components/chat/ChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTitle } from "@/hooks/use-title";

const ChatPage = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [circleName, setCircleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  
  useTitle(`Chat | Silent Guardians`);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access chat",
        variant: "destructive",
      });
      navigate("/auth/login");
    }
  }, [user, navigate, toast]);

  // Fetch circle details
  useEffect(() => {
    const fetchCircleDetails = async () => {
      if (!circleId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("support_circles")
          .select("name, member_count")
          .eq("id", circleId)
          .single();

        if (error) {
          throw error;
        }

        setCircleName(data.name);
        setMemberCount(data.member_count);
      } catch (error) {
        console.error("Error fetching circle details:", error);
        toast({
          title: "Error",
          description: "Failed to load support circle details",
          variant: "destructive",
        });
        navigate("/support-circles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleDetails();
  }, [circleId, navigate, toast]);

  // Initialize chat hook with proper circleId
  const { messages: chatMessages, isLoading: messagesLoading, sendMessage, deleteMessage } = useChat(circleId || "");

  // Transform messages for the chat component
  const formattedMessages = chatMessages.map((message) => ({
    id: message.id,
    content: message.content,
    sender: {
      id: message.user_id,
      name: message.username || "Anonymous",
      avatarUrl: message.avatar_url,
    },
    timestamp: message.created_at,
  }));

  if (!circleId) {
    return (
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-8">
              <h2 className="text-2xl font-semibold mb-4">Invalid Support Circle</h2>
              <p className="mb-6">The support circle you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/support-circles")}>
                View All Support Circles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/support-circles")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <CardTitle className="text-xl font-semibold">{circleName}</CardTitle>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <Skeleton className="h-6 w-8" />
            ) : (
              <span className="text-sm text-muted-foreground">{memberCount}</span>
            )}
            
            <Button variant="ghost" size="icon" className="ml-2">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ChatWindow
            messages={formattedMessages}
            onSendMessage={sendMessage}
            onDeleteMessage={deleteMessage}
            isLoading={messagesLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
