import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { discussionService, getAnonymousId, supabase } from '@/services/discussionService';
import { DiscussionThread, ThreadMessage, VoteAction } from '@/types/discussions';
import { useToast } from '@/hooks/use-toast';

export function useThreads(circleId: string) {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up realtime subscription for new threads
  useEffect(() => {
    const subscription = supabase
      .channel('discussion_threads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'discussion_threads' }, (payload) => {
        const newThread = payload.new;
        if (newThread.circle_id === circleId) {
          setThreads((prevThreads) => [
            {
              id: newThread.id,
              circleId: newThread.circle_id,
              title: newThread.title,
              createdAt: newThread.created_at,
              expiresAt: newThread.expires_at,
              anonymousId: newThread.anonymous_id,
              viewCount: newThread.view_count
            },
            ...prevThreads,
          ]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [circleId]);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const data = await discussionService.getThreadsByCircle(circleId);
        setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error);
        toast({
          title: "Error",
          description: "Failed to load discussion threads",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [circleId, toast]);

  const createThread = async (title: string, expiresInDays: number = 30) => {
    try {
      return await discussionService.createThread(circleId, title, expiresInDays);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion thread",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    threads,
    isLoading,
    createThread,
    anonymousId: getAnonymousId(circleId)
  };
}

export function useThreadMessages(threadId: string, circleId: string) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Set up realtime subscription for new messages
  useEffect(() => {
    const subscription = supabase
      .channel('thread_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'thread_messages' }, (payload) => {
        const newMessage = payload.new;
        if (newMessage.thread_id === threadId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: newMessage.id,
              threadId: newMessage.thread_id,
              content: newMessage.content,
              createdAt: newMessage.created_at,
              anonymousId: newMessage.anonymous_id,
              upvotes: newMessage.upvotes,
              downvotes: newMessage.downvotes,
            },
          ]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'thread_messages' }, (payload) => {
        const updatedMessage = payload.new;
        if (updatedMessage.thread_id === threadId) {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === updatedMessage.id
                ? {
                    ...message,
                    upvotes: updatedMessage.upvotes,
                    downvotes: updatedMessage.downvotes,
                  }
                : message
            )
          );
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [threadId]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await discussionService.getMessagesByThread(threadId, user?.id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load thread messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (threadId) {
      fetchMessages();
    }
  }, [threadId, user?.id, toast]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      return await discussionService.createMessage(threadId, content, circleId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  const voteOnMessage = async (messageId: string, action: VoteAction) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on messages",
        variant: "destructive",
      });
      return;
    }

    try {
      await discussionService.voteOnMessage(messageId, user.id, action);
      
      // Optimistically update the UI
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            const previousVote = message.userVote;
            let upvotes = message.upvotes;
            let downvotes = message.downvotes;
            
            // Remove previous vote effect
            if (previousVote === 'upvote') upvotes--;
            if (previousVote === 'downvote') downvotes--;
            
            // Add new vote effect
            if (action === 'upvote') upvotes++;
            if (action === 'downvote') downvotes++;
            
            return {
              ...message,
              upvotes,
              downvotes,
              userVote: action === 'remove' ? null : action,
            };
          }
          return message;
        })
      );
    } catch (error) {
      console.error('Error voting on message:', error);
      toast({
        title: "Error",
        description: "Failed to register your vote",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    voteOnMessage,
    anonymousId: getAnonymousId(circleId)
  };
}
