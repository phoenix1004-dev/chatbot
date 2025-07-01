"use client";

import React from "react";
import { Message } from "@/types/assistant";

interface MessageBubbleProps {
  message: Message;
  assistantName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  assistantName = "Assistant",
}) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-gray-800 text-gray-400 text-sm rounded-full max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {isUser ? "U" : assistantName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          {/* Sender name and timestamp */}
          <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-sm font-medium text-gray-300">
              {isUser ? "You" : assistantName}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.created_at)}
            </span>
          </div>

          {/* Message bubble */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-gray-800 text-gray-100 rounded-bl-md"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
