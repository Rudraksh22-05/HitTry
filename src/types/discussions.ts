<<<<<<< HEAD
=======

>>>>>>> friend/main
export interface DiscussionThread {
  id: string;
  circleId: string;
  title: string;
  createdAt: string;
<<<<<<< HEAD
  expiresAt: string;
  anonymousId: string;
  viewCount: number;
  blockchainId?: string;  // Reference to the blockchain thread ID
  blockchainContent?: string;  // Content stored on the blockchain
=======
  expiresAt: string | null;
  anonymousId: string;
  viewCount: number;
>>>>>>> friend/main
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
<<<<<<< HEAD
  userVote?: VoteAction | null;
  blockchainId?: string;  // Reference to the blockchain comment ID
=======
  userVote?: 'upvote' | 'downvote' | null;
>>>>>>> friend/main
}

export interface MessageVote {
  id: string;
  messageId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
}

export type VoteAction = 'upvote' | 'downvote' | 'remove';
