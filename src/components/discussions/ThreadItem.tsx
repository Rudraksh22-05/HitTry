
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { DiscussionThread } from '@/types/discussions';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ThreadItemProps {
  thread: DiscussionThread;
  onClick: () => void;
}

const ThreadItem = ({ thread, onClick }: ThreadItemProps) => {
  // Calculate expiration status
  const expiresAt = thread.expiresAt ? new Date(thread.expiresAt) : null;
  const isExpiringSoon = expiresAt && 
    (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 3;
  
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{thread.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">@{thread.anonymousId}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-x-1">
            <Eye className="h-4 w-4" />
            <span>{thread.viewCount}</span>
          </div>
        </div>
        
        {expiresAt && (
          <div className="flex items-center gap-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {isExpiringSoon ? (
              <Badge variant="destructive" className="text-xs">
                Expires in {formatDistanceToNow(expiresAt)}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                Expires {formatDistanceToNow(expiresAt, { addSuffix: true })}
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ThreadItem;
