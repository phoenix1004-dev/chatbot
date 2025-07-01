"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "@/types/assistant";
import { MessageBubble } from "./MessageBubble";
import { ThreeDotsLoading } from "@/components/ui/ThreeDotsLoading";

interface MessageListProps {
  messages: Message[];
  assistantName?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  assistantName = "Assistant",
  isLoading = false,
  error = null,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">
            Failed to load messages
          </div>
          <div className="text-gray-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="text-lg mb-2">Start a conversation</div>
          <div className="text-sm">
            Send a message to begin chatting with {assistantName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              assistantName={assistantName}
            />
          ))}

          {/* Loading indicator for new messages */}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex max-w-[80%]">
                {/* Avatar */}
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-sm font-medium">
                    {assistantName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-300">
                      {assistantName}
                    </span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-800 rounded-2xl rounded-bl-md">
                    <ThreeDotsLoading />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
