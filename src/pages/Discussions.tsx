
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { useParams } from 'react-router-dom';
import { useTitle } from "@/hooks/use-title";
import ThreadList from '@/components/discussions/ThreadList';
import ThreadView from '@/components/discussions/ThreadView';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

const Discussions = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  // Fetch circle details
  const { data: circle, isLoading } = useQuery({
    queryKey: ['circle', circleId],
    queryFn: () => circleId ? api.getSupportCircleById(circleId) : null,
    enabled: !!circleId
  });
  
  useTitle(`${circle?.name || 'Circle'} Discussions | Silent Guardians`);

  if (!circleId) {
    return (
      <Container className="py-8">
        <Heading 
          title="Invalid Circle" 
          description="No circle ID was provided."
        />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Heading 
        title={circle ? `${circle.name} Discussions` : 'Circle Discussions'} 
        description="Discuss anonymously with others in this support circle"
        className="mb-8"
      />

      {selectedThreadId ? (
        <ThreadView 
          threadId={selectedThreadId} 
          circleId={circleId}
          onBack={() => setSelectedThreadId(null)}
        />
      ) : (
        <ThreadList 
          circleId={circleId} 
          onSelectThread={setSelectedThreadId} 
        />
      )}
    </Container>
  );
};

export default Discussions;
