import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  timestamp: string;
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => void;
}

const ChatMessage = ({
  id,
  content,
  sender,
  timestamp,
  isCurrentUser,
  onDelete,
}: ChatMessageProps) => {
  const initials = sender.name 
    ? sender.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : 'U';
  
  const formattedTime = format(new Date(timestamp), 'h:mm a');

  return (
    <div className={cn(
      "flex w-full gap-3 mb-4 group",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatarUrl || ""} alt={sender.name || "User"} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2">
          {isCurrentUser && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isCurrentUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            {content}
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
