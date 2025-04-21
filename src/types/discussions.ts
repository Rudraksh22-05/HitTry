export interface DiscussionThread {
  id: string;
  circleId: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  anonymousId: string;
  viewCount: number;
  blockchainId?: string;  // Reference to the blockchain thread ID
  blockchainContent?: string;  // Content stored on the blockchain
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  upvotes: number;
  downvotes: number;
  // Local state to track user's vote
  userVote?: VoteAction | null;
  blockchainId?: string;  // Reference to the blockchain comment ID
}

export interface MessageVote {
  id: string;
  messageId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
}

export type VoteAction = 'upvote' | 'downvote' | 'remove';
