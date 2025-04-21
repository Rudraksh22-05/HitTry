import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void> | void;
  isDisabled?: boolean;
}

const ChatInput = ({ onSendMessage, isDisabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isDisabled && !isSending) {
      try {
        setIsSending(true);
        await onSendMessage(message);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
      <div className="relative flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={cn(
            "min-h-[80px] w-full resize-none overflow-auto rounded-lg border pr-12",
            (isDisabled || isSending) && "bg-muted opacity-70"
          )}
          disabled={isDisabled || isSending}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            disabled={isDisabled || isSending}
            onClick={() => console.log("Attachment not implemented yet")}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isDisabled || isSending}
        className="h-10 w-10 shrink-0 rounded-full"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};

export default ChatInput;
