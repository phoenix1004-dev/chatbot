"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Chat } from "@/types/assistant";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { currentChat, setCurrentChat } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) return;

      // If we already have the current chat and it matches, no need to fetch
      if (currentChat?.id === chatId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/chats/${chatId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chat not found");
          }
          throw new Error("Failed to fetch chat");
        }

        const chat: Chat = await response.json();
        setCurrentChat(chat);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId, currentChat?.id, setCurrentChat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 text-red-200 rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg">Chat not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-gray-800 p-4">
        <h1 className="text-white text-xl font-medium">{currentChat.title}</h1>
        <p className="text-gray-400 text-sm">
          Created {new Date(currentChat.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Placeholder for chat messages */}
          <div className="text-center text-gray-500 mt-8">
            <p>This is where chat messages will appear.</p>
            <p className="text-sm mt-2">
              Chat functionality will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
