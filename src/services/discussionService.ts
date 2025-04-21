import { supabase } from '@/integrations/supabase/client';
export { supabase };
import { DiscussionThread, ThreadMessage, VoteAction } from '@/types/discussions';
import { v4 as uuidv4 } from 'uuid';

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
    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(thread => ({
      id: thread.id,
      circleId: thread.circle_id,
      title: thread.title,
      createdAt: thread.created_at,
      expiresAt: thread.expires_at,
      anonymousId: thread.anonymous_id,
      viewCount: thread.view_count
    }));
  },
  
  getThreadById: async (threadId: string): Promise<DiscussionThread> => {
    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*')
      .eq('id', threadId)
      .single();
    
    if (error) throw error;
    
    // Increment view count
    await supabase
      .from('discussion_threads')
      .update({ view_count: data.view_count + 1 })
      .eq('id', threadId);
    
    return {
      id: data.id,
      circleId: data.circle_id,
      title: data.title,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      anonymousId: data.anonymous_id,
      viewCount: data.view_count + 1 // Include the incremented count
    };
  },
  
  createThread: async (
    circleId: string, 
    title: string, 
    expiresInDays: number = 30 // Default expiration of 30 days
  ): Promise<DiscussionThread> => {
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
          expires_at: expiresAt.toISOString() 
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      circleId: data.circle_id,
      title: data.title,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      anonymousId: data.anonymous_id,
      viewCount: data.view_count
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
    
    return data.map(message => {
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
        userVote: userVote ? userVote.vote_type : null
      };
    });
  },
  
  createMessage: async (threadId: string, content: string, circleId: string): Promise<ThreadMessage> => {
    const anonymousId = getAnonymousId(circleId);
    
    const { data, error } = await supabase
      .from('thread_messages')
      .insert([
        { thread_id: threadId, content, anonymous_id: anonymousId }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      threadId: data.thread_id,
      content: data.content,
      createdAt: data.created_at,
      anonymousId: data.anonymous_id,
      upvotes: data.upvotes,
      downvotes: data.downvotes
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
  }
};
