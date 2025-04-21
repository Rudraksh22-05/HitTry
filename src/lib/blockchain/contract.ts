import { ethers } from 'ethers';

// Contract deployed on Sepolia network
export const CONTRACT_ADDRESS = '0x86a2D2b4Fd81179E6AC5CA6cd923984C6CA54FFD';

// Contract ABI
export const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tweetID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"commentID","type":"uint256"},{"indexed":false,"internalType":"address","name":"author","type":"address"},{"indexed":false,"internalType":"string","name":"content","type":"string"}],"name":"CommentAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tweetID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"commentID","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isUpvote","type":"bool"},{"indexed":false,"internalType":"int256","name":"netVotes","type":"int256"}],"name":"CommentVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"author","type":"address"},{"indexed":false,"internalType":"string","name":"content","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"TweetCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tweetID","type":"uint256"}],"name":"TweetDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tweetID","type":"uint256"},{"indexed":false,"internalType":"address","name":"viewer","type":"address"}],"name":"TweetViewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"UserRegistered","type":"event"},{"inputs":[],"name":"MAX_COMMENT_LENGTH","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_TWEET_LENGTH","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_TWEET_LENGTH","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"},{"internalType":"string","name":"_content","type":"string"}],"name":"addComment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_content","type":"string"}],"name":"createTweet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"}],"name":"deleteTweet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"},{"internalType":"uint256","name":"commentID","type":"uint256"}],"name":"getComment","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"}],"name":"getCommentsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"}],"name":"getTweet","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTweetCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"registeredUsers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"}],"name":"viewTweet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tweetID","type":"uint256"},{"internalType":"uint256","name":"commentID","type":"uint256"},{"internalType":"bool","name":"isUpvote","type":"bool"}],"name":"voteComment","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export interface Tweet {
    author: string;
    content: string;
    timestamp: number;
    viewCount: number;
    isDeleted: boolean;
}

export interface Comment {
    author: string;
    content: string;
    votes: number;
}

export class ContractService {
    private provider: ethers.BrowserProvider;
    private contract: ethers.Contract | null = null;

    constructor() {
        // Connect to Sepolia network
        this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    async connectWallet(): Promise<string> {
        try {
            // Request account access
            const accounts = await this.provider.send("eth_requestAccounts", []);
            return accounts[0];
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async initializeContract(): Promise<void> {
        try {
            const signer = await this.provider.getSigner();
            this.contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );
        } catch (error) {
            console.error('Error initializing contract:', error);
            throw error;
        }
    }

    // User Registration
    async register(): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.register();
        await tx.wait();
    }

    async isRegistered(address: string): Promise<boolean> {
        if (!this.contract) throw new Error('Contract not initialized');
        return await this.contract.registeredUsers(address);
    }

    // Tweet Management
    async createTweet(content: string): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.createTweet(content);
        await tx.wait();
    }

    async getTweet(tweetId: number): Promise<Tweet> {
        if (!this.contract) throw new Error('Contract not initialized');
        const [author, content, timestamp, viewCount, isDeleted] = await this.contract.getTweet(tweetId);
        return { author, content, timestamp: Number(timestamp), viewCount: Number(viewCount), isDeleted };
    }

    async getTweetCount(): Promise<number> {
        if (!this.contract) throw new Error('Contract not initialized');
        const count = await this.contract.getTweetCount();
        return Number(count);
    }

    async deleteTweet(tweetId: number): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.deleteTweet(tweetId);
        await tx.wait();
    }

    async viewTweet(tweetId: number): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.viewTweet(tweetId);
        await tx.wait();
    }

    // Comment Management
    async addComment(tweetId: number, content: string): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.addComment(tweetId, content);
        await tx.wait();
    }

    async getComment(tweetId: number, commentId: number): Promise<Comment> {
        if (!this.contract) throw new Error('Contract not initialized');
        const [author, content, votes] = await this.contract.getComment(tweetId, commentId);
        return { author, content, votes: Number(votes) };
    }

    async getCommentsCount(tweetId: number): Promise<number> {
        if (!this.contract) throw new Error('Contract not initialized');
        const count = await this.contract.getCommentsCount(tweetId);
        return Number(count);
    }

    async voteComment(tweetId: number, commentId: number, isUpvote: boolean): Promise<void> {
        if (!this.contract) throw new Error('Contract not initialized');
        const tx = await this.contract.voteComment(tweetId, commentId, isUpvote);
        await tx.wait();
    }
}

// Create a singleton instance
export const contractService = new ContractService();
