
import React from 'react';
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import SupportCircleCard from "@/components/support/SupportCircleCard";
import { Grid } from "@/components/ui/grid";
import { useSupportCircles } from "@/hooks/useSupportCircles";
import { Loader2 } from "lucide-react";
import { useTitle } from "@/hooks/use-title";

const SupportCircles = () => {
  useTitle("Support Circles | Silent Guardians");
  const { supportCircles, isLoading, joinCircle, isJoining } = useSupportCircles();

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
        title="Support Circles"
        description="Join a support circle to connect with others in similar situations"
        className="mb-8"
      />

      <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
        {supportCircles.map((circle) => (
          <SupportCircleCard
            key={circle.id}
            id={circle.id}
            name={circle.name}
            description={circle.description}
            memberCount={circle.memberCount}
            type={circle.type}
            lastActive={circle.lastActive}
            onJoin={joinCircle}
            isJoining={isJoining}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default SupportCircles;
