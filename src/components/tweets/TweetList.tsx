import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import { Tweet } from '@/lib/blockchain/contract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function TweetList() {
    const {
        account,
        isConnecting,
        error,
        isRegistered,
        connectWallet,
        register,
        createTweet,
        getTweet,
        getTweetCount,
    } = useContract();

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [newTweetContent, setNewTweetContent] = useState('');
    const [posting, setPosting] = useState(false);

    // Load tweets
    const loadTweets = async () => {
        try {
            setLoading(true);
            const count = await getTweetCount();
            const tweetPromises = [];
            for (let i = count - 1; i >= Math.max(0, count - 10); i--) {
                tweetPromises.push(getTweet(i));
            }
            const loadedTweets = await Promise.all(tweetPromises);
            setTweets(loadedTweets.filter(tweet => !tweet.isDeleted));
        } catch (err) {
            console.error('Error loading tweets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load tweets on mount and when account changes
    useEffect(() => {
        if (account && isRegistered) {
            loadTweets();
        }
    }, [account, isRegistered]);

    // Handle posting new tweet
    const handlePostTweet = async () => {
        if (!newTweetContent.trim()) return;
        
        try {
            setPosting(true);
            await createTweet(newTweetContent);
            setNewTweetContent('');
            await loadTweets(); // Reload tweets after posting
        } catch (err) {
            console.error('Error posting tweet:', err);
        } finally {
            setPosting(false);
        }
    };

    if (!account) {
        return (
            <div className="flex flex-col items-center gap-4 p-4">
                <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
                <Button onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                        </>
                    ) : (
                        'Connect Wallet'
                    )}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        );
    }

    if (!isRegistered) {
        return (
            <div className="flex flex-col items-center gap-4 p-4">
                <h2 className="text-2xl font-bold">Register to Continue</h2>
                <Button onClick={register}>Register</Button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex gap-2">
                <Input
                    value={newTweetContent}
                    onChange={(e) => setNewTweetContent(e.target.value)}
                    placeholder="What's happening?"
                    disabled={posting}
                />
                <Button onClick={handlePostTweet} disabled={posting || !newTweetContent.trim()}>
                    {posting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        'Post'
                    )}
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {tweets.map((tweet) => (
                        <Card key={tweet.timestamp} className="p-4">
                            <p className="text-sm text-gray-500">
                                {new Date(tweet.timestamp * 1000).toLocaleString()}
                            </p>
                            <p className="text-sm font-mono mb-2">
                                From: {tweet.author}
                            </p>
                            <p>{tweet.content}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Views: {tweet.viewCount}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
