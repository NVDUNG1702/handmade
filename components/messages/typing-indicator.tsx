"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  className?: string;
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3 p-3", className)}>
      {/* Avatar */}
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={users[0]?.avatar} />
        <AvatarFallback>
          {users[0]?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Typing bubble */}
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2 max-w-[70%]">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">
            {users.length === 1 
              ? `${users[0].name} đang nhập...`
              : users.length === 2
              ? `${users[0].name} và ${users[1].name} đang nhập...`
              : `${users[0].name} và ${users.length - 1} người khác đang nhập...`
            }
          </span>
          
          {/* Animated dots */}
          <div className="flex gap-1 ml-2">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
