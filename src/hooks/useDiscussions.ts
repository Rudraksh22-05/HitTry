import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { discussionService, getAnonymousId, supabase } from '@/services/discussionService';
import { DiscussionThread, ThreadMessage, VoteAction } from '@/types/discussions';
import { useToast } from '@/hooks/use-toast';
import { threadService } from '@/services/threadService';

interface DbThread {
  id: string;
  circle_id: string;
  title: string;
  created_at: string;
  expires_at: string;
  anonymous_id: string;
  view_count: number;
  blockchain_id: string | null;
}

export function useThreads(circleId: string) {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up realtime subscription for new threads
  useEffect(() => {
    const subscription = supabase
      .channel('discussion_threads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'discussion_threads' }, (payload) => {
        const newThread = payload.new as DbThread;
        if (newThread.circle_id === circleId) {
          setThreads((prevThreads) => [
            {
              id: newThread.id,
              circleId: newThread.circle_id,
              title: newThread.title,
              createdAt: newThread.created_at,
              expiresAt: newThread.expires_at,
              anonymousId: newThread.anonymous_id,
              viewCount: newThread.view_count,
              blockchainId: newThread.blockchain_id || undefined
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

  const createThread = async (title: string, content?: string, expiresInDays: number = 30) => {
    try {
      if (content) {
        // Create blockchain thread
        return await threadService.createThread(circleId, title, content, expiresInDays);
      } else {
        // Create regular thread
        return await discussionService.createThread(circleId, title, expiresInDays);
      }
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
  const anonymousId = getAnonymousId(circleId);
  const [thread, setThread] = useState<DiscussionThread | null>(null);

  const fetchThread = useCallback(async () => {
    try {
      const data = await threadService.getThreadById(threadId);
      setThread(data);
    } catch (error) {
      console.error('Error fetching thread:', error);
    }
  }, [threadId]);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await discussionService.getMessagesByThread(threadId, user?.id);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [threadId, user?.id]);

  useEffect(() => {
    fetchThread();
    fetchMessages();
  }, [fetchThread, fetchMessages]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      if (thread?.blockchainId) {
        // If this is a blockchain thread, use threadService
        const newMessage = await threadService.createMessage(threadId, content, circleId);
        setMessages(prev => [...prev, newMessage]);
      } else {
        // For regular threads, use discussionService
        const newMessage = await discussionService.createMessage(threadId, content, circleId);
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [threadId, circleId, thread]);

  const voteOnMessage = useCallback(async (messageId: string, action: VoteAction) => {
    if (!user) return;

    try {
      if (thread?.blockchainId && messages.find(m => m.id === messageId)?.blockchainId) {
        // For blockchain messages, use threadService
        await threadService.voteOnMessage(
          messageId,
          user.id,
          threadId,
          parseInt(messageId),
          action === 'upvote'
        );
      } else {
        // For regular messages, use discussionService
        await discussionService.voteOnMessage(messageId, user.id, action);
      }
      
      // Update local state
      setMessages(prev => prev.map(message => {
        if (message.id === messageId) {
          const currentVote = message.userVote;
          let upvotes = message.upvotes;
          let downvotes = message.downvotes;

          // Remove previous vote if exists
          if (currentVote === 'upvote') upvotes--;
          if (currentVote === 'downvote') downvotes--;

          // Add new vote
          if (action === 'upvote') upvotes++;
          if (action === 'downvote') downvotes++;

          return {
            ...message,
            upvotes,
            downvotes,
            userVote: action === 'remove' ? null : action
          };
        }
        return message;
      }));
    } catch (error) {
      console.error('Error voting on message:', error);
      throw error;
    }
  }, [threadId, user, thread, messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    voteOnMessage,
    anonymousId,
    refreshMessages: fetchMessages,
    thread
  };
}
