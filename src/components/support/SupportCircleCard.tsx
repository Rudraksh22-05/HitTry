
import { Calendar, MessageSquare, Users, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UseMutateFunction } from "@tanstack/react-query";

interface SupportCircleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  name: string;
  description: string;
  type: string;
  memberCount: number;
  lastActive: string;
  onJoin?: UseMutateFunction<{ success: boolean }, Error, string, unknown>;
  isJoining?: boolean;
}

export default function SupportCircleCard({
  id,
  name,
  description,
  type,
  memberCount,
  lastActive,
  onJoin,
  isJoining,
  className,
  ...props
}: SupportCircleCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className="flex gap-1 text-sm">
            <Badge variant="secondary">{type}</Badge>
          </div>
        </div>
        <CardDescription className="pt-1.5">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{memberCount} members</span>
          <span>•</span>
          <Calendar className="h-4 w-4" />
          <span>
            Active{" "}
            {formatDistanceToNow(new Date(lastActive), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-5">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/discussions/${id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/chat/${id}`}>
            Join Chat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
