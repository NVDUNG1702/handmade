"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Smile,
  X,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageResponse } from "@/lib/types-message";

interface MessageInputProps {
  onSendMessage: (content: string, type?: string, parentId?: string) => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  replyingTo?: MessageResponse | null;
  onCancelReply?: () => void;
  className?: string;
}

export function MessageInput({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
  replyingTo,
  onCancelReply,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setMessage(value);

      // Handle typing indicators
      if (value.trim() && !isTyping) {
        setIsTyping(true);
        onStartTyping?.();
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onStopTyping?.();
      }, 1000);
    },
    [isTyping, onStartTyping, onStopTyping]
  );

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    // Send message
    onSendMessage(trimmed, "text", replyingTo?._id);

    // Clear input and states
    setMessage("");
    setIsTyping(false);
    onStopTyping?.();
    onCancelReply?.();

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back to input
    textareaRef.current?.focus();
  }, [message, disabled, onSendMessage, replyingTo, onStopTyping, onCancelReply]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleAttachment = useCallback(() => {
    // TODO: Implement file upload
    console.log("Attach file");
  }, []);

  const handleEmoji = useCallback(() => {
    // TODO: Implement emoji picker
    console.log("Add emoji");
  }, []);

  return (
    <div className={cn("border-t bg-background/95 backdrop-blur-sm px-4 py-3 shadow-sm", className)}>
      {/* Reply indicator */}
      {replyingTo && (
        <div className="mb-2 p-2.5 bg-primary/5 border border-primary/20 rounded-lg flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground mb-1">
              Trả lời {replyingTo.sender?.full_name || replyingTo.sender?.username}
            </div>
            <div className="text-sm truncate">
              {replyingTo.content}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-2"
            onClick={onCancelReply}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0"
          onClick={handleAttachment}
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-32 resize-none pr-12 rounded-xl border-2 focus-visible:ring-1"
            rows={1}
          />

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={handleEmoji}
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="h-10 w-10 p-0 flex-shrink-0 rounded-xl"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* File upload preview (placeholder) */}
      {/* TODO: Add file upload preview */}
    </div>
  );
}
