import { contractService } from '@/lib/blockchain/contract';
import { discussionService } from './discussionService';
import { DiscussionThread, ThreadMessage } from '@/types/discussions';

export interface BlockchainThread {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  viewCount: number;
}

export const threadService = {
  // Create a thread both on blockchain and database
  createThread: async (
    circleId: string,
    title: string,
    content: string,
    expiresInDays: number = 30
  ): Promise<DiscussionThread> => {
    // First create the thread on the blockchain
    await contractService.createTweet(content);
    const tweetCount = await contractService.getTweetCount();
    const blockchainThreadId = (tweetCount - 1).toString();

    // Then create the thread in the database with blockchain reference
    const thread = await discussionService.createThread(
      circleId,
      title,
      expiresInDays
    );

    // Update the thread with blockchain reference
    await discussionService.updateThreadBlockchainId(thread.id, blockchainThreadId);

    return thread;
  },

  // Get thread details combining both sources
  getThreadById: async (threadId: string): Promise<DiscussionThread & { blockchainContent?: string }> => {
    const thread = await discussionService.getThreadById(threadId);
    
    // If thread has blockchain ID, fetch blockchain content
    if (thread.blockchainId) {
      const blockchainThread = await contractService.getTweet(parseInt(thread.blockchainId));
      return {
        ...thread,
        blockchainContent: blockchainThread.content
      };
    }

    return thread;
  },

  // Create a message both on blockchain and database
  createMessage: async (
    threadId: string,
    content: string,
    circleId: string
  ): Promise<ThreadMessage> => {
    const thread = await discussionService.getThreadById(threadId);
    
    // If thread has blockchain ID, create comment on blockchain
    if (thread.blockchainId) {
      await contractService.addComment(parseInt(thread.blockchainId), content);
    }

    // Create message in database
    return await discussionService.createMessage(threadId, content, circleId);
  },

  // Vote on a message both on blockchain and database
  voteOnMessage: async (
    messageId: string,
    userId: string,
    threadId: string,
    commentId: number,
    isUpvote: boolean
  ): Promise<void> => {
    const thread = await discussionService.getThreadById(threadId);
    
    // If thread has blockchain ID, vote on blockchain
    if (thread.blockchainId) {
      await contractService.voteComment(
        parseInt(thread.blockchainId),
        commentId,
        isUpvote
      );
    }

    // Vote in database
    await discussionService.voteOnMessage(messageId, userId, isUpvote ? 'upvote' : 'downvote');
  }
}; 