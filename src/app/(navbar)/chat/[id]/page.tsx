"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageList } from "@/components/chat/MessageList";
import { ChatWithAssistant, Message } from "@/types/assistant";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    isLoadingMessages,
    setIsLoadingMessages,
    isSendingMessage,
  } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);

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

        const chat: ChatWithAssistant = await response.json();
        setCurrentChat(chat);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId, currentChat?.id, setCurrentChat]);

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !currentChat) return;

      try {
        setIsLoadingMessages(true);
        setMessagesError(null);

        const response = await fetch(`/api/chats/${chatId}/messages`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const fetchedMessages: Message[] = await response.json();
        setMessages(fetchedMessages);

        // Check if we need to generate an AI response
        if (fetchedMessages.length > 0) {
          const lastMessage = fetchedMessages[fetchedMessages.length - 1];

          // If the last message is from user and there's no assistant response after it
          if (lastMessage.role === "user") {
            // Check if there's an assistant message after this user message
            const hasAssistantResponse = fetchedMessages.some(
              (msg, index) =>
                index > fetchedMessages.indexOf(lastMessage) &&
                msg.role === "assistant"
            );

            if (!hasAssistantResponse) {
              // Generate AI response
              try {
                const generateResponse = await fetch(
                  `/api/chats/${chatId}/generate-response`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (generateResponse.ok) {
                  const assistantMessage: Message =
                    await generateResponse.json();
                  setMessages([...fetchedMessages, assistantMessage]);
                } else {
                  console.error("Failed to generate AI response");
                }
              } catch (error) {
                console.error("Error generating AI response:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessagesError(
          error instanceof Error ? error.message : "Failed to load messages"
        );
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [chatId, currentChat, setMessages, setIsLoadingMessages]);

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
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          assistantName={currentChat.assistants?.name || "Assistant"}
          isLoading={isLoadingMessages || isSendingMessage}
          error={messagesError}
        />
      </div>
    </div>
  );
}
