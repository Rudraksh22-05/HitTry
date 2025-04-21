import { useState, useEffect, useCallback } from 'react';
import { contractService, Tweet, Comment } from '@/lib/blockchain/contract';

export function useContract() {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const connectWallet = useCallback(async () => {
        try {
            setIsConnecting(true);
            setError(null);
            const connectedAccount = await contractService.connectWallet();
            await contractService.initializeContract();
            setAccount(connectedAccount);
            
            // Check if user is registered
            const registered = await contractService.isRegistered(connectedAccount);
            setIsRegistered(registered);
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err instanceof Error ? err.message : 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    // User Registration
    const register = useCallback(async () => {
        try {
            setError(null);
            await contractService.register();
            setIsRegistered(true);
        } catch (err) {
            console.error('Error registering user:', err);
            setError(err instanceof Error ? err.message : 'Failed to register user');
            throw err;
        }
    }, []);

    // Tweet Management
    const createTweet = useCallback(async (content: string) => {
        try {
            setError(null);
            await contractService.createTweet(content);
        } catch (err) {
            console.error('Error creating tweet:', err);
            setError(err instanceof Error ? err.message : 'Failed to create tweet');
            throw err;
        }
    }, []);

    const getTweet = useCallback(async (tweetId: number): Promise<Tweet> => {
        try {
            setError(null);
            return await contractService.getTweet(tweetId);
        } catch (err) {
            console.error('Error getting tweet:', err);
            setError(err instanceof Error ? err.message : 'Failed to get tweet');
            throw err;
        }
    }, []);

    const getTweetCount = useCallback(async (): Promise<number> => {
        try {
            setError(null);
            return await contractService.getTweetCount();
        } catch (err) {
            console.error('Error getting tweet count:', err);
            setError(err instanceof Error ? err.message : 'Failed to get tweet count');
            throw err;
        }
    }, []);

    const deleteTweet = useCallback(async (tweetId: number) => {
        try {
            setError(null);
            await contractService.deleteTweet(tweetId);
        } catch (err) {
            console.error('Error deleting tweet:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete tweet');
            throw err;
        }
    }, []);

    const viewTweet = useCallback(async (tweetId: number) => {
        try {
            setError(null);
            await contractService.viewTweet(tweetId);
        } catch (err) {
            console.error('Error viewing tweet:', err);
            setError(err instanceof Error ? err.message : 'Failed to view tweet');
            throw err;
        }
    }, []);

    // Comment Management
    const addComment = useCallback(async (tweetId: number, content: string) => {
        try {
            setError(null);
            await contractService.addComment(tweetId, content);
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err instanceof Error ? err.message : 'Failed to add comment');
            throw err;
        }
    }, []);

    const getComment = useCallback(async (tweetId: number, commentId: number): Promise<Comment> => {
        try {
            setError(null);
            return await contractService.getComment(tweetId, commentId);
        } catch (err) {
            console.error('Error getting comment:', err);
            setError(err instanceof Error ? err.message : 'Failed to get comment');
            throw err;
        }
    }, []);

    const getCommentsCount = useCallback(async (tweetId: number): Promise<number> => {
        try {
            setError(null);
            return await contractService.getCommentsCount(tweetId);
        } catch (err) {
            console.error('Error getting comments count:', err);
            setError(err instanceof Error ? err.message : 'Failed to get comments count');
            throw err;
        }
    }, []);

    const voteComment = useCallback(async (tweetId: number, commentId: number, isUpvote: boolean) => {
        try {
            setError(null);
            await contractService.voteComment(tweetId, commentId, isUpvote);
        } catch (err) {
            console.error('Error voting on comment:', err);
            setError(err instanceof Error ? err.message : 'Failed to vote on comment');
            throw err;
        }
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                if (accounts.length === 0) {
                    setAccount(null);
                    setIsRegistered(false);
                } else {
                    setAccount(accounts[0]);
                    // Check registration status for new account
                    const registered = await contractService.isRegistered(accounts[0]);
                    setIsRegistered(registered);
                }
            });
        }

        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, []);

    return {
        account,
        isConnecting,
        error,
        isRegistered,
        connectWallet,
        register,
        // Tweet functions
        createTweet,
        getTweet,
        getTweetCount,
        deleteTweet,
        viewTweet,
        // Comment functions
        addComment,
        getComment,
        getCommentsCount,
        voteComment,
    };
}
