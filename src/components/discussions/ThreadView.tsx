import React, { useState, useEffect } from 'react';
import { useThreadMessages } from '@/hooks/useDiscussions';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Wallet } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ThreadMessage from './ThreadMessage';
import { threadService } from '@/services/threadService';
import { DiscussionThread } from '@/types/discussions';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useContract } from '@/hooks/useContract';
import { Badge } from "@/components/ui/badge";

interface ThreadViewProps {
  threadId: string;
  circleId: string;
  onBack: () => void;
}

const ThreadView = ({ threadId, circleId, onBack }: ThreadViewProps) => {
  const { messages, isLoading, sendMessage, voteOnMessage, anonymousId } = useThreadMessages(threadId, circleId);
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [isThreadLoading, setIsThreadLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account, isConnecting, connectWallet, isRegistered, register } = useContract();

  useEffect(() => {
    const fetchThread = async () => {
      setIsThreadLoading(true);
      try {
        const data = await threadService.getThreadById(threadId);
        setThread(data);
      } catch (error) {
        console.error('Error fetching thread:', error);
      } finally {
        setIsThreadLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send a message",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    // Check if wallet is connected for blockchain threads
    if (thread?.blockchainId && !account) {
      toast({
        title: "Wallet connection required",
        description: "Please connect your wallet to interact with this thread",
        variant: "destructive",
      });
      return;
    }

    // Check if user is registered for blockchain threads
    if (thread?.blockchainId && !isRegistered) {
      toast({
        title: "Registration required",
        description: "Please register your wallet to interact with this thread",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      await sendMessage(messageContent);
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    try {
      await register();
      toast({
        title: "Success",
        description: "Successfully registered your wallet",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {isThreadLoading ? (
          <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
        ) : (
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{thread?.title}</CardTitle>
              {thread?.blockchainId && (
                <div className="flex items-center gap-2">
                  {!account ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                  ) : !isRegistered ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegister}
                    >
                      Register Wallet
                    </Button>
                  ) : (
                    <Badge variant="outline" className="gap-2">
                      <Wallet className="h-4 w-4" />
                      Connected
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Started by @{thread?.anonymousId} • {thread && formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
            </p>
            {thread?.blockchainContent && (
              <p className="mt-4 text-sm">{thread.blockchainContent}</p>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages in this thread yet.</p>
            <p>Be the first to contribute to this discussion!</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ThreadMessage 
                key={message.id} 
                message={message} 
                isCurrentUser={message.anonymousId === anonymousId}
                onVote={voteOnMessage}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 flex flex-col gap-3">
        <Textarea
          placeholder={
            thread?.blockchainId && !account
              ? "Connect your wallet to participate in this thread..."
              : thread?.blockchainId && !isRegistered
              ? "Register your wallet to participate in this thread..."
              : "Share your thoughts anonymously..."
          }
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="resize-none"
          rows={3}
          disabled={thread?.blockchainId && (!account || !isRegistered)}
        />
        <div className="flex justify-between items-center w-full">
          <p className="text-xs text-muted-foreground">
            Posting as <span className="font-semibold">@{anonymousId}</span>
          </p>
          <Button
            onClick={handleSendMessage}
            disabled={
              isSending || 
              !messageContent.trim() || 
              (thread?.blockchainId && (!account || !isRegistered))
            }
          >
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ThreadView;
