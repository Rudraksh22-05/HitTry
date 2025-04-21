
import React, { useState } from 'react';
import { useThreads } from '@/hooks/useDiscussions';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { Grid } from "@/components/ui/grid";
import ThreadItem from './ThreadItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ThreadListProps {
  circleId: string;
  onSelectThread: (threadId: string) => void;
}

const ThreadList = ({ circleId, onSelectThread }: ThreadListProps) => {
  const { threads, isLoading, createThread } = useThreads(circleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateThread = async () => {
    if (!threadTitle.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a thread",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    
    setIsCreating(true);
    try {
      const thread = await createThread(threadTitle);
      setIsDialogOpen(false);
      setThreadTitle('');
      onSelectThread(thread.id);
    } catch (error) {
      console.error('Failed to create thread:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Discussion Threads</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Thread
          </Button>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Discussion Thread</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="thread-title">Thread Title</Label>
              <Input
                id="thread-title"
                placeholder="What would you like to discuss?"
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Your identity will be kept anonymous in discussions. Others will only see your
              anonymous ID, not your real account information.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleCreateThread}
              disabled={isCreating || !threadTitle.trim()}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Thread
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThreadList;
