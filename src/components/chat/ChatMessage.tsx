import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
=======
import { Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
>>>>>>> friend/main
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
<<<<<<< HEAD
import { MoreVertical } from "lucide-react";
=======
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
>>>>>>> friend/main

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
<<<<<<< HEAD
  onDelete?: (messageId: string) => void;
=======
  onDelete?: (messageId: string) => Promise<void> | void;
>>>>>>> friend/main
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
<<<<<<< HEAD

  return (
    <div className={cn(
      "flex w-full gap-3 mb-4 group",
=======
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to trigger deletion
  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      // Set deleting state
      setIsDeleting(true);
      
      // Close the dialog first for better UX
      setIsDeleteDialogOpen(false);
      
      // Call delete function
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn(
      "flex w-full gap-3 mb-4 relative group",
>>>>>>> friend/main
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
<<<<<<< HEAD
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
=======
        <div className="relative">
>>>>>>> friend/main
          <div className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isCurrentUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            {content}
          </div>
<<<<<<< HEAD
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formattedTime}
        </span>
      </div>
=======
          
          {isCurrentUser && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2",
              isCurrentUser ? "-left-8" : "-right-8"
            )}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isDeleting}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCurrentUser ? "start" : "end"}>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {formattedTime}
        </span>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
>>>>>>> friend/main
    </div>
  );
};

export default ChatMessage;
