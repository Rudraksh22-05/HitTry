
export interface DiscussionThread {
  id: string;
  circleId: string;
  title: string;
  createdAt: string;
  expiresAt: string | null;
  anonymousId: string;
  viewCount: number;
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
  userVote?: 'upvote' | 'downvote' | null;
}

export interface MessageVote {
  id: string;
  messageId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
}

export type VoteAction = 'upvote' | 'downvote' | 'remove';
