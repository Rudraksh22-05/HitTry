
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ThreadMessage as ThreadMessageType, VoteAction } from '@/types/discussions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ThreadMessageProps {
  message: ThreadMessageType;
  isCurrentUser: boolean;
  onVote: (messageId: string, action: VoteAction) => void;
}

const ThreadMessage = ({ message, isCurrentUser, onVote }: ThreadMessageProps) => {
  return (
    <Card className={cn(
      "transition-all",
      isCurrentUser && "border-primary/20 bg-primary/5"
    )}>
      <CardContent className="pt-4">
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground mb-2">
          <span className="font-medium text-foreground">@{message.anonymousId}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
        </div>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </CardContent>
      
      <CardFooter className="flex items-center gap-2 pt-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8",
            message.userVote === 'upvote' && "text-green-500"
          )}
          onClick={() => onVote(
            message.id, 
            message.userVote === 'upvote' ? 'remove' : 'upvote'
          )}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <span className={cn(
          "text-sm",
          message.upvotes > message.downvotes && "text-green-500",
          message.upvotes < message.downvotes && "text-red-500"
        )}>
          {message.upvotes - message.downvotes}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8",
            message.userVote === 'downvote' && "text-red-500"
          )}
          onClick={() => onVote(
            message.id, 
            message.userVote === 'downvote' ? 'remove' : 'downvote'
          )}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThreadMessage;
