import { useEffect, useRef } from "react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface ChatWindowProps {
<<<<<<< HEAD
  messages: Omit<ChatMessageProps, "isCurrentUser">[];
  onSendMessage: (message: string) => void;
  onDeleteMessage?: (messageId: string) => void;
=======
  messages: Omit<ChatMessageProps, "isCurrentUser" | "onDelete">[];
  onSendMessage: (message: string) => void;
  onDeleteMessage?: (messageId: string) => Promise<void> | void;
>>>>>>> friend/main
  isLoading?: boolean;
}

const ChatWindow = ({ 
  messages, 
<<<<<<< HEAD
  onSendMessage,
=======
  onSendMessage, 
>>>>>>> friend/main
  onDeleteMessage,
  isLoading = false 
}: ChatWindowProps) => {
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
<<<<<<< HEAD
      <ScrollArea 
        className="flex-1 p-4" 
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.length === 0 && !isLoading ? (
            <div className="text-center text-muted-foreground my-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                isCurrentUser={message.sender.id === user?.id}
                onDelete={onDeleteMessage}
              />
            ))
          )}
          {isLoading && (
            <div className="flex justify-center py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
=======
      <div 
        className="flex-1 p-4 overflow-auto" 
        ref={scrollAreaRef}
      >
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center text-muted-foreground my-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                  isCurrentUser={message.sender.id === user?.id}
                  onDelete={onDeleteMessage && message.sender.id === user?.id ? 
                    onDeleteMessage : undefined}
                />
              ))
            )}
            {isLoading && (
              <div className="flex justify-center py-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
>>>>>>> friend/main
      
      <div className="border-t p-4">
        <ChatInput 
          onSendMessage={onSendMessage} 
          isDisabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
