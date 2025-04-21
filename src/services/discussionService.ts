import { supabase } from '@/integrations/supabase/client';
export { supabase };
import { DiscussionThread, ThreadMessage, VoteAction } from '@/types/discussions';
import { v4 as uuidv4 } from 'uuid';

// Define database types to match Supabase schema
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

interface DbMessage {
  id: string;
  thread_id: string;
  content: string;
  created_at: string;
  anonymous_id: string;
  upvotes: number;
  downvotes: number;
  blockchain_id: string | null;
}

// Update the type for the update operation
interface ThreadUpdate {
  view_count?: number;
  blockchain_id?: string | null;
}

// Generate a persistent anonymous ID for the current user in this circle
export const getAnonymousId = (circleId: string): string => {
  // Get existing anonymous ID from localStorage or create a new one
  const storageKey = `anonymous-id-${circleId}`;
  let anonymousId = localStorage.getItem(storageKey);
  
  if (!anonymousId) {
    // Generate a random ID that doesn't reveal the user's identity
    anonymousId = `anon-${uuidv4().substring(0, 8)}`;
    localStorage.setItem(storageKey, anonymousId);
  }
  
  return anonymousId;
};

export const discussionService = {
  // Thread operations
  getThreadsByCircle: async (circleId: string): Promise<DiscussionThread[]> => {
    if (!circleId) throw new Error('Circle ID is required');

    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data as DbThread[]).map(thread => ({
      id: thread.id,
      circleId: thread.circle_id,
      title: thread.title,
      createdAt: thread.created_at,
      expiresAt: thread.expires_at,
      anonymousId: thread.anonymous_id,
      viewCount: thread.view_count,
      blockchainId: thread.blockchain_id || undefined
    }));
  },
  
  getThreadById: async (threadId: string): Promise<DiscussionThread> => {
    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*')
      .eq('id', threadId)
      .single();
    
    if (error) throw error;
    
    const thread = data as DbThread;
    
    // Increment view count
    await supabase
      .from('discussion_threads')
      .update({ view_count: thread.view_count + 1 })
      .eq('id', threadId);
    
    return {
      id: thread.id,
      circleId: thread.circle_id,
      title: thread.title,
      createdAt: thread.created_at,
      expiresAt: thread.expires_at,
      anonymousId: thread.anonymous_id,
      viewCount: thread.view_count + 1,
      blockchainId: thread.blockchain_id || undefined
    };
  },
  
  createThread: async (
    circleId: string, 
    title: string, 
    expiresInDays: number = 30
  ): Promise<DiscussionThread> => {
    if (!circleId) throw new Error('Circle ID is required');
    if (!title.trim()) throw new Error('Title is required');

    // First verify that the circle exists
    const { data: circleData, error: circleError } = await supabase
      .from('support_circles')
      .select('id')
      .eq('id', circleId)
      .single();

    if (circleError || !circleData) {
      throw new Error('Invalid support circle');
    }

    const anonymousId = getAnonymousId(circleId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const { data, error } = await supabase
      .from('discussion_threads')
      .insert([
        { 
          circle_id: circleId, 
          title, 
          anonymous_id: anonymousId,
          expires_at: expiresAt.toISOString(),
          view_count: 0
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create thread');
    }

    const thread = data as DbThread;
    return {
      id: thread.id,
      circleId: thread.circle_id,
      title: thread.title,
      createdAt: thread.created_at,
      expiresAt: thread.expires_at,
      anonymousId: thread.anonymous_id,
      viewCount: thread.view_count,
      blockchainId: thread.blockchain_id || undefined
    };
  },
  
  // Message operations
  getMessagesByThread: async (threadId: string, userId?: string): Promise<ThreadMessage[]> => {
    const { data, error } = await supabase
      .from('thread_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // If we have a userId, get user's votes
    let userVotes = [];
    if (userId) {
      const { data: votesData, error: votesError } = await supabase
        .from('message_votes')
        .select('message_id, vote_type')
        .eq('user_id', userId);
      
      if (!votesError) {
        userVotes = votesData;
      }
    }
    
    return (data as DbMessage[]).map(message => {
      // Find if the user has voted on this message
      const userVote = userVotes.find(vote => vote.message_id === message.id);
      
      return {
        id: message.id,
        threadId: message.thread_id,
        content: message.content,
        createdAt: message.created_at,
        anonymousId: message.anonymous_id,
        upvotes: message.upvotes,
        downvotes: message.downvotes,
        userVote: userVote ? userVote.vote_type : null,
        blockchainId: message.blockchain_id || undefined
      };
    });
  },
  
  createMessage: async (threadId: string, content: string, circleId: string): Promise<ThreadMessage> => {
    const anonymousId = getAnonymousId(circleId);
    
    const { data, error } = await supabase
      .from('thread_messages')
      .insert([
        { 
          thread_id: threadId, 
          content, 
          anonymous_id: anonymousId,
          upvotes: 0,
          downvotes: 0
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      if (error.message?.includes('blockchain_id')) {
        // If the error is about blockchain_id, try without it
        const { data: retryData, error: retryError } = await supabase
          .from('thread_messages')
          .insert([
            { 
              thread_id: threadId, 
              content, 
              anonymous_id: anonymousId,
              upvotes: 0,
              downvotes: 0
            }
          ])
          .select()
          .single();
          
        if (retryError) throw retryError;
        if (!retryData) throw new Error('Failed to create message');
        return {
          id: retryData.id,
          threadId: retryData.thread_id,
          content: retryData.content,
          createdAt: retryData.created_at,
          anonymousId: retryData.anonymous_id,
          upvotes: retryData.upvotes || 0,
          downvotes: retryData.downvotes || 0,
          blockchainId: undefined
        };
      }
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create message');
    }

    const message = data as DbMessage;
    return {
      id: message.id,
      threadId: message.thread_id,
      content: message.content,
      createdAt: message.created_at,
      anonymousId: message.anonymous_id,
      upvotes: message.upvotes || 0,
      downvotes: message.downvotes || 0,
      blockchainId: message.blockchain_id || undefined
    };
  },
  
  // Voting operations
  voteOnMessage: async (messageId: string, userId: string, action: VoteAction): Promise<void> => {
    // First check if user has already voted on this message
    const { data: existingVote } = await supabase
      .from('message_votes')
      .select('id, vote_type')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // Handle the vote based on the action and existing vote
    if (action === 'remove' && existingVote) {
      // Remove the vote
      await supabase
        .from('message_votes')
        .delete()
        .eq('id', existingVote.id);
    } else if (existingVote) {
      // Update the vote if it exists and is different
      if (existingVote.vote_type !== action) {
        await supabase
          .from('message_votes')
          .update({ vote_type: action })
          .eq('id', existingVote.id);
      }
    } else if (action !== 'remove') {
      // Insert a new vote
      await supabase
        .from('message_votes')
        .insert([
          { message_id: messageId, user_id: userId, vote_type: action }
        ]);
    }
  },

  updateThreadBlockchainId: async (threadId: string, blockchainId: string): Promise<void> => {
    const updateData: ThreadUpdate = { blockchain_id: blockchainId };
    const { error } = await supabase
      .from('discussion_threads')
      .update(updateData)
      .eq('id', threadId);
    
    if (error) throw error;
  }
};
