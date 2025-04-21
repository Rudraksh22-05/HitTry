import React, { useState, useEffect } from 'react';
import { useThreads } from '@/hooks/useDiscussions';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { Grid } from "@/components/ui/grid";
import ThreadItem from './ThreadItem';
import * as Dialog from '@radix-ui/react-dialog';
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from '@/hooks/useContract';

interface ThreadListProps {
  circleId: string;
  onSelectThread: (threadId: string) => void;
}

const ThreadList = ({ circleId, onSelectThread }: ThreadListProps) => {
  const { threads, isLoading, createThread } = useThreads(circleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [isBlockchain, setIsBlockchain] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account, isConnecting, connectWallet, isRegistered, register } = useContract();

  // Verify that we have a valid circleId
  useEffect(() => {
    if (!circleId) {
      console.error('No circle ID provided');
      toast({
        title: "Error",
        description: "Invalid support circle. Please try again.",
        variant: "destructive",
      });
    }
  }, [circleId, toast]);

  const handleCreateThread = async () => {
    if (!threadTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your thread",
        variant: "destructive",
      });
      return;
    }

    if (!circleId) {
      toast({
        title: "Error",
        description: "Invalid support circle. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a thread",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    // Check wallet connection for blockchain threads
    if (isBlockchain) {
      if (!account) {
        toast({
          title: "Wallet connection required",
          description: "Please connect your wallet to create a blockchain thread",
          variant: "destructive",
        });
        return;
      }

      if (!isRegistered) {
        toast({
          title: "Registration required",
          description: "Please register your wallet to create a blockchain thread",
          variant: "destructive",
        });
        return;
      }

      if (!threadContent.trim()) {
        toast({
          title: "Content required",
          description: "Please add content to your blockchain thread",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsCreating(true);
    try {
      console.log('Creating thread with:', { circleId, title: threadTitle, content: isBlockchain ? threadContent : undefined });
      const thread = await createThread(
        threadTitle,
        isBlockchain ? threadContent : undefined
      );
      setIsDialogOpen(false);
      setThreadTitle('');
      setThreadContent('');
      setIsBlockchain(false);
      onSelectThread(thread.id);
      
      toast({
        title: "Success",
        description: "Thread created successfully",
      });
    } catch (error: any) {
      console.error('Failed to create thread:', error);
      
      if (error?.message?.includes('foreign key constraint')) {
        toast({
          title: "Error",
          description: "Invalid support circle. Please try again.",
          variant: "destructive",
        });
      } else if (error?.message?.includes('blockchain_id')) {
        toast({
          title: "Feature not available",
          description: "Blockchain threads are not available at the moment. Please try creating a regular thread.",
          variant: "destructive",
        });
        setIsBlockchain(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create thread. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    try {
      await register();
      toast({
        title: "Success",
        description: "Successfully registered your wallet",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Discussion Threads</CardTitle>
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Create New Discussion Thread
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mb-4">
                  Start a new anonymous discussion thread. Your identity will be protected while participating in discussions.
                </Dialog.Description>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thread-title">Thread Title</Label>
                    <Input
                      id="thread-title"
                      placeholder="What would you like to discuss?"
                      value={threadTitle}
                      onChange={(e) => setThreadTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="blockchain-mode"
                      checked={isBlockchain}
                      onCheckedChange={setIsBlockchain}
                    />
                    <Label htmlFor="blockchain-mode">Create as blockchain thread</Label>
                  </div>

                  {isBlockchain && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="thread-content">Thread Content</Label>
                        <Textarea
                          id="thread-content"
                          placeholder="Enter your thread content here. This will be stored on the blockchain."
                          value={threadContent}
                          onChange={(e) => setThreadContent(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {!account ? (
                        <Button
                          variant="outline"
                          onClick={handleConnectWallet}
                          disabled={isConnecting}
                          className="w-full"
                        >
                          {isConnecting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            'Connect Wallet'
                          )}
                        </Button>
                      ) : !isRegistered ? (
                        <Button
                          variant="outline"
                          onClick={handleRegister}
                          className="w-full"
                        >
                          Register Wallet
                        </Button>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Your wallet is connected and registered. Your thread content will be stored on the blockchain.
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Button
                    onClick={handleCreateThread}
                    disabled={
                      isCreating || 
                      !threadTitle.trim() || 
                      (isBlockchain && (!account || !isRegistered || !threadContent.trim()))
                    }
                  >
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Thread
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No discussion threads yet.</p>
              <p>Be the first to start a conversation!</p>
            </div>
          ) : (
            <Grid gap={4} className="mt-2">
              {threads.map((thread) => (
                <ThreadItem 
                  key={thread.id} 
                  thread={thread} 
                  onClick={() => onSelectThread(thread.id)} 
                />
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreadList;
