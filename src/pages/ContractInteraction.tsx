import { useState } from 'react';
import { useContract } from '@/hooks/useContract';
import { Tweet } from '@/lib/blockchain/contract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ContractInteraction() {
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
        addComment,
        getComment,
        getCommentsCount,
        voteComment,
        viewTweet
    } = useContract();

    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('tweets');

    // States for tweets
    const [tweetContent, setTweetContent] = useState('');
    const [tweetId, setTweetId] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [currentTweet, setCurrentTweet] = useState<Tweet | null>(null);
    const [isLoadingTweet, setIsLoadingTweet] = useState(false);

    // States for comments
    const [commentContent, setCommentContent] = useState('');
    const [commentTweetId, setCommentTweetId] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);

    const handleCreateTweet = async () => {
        if (!tweetContent.trim()) return;
        try {
            setIsPosting(true);
            await createTweet(tweetContent);
            toast({ title: "Success", description: "Tweet created successfully!" });
            setTweetContent('');
        } catch (err) {
            toast({ 
                title: "Error", 
                description: "Failed to create tweet", 
                variant: "destructive" 
            });
        } finally {
            setIsPosting(false);
        }
    };

    const handleViewTweet = async () => {
        if (!tweetId) return;
        try {
            setIsLoadingTweet(true);
            const tweet = await getTweet(parseInt(tweetId));
            if (tweet) {
                setCurrentTweet(tweet);
                await viewTweet(parseInt(tweetId));
            }
        } catch (err) {
            toast({ 
                title: "Error", 
                description: "Failed to load tweet", 
                variant: "destructive" 
            });
        } finally {
            setIsLoadingTweet(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentContent.trim() || !commentTweetId) return;
        try {
            setIsPostingComment(true);
            await addComment(parseInt(commentTweetId), commentContent);
            toast({ title: "Success", description: "Comment added successfully!" });
            setCommentContent('');
            setCommentTweetId('');
        } catch (err) {
            toast({ 
                title: "Error", 
                description: "Failed to add comment", 
                variant: "destructive" 
            });
        } finally {
            setIsPostingComment(false);
        }
    };

    if (!account) {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Connect Your Wallet</CardTitle>
                        <CardDescription>
                            Connect your wallet to interact with the smart contract
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={connectWallet} 
                            disabled={isConnecting}
                            className="w-full"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                'Connect Wallet'
                            )}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isRegistered) {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Register Account</CardTitle>
                        <CardDescription>
                            Register your account to start interacting with the smart contract
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={register} className="w-full">Register</Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Smart Contract Interaction</CardTitle>
                    <CardDescription>
                        Connected Account: <Badge variant="outline">{account}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="tweets">Tweets</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tweets" className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Create Tweet</h3>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tweetContent}
                                            onChange={(e) => setTweetContent(e.target.value)}
                                            placeholder="What's happening?"
                                            disabled={isPosting}
                                        />
                                        <Button 
                                            onClick={handleCreateTweet} 
                                            disabled={isPosting || !tweetContent.trim()}
                                        >
                                            {isPosting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-2">View Tweet</h3>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            value={tweetId}
                                            onChange={(e) => setTweetId(e.target.value)}
                                            placeholder="Enter tweet ID"
                                            disabled={isLoadingTweet}
                                        />
                                        <Button 
                                            onClick={handleViewTweet} 
                                            disabled={isLoadingTweet || !tweetId}
                                        >
                                            {isLoadingTweet ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'View'
                                            )}
                                        </Button>
                                    </div>

                                    {currentTweet && (
                                        <Card className="mt-4">
                                            <CardContent className="pt-6">
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Author: {currentTweet.author}
                                                </p>
                                                <p className="mb-2">{currentTweet.content}</p>
                                                <div className="flex gap-4 text-sm text-gray-500">
                                                    <span>Views: {currentTweet.viewCount}</span>
                                                    <span>
                                                        Status: {currentTweet.isDeleted ? 'Deleted' : 'Active'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="comments" className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Add Comment</h3>
                                <div className="space-y-2">
                                    <Input
                                        type="number"
                                        value={commentTweetId}
                                        onChange={(e) => setCommentTweetId(e.target.value)}
                                        placeholder="Tweet ID"
                                        disabled={isPostingComment}
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder="Your comment"
                                            disabled={isPostingComment}
                                        />
                                        <Button 
                                            onClick={handleAddComment} 
                                            disabled={isPostingComment || !commentContent.trim() || !commentTweetId}
                                        >
                                            {isPostingComment ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <MessageSquare className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
