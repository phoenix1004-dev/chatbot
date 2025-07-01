"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageList } from "@/components/chat/MessageList";
import { ChatWithAssistant, Message } from "@/types/assistant";
import { MessageInput } from "@/components/chat/MessageInput";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  const {
    currentChat,
    setCurrentChat,
    selectedAssistant,
    refreshChats,
    isCreatingChat,
    setIsCreatingChat,
  } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    if (isCreatingChat) {
      setIsCreatingChat(false);
    }
  }, [isCreatingChat, setIsCreatingChat]);

  useEffect(() => {
    const fetchChatAndMessages = async () => {
      if (!chatId) return;

      try {
        setIsLoading(true);
        setError(null);
        setMessagesError(null);

        // Fetch chat details
        const chatResponse = await fetch(`/api/chats/${chatId}`);
        if (!chatResponse.ok) {
          if (chatResponse.status === 404) {
            throw new Error("Chat not found");
          }
          throw new Error("Failed to fetch chat");
        }
        const chat: ChatWithAssistant = await chatResponse.json();
        setCurrentChat(chat);

        // Fetch messages
        const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
        if (!messagesResponse.ok) {
          throw new Error("Failed to fetch messages");
        }
        const fetchedMessages: Message[] = await messagesResponse.json();
        setMessages(fetchedMessages);

        // Generate AI response if needed
        if (
          fetchedMessages.length > 0 &&
          fetchedMessages[fetchedMessages.length - 1].role === "user"
        ) {
          const generateResponse = await fetch(
            `/api/chats/${chatId}/generate-response`,
            { method: "POST" }
          );
          if (generateResponse.ok) {
            const assistantMessage: Message = await generateResponse.json();
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        setMessagesError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatAndMessages();
  }, [chatId, setCurrentChat]);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!selectedAssistant) {
      console.error("No assistant selected");
      return;
    }

    // Send message to existing chat
    if (!currentChat) {
      console.error("No current chat selected");
      return;
    }

    // Optimistically add user message to the UI
    const optimisticUserMessage = {
      id: `temp-${Date.now()}`,
      chat_id: currentChat.id,
      role: "user" as const,
      content: message,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, optimisticUserMessage]);
    setIsSendingMessage(true);

    try {
      const response = await fetch(`/api/chats/${currentChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const { userMessage, assistantMessage } = (await response.json()) as {
        userMessage: Message;
        assistantMessage: Message;
      };

      // Replace optimistic message with the real one and add assistant's message
      const newMessages = [
        ...messages.filter((m) => m.id !== optimisticUserMessage.id),
        userMessage,
        assistantMessage,
      ];
      setMessages(newMessages);

      // Refresh the sidebar to update the chat's updated_at timestamp
      refreshChats();

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Show error message to user
    } finally {
      setIsSendingMessage(false);
    }

    if (attachments && attachments.length > 0) {
      console.log(
        "Attachments:",
        attachments.map((f) => f.name)
      );
    }
  };

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
          isLoading={isSendingMessage}
          error={messagesError}
        />
      </div>
      <div className="absolute bottom-0 w-full">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={
            isLoading ||
            isCreatingChat ||
            isSendingMessage ||
            !selectedAssistant
          }
          placeholder={
            !selectedAssistant
              ? "Select an assistant to start chatting..."
              : isCreatingChat
              ? "Creating chat..."
              : isSendingMessage
              ? "Sending message..."
              : "Send a message..."
          }
        />
      </div>
    </div>
  );
}
